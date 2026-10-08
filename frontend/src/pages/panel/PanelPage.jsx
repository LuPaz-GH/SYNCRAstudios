import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../../components/common/Icon'
import Logo from '../../components/common/Logo'
import { api } from '../../services/api'
import { RESOURCES, ROLES } from '../../utils/panelConfig'
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
import ResourcePage from './ResourcePage'
import ActivityPage from './ActivityPage'
import '../../assets/styles/panel.css'

function currentSection() {
  return window.location.pathname.replace(/^\/panel\/?/, '').split('/')[0] || 'inicio'
}

export default function PanelPage() {
  const [user, setUser] = useState(undefined) // undefined = cargando, null = sin sesión
  const [section, setSection] = useState(currentSection)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => {
    document.title = 'Panel | SYNCRA Studios'
    document.documentElement.classList.add('is-loaded', 'is-panel')
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))

    const onPop = () => setSection(currentSection())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((key) => {
    window.history.pushState(null, '', key === 'inicio' ? '/panel' : `/panel/${key}`)
    setSection(key)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const notify = useCallback(
    (text, { tone = 'ok', action } = {}) => {
      const id = ++toastId.current
      setToasts((list) => [...list.slice(-2), { id, text, tone, action }])
      setTimeout(() => dismiss(id), action ? 8000 : 4000)
    },
    [dismiss],
  )

  // Errores de la API: si la sesión venció, vuelve al login.
  const handleError = useCallback(
    (err) => {
      if (err.status === 401) setUser(null)
      notify(err.message, { tone: 'error' })
    },
    [notify],
  )

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }

  if (user === undefined) return <div className="pn-loading" aria-busy="true" />
  if (!user) return <LoginPage onLogin={setUser} />

  const isAdmin = user.role === 'admin'
  const nav = [
    { key: 'inicio', label: 'Inicio', icon: 'home' },
    ...Object.entries(RESOURCES)
      .filter(([, r]) => !r.adminOnly || isAdmin)
      .map(([key, r]) => ({ key, label: r.label, icon: r.icon })),
    { key: 'actividad', label: isAdmin ? 'Actividad del equipo' : 'Mi actividad', icon: 'history' },
  ]
  const active = nav.some((n) => n.key === section) ? section : 'inicio'
  const ctx = { user, isAdmin, notify, handleError, navigate }

  return (
    <div className="pn">
      <a href="#pn-main" className="skip-link">
        Saltar al contenido
      </a>

      <header className="pn-top">
        <button className="pn-icon-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
          <Icon name="menu" />
        </button>
        <Logo size={30} />
      </header>

      <aside className={`pn-side ${menuOpen ? 'is-open' : ''}`} aria-label="Menú del panel">
        <div className="pn-side__head">
          <a href="/" className="pn-side__logo" aria-label="Ir a la web de SYNCRA">
            <Logo size={34} />
          </a>
          <button className="pn-icon-btn pn-side__close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <Icon name="close" />
          </button>
        </div>
        <p className="pn-side__tag">Panel interno</p>

        <nav className="pn-nav">
          {nav.map((item) => (
            <a
              key={item.key}
              href={item.key === 'inicio' ? '/panel' : `/panel/${item.key}`}
              className={`pn-nav__item ${active === item.key ? 'is-active' : ''}`}
              aria-current={active === item.key ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.key)
              }}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pn-me">
          <span className="pn-avatar" aria-hidden="true">
            {user.name.trim().charAt(0).toUpperCase()}
          </span>
          <div className="pn-me__info">
            <strong>{user.name}</strong>
            <span>{ROLES[user.role]}</span>
          </div>
          <button className="pn-icon-btn" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <Icon name="logout" size={20} />
          </button>
        </div>
      </aside>
      {menuOpen && <div className="pn-scrim" onClick={() => setMenuOpen(false)} />}

      <main id="pn-main" className="pn-main">
        {active === 'inicio' && <DashboardPage ctx={ctx} />}
        {RESOURCES[active] && <ResourcePage key={active} name={active} config={RESOURCES[active]} ctx={ctx} />}
        {active === 'actividad' && <ActivityPage ctx={ctx} />}
      </main>

      <div className="pn-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`pn-toast pn-toast--${t.tone}`}>
            <span>{t.text}</span>
            {t.action && (
              <button
                className="pn-toast__action"
                onClick={() => {
                  dismiss(t.id)
                  t.action.run()
                }}
              >
                {t.action.label}
              </button>
            )}
            <button className="pn-toast__close" onClick={() => dismiss(t.id)} aria-label="Cerrar aviso">
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
