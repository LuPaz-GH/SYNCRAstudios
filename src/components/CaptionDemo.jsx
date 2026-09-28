import { useEffect, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const LINES = [
  'Transmitimos la esencia humana en cada mensaje.',
  'Subtitulado en vivo para eventos, congresos y streaming.',
  '(Aplausos)',
  'Conectamos personas, palabra por palabra.',
]

function formatTime(total) {
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

// Pantalla de transmisión simulada donde los subtítulos se escriben en tiempo real.
export default function CaptionDemo() {
  const reduced = usePrefersReducedMotion()
  const [lineIndex, setLineIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [seconds, setSeconds] = useState(754)

  useEffect(() => {
    if (reduced) return
    const line = LINES[lineIndex]
    if (chars < line.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 35 + Math.random() * 45)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setLineIndex((i) => (i + 1) % LINES.length)
      setChars(0)
    }, 2200)
    return () => clearTimeout(t)
  }, [chars, lineIndex, reduced])

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [reduced])

  const text = reduced ? LINES[0] : LINES[lineIndex].slice(0, chars)

  return (
    <figure className="screen">
      <div className="screen__top" aria-hidden="true">
        <span className="screen__live">
          <span className="screen__rec" /> EN VIVO
        </span>
        <span className="screen__time">{formatTime(seconds)}</span>
      </div>

      <div className="screen__wave" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${(i % 9) * -0.13 + i * -0.05}s` }} />
        ))}
      </div>

      <figcaption className="screen__caption" aria-hidden="true">
        <span>{text}</span>
        <span className="screen__caret" />
      </figcaption>
      <span className="visually-hidden">Demostración de subtitulado en vivo: {LINES.join(' ')}</span>
    </figure>
  )
}
