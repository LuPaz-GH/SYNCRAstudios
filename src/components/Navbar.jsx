import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'

const LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#en-vivo', label: 'En vivo' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#posproduccion', label: 'Posproducción' },
  { href: '#compromiso', label: 'Compromiso' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        progressRef.current?.style.setProperty('--progress', progress)
        setScrolled(window.scrollY > 20)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#inicio" className="nav__brand" onClick={close} aria-label="SYNCRA Studios, volver al inicio">
          <Logo size={40} />
        </a>

        <nav id="menu" className="nav__menu" aria-label="Principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a href="#contacto" className="btn btn--primary btn--sm" onClick={close}>
            Contacto
          </a>
        </nav>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className="nav__progress" ref={progressRef} aria-hidden="true" />
    </header>
  )
}
