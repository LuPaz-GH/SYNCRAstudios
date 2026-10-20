import { query } from '../config/db.js'
import { HttpError } from '../utils/HttpError.js'
import { audit } from './audit.service.js'

// Lo que usa la web pública: eventos y mensajes del formulario de contacto.

export function listEvents() {
  return query(
    'SELECT id, name, kind, date, place, text, videos FROM events WHERE deleted_at IS NULL ORDER BY position ASC, id ASC',
  )
}

// Próximos eventos de la Agenda marcados "Publicar en la web".
// Solo datos públicos: nunca cliente, contacto, notas ni responsable. Desde hoy (hora argentina), sin cancelados.
export function listUpcoming() {
  return query(
    `SELECT id, event_name AS name, date, start_time, place, modality, public_text AS text, media
     FROM bookings
     WHERE deleted_at IS NULL AND published = 1 AND status <> 'cancelado'
       AND date >= DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR)
     ORDER BY date ASC, start_time ASC`,
  )
}

export async function saveContactMessage(body) {
  const name = String(body.name || '').trim().slice(0, 120)
  if (!name) throw new HttpError(400, 'Falta el nombre.')

  // Email opcional, para poder responder por correo. Si no tiene forma de email, se descarta.
  const email = String(body.email || '').trim().toLowerCase().slice(0, 190)

  const result = await query('INSERT INTO messages SET ?', [
    {
      name,
      org: String(body.org || '').trim().slice(0, 160),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '',
      service: String(body.service || '').trim().slice(0, 160),
      message: String(body.message || '').trim().slice(0, 5000),
      notes: '',
    },
  ])
  await audit(null, 'crear', 'mensajes', result.insertId, `Llegó un mensaje de "${name}" desde la web`)
}
