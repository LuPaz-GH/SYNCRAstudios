const ROW_1 = ['Subtitulado en vivo', 'Eventos presenciales', 'Congresos y webinars', 'Streaming híbrido', 'YouTube']
const ROW_2 = ['Películas y series', 'Documentales', 'E-learning', 'Glosarios a medida', 'Videos institucionales']

function Row({ items, variant }) {
  // La lista va duplicada para que el bucle no se note.
  return (
    <div className={`marquee marquee--${variant}`}>
      <div className="marquee__track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  )
}

// Dos cintas cruzadas que se mueven en sentidos opuestos.
export default function Marquee() {
  return (
    <div className="marquees" role="region" aria-label="Servicios">
      <ul className="visually-hidden">
        {[...ROW_1, ...ROW_2].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true">
        <Row items={ROW_1} variant="yellow" />
        <Row items={ROW_2} variant="dark" />
      </div>
    </div>
  )
}
