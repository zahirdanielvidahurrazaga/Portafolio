import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import '../styles/Testimonios.css';

/**
 * Testimonios de clientes reales.
 * ⚠️ OJO: las frases son un BORRADOR realista — confírmalas/edítalas con las
 * palabras reales de cada cliente antes de publicar. Para agregar/quitar, solo
 * edita este arreglo.
 */
// `logo` = foto de perfil del testimonio. `video` (opcional, a futuro) = ruta a
// un video del cliente contando su experiencia.
const TESTIMONIOS = [
  {
    quote:
      'Digitalizamos toda la tienda con su sistema de punto de venta. Ahora controlamos el inventario y vendemos desde el celular sin complicaciones. Quedó justo como lo necesitábamos.',
    name: 'Carlos Carbajal',
    business: 'Plásticos y Jarciería Tito',
    logo: '/logos/tito.png',
    video: null,
  },
  {
    quote:
      'Nuestra app reúne reservas, cafetería y pagos en un solo lugar. Las clientas la usan a diario y nos ahorró muchísimo trabajo administrativo.',
    name: 'Be Fit Lab',
    business: 'Estudio de Pilates',
    logo: '/logos/befit-mark.png',
    video: null,
  },
];

const Testimonios = () => {
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
            className="testimonio-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Quote className="testimonio-quote-icon" size={28} aria-hidden="true" />

            <div className="testimonio-stars" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>

            <blockquote className="testimonio-quote">{t.quote}</blockquote>

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
    </section>
  );
};

export default Testimonios;
