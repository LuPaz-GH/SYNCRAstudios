import { useEffect, useState } from 'react'
import Icon from '../common/Icon'
import RevealText from '../common/RevealText'
import EventMedia from './EventMedia'
import { EVENTS } from '../../assets/data/events'
import { getPublicEvents } from '../../services/public.service'
import { normalizeMedia } from '../../utils/media'

function Meta({ event }) {
  if (!event.date && !event.place) return null
  return (
    <p className="event__meta">
      {event.date && (
        <span>
          <Icon name="calendar" size={18} /> {event.date}
        </span>
      )}
      {event.place && (
        <span>
          <Icon name="pin" size={18} /> {event.place}
        </span>
      )}
    </p>
  )
}

// Cada evento: fotos y videos grandes de un lado y el texto del otro (los lados se van alternando).
export function EventShowcase({ event, index }) {
  const media = normalizeMedia(event.videos)
  const classes = ['showcase', index % 2 && 'showcase--flip', !media.length && 'showcase--text'].filter(Boolean)
  return (
    <div className={classes.join(' ')}>
      {media.length > 0 && <EventMedia items={media} />}
      <div className="showcase__text" data-reveal>
        {event.kind && <span className="event__kind">{event.kind}</span>}
        <h3 className="showcase__title">{event.name}</h3>
        <Meta event={event} />
        <p className="lead">{event.text}</p>
      </div>
    </div>
  )
}

export default function Events() {
  // Los eventos se cargan desde el panel. Si la API no responde, se usan los de frontend/src/assets/data/events.js.
  const [events, setEvents] = useState(EVENTS)

  useEffect(() => {
    getPublicEvents()
      .then((rows) => Array.isArray(rows) && setEvents(rows))
      .catch(() => {})
  }, [])

  return (
    <section id="eventos" className="section">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Eventos y conferencias</p>
          <h2 className="title">
            <RevealText text="Donde estuvimos" />
            <RevealText text="presentes" start={2} mark />
          </h2>
          <p className="lead">
            Congresos, ferias y transmisiones donde llevamos la accesibilidad al centro de la escena.
          </p>
        </div>

        {events.map((event, i) => (
          <EventShowcase key={event.id ?? event.name} event={event} index={i} />
        ))}

        <div className="cards cards--3 events__grid">
          <article className="card event event--cta" data-reveal data-spot data-tilt>
            <span className="card__icon">
              <Icon name="stage" />
            </span>
            <h4>¿Tu evento es el próximo?</h4>
            <p>Congresos, jornadas, lanzamientos o streaming: sumá subtitulado en vivo y llegá a todo tu público.</p>
            <a href="#contacto" className="btn btn--primary btn--sm">
              Quiero subtitular mi evento <Icon name="arrow" size={18} />
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
