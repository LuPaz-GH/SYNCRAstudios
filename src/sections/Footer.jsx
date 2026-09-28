import Logo from '../components/Logo'

const PETALS = ['#8e44ad', '#e84393', '#f5b800', '#27ae60', '#3498db']

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
        <p className="footer__copy">© {new Date().getFullYear()} SYNCRA Studios · Tucumán, Argentina</p>
      </div>
    </footer>
  )
}
