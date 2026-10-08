// Prepara la base de datos y crea la cuenta del administrador.
// Uso: npm run db:setup
// Se puede correr más de una vez: no borra nada de lo que ya existe.
import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const dbName = process.env.DB_NAME || 'syncra'
if (!/^\w+$/.test(dbName)) throw new Error('DB_NAME solo puede tener letras, números y guiones bajos.')

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  multipleStatements: true,
  timezone: 'Z',
})

await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
await conn.query(`USE \`${dbName}\``)
await conn.query(await readFile(new URL('../sql/schema.sql', import.meta.url), 'utf8'))
console.log(`✔ Base "${dbName}" y tablas listas.`)

// Cargamos el evento que hoy está fijo en la web, para que no desaparezca.
const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM events')
if (total === 0) {
  const { EVENTS } = await import('../../frontend/src/assets/data/events.js')
  for (const [i, e] of EVENTS.entries()) {
    await conn.query('INSERT INTO events SET ?', [
      {
        name: e.name,
        kind: e.kind || '',
        date: e.date || '',
        place: e.place || '',
        text: e.text || '',
        videos: e.videos ? JSON.stringify(e.videos) : null,
        position: i,
      },
    ])
  }
  console.log(`✔ Se cargaron ${EVENTS.length} evento(s) de la web.`)
}

const [[{ admins }]] = await conn.query("SELECT COUNT(*) AS admins FROM users WHERE role = 'admin' AND deleted_at IS NULL")
if (admins > 0) {
  console.log('✔ Ya hay un administrador. No se creó otro.')
} else {
  let [name, email, password] = process.argv.slice(2)
  if (!name || !email || !password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    console.log('\nVamos a crear la cuenta del administrador.')
    name = await rl.question('Nombre: ')
    email = await rl.question('Email: ')
    password = await rl.question('Contraseña (mínimo 8 caracteres): ')
    rl.close()
  }
  if (!name?.trim() || !email?.includes('@') || !password || password.length < 8) {
    console.error('✘ Datos incompletos: nombre, email válido y contraseña de 8+ caracteres.')
    process.exit(1)
  }
  await conn.query('INSERT INTO users SET ?', [
    {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: await bcrypt.hash(password, 12),
      role: 'admin',
    },
  ])
  console.log(`✔ Administrador "${name.trim()}" creado. Ya podés entrar en /panel.`)
}

await conn.end()
