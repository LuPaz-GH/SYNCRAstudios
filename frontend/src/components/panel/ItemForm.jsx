import { useEffect, useRef, useState } from 'react'
import Icon from '../common/Icon'
import MediaField from './MediaField'
import PasswordInput from './PasswordInput'
import { api } from '../../services/api'
import { normalizeMedia } from '../../utils/media'

function initialValues(config, row) {
  const values = {}
  for (const field of config.fields) {
    const value = row ? row[field.key] : config.defaults?.[field.key]
    if (field.type === 'media') values[field.key] = normalizeMedia(value)
    else if (field.type === 'checkbox') values[field.key] = Boolean(value)
    else if (field.type === 'password') values[field.key] = ''
    else values[field.key] = value ?? ''
  }
  return values
}

export default function ItemForm({ name, config, row, ctx, onClose, onSaved }) {
  const dialog = useRef(null)
  const [values, setValues] = useState(() => initialValues(config, row))
  const [team, setTeam] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const needsTeam = config.fields.some((f) => f.type === 'user')

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
    if (needsTeam) api('/equipo').then(setTeam).catch(ctx.handleError)
  }, [needsTeam, ctx.handleError])

  const update = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const body = {}
    for (const field of config.fields) {
      const value = values[field.key]
      if (field.type === 'media') body[field.key] = value.length ? value : null
      else if (field.type === 'password') {
        if (value) body[field.key] = value
      } else body[field.key] = value
    }
    setBusy(true)
    setError('')
    try {
      if (row) await api(`/${name}/${row.id}`, { method: 'PUT', body })
      else await api(`/${name}`, { method: 'POST', body })
      onSaved(!row)
    } catch (err) {
      if (err.status === 401) ctx.handleError(err)
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <dialog ref={dialog} className="pn-dialog" onClose={onClose} aria-labelledby="pn-dialog-title">
      <form onSubmit={onSubmit}>
        <header className="pn-dialog__head">
          <h2 id="pn-dialog-title">{row ? `Editar ${config.singular}` : config.newLabel}</h2>
          <button type="button" className="pn-icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </header>

        <div className="pn-dialog__body">
          {config.fields.map((field) => {
            const id = `f-${field.key}`
            const isPassword = field.type === 'password'
            const required = field.required || (isPassword && !row)
            const common = { id, value: values[field.key], onChange: update(field.key), required }
            let input
            if (field.type === 'media') {
              input = (
                <MediaField
                  value={values[field.key]}
                  onChange={(change) => setValues((v) => ({ ...v, [field.key]: change(v[field.key]) }))}
                  onBusyChange={setUploading}
                  ctx={ctx}
                />
              )
            } else if (field.type === 'textarea') {
              input = <textarea rows={5} {...common} />
            } else if (field.type === 'select') {
              input = (
                <select {...common}>
                  {field.options.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )
            } else if (field.type === 'user') {
              input = (
                <select {...common}>
                  <option value="">Sin asignar</option>
                  {team.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              )
            } else if (isPassword) {
              input = <PasswordInput {...common} minLength={8} autoComplete="new-password" />
            } else {
              input = <input type={field.type || 'text'} {...common} autoComplete="off" />
            }
            const hint = isPassword
              ? row
                ? 'Dejala vacía para no cambiarla.'
                : 'Mínimo 8 caracteres. Pasásela a la persona por un medio privado.'
              : field.hint
            // Casilla sí/no: el texto va al lado de la casilla.
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className="pn-field pn-field--check">
                  <label>
                    <input type="checkbox" id={id} checked={values[field.key]} onChange={update(field.key)} />
                    {field.label}
                  </label>
                  {hint && <small>{hint}</small>}
                </div>
              )
            }
            // El campo de fotos y videos tiene varios controles: su título no apunta a uno solo.
            const Title = field.type === 'media' ? 'span' : 'label'
            return (
              <div key={field.key} className="pn-field">
                <Title htmlFor={field.type === 'media' ? undefined : id}>
                  {field.label}
                  {!required && <em> (opcional)</em>}
                </Title>
                {input}
                {hint && <small>{hint}</small>}
              </div>
            )
          })}

          {error && (
            <p className="pn-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <footer className="pn-dialog__foot">
          <button type="button" className="pn-btn" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary btn--sm" disabled={busy || uploading}>
            {uploading ? 'Subiendo archivos…' : busy ? 'Guardando…' : 'Guardar'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}
