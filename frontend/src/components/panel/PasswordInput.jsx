import { useState } from 'react'
import Icon from '../common/Icon'

// Campo de contraseña con el ojito para mostrarla u ocultarla.
// Recibe los mismos datos que un <input> común (id, value, onChange, required…).
export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="pn-password">
      <input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className="pn-password__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <Icon name={visible ? 'eyeOff' : 'eye'} size={20} />
      </button>
    </div>
  )
}
