import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Play, X } from 'lucide-react';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import '../styles/Testimonios.css';

/**
 * Testimonios de clientes reales.
 * ⚠️ OJO: las frases son un BORRADOR realista — confírmalas/edítalas con las
 * palabras reales de cada cliente antes de publicar. Para agregar/quitar, solo
 * edita este arreglo.
 */
// `logo` = foto de perfil del testimonio. `video` = testimonio grabado por el
// cliente (vertical); si existe, la tarjeta muestra la miniatura y abre el
// lightbox. `poster` = primer cuadro que se ve antes de reproducir.
// El del VIDEO va primero a propósito: es el testimonio más fuerte, y en móvil
// las tarjetas se apilan, así que el orden del arreglo decide qué se ve antes.
const TESTIMONIOS = [
  {
    // Sin cita escrita a propósito: el testimonio son ELLAS en el video, no una
    // frase redactada por nosotros. Si algún día dan una frase textual, se pone aquí.
    quote: null,
    name: 'Be Fit Lab',
    business: { es: 'Estudio de Pilates', en: 'Pilates studio' },
    logo: '/logos/befit-mark.png',
    video: '/testimonios/befit-testimonio.mp4',
    poster: '/testimonios/befit-poster.jpg',
    videoDuracion: '0:52',
    proyecto: 'befit',
    // "Qué cambió": sale del `result` REAL de Be Fit Lab en projects.js, en corto
    cambio: {
      es: 'Dejaron las reservas por WhatsApp y las membresías a mano: hoy todo vive en su propia app, publicada en App Store y Google Play.',
      en: 'They left WhatsApp bookings and manual memberships behind: everything now lives in their own app, on the App Store and Google Play.',
    },
  },
  {
    quote: {
      es: 'Digitalizamos toda la tienda con su sistema de punto de venta. Ahora controlamos el inventario y vendemos desde el celular sin complicaciones. Quedó justo como lo necesitábamos.',
      en: 'We digitized the whole store with their point of sale system. Now we control inventory and sell from our phones with no hassle. It turned out exactly how we needed it.',
    },
    name: 'Carlos Carbajal',
    business: { es: 'Plásticos y Jarciería Tito', en: 'Plásticos y Jarciería Tito' },
    logo: '/logos/tito.png',
    video: null,
    proyecto: 'pos',
    // Del `result` REAL del POS en projects.js
    cambio: {
      es: '215 productos por sucursal, cobro en terminal, cortes de caja e inventario en tiempo real, en web, iOS y Android.',
      en: '215 products per branch, terminal checkout, cash closing and real-time inventory, on web, iOS and Android.',
    },
  },
];

// Interpolación con tope (ver el gotcha de useTransform en ProyectosReel.jsx)
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * "CASOS" (2026-11-06). Antes cada testimonio era su propia escena larga (2,600 px
 * para dos). Ahora cada cliente es UNA tarjeta y van lado a lado, con lo que vende:
 *  - la voz del cliente (su video, o su cita que se "lee" con el scroll);
 *  - QUÉ CAMBIÓ en su negocio (dato real, del `result` de su proyecto);
 *  - "Ver el proyecto" (abre su caso en Proyectos: evento `kaizen:proyecto`).
 * Con más clientes la fila se vuelve un carrusel con snap (ver el CSS).
 */
const abrirCaso = (id) => window.dispatchEvent(new CustomEvent('kaizen:proyecto', { detail: { id } }));

