import { query } from '../config/db.js'
import { HttpError } from '../utils/HttpError.js'
import { audit } from './audit.service.js'

// Lo que usa la web pública: eventos y mensajes del formulario de contacto.

export function listEvents() {
  return query(
    'SELECT id, name, kind, date, place, text, videos FROM events WHERE deleted_at IS NULL ORDER BY position ASC, id ASC',
  )
}

export async function saveContactMessage(body) {
  const name = String(body.name || '').trim().slice(0, 120)
  if (!name) throw new HttpError(400, 'Falta el nombre.')

  const result = await query('INSERT INTO messages SET ?', [
    {
      name,
      org: String(body.org || '').trim().slice(0, 160),
      service: String(body.service || '').trim().slice(0, 160),
      message: String(body.message || '').trim().slice(0, 5000),
      notes: '',
    },
  ])
  await audit(null, 'crear', 'mensajes', result.insertId, `Llegó un mensaje de "${name}" desde la web`)
}
