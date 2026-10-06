import { useEffect } from 'react';
import KaizenWordmark from './KaizenWordmark';
import LangToggle from './LangToggle';
import { useLang } from '../lib/LangContext';
import { CORREO, DOMICILIO, RESPONSABLES, SITIO, LEGAL_ACTUALIZADO, LEGAL_ACTUALIZADO_EN, WHATSAPP_VISIBLE } from '../data/contacto';
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
        Este sitio no usa cookies de rastreo ni de publicidad. Solo guarda en tu propio navegador tus
        preferencias de tema claro u oscuro y de idioma, y puedes borrarlas cuando quieras desde la configuración de tu
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

/* ── Inglés ─────────────────────────────────────────────────────────────
   Versión de cortesía: el aviso se rige por la ley mexicana y lo que manda es
   la versión en español (se dice en el texto). */
const NOTA_EN = (
  <p className="legal-nota">
    This is a courtesy translation. The Spanish version of this document is the one that governs.
  </p>
);

function PrivacyEn() {
  return (
    <>
      <h1>
        Privacy <em>notice</em>
      </h1>
      <p className="legal-lede">
        At KaiZen we take care of your personal data. This notice explains what data we collect at {SITIO}, what
        we use it for and how you can exercise your rights, under Mexico’s Federal Law on the Protection of
        Personal Data Held by Private Parties.
      </p>
      {NOTA_EN}

      <h2>1. Who is responsible for your data</h2>
      <p>
        KaiZen is the trade name under which {responsables}, individuals, work. They are responsible for
        processing your personal data, with an address at {DOMICILIO}, Mexico.
      </p>
      <p>
        For anything related to your data you can write to us at <a href={`mailto:${CORREO}`}>{CORREO}</a>.
      </p>

      <h2>2. What data we collect</h2>
      <p>When you contact us through the contact form, WhatsApp or email, we may collect:</p>
      <ul>
        <li>Name.</li>
        <li>Email address.</li>
        <li>Phone number and profile name, if you contact us on WhatsApp.</li>
        <li>The type of project you’re interested in and any information about your business you choose to share.</li>
      </ul>
      <p>
        We don’t ask for sensitive personal data (for example, about health, religion or ethnic origin). Please
        don’t include it in your messages.
      </p>

      <h2>3. What we use your data for</h2>
      <p>We use your data only to:</p>
      <ul>
        <li>Reply to your message and handle your request.</li>
        <li>Understand your project and prepare a proposal or quote.</li>
        <li>Follow up on the conversation you started.</li>
      </ul>
      <p>
        We don’t use your data for any other purpose, we don’t send you advertising without your consent and we
        don’t sell it. If you hire a service, the handling of your data within the project is also governed by the
        contract or proposal we sign.
      </p>

      <h2>4. How the form works</h2>
      <p>
        The form on this site doesn’t store your information in any database: when you submit it, it builds a
        message and opens it in WhatsApp so you can decide whether to send it. From there, the conversation takes
        place on WhatsApp and is also subject to that service’s terms and privacy notice.
      </p>

      <h2>5. Who we share your data with</h2>
      <p>
        We don’t share your data with third parties, except when a competent authority requires it by law. To
        operate we use providers that process information on our behalf, such as the site’s hosting service
        (Cloudflare) and the platforms you use to reach us (WhatsApp or your email provider).
      </p>

      <h2>6. Cookies and similar technologies</h2>
      <p>
        This site doesn’t use tracking or advertising cookies. It only stores your light or dark theme and
        language preferences in your own browser, and you can delete them at any time from your browser settings.
        Our hosting provider may process technical connection data, such as your IP address, to keep the site
        secure and running.
      </p>

      <h2>7. How long we keep your data</h2>
      <p>
        Only for as long as needed to handle your request and follow up on our relationship with you, and then as
        long as applicable legal obligations require.
      </p>

      <h2>8. Your rights</h2>
      <p>
        You have the right to access your data, correct it if it’s inaccurate, delete it or object to its use
        (ARCO rights), as well as to withdraw your consent or limit the use of your data. To do so, email us at{' '}
        <a href={`mailto:${CORREO}`}>{CORREO}</a> including:
      </p>
      <ul>
        <li>Your name and a way to reply to you.</li>
        <li>A document proving your identity (or your representative’s).</li>
        <li>Which right you want to exercise and over which data.</li>
      </ul>
      <p>We’ll reply within the time limits set by law.</p>
      <p>If you believe your right to data protection has been violated, you can contact the competent authority.</p>

      <h2>9. Changes to this notice</h2>
      <p>If we update this notice, we’ll publish the new version on this same page, with its update date.</p>
    </>
  );
}

