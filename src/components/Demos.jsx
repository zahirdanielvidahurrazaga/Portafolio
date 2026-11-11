import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import { useTheme } from '../lib/ThemeContext';
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

// `titulo` (con <em>) y `que` son para el elenco: lo que se lee cuando ese giro queda al frente.
// ⚠️ `que` = BORRADOR de Claude leyendo las capturas: confirmar que cada demo sí hace eso.
const GIROS = [
  {
    id: 'alma', giro: { es: 'Estudio de pilates', en: 'Pilates studio' }, nombre: 'Studio Alma', img: '/demos/alma.webp',
    titulo: { es: 'Estudio de <em>pilates.</em>', en: 'Pilates <em>studio.</em>' },
    que: { es: 'reservas, lista de espera y pase de entrada', en: 'bookings, waitlist and entry pass' },
  },
  {
    id: 'atlas', giro: { es: 'Gimnasio', en: 'Gym' }, nombre: 'Atlas Fitness', img: '/demos/atlas.webp',
    titulo: { es: 'Gimnasio.', en: 'Gym.' },
    que: { es: 'acceso con pase y aforo en vivo', en: 'pass-based entry and live capacity' },
  },
  {
    id: 'hoja', giro: { es: 'Restaurante y pedidos', en: 'Restaurant & orders' }, nombre: 'Hoja', img: '/demos/hoja.webp',
    titulo: { es: 'Restaurante <em>y pedidos.</em>', en: 'Restaurant <em>& orders.</em>' },
    que: { es: 'menú y pedidos desde el celular', en: 'menu and orders from your phone' },
  },
  {
    id: 'dalia', giro: { es: 'Florería', en: 'Flower shop' }, nombre: 'Dalia', img: '/demos/dalia.webp',
    titulo: { es: 'Florería.', en: 'Flower shop.' },
    que: { es: 'catálogo, carrito y pedidos', en: 'catalog, cart and orders' },
  },
  {
    id: 'raiz', giro: { es: 'Clínica de nutrición', en: 'Nutrition clinic' }, nombre: 'Raíz', img: '/demos/raiz.webp',
    titulo: { es: 'Clínica de <em>nutrición.</em>', en: 'Nutrition <em>clinic.</em>' },
    que: { es: 'plan de comidas y seguimiento diario', en: 'meal plan and daily tracking' },
  },
  {
    id: 'bisagra', giro: { es: 'Ferretería · punto de venta', en: 'Hardware store · POS' }, nombre: 'Bisagra', img: '/demos/bisagra.webp', ancho: true,
    titulo: { es: 'Ferretería <em>y punto de venta.</em>', en: 'Hardware store <em>& POS.</em>' },
    que: { es: 'caja y ventas del día', en: 'checkout and daily sales' },
  },
];

// Textos del elenco por formación (la 2ª, el anillo, escribe el giro que queda al frente)
const FORMACIONES = [
  [
    { es: 'Demos · 6 giros', en: 'Demos · 6 industries' },
    { es: 'Seis negocios, <em>ya funcionando.</em>', en: 'Six businesses, <em>already running.</em>' },
    { es: 'No son maquetas: son apps reales con datos de ejemplo.', en: 'Not mockups: real apps with sample data.' },
  ],
  null,
  [
    { es: 'Un solo estudio', en: 'One studio' },
    { es: 'La misma calidad, <em>en cualquier giro.</em>', en: 'The same quality, <em>in any industry.</em>' },
    { es: 'Si el tuyo no está aquí, lo armamos: cuéntanos de tu negocio.', en: 'If yours isn’t here, we’ll build it: tell us about your business.' },
  ],
  [
    { es: 'Tu turno', en: 'Your turn' },
    { es: 'Elige la tuya <em>y pruébala.</em>', en: 'Pick yours <em>and try it.</em>' },
    { es: 'Te mandamos un acceso de 7 días por WhatsApp. Sin pagar nada.', en: 'We’ll send you a 7-day access on WhatsApp. Free of charge.' },
  ],
];

const wa = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
const pedir = (t, g) =>
  wa(t({ es: `Hola, KaiZen. Quiero ver la demo de ${t(g.giro).toLowerCase()}.`, en: `Hi, KaiZen. I’d like to see the ${t(g.giro).toLowerCase()} demo.` }));
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

const PASOS = [
  { es: 'Nos cuentas de tu negocio', en: 'You tell us about your business' },
  { es: 'Lo armamos con tu marca', en: 'We build it with your brand' },
  { es: 'Lo pruebas en tu celular, antes de firmar', en: 'You try it on your phone, before signing' },
];
const NOMBRE = 'Florería Dalia';
// Tramos del motion sobre p (0 = se fija, 1 = se suelta)
const T = { escribe: [0.04, 0.24], boceto: [0.3, 0.46], real: [0.46, 0.58], prueba: [0.66, 0.8], frase: [0.84, 0.94] };

const ESCRITORIO = '(min-width: 900px) and (pointer: fine)';

