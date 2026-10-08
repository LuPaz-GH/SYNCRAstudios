// Llave de emergencia: cambia la contraseña de cualquier usuario desde la terminal.
// Sirve, por ejemplo, si el único administrador se olvidó la suya.
//
// Uso:  npm run user:password          (base de tu compu)
//       npm run user:password:cloud    (base online)
// También acepta los datos directo:  npm run user:password -- email@ejemplo.com NuevaClave123
import { createInterface } from 'node:readline/promises'
import { pool, query } from '../config/db.js'
import { audit } from '../services/audit.service.js'
import { hashPassword } from '../services/auth.service.js'

const ROLES_LABELS = { admin: 'Administrador', empleado: 'Empleado' }

const users = await query('SELECT id, name, email, role, deleted_at FROM users ORDER BY role, name')
console.log(`\nUsuarios en la base "${process.env.DB_NAME || 'syncra'}":\n`)
for (const u of users) {
  console.log(`  ${u.email}  ·  ${u.name}  ·  ${ROLES_LABELS[u.role]}${u.deleted_at ? '  ·  (en la papelera)' : ''}`)
}
console.log('')

let [email, password] = process.argv.slice(2)
if (!email || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  email = await rl.question('Email del usuario: ')
  password = await rl.question('Nueva contraseña (mínimo 8 caracteres): ')
  rl.close()
}

email = String(email || '').trim().toLowerCase()
const user = users.find((u) => u.email === email)
if (!user) {
  console.error(`✘ No existe ningún usuario con el email "${email}".`)
  process.exit(1)
}
if (!password || password.length < 8) {
  console.error('✘ La contraseña tiene que tener al menos 8 caracteres.')
  process.exit(1)
}

await query('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(password), user.id])
await audit(null, 'editar', 'usuarios', user.id, `Se cambió la contraseña de "${user.name}" desde la terminal (llave de emergencia)`)
console.log(`✔ Listo: ${user.name} ya puede entrar con la contraseña nueva.`)
if (user.deleted_at) console.log('  Ojo: este usuario está en la papelera. Restauralo desde el panel para que pueda entrar.')

await pool.end()
