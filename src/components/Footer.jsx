import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
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

        <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <input type="text" placeholder="Nombre completo" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Correo electrónico" required />
          </div>
          <div className="form-group">
            <select required>
              <option value="" disabled selected>Tipo de Proyecto</option>
              <option value="app">App Móvil</option>
              <option value="biometrico">Sistema de Acceso/Biometría</option>
              <option value="ecommerce">E-commerce</option>
              <option value="ia">Proyecto con IA</option>
            </select>
          </div>
          <div className="form-group">
            <textarea placeholder="Cuéntame sobre tu proyecto..." rows="4" required></textarea>
          </div>
          <button type="submit" className="btn-metallic w-100">Enviar solicitud</button>
        </form>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Zahir Daniel Vidahurrazaga Marin. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
