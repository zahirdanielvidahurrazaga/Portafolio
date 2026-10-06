import { useEffect } from 'react';
import KaizenWordmark from './KaizenWordmark';
import { CORREO, DOMICILIO, RESPONSABLES, SITIO, LEGAL_ACTUALIZADO, WHATSAPP_VISIBLE } from '../data/contacto';
import '../styles/Legal.css';

/**
 * Páginas legales: /aviso-de-privacidad y /terminos (main.jsx elige cuál
 * mostrar por la ruta). Redactadas desde cero el 2026-10-05 para cómo funciona
 * ESTE sitio: el formulario arma un mensaje y lo abre en WhatsApp, no hay base
 * de datos ni cookies de rastreo; lo único que se guarda en el navegador es la
 * preferencia de tema.
 * ⚠️ No es asesoría legal: conviene que un abogado las revise. Los datos
 * (responsables, domicilio, correo) salen de src/data/contacto.js.
 */
const responsables = RESPONSABLES.join(' y ');

function Privacidad() {
  return (
    <>
      <h1>
        Aviso de <em>privacidad</em>
      </h1>
      <p className="legal-lede">
        En KaiZen cuidamos tus datos personales. Este aviso explica qué datos recabamos en {SITIO}, para qué
        los usamos y cómo puedes ejercer tus derechos, conforme a la Ley Federal de Protección de Datos
        Personales en Posesión de los Particulares.
      </p>

      <h2>1. Quién es responsable de tus datos</h2>
      <p>
        KaiZen es el nombre comercial con el que trabajan {responsables}, personas físicas, quienes son
        responsables del tratamiento de tus datos personales, con domicilio en {DOMICILIO}.
      </p>
      <p>
        Para cualquier asunto relacionado con tus datos puedes escribirnos a{' '}
        <a href={`mailto:${CORREO}`}>{CORREO}</a>.
      </p>

      <h2>2. Qué datos recabamos</h2>
      <p>Cuando nos escribes a través del formulario de contacto, por WhatsApp o por correo, podemos recabar:</p>
      <ul>
        <li>Nombre.</li>
        <li>Correo electrónico.</li>
        <li>Número de teléfono y nombre de perfil, si nos contactas por WhatsApp.</li>
        <li>El tipo de proyecto que te interesa y la información sobre tu negocio que decidas compartirnos.</li>
      </ul>
      <p>
        No te pedimos datos personales sensibles (por ejemplo, de salud, religión u origen étnico). Te
        pedimos no compartirlos en tus mensajes.
      </p>

      <h2>3. Para qué usamos tus datos</h2>
      <p>Usamos tus datos únicamente para:</p>
      <ul>
        <li>Responder tu mensaje y atender tu solicitud.</li>
        <li>Entender tu proyecto y prepararte una propuesta o cotización.</li>
        <li>Dar seguimiento a la conversación que tú iniciaste.</li>
      </ul>
      <p>
        No usamos tus datos para fines distintos a estos, no te enviamos publicidad sin tu consentimiento y
        no los vendemos. Si llegas a contratar un servicio, el tratamiento de tus datos dentro del proyecto
        se rige además por el contrato o propuesta que firmemos.
      </p>

      <h2>4. Cómo funciona el formulario</h2>
      <p>
        El formulario de este sitio no guarda tu información en ninguna base de datos: al enviarlo, arma un
        mensaje y lo abre en WhatsApp para que tú decidas mandarlo. A partir de ahí, la conversación ocurre
        en WhatsApp y está sujeta también a las condiciones y al aviso de privacidad de ese servicio.
      </p>

      <h2>5. Con quién compartimos tus datos</h2>
      <p>
        No compartimos tus datos con terceros, salvo cuando una autoridad competente lo requiera conforme a
        la ley. Para operar usamos proveedores que tratan información por nuestra cuenta, como el servicio
        de alojamiento del sitio (Cloudflare) y las plataformas por las que nos escribes (WhatsApp o tu
        proveedor de correo).
      </p>

      <h2>6. Cookies y tecnologías similares</h2>
      <p>
        Este sitio no usa cookies de rastreo ni de publicidad. Solo guarda en tu propio navegador tu
        preferencia de tema claro u oscuro, y puedes borrarla cuando quieras desde la configuración de tu
        navegador. Nuestro proveedor de alojamiento puede procesar datos técnicos de la conexión, como la
        dirección IP, para mantener el sitio seguro y funcionando.
      </p>

      <h2>7. Cuánto tiempo conservamos tus datos</h2>
      <p>
        Solo durante el tiempo necesario para atender tu solicitud y dar seguimiento a la relación que
        tengamos contigo, y después el que exijan las obligaciones legales aplicables.
      </p>

      <h2>8. Tus derechos</h2>
      <p>
        Tienes derecho a acceder a tus datos, rectificarlos si son inexactos, cancelarlos u oponerte a su
        uso (derechos ARCO), así como a revocar tu consentimiento o limitar el uso de tus datos. Para
        hacerlo, escríbenos a <a href={`mailto:${CORREO}`}>{CORREO}</a> indicando:
      </p>
      <ul>
        <li>Tu nombre y un medio para responderte.</li>
        <li>Un documento que acredite tu identidad (o la de tu representante).</li>
        <li>Qué derecho quieres ejercer y sobre qué datos.</li>
      </ul>
      <p>Te responderemos en los plazos que establece la ley.</p>
      <p>
        Si consideras que tu derecho a la protección de datos fue vulnerado, puedes acudir a la autoridad
        competente en la materia.
      </p>

      <h2>9. Cambios a este aviso</h2>
      <p>
        Si actualizamos este aviso, publicaremos la nueva versión en esta misma página, con su fecha de
        actualización.
      </p>
    </>
  );
}

