import Icon from '../components/Icon'
import RevealText from '../components/RevealText'

export default function About() {
  return (
    <section id="nosotros" className="section">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Quiénes somos</p>
          <h2 className="title">
            <RevealText text="Transmitimos la" />
            <RevealText text="esencia humana" start={3} mark />
            <RevealText text="en cada mensaje" start={5} />
          </h2>
        </div>

        <div className="compare" data-reveal>
          <div className="compare__card compare__card--ai">
            <span className="compare__tag">Transcripción automática</span>
            <p>“y bueno eh como decía la la inclusión no es un es un favor”</p>
          </div>
          <div className="compare__arrow" aria-hidden="true">
            <Icon name="arrow" size={28} />
          </div>
          <div className="compare__card compare__card--human">
            <span className="compare__tag">Subtitulado SYNCRA</span>
            <p>“Como decía: la inclusión no es un favor.”</p>
            <p className="compare__sound">(Aplausos)</p>
          </div>
        </div>

        <div className="cards cards--2">
          <article className="card" data-reveal data-spot data-tilt>
            <span className="card__icon">
              <Icon name="heart" />
            </span>
            <h3>Pulso humano: precisión contextual</h3>
            <p>
              Contamos con un equipo de estenotipistas profesionales altamente capacitadas que garantizan la
              fidelidad, la inmediatez y la adaptabilidad cultural en cada intervención.
            </p>
          </article>
          <article className="card" data-reveal data-spot data-tilt>
            <span className="card__icon">
              <Icon name="globe" />
            </span>
            <h3>Tecnología con impacto social</h3>
            <p>
              Buscamos derribar las barreras de comunicación en entornos presenciales y virtuales mediante un
              servicio de subtitulado de alta calidad, promoviendo la inclusión social. Promovemos un compromiso
              real de comunicación efectiva en cada espacio de interacción e intercambio corporativo.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
