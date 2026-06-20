import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import DesktopMockup from './DesktopMockup';
import ProjectModal from './ProjectModal';
import { projects } from '../data/projects';
import '../styles/PortafolioShowcase.css';

const ShowcaseItem = ({ project, index, onOpen }) => {
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

        <div className="showcase-cta-row">
          <button className="showcase-cta" onClick={() => onOpen(project)}>
            Ver funciones <ArrowRight size={16} />
          </button>
          {project.website && (
            <a
              className="showcase-link"
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sitio web <ExternalLink size={14} />
            </a>
          )}
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
        <button
          className="showcase-device-trigger"
          onClick={() => onOpen(project)}
          aria-label={`Ver funciones de ${project.title}`}
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
        </button>
      </motion.div>
    </motion.div>
  );
};

const PortafolioShowcase = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="portfolio" className="showcase-section">
      <motion.div
        className="showcase-header section-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="showcase-eyebrow">Proyectos recientes</span>
        <h2>Soluciones de Alto Nivel.</h2>
        <p className="text-muted">Entra a cada proyecto para ver sus funciones a detalle.</p>
      </motion.div>

      <div className="showcase-list">
        {projects.map((project, i) => (
          <ShowcaseItem key={project.id} project={project} index={i} onOpen={setActive} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
};

export default PortafolioShowcase;
