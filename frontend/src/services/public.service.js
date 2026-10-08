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
