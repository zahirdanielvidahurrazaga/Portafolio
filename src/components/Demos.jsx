import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import { WHATSAPP } from '../data/contacto';
import '../styles/Demos.css';

/*
 * DEMOS = "PRUÉBALO ANTES DE TENERLO" (2026-11-06). Decisión de Zahir y Karime:
 *  1. Demos POR GIRO, genéricas, para todos (aquí se ven en capturas reales).
 *     El sitio de demos sigue con CANDADO (se cerró el 13-oct porque el link
 *     salió en un TikTok): "Pedir acceso" manda a WhatsApp y ellos responden
 *     con un código de 7 días (`accesos.mjs nuevo` en ~/Developer/demos). Así
 *     además saben quién la pidió.
 *  2. "Tu negocio en la demo": la misma, con su logo y colores, gratis tras una
 *     llamada de 15 min (el filtro).
 *  3. Funciones nuevas = proyecto pagado (no se promete aquí).
 * Capturas en public/demos/*.webp: sacadas con playwright de demos-zahirv.pages.dev
 * (pos y clínica del servidor local, aún sin publicar), sin la barra de "demostración".
 * NO poner aquí demos pintadas para un prospecto real (Autocinema, KADE) ni Fortuna (rifas: es personal de Zahir).
 *
 * El MOTION (escena fija, ligada al scroll) cuenta los 3 pasos con la demo de
 * florería: se escribe "Florería Dalia" → el boceto se dibuja y se vuelve la
 * demo real → la pruebas en tu celular (pase de acceso + un pedido que entra).
 * Reemplaza al reel de la laptop de Proyectos (enseñaba un boceto y remataba
 * "Proyectos reales, no demos": justo lo contrario de este argumento de venta).
 */

const GIROS = [
  { id: 'alma', giro: { es: 'Estudio de pilates', en: 'Pilates studio' }, nombre: 'Studio Alma', img: '/demos/alma.webp' },
  { id: 'atlas', giro: { es: 'Gimnasio', en: 'Gym' }, nombre: 'Atlas Fitness', img: '/demos/atlas.webp' },
  { id: 'hoja', giro: { es: 'Restaurante y pedidos', en: 'Restaurant & orders' }, nombre: 'Hoja', img: '/demos/hoja.webp' },
  { id: 'dalia', giro: { es: 'Florería', en: 'Flower shop' }, nombre: 'Dalia', img: '/demos/dalia.webp' },
  { id: 'raiz', giro: { es: 'Clínica de nutrición', en: 'Nutrition clinic' }, nombre: 'Raíz', img: '/demos/raiz.webp' },
  { id: 'bisagra', giro: { es: 'Ferretería · punto de venta', en: 'Hardware store · POS' }, nombre: 'Bisagra', img: '/demos/bisagra.webp', ancho: true },
];

const wa = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

const PASOS = [
  { es: 'Nos cuentas de tu negocio', en: 'You tell us about your business' },
  { es: 'Lo armamos con tu marca', en: 'We build it with your brand' },
  { es: 'Lo pruebas en tu celular, antes de firmar', en: 'You try it on your phone, before signing' },
];
const NOMBRE = 'Florería Dalia';
// Tramos del motion sobre p (0 = se fija, 1 = se suelta)
const T = { escribe: [0.04, 0.24], boceto: [0.3, 0.46], real: [0.46, 0.58], prueba: [0.66, 0.8], frase: [0.84, 0.94] };

