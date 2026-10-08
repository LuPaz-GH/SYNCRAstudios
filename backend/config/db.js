import mysql from 'mysql2/promise'

// Conexión a MySQL. Los datos salen del archivo .env (ver .env.example).
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'syncra',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  connectionLimit: 5,
  timezone: 'Z',
  dateStrings: ['DATE'],
})

// Guardamos todas las fechas en UTC; el panel las muestra en la hora de quien mira.
pool.on('connection', (conn) => {
  conn.query("SET time_zone = '+00:00'")
})

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}
