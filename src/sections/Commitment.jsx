import RevealText from '../components/RevealText'

// Colores oficiales de los 17 Objetivos de Desarrollo Sostenible, para la rueda giratoria.
const SDG_COLORS = [
  '#e5243b', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21', '#26bde2', '#fcc30b', '#a21942', '#fd6925',
  '#dd1367', '#fd9d24', '#bf8b2e', '#3f7e44', '#0a97d9', '#56c02b', '#00689d', '#19486a',
]
const STEP = 360 / SDG_COLORS.length
const WHEEL = `conic-gradient(${SDG_COLORS.map((c, i) => `${c} ${i * STEP}deg ${(i + 1) * STEP - 1.5}deg, transparent ${(i + 1) * STEP - 1.5}deg ${(i + 1) * STEP}deg`).join(', ')})`

export default function Commitment() {
  return (
    <section id="compromiso" className="section">
      <div className="container">
        <div className="commit__head">
          <div data-reveal>
            <p className="eyebrow">Nuestro compromiso global</p>
            <h2 className="title">
              <RevealText text="Alianzas que" />
              <RevealText text="impactan" start={2} mark />
            </h2>
            <p className="lead">
              Al elegir a SYNCRA Argentina, tu marca o empresa impacta directamente en la agenda global de
              sustentabilidad a través de dos Objetivos de Desarrollo Sostenible (ODS).
            </p>
          </div>
          <div className="sdg-wheel" data-reveal aria-hidden="true">
            <span className="sdg-wheel__ring" style={{ background: WHEEL }} />
            <span className="sdg-wheel__center">ODS</span>
          </div>
        </div>

        <div className="cards cards--2">
          <article className="ods" data-reveal data-spot data-tilt style={{ '--ods': '#ff3a21' }}>
            <span className="ods__badge">
              <strong>5</strong>
              Igualdad de género
            </span>
            <p>
              Promovemos el empleo de calidad y el desarrollo profesional sostenible para mujeres especialistas
              dentro del sector tecnológico-lingüístico.
            </p>
          </article>
          <article
            className="ods"
            data-reveal
            data-spot
            data-tilt
            style={{ '--ods': '#dd1367', transitionDelay: '100ms' }}
          >
            <span className="ods__badge">
              <strong>10</strong>
              Reducción de las desigualdades
            </span>
            <p>
              Rompemos barreras mediante el diseño y la implementación de accesibilidad universal en entornos
              corporativos y educativos.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
