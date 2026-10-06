import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import KaizenWordmark from './KaizenWordmark';
import { useLang } from '../lib/LangContext';
import { RELEVO } from '../lib/cintaPuente';
import '../styles/Hero.css';
import '../styles/Interludio.css';

/**
 * APERTURA + HERO = UN SOLO ESCENARIO FIJO (modo presentación, como lusion.co).
 * Nada "sube": la sección mide ~5 pantallas, el escenario se queda pegado y el
 * contenido se transforma EN SU LUGAR con el scroll (P = 0…1):
 *   0.00–0.08  ΚΛΙΖΣΝ en partículas, quieto (hay que empezar a bajar)
 *   0.08–0.20  la frase se tuerce y se va (RELEVO.texto)
 *   0.12–0.50  las letras viajan a la cinta (RELEVO.flujo, en nube.js) — LARGO a
 *              propósito: es el momento que más le gustó a Zahir
 *   0.46–0.60  la cinta se solidifica (RELEVO.cruce, en heroRibbon.js)
 *   0.52–0.82  el titular se arma palabra por palabra desde su ranura
 *   0.82–0.90  pausa: se lee la oferta con la cinta viva
 *   0.90–0.98  el titular se va en su lugar; al soltarse entra Servicios
 * La sección lleva data-nube="kaizen" + modo apertura: de aquí la nube toma la
 * caja .interludio-forma y su progreso. Los tiempos del relevo viven en
 * cintaPuente.js (RELEVO); los del titular, aquí.
 * Con prefers-reduced-motion: sin escenario, el hero de siempre, estático.
 */

// Interpolación con tope (ver el gotcha de useTransform en ProyectosReel.jsx)
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

// Titular palabra por palabra, por idioma ([palabra, en itálica])
const TITULAR = {
  es: [['Evoluciona', 'la', 'forma'], [['en'], ['que'], ['haces', true], ['negocio', true]]],
  en: [['Evolve', 'the', 'way'], [['you'], ['do', true], ['business', true]]],
};
const TITULAR_TXT = { es: 'Evoluciona la forma en que haces negocio', en: 'Evolve the way you do business' };
// Frase de la apertura; desde `EM` va en itálica
const FRASE = {
  es: { palabras: ['Pequeñas', 'mejoras,', 'todos', 'los', 'días.'], em: 2 },
  en: { palabras: ['Small', 'improvements,', 'every', 'day.'], em: 2 },
};
const CABECERA = { es: ['Marca · Redes · Web · Apps', 'Nº 01 — 2026'], en: ['Brand · Social · Web · Apps', 'No. 01 — 2026'] };
const BOTONES = {
  es: ['Cuéntanos tu proyecto', 'Ver proyectos'],
  en: ['Tell us about your project', 'See our work'],
};
const SALIDA = [0.9, 0.98];
// Antes de esto se calcula la ENTRADA de cada pieza; después, su salida
const MITAD = 0.89;

/** Palabra que sale de su ranura (máscara) al entrar y se va hacia arriba al salir */
function Palabra({ p, i, texto, em }) {
  const a = 0.56 + i * 0.026;
  const y = useTransform(p, (v) =>
    v < MITAD ? `${rango(v, [a, a + 0.08], [140, 0])}%` : `${rango(v, [SALIDA[0] + i * 0.008, SALIDA[1]], [0, -140])}%`
  );
  const rotate = useTransform(p, (v) => (v < MITAD ? rango(v, [a, a + 0.08], [7, 0]) : 0));
  return (
    <span className="hw">
      <motion.span className={em ? 'hero-em' : undefined} style={{ y, rotate }}>
        {texto}
      </motion.span>
    </span>
  );
}

/** Palabra de la frase de apertura: se tuerce y se va (como "LUSION" en Lusion) */
function PalabraFrase({ p, i, total, children }) {
  const lado = i - (total - 1) / 2;
  const [a, b] = RELEVO.texto;
  const ini = a + Math.abs(lado) * 0.012;
  const t = (v) => rango(v, [ini, b], [0, 1]);
  const y = useTransform(p, (v) => -70 * t(v));
  const x = useTransform(p, (v) => lado * 26 * t(v));
  const rotate = useTransform(p, (v) => lado * 9 * t(v));
  const skewX = useTransform(p, (v) => -lado * 14 * t(v));
  const opacity = useTransform(p, (v) => 1 - t(v));
  const filter = useTransform(p, (v) => `blur(${t(v) * 8}px)`);
  return (
    <motion.span className="hero-kaizen-w" style={{ y, x, rotate, skewX, opacity, filter }}>
      {children}
    </motion.span>
  );
}

