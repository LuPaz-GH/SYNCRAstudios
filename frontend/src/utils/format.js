// "hace 5 min", "ayer 14:30", etc.
export function when(value) {
  if (!value) return ''
  const date = new Date(value)
  const diff = (Date.now() - date) / 1000
  if (diff < 60) return 'recién'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return date.toLocaleString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function fullDate(value) {
  return value ? new Date(value).toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' }) : ''
}

// Día "2026-10-15" en la hora de quien mira (para comparar con los filtros Desde/Hasta).
// Las fechas sin hora (ej. la de un evento agendado) ya vienen así.
export function localDay(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  return new Date(value).toLocaleDateString('en-CA')
}

// Rango Desde/Hasta del día local → momentos exactos en UTC, para pedirle a la API.
export function dayRangeToUtc({ from, to }) {
  const out = {}
  if (from) out.desde = new Date(`${from}T00:00`).toISOString()
  if (to) {
    const end = new Date(`${to}T00:00`)
    end.setDate(end.getDate() + 1) // hasta el final de ese día
    out.hasta = end.toISOString()
  }
  return out
}
