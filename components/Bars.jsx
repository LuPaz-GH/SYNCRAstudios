import { useMemo } from 'react'

const TONES = ['dark', 'mid', 'light']

// Generador pseudoaleatorio con semilla: el patrón es siempre el mismo en cada carga.
function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// El patrón de barras y puntos del folleto, animado como un ecualizador de audio.
export default function Bars({ cols = 12, seed = 7, className = '', ...rest }) {
  const columns = useMemo(() => {
    const rand = seeded(seed)
    return Array.from({ length: cols }, () => {
      const items = []
      const count = 2 + Math.floor(rand() * 2)
      for (let j = 0; j < count; j++) {
        items.push({ type: 'pill', tone: TONES[Math.floor(rand() * 3)], h: 44 + Math.floor(rand() * 90) })
        if (rand() > 0.55) items.push({ type: 'dot' })
      }
      return { items, offset: Math.floor(rand() * 70) }
    })
  }, [cols, seed])

  return (
    <div className={`bars ${className}`} aria-hidden="true" {...rest}>
      {columns.map((col, i) => (
        <div className="bars__col" key={i} style={{ marginTop: col.offset }}>
          {col.items.map((item, j) =>
            item.type === 'dot' ? (
              <span className="bars__dot" key={j} style={{ animationDelay: `${(i + j) * -0.4}s` }} />
            ) : (
              <span
                className={`bars__pill bars__pill--${item.tone}`}
                key={j}
                style={{ height: item.h, animationDelay: `${i * -0.27 + j * -0.6}s` }}
              />
            ),
          )}
        </div>
      ))}
    </div>
  )
}
