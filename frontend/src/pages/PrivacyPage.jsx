import SimplePage from '../components/layout/SimplePage'
import { WHATSAPP_DISPLAY, whatsappLink } from '../utils/whatsapp'

// Política de privacidad (Ley 25.326 de Protección de los Datos Personales, Argentina).
// BORRADOR: tiene que revisarlo SYNCRA (y, idealmente, un/a abogado/a) antes de darlo por final.
const UPDATED = 'octubre de 2026'

export default function PrivacyPage() {
  const contact = (
    <a href={whatsappLink('Hola SYNCRA, quiero hacer una consulta sobre mis datos personales.')} target="_blank" rel="noopener noreferrer">
      WhatsApp {WHATSAPP_DISPLAY}
    </a>
  )

  return (
    <SimplePage title="Política de privacidad">
      <article className="container legal">
        <p className="eyebrow">Tus datos</p>
        <h1 className="title">Política de privacidad</h1>
        <p className="legal__updated">Última actualización: {UPDATED}</p>

        <p className="lead">
          En SYNCRA Studios cuidamos tus datos como cuidamos cada palabra: con respeto y responsabilidad. Acá te
          contamos, en simple, qué datos guardamos, para qué y cuáles son tus derechos.
        </p>

        <h2>1. Quiénes somos</h2>
        <p>
          SYNCRA Studios es un servicio de Mujeres en Red, con base en Tucumán, Argentina. Somos responsables de los
          datos personales que nos dejás en este sitio. Para cualquier consulta sobre tus datos, escribinos por{' '}
          {contact}.
        </p>

        <h2>2. Qué datos recopilamos</h2>
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> tu nombre, tu empresa o institución (si la completás), el servicio
            que te interesa y el mensaje que nos escribís.
          </li>
          <li>
            <strong>WhatsApp:</strong> si seguís la conversación por WhatsApp, ese intercambio también se rige por la
            política de privacidad de WhatsApp.
          </li>
          <li>
            <strong>Datos técnicos mínimos:</strong> la dirección IP desde la que se envía el formulario, que usamos
            de forma temporal para evitar el envío masivo de mensajes no deseados (spam).
          </li>
          <li>
            <strong>Preferencias de accesibilidad:</strong> si elegís letra más grande, alto contraste o pausar
            animaciones, esa preferencia se guarda solo en tu navegador. No la recibimos.
          </li>
        </ul>
        <p>No usamos cookies de publicidad ni herramientas para seguir lo que hacés en otros sitios.</p>

        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Responder tu consulta y preparar una propuesta a medida.</li>
          <li>Hacer el seguimiento de tu pedido y coordinar el servicio si lo contratás.</li>
        </ul>
        <p>
          <strong>No vendemos, alquilamos ni cedemos tus datos</strong> a terceros para publicidad ni para ningún otro
          fin.
        </p>

        <h2>4. Tu consentimiento</h2>
        <p>
          Al enviar el formulario de contacto, nos das tu consentimiento para usar esos datos con los fines
          descriptos en esta política. Completar el formulario es voluntario.
        </p>

        <h2>5. Dónde se guardan y quién puede verlos</h2>
        <p>
          Tus datos se guardan en una base de datos protegida. Solo puede verlos el equipo de SYNCRA, con usuario y
          contraseña personales, y cada acceso o cambio queda registrado.
        </p>
        <p>
          Para funcionar usamos proveedores de tecnología: Netlify (alojamiento del sitio) y TiDB Cloud (base de
          datos), cuyos servidores están en Estados Unidos. Al enviar el formulario, aceptás que tus datos se alojen
          en esos servidores, que cuentan con medidas de seguridad como el cifrado de la información en tránsito.
        </p>

        <h2>6. Cuánto tiempo los guardamos</h2>
        <p>
          Los conservamos mientras sean necesarios para atender tu consulta y, si nos contratás, durante la relación
          de trabajo. Podés pedirnos que los eliminemos en cualquier momento.
        </p>

        <h2>7. Tus derechos</h2>
        <p>Según la Ley 25.326 de Protección de los Datos Personales, tenés derecho a:</p>
        <ul>
          <li>
            <strong>Acceder</strong> a los datos que tenemos sobre vos. Te respondemos dentro de los 10 días corridos.
          </li>
          <li>
            <strong>Corregirlos o actualizarlos</strong> si están mal o incompletos.
          </li>
          <li>
            <strong>Pedir que los borremos.</strong>
          </li>
        </ul>
        <p>
          La corrección o el borrado los hacemos dentro de los 5 días hábiles. Para ejercer cualquiera de estos
          derechos, escribinos por {contact}. Es gratis.
        </p>

        <p className="legal__notice">
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto
          conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326. La Agencia de Acceso a la
          Información Pública, en su carácter de Órgano de Control de la Ley Nº 25.326, tiene la atribución de
          atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
          incumplimiento de las normas vigentes en materia de protección de datos personales.
        </p>

        <h2>8. Cambios en esta política</h2>
        <p>
          Si cambiamos algo importante, lo vamos a publicar en esta misma página con la nueva fecha de actualización.
        </p>
      </article>
    </SimplePage>
  )
}
