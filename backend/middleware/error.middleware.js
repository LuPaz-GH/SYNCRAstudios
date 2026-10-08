import { HttpError } from '../utils/HttpError.js'

// Convierte cualquier error en una respuesta clara para el panel.
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Datos inválidos.' })
  console.error(err)
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' })
}
