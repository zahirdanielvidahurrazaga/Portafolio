import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Servicios from './components/Servicios';
import SobreMi from './components/SobreMi';
import PortafolioShowcase from './components/PortafolioShowcase';
import Testimonios from './components/Testimonios';
import ProcesoTrabajo from './components/ProcesoTrabajo';
import Faq from './components/Faq';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BarraScroll from './components/BarraScroll';
import HeroRibbon from './components/HeroRibbon';
import DiagonalReveal from './components/DiagonalReveal';
import Nube from './components/Nube';
import Interludio from './components/Interludio';
import { useSmoothScroll } from './lib/useSmoothScroll';

// Respaldo del interludio final (sin WebGL o con reduced-motion): la misma forma en trazo
const FallbackK = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <rect x="2" y="2" width="96" height="96" rx="22" strokeWidth="3" />
    <path d="M33 27V73 M66 27 38 52 M48 44 68 73" strokeWidth="11" />
  </svg>
);

function App() {
  useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="app-container">
      <Navbar />
      {/* Cinta 3D: nace de las partículas de la apertura, vive en el hero y sale de escena con el scroll */}
      <HeroRibbon />
      {/* La nube de partículas: toma el relevo de la cinta y se arma en cada Interludio */}
      <Nube />
      
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
        {/* APERTURA + HERO (modo presentación): un solo escenario fijo de ~5
            pantallas. ΚΛΙΖΣΝ en partículas → las letras se vuelven la cinta →
            el titular se arma EN SU LUGAR. Ver Hero.jsx. Los Interludios de
            más abajo son "diapositivas" donde la nube se arma y explota; pocos
            y espaciados, o el sitio se vuelve un trámite. */}
        <Hero />
        <Servicios />
        <Testimonios />
        <PortafolioShowcase />
        {/* Corte diagonal al entrar (estilo Lusion). Solo en dos secciones: en
            todas se volvería tic y dejaría de notarse. */}
        <DiagonalReveal>
          <SobreMi />
        </DiagonalReveal>
        {/* (El teléfono "De una idea a tu bolsillo" ahora vive dentro de Nosotros:
            las dos mitades del estudio se funden en él. Ver SobreMi.jsx.) */}
        <DiagonalReveal>
          <ProcesoTrabajo />
        </DiagonalReveal>
        <Faq />
        <Interludio
          forma="k"
          kicker="Tu turno"
          fallback={<FallbackK />}
          extra={
            <a href="#contact" className="btn-metallic btn-large">
              Cuéntanos tu proyecto
            </a>
          }
        >
          ¿<em>Empezamos</em>?
        </Interludio>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <BarraScroll />
    </div>
  );
}

export default App;
