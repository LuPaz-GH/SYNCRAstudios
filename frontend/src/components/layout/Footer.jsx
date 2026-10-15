import Icon from '../common/Icon'
import Logo from '../common/Logo'

const PETALS = ['#8e44ad', '#e84393', '#f5b800', '#27ae60', '#3498db']
const INSTAGRAM = { url: 'https://www.instagram.com/syncra_studios/', user: '@syncra_studios' }

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__giant" aria-hidden="true">
        SYNCRA
      </p>
      <div className="container footer__inner">
        <Logo size={48} />
        <p className="footer__org">
          Un servicio de
          <svg className="footer__flower" width="26" height="26" viewBox="-12 -12 24 24" aria-hidden="true">
            {PETALS.map((color, i) => (
              <ellipse key={color} cx="0" cy="-6" rx="4" ry="6" fill={color} transform={`rotate(${i * 72})`} />
            ))}
          </svg>
          <strong>Mujeres en Red</strong>
        </p>
        <a
          href={INSTAGRAM.url}
          className="footer__social"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de SYNCRA Studios (${INSTAGRAM.user}), se abre en otra pestaña`}
        >
          <span className="footer__social-icon">
            <Icon name="instagram" size={22} />
          </span>
          {INSTAGRAM.user}
        </a>
        <a href="/panel" className="footer__staff">
          <Icon name="lock" size={22} /> Acceso equipo
        </a>
      </div>
      <div className="container footer__bottom">
        <p className="footer__copy">© {new Date().getFullYear()} SYNCRA Studios · Tucumán, Argentina</p>
        <a href="/privacidad" className="footer__legal">
          Política de privacidad
        </a>
      </div>
    </footer>
  )
}
