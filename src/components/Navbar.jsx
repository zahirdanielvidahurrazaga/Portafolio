import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import LiquidGlass from './LiquidGlass';
import ThemeToggle from './ThemeToggle';
import KaizenWordmark from './KaizenWordmark';
import LangToggle from './LangToggle';
import { useLang } from '../lib/LangContext';
import { useVozKai, alternarVoz } from '../lib/kaiVoz';
import '../styles/Navbar.css';

// BARRA MÍNIMA (14-nov-2026, como la de adamperlis.com): logo · el hueco donde se
// guarda Kai · sonido · menú · Cotizar. Los capítulos, el idioma y el tema viven en
// el MENÚ a pantalla completa. En el ORDEN de la página y con el MISMO nombre que la
// etiqueta de cada sección (SectionHead). Contacto lo cubre el botón Cotizar.
const LINKS = [
  ['about', { es: 'Servicios', en: 'Services' }],
  ['testimonios', { es: 'Testimonios', en: 'Testimonials' }],
  ['demos', { es: 'Demos', en: 'Demos' }],
  ['portfolio', { es: 'Proyectos', en: 'Work' }],
  ['sobre-mi', { es: 'Nosotros', en: 'About' }],
  ['process', { es: 'Proceso', en: 'Process' }],
  ['faq', { es: 'FAQ', en: 'FAQ' }],
  ['contact', { es: 'Contacto', en: 'Contact' }],
];

const Navbar = () => {
  const { t } = useLang();
  const { hay: hayVoz, voz } = useVozKai();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activa, setActiva] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      setScrolled(window.scrollY > 20);
      const linea = window.innerHeight * 0.4;
      let actual = null;
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linea) actual = id;
      }
      setActiva(actual);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Menú abierto: Escape lo cierra, y la rueda/el dedo no mueven la página de atrás
  // (sin overflow:hidden en html/body: en Safari rompe los sticky, ver CLAUDE.md)
  useEffect(() => {
    if (!menuOpen) return undefined;
    const tecla = (e) => e.key === 'Escape' && setMenuOpen(false);
    const frena = (e) => e.preventDefault();
    const el = menuRef.current;
    window.addEventListener('keydown', tecla);
    el?.addEventListener('wheel', frena, { passive: false });
    el?.addEventListener('touchmove', frena, { passive: false });
    document.body.classList.add('menu-abierto');
    return () => {
      window.removeEventListener('keydown', tecla);
      el?.removeEventListener('wheel', frena);
      el?.removeEventListener('touchmove', frena);
      document.body.classList.remove('menu-abierto');
    };
  }, [menuOpen]);

  const cerrar = () => setMenuOpen(false);

  return (
    <>
      <div className="apple-navbar-wrapper">
        <motion.nav
          className={`apple-navbar ${scrolled ? 'scrolled' : ''}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiquidGlass shape="rounded" radius={0.5} intensity={0.45} className="nav-glass" />
          <div className="nav-container">
            <a href="#" className="nav-logo" aria-label="KaiZen">
              <KaizenWordmark />
            </a>
            <div className="nav-actions">
              {/* Aquí se guarda Kai cuando no tiene lugar en la escena (lib/kai.js) */}
              <span className="kai-dock" aria-hidden="true" />
              {hayVoz && (
                <button
                  type="button"
                  className={`nav-redondo nav-sonido${voz ? ' is-on' : ''}`}
                  onClick={alternarVoz}
                  aria-pressed={voz}
                  aria-label={voz ? t({ es: 'Quitar la voz de Kai', en: 'Turn Kai’s voice off' }) : t({ es: 'Escuchar a Kai', en: 'Hear Kai' })}
                  title={voz ? t({ es: 'Quitar la voz de Kai', en: 'Turn Kai’s voice off' }) : t({ es: 'Escuchar a Kai', en: 'Hear Kai' })}
                >
                  {voz ? <Volume2 size={16} strokeWidth={1.8} /> : <VolumeX size={16} strokeWidth={1.8} />}
                </button>
              )}
              <button
                type="button"
                className={`nav-redondo nav-menu${menuOpen ? ' is-open' : ''}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? t({ es: 'Cerrar menú', en: 'Close menu' }) : t({ es: 'Abrir menú', en: 'Open menu' })}
              >
                <span />
                <span />
              </button>
              <a href="#contact" className="btn-metallic nav-btn nav-cta" onClick={cerrar}>
                {t({ es: 'Cotizar', en: 'Get a quote' })}
              </a>
            </div>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="menu-pleno"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && cerrar()}
          >
            <nav className="menu-capitulos" aria-label={t({ es: 'Capítulos', en: 'Chapters' })}>
              {LINKS.map(([id, texto], i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={cerrar}
                  className={activa === id ? 'is-active' : undefined}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="menu-num">{String(i + 2).padStart(2, '0')}</span>
                  <span className="menu-nombre">{t(texto)}</span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="menu-pie"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <LangToggle />
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
