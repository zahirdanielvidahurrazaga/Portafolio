import React from 'react';
import { motion } from 'framer-motion';
import LiquidGlass from './LiquidGlass';
import { WHATSAPP } from '../data/contacto';
import { useLang } from '../lib/LangContext';

const MENSAJE = {
  es: 'Hola, equipo KaiZen. Vi su sitio y me gustaría platicar sobre un proyecto para mi negocio.',
  en: 'Hi, KaiZen team. I saw your website and I’d like to talk about a project for my business.',
};

const FloatingWhatsApp = () => {
  const { t } = useLang();
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t(MENSAJE))}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <LiquidGlass shape="circle" className="fw-glass" />
      <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="whatsapp-icon">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    </motion.a>
  );
};

export default FloatingWhatsApp;
