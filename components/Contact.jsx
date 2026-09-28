import { useState } from 'react'
import Icon from './Icon'
import RevealText from './RevealText'

const PHONE = '5493814480873'

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

// El formulario no necesita servidor: arma el mensaje y abre una conversación de WhatsApp.
export default function Contact() {
  const [form, setForm] = useState({ name: '', org: '', service: SERVICES[0], message: '' })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const text = [
      `Hola SYNCRA, soy ${form.name}${form.org ? ` de ${form.org}` : ''}.`,
      `Me interesa: ${form.service}.`,
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
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
                <a href={`tel:+${PHONE}`}>+54 9 381 448-0873</a>
              </div>
            </li>
            <li>
              <Icon name="globe" />
              <div>
                <span>Web oficial</span>
                <a href="https://www.syncra.com" target="_blank" rel="noreferrer">
                  www.syncra.com
                </a>
              </div>
            </li>
            <li>
              <Icon name="at" />
              <div>
                <span>Redes sociales</span>
                <strong>@syncra</strong>
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
          <p className="form__note">Se abrirá WhatsApp con tu mensaje listo para enviar.</p>
        </form>
      </div>
    </section>
  )
}
