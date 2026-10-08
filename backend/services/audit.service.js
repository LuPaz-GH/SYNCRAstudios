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

export async function activity(user, { userId, entity, action, page = 1 } = {}) {
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
