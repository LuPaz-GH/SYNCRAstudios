export const SESSION_COOKIE = 'syncra_session'

// Guarda (o borra, con maxAge 0) la cookie de sesión. HttpOnly: el código de la página no la puede leer.
export function setSessionCookie(req, res, token, maxAge) {
  const secure = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https'
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`,
  )
}
