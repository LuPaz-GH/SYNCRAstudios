import { clientIp } from '../utils/request.js'

// Limita cuántos pedidos puede hacer una misma IP en un período (contra spam).
export function rateLimit({ max, windowMs, message }) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const ip = clientIp(req)
    const times = (hits.get(ip) || []).filter((t) => now - t < windowMs)
    if (times.length >= max) return res.status(429).json({ error: message })
    hits.set(ip, [...times, now])
    next()
  }
}
