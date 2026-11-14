import KaiPildora from './KaiPildora';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Mockup from './Mockup';
import ProjectModal from './ProjectModal';
import SectionHead from './SectionHead';
import { projects, localizar } from '../data/projects';
import { useLang } from '../lib/LangContext';
import '../styles/PortafolioShowcase.css';

/* Portada de la tarjeta: el mockup del sitio web si el proyecto tiene, y si no
   (los que son solo móvil, como el álbum de bodas) el de la app. */
function portadaDe(project) {
  const web = project.mockups?.web;
  if (web) return { ...web, kind: 'mac' };
  const app = project.mockups?.app;
  return app ? { ...app, kind: 'phone' } : null;
}

/**
 * ÍNDICE DE PROYECTOS (2026-11-06). Antes cada proyecto era una pantalla completa
 * (mockup grande + texto, alternando lados): con 3 ya eran ~3 pantallas y vienen
 * más (Natural: sitio + sistema). Ahora es un índice tipográfico que escala:
 *  - Escritorio: renglones grandes; al pasar el mouse, el mockup del proyecto
 *    flota y SIGUE AL CURSOR (resorte). Clic = el caso completo (modal).
 *  - Celular / sin mouse: cada renglón trae su mockup arriba.
 * Para agregar un proyecto basta con sumarlo a VISIBLES en projects.js.
 */
function Renglon({ project, index, total, onOpen, onHover }) {
  const { t } = useLang();
  const portada = portadaDe(project);
  return (
    <li className="pi-item">
      <button
        type="button"
        className="pi-btn"
        onClick={() => onOpen(project)}
        onMouseEnter={() => onHover(project.id)}
        onFocus={() => onHover(project.id)}
      >
        {portada && (
          <span className={`pi-thumb pi-thumb--${portada.kind}`} aria-hidden="true">
            <Mockup kind={portada.kind} src={portada.src} fallback={portada.fallback} alt="" />
          </span>
        )}
        <span className="pi-num">
          {String(index + 1).padStart(2, '0')}
          <span className="pi-total"> / {String(total).padStart(2, '0')}</span>
        </span>
        <span className="pi-texto">
          <span className="pi-nombre">{project.title}</span>
          <span className="pi-tagline">{project.tagline}</span>
        </span>
        <span className="pi-meta">
          <span>{project.category}</span>
          <span className="pi-plataformas">{(project.platforms || []).join(' · ')}</span>
        </span>
        <span className="pi-flecha" aria-hidden="true">
          <ArrowUpRight size={22} />
        </span>
        <span className="sr-only">{t({ es: 'Ver el proyecto', en: 'View project' })}</span>
      </button>
    </li>
  );
}

/** El mockup que flota junto al cursor (solo con mouse) */
function Flotante({ lista, activo }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  useEffect(() => {
    const mover = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, [x, y]);
  return (
    <motion.div className="pi-flotante" style={{ x: sx, y: sy }} aria-hidden="true">
      <AnimatePresence>
        {lista.map((p) => {
          const portada = portadaDe(p);
          return p.id === activo && portada ? (
            // Dos capas: la de afuera (CSS) lo COLOCA junto al cursor con su translate; la
            // de adentro anima. Si fuera una sola, el transform de la animación pisaba el
            // translate y el mockup salía abajo a la derecha (hallazgo de Codex, 6-nov).
            <div key={p.id} className={`pi-flotante-img pi-flotante-img--${portada.kind}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -3, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Mockup kind={portada.kind} src={portada.src} fallback={portada.fallback} alt="" />
              </motion.div>
            </div>
          ) : null;
        })}
      </AnimatePresence>
    </motion.div>
  );
}

const PortafolioShowcase = () => {
  const { lang, t } = useLang();
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);
  const lista = projects.map((p) => localizar(p, lang));

  // "Ver el caso" desde Servicios abre aquí el proyecto que respalda ese servicio
  useEffect(() => {
    const onAbrir = (e) => e.detail?.id && setActive(e.detail.id);
    window.addEventListener('kaizen:proyecto', onAbrir);
    return () => window.removeEventListener('kaizen:proyecto', onAbrir);
  }, []);

  return (
    <section id="portfolio" className="showcase-section">
      {/* (El reel de la laptop se quitó el 6-nov: su motion ahora vive en Demos.jsx) */}
      <div className="showcase-header section-container">
        <SectionHead
          num="05"
          label={t({ es: 'Proyectos', en: 'Work' })}
          lede={t({ es: 'Y estos ya están funcionando: negocios reales que hoy operan con lo que construimos.', en: 'And these are already running: real businesses operating today on what we built.' })}
        >
          {t({ es: <>Soluciones <em>en producción</em></>, en: <>Solutions <em>in production</em></> })}
        </SectionHead>
      </div>

      <ol className="pi section-container" onMouseLeave={() => setHover(null)}>
        {lista.map((project, i) => (
          <Renglon
            key={project.id}
            project={project}
            index={i}
            total={lista.length}
            onOpen={(pr) => setActive(pr.id)}
            onHover={setHover}
          />
        ))}
      </ol>
      <Flotante lista={lista} activo={hover} />
      {/* Kai, en su píldora fija abajo: te cuenta del proyecto que señalas (solo con mouse) */}
      <KaiPildora className="kai-pildora--proyectos" kai={hover ? `proyecto-${hover}` : 'proyectos'} />

      {/* Se guarda el id (no el objeto) para que el modal siga al idioma si se cambia con él abierto */}
      <ProjectModal project={lista.find((pr) => pr.id === active) || null} onClose={() => setActive(null)} />
    </section>
  );
};

export default PortafolioShowcase;
