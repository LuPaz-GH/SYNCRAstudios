import { whatsappLink } from '../../utils/whatsapp'

// Botón flotante de WhatsApp, siempre visible abajo a la derecha.
export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={whatsappLink('Hola SYNCRA, quiero hacer una consulta.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en otra pestaña)"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.6 7.6c.3-.3.8-.3 1 .1l.9 1.8c.2.3.1.7-.2 1l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.3-.3.7-.4 1-.2l1.8.9c.4.2.4.7.1 1l-.8.8c-.5.5-1.3.7-2 .4a9.6 9.6 0 0 1-5.3-5.3c-.3-.7-.1-1.5.4-2z"
          fill="currentColor"
        />
      </svg>
      <span className="wa-float__label">WhatsApp</span>
    </a>
  )
}
