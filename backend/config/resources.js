// Qué se puede gestionar desde el panel y qué campos tiene cada cosa.
// Tipos: text (texto corto), long (texto largo), int, date, json, enum, user (id de un usuario).
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
      videos: { type: 'json' },
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
      service: { type: 'text', max: 160 },
      message: { type: 'long', required: true },
      status: { type: 'enum', values: ['nuevo', 'en_curso', 'respondido'] },
      notes: { type: 'long' },
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
