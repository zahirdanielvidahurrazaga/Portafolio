import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
          Zahir Daniel Vidahurrazaga Marin
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero-line-break">Fusionando el</span>{' '}
          Mundo <span className="text-gradient">Físico y Digital.</span>
        </motion.h1>
        
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Ingeniería en Mecatrónica y Desarrollo de Software. Soluciones automatizadas, IA y apps nativas que llevan la tecnología de tu negocio al siguiente nivel.
        </motion.p>
        
        <motion.div 
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#contact" className="btn-metallic btn-large">Cotizar mi proyecto</a>
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
