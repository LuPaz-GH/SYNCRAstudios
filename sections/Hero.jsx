import Bars from '../components/Bars'
import CaptionDemo from '../components/CaptionDemo'
import Icon from '../components/Icon'
import RevealText from '../components/RevealText'

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <Bars className="hero__bars" cols={14} seed={11} data-parallax="0.35" />

      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Subtitulado en vivo · Posproducción · Accesibilidad</p>
          <h1 className="hero__title">
            <RevealText text="Subtitulados inclusivos y" />
            <RevealText text="accesibilidad universal" start={3} mark />
          </h1>
          <p className="lead hero__lead">
            Transmitimos la esencia humana en cada mensaje. Conectamos personas, palabra por palabra.
          </p>
          <div className="hero__actions">
            <a href="#contacto" className="btn btn--primary">
              Pedí tu cotización <Icon name="arrow" size={20} />
            </a>
            <a href="#en-vivo" className="btn btn--ghost">
              Ver servicios
            </a>
          </div>
        </div>

        <div className="hero__demo">
          <div className="tilt" data-spot data-tilt>
            <CaptionDemo />
          </div>
          <span className="float-chip float-chip--1" aria-hidden="true">
            <span className="float-chip__dot" /> Estenotipia humana
          </span>
          <span className="float-chip float-chip--2" aria-hidden="true">
            Tiempo real
          </span>
          <span className="float-chip float-chip--3" aria-hidden="true">
            + contexto · + intención
          </span>
        </div>
      </div>

      <a href="#manifiesto" className="hero__scroll" aria-label="Bajar a la siguiente sección">
        <span />
      </a>
    </section>
  )
}
