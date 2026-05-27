import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: '',
    descripcion: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('leads').insert([{
      nombre: formData.nombre,
      email: formData.email,
      tipo_proyecto: formData.tipo,
      descripcion: formData.descripcion
    }]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ nombre: '', email: '', tipo: '', descripcion: '' });
    }
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
              <h3>¡Solicitud enviada!</h3>
              <p>Me pondré en contacto contigo muy pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
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
                    <option value="app">App Móvil o PWA</option>
                    <option value="biometrico">Sistema de Acceso / Biometría</option>
                    <option value="ecommerce">E-commerce o POS</option>
                    <option value="ia">Proyecto con Inteligencia Artificial</option>
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

              {status === 'error' && (
                <p className="form-error">Hubo un error. Inténtalo de nuevo.</p>
              )}

              <button
                type="submit"
                className="form-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="submit-loading">Enviando…</span>
                ) : (
                  <>
                    <span>Enviar solicitud</span>
                    <span className="submit-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Direct links */}
        <div className="footer-direct-links">
          <a href="mailto:zahirteamironman@gmail.com" className="direct-pill">
            <span className="pill-dot" />
            zahirteamironman@gmail.com
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
