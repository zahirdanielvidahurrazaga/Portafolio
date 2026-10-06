import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SectionHead from './SectionHead';
import '../styles/SobreMi.css';

/**
 * NOSOTROS = "DOS MITADES → UNA APP" (2026-10-05). El id sigue siendo
 * #sobre-mi para no romper enlaces viejos.
 * Arriba, en flujo normal: "Somos KaiZen" + la bio de mejora continua.
 * Abajo, una escena fija (.nos-pista) que absorbió al Interludio del teléfono:
 *  1. las dos mitades del estudio lado a lado, cada una con su símbolo hecho
 *     por LA NUBE: un lápiz trazando un boceto (I · Estrategia y diseño) y
 *     `</>` (II · Ingeniería) — forma "mitades" en lib/nube.js;
 *  2. los textos se van y las dos figuras se FUNDEN en el teléfono (secuencia
 *     "mitades,telefono"): "De una idea a tu bolsillo.";
 *  3. explota y entra Proceso.
 * Idea pendiente: cuando haya fotos, el lápiz y el </> se vuelven las CARAS de
 * los dos (ella diseño, él ingeniería) y son ellas las que se funden.
 * Tiempos en progreso de la pista (q). La nube morfea en q 0.31→0.5 (último
 * 38% del primer tramo de 2), así que el texto cambia alrededor de ahí.
 */
const MITADES = [
  {
    num: 'I',
    titulo: 'Estrategia, marca y redes',
    texto:
      'Escuchamos tu negocio, diseñamos su identidad y su experiencia, y cuidamos cómo se comunica en redes, de la primera charla a cada publicación.',
  },
  {
    num: 'II',
    titulo: 'Ingeniería',
    texto:
      'Construimos el software de punta a punta: apps en App Store y Google Play, sistemas web y la conexión con el lector y la impresora de tu mostrador.',
  },
];

const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

function Escena() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Mitades: entran al fijarse la escena y se van antes de que las figuras se unan
  const mitades = useTransform(p, (v) => (v < 0.2 ? rango(v, [-0.06, 0.06], [0, 1]) : rango(v, [0.24, 0.32], [1, 0])));
  const mitadesY = useTransform(p, (v) => (v < 0.2 ? rango(v, [-0.06, 0.06], [24, 0]) : rango(v, [0.24, 0.32], [0, -20])));
  // Frase final: cuando el teléfono ya casi está; se va antes de la explosión
  const final = useTransform(p, (v) => (v < 0.8 ? rango(v, [0.42, 0.52], [0, 1]) : rango(v, [0.9, 0.98], [1, 0])));
  const finalY = useTransform(p, (v) => (v < 0.8 ? rango(v, [0.42, 0.52], [30, 0]) : rango(v, [0.9, 0.98], [0, -24])));
  const eventosFinal = useTransform(final, (o) => (o > 0.5 ? 'auto' : 'none'));

  return (
    <div ref={ref} className="nos-pista" data-nube="mitades,telefono" data-nube-modo="secuencia">
      <div className="nos-escena">
        {/* La nube dibuja aquí: primero las dos figuras, luego el teléfono */}
        <div className="interludio-forma nos-forma" aria-hidden="true" />

        <div className="nos-textos">
          <motion.div className="nos-mitades" style={{ opacity: mitades, y: mitadesY }}>
            {MITADES.map((m) => (
              <div key={m.titulo} className="nos-mitad">
                <span className="nos-mitad-num">{m.num}</span>
                <h3>{m.titulo}</h3>
                <p>{m.texto}</p>
              </div>
            ))}
          </motion.div>

          <motion.div className="nos-final" style={{ opacity: final, y: finalY, pointerEvents: eventosFinal }}>
            <p className="interludio-kicker">Del boceto a producción</p>
            <h2 className="interludio-frase">
              De una idea a <em>tu bolsillo.</em>
            </h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const SobreMi = () => {
  const reduced = useReducedMotion();
  return (
    <section id="sobre-mi" className="sobre-section">
      <div className="section-container sobre-head">
        <SectionHead num="05" label="Nosotros">
          Somos <em>KaiZen</em>
        </SectionHead>

        <motion.p
          className="sobre-bio"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Kaizen es la filosofía de la <em>mejora continua</em>: pasos pequeños, todos los
          días. Así trabajamos cada proyecto. No entregamos plantillas: construimos
          software a la medida que ya opera en negocios reales, y lo seguimos
          mejorando contigo.
        </motion.p>
        <a href="#contact" className="sobre-cta">Trabajemos juntos →</a>
      </div>

      {reduced ? (
        // Sin animación: las dos mitades y la frase, estáticas
        <div className="section-container nos-static">
          <div className="nos-mitades">
            {MITADES.map((m) => (
              <div key={m.titulo} className="nos-mitad">
                <span className="nos-mitad-num">{m.num}</span>
                <h3>{m.titulo}</h3>
                <p>{m.texto}</p>
              </div>
            ))}
          </div>
          <h2 className="interludio-frase nos-static-frase">
            De una idea a <em>tu bolsillo.</em>
          </h2>
        </div>
      ) : (
        <Escena />
      )}
    </section>
  );
};

export default SobreMi;
