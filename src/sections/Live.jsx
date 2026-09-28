import Bars from '../components/Bars'
import Icon from '../components/Icon'
import RevealText from '../components/RevealText'

const SERVICES = [
  {
    icon: 'stage',
    title: 'Eventos presenciales',
    text: 'Subtitulado en vivo para audiencias presenciales.',
  },
  {
    icon: 'hybrid',
    title: 'Congresos, webinars y streaming híbrido',
    text: 'Soporte técnico integrado de subtitulación en vivo.',
  },
  {
    icon: 'play',
    title: 'Transmisiones digitales',
    text: 'Optimizadas para canales oficiales de YouTube.',
  },
]

export default function Live() {
  return (
    <section id="en-vivo" className="section section--alt">
      <div className="bigtext" aria-hidden="true">
        <div className="bigtext__track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>En vivo · En directo · </span>
          ))}
        </div>
      </div>
      <Bars className="section__bars" cols={8} seed={23} data-parallax="-0.2" />

      <div className="container">
        <div className="split">
          <div data-reveal>
            <p className="eyebrow">
              <span className="live-dot" /> Soluciones en tiempo real
            </p>
            <h2 className="title">
              <RevealText text="Accesibilidad en el" />
              <RevealText text="instante exacto" start={3} mark />
            </h2>
          </div>
          <div data-reveal>
            <p className="lead">
              La inmediatez requerida por las transmisiones digitales y los eventos masivos no debe sacrificar la
              excelencia técnica.
            </p>
            <p>
              Diseñamos interfaces de subtitulado síncronas que se integran de manera fluida y nativa con cualquier
              plataforma de streaming del mercado actual.
            </p>
          </div>
        </div>

        <h3 className="subtitle" data-reveal>
          Conectamos tu marca con el mundo, en vivo y en directo
        </h3>
        <div className="cards cards--3">
          {SERVICES.map((s, i) => (
            <article
              className="card card--numbered"
              key={s.title}
              data-reveal
              data-spot
              data-tilt
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="card__num">0{i + 1}</span>
              <span className="card__icon">
                <Icon name={s.icon} />
              </span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
