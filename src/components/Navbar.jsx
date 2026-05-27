import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
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
            <a href="#contact" className="btn-metallic nav-btn">Cotizar</a>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
