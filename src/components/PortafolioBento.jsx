import React from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';
import DesktopMockup from './DesktopMockup';
import '../styles/PortafolioBento.css';

const BEFIT_SLIDES = [
  '/screenshots/befit-home.jpeg',
  '/screenshots/befit-reservas.jpeg',
  '/screenshots/befit-qr.jpeg',
];

const DENTAL_SLIDES = [
  '/screenshots/dental-consentimiento.jpeg',
  '/screenshots/dental-agenda.jpeg',
];

const POS_SLIDES = [
  '/screenshots/pos-dashboard.jpeg',
  '/screenshots/pos-pedidos.jpeg',
  '/screenshots/pos-inventario.jpeg',
];

const SANTUARIO_DESKTOP = [
  '/screenshots/santuario-desktop-1.png',
  '/screenshots/santuario-desktop-2.png',
];

const SANTUARIO_PHONE = [
  '/screenshots/santuario-phone-1.jpeg',
  '/screenshots/santuario-phone-2.jpeg',
  '/screenshots/boda-galeria.jpeg',
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay } }),
};

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

        {/* Card 1: Fitness & Wellness — BEFIT LAB */}
        <motion.div
          className="bento-card card-large"
          custom={0}
          initial="hidden"
          whileInView="visible"
          variants={cardVariants}
          viewport={{ once: true }}
        >
          <div className="bento-content">
            <h3>Fitness & Wellness</h3>
            <p>Apps y PWA para coaches. Dashboards de administrador. Accesos automatizados por QR y biometría.</p>
          </div>
          <div className="bento-mockup-container">
            <PhoneMockup className="bento-phone" slides={BEFIT_SLIDES} />
          </div>
        </motion.div>

        {/* Card 2: Plataformas Clínicas */}
        <motion.div
          className="bento-card"
          custom={0.2}
          initial="hidden"
          whileInView="visible"
          variants={cardVariants}
          viewport={{ once: true }}
        >
          <div className="bento-content">
            <h3>Plataformas Clínicas</h3>
            <p>Agendas inteligentes, expedientes seguros y finanzas para dentistas y nutriólogos.</p>
          </div>
          <div className="bento-phone-corner">
            <PhoneMockup slides={DENTAL_SLIDES} />
          </div>
        </motion.div>

        {/* Card 3: E-commerce — POS Retail */}
        <motion.div
          className="bento-card"
          custom={0.3}
          initial="hidden"
          whileInView="visible"
          variants={cardVariants}
          viewport={{ once: true }}
        >
          <div className="bento-content">
            <h3>E-commerce & Retail</h3>
            <p>Tiendas online avanzadas con sincronización de inventario en tiempo real.</p>
          </div>
          <div className="bento-phone-corner">
            <PhoneMockup slides={POS_SLIDES} />
          </div>
        </motion.div>

        {/* Card 4: IA & Eventos — Santuario + Boda */}
        <motion.div
          className="bento-card card-wide"
          custom={0.4}
          initial="hidden"
          whileInView="visible"
          variants={cardVariants}
          viewport={{ once: true }}
        >
          <div className="bento-content">
            <h3>Experiencias IA & Eventos Especializados</h3>
            <p>Implementaciones de Inteligencia Artificial a medida y plataformas interactivas (Ej. álbumes para bodas con códigos de acceso).</p>
          </div>
          <div className="bento-ia-visuals">
            <div className="bento-desktop-wrap">
              <DesktopMockup slides={SANTUARIO_DESKTOP} />
            </div>
            <div className="bento-phone-side">
              <PhoneMockup slides={SANTUARIO_PHONE} />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default PortafolioBento;
