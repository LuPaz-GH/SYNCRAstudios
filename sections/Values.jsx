import Icon from '../components/Icon'
import RevealText from '../components/RevealText'

export default function Values() {
  return (
    <section className="section section--yellow">
      <div className="container">
        <div className="section__head" data-reveal>
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 className="title">
            <RevealText text="Confianza en cada palabra" />
          </h2>
        </div>
        <div className="cards cards--2">
          <article className="card card--ink" data-reveal data-spot data-tilt>
            <span className="card__icon">
              <Icon name="lock" />
            </span>
            <h3>Confidencialidad absoluta</h3>
            <p>
              Compromiso de discreción, reserva y seguridad con la información en cada uno de nuestros trabajos
              audiovisuales y transmisiones privadas.
            </p>
          </article>
          <article className="card card--ink" data-reveal data-spot data-tilt style={{ transitionDelay: '100ms' }}>
            <span className="card__icon">
              <Icon name="clock" />
            </span>
            <h3>Puntualidad y excelencia técnica</h3>
            <p>
              Implementamos herramientas tecnológicas y procesos de control de calidad a medida, con el único fin
              de ofrecer el mejor resultado final disponible en la industria audiovisual.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
