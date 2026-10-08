import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Respeta la preferencia del sistema: si la persona pidió menos movimiento, lo desactivamos.
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