function Terminos() {
  return (
    <>
      <h1>
        Términos y <em>condiciones</em>
      </h1>
      <p className="legal-lede">
        Estos términos regulan el uso de {SITIO} y explican, en general, cómo trabajamos. Al usar el sitio
        los aceptas.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        KaiZen es el nombre comercial con el que {responsables}, personas físicas con domicilio en{' '}
        {DOMICILIO}, ofrecen servicios de identidad de marca, redes sociales, sitios web, tiendas en línea,
        punto de venta, apps y automatización. Contacto: <a href={`mailto:${CORREO}`}>{CORREO}</a> ·
        WhatsApp {WHATSAPP_VISIBLE}.
      </p>

      <h2>2. Uso del sitio</h2>
      <p>
        Puedes navegar y compartir este sitio libremente. Te pedimos usarlo de forma lícita y no intentar
        dañarlo, interferir con su funcionamiento ni acceder a partes que no son públicas.
      </p>

      <h2>3. La información del sitio no es una cotización</h2>
      <p>
        Los servicios, ejemplos y textos de este sitio son informativos. No constituyen una oferta ni una
        cotización: el alcance, los entregables, los tiempos y el precio de cada proyecto se definen por
        escrito en una propuesta para tu caso.
      </p>

      <h2>4. Cómo contratamos</h2>
      <p>
        Antes de empezar, acordamos por escrito qué incluye el proyecto. Lo que no esté en la propuesta
        aceptada se considera fuera de alcance y se cotiza por separado. Si durante el proyecto hace falta
        algo adicional, te lo decimos antes y solo lo hacemos con tu autorización.
      </p>
      <p>
        Si algo de estos términos no coincide con la propuesta o el contrato de tu proyecto, manda lo que
        dice el documento firmado o aceptado por ambas partes.
      </p>

      <h2>5. Servicios de terceros</h2>
      <p>
        Muchos proyectos dependen de servicios que no son nuestros y que tienen su propio costo, como el
        dominio, el alojamiento, las cuentas de desarrollador de Apple y Google, los procesadores de pago,
        los servicios de inteligencia artificial y otras plataformas, la publicidad pagada en redes o
        buscadores, y la fotografía o video profesional.
      </p>
      <p>
        Salvo que la propuesta diga otra cosa, esos costos no están incluidos y los cubre el cliente,
        idealmente a su nombre, para que las cuentas y los activos sean suyos. Te avisamos con anticipación
        cuáles hacen falta en tu proyecto. Cada uno se rige por sus propios términos, y no somos
        responsables por sus cambios de precio, fallas o interrupciones.
      </p>

      <h2>6. Mantenimiento y soporte</h2>
      <p>
        La entrega de un proyecto no incluye mantenimiento ni soporte continuo, salvo que se contrate un
        plan. Los cambios o funciones nuevas fuera de lo acordado se cotizan aparte.
      </p>

      <h2>7. Propiedad intelectual</h2>
      <p>
        La marca KaiZen y los textos, diseños y animaciones de este sitio son nuestros; no puedes copiarlos
        ni usarlos sin permiso. Los proyectos de clientes que mostramos se publican con su autorización, y
        sus nombres y marcas pertenecen a sus titulares.
      </p>
      <p>
        Lo que construimos para ti pasa a ser tuyo conforme a lo acordado en tu propuesta o contrato, una
        vez liquidado el proyecto.
      </p>

      <h2>8. Responsabilidad</h2>
      <p>
        Procuramos que el sitio esté disponible y que su información sea correcta, pero no garantizamos
        que funcione sin interrupciones ni que esté libre de errores. No somos responsables por daños
        derivados del uso del sitio ni por el contenido de los sitios o servicios de terceros a los que
        enlaza.
      </p>

      <h2>9. Privacidad</h2>
      <p>
        El tratamiento de tus datos personales se explica en nuestro{' '}
        <a href="/aviso-de-privacidad">aviso de privacidad</a>.
      </p>

      <h2>10. Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos. La versión vigente es siempre la publicada en esta página, con
        su fecha de actualización.
      </p>

      <h2>11. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se
        resolverá ante los tribunales competentes del domicilio de KaiZen, salvo que la ley disponga otra
        cosa.
      </p>
    </>
  );
}

export default function Legal({ tipo }) {
  useEffect(() => {
    document.title = `${tipo === 'privacidad' ? 'Aviso de privacidad' : 'Términos y condiciones'} · KaiZen`;
    window.scrollTo(0, 0);
  }, [tipo]);

  return (
    <div className="legal">
      <header className="legal-top">
        <a href="/" className="legal-marca" aria-label="KaiZen, volver al inicio">
          <KaizenWordmark height={18} />
        </a>
        <a href="/" className="legal-volver">← Volver al sitio</a>
      </header>

      <main className="legal-cuerpo">
        <div className="legal-rule">
          <span>Legal</span>
          <span>Actualizado: {LEGAL_ACTUALIZADO}</span>
        </div>
        {tipo === 'privacidad' ? <Privacidad /> : <Terminos />}
      </main>

      <footer className="legal-pie">
        <span>© {new Date().getFullYear()} KaiZen</span>
        <nav>
          <a href="/aviso-de-privacidad">Aviso de privacidad</a>
          <a href="/terminos">Términos y condiciones</a>
        </nav>
      </footer>
    </div>
  );
}
