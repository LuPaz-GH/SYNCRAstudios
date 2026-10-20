import { useState } from 'react'
import Icon from '../common/Icon'
import RevealText from '../common/RevealText'
import { sendContactMessage } from '../../services/public.service'
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE, whatsappLink } from '../../utils/whatsapp'
import { CONTACT_EMAIL, INSTAGRAM } from '../../utils/contact'

const SERVICES = [
  'Subtitulado en vivo (evento presencial)',
  'Congreso, webinar o streaming híbrido',
  'Transmisión en YouTube',
  'Subtitulado de película, serie o documental',
  'Video institucional o publicitario',
  'Cursos, e-learning o tutoriales',
  'Glosario a medida',
  'Otro',
]

// El formulario arma el mensaje y abre una conversación de WhatsApp.
// Además guarda la consulta para que el equipo la vea en el panel (sección Mensajes).
export default function Contact() {
  const [form, setForm] = useState({ name: '', org: '', email: '', service: SERVICES[0], message: '' })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    sendContactMessage(form).catch(() => {})
    const text = [
      `Hola SYNCRA, soy ${form.name}${form.org ? ` de ${form.org}` : ''}.`,
      `Me interesa: ${form.service}.`,
      form.message,
      form.email && `Mi email: ${form.email}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappLink(text), '_blank', 'noopener')
  }

  return (
    <section id="contacto" className="section section--alt contact">
      <div className="container contact__grid">
        <div data-reveal>
          <p className="eyebrow">Contacto</p>
          <h2 className="title">
            <RevealText text="Hagamos que tu mensaje" />
            <RevealText text="llegue a todas las personas." start={4} mark />
          </h2>
          <p className="lead">
            Contanos sobre tu evento, transmisión o contenido y te respondemos con una propuesta a medida.
          </p>

          <ul className="contact__list">
            <li>
              <Icon name="phone" />
              <div>
                <span>Teléfono y WhatsApp</span>
                <a href={`tel:+${WHATSAPP_PHONE}`}>{WHATSAPP_DISPLAY}</a>
              </div>
            </li>
            <li>
              <Icon name="mail" />
              <div>
                <span>Email</span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="contact__email">
                  {/* <wbr> permite cortarlo después de la @ si no entra en una línea */}
                  {CONTACT_EMAIL.split('@')[0]}@<wbr />
                  {CONTACT_EMAIL.split('@')[1]}
                </a>
              </div>
            </li>
            <li>
              <Icon name="instagram" />
              <div>
                <span>Instagram</span>
                <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM.user}
                </a>
              </div>
            </li>
          </ul>
        </div>

        <form className="form" onSubmit={onSubmit} data-reveal>
          <div className="form__row">
            <label>
              Nombre
              <input required value={form.name} onChange={update('name')} autoComplete="name" />
            </label>
            <label>
              Empresa o institución <em>(opcional)</em>
              <input value={form.org} onChange={update('org')} autoComplete="organization" />
            </label>
          </div>
          <label>
            Email <em>(opcional, para responderte por correo)</em>
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" maxLength={190} />
          </label>
          <label>
            ¿Qué necesitás?
            <select value={form.service} onChange={update('service')}>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Contanos más <em>(fecha, duración, plataforma…)</em>
            <textarea rows="4" value={form.message} onChange={update('message')} />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Enviar por WhatsApp <Icon name="arrow" size={20} />
          </button>
          <p className="form__note">
            Se abrirá WhatsApp con tu mensaje listo para enviar. Al enviarlo aceptás nuestra{' '}
            <a href="/privacidad">política de privacidad</a>.
          </p>
        </form>
      </div>
    </section>
  )
}
