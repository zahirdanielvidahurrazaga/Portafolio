import React from 'react';
import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';
import DesktopMockup from './DesktopMockup';
import '../styles/PortafolioShowcase.css';


const projects = [
  {
    id: 'befit',
    category: 'Fitness & Wellness',
    title: 'BEFIT LAB',
    description:
      'PWA y app nativa para estudios de fitness. Reserva de clases, membresías digitales, acceso por QR y dashboard de administrador con métricas en tiempo real.',
    tags: ['React Native', 'PWA', 'Supabase', 'QR & Biometría'],
    type: 'phone',
    slides: [
      '/screenshots/befit-home.jpeg',
      '/screenshots/befit-reservas.jpeg',
      '/screenshots/befit-qr.jpeg',
    ],
    glow: '255, 140, 60',
  },
  {
    id: 'dental',
    category: 'Plataformas Clínicas',
    title: 'Portal Dental',
    description:
      'Sistema de gestión clínica con agenda inteligente, expedientes digitales, consentimientos informados y registro de pacientes paso a paso.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'PDF Generation'],
    type: 'phone',
    slides: [
      '/screenshots/dental-consentimiento.jpeg',
      '/screenshots/dental-agenda.jpeg',
    ],
    glow: '10, 132, 255',
  },
  {
    id: 'santuario',
    category: 'Sitio Web & Portal',
    title: 'Landing + Portal Premium',
    description:
      'Sitio web de alto impacto para gimnasio de calistenia y rendimiento. Landing page inmersiva con portal privado de membresías y acceso restringido.',
    tags: ['React', 'Framer Motion', 'Portal de Acceso', 'Diseño Premium'],
    type: 'desktop',
    slides: [
      '/screenshots/santuario-desktop-1.png',
    ],
    glow: '220, 40, 40',
  },
  {
    id: 'pos',
    category: 'E-commerce & Retail',
    title: 'POS Admin System',
    description:
      'Sistema de punto de venta web con dashboard financiero, terminal de cobro, control de inventario y sincronización en tiempo real para negocios retail.',
    tags: ['React', 'Supabase', 'POS', 'Dashboard Analytics'],
    type: 'desktop',
    slides: [
      '/screenshots/pos-desktop-1.jpeg',
      '/screenshots/pos-desktop-2.jpeg',
      '/screenshots/pos-desktop-3.jpeg',
    ],
    glow: '52, 199, 89',
  },
  {
    id: 'boda',
    category: 'IA & Eventos',
    title: 'Galería de Bodas',
    description:
      'Plataforma interactiva para eventos. Los invitados acceden con un código único a su galería personalizada, suben fotos desde cámara y visualizan el álbum compartido.',
    tags: ['React', 'Supabase Storage', 'Código de Acceso', 'Upload en tiempo real'],
    type: 'phone',
    slides: ['/screenshots/boda-galeria.jpeg'],
    glow: '191, 90, 242',
  },
];

const ShowcaseItem = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className={`showcase-item ${isEven ? 'showcase-item--normal' : 'showcase-item--reversed'}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      {/* Glow background */}
      <div
        className="showcase-glow"
        style={{ background: `radial-gradient(ellipse at center, rgba(${project.glow}, 0.18) 0%, transparent 65%)` }}
      />

      {/* Text block */}
      <motion.div
        className="showcase-text"
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <span className="showcase-category">{project.category}</span>
        <h2 className="showcase-title">{project.title}</h2>
        <p className="showcase-description">{project.description}</p>
        <div className="showcase-tags">
          {project.tags.map(tag => (
            <span key={tag} className="showcase-tag">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Device mockup */}
      <motion.div
        className="showcase-device"
        initial={{ opacity: 0, x: isEven ? 40 : -40, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {project.type === 'desktop' ? (
          <div className={`showcase-desktop-wrap ${isEven ? 'tilt-right' : 'tilt-left'}`}>
            <DesktopMockup slides={project.slides} />
          </div>
        ) : (
          <div className="showcase-phone-wrap">
            <PhoneMockup slides={project.slides} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PortafolioShowcase = () => {
  return (
    <section id="portfolio" className="showcase-section">
      <motion.div
        className="showcase-header section-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Soluciones de Alto Nivel.</h2>
        <p className="text-muted">Diseñadas para escalar y dominar el mercado.</p>
      </motion.div>

      <div className="showcase-list">
        {projects.map((project, i) => (
          <ShowcaseItem key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PortafolioShowcase;
