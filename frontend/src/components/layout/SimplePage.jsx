import { useEffect } from 'react'
import Icon from '../common/Icon'
import Logo from '../common/Logo'
import AccessibilityMenu from '../common/AccessibilityMenu'
import Footer from './Footer'

// Estructura para páginas sueltas (privacidad, error 404): logo arriba, contenido y pie.
export default function SimplePage({ title, children }) {
  useEffect(() => {
    document.title = `${title} | SYNCRA Studios`
    // Sin preloader en estas páginas: mostramos el logo ya dibujado.
    document.documentElement.classList.add('is-loaded')
  }, [title])

  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <header className="simple__header">
        <div className="container simple__bar">
          <a href="/" aria-label="SYNCRA Studios, ir al inicio">
            <Logo size={40} />
          </a>
          <a href="/" className="simple__back">
            <Icon name="home" size={20} /> Volver al inicio
          </a>
        </div>
      </header>
      <main id="contenido" className="simple">
        {children}
      </main>
      <Footer />
      <AccessibilityMenu />
    </>
  )
}
