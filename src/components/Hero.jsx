import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import '../styles/Hero.css';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="hero-section">
      <motion.div 
        className="hero-content"
        style={{ y: y1, opacity }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Ingeniería en Mecatrónica · Software + Hardware
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-line-break">Software a tu medida:</span>{' '}
          que se adapte a ti, <span className="text-gradient">no tú a él.</span>
        </motion.h1>

        <motion.ul
          className="hero-proof"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <li><BadgeCheck size={18} /> En App Store y Google Play</li>
          <li><BadgeCheck size={18} /> Sistemas en producción</li>
          <li><BadgeCheck size={18} /> Proyectos reales, no demos</li>
        </motion.ul>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#contact" className="btn-metallic btn-large">Cuéntame tu proyecto</a>
          <a href="#portfolio" className="btn-secondary btn-large">Ver soluciones</a>
        </motion.div>
      </motion.div>
      
      {/* Esferas de glow que viajan por todo el hero (azul + morada) */}
      <motion.div
        className="hero-glow-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeIn" }}
      >
        <div className="hero-smoke smoke-left" />
        <div className="hero-smoke smoke-right" />
      </motion.div>
    </section>
  );
};

export default Hero;
