import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/Interludio.css';

/**
 * Una "diapositiva" de la presentación: la sección se queda fija mientras LA
 * NUBE (lib/nube.js) se arma en `forma` dentro de .interludio-forma, se lee la
 * frase y la forma explota de vuelta a polvo. La caja .interludio-forma es la
 * que le dice a la nube dónde y de qué tamaño dibujar.
 * `fallback`: lo que se ve en esa caja si la nube no corre (sin WebGL o con
 * prefers-reduced-motion). Se esconde con body.nube-on.
 * Tiempos de texto ligados al mismo progreso que usa la nube (0 = se fija,
 * 1 = se suelta): entra cuando la forma ya casi está, sale antes de explotar.
 * (La apertura con ΚΛΙΖΣΝ NO es un Interludio: vive en el escenario de Hero.jsx.)
 */
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

export default function Interludio({ forma, kicker, children, fallback, extra, id }) {
  const ref = useRef(null);
  // Mismo progreso que la nube; ver el gotcha de useTransform en ProyectosReel.jsx
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const opacity = useTransform(p, (v) => (v < 0.4 ? rango(v, [0.02, 0.16], [0, 1]) : rango(v, [0.56, 0.66], [1, 0])));
  const y = useTransform(p, (v) => (v < 0.4 ? rango(v, [0.02, 0.16], [40, 0]) : rango(v, [0.56, 0.66], [0, -30])));
  const blur = useTransform(p, (v) => `blur(${v < 0.4 ? rango(v, [0.02, 0.16], [8, 0]) : rango(v, [0.56, 0.66], [0, 8])}px)`);

  return (
    <section ref={ref} id={id} className={`interludio interludio--${forma}`} data-nube={forma}>
      <div className="interludio-sticky">
        {kicker && (
          <motion.p className="interludio-kicker" style={{ opacity }}>
            {kicker}
          </motion.p>
        )}
        <div className="interludio-forma">
          <div className="interludio-fallback">{fallback}</div>
        </div>
        <motion.h2 className="interludio-frase" style={{ opacity, y, filter: blur }}>
          {children}
        </motion.h2>
        {extra && (
          <motion.div className="interludio-extra" style={{ opacity, y }}>
            {extra}
          </motion.div>
        )}
      </div>
    </section>
  );
}
