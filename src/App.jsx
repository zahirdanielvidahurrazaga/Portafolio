import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FactorMecatronico from './components/FactorMecatronico';
import SobreMi from './components/SobreMi';
import PortafolioShowcase from './components/PortafolioShowcase';
import Testimonios from './components/Testimonios';
import ProcesoTrabajo from './components/ProcesoTrabajo';
import Faq from './components/Faq';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="app-container">
      <Navbar />
      
      {/* Background Effect */}
      <motion.div 
        className="app-background"
        style={{ y: backgroundY }}
      />

      {/* Orden pensado para conversión: sigue las preguntas del cliente en el
          orden en que se las hace. ¿Qué hace? (Servicios) → ¿le creo?
          (Testimonios, con el video de cliente) → ¿ya lo hizo? (Proyectos) →
          ¿quién es? (Sobre mí) → ¿cómo trabajamos? (Proceso) → dudas (FAQ) →
          contacto. La prueba social va ARRIBA a propósito: antes vivía al 51%
          del scroll y casi nadie llegaba al video. */}
      <main>
        <Hero />
        <FactorMecatronico />
        <Testimonios />
        <PortafolioShowcase />
        <SobreMi />
        <ProcesoTrabajo />
        <Faq />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
