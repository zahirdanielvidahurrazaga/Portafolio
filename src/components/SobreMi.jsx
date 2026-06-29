import React from 'react';
import { motion } from 'framer-motion';
import '../styles/SobreMi.css';

// 👉 Cuando tengas tu foto, ponla en /public (ej. /sobre-mi.jpg) y pon la ruta aquí.
const PHOTO = '/sobre-mi.jpg';

const SobreMi = () => {
  return (
    <section id="sobre-mi" className="section-container sobre-section">
      <div className="sobre-grid">
        <motion.div
          className="sobre-photo-wrap"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sobre-photo">
            {PHOTO ? (
              <img src={PHOTO} alt="Zahir Vidahurrázaga" />
            ) : (
              <span className="sobre-photo-placeholder">ZV</span>
            )}
          </div>
        </motion.div>

        <motion.div
          className="sobre-text"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="sobre-label">Quién soy</span>
          <h2>Hola, soy Zahir.</h2>
          <p className="sobre-bio">
            Ingeniero en Mecatrónica apasionado por unir el mundo físico y el
            digital. Construyo software a la medida —apps, sitios y sistemas— y lo
            conecto con hardware real para resolver problemas concretos de cada
            negocio. No entrego plantillas: entrego soluciones que ya operan en
            producción.
          </p>

          <a href="#contact" className="sobre-cta">Trabajemos juntos</a>
        </motion.div>
      </div>
    </section>
  );
};

export default SobreMi;
