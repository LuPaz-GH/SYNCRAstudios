import { Router } from 'express'
import { getEvents, postMessage } from '../controllers/public.controller.js'
import { rateLimit } from '../middleware/rateLimit.middleware.js'

// Rutas que usa la web pública (no piden sesión).
const router = Router()

router.get('/eventos', getEvents)
router.post(
  '/mensajes',
  rateLimit({ max: 5, windowMs: 60 * 60 * 1000, message: 'Demasiados mensajes. Probá más tarde.' }),
  postMessage,
)

export default router
