import { useEffect } from 'react'

// Efectos que reaccionan al mouse y al scroll:
// - [data-spot]: luz amarilla que sigue al mouse dentro del elemento.
// - [data-tilt]: inclinación 3D según la posición del mouse.
// - [data-parallax="0.2"]: el elemento se desplaza a otra velocidad al hacer scroll.
export default function useInteractions() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups = []

    document.querySelectorAll('[data-spot]').forEach((el) => {
      const tilt = !reduced && el.hasAttribute('data-tilt')
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        el.style.setProperty('--x', `${x}px`)
        el.style.setProperty('--y', `${y}px`)
        if (tilt) {
          el.style.setProperty('--ry', `${(x / r.width - 0.5) * 10}deg`)
          el.style.setProperty('--rx', `${(0.5 - y / r.height) * 10}deg`)
        }
      }
      const onLeave = () => {
        el.style.setProperty('--rx', '0deg')
        el.style.setProperty('--ry', '0deg')
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      })
    })

    if (!reduced) {
      const items = [...document.querySelectorAll('[data-parallax]')]
      let frame = 0
      const update = () => {
        items.forEach((el) => {
          const top = el.parentElement.getBoundingClientRect().top
          el.style.transform = `translate3d(0, ${top * parseFloat(el.dataset.parallax)}px, 0)`
        })
      }
      const onScroll = () => {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(update)
      }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanups.push(() => {
        cancelAnimationFrame(frame)
        window.removeEventListener('scroll', onScroll)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
