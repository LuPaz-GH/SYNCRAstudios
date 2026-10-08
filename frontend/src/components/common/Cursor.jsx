import { useEffect, useRef } from 'react'

// Anillo amarillo que sigue al mouse con un pequeño retraso. Solo en computadoras con mouse;
// el cursor normal se mantiene visible para no perder usabilidad.
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const root = document.documentElement
    root.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let frame = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const interactive = e.target.closest('a, button, input, select, textarea, [data-spot]')
      ringRef.current.classList.toggle('cursor--hover', Boolean(interactive))
    }

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    loop()
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      root.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