const Hero = () => {
  const { lang, t } = useLang();
  const [LINEA_1, LINEA_2] = TITULAR[lang];
  const [cab1, cab2] = CABECERA[lang];
  const [boton1, boton2] = BOTONES[lang];
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const regla = useTransform(p, (v) => (v < MITAD ? rango(v, [0.52, 0.6], [0, 1]) : rango(v, SALIDA, [1, 0])));
  const cabecera = useTransform(p, (v) => (v < MITAD ? rango(v, [0.56, 0.62], [0, 1]) : rango(v, SALIDA, [1, 0])));
  const acciones = useTransform(p, (v) => (v < MITAD ? rango(v, [0.74, 0.8], [0, 1]) : rango(v, SALIDA, [1, 0])));
  const accionesY = useTransform(p, (v) => (v < MITAD ? rango(v, [0.74, 0.8], [24, 0]) : rango(v, SALIDA, [0, -24])));
  // Fuera de su rango los botones no deben poder tocarse
  const accionesEventos = useTransform(acciones, (o) => (o > 0.5 ? 'auto' : 'none'));
  const kicker = useTransform(p, (v) => rango(v, RELEVO.texto, [1, 0]));

  if (reduced) {
    return (
      <section className="hero-section hero-section--static">
        <div className="hero-stage">
          <div className="hero-content">
            <div className="hero-masthead hero-masthead--static">
              <span>{cab1}</span>
              <span>{cab2}</span>
            </div>
            <h1>
              <span className="hero-line-break">{LINEA_1.join(' ')}</span>{' '}
              {LINEA_2.map(([w, em]) => (em ? <em key={w} className="hero-em">{w} </em> : `${w} `))}
            </h1>
            <div className="hero-actions">
              <a href="#contact" className="btn-metallic btn-large">{boton1}</a>
              <a href="#portfolio" className="btn-secondary btn-large">{boton2}</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { palabras: frase, em: desdeEm } = FRASE[lang];

  return (
    <section ref={ref} className="hero-section" data-nube="kaizen" data-nube-modo="apertura">
      <div className="hero-stage">
        {/* Capa 1 · ΚΛΙΖΣΝ (las letras las dibuja la nube en .interludio-forma) */}
        {/* Al abrir, sus textos esperan a que la nube arme ΚΛΙΖΣΝ (html.intro) */}
        <div className="hero-kaizen hero-kaizen-textos interludio--kaizen">
          <motion.p className="interludio-kicker" style={{ opacity: kicker }}>
            改善 · Kaizen
          </motion.p>
          <div className="interludio-forma">
            <div className="interludio-fallback">
              <KaizenWordmark />
            </div>
          </div>
          <p className="interludio-frase" aria-label={frase.join(' ')}>
            {frase.map((w, i) => (
              <PalabraFrase key={`${lang}-${w}`} p={p} i={i} total={frase.length}>
                {i >= desdeEm ? <em>{w}</em> : w}
              </PalabraFrase>
            ))}
          </p>
          <motion.p className="interludio-desliza" style={{ opacity: kicker }}>
            {t({ es: 'Desliza', en: 'Scroll' })}
          </motion.p>
        </div>

        {/* Capa 2 · el hero, que se arma en el mismo lugar */}
        <div className="hero-content">
          <div className="hero-masthead">
            <motion.span style={{ opacity: cabecera }}>{cab1}</motion.span>
            <motion.span style={{ opacity: cabecera }}>{cab2}</motion.span>
            <motion.i className="hero-rule" style={{ scaleX: regla }} aria-hidden="true" />
          </div>

          <h1 aria-label={TITULAR_TXT[lang]}>
            <span className="hero-line-break" aria-hidden="true">
              {LINEA_1.map((w, i) => (
                <React.Fragment key={`${lang}-${w}`}>
                  <Palabra p={p} i={i} texto={w} />{' '}
                </React.Fragment>
              ))}
            </span>
            <span aria-hidden="true">
              {LINEA_2.map(([w, em], i) => (
                <React.Fragment key={`${lang}-${w}`}>
                  <Palabra p={p} i={i + LINEA_1.length} texto={w} em={em} />{' '}
                </React.Fragment>
              ))}
            </span>
          </h1>

          <motion.div
            className="hero-actions"
            style={{ opacity: acciones, y: accionesY, pointerEvents: accionesEventos }}
          >
            <a href="#contact" className="btn-metallic btn-large">{boton1}</a>
            <a href="#portfolio" className="btn-secondary btn-large">{boton2}</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
