import Icon from '../components/Icon'
import RevealText from '../components/RevealText'
import Timeline from '../components/Timeline'

const OFFLINE = [
  { icon: 'film', text: 'Subtitulado de películas (cortometrajes y largometrajes).' },
  { icon: 'tv', text: 'Subtitulado de series de televisión y animación.' },
  { icon: 'doc', text: 'Subtitulado de documentales y docurealities.' },
  { icon: 'megaphone', text: 'Adaptación para videos empresariales, institucionales y publicitarios.' },
  { icon: 'course', text: 'Estructuración de subtítulos para cursos, e-learning y tutoriales.' },
]

const FIELDS = ['Médica', 'Legal', 'Financiera', 'Tecnológica']

export default function Post() {
  return (
    <section id="posproduccion" className="section section--alt">
      <div className="container">
        <div className="split">
          <div data-reveal>
            <p className="eyebrow">Contenidos que perduran</p>
            <h2 className="title">
              <RevealText text="La industria audiovisual" />
              <RevealText text="exige excelencia" start={3} mark />
            </h2>
            <p className="lead">
              Desarrollamos soluciones de subtitulado diferido y edición milimétrica para materiales grabados que
              exigen máxima retención de audiencia y accesibilidad permanente.
            </p>
          </div>
          <div data-reveal>
            <div className="tilt" data-spot data-tilt>
              <Timeline />
            </div>
          </div>
        </div>

        <blockquote className="quote" data-reveal>
          <span className="quote__mark" aria-hidden="true">
            “
          </span>
          <p className="quote__main">El subtitulado es un componente esencial de cualquier producto audiovisual.</p>
          <p>
            En SYNCRA Studios vamos más allá de la traducción literal: transmitimos el bagaje subjetivo de lo que
            expresa el hablante, rescatando sutilezas culturales y emocionales que, de otro modo, se perderían para
            el espectador.
          </p>
          <footer>Accesibilidad y herencia cultural</footer>
        </blockquote>

        <h3 className="subtitle" data-reveal>
          Nuestros servicios offline
        </h3>
        <ol className="offline">
          {OFFLINE.map((item, i) => (
            <li key={item.text} data-reveal data-spot style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="offline__num">{String(i + 1).padStart(2, '0')}</span>
              <Icon name={item.icon} size={30} />
              <p>{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="glossary" data-reveal>
          <div>
            <p className="eyebrow">Servicios lingüísticos a medida</p>
            <h3 className="glossary__title">Glosarios corporativos específicos</h3>
            <p>
              Desarrollamos glosarios para evitar fallas terminológicas en conferencias y contenidos de alta
              especialización.
            </p>
          </div>
          <ul className="chips">
            {FIELDS.map((f, i) => (
              <li key={f} className="chip" style={{ animationDelay: `${i * -0.8}s` }}>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
