import React, { useState } from 'react';
import SectionHead from './SectionHead';
import { WHATSAPP, CORREO, REDES } from '../data/contacto';
import { useLang } from '../lib/LangContext';
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
  otro: { es: 'Otra cosa', en: 'Something else' },
};

const Footer = () => {
  const { lang, t } = useLang();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: '',
    descripcion: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, tipo, descripcion } = formData;
    // El mensaje sale en el idioma del sitio (así le llega a KaiZen)
    const tipoTxt = TIPO_LABEL[tipo] ? t(TIPO_LABEL[tipo]) : tipo;
    const msg =
      lang === 'en'
        ? `Hi, KaiZen team. I'm ${nombre}.\nProject type: ${tipoTxt}\nEmail: ${email}\n\n${descripcion}`
        : `Hola, equipo KaiZen. Soy ${nombre}.\nTipo de proyecto: ${tipoTxt}\nCorreo: ${email}\n\n${descripcion}`;
    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener'
    );
    setStatus('success');
    setFormData({ nombre: '', email: '', tipo: '', descripcion: '' });
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <footer id="contact" className="footer-section">

      <div className="section-container footer-contact">
        <SectionHead
          num="08"
          label={t({ es: 'Contacto', en: 'Contact' })}
          lede={t({
            es: 'Cuéntanos tu idea y te respondemos en menos de 24 horas.',
            en: 'Tell us your idea and we’ll get back to you within 24 hours.',
          })}
        >
          {t({ es: <>¿Tienes un proyecto <em>en mente?</em></>, en: <>Have a project <em>in mind?</em></> })}
        </SectionHead>

        <div className="footer-grid">
          {/* Columna izquierda: contacto directo */}
          <div className="footer-direct">
            <p className="footer-direct-label">{t({ es: 'Escríbenos directo', en: 'Email us' })}</p>
            <a href={`mailto:${CORREO}`} className="footer-mail">
              {CORREO}
            </a>
            <p className="footer-direct-note">
              {t({ es: '¿Prefieres WhatsApp? Toca el botón de la esquina.', en: 'Prefer WhatsApp? Tap the button in the corner.' })}
            </p>
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

            {status === 'success' ? (
              <div className="footer-success">
                <div className="success-icon">✓</div>
                <h3>{t({ es: '¡Mensaje listo en WhatsApp!', en: 'Your message is ready in WhatsApp!' })}</h3>
                <p>
                  {t({
                    es: 'Solo dale enviar en el chat y te respondemos en menos de 24 horas.',
                    en: 'Just hit send in the chat and we’ll reply within 24 hours.',
                  })}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label>{t({ es: 'Nombre completo', en: 'Full name' })}</label>
                    <input
                      type="text"
                      placeholder={t({ es: 'Tu nombre', en: 'Your name' })}
                      required
                      value={formData.nombre}
                      onChange={set('nombre')}
                    />
                  </div>
                  <div className="form-field">
                    <label>{t({ es: 'Correo electrónico', en: 'Email' })}</label>
                    <input
                      type="email"
                      placeholder={t({ es: 'tu@email.com', en: 'you@email.com' })}
                      required
                      value={formData.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>{t({ es: '¿Qué tipo de proyecto tienes?', en: 'What kind of project do you have?' })}</label>
                  <div className="form-select-wrap">
                    <select required value={formData.tipo} onChange={set('tipo')}>
                      <option value="" disabled>{t({ es: 'Selecciona una opción', en: 'Choose an option' })}</option>
                      {Object.entries(TIPO_LABEL).map(([valor, texto]) => (
                        <option key={valor} value={valor}>{t(texto)}</option>
                      ))}
                    </select>
                    <span className="select-arrow">↓</span>
                  </div>
                </div>

                <div className="form-field">
                  <label>{t({ es: 'Cuéntanos sobre tu proyecto', en: 'Tell us about your project' })}</label>
                  <textarea
                    placeholder={t({
                      es: 'Describe brevemente qué quieres construir, para cuándo lo necesitas y cualquier detalle relevante...',
                      en: 'Briefly describe what you want to build, when you need it and any relevant details...',
                    })}
                    rows="5"
                    required
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
