import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const TEXT =
  'Mientras la IA procesa datos de manera literal, en SYNCRA capturamos el contexto, la intención y la verdadera esencia del lenguaje humano.'
const WORDS = TEXT.split(' ')
const KEYWORDS = ['SYNCRA', 'contexto,', 'intención', 'esencia']

// El texto queda fijo en pantalla y se va "subtitulando" palabra por palabra a medida que bajás.
export default function Manifesto() {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [lit, setLit] = useState(0)

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const update = () => {
      const r = ref.current.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const progress = Math.min(1, Math.max(0, -r.top / total))
      setLit(Math.round(progress * WORDS.length * 1.15))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <section ref={ref} className={`manifesto ${reduced ? 'manifesto--static' : ''}`} aria-label="Manifiesto">
      <div className="manifesto__sticky">
        <div className="container">
          <p className="eyebrow">Pulso humano</p>
          <p className="manifesto__text">
            {WORDS.map((word, i) => (
              <span
                key={i}
                className={`mw ${reduced || i < lit ? 'is-lit' : ''} ${KEYWORDS.includes(word) ? 'is-key' : ''}`}
              >
                {word}{' '}
              </span>
            ))}
          </p>
          <p className={`manifesto__sign ${reduced || lit >= WORDS.length ? 'is-lit' : ''}`}>
            Conectamos personas, palabra por palabra.
          </p>
        </div>
      </div>
    </section>
  )
}