function Motion() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [letras, setLetras] = useState(0);
  const [paso, setPaso] = useState(0);
  useMotionValueEvent(p, 'change', (v) => {
    setLetras(Math.round(rango(v, T.escribe, [0, NOMBRE.length])));
    setPaso(v < 0.28 ? 0 : v < 0.62 ? 1 : 2);
  });
  // Boceto: los recuadros se dibujan (dashoffset) y luego la demo real los barre de arriba abajo
  const dibujo = useTransform(p, (v) => rango(v, T.boceto, [0, 1]));
  const boceto = useTransform(p, (v) => (v < T.boceto[0] - 0.02 ? 0 : 1));
  const campo = useTransform(p, (v) => rango(v, [T.boceto[0] - 0.04, T.boceto[0]], [1, 0]));
  const barrido = useTransform(p, (v) => `inset(0 0 ${rango(v, T.real, [100, 0])}% 0 round 30px)`);
  // Prueba: el teléfono se corre y entra el pase de acceso; un pedido cae en la demo
  const telX = useTransform(p, (v) => `${rango(v, T.prueba, [0, -14])}%`);
  const pase = useTransform(p, (v) => rango(v, T.prueba, [0, 1]));
  const paseX = useTransform(p, (v) => rango(v, T.prueba, [60, 0]));
  const aviso = useTransform(p, (v) => rango(v, [T.prueba[0] + 0.06, T.prueba[1]], [0, 1]));
  const avisoY = useTransform(p, (v) => rango(v, [T.prueba[0] + 0.06, T.prueba[1]], [-30, 0]));
  // Frase final
  const frase = useTransform(p, (v) => rango(v, T.frase, [0, 1]));
  const fraseY = useTransform(p, (v) => rango(v, T.frase, [30, 0]));
  const escena = useTransform(p, (v) => rango(v, T.frase, [1, 0.04]));
  const escenaBlur = useTransform(p, (v) => `blur(${rango(v, T.frase, [0, 10])}px)`);

  return (
    <div ref={ref} className="dm-pista">
      <div className="dm-escena">
        <motion.ol className="dm-pasos" style={{ opacity: escena, filter: escenaBlur }}>
          {PASOS.map((x, i) => (
            <li key={i} className={i === paso ? 'is-active' : i < paso ? 'is-done' : ''}>
              <span className="dm-paso-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="dm-paso-texto">{t(x)}</span>
            </li>
          ))}
        </motion.ol>

        <motion.div className="dm-stage" style={{ opacity: escena, filter: escenaBlur }}>
          <motion.div className="dm-tel" style={{ x: telX }}>
            <div className="dm-pantalla">
              {/* 1 · el nombre del negocio se escribe */}
              <motion.div className="dm-campo" style={{ opacity: campo }}>
                <span className="dm-campo-label">{t({ es: 'Tu negocio', en: 'Your business' })}</span>
                <span className="dm-campo-valor">
                  {NOMBRE.slice(0, letras)}
                  <i className="dm-caret" />
                </span>
              </motion.div>
              {/* 2 · el boceto se dibuja… */}
              <motion.svg className="dm-boceto" viewBox="0 0 100 200" preserveAspectRatio="none" style={{ opacity: boceto }} aria-hidden="true">
                {[
                  [8, 10, 84, 12],
                  [8, 28, 84, 70],
                  [8, 104, 40, 40],
                  [52, 104, 40, 40],
                  [8, 156, 84, 14],
                  [8, 178, 84, 12],
                ].map(([x, y, w, h], i) => (
                  <motion.rect key={i} x={x} y={y} width={w} height={h} rx="4" style={{ pathLength: dibujo }} />
                ))}
              </motion.svg>
              {/* …y se vuelve la demo real */}
              <motion.img className="dm-real" src="/demos/dalia.webp" alt="" style={{ clipPath: barrido }} loading="lazy" />
              {/* 3 · entra un pedido */}
              <motion.div className="dm-aviso" style={{ opacity: aviso, y: avisoY }}>
                <span className="dm-vivo" />
                <span>
                  <b>{t({ es: 'Pedido nuevo', en: 'New order' })}</b>
                  <br />
                  {t({ es: 'Ramo de temporada · $890', en: 'Seasonal bouquet · $890' })}
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="dm-pase" style={{ opacity: pase, x: paseX }}>
            <p className="dm-pase-kicker">{t({ es: 'Tu acceso', en: 'Your access' })}</p>
            <p className="dm-pase-nombre">Florería Dalia</p>
            <p className="dm-pase-sub">{t({ es: 'Como cliente, como equipo y como dueño', en: 'As a customer, as staff and as owner' })}</p>
            <div className="dm-pase-pie">
              <span>{t({ es: 'Válido 7 días', en: 'Valid 7 days' })}</span>
              <span className="dm-pase-codigo">DL7K-4QMA</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p className="dm-frase" style={{ opacity: frase, y: fraseY }}>
          {t({ es: <>Antes de firmar, <em>ya lo viste funcionando.</em></>, en: <>Before signing, <em>you’ve seen it working.</em></> })}
        </motion.p>
      </div>
    </div>
  );
}

