import { createHash } from 'node:crypto'
import { HttpError } from '../utils/HttpError.js'

// Fotos y videos del panel: se suben directo del navegador a Cloudinary.
// El servidor solo firma cada subida, así la clave secreta nunca sale de acá
// y solo puede subir quien tiene sesión en el panel.

const FOLDER = 'syncra/eventos'

// Cada video se convierte apenas se sube a un MP4 que reproduce cualquier navegador
// (los del iPhone vienen en un formato que Chrome no siempre lee). La web usa esa versión.
const VIDEO_TRANSFORM = 'q_auto,vc_h264'

const PARAMS = {
  image: { allowed_formats: 'jpg,jpeg,png,webp,gif,heic,heif,avif' },
  video: { allowed_formats: 'mp4,mov,m4v,webm', eager: `${VIDEO_TRANSFORM}/mp4`, eager_async: 'true' },
}

export function uploadSignature(kind) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !secret) {
    throw new HttpError(503, 'Todavía no está configurado dónde guardar las fotos y videos (Cloudinary).')
  }
  if (!PARAMS[kind]) throw new HttpError(400, 'Solo se pueden subir fotos o videos.')

  const params = { ...PARAMS[kind], folder: FOLDER, timestamp: Math.floor(Date.now() / 1000) }
  // Cloudinary pide los parámetros en orden alfabético, unidos con "&", más la clave secreta.
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  const signature = createHash('sha1').update(toSign + secret).digest('hex')

  return { cloudName, apiKey, signature, ...params }
}
