import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import '../styles/Faq.css';

const FAQS = [
  {
    q: '¿Cuánto tarda mi proyecto?',
    a: 'Depende del proyecto: un sitio web suele tomar de 2 a 4 semanas, y una app completa de 7 a 8 semanas. Te doy un tiempo estimado claro desde la propuesta.',
  },
  {
    q: '¿El código y la información son míos?',
    a: 'Sí. Al finalizar, el proyecto, su código y todos los datos son 100% tuyos, sin ataduras ni dependencias hacia mí.',
  },
  {
    q: '¿Das soporte y mantenimiento después del lanzamiento?',
    a: 'Sí. Ofrezco planes de soporte y mantenimiento para mantener tu sistema actualizado, seguro y funcionando sin interrupciones.',
  },
  {
    q: '¿Trabajas con mi presupuesto?',
    a: 'Cada proyecto se cotiza a la medida según lo que necesitas. Podemos arrancar con lo esencial y crecer por fases, a tu ritmo.',
  },
  {
    q: '¿Subes mi app a la App Store y Google Play?',
    a: 'Sí. Me encargo de todo el proceso de publicación en las tiendas, así como del despliegue de tu sitio o sistema web.',
  },
  {
    q: '¿La solución es escalable a futuro?',
    a: 'Construyo con tecnología moderna y robusta, pensada para crecer contigo: agregar funciones o usuarios después no implica rehacer todo.',
  },
];

const Faq = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="section-container faq-section">
      <div className="faq-header text-center">
        <h2>Preguntas frecuentes.</h2>
        <p className="text-muted">Lo que la mayoría quiere saber antes de empezar.</p>
      </div>

      <div className="faq-list">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                className="faq-q"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{f.q}</span>
                <ChevronDown className="faq-chevron" size={20} aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-a"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
