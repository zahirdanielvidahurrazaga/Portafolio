import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Quote, Star, X } from 'lucide-react';
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
    business: 'Estudio de Pilates',
    logo: '/logos/befit-mark.png',
    video: '/testimonios/befit-testimonio.mp4',
    poster: '/testimonios/befit-poster.jpg',
    videoDuracion: '0:52',
  },
  {
    quote:
      'Digitalizamos toda la tienda con su sistema de punto de venta. Ahora controlamos el inventario y vendemos desde el celular sin complicaciones. Quedó justo como lo necesitábamos.',
    name: 'Carlos Carbajal',
    business: 'Plásticos y Jarciería Tito',
    logo: '/logos/tito.png',
    video: null,
  },
];

const Testimonios = () => {
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

  return (
    <section id="testimonios" className="section-container testimonios-section">
      <div className="testimonios-header text-center">
        <h2>Lo que dicen mis clientes.</h2>
        <p className="text-muted">Negocios reales que ya operan con lo que construí.</p>
      </div>

      <div className="testimonios-grid">
        {TESTIMONIOS.map((t, i) => (
          <motion.figure
            key={t.name}
            className={`testimonio-card${t.video && !t.quote ? ' testimonio-card--video' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* El ícono de comillas solo tiene sentido si hay una cita. */}
            {t.quote && <Quote className="testimonio-quote-icon" size={28} aria-hidden="true" />}

            <div className="testimonio-stars" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            {t.quote && <blockquote className="testimonio-quote">{t.quote}</blockquote>}

            {t.video && (
              <button
                type="button"
                className="testimonio-video-btn"
                onClick={() => setVideoAbierto(t)}
                aria-label={`Ver el testimonio en video de ${t.business}`}
              >
                <span className="testimonio-video-thumb">
                  <img src={t.poster} alt="" loading="lazy" aria-hidden="true" />
                  <span className="testimonio-video-play">
                    <Play size={26} fill="currentColor" strokeWidth={0} />
                  </span>
                  <span className="testimonio-video-dur">{t.videoDuracion}</span>
                </span>
                <span className="testimonio-video-meta">
                  <span className="testimonio-video-title">Ver su experiencia en video</span>
                  <span className="testimonio-video-sub">
                    Testimonio grabado por las dueñas del estudio
                  </span>
                </span>
              </button>
            )}

            <figcaption className="testimonio-author">
              <span className="testimonio-avatar">
                <img src={t.logo} alt={t.business} loading="lazy" />
              </span>
              <span className="testimonio-author-meta">
                <span className="testimonio-name">{t.name}</span>
                <span className="testimonio-business">{t.business}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
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
            aria-label={`Testimonio en video de ${videoAbierto.business}`}
          >
            <button
              type="button"
              className="testimonio-lightbox-close"
              onClick={cerrar}
              aria-label="Cerrar video"
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
              {videoAbierto.name} · {videoAbierto.business}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonios;
