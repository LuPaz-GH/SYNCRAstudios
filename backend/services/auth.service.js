import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'
import { HttpError } from '../utils/HttpError.js'
import { audit } from './audit.service.js'

export const SESSION_MAX_AGE = 8 * 60 * 60 // 8 horas

function secret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 32) throw new Error('Falta JWT_SECRET en .env (mínimo 32 caracteres).')
  return s
}

export const hashPassword = (password) => bcrypt.hash(password, 12)

export function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// Intentos de login fallidos por IP, para frenar a quien prueba contraseñas.
const failed = new Map()
const MAX_FAILS = 8
const LOCK_MS = 15 * 60 * 1000

function isLocked(ip) {
  const entry = failed.get(ip)
  if (!entry) return false
  if (Date.now() - entry.first > LOCK_MS) {
    failed.delete(ip)
    return false
  }
  return entry.count >= MAX_FAILS
}

function registerFail(ip) {
  const entry = failed.get(ip)
  if (!entry || Date.now() - entry.first > LOCK_MS) failed.set(ip, { count: 1, first: Date.now() })
  else entry.count++
}

// Comprueba email y contraseña. Devuelve el usuario y el token de sesión.
export async function login(email, password, ip) {
  if (isLocked(ip)) throw new HttpError(429, 'Demasiados intentos. Probá de nuevo en 15 minutos.')

  const [user] = await query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [
    String(email || '').trim().toLowerCase(),
  ])
  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) {
    registerFail(ip)
    throw new HttpError(401, 'Email o contraseña incorrectos.')
  }

  failed.delete(ip)
  await audit(user.id, 'login', 'sesion', user.id, `${user.name} inició sesión`)
  const token = jwt.sign({ uid: user.id }, secret(), { expiresIn: SESSION_MAX_AGE })
  return { user: publicUser(user), token }
}

// Lee el token y vuelve a buscar el usuario en la base en cada pedido,
// así un usuario borrado o con el rol cambiado pierde el acceso al instante.
export async function userFromToken(token) {
  if (!token) throw new HttpError(401, 'Tenés que iniciar sesión.')

  let payload
  try {
    payload = jwt.verify(token, secret())
  } catch {
    throw new HttpError(401, 'La sesión venció. Volvé a iniciar sesión.')
  }

  const [user] = await query('SELECT id, name, email, role FROM users WHERE id = ? AND deleted_at IS NULL', [
    payload.uid,
  ])
  if (!user) throw new HttpError(401, 'Tu usuario ya no tiene acceso.')
  return user
}