function TermsEn() {
  return (
    <>
      <h1>
        Terms & <em>conditions</em>
      </h1>
      <p className="legal-lede">
        These terms govern the use of {SITIO} and explain, in general, how we work. By using the site you accept
        them.
      </p>
      {NOTA_EN}

      <h2>1. Who we are</h2>
      <p>
        KaiZen is the trade name under which {responsables}, individuals with an address at {DOMICILIO}, Mexico,
        offer brand identity, social media, websites, online stores, point of sale, apps and automation services.
        Contact: <a href={`mailto:${CORREO}`}>{CORREO}</a> · WhatsApp {WHATSAPP_VISIBLE}.
      </p>

      <h2>2. Use of the site</h2>
      <p>
        You may browse and share this site freely. We ask you to use it lawfully and not to try to damage it,
        interfere with how it works or access parts that aren’t public.
      </p>

      <h2>3. The information on this site is not a quote</h2>
      <p>
        The services, examples and texts on this site are for information only. They are not an offer or a quote:
        the scope, deliverables, timeline and price of each project are defined in writing in a proposal for your
        case.
      </p>

      <h2>4. How we work together</h2>
      <p>
        Before starting, we agree in writing on what the project includes. Anything not in the accepted proposal
        is out of scope and quoted separately. If something additional is needed during the project, we tell you
        first and only do it with your approval.
      </p>
      <p>
        If anything in these terms differs from your project’s proposal or contract, the document signed or
        accepted by both parties prevails.
      </p>

      <h2>5. Third-party services</h2>
      <p>
        Many projects rely on services that aren’t ours and have their own cost, such as the domain, hosting,
        Apple and Google developer accounts, payment processors, artificial intelligence services and other
        platforms, paid advertising on social media or search engines, and professional photography or video.
      </p>
      <p>
        Unless the proposal says otherwise, those costs aren’t included and are covered by the client, ideally in
        their own name so the accounts and assets belong to them. We let you know in advance which ones your
        project needs. Each is governed by its own terms, and we’re not responsible for their price changes,
        failures or outages.
      </p>

      <h2>6. Maintenance and support</h2>
      <p>
        Delivering a project doesn’t include ongoing maintenance or support unless a plan is hired. Changes or new
        features beyond what was agreed are quoted separately.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The KaiZen brand and the texts, designs and animations on this site are ours; you may not copy or use them
        without permission. The client projects we show are published with their authorization, and their names
        and brands belong to their owners.
      </p>
      <p>
        What we build for you becomes yours as agreed in your proposal or contract, once the project is paid in
        full.
      </p>

      <h2>8. Liability</h2>
      <p>
        We do our best to keep the site available and its information accurate, but we don’t guarantee it will
        run without interruptions or be error-free. We’re not responsible for damages arising from the use of the
        site or for the content of third-party sites or services it links to.
      </p>

      <h2>9. Privacy</h2>
      <p>
        How we handle your personal data is explained in our <a href="/aviso-de-privacidad">privacy notice</a>.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>We may update these terms. The version in force is always the one published on this page, with its update date.</p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of the United Mexican States. Any dispute will be resolved before the
        competent courts of KaiZen’s domicile, unless the law provides otherwise.
      </p>
    </>
  );
}

export default function Legal({ tipo }) {
  const { lang, t } = useLang();
  const esPriv = tipo === 'privacidad';
  useEffect(() => {
    document.title = `${
      esPriv ? t({ es: 'Aviso de privacidad', en: 'Privacy notice' }) : t({ es: 'Términos y condiciones', en: 'Terms & conditions' })
    } · KaiZen`;
  }, [esPriv, t]);
  useEffect(() => window.scrollTo(0, 0), [tipo]);

  const cuerpo = esPriv ? (lang === 'en' ? <PrivacyEn /> : <Privacidad />) : lang === 'en' ? <TermsEn /> : <Terminos />;

  return (
    <div className="legal">
      <header className="legal-top">
        <a href="/" className="legal-marca" aria-label={t({ es: 'KaiZen, volver al inicio', en: 'KaiZen, back to home' })}>
          <KaizenWordmark height={18} />
        </a>
        <div className="legal-top-acciones">
          <LangToggle />
          <a href="/" className="legal-volver">
            {t({ es: '← Volver al sitio', en: '← Back to site' })}
          </a>
        </div>
      </header>

      <main className="legal-cuerpo">
        <div className="legal-rule">
          <span>Legal</span>
          <span>
            {t({ es: 'Actualizado:', en: 'Updated:' })} {t({ es: LEGAL_ACTUALIZADO, en: LEGAL_ACTUALIZADO_EN })}
          </span>
        </div>
        {cuerpo}
      </main>

      <footer className="legal-pie">
        <span>© {new Date().getFullYear()} KaiZen</span>
        <nav>
          <a href="/aviso-de-privacidad">{t({ es: 'Aviso de privacidad', en: 'Privacy notice' })}</a>
          <a href="/terminos">{t({ es: 'Términos y condiciones', en: 'Terms & conditions' })}</a>
        </nav>
      </footer>
    </div>
  );
}
