import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import SectionHead from './SectionHead';
import { WHATSAPP, WHATSAPP_VISIBLE, CORREO, REDES } from '../data/contacto';
import { useLang } from '../lib/LangContext';
import { useTheme } from '../lib/ThemeContext';
import '../styles/Footer.css';

// Las opciones siguen a las 7 líneas de "Lo que hacemos" (Servicios.jsx): si
// alguien vio un servicio ahí, espera encontrarlo aquí con el mismo nombre.
const TIPO_LABEL = {
  marca: { es: 'Identidad de marca', en: 'Brand identity' },
  redes: { es: 'Redes sociales', en: 'Social media' },
  lanzamiento: { es: 'Lanzamiento (marca + redes + landing)', en: 'Launch (brand + social + landing page)' },
  sitio: { es: 'Sitio web', en: 'Website' },
  tienda: { es: 'Tienda en línea o punto de venta', en: 'Online store or point of sale' },
  ia: { es: 'Automatización o IA', en: 'Automation or AI' },
  app: { es: 'App o experiencia digital', en: 'App or digital experience' },
  // Del capítulo Demos: quien solo quiere ver la demo de su giro antes de cotizar
  demo: { es: 'Ver una demo', en: 'See a demo' },
  otro: { es: 'Otra cosa', en: 'Something else' },
};

/*
 * LA LOSA (2026-11-11): la cabecera de Contacto va sobre una losa de mármol
 * VIVO (lib/marmol.js: fluye y se deja empujar con el cursor). Es el único
 * lugar del sitio con mármol —Zahir lo quiso como acento, no como fondo— y por
 * eso pesa: es donde se cierra el trato. El formulario queda abajo, en limpio.
 * Sin WebGL, o con prefers-reduced-motion, queda el degradado quieto del CSS.
 */
function Losa({ children }) {
  const zona = useRef(null);
  const canvas = useRef(null);
  const inst = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return undefined;
    let cancelado = false;
    import('../lib/marmol').then(({ crearMarmol }) => {
      if (cancelado || !zona.current) return;
      inst.current = crearMarmol(zona.current, canvas.current, { theme: themeRef.current });
      if (inst.current) zona.current.classList.add('is-viva');
    });
    return () => {
      cancelado = true;
      inst.current?.destroy();
      inst.current = null;
    };
  }, [reduced]);
  useEffect(() => {
    themeRef.current = theme;
    inst.current?.setTheme(theme);
  }, [theme]);
  return (
    <div ref={zona} className="footer-losa">
      <canvas ref={canvas} className="footer-losa-canvas" aria-hidden="true" />
      <div className="footer-losa-in">{children}</div>
    </div>
  );
}

