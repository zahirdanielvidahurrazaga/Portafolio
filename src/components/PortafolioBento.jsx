import React from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';
import '../styles/PortafolioBento.css';

const PortafolioBento = () => {
  return (
    <section id="portfolio" className="section-container bento-section">
      <motion.div 
        className="bento-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Soluciones de Alto Nivel.</h2>
        <p className="text-muted">Diseñadas para escalar y dominar el mercado.</p>
      </motion.div>

      <div className="bento-grid">
        {/* Card 1: Fitness & Wellness with Phone Mockup inside */}
        <motion.div 
          className="bento-card card-large"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bento-content">
            <h3>Fitness & Wellness</h3>
            <p>Apps y PWA para coaches. Dashboards de administrador. Accesos automatizados por QR y biometría.</p>
          </div>
          <div className="bento-mockup-container">
             <PhoneMockup className="bento-phone">
               {/* Inside the mock screen */}
               <div className="app-ui fitness-ui">
                 <div className="app-header">Dashboard</div>
                 <div className="app-metric">
                   <span>Usuarios Activos</span>
                   <strong>1,240</strong>
                 </div>
                 <div className="app-qr"></div>
                 <button className="app-btn">Escanear QR</button>
               </div>
             </PhoneMockup>
          </div>
        </motion.div>

        {/* Card 2: Plataformas Clínicas */}
        <motion.div 
          className="bento-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bento-content">
            <h3>Plataformas Clínicas</h3>
            <p>Agendas inteligentes, expedientes seguros y finanzas para dentistas y nutriólogos.</p>
          </div>
          <div className="bento-visual clinic-visual"></div>
        </motion.div>

        {/* Card 3: E-commerce */}
        <motion.div 
          className="bento-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bento-content">
            <h3>E-commerce & Retail</h3>
            <p>Tiendas online avanzadas con sincronización de inventario en tiempo real.</p>
          </div>
          <div className="bento-visual ecommerce-visual"></div>
        </motion.div>

        {/* Card 4: IA & Especializadas */}
        <motion.div 
          className="bento-card card-wide"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bento-content">
            <h3>Experiencias IA & Eventos Especializados</h3>
            <p>Implementaciones de Inteligencia Artificial a medida y plataformas interactivas (Ej. álbumes para bodas con códigos de acceso).</p>
          </div>
          <div className="bento-visual ia-visual"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortafolioBento;
