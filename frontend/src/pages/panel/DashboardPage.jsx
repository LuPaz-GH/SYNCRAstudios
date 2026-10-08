import { useEffect, useState } from 'react'
import Icon from '../../components/common/Icon'
import { api } from '../../services/api'
import ActivityList from '../../components/panel/ActivityList'

export default function DashboardPage({ ctx }) {
  const { user, isAdmin, navigate, handleError } = ctx
  const [counts, setCounts] = useState(null)
  const [recent, setRecent] = useState(null)

  useEffect(() => {
    api('/resumen').then(setCounts).catch(handleError)
    api('/actividad')
      .then((data) => setRecent(data.rows.filter((r) => r.action !== 'login').slice(0, 6)))
      .catch(handleError)
  }, [handleError])

  const cards = [
    { key: 'mensajes', icon: 'mail', value: counts?.mensajes_nuevos, label: 'mensajes nuevos' },
    { key: 'agenda', icon: 'calendar', value: counts?.proximos_eventos, label: 'eventos agendados en los próximos 30 días' },
    { key: 'tareas', icon: 'check', value: counts?.mis_tareas, label: 'tareas para vos' },
    { key: 'tareas', icon: 'clock', value: counts?.tareas_abiertas, label: 'tareas abiertas del equipo' },
    { key: 'eventos', icon: 'globe', value: counts?.eventos, label: 'eventos publicados en la web' },
  ]

  return (
    <section className="pn-page">
      <header className="pn-page__head">
        <div>
          <h1>Hola, {user.name.split(' ')[0]}</h1>
          <p>Esto es lo que está pasando en SYNCRA.</p>
        </div>
      </header>

      <div className="pn-stats">
        {cards.map((card) => (
          <button key={card.label} className="pn-stat" onClick={() => navigate(card.key)}>
            <Icon name={card.icon} />
            <strong>{card.value ?? '–'}</strong>
            <span>{card.label}</span>
          </button>
        ))}
      </div>

      <div className="pn-block">
        <div className="pn-block__head">
          <h2>{isAdmin ? 'Últimos movimientos del equipo' : 'Lo último que hiciste'}</h2>
          <button className="pn-link" onClick={() => navigate('actividad')}>
            Ver todo <Icon name="arrow" size={16} />
          </button>
        </div>
        {recent === null ? (
          <p className="pn-empty">Cargando…</p>
        ) : recent.length === 0 ? (
          <p className="pn-empty">Todavía no hay movimientos.</p>
        ) : (
          <ActivityList entries={recent} ctx={ctx} />
        )}
      </div>
    </section>
  )
}
