import { Router } from 'express'
import { getUploadSignature } from '../controllers/media.controller.js'
import { rateLimit } from '../middleware/rateLimit.middleware.js'

const router = Router()

// Permiso para subir un archivo a Cloudinary (uno por archivo).
router.post(
  '/firma',
  rateLimit({ max: 200, windowMs: 60 * 60 * 1000, message: 'Demasiadas subidas seguidas. Probá en un rato.' }),
  getUploadSignature,
)

export default router
