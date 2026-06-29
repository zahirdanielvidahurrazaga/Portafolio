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

      <main>
        <Hero />
        <SobreMi />
        <FactorMecatronico />
        <PortafolioShowcase />
        <Testimonios />
        <ProcesoTrabajo />
        <Faq />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
