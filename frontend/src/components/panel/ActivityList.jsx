import Icon from '../common/Icon'
import { api } from '../../services/api'
import { fullDate, when } from '../../utils/format'
import { BOOKING_STATUS, ENTITY_LABELS, MESSAGE_STATUS, MODALITY, TASK_STATUS, ROLES, fieldLabel } from '../../utils/panelConfig'

const VALUE_LABELS = { status: { ...MESSAGE_STATUS, ...TASK_STATUS, ...BOOKING_STATUS }, role: ROLES, modality: MODALITY }

function showValue(key, value) {
  if (value === null || value === undefined || value === '') return '(vacío)'
  if (key === 'videos' && Array.isArray(value)) return value.map((v) => v.label || v.src).join(', ')
  if (VALUE_LABELS[key]?.[value]) return VALUE_LABELS[key][value]
  return String(value)
}

// Lista de cambios campo por campo: cómo estaba → cómo quedó.
function Changes({ entry }) {
  const before = entry.before_data || {}
  const after = entry.after_data || {}
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => k !== 'id')
  if (!keys.length) return null
  const onlyAfter = !entry.before_data
  const onlyBefore = !entry.after_data
  return (
    <dl className="pn-changes">
      {keys.map((key) => (
        <div key={key}>
          <dt>{fieldLabel(entry.entity, key)}</dt>
          <dd>
            {!onlyAfter && <del>{showValue(key, before[key])}</del>}
            {!onlyAfter && !onlyBefore && <Icon name="arrow" size={16} />}
            {!onlyBefore && <ins>{showValue(key, after[key])}</ins>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// Lista de movimientos del registro de actividad. La usan Inicio y Actividad.
export default function ActivityList({ entries, ctx, onChange }) {
  const run = async (entry) => {
    try {
      await api(`/actividad/${entry.id}/deshacer`, { method: 'POST' })
      ctx.notify(entry.action === 'borrar' ? 'Se restauró.' : 'Se deshizo el cambio.')
      onChange?.()
    } catch (err) {
      ctx.handleError(err)
    }
  }

  return (
    <ol className="pn-log">
      {entries.map((entry) => {
        const canUndo = ctx.isAdmin && onChange && ['editar', 'deshacer', 'borrar'].includes(entry.action)
        const hasDetails = entry.before_data || entry.after_data
        return (
          <li key={entry.id} className={`pn-log__item pn-log__item--${entry.action}`}>
            <span className="pn-log__dot" aria-hidden="true" />
            <div className="pn-log__main">
              <p className="pn-log__summary">
                {entry.user_id ? (
                  <>
                    <strong>{entry.user_name || 'Usuario eliminado'}</strong>{' '}
                    {entry.summary.charAt(0).toLowerCase() + entry.summary.slice(1)}
                  </>
                ) : (
                  entry.summary
                )}
              </p>
              <p className="pn-log__meta">
                <span className="pn-badge">{ENTITY_LABELS[entry.entity] || entry.entity}</span>
                <time dateTime={entry.created_at} title={fullDate(entry.created_at)}>
                  {when(entry.created_at)}
                </time>
              </p>
              {hasDetails && (
                <details>
                  <summary>Ver detalle</summary>
                  <Changes entry={entry} />
                </details>
              )}
            </div>
            {canUndo && (
              <button className="pn-btn" onClick={() => run(entry)}>
                <Icon name="undo" size={18} /> {entry.action === 'borrar' ? 'Restaurar' : 'Deshacer'}
              </button>
            )}
          </li>
        )
      })}
    </ol>
  )
}