function Motion() {
  const { t } = useLang();
  const { theme } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // EL TELÉFONO DE CROMO (lib/telefono.js): en escritorio con WebGL, el aparato es
  // 3D y pinta en su pantalla lo mismo que el teléfono de CSS (que se queda de
  // respaldo, y es el que se ve en celular).
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const telRef = useRef(null);
  const tRef = useRef(t);
  const themeRef = useRef(theme);
  const [tel3d, setTel3d] = useState(false);
  useEffect(() => {
    tRef.current = t;
    telRef.current?.refrescar();
  }, [t]);
  useEffect(() => {
    themeRef.current = theme;
    telRef.current?.setTheme(theme);
  }, [theme]);
  useEffect(() => {
    if (!window.matchMedia(ESCRITORIO).matches) return undefined;
    let cancelado = false;
    import('../lib/telefono').then(({ crearTelefono }) => {
      if (cancelado || !stageRef.current) return;
      const tt = (v) => tRef.current(v);
      telRef.current = crearTelefono(stageRef.current, canvasRef.current, {
        theme: themeRef.current,
        progreso: () => p.get(),
        tramos: T,
        imagen: '/demos/dalia.webp',
        textos: () => ({
          nombre: NOMBRE,
          etiqueta: tt({ es: 'Tu negocio', en: 'Your business' }),
          aviso: tt({ es: 'Pedido nuevo', en: 'New order' }),
          avisoSub: tt({ es: 'Ramo de temporada · $890', en: 'Seasonal bouquet · $890' }),
        }),
      });
      if (telRef.current) setTel3d(true);
    });
    return () => {
      cancelado = true;
      telRef.current?.destroy();
      telRef.current = null;
      setTel3d(false);
    };
  }, [p]);
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

        <motion.div ref={stageRef} className={`dm-stage${tel3d ? ' dm-stage--3d' : ''}`} style={{ opacity: escena, filter: escenaBlur }}>
          <canvas ref={canvasRef} className="dm-tel3d" aria-hidden="true" />
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

/*
 * EL ELENCO (lib/elenco.js): las seis demos como tarjetas de vidrio en un lienzo
 * fijo, que pasan por cuatro formaciones con el scroll (nube → anillo → abanico
 * → fila) y en la fila ya se pueden tocar (abre WhatsApp, igual que las tarjetas).
 * Solo en escritorio con mouse y WebGL; si algo falta, `alFallar` regresa a la
 * rejilla de tarjetas de siempre. Los enlaces reales van en .el-accesible.
 */
function Elenco({ alFallar }) {
  const { t } = useLang();
  const ref = useRef(null);
  const instRef = useRef(null);
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
    instRef.current?.refrescar();
  }, [t]);
  useEffect(() => {
    let cancelado = false;
    import('../lib/elenco').then(({ crearElenco }) => {
      if (cancelado || !ref.current) return;
      const tt = (v) => tRef.current(v);
      instRef.current = crearElenco(ref.current, {
        demos: GIROS.map((g) => ({ id: g.id, img: g.img, ancha: g.ancho })),
        textos: () => ({
          giro: tt({ es: 'Giro', en: 'Industry' }),
          formaciones: FORMACIONES.map((f) => f && f.map(tt)),
          giros: GIROS.map((g) => ({ titulo: tt(g.titulo), sub: `${g.nombre} · ${tt(g.que)}` })),
        }),
        alElegir: (d) => {
          const g = GIROS.find((x) => x.id === d.id);
          if (g) window.open(pedir(tt, g), '_blank', 'noopener,noreferrer');
        },
      });
      if (!instRef.current) alFallar();
    });
    return () => {
      cancelado = true;
      instRef.current?.destroy();
      instRef.current = null;
    };
  }, [alFallar]);
  return (
    <div ref={ref} className="el-pista">
      <div className="el-escena">
        <div className="el-txt">
          <p className="el-n" />
          <h3 className="el-titulo" />
          <p className="el-sub" />
          <div className="el-ticks" aria-hidden="true">
            {GIROS.map((g) => (
              <i key={g.id} />
            ))}
          </div>
        </div>
        <div className="el-etqs" aria-hidden="true">
          {GIROS.map((g) => (
            <span key={g.id} className="el-etq">
              <b>{t(g.giro)}</b>
              <small>{g.nombre}</small>
              <u>{t({ es: 'Pedir acceso →', en: 'Request access →' })}</u>
            </span>
          ))}
        </div>
        <ul className="el-accesible">
          {GIROS.map((g) => (
            <li key={g.id}>
              <a href={pedir(t, g)} target="_blank" rel="noopener noreferrer">
                {t({ es: 'Pedir acceso a la demo de', en: 'Request access to the demo for' })} {t(g.giro)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Demos() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  // El elenco solo con pantalla ancha y mouse; en celular (o si falla el WebGL), la rejilla
  const [elenco, setElenco] = useState(() => typeof window !== 'undefined' && window.matchMedia(ESCRITORIO).matches);
  const [sinWebgl, setSinWebgl] = useState(false);
  const fallar = useCallback(() => setSinWebgl(true), []);
  useEffect(() => {
    const mq = window.matchMedia(ESCRITORIO);
    const on = () => setElenco(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const conElenco = elenco && !reduced && !sinWebgl;
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

      {conElenco && <Elenco alFallar={fallar} />}

      <div className="section-container dm-galeria-wrap">
        {!conElenco && (
        <>
        <div className="dm-galeria-head">
          <h3>{t({ es: <>Mira la demo de <em>tu giro</em></>, en: <>See the demo for <em>your industry</em></> })}</h3>
          <p>{t({ es: 'Pídela y te mandamos tu acceso por WhatsApp.', en: 'Ask for it and we’ll send your access on WhatsApp.' })}</p>
        </div>
        <ul className="dm-galeria">
          {GIROS.map((g) => (
            <li key={g.id} className={`dm-card${g.ancho ? ' dm-card--ancho' : ''}`}>
              <a
                href={pedir(t, g)}
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
        </>
        )}

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
