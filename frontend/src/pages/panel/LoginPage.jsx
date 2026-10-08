import { useState } from 'react'
import Icon from '../../components/common/Icon'
import Logo from '../../components/common/Logo'
import { api } from '../../services/api'
import { whatsappLink } from '../../utils/whatsapp'

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await api('/auth/login', { method: 'POST', body: form })
      onLogin(data.user)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <main className="pn-login">
      <form className="pn-login__card" onSubmit={onSubmit}>
        <Logo size={44} />
        <div>
          <h1>Panel interno</h1>
          <p>Acceso exclusivo para el equipo de SYNCRA.</p>
        </div>

        <label className="pn-field">
          <span>Email</span>
          <input type="email" required autoComplete="username" value={form.email} onChange={update('email')} autoFocus />
        </label>
        <label className="pn-field">
          <span>Contraseña</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={update('password')}
          />
        </label>

        <button
          type="button"
          className="pn-login__forgot"
          aria-expanded={showHelp}
          aria-controls="pn-login-help"
          onClick={() => setShowHelp((v) => !v)}
        >
          ¿Olvidaste tu contraseña o tu email?
        </button>
        {showHelp && (
          <div id="pn-login-help" className="pn-login__help">
            <p>
              Por seguridad, las contraseñas las asigna el <strong>administrador de SYNCRA</strong>. Escribile y te
              va a dar una nueva. Si no recordás tu email, también te lo puede decir.
            </p>
            <a
              className="pn-btn"
              href={whatsappLink('Hola, soy del equipo de SYNCRA y no puedo entrar al panel interno. ¿Me ayudás?')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>
          </div>
        )}

        {error && (
          <p className="pn-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'} <Icon name="arrow" size={20} />
        </button>
        <a href="/" className="pn-login__back">
          Volver a la web
        </a>
      </form>
    </main>
  )
}
