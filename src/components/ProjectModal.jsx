import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, QrCode, Coffee, Bell, Camera, Award, Gift,
  Moon, CreditCard, Zap, Users, Cake, ExternalLink, X,
  Sparkles, MapPin, Ticket, BarChart3, FileText, Lock, TrendingUp,
  Home, ShoppingCart, Flame, Dumbbell, LayoutDashboard, ChefHat, ScanLine,
  CalendarPlus, UserPlus, Utensils, Share2, Wallet,
  ImageIcon, ChevronLeft, ChevronRight, Pause, Play, Smartphone, Monitor,
} from 'lucide-react';
import LiquidGlass from './LiquidGlass';
import '../styles/PhoneMockup.css';
import '../styles/ProjectModal.css';

const ICONS = {
  CalendarCheck, QrCode, Coffee, Bell, Camera, Award, Gift, Moon,
  CreditCard, Zap, Users, Cake, Sparkles, MapPin, Ticket, BarChart3,
  FileText, Lock, TrendingUp, Home, ShoppingCart, Flame, Dumbbell,
  LayoutDashboard, ChefHat, ScanLine, CalendarPlus, UserPlus, Utensils, Share2, Wallet,
};

const AUTO_MS = 5000;

// Blur-fade refinado para el título y la descripción al cambiar de función.
const copyItem = {
  enter: { opacity: 0, y: 12, filter: 'blur(8px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, filter: 'blur(8px)', transition: { duration: 0.28, ease: 'easeIn' } },
};

const FeatureIcon = ({ name, size = 22 }) => {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp size={size} strokeWidth={1.6} />;
};

/* Placeholder elegante mientras llega la captura real de la función. */
const ShotPlaceholder = ({ icon }) => (
  <div className="pm-shot-placeholder">
    <div className="pm-shot-placeholder-icon"><FeatureIcon name={icon} size={30} /></div>
    <span className="pm-shot-placeholder-label">Captura en camino</span>
  </div>
);

/* Dispositivo: teléfono o navegador según la función activa.
   El marco completo hace el blur-fade (lo anima el wrapper keyed en el escenario);
   aquí sólo se renderiza la pantalla actual. */
const DeviceFrame = ({ step, url }) => {
  const device = step.device || 'phone';

  const screen = (
    <div className="pm-screen-fade">
      {step.image
        ? <img src={step.image} alt={step.title} draggable={false} />
        : <ShotPlaceholder icon={step.icon} />}
    </div>
  );

  if (device === 'desktop') {
    return (
      <div className="pm-browser">
        <div className="pm-browser-bar">
          <span className="pm-dot" /><span className="pm-dot" /><span className="pm-dot" />
          <div className="pm-browser-url">{url}</div>
        </div>
        <div className="pm-browser-screen">{screen}</div>
      </div>
    );
  }

  return (
    <div className="phone-mockup-frame pm-phone">
      {/* Sin dynamic island: las capturas ya traen su barra de estado nativa. */}
      <div className="phone-mockup-bezel">
        <div className="phone-screen pm-phone-screen">{screen}</div>
      </div>
      <div className="btn-volume-up" /><div className="btn-volume-down" /><div className="btn-power" />
    </div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const [activeRole, setActiveRole] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  // En móvil (≤860px) se muestra una lista escaneable en vez del recorrido.
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches
  );

  const allSteps = useMemo(() => project?.walkthrough || [], [project]);
  // Perfiles (roles) en orden de aparición; vacío = recorrido plano sin pestañas.
  const roles = useMemo(
    () => [...new Set(allSteps.filter((s) => s.role).map((s) => s.role))],
    [allSteps]
  );
  const hasRoles = roles.length > 0;
  const steps = hasRoles ? allSteps.filter((s) => s.role === roles[activeRole]) : allSteps;
  const len = steps.length;

  const go = useCallback((dir) => {
    setActiveIndex((i) => (i + dir + len) % len);
  }, [len]);

  const selectRole = useCallback((i) => {
    setActiveRole(i);
    setActiveIndex(0);
  }, []);

  // Swipe en móvil: deslizar el escenario cambia de captura (sin bajar a los botones).
  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  // Reset SOLO al abrir/cambiar de proyecto (no al cambiar de perfil).
  useEffect(() => {
    setActiveRole(0);
    setActiveIndex(0);
    setPaused(false);
    setLightbox(null);
  }, [project]);

  // Seguir el breakpoint móvil del modal.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Precarga TODAS las capturas al abrir → el cambio entre funciones es instantáneo.
  useEffect(() => {
    allSteps.forEach((s) => {
      if (s.image) {
        const img = new Image();
        img.src = s.image;
      }
    });
  }, [allSteps]);

  // Listeners de teclado + bloquear scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pm-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.classList.remove('pm-open');
    };
  }, [project, onClose, go]);

  // Auto-avance (se pausa con hover/botón; NO corre en móvil: ahí es lista).
  useEffect(() => {
    if (!project || paused || len <= 1 || isNarrow) return undefined;
    const t = setTimeout(() => setActiveIndex((i) => (i + 1) % len), AUTO_MS);
    return () => clearTimeout(t);
  }, [project, activeIndex, paused, len, isNarrow]);

  if (!project) return null;
  const active = steps[activeIndex] || steps[0];
  const activeDevice = active.device || 'phone';
  const browserUrl = (project.website || `${project.id}.app`).replace(/^https?:\/\//, '');

  return (
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

            {/* Glow de marca que viaja por toda la página */}
            <div
              className="pm-roam"
              style={{ background: `radial-gradient(circle, rgba(${project.glow}, 0.5) 0%, rgba(${project.glow}, 0.18) 35%, transparent 70%)` }}
            />

            {/* ════ HERO (tipográfico, centrado) ════ */}
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

            {/* ════ PESTAÑAS DE PERFIL ════ */}
            {hasRoles && (
              <div className="pm-roles">
                <LiquidGlass shape="rounded" radius={0.5} intensity={0.6} className="pm-roles-glass" />
                <div className="pm-roles-track">
                  {roles.map((r, i) => (
                    <button
                      key={r}
                      className={`pm-role ${i === activeRole ? 'is-active' : ''}`}
                      onClick={() => selectRole(i)}
                    >
                      {r}
                      <span className="pm-role-count">
                        {allSteps.filter((s) => s.role === r && s.image).length || '·'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ════ MÓVIL: carrusel grande con swipe (capturas a su marco) ════ */}
            {isNarrow ? (
              <div className="pm-mcar">
                <div
                  className="pm-mcar-stage"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                      type="button"
                      key={`${activeRole}-${activeIndex}`}
                      className="pm-mcar-media"
                      onClick={() => active.image && setLightbox(active.image)}
                      aria-label={active.image ? `Ampliar ${active.title}` : active.title}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -28 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <DeviceFrame step={active} url={browserUrl} />
                    </motion.button>
                  </AnimatePresence>

                  {len > 1 && (
                    <>
                      <button className="pm-mcar-arrow pm-mcar-arrow--left" onClick={() => go(-1)} aria-label="Anterior">
                        <ChevronLeft size={22} />
                      </button>
                      <button className="pm-mcar-arrow pm-mcar-arrow--right" onClick={() => go(1)} aria-label="Siguiente">
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                <div className="pm-mcar-caption">
                  <span className="pm-mcar-step">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
                  </span>
                  <span className="pm-mtitle">
                    <FeatureIcon name={active.icon} size={16} /> {active.title}
                  </span>
                  <p>{active.desc}</p>
                </div>

                {len > 1 && (
                  <div className="pm-mcar-dots">
                    {steps.map((s, i) => (
                      <button
                        key={s.title}
                        className={`pm-mdot ${i === activeIndex ? 'is-active' : ''}`}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Ir a ${s.title}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
            /* ════ DESKTOP: escenario función por función ════ */
            <div
              className="pm-stage"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Dispositivo */}
              <div className="pm-stage-device">
                <motion.div
                  className="pm-device-glow"
                  style={{ background: `radial-gradient(ellipse at center, rgba(${project.glow}, 0.45) 0%, transparent 65%)` }}
                  animate={{ opacity: [0.55, 0.85, 0.55], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  key={`${activeRole}-${activeIndex}`}
                  className="pm-device-anim"
                  initial={{ scale: 0.95, filter: 'blur(12px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DeviceFrame step={active} url={browserUrl} />
                </motion.div>
                <span className="pm-swipe-hint">
                  <ChevronLeft size={14} /> Desliza para cambiar <ChevronRight size={14} />
                </span>
              </div>

              {/* Texto de la función activa */}
              <div className="pm-stage-info">
                <div className="pm-stage-top">
                  <span className="pm-counter">
                    {String(activeIndex + 1).padStart(2, '0')}
                    <span className="pm-counter-total"> / {String(len).padStart(2, '0')}</span>
                  </span>
                  <span className="pm-device-chip">
                    {activeDevice === 'desktop' ? <Monitor size={13} /> : <Smartphone size={13} />}
                    {activeDevice === 'desktop' ? 'Web' : 'App'}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeRole}-${activeIndex}`}
                    className="pm-stage-copy"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={{
                      center: { transition: { staggerChildren: 0.07 } },
                      exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                    }}
                  >
                    <motion.h3 className="pm-step-title" variants={copyItem}>{active.title}</motion.h3>
                    <motion.p className="pm-step-desc" variants={copyItem}>{active.desc}</motion.p>
                    {!active.image && (
                      <motion.span className="pm-step-pending" variants={copyItem}>
                        <ImageIcon size={13} /> Captura por agregar
                      </motion.span>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Controles */}
                <div className="pm-controls">
                  <button className="pm-ctrl-btn" onClick={() => go(-1)} aria-label="Anterior">
                    <ChevronLeft size={20} />
                  </button>

                  <div className="pm-rail">
                    {steps.map((s, i) => (
                      <button
                        key={s.title}
                        className={`pm-rail-dot ${i === activeIndex ? 'is-active' : ''}`}
                        onClick={() => setActiveIndex(i)}
                        aria-label={`Ir a ${s.title}`}
                      >
                        {i === activeIndex && !paused && (
                          <motion.span
                            className="pm-rail-fill"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <button className="pm-ctrl-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Reanudar' : 'Pausar'}>
                    {paused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                  <button className="pm-ctrl-btn" onClick={() => go(1)} aria-label="Siguiente">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* ════ CIERRE ════ */}
            <footer className="pm-foot">
              <h3>¿Quieres una experiencia así para tu negocio?</h3>
              <div className="pm-foot-actions">
                {project.website && (
                  <a className="pm-cta" href={project.website} target="_blank" rel="noopener noreferrer">
                    Ver el proyecto en vivo <ExternalLink size={16} />
                  </a>
                )}
                <button className="pm-cta pm-cta--ghost" onClick={onClose}>Cerrar</button>
              </div>
            </footer>

            {/* Lightbox: captura grande al tocar una miniatura (móvil) */}
            <AnimatePresence>
              {lightbox && (
                <motion.div
                  className="pm-lightbox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setLightbox(null)}
                >
                  <button className="pm-lightbox-close" aria-label="Cerrar">
                    <X size={20} />
                  </button>
                  <img src={lightbox} alt="" draggable={false} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
