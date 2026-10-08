import * as authService from '../services/auth.service.js'
import { clientIp } from '../utils/request.js'
import { setSessionCookie } from '../utils/session.js'

export async function login(req, res) {
  const { email, password } = req.body || {}
  const { user, token } = await authService.login(email, password, clientIp(req))
  setSessionCookie(req, res, token, authService.SESSION_MAX_AGE)
  res.json({ user })
}

export function logout(req, res) {
  setSessionCookie(req, res, '', 0)
  res.json({ ok: true })
}

export function me(req, res) {
  res.json({ user: authService.publicUser(req.user) })
}
