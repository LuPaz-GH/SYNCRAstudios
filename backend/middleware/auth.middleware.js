import { userFromToken } from '../services/auth.service.js'
import { readCookie } from '../utils/request.js'
import { SESSION_COOKIE } from '../utils/session.js'

// Exige sesión iniciada. Deja el usuario en req.user.
export async function requireUser(req, res, next) {
  req.user = await userFromToken(readCookie(req, SESSION_COOKIE))
  next()
}

// Exige que la persona sea administradora. Va después de requireUser.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede hacer esto.' })
  next()
}
