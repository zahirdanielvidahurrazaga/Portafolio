import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Play, X } from 'lucide-react';
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
  },
];

// Interpolación con tope (ver el gotcha de useTransform en ProyectosReel.jsx)
const rango = (v, [a, b], [c, d]) => c + (d - c) * Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * "LECTURA" (2026-10-05, modo presentación sin partículas):
 *  - Testimonio con VIDEO: el video CRECE con el scroll hasta una tarjeta
 *    vertical grande, con vista previa muda en loop SOLO mientras está en
 *    pantalla (el MP4 no se pide antes). Tocarla abre el lightbox con sonido.
 *  - Testimonio con CITA: escena fija corta; la cita se "lee" con el scroll,
 *    cada palabra pasa de gris a tinta. Al final aparece quién la dijo.
 * Respaldo de la versión anterior (dos columnas): scratchpad de la sesión del
 * 5-oct; en git está la versión desplegada.
 */
// En los testimonios `t` es el testimonio; el traductor se llama `tr`.
function TestimonioVideo({ t, n, total, onAbrir }) {
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
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(p, (v) => (reduced ? 1 : rango(v, [0.15, 1], [0.55, 1])));
  const rotate = useTransform(p, (v) => (reduced ? 0 : rango(v, [0.15, 1], [-4, 0])));

  return (
    <figure ref={ref} className="tv">
      <div className="tv-texto">
        <p className="tv-cuenta">{n} / {total}</p>
        <h3 className="tv-nombre">{t.name}</h3>
        <p className="tv-giro">
          {tr(t.business)} ·{' '}
          {tr({ es: 'Testimonio grabado por las dueñas del estudio', en: 'Video testimonial recorded by the studio owners' })}
        </p>
        <button type="button" className="tv-cta" onClick={() => onAbrir(t)}>
          <Play size={16} fill="currentColor" strokeWidth={0} />
          {tr({ es: 'Ver su experiencia', en: 'Watch their story' })} · {t.videoDuracion}
        </button>
      </div>

      <motion.button
        type="button"
        className="tv-video"
        style={{ scale, rotate }}
        onClick={() => onAbrir(t)}
        aria-label={tr({ es: `Ver el testimonio en video de ${tr(t.business)}`, en: `Watch ${t.name}'s video testimonial` })}
      >
        <img src={t.poster} alt="" loading="lazy" aria-hidden="true" />
        {/* Vista previa muda: solo se monta (y descarga) con la tarjeta en pantalla */}
        {visto && !reduced && (
          <video
            ref={videoRef}
            src={t.video}
            poster={t.poster}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        <span className="testimonio-video-play">
          <Play size={26} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="testimonio-video-dur">{t.videoDuracion}</span>
      </motion.button>
    </figure>
  );
}

function Palabra({ p, i, total, children }) {
  // Lectura de izquierda a derecha entre 0.08 y 0.72 del recorrido
  const a = 0.08 + (i / total) * 0.64;
  const opacity = useTransform(p, (v) => rango(v, [a, a + 0.06], [0.16, 1]));
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

function TestimonioCita({ t, n, total }) {
  const { lang, t: tr } = useLang();
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const autor = useTransform(p, (v) => (reduced ? 1 : rango(v, [0.72, 0.82], [0, 1])));
  const cita = tr(t.quote);
  const palabras = cita.split(' ');

  return (
    <figure ref={ref} className={`tc${reduced ? ' tc--static' : ''}`}>
      <div className="tc-escena">
        <p className="tv-cuenta">{n} / {total}</p>
        <blockquote className="tc-cita">
          {reduced
            ? cita
            : palabras.map((w, i) => (
                <Palabra key={`${lang}-${i}`} p={p} i={i} total={palabras.length}>
                  {w}
                </Palabra>
              ))}
        </blockquote>
        <motion.figcaption className="testimonio-author" style={{ opacity: autor }}>
          <span className="testimonio-avatar">
            <img src={t.logo} alt={tr(t.business)} loading="lazy" />
          </span>
          <span className="testimonio-author-meta">
            <span className="testimonio-name">{t.name}</span>
            <span className="testimonio-business">
              {tr(t.business)}
              {/* La cita original es en español: en inglés se avisa que es traducción */}
              {lang === 'en' && ' · Translated from Spanish'}
            </span>
          </span>
        </motion.figcaption>
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

      {TESTIMONIOS.map((t, i) => {
        const n = String(i + 1).padStart(2, '0');
        return t.video ? (
          <TestimonioVideo key={t.name} t={t} n={n} total={total} onAbrir={setVideoAbierto} />
        ) : (
          <TestimonioCita key={t.name} t={t} n={n} total={total} />
        );
      })}

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
