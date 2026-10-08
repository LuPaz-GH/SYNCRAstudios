import Icon from '../components/common/Icon'
import SimplePage from '../components/layout/SimplePage'
import { whatsappLink } from '../utils/whatsapp'

// Página para links rotos o direcciones que no existen.
export default function NotFoundPage() {
  return (
    <SimplePage title="Página no encontrada">
      <section className="container notfound">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 className="title">Esta página se perdió en la traducción.</h1>
        <p className="notfound__caption" aria-hidden="true">
          [ silencio ]
        </p>
        <p className="lead">
          La dirección que buscás no existe o cambió de lugar. Volvé al inicio o escribinos y te ayudamos.
        </p>
        <div className="notfound__actions">
          <a href="/" className="btn btn--primary">
            <Icon name="home" size={20} /> Ir al inicio
          </a>
          <a
            href={whatsappLink(`Hola SYNCRA, entré a un link que no funciona: ${window.location.href}`)}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </section>
    </SimplePage>
  )
}
