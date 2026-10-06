import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidGlass from './LiquidGlass';
import ThemeToggle from './ThemeToggle';
import KaizenWordmark from './KaizenWordmark';
import '../styles/Navbar.css';

// En el ORDEN de la página (App.jsx) y con el MISMO nombre que la etiqueta de
// cada sección (SectionHead). Antes decía "Soluciones" y la sección se llama
// "Proyectos". Contacto no va aquí: lo cubre el botón Cotizar.
const LINKS = [
  ['about', 'Servicios'],
  ['testimonios', 'Testimonios'],
  ['portfolio', 'Proyectos'],
  ['sobre-mi', 'Nosotros'],
  ['process', 'Proceso'],
  ['faq', 'FAQ'],
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Sección en pantalla: se resalta en la barra (orienta igual que BarraScroll)
  const [activa, setActiva] = useState(null);

  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const linea = window.innerHeight * 0.4;
      let actual = null;
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linea) actual = id;
      }
      // Ya en Contacto (el pie) no se resalta nada: ahí manda el botón Cotizar
      const contacto = document.getElementById('contact');
      if (contacto && contacto.getBoundingClientRect().top <= linea) actual = null;
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
            <a href="#" className="nav-logo">
              <KaizenWordmark />
            </a>
            <div className="nav-links">
              {LINKS.map(([id, texto]) => (
                <a key={id} href={`#${id}`} className={activa === id ? 'is-active' : undefined}>
                  {texto}
                </a>
              ))}
            </div>
            <div className="nav-actions">
              <ThemeToggle />
              <a href="#contact" className="btn-metallic nav-btn nav-desktop-cta">Cotizar</a>
              <button
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menú"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map(([id, texto]) => (
              <a key={id} href={`#${id}`} onClick={closeMenu}>
                {texto}
              </a>
            ))}
            <a href="#contact" className="btn-metallic mobile-cta" onClick={closeMenu}>Cotizar proyecto</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
