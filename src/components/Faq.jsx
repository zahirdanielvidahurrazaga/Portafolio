import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHead from './SectionHead';
import '../styles/Faq.css';

// Adaptadas a las 7 líneas (5-oct): ya no solo software — también marca y redes.
// Los tiempos son los que Zahir confirmó (~2 meses en software); el resto se
// dice sin números inventados.
const FAQS = [
  {
    q: '¿Cuánto tarda mi proyecto?',
    a: 'Depende de lo que necesites. Una identidad de marca o una landing page toma semanas; un proyecto de software, alrededor de 2 meses desde que firmamos hasta que está operando. Las redes sociales se trabajan mes con mes. El tiempo exacto de tu caso va por escrito en la propuesta.',
  },
  {
    q: '¿Manejan nuestras redes sociales?',
    a: 'Sí. Planeamos el calendario, diseñamos y redactamos las publicaciones, hacemos reels, las programamos, respondemos a tu comunidad y te entregamos reportes de resultados cada mes.',
  },
  {
    q: '¿La publicidad pagada está incluida?',
    a: 'No. Podemos crear y administrar tus campañas, pero el presupuesto de anuncios (Meta, TikTok, Google) lo pagas directo a cada plataforma, así siempre tienes el control de cuánto inviertes.',
  },
  {
    q: '¿Lo que construyen es mío?',
    a: 'Sí. Al liquidar el proyecto, tu marca, tu sitio, tu código y tus datos son tuyos, sin ataduras ni dependencias hacia nosotros.',
  },
  {
    q: '¿Dan soporte y mantenimiento después del lanzamiento?',
    a: 'Sí. Ofrecemos planes de soporte y mantenimiento para mantener tu sitio o sistema actualizado, seguro y funcionando sin interrupciones.',
  },
  {
    q: '¿Trabajan con mi presupuesto?',
    a: 'Cada proyecto se cotiza a la medida. Podemos arrancar con lo esencial y crecer por fases, a tu ritmo. Escríbenos y te decimos qué conviene para tu caso.',
  },
  {
    q: '¿Suben mi app a la App Store y Google Play?',
    a: 'Sí, nos encargamos de la publicación. Las cuentas de desarrollador de Apple y Google van a nombre de tu negocio (para que la app sea tuya) y sus cuotas anuales se pagan directo a ellos.',
  },
];

const Faq = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="section-container faq-section">
      <SectionHead
        num="07"
        label="Preguntas frecuentes"
        lede="Lo que la mayoría quiere saber antes de empezar."
      >
        Antes de <em>empezar</em>
      </SectionHead>

      <div className="faq-list rule-list">
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
                <Plus className="faq-chevron" size={22} aria-hidden="true" />
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