export default function Demos() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  return (
    <section id="demos" className="demos-section">
      <div className="section-container demos-head">
        <SectionHead
          num="04"
          label={t({ es: 'Demos', en: 'Demos' })}
          lede={t({
            es: 'Cada demo es una app real con datos de ejemplo: la recorres como cliente, como equipo y como dueño, y ves cómo trabajaría tu negocio. Sin pagar nada.',
            en: 'Each demo is a real app with sample data: try it as a customer, as staff and as the owner, and see how your business would run. Without paying a thing.',
          })}
        >
          {t({ es: <>Pruébalo antes de <em>tenerlo</em></>, en: <>Try it before you <em>own it</em></> })}
        </SectionHead>
      </div>

      {!reduced && <Motion />}

      <div className="section-container dm-galeria-wrap">
        <div className="dm-galeria-head">
          <h3>{t({ es: <>Mira la demo de <em>tu giro</em></>, en: <>See the demo for <em>your industry</em></> })}</h3>
          <p>{t({ es: 'Pídela y te mandamos tu acceso por WhatsApp.', en: 'Ask for it and we’ll send your access on WhatsApp.' })}</p>
        </div>
        <ul className="dm-galeria">
          {GIROS.map((g) => (
            <li key={g.id} className={`dm-card${g.ancho ? ' dm-card--ancho' : ''}`}>
              <a
                href={wa(t({ es: `Hola, KaiZen. Quiero ver la demo de ${t(g.giro).toLowerCase()}.`, en: `Hi, KaiZen. I’d like to see the ${t(g.giro).toLowerCase()} demo.` }))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="dm-card-img">
                  <img src={g.img} alt={`${t({ es: 'Demo de', en: 'Demo for' })} ${t(g.giro)}: ${g.nombre}`} loading="lazy" />
                </span>
                <span className="dm-card-texto">
                  <span className="dm-card-giro">{t(g.giro)}</span>
                  <span className="dm-card-cta">
                    {t({ es: 'Pedir acceso', en: 'Request access' })} <ArrowUpRight size={14} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Nivel 2: con su marca, gratis tras 15 minutos */}
        <div className="dm-marca">
          <div>
            <p className="dm-marca-titulo">{t({ es: <>¿La quieres ver <em>con tu marca?</em></>, en: <>Want to see it <em>with your brand?</em></> })}</p>
            <p className="dm-marca-texto">
              {t({
                es: 'Agenda 15 minutos: te la enseñamos con tu logo, tus colores y tu nombre, sin costo.',
                en: 'Book 15 minutes: we’ll show it to you with your logo, colors and name, free of charge.',
              })}
            </p>
          </div>
          <a
            className="btn-metallic dm-marca-btn"
            href={wa(t({ es: 'Hola, KaiZen. Quiero agendar 15 minutos para ver la demo con mi marca. Mi negocio es: ', en: 'Hi, KaiZen. I’d like to book 15 minutes to see the demo with my brand. My business is: ' }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t({ es: 'Agendar 15 min', en: 'Book 15 min' })} <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
