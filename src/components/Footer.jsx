import React, { useState } from 'react';
import '../styles/Footer.css';

const WHATSAPP = '522221622676';
// Las opciones siguen a las tarjetas de "Qué puedo construir": si alguien tocó
// un servicio en el carrusel, espera encontrarlo aquí con el mismo nombre.
// (Faltaba "Sitio web", que es de los servicios principales; y "Biometría"
// prometía algo que no se hace.)
const TIPO_LABEL = {
  sitio: 'Sitio web',
  app: 'App móvil (iOS / Android)',
  ecommerce: 'Tienda en línea',
  pos: 'Punto de venta',
  ia: 'Automatización o IA',
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
      `Hola Zahir, soy ${nombre}.\n` +
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

      {/* ── CTA headline ── */}
      <div className="footer-cta section-container">
        <p className="footer-eyebrow">Trabajemos juntos</p>
        <h2 className="footer-headline">
          ¿Tienes un proyecto<br className="footer-br"/> en mente?
        </h2>
        <p className="footer-subline">
          Cuéntame tu idea y te respondo en menos de 24 horas.
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="footer-form-wrap section-container">
        <div className="footer-form-card">

          {status === 'success' ? (
            <div className="footer-success">
              <div className="success-icon">✓</div>
              <h3>¡Mensaje listo en WhatsApp!</h3>
              <p>Solo dale enviar en el chat y te respondo en menos de 24 horas.</p>
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
                <label>Cuéntame sobre tu proyecto</label>
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
            </form>
          )}
        </div>

        {/* Direct links */}
        <div className="footer-direct-links">
          <a href="mailto:zahirdaniel@hotmail.com" className="direct-pill">
            <span className="pill-dot" />
            zahirdaniel@hotmail.com
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Zahir Daniel Vidahurrazaga Marin</p>
      </div>
    </footer>
  );
};

export default Footer;
