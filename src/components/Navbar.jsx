import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          <div className="nav-container">
            <a href="#" className="nav-logo">
              Zahir<span className="logo-accent">.</span>
            </a>
            <div className="nav-links">
              <a href="#about">Mecatrónica</a>
              <a href="#portfolio">Soluciones</a>
              <a href="#tech">Tecnologías</a>
              <a href="#process">Proceso</a>
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
            <a href="#about" onClick={closeMenu}>Mecatrónica</a>
            <a href="#portfolio" onClick={closeMenu}>Soluciones</a>
            <a href="#tech" onClick={closeMenu}>Tecnologías</a>
            <a href="#process" onClick={closeMenu}>Proceso</a>
            <a href="#contact" className="btn-metallic mobile-cta" onClick={closeMenu}>Cotizar proyecto</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
