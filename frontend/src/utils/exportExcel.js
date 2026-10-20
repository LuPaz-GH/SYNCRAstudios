// Descarga una lista del panel como archivo que Excel abre directo (CSV).
// Usa ";" para separar columnas (lo que espera Excel en español) y BOM para que respete las tildes.

function cell(value) {
  const text = value == null ? '' : String(value)
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const fullDate = (value) =>
  value ? new Date(value).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : ''
const dayDate = (value) => (value ? new Date(`${value}T00:00`).toLocaleDateString('es-AR') : '')

// Valor de un campo tal como se lee en el panel (etiquetas en castellano, nombres de personas, fechas).
function readable(field, row) {
  const value = row[field.key]
  switch (field.type) {
    case 'select':
      return Object.fromEntries(field.options)[value] ?? value
    case 'user':
      return row[`${field.key}_name`] || ''
    case 'date':
      return dayDate(value)
    case 'time':
      return value ? value.slice(0, 5) : ''
    case 'checkbox':
      return value ? 'Sí' : 'No'
    case 'media':
      return (value || []).map((v) => [v.label, v.src].filter(Boolean).join(': ')).join(', ')
    default:
      return value
  }
}

export function exportToExcel(name, config, rows) {
  const fields = config.fields.filter((f) => f.type !== 'password')
  const header = [...fields.map((f) => f.label), 'Creado', 'Creado por', 'Última edición']
  const lines = rows.map((row) => [
    ...fields.map((f) => readable(f, row)),
    fullDate(row.created_at),
    row.created_by_name || (name === 'mensajes' ? 'Web' : ''),
    row.updated_at > row.created_at ? `${fullDate(row.updated_at)} (${row.updated_by_name || ''})` : '',
  ])

  const csv = '﻿' + [header, ...lines].map((line) => line.map(cell).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `syncra-${name}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
