// Qué muestra el panel en cada sección: campos del formulario, cómo se ve cada fila, etc.
// Los nombres de campo tienen que coincidir con los de backend/config/resources.js.

export const MESSAGE_STATUS = { nuevo: 'Nuevo', en_curso: 'En curso', respondido: 'Respondido' }
export const TASK_STATUS = { pendiente: 'Pendiente', en_curso: 'En curso', hecha: 'Hecha' }
export const ROLES = { admin: 'Administrador', empleado: 'Empleado' }
export const BOOKING_STATUS = { consulta: 'En consulta', confirmado: 'Confirmado', realizado: 'Realizado', cancelado: 'Cancelado' }
export const MODALITY = { presencial: 'Presencial', virtual: 'Virtual', hibrido: 'Híbrido' }

// "sábado 15 de noviembre de 2026" a partir de "2026-11-15"
const longDay = (value) =>
  new Date(`${value}T00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const options = (map) => Object.entries(map)

export const RESOURCES = {
  mensajes: {
    label: 'Mensajes',
    icon: 'mail',
    singular: 'mensaje',
    newLabel: 'Nuevo mensaje',
    intro: 'Consultas que llegan desde el formulario de contacto de la web.',
    title: (r) => r.name,
    subtitle: (r) => [r.org, r.service].filter(Boolean).join(' · '),
    body: (r) => r.message,
    badge: (r) => ({ text: MESSAGE_STATUS[r.status], tone: r.status }),
    filter: { key: 'status', label: 'Estado', options: options(MESSAGE_STATUS) },
    defaults: { status: 'nuevo' },
    fields: [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'org', label: 'Empresa o institución' },
      { key: 'service', label: 'Servicio que le interesa' },
      { key: 'message', label: 'Mensaje', type: 'textarea', required: true },
      { key: 'status', label: 'Estado', type: 'select', options: options(MESSAGE_STATUS) },
      { key: 'notes', label: 'Notas internas', type: 'textarea', hint: 'Solo las ve el equipo.' },
    ],
  },
  agenda: {
    label: 'Agenda',
    icon: 'calendar',
    singular: 'evento agendado',
    newLabel: 'Agendar evento',
    intro: 'Eventos contratados o en consulta. Es interna: no se muestra en la web. Arriba van los próximos.',
    title: (r) => r.event_name,
    subtitle: (r) =>
      [
        longDay(r.date) + (r.start_time ? ` · ${r.start_time.slice(0, 5)} h` : ''),
        r.place,
        MODALITY[r.modality],
      ]
        .filter(Boolean)
        .join(' · '),
    body: (r) =>
      [
        `Cliente: ${r.client}`,
        r.contact && `Contacto: ${r.contact}`,
        r.service && `Servicio: ${r.service}`,
        r.assigned_to_name && `Responsable: ${r.assigned_to_name}`,
        r.notes,
      ]
        .filter(Boolean)
        .join('\n'),
    badge: (r) => ({ text: BOOKING_STATUS[r.status], tone: r.status }),
    filter: { key: 'status', label: 'Estado', options: options(BOOKING_STATUS) },
    defaults: { status: 'confirmado', modality: 'presencial' },
    fields: [
      { key: 'event_name', label: 'Evento', required: true, hint: 'Ej.: Congreso Nacional de Cardiología' },
      { key: 'client', label: 'Cliente', required: true, hint: 'Empresa, institución o persona que contrata.' },
      { key: 'date', label: 'Fecha', type: 'date', required: true },
      { key: 'start_time', label: 'Hora de inicio', type: 'time' },
      { key: 'place', label: 'Lugar', hint: 'Dirección, salón o plataforma (Zoom, YouTube…)' },
      { key: 'modality', label: 'Modalidad', type: 'select', options: options(MODALITY) },
      { key: 'service', label: 'Servicio', hint: 'Ej.: subtitulado en vivo, transmisión por YouTube…' },
      { key: 'status', label: 'Estado', type: 'select', options: options(BOOKING_STATUS) },
      { key: 'contact', label: 'Contacto del cliente', hint: 'Nombre, teléfono o email de quien coordina.' },
      { key: 'assigned_to', label: 'Responsable de SYNCRA', type: 'user' },
      { key: 'notes', label: 'Notas', type: 'textarea' },
    ],
  },
  eventos: {
    label: 'Eventos en la web',
    icon: 'globe',
    singular: 'evento',
    newLabel: 'Nuevo evento',
    intro: 'Lo que cargues acá aparece en la sección "Donde estuvimos presentes" de la web. El primero de la lista es el destacado.',
    title: (r) => r.name,
    subtitle: (r) => [r.kind, r.date, r.place].filter(Boolean).join(' · '),
    body: (r) => r.text,
    defaults: { position: 0 },
    fields: [
      { key: 'name', label: 'Nombre del evento', required: true },
      { key: 'kind', label: 'Tipo', hint: 'Congreso, Conferencia, Streaming, Entrevista…' },
      { key: 'date', label: 'Fecha', hint: 'Como querés que se lea, ej.: Septiembre 2026' },
      { key: 'place', label: 'Lugar' },
      { key: 'text', label: 'Descripción', type: 'textarea', required: true },
      {
        key: 'videos',
        label: 'Videos',
        type: 'videos',
        hint: 'Uno por línea: ruta | etiqueta. Ej.: /videos/expocom-presentacion.mp4 | Presentación',
      },
      { key: 'position', label: 'Orden', type: 'number', hint: 'Número más bajo = aparece primero.' },
    ],
  },
  tareas: {
    label: 'Tareas',
    icon: 'check',
    singular: 'tarea',
    newLabel: 'Nueva tarea',
    intro: 'Agenda interna del equipo.',
    title: (r) => r.title,
    subtitle: (r) =>
      [
        r.assigned_to_name ? `Para ${r.assigned_to_name}` : 'Sin asignar',
        r.due_date && `Vence ${new Date(`${r.due_date}T00:00`).toLocaleDateString('es-AR')}`,
      ]
        .filter(Boolean)
        .join(' · '),
    body: (r) => r.description,
    badge: (r) => ({ text: TASK_STATUS[r.status], tone: r.status }),
    filter: { key: 'status', label: 'Estado', options: options(TASK_STATUS) },
    defaults: { status: 'pendiente' },
    fields: [
      { key: 'title', label: 'Tarea', required: true },
      { key: 'description', label: 'Detalle', type: 'textarea' },
      { key: 'assigned_to', label: 'Responsable', type: 'user' },
      { key: 'due_date', label: 'Vence', type: 'date' },
      { key: 'status', label: 'Estado', type: 'select', options: options(TASK_STATUS) },
    ],
  },
  usuarios: {
    label: 'Usuarios',
    icon: 'users',
    singular: 'usuario',
    newLabel: 'Nuevo usuario',
    adminOnly: true,
    intro: 'Quiénes pueden entrar al panel. Si borrás a alguien, pierde el acceso al instante (y lo podés restaurar).',
    title: (r) => r.name,
    subtitle: (r) => r.email,
    badge: (r) => ({ text: ROLES[r.role], tone: r.role }),
    filter: { key: 'role', label: 'Rol', options: options(ROLES) },
    defaults: { role: 'empleado' },
    fields: [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'role', label: 'Rol', type: 'select', options: options(ROLES) },
      { key: 'password', label: 'Contraseña', type: 'password' },
    ],
  },
}

// Para mostrar el registro de actividad con nombres en castellano.
export const ENTITY_LABELS = {
  mensajes: 'Mensajes',
  agenda: 'Agenda',
  eventos: 'Eventos en la web',
  tareas: 'Tareas',
  usuarios: 'Usuarios',
  sesion: 'Sesiones',
}

export const ACTION_LABELS = {
  crear: 'Creó',
  editar: 'Editó',
  borrar: 'Borró',
  restaurar: 'Restauró',
  deshacer: 'Deshizo',
  login: 'Entró',
}

export function fieldLabel(entity, key) {
  return RESOURCES[entity]?.fields.find((f) => f.key === key)?.label || key
}
