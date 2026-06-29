import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidGlass from './LiquidGlass';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
              Zahir Vidahurrázaga
            </a>
            <div className="nav-links">
              <a href="#sobre-mi">Sobre mí</a>
              <a href="#about">Servicios</a>
              <a href="#portfolio">Soluciones</a>
              <a href="#testimonios">Testimonios</a>
              <a href="#process">Proceso</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="nav-actions">
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
            <a href="#sobre-mi" onClick={closeMenu}>Sobre mí</a>
            <a href="#about" onClick={closeMenu}>Servicios</a>
            <a href="#portfolio" onClick={closeMenu}>Soluciones</a>
            <a href="#testimonios" onClick={closeMenu}>Testimonios</a>
            <a href="#process" onClick={closeMenu}>Proceso</a>
            <a href="#faq" onClick={closeMenu}>FAQ</a>
            <a href="#contact" className="btn-metallic mobile-cta" onClick={closeMenu}>Cotizar proyecto</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
