import { useEffect, useState } from 'react'
import RevealText from '../common/RevealText'
import { EventShowcase } from './Events'
import { getUpcomingEvents } from '../../services/public.service'

const MODALITY = { presencial: 'Presencial', virtual: 'Virtual', hibrido: 'Híbrido' }

// "sábado 20 de noviembre · 20:00 h" a partir de la fecha y la hora de la Agenda.
function when(event) {
  const day = new Date(`${event.date}T00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  return [day.charAt(0).toUpperCase() + day.slice(1), event.start_time && `${event.start_time.slice(0, 5)} h`]
    .filter(Boolean)
    .join(' · ')
}

// Próximos eventos (publicidad): los de la Agenda marcados "Publicar en la web".
// Si no hay ninguno, la sección no aparece.
export default function Upcoming() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getUpcomingEvents()
      .then((rows) => Array.isArray(rows) && setEvents(rows))
      .catch(() => {})
  }, [])

  if (!events.length) return null

  return (
    <section id="proximos" className="section upcoming">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Próximos eventos</p>
          <h2 className="title">
            <RevealText text="Vení a" />
            <RevealText text="vernos" start={2} mark />
          </h2>
          <p className="lead">Estos son los próximos eventos donde vamos a estar haciendo accesible cada palabra.</p>
        </div>

        {events.map((event, i) => (
          <EventShowcase
            key={event.id}
            index={i}
            event={{
              name: event.name,
              kind: ['Próximamente', MODALITY[event.modality]].filter(Boolean).join(' · '),
              date: when(event),
              place: event.place,
              text: event.text,
              videos: event.media,
            }}
          />
        ))}
      </div>
    </section>
  )
}
