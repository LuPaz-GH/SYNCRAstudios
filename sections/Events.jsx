import Icon from '../components/Icon'
import RevealText from '../components/RevealText'
import VideoFeature from '../components/VideoFeature'
import { EVENTS } from '../data/events'

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

export default function Events() {
  const [featured, ...rest] = EVENTS

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

        {featured && (
          <div className="showcase">
            {featured.videos?.length > 0 && (
              <div className="showcase__videos" data-reveal>
                {featured.videos.map((video) => (
                  <VideoFeature key={video.src} src={video.src} label={video.label} />
                ))}
              </div>
            )}
            <div className="showcase__text" data-reveal>
              <span className="event__kind">{featured.kind}</span>
              <h3 className="showcase__title">{featured.name}</h3>
              <Meta event={featured} />
              <p className="lead">{featured.text}</p>
            </div>
          </div>
        )}

        <div className="cards cards--3 events__grid">
          {rest.map((event, i) => (
            <article
              className="card event"
              key={event.name}
              data-reveal
              data-spot
              data-tilt
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="event__kind">{event.kind}</span>
              <h4>{event.name}</h4>
              <Meta event={event} />
              <p>{event.text}</p>
            </article>
          ))}

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
