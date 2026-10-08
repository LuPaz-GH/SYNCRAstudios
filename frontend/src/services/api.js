// Pedidos a la API del panel. La sesión viaja en una cookie segura que maneja el navegador.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || 'No se pudo conectar con el servidor.')
    error.status = res.status
    throw error
  }
  return data
}
