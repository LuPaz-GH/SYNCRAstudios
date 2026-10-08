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