const Footer = () => {
  const { lang, t } = useLang();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: '',
    descripcion: ''
  });
  const [status, setStatus] = useState('idle');
  const [enlace, setEnlace] = useState(''); // el wa.me que se abrió (respaldo si el navegador lo bloquea)
  const nombreRef = useRef(null);

  // "Cotizar este servicio" (Servicios.jsx) llega con el tipo ya elegido: el
  // cliente no tiene que volver a decir qué quiere.
  useEffect(() => {
    const onCotizar = (e) => {
      const tipo = e.detail?.tipo;
      if (tipo && TIPO_LABEL[tipo]) {
        setStatus('idle');
        setFormData((f) => ({ ...f, tipo }));
        // Ya eligió qué quiere: que escriba su nombre (sin mover la página)
        setTimeout(() => nombreRef.current?.focus({ preventScroll: true }), 900);
      }
    };
    window.addEventListener('kaizen:cotizar', onCotizar);
    return () => window.removeEventListener('kaizen:cotizar', onCotizar);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, tipo, descripcion } = formData;
    // El mensaje sale en el idioma del sitio (así le llega a KaiZen). Correo y
    // descripción son OPCIONALES (6-nov): cada campo obligatorio de menos es un
    // prospecto más que termina; el WhatsApp ya da con quién hablar.
    const tipoTxt = TIPO_LABEL[tipo] ? t(TIPO_LABEL[tipo]) : tipo;
    const en = lang === 'en';
    const lineas = [
      en ? `Hi, KaiZen team. I'm ${nombre}.` : `Hola, equipo KaiZen. Soy ${nombre}.`,
      `${en ? 'I need' : 'Me interesa'}: ${tipoTxt}`,
      email && `${en ? 'Email' : 'Correo'}: ${email}`,
      descripcion && `\n${descripcion}`,
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
    setEnlace(url);
    window.open(url, '_blank', 'noopener');
    setStatus('success');
    setFormData({ nombre: '', email: '', tipo: '', descripcion: '' });
    window.dispatchEvent(new Event('kai:gira')); // Kai lo celebra con una vuelta
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <footer id="contact" className="footer-section">

      <div className="section-container footer-contact">
        <Losa>
        <SectionHead
          num="09"
          label={t({ es: 'Contacto', en: 'Contact' })}
          lede={t({
            es: 'Cuéntanos tu idea y te respondemos en menos de 24 horas.',
            en: 'Tell us your idea and we’ll get back to you within 24 hours.',
          })}
        >
          {t({ es: <>¿Tienes un proyecto <em>en mente?</em></>, en: <>Have a project <em>in mind?</em></> })}
        </SectionHead>
        </Losa>

        <div className="footer-grid">
          {/* Columna izquierda: contacto directo */}
          <div className="footer-direct">
            {/* ¿Qué sigue? — quita la duda de "y luego qué pasa" justo antes de escribir */}
            <p className="footer-direct-label">{t({ es: '¿Qué sigue?', en: 'What happens next?' })}</p>
            <ol className="footer-pasos">
              {[
                { es: 'Te respondemos en menos de 24 horas.', en: 'We reply within 24 hours.' },
                { es: 'Platicamos 15 minutos y te enseñamos la demo de tu giro.', en: 'A 15-minute call where we show you the demo for your industry.' },
                { es: 'Te mandamos la propuesta por escrito: alcance, tiempos y costo.', en: 'We send a written proposal: scope, timeline and cost.' },
              ].map((x, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {t(x)}
                </li>
              ))}
            </ol>
            <p className="footer-direct-label">{t({ es: 'Escríbenos directo', en: 'Email us' })}</p>
            <a href={`mailto:${CORREO}`} className="footer-mail">
              {CORREO}
            </a>
            <a className="footer-wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
              WhatsApp · {WHATSAPP_VISIBLE} <span aria-hidden="true">↗</span>
            </a>
            <p className="footer-direct-label footer-redes-label">{t({ es: 'Síguenos', en: 'Follow us' })}</p>
            <nav className="footer-redes" aria-label={t({ es: 'Redes sociales', en: 'Social media' })}>
              {REDES.map(([nombre, url]) => (
                <a key={nombre} href={url} target="_blank" rel="noopener noreferrer">
                  {nombre} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-form-card">
            {/* Kai, sentado en la esquina del formulario: mira el campo que llenas y al
                enviar da una vuelta y te dice que falta darle enviar en WhatsApp */}
            <span
              className="kai-lugar kai-lugar--form"
              data-kai={status === 'success' ? 'contacto-listo' : 'contacto-form'}
              data-kai-talla="0.62"
              data-kai-mira="foco"
              data-kai-cel="whatsapp"
              data-kai-movil=""
              aria-hidden="true"
            />

            {status === 'success' ? (
              <div className="footer-success" role="status">
                <div className="success-icon">✓</div>
                <h3>{t({ es: '¡Tu mensaje está listo en WhatsApp!', en: 'Your message is ready in WhatsApp!' })}</h3>
                <p>
                  {t({
                    es: 'Solo dale enviar en el chat. Te respondemos en menos de 24 horas.',
                    en: 'Just hit send in the chat. We’ll reply within 24 hours.',
                  })}
                </p>
                <div className="footer-success-acciones">
                  <a href={enlace} target="_blank" rel="noopener noreferrer">
                    {t({ es: '¿No se abrió? Toca aquí', en: 'Didn’t open? Tap here' })} ↗
                  </a>
                  <button type="button" onClick={() => setStatus('idle')}>
                    {t({ es: 'Escribir otro mensaje', en: 'Write another message' })}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <fieldset className="form-field form-tipos">
                  <legend>{t({ es: '¿Qué necesitas?', en: 'What do you need?' })}</legend>
                  <div className="form-chips">
                    {Object.entries(TIPO_LABEL).map(([valor, texto]) => (
                      <label key={valor} className={`form-chip${formData.tipo === valor ? ' is-on' : ''}`}>
                        <input
                          type="radio"
                          name="tipo"
                          value={valor}
                          required
                          checked={formData.tipo === valor}
                          onChange={set('tipo')}
                        />
                        {t(texto)}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="f-nombre">{t({ es: 'Tu nombre', en: 'Your name' })}</label>
                    <input
                      id="f-nombre"
                      ref={nombreRef}
                      type="text"
                      autoComplete="name"
                      placeholder={t({ es: 'Nombre y negocio', en: 'Name and business' })}
                      required
                      value={formData.nombre}
                      onChange={set('nombre')}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="f-correo">
                      {t({ es: 'Correo', en: 'Email' })} <span className="form-opcional">{t({ es: '(opcional)', en: '(optional)' })}</span>
                    </label>
                    <input
                      id="f-correo"
                      type="email"
                      autoComplete="email"
                      placeholder={t({ es: 'tu@email.com', en: 'you@email.com' })}
                      value={formData.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="f-desc">
                    {t({ es: 'Cuéntanos un poco', en: 'Tell us a bit' })} <span className="form-opcional">{t({ es: '(opcional)', en: '(optional)' })}</span>
                  </label>
                  <textarea
                    id="f-desc"
                    placeholder={t({
                      es: 'Qué tienes en mente, para cuándo lo necesitas…',
                      en: 'What you have in mind, when you need it…',
                    })}
                    rows="3"
                    value={formData.descripcion}
                    onChange={set('descripcion')}
                  />
                </div>

                <button type="submit" className="form-submit">
                  <span>{t({ es: 'Enviar por WhatsApp', en: 'Send via WhatsApp' })}</span>
                  <span className="submit-arrow">→</span>
                </button>
                {/* Aviso simplificado: el formulario recaba datos personales */}
                <p className="form-aviso">
                  {t({
                    es: (
                      <>
                        Al enviar aceptas nuestro <a href="/aviso-de-privacidad">aviso de privacidad</a>. Usamos tus
                        datos solo para responderte.
                      </>
                    ),
                    en: (
                      <>
                        By sending, you accept our <a href="/aviso-de-privacidad">privacy notice</a>. We only use your
                        details to reply to you.
                      </>
                    ),
                  })}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Pie: firma de la revista ── */}
      <div className="footer-bottom">
        {/* La despedida: al llegar al final, Kai se despide mirando el botón de WhatsApp */}
        <span
          className="kai-lugar kai-lugar--adios"
          data-kai="despedida"
          data-kai-talla="0.62"
          data-kai-mira=".floating-whatsapp"
          data-kai-gana=""
          data-kai-movil=""
          aria-hidden="true"
        />
        <span>© {new Date().getFullYear()} KaiZen</span>
        <nav className="footer-legal" aria-label="Legal">
          <a href="/aviso-de-privacidad">{t({ es: 'Aviso de privacidad', en: 'Privacy notice' })}</a>
          <a href="/terminos">{t({ es: 'Términos y condiciones', en: 'Terms & conditions' })}</a>
        </nav>
        <span>{t({ es: 'Evoluciona la forma en que haces negocio', en: 'Evolve the way you do business' })}</span>
      </div>
    </footer>
  );
};

export default Footer;
