import { useEffect, useRef, useState } from 'react'
import Icon from '../common/Icon'

// Ventana para confirmar acciones que no se pueden deshacer (ej. eliminar definitivamente).
// El foco arranca en "Cancelar", así un Enter apurado no borra nada.
export default function ConfirmDialog({ title, item, points = [], confirmLabel, onConfirm, onClose }) {
  const dialog = useRef(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal()
  }, [])

  const confirm = async () => {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      className="pn-dialog pn-confirm"
      aria-labelledby="pn-confirm-title"
      aria-describedby="pn-confirm-text"
      onCancel={(e) => {
        e.preventDefault()
        if (!busy) onClose()
      }}
    >
      <div className="pn-confirm__body">
        <span className="pn-confirm__icon" aria-hidden="true">
          <Icon name="trash" size={26} />
        </span>
        <h2 id="pn-confirm-title">{title}</h2>
        {item && <p className="pn-confirm__item">{item}</p>}
        {points.length > 0 && (
          <ul id="pn-confirm-text" className="pn-confirm__points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
      </div>
      <footer className="pn-dialog__foot">
        <button type="button" className="pn-btn" onClick={onClose} disabled={busy} autoFocus>
          Cancelar
        </button>
        <button type="button" className="pn-btn pn-btn--solid-danger" onClick={confirm} disabled={busy}>
          <Icon name="trash" size={18} /> {busy ? 'Eliminando…' : confirmLabel}
        </button>
      </footer>
    </dialog>
  )
}
