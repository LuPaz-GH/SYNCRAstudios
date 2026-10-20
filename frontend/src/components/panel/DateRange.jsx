import Icon from '../common/Icon'

// Filtro de fechas "Desde / Hasta". Se puede completar uno solo (por ejemplo, solo "Desde").
export default function DateRange({ value, onChange, label = 'Fecha' }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value })
  const active = value.from || value.to
  return (
    <fieldset className="pn-dates">
      <legend>{label}</legend>
      <label>
        Desde
        <input type="date" value={value.from} max={value.to || undefined} onChange={set('from')} />
      </label>
      <label>
        Hasta
        <input type="date" value={value.to} min={value.from || undefined} onChange={set('to')} />
      </label>
      {active && (
        <button type="button" className="pn-icon-btn" onClick={() => onChange({ from: '', to: '' })} aria-label="Quitar filtro de fechas">
          <Icon name="close" size={18} />
        </button>
      )}
    </fieldset>
  )
}
