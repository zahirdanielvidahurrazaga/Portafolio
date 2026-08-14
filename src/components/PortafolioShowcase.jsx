import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Mockup from './Mockup';
import ProjectModal from './ProjectModal';
import { projects } from '../data/projects';
import '../styles/PortafolioShowcase.css';

/* Portada de la tarjeta: el mockup del sitio web si el proyecto tiene, y si no
   (los que son solo móvil, como el álbum de bodas) el de la app. */
function portadaDe(project) {
  const web = project.mockups?.web;
  if (web) return { ...web, kind: 'mac' };
  const app = project.mockups?.app;
  return app ? { ...app, kind: 'phone' } : null;
}

const ShowcaseItem = ({ project, index, onOpen }) => {
  const isEven = index % 2 === 0;
  const portada = portadaDe(project);

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
        {/* El GANCHO, no el detalle: la tarjeta se lee en segundos y la
            descripción larga (209 caracteres en Be Fit Lab) hacía que las tres
            tarjetas ocuparan 3 pantallas de móvil. El caso completo está a un
            clic, en el modal. `description` queda en projects.js sin usarse. */}
        <p className="showcase-description">{project.tagline || project.description}</p>
        <div className="showcase-tags">
          {project.tags.map(tag => (
            <span key={tag} className="showcase-tag">{tag}</span>
          ))}
        </div>

        <div className="showcase-cta-row">
          <button className="showcase-cta" onClick={() => onOpen(project)}>
            Ver el proyecto <ArrowRight size={16} />
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
        {portada && (
          <button
            className={`showcase-device-trigger showcase-device-trigger--${portada.kind}`}
            onClick={() => onOpen(project)}
            aria-label={`Ver el proyecto ${project.title}`}
          >
            {/* Sin inclinación por CSS: el ángulo ya viene en el render. Si se
                le sumara un rotateY encima, el aparato saldría doblemente
                deformado. */}
            <Mockup
              kind={portada.kind}
              src={portada.src}
              fallback={portada.fallback}
              alt={project.title}
            />
          </button>
        )}
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
        <p className="text-muted">Entra a cada uno para ver el sitio y la app.</p>
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
