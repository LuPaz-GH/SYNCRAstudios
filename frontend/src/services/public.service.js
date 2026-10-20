// Pedidos que hace la web pública a la API.

export async function getPublicEvents() {
  const res = await fetch('/api/public/eventos')
  if (!res.ok) throw new Error('No se pudieron cargar los eventos.')
  return res.json()
}

// Guarda la consulta del formulario de contacto para verla en el panel.
// keepalive: el envío termina aunque se abra WhatsApp enseguida.
export function sendContactMessage(form) {
  return fetch('/api/public/mensajes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
    keepalive: true,
  })
}

// Próximos eventos de la Agenda que el equipo marcó "Publicar en la web".
// Se piden una sola vez: los usan la sección "Próximos eventos" y el link "Agenda" del menú.
let upcoming = null
export function getUpcomingEvents() {
  upcoming ??= fetch('/api/public/proximos').then((res) => {
    if (!res.ok) throw new Error('No se pudieron cargar los próximos eventos.')
    return res.json()
  })
  upcoming.catch(() => {
    upcoming = null // si falló, la próxima vez se vuelve a intentar
  })
  return upcoming
}
