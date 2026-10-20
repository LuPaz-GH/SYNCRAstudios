// Qué se puede gestionar desde el panel y qué campos tiene cada cosa.
// Tipos: text (texto corto), long (texto largo), int, bool (sí/no), date, json, enum, user (id de un usuario),
// media (fotos, videos y links de Instagram: ver utils/media.js).
export const RESOURCES = {
  eventos: {
    table: 'events',
    label: 'evento',
    title: 'name',
    order: 't.position ASC, t.id ASC',
    fields: {
      name: { type: 'text', max: 160, required: true },
      kind: { type: 'text', max: 80 },
      date: { type: 'text', max: 80 },
      place: { type: 'text', max: 160 },
      text: { type: 'long', required: true },
      videos: { type: 'media' }, // la columna se llama así, pero guarda fotos, videos e Instagram
      position: { type: 'int' },
    },
  },
  mensajes: {
    table: 'messages',
    label: 'mensaje',
    title: 'name',
    order: 't.created_at DESC',
    fields: {
      name: { type: 'text', max: 120, required: true },
      org: { type: 'text', max: 160 },
      email: { type: 'text', max: 190 },
      service: { type: 'text', max: 160 },
      message: { type: 'long', required: true },
      status: { type: 'enum', values: ['nuevo', 'en_curso', 'respondido'] },
      notes: { type: 'long' },
    },
  },
  agenda: {
    table: 'bookings',
    label: 'evento agendado',
    title: 'event_name',
    // Primero los próximos (del más cercano al más lejano), después los pasados (del más reciente).
    // Fecha de hoy en hora argentina (UTC-3).
    order:
      "t.date < DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR), CASE WHEN t.date >= DATE(UTC_TIMESTAMP() - INTERVAL 3 HOUR) THEN t.date END ASC, t.date DESC, t.start_time ASC",
    fields: {
      event_name: { type: 'text', max: 200, required: true },
      client: { type: 'text', max: 160, required: true },
      date: { type: 'date', required: true },
      start_time: { type: 'time' },
      place: { type: 'text', max: 200 },
      modality: { type: 'enum', values: ['presencial', 'virtual', 'hibrido'] },
      service: { type: 'text', max: 160 },
      status: { type: 'enum', values: ['consulta', 'confirmado', 'realizado', 'cancelado'] },
      contact: { type: 'text', max: 200 },
      assigned_to: { type: 'user' },
      notes: { type: 'long' },
      published: { type: 'bool' },
      public_text: { type: 'text', max: 600 },
      media: { type: 'media' },
    },
  },
  tareas: {
    table: 'tasks',
    label: 'tarea',
    title: 'title',
    order: "FIELD(t.status, 'pendiente', 'en_curso', 'hecha'), t.due_date IS NULL, t.due_date ASC, t.id DESC",
    fields: {
      title: { type: 'text', max: 200, required: true },
      description: { type: 'long' },
      status: { type: 'enum', values: ['pendiente', 'en_curso', 'hecha'] },
      due_date: { type: 'date' },
      assigned_to: { type: 'user' },
    },
  },
  usuarios: {
    table: 'users',
    label: 'usuario',
    title: 'name',
    order: 't.role ASC, t.name ASC',
    adminOnly: true,
    fields: {
      name: { type: 'text', max: 120, required: true },
      email: { type: 'text', max: 190, required: true },
      role: { type: 'enum', values: ['admin', 'empleado'] },
    },
  },
}
