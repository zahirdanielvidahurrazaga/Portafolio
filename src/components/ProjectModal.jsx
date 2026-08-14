import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, TrendingUp, X } from 'lucide-react';
import Mockup from './Mockup';
import '../styles/ProjectModal.css';

/**
 * Caso de estudio de un proyecto.
 *
 * REESCRITO 2026-08-13. Antes era un recorrido función por función: 24 pantallas
 * de Be Fit Lab, 11 del POS. La gente a la que Zahir le mostró el sitio dijo que
 * "muestran todo lo que tienen las apps" — era un manual de usuario, no un caso
 * de estudio. Ahora enseña solo dos cosas: el sitio web y cómo se ENTRA a la app.
 * El resto se cuenta en una llamada, que es donde se cierra la venta.
 *
 * Los datos vienen de `project.mockups` (ver src/data/projects.js).
 */

/* Una sección con su encabezado; entra al hacer scroll dentro del panel. */
function Bloque({ titulo, subtitulo, children }) {
  return (
    <motion.section
      className="pm-show"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="pm-show-title">{titulo}</h3>
      {subtitulo && <p className="pm-show-sub">{subtitulo}</p>}
      {children}
    </motion.section>
  );
}

export default function ProjectModal({ project, onClose }) {
  const [zoom, setZoom] = useState(null);

  /* Escape cierra primero el zoom y solo después el modal: si cerrara los dos
     de golpe, ampliar una imagen y salir te sacaría del proyecto entero. */
  useEffect(() => {
    if (!project) return undefined;
    const alPresionar = (e) => {
      if (e.key !== 'Escape') return;
      if (zoom) setZoom(null);
      else onClose();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [project, zoom, onClose]);

  /* Congela el scroll del fondo. La clase `pm-open` además esconde el botón
     flotante de WhatsApp, que si no queda encima del panel. */
  useEffect(() => {
    if (!project) return undefined;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pm-open');
    return () => {
      document.body.style.overflow = previo;
      document.body.classList.remove('pm-open');
    };
  }, [project]);

  /* Al cambiar de proyecto, el zoom que hubiera quedado abierto ya no aplica. */
  useEffect(() => setZoom(null), [project?.id]);

  const mockups = project?.mockups;

  return (
    <>
      <AnimatePresence>
        {project && (
          <motion.div
            className="pm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          >
            <motion.div
              className="pm-panel"
              style={{ '--pm-accent': project.accent || 'var(--accent-color)' }}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="pm-close" onClick={onClose} aria-label="Cerrar">
                <X size={20} />
              </button>

              {/* Glow de marca del proyecto, viajando por el panel */}
              <div
                className="pm-roam"
                style={{
                  background: `radial-gradient(circle, rgba(${project.glow}, 0.5) 0%, rgba(${project.glow}, 0.18) 35%, transparent 70%)`,
                }}
              />

              {/* ════ HERO ════ */}
              <header className="pm-hero">
                <motion.div
                  className="pm-hero-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="pm-category">{project.category}</span>
                  <h2 className="pm-title">{project.title}</h2>
                  {project.tagline && <p className="pm-tagline">{project.tagline}</p>}
                  {project.result && (
                    <p className="pm-result">
                      <TrendingUp size={17} aria-hidden="true" />
                      <span>{project.result}</span>
                    </p>
                  )}
                  {project.platforms?.length > 0 && (
                    <div className="pm-actions">
                      <div className="pm-platforms">
                        {project.platforms.map((p) => (
                          <span key={p} className="pm-platform">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </header>

              {/* ════ EL SITIO WEB ════ */}
              {mockups?.web && (
                <Bloque titulo="El sitio web" subtitulo={mockups.web.caption}>
                  <button
                    type="button"
                    className="pm-zoomable pm-zoomable--web"
                    onClick={() => setZoom({ ...mockups.web, label: `${project.title} — sitio web` })}
                    aria-label="Ampliar el sitio web"
                  >
                    <Mockup
                      kind="mac"
                      src={mockups.web.src}
                      fallback={mockups.web.fallback}
                      alt={`Sitio web de ${project.title}`}
                    />
                  </button>
                </Bloque>
              )}

              {/* ════ INTRO DE LA APP ════ */}
              {/* Las dos pantallas (entrada y login) vienen YA COMPUESTAS en una
                  sola imagen desde shots.so, con el mismo ángulo y su relación
                  espacial resuelta. Por eso es un solo <Mockup> y no dos. */}
              {mockups?.app && (
                <Bloque titulo="Así se entra a la app" subtitulo={mockups.app.caption}>
                  <button
                    type="button"
                    className="pm-zoomable pm-zoomable--app"
                    onClick={() => setZoom({ ...mockups.app, label: `${project.title} — la app` })}
                    aria-label="Ampliar las pantallas de la app"
                  >
                    <Mockup
                      kind="phone"
                      src={mockups.app.src}
                      fallback={mockups.app.fallback}
                      alt={`Pantallas de entrada de la app de ${project.title}`}
                    />
                  </button>
                </Bloque>
              )}

              {/* ════ CIERRE ════ */}
              <footer className="pm-foot">
                <h3>¿Quieres algo así para tu negocio?</h3>
                <div className="pm-foot-actions">
                  <a href="#contact" className="pm-cta" onClick={onClose}>
                    Cuéntame tu proyecto
                  </a>
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pm-cta pm-cta--ghost"
                    >
                      Verlo en vivo <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ Zoom de una imagen ════ */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            className="pm-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setZoom(null)}
          >
            <button className="pm-lightbox-close" onClick={() => setZoom(null)} aria-label="Cerrar">
              <X size={20} />
            </button>
            <Mockup
              kind={zoom.src?.includes('mac') || zoom.label?.includes('sitio') ? 'mac' : 'phone'}
              src={zoom.src}
              fallback={zoom.fallback}
              alt={zoom.label}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
