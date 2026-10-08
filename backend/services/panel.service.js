import { query } from '../config/db.js'

// Datos generales del panel: números de la pantalla de inicio y lista del equipo.

export async function summary(userId) {
  const [counts] = await query(
    `SELECT
      (SELECT COUNT(*) FROM events WHERE deleted_at IS NULL) AS eventos,
      (SELECT COUNT(*) FROM messages WHERE deleted_at IS NULL AND status = 'nuevo') AS mensajes_nuevos,
      (SELECT COUNT(*) FROM tasks WHERE deleted_at IS NULL AND status <> 'hecha') AS tareas_abiertas,
      (SELECT COUNT(*) FROM tasks WHERE deleted_at IS NULL AND status <> 'hecha' AND assigned_to = ?) AS mis_tareas,
      (SELECT COUNT(*) FROM bookings WHERE deleted_at IS NULL AND status IN ('consulta', 'confirmado')
        AND date BETWEEN DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) AND DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) + INTERVAL 30 DAY) AS proximos_eventos`,
    [userId],
  )
  return counts
}

// Lista corta de usuarios para asignar tareas (la ven todos).
export function team() {
  return query('SELECT id, name FROM users WHERE deleted_at IS NULL ORDER BY name')
}
