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

    const { data, error } = await supabase
      .from('leads')
      .insert([
        { 
          nombre: formData.nombre, 
          email: formData.email, 
          tipo_proyecto: formData.tipo, 
          descripcion: formData.descripcion 
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      setStatus('error');
      alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    } else {
      setStatus('success');
      setFormData({ nombre: '', email: '', tipo: '', descripcion: '' });
      alert('¡Solicitud enviada con éxito! Me pondré en contacto contigo muy pronto.');
    }
  };

  return (
    <footer id="contact" className="footer-section">
      <div className="section-container footer-container">
        <div className="footer-content">
          <h2>Hablemos de tu próximo salto tecnológico.</h2>
          <p className="text-muted">Desarrollo a medida, automatización e Inteligencia Artificial.</p>
          
          <div className="footer-direct">
            <a href="#" className="direct-link">Agendar videollamada directa &rarr;</a>
          </div>
        </div>

        <form className="footer-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Nombre completo" 
              required 
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <select 
              required 
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            >
              <option value="" disabled>Tipo de Proyecto</option>
              <option value="app">App Móvil</option>
              <option value="biometrico">Sistema de Acceso/Biometría</option>
              <option value="ecommerce">E-commerce</option>
              <option value="ia">Proyecto con IA</option>
            </select>
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Cuéntame sobre tu proyecto..." 
              rows="4" 
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            ></textarea>
          </div>
          <button type="submit" className="btn-metallic w-100" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Zahir Daniel Vidahurrazaga Marin. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
