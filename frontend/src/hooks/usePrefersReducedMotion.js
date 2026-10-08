import { useEffect, useState } from 'react'
import { A11Y_EVENT, isStill } from '../utils/accessibility'

const QUERY = '(prefers-reduced-motion: reduce)'
const read = () => window.matchMedia(QUERY).matches || isStill()

// Respeta la preferencia del sistema y el botón "Pausar animaciones" de la barra de accesibilidad:
// si la persona pidió menos movimiento, lo desactivamos.
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(read)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setReduced(read())
    media.addEventListener('change', onChange)
    window.addEventListener(A11Y_EVENT, onChange)
    return () => {
      media.removeEventListener('change', onChange)
      window.removeEventListener(A11Y_EVENT, onChange)
    }
  }, [])

  return reduced
}