function Cambio({ t }) {
  const { t: tr } = useLang();
  return (
    <div className="caso-cambio">
      <p className="caso-cambio-label">{tr({ es: 'Qué cambió', en: 'What changed' })}</p>
      <p className="caso-cambio-texto">{tr(t.cambio)}</p>
      {t.proyecto && (
        <button type="button" className="caso-link" onClick={() => abrirCaso(t.proyecto)}>
          {tr({ es: 'Ver el proyecto', en: 'See the project' })} <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}

function Autor({ t }) {
  const { lang, t: tr } = useLang();
  return (
    <figcaption className="testimonio-author">
      <span className="testimonio-avatar">
        <img src={t.logo} alt={tr(t.business)} loading="lazy" />
      </span>
      <span className="testimonio-author-meta">
        <span className="testimonio-name">{t.name}</span>
        <span className="testimonio-business">
          {tr(t.business)}
          {/* La cita original es en español: en inglés se avisa que es traducción */}
          {t.quote && lang === 'en' && ' · Translated from Spanish'}
        </span>
      </span>
    </figcaption>
  );
}

function CasoVideo({ t, n, total, onAbrir }) {
  const { t: tr } = useLang();
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const enPantalla = useInView(ref, { margin: '0px 0px -10% 0px' });
  // Se monta la PRIMERA vez que aparece (antes no se pide el MP4) y después
  // solo se pausa/reanuda, para no recargarlo en cada pasada
  const [visto, setVisto] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    if (enPantalla) setVisto(true);
    const v = videoRef.current;
    if (!v) return;
    if (enPantalla) v.play().catch(() => {});
    else v.pause();
  }, [enPantalla, visto]);

  return (
    <figure ref={ref} className="caso caso--video">
      <button
        type="button"
        className="testimonio-video-btn caso-video"
        onClick={() => onAbrir(t)}
        aria-label={tr({ es: `Ver el testimonio en video de ${tr(t.business)}`, en: `Watch ${t.name}'s video testimonial` })}
      >
        <img src={t.poster} alt="" loading="lazy" aria-hidden="true" />
        {/* Vista previa muda: solo se monta (y descarga) con la tarjeta en pantalla */}
        {visto && !reduced && (
          <video ref={videoRef} src={t.video} poster={t.poster} muted loop autoPlay playsInline preload="metadata" aria-hidden="true" />
        )}
        <span className="testimonio-video-play">
          <Play size={26} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="testimonio-video-dur">{t.videoDuracion}</span>
      </button>
      <div className="caso-cuerpo">
        <p className="caso-cuenta">{n} / {total}</p>
        <p className="caso-voz">
          {tr({ es: <>Lo cuentan <em>las dueñas</em>, en su estudio.</>, en: <>Told by <em>the owners</em>, in their studio.</> })}
        </p>
        <button type="button" className="caso-play" onClick={() => onAbrir(t)}>
          <Play size={14} fill="currentColor" strokeWidth={0} />
          {tr({ es: 'Ver su experiencia', en: 'Watch their story' })} · {t.videoDuracion}
        </button>
        <Autor t={t} />
        <Cambio t={t} />
      </div>
    </figure>
  );
}

function Palabra({ p, i, total, children }) {
  // Se lee de izquierda a derecha mientras la tarjeta entra a la pantalla
  const a = (i / total) * 0.85;
  const opacity = useTransform(p, (v) => rango(v, [a, a + 0.15], [0.18, 1]));
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

function CasoCita({ t, n, total }) {
  const { lang, t: tr } = useLang();
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // De que asoma por abajo a que su centro llega a media pantalla
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 0.85', 'center 0.5'] });
  const cita = tr(t.quote);
  const palabras = cita.split(' ');
  return (
    <figure ref={ref} className="caso caso--cita">
      <div className="caso-cuerpo">
        <p className="caso-cuenta">{n} / {total}</p>
        <blockquote className="caso-cita">
          <span className="caso-comilla" aria-hidden="true">“</span>
          {reduced
            ? cita
            : palabras.map((w, i) => (
                <Palabra key={`${lang}-${i}`} p={p} i={i} total={palabras.length}>
                  {w}
                </Palabra>
              ))}
        </blockquote>
        <Autor t={t} />
        <Cambio t={t} />
      </div>
    </figure>
  );
}

const Testimonios = () => {
  const { t: tr } = useLang();
  // Testimonio cuyo video está abierto en el lightbox (null = cerrado).
  const [videoAbierto, setVideoAbierto] = useState(null);
  const cerrar = useCallback(() => setVideoAbierto(null), []);

  // Mismo patrón que ProjectModal: Escape cierra, se bloquea el scroll y
  // `pm-open` esconde el botón flotante de WhatsApp.
  useEffect(() => {
    if (!videoAbierto) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pm-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.classList.remove('pm-open');
    };
  }, [videoAbierto, cerrar]);

  const total = String(TESTIMONIOS.length).padStart(2, '0');

  return (
    <section id="testimonios" className="testimonios-section">
      <div className="section-container testimonios-head">
        <SectionHead
          num="03"
          label={tr({ es: 'Testimonios', en: 'Testimonials' })}
          lede={tr({
            es: 'Negocios reales que ya operan con lo que construimos.',
            en: 'Real businesses already running on what we built.',
          })}
        >
          {tr({ es: <>Lo que dicen <em>nuestros clientes</em></>, en: <>What our <em>clients say</em></> })}
        </SectionHead>
      </div>

      <div className={`casos section-container${TESTIMONIOS.length > 2 ? ' casos--carrusel' : ''}`}>
        {TESTIMONIOS.map((t, i) => {
          const n = String(i + 1).padStart(2, '0');
          return t.video ? (
            <CasoVideo key={t.name} t={t} n={n} total={total} onAbrir={setVideoAbierto} />
          ) : (
            <CasoCita key={t.name} t={t} n={n} total={total} />
          );
        })}
      </div>

      <AnimatePresence>
        {videoAbierto && (
          <motion.div
            className="testimonio-lightbox"
            onClick={cerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${tr({ es: 'Testimonio en video de', en: 'Video testimonial from' })} ${videoAbierto.name}`}
          >
            <button
              type="button"
              className="testimonio-lightbox-close"
              onClick={cerrar}
              aria-label={tr({ es: 'Cerrar video', en: 'Close video' })}
            >
              <X size={20} />
            </button>

            {/* stopPropagation: tocar el video (o sus controles) no cierra */}
            <motion.video
              key={videoAbierto.video}
              className="testimonio-lightbox-video"
              src={videoAbierto.video}
              poster={videoAbierto.poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />

            <p className="testimonio-lightbox-caption">
              {videoAbierto.name} · {tr(videoAbierto.business)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonios;
