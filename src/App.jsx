import React, { Suspense, lazy, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Servicios from './components/Servicios';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BarraScroll from './components/BarraScroll';
import HeroRibbon from './components/HeroRibbon';
import Nube from './components/Nube';
import Hilo from './components/Hilo';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { useLang } from './lib/LangContext';

// Lo que va debajo de Servicios llega en un segundo archivo (ver Resto.jsx)
const Resto = lazy(() => import('./components/Resto'));
const Pie = lazy(() => import('./components/Resto').then((m) => ({ default: m.Pie })));

function App() {
  useSmoothScroll();
  const { t } = useLang();
  const titulo = t({
    es: 'KaiZen · Marca, redes, web y software a la medida',
    en: 'KaiZen · Branding, social media, websites & custom software',
  });
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="app-container">
      <Navbar />
      {/* Cinta 3D: nace de las partículas de la apertura, vive en el hero y sale de escena con el scroll */}
      <HeroRibbon />
      {/* La nube de partículas: toma el relevo de la cinta y se arma en cada Interludio */}
      <Nube />
      {/* El hilo: lo que queda de la cinta tras el telón; recorre la página hasta la Κ */}
      <Hilo />
      
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
        <Suspense fallback={null}>
          <Resto />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Pie />
      </Suspense>
      <FloatingWhatsApp />
      <BarraScroll />
    </div>
  );
}

export default App;
