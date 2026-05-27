import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Lock, Shield } from 'lucide-react';
import '../styles/FactorMecatronico.css';

const FactorMecatronico = () => {
  return (
    <section id="about" className="section-container factor-section">
      <div className="factor-grid">
        <motion.div 
          className="factor-text"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2>Más allá del código.</h2>
          <p>
            Como Ingeniero en Mecatrónica, no solo construyo sitios web; creo ecosistemas completos. Conecto software de alto rendimiento con hardware físico: desde controles de acceso biométrico y reconocimiento facial, hasta integraciones nativas con smartwatches y automatización de procesos.
          </p>
        </motion.div>
        
        <motion.div 
          className="factor-visuals"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="visual-card">
            <Cpu size={32} className="visual-icon" />
            <h3>Hardware + Software</h3>
            <p>Integraciones con dispositivos y microchips.</p>
          </div>
          <div className="visual-card offset">
            <Zap size={32} className="visual-icon" />
            <h3>Automatización</h3>
            <p>Procesos inteligentes y eficientes.</p>
          </div>
          <div className="visual-card">
            <Shield size={32} className="visual-icon" />
            <h3>Biometría</h3>
            <p>Accesos seguros y reconocimiento facial.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FactorMecatronico;
