import { query } from '../config/db.js'

// Registro de actividad: quién hizo qué, cuándo y cómo estaba antes/después.

export async function audit(userId, action, entity, entityId, summary, before = null, after = null) {
  await query(
    'INSERT INTO audit_log (user_id, action, entity, entity_id, summary, before_data, after_data) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      userId,
      action,
      entity,
      entityId,
      String(summary).slice(0, 255),
      before && JSON.stringify(before),
      after && JSON.stringify(after),
    ],
  )
}

// Fecha que llega por la URL (ej. "2026-10-15T03:00:00.000Z"); si no es válida, se ignora.
const toDate = (value) => {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

export async function activity(user, { userId, entity, action, search, from, to, page = 1 } = {}) {
  const where = []
  const params = []
  // El administrador ve todo; cada empleado ve solo su propia actividad.
  if (user.role !== 'admin') {
    where.push('a.user_id = ?')
    params.push(user.id)
  } else if (userId) {
    where.push('a.user_id = ?')
    params.push(userId)
  }
  if (entity) {
    where.push('a.entity = ?')
    params.push(entity)
  }
  if (action) {
    where.push('a.action = ?')
    params.push(action)
  }
  // Desde / Hasta: "hasta" ya viene como el comienzo del día siguiente.
  if (toDate(from)) {
    where.push('a.created_at >= ?')
    params.push(toDate(from))
  }
  if (toDate(to)) {
    where.push('a.created_at < ?')
    params.push(toDate(to))
  }
  // Buscador: en el resumen del movimiento y en el nombre de quien lo hizo.
  const words = String(search || '').trim().slice(0, 100)
  if (words) {
    where.push('(a.summary LIKE ? OR u.name LIKE ?)')
    const like = `%${words.replace(/[\\%_]/g, '\\$&')}%`
    params.push(like, like)
  }
  const size = 50
  const offset = (Math.max(1, Number(page) || 1) - 1) * size
  const filter = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const rows = await query(
    `SELECT a.*, u.name AS user_name, u.role AS user_role
     FROM audit_log a LEFT JOIN users u ON u.id = a.user_id
     ${filter}
     ORDER BY a.id DESC LIMIT ? OFFSET ?`,
    [...params, size + 1, offset],
  )
  return { rows: rows.slice(0, size), hasMore: rows.length > size }
}
