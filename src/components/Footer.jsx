import React, { useState } from 'react';
import SectionHead from './SectionHead';
import { WHATSAPP, CORREO, REDES } from '../data/contacto';
import '../styles/Footer.css';

// Las opciones siguen a las 7 líneas de "Lo que hacemos" (Servicios.jsx): si
// alguien vio un servicio ahí, espera encontrarlo aquí con el mismo nombre.
const TIPO_LABEL = {
  marca: 'Identidad de marca',
  redes: 'Redes sociales',
  lanzamiento: 'Lanzamiento (marca + redes + landing)',
  sitio: 'Sitio web',
  tienda: 'Tienda en línea o punto de venta',
  ia: 'Automatización o IA',
  app: 'App o experiencia digital',
  otro: 'Otra cosa',
};

const Footer = () => {
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
    const msg =
      `Hola, equipo KaiZen. Soy ${nombre}.\n` +
      `Tipo de proyecto: ${TIPO_LABEL[tipo] || tipo}\n` +
      `Correo: ${email}\n\n` +
      `${descripcion}`;
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
          label="Contacto"
          lede="Cuéntanos tu idea y te respondemos en menos de 24 horas."
        >
          ¿Tienes un proyecto <em>en mente?</em>
        </SectionHead>

        <div className="footer-grid">
          {/* Columna izquierda: contacto directo */}
          <div className="footer-direct">
            <p className="footer-direct-label">Escríbenos directo</p>
            <a href={`mailto:${CORREO}`} className="footer-mail">
              {CORREO}
            </a>
            <p className="footer-direct-note">
              ¿Prefieres WhatsApp? Toca el botón de la esquina.
            </p>
            <p className="footer-direct-label footer-redes-label">Síguenos</p>
            <nav className="footer-redes" aria-label="Redes sociales">
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
                <h3>¡Mensaje listo en WhatsApp!</h3>
                <p>Solo dale enviar en el chat y te respondemos en menos de 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label>Nombre completo</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={formData.nombre}
                      onChange={set('nombre')}
                    />
                  </div>
                  <div className="form-field">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      required
                      value={formData.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>¿Qué tipo de proyecto tienes?</label>
                  <div className="form-select-wrap">
                    <select required value={formData.tipo} onChange={set('tipo')}>
                      <option value="" disabled>Selecciona una opción</option>
                      {Object.entries(TIPO_LABEL).map(([valor, texto]) => (
                        <option key={valor} value={valor}>{texto}</option>
                      ))}
                    </select>
                    <span className="select-arrow">↓</span>
                  </div>
                </div>

                <div className="form-field">
                  <label>Cuéntanos sobre tu proyecto</label>
                  <textarea
                    placeholder="Describe brevemente qué quieres construir, para cuándo lo necesitas y cualquier detalle relevante..."
                    rows="5"
                    required
                    value={formData.descripcion}
                    onChange={set('descripcion')}
                  />
                </div>

                <button type="submit" className="form-submit">
                  <span>Enviar por WhatsApp</span>
                  <span className="submit-arrow">→</span>
                </button>
                {/* Aviso simplificado: el formulario recaba datos personales */}
                <p className="form-aviso">
                  Al enviar aceptas nuestro <a href="/aviso-de-privacidad">aviso de privacidad</a>. Usamos tus
                  datos solo para responderte.
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
          <a href="/aviso-de-privacidad">Aviso de privacidad</a>
          <a href="/terminos">Términos y condiciones</a>
        </nav>
        <span>Evoluciona la forma en que haces negocio</span>
      </div>
    </footer>
  );
};

export default Footer;
