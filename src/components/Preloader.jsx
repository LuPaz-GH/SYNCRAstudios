import { useEffect, useState } from 'react'
import Logo from './Logo'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Pantalla de carga: el logo se dibuja y después la cortina sube.
// Al terminar agrega "is-loaded" al <html>, que es lo que dispara las animaciones de la portada.
export default function Preloader() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(reduced ? 'done' : 'loading')

  useEffect(() => {
    const root = document.documentElement
    if (reduced) {
      root.classList.add('is-loaded')
      return
    }
    document.body.style.overflow = 'hidden'
    const leave = setTimeout(() => {
      setPhase('leaving')
      root.classList.add('is-loaded')
      document.body.style.overflow = ''
    }, 1900)
    const done = setTimeout(() => setPhase('done'), 2800)
    return () => {
      clearTimeout(leave)
      clearTimeout(done)
      document.body.style.overflow = ''
    }
  }, [reduced])

  if (phase === 'done') return null

  return (
    <div className={`preloader preloader--${phase}`} aria-hidden="true">
      <Logo size={120} withText={false} />
      <p className="preloader__text">
        SYNCRA <span>STUDIOS</span>
      </p>
      <div className="preloader__bar">
        <span />
      </div>
    </div>
  )
}
