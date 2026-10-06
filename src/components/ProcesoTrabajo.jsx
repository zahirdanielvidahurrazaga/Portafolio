import React from 'react';
import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import '../styles/ProcesoTrabajo.css';

const ProcesoTrabajo = () => {
  // Los tiempos POR PASO se quitaron el 2026-08-13: los había estimado yo y el
  // usuario nunca los validó. Él confirmó UNO solo —~2 meses de la firma del
  // contrato a producción— y ese vive en el encabezado. Cinco estimaciones
  // inventadas junto a un dato real restan, no suman.
  //
  // De 7 pasos a 5 (2026-08-13). "Formalización del Proyecto" (firmar el acuerdo)
  // y "Sincronización Continua" (juntas de avance) son higiene del trabajo, no
  // razones por las que un dueño de negocio contrata: ocupaban 2 de las 7
  // casillas y ~0.6 pantallas de móvil. No se perdió el mensaje — la firma vive
  // ahora dentro de "Propuesta y Acuerdo" y las juntas dentro de "Desarrollo".
  const { t } = useLang();
  const steps = [
    {
      num: '01',
      title: { es: 'Descubrimiento y Diagnóstico', en: 'Discovery & Diagnosis' },
      desc: {
        es: 'Charla inicial donde entendemos tu negocio a fondo, identificando necesidades clave y procesos a optimizar.',
        en: 'A first conversation where we get to know your business in depth, identifying key needs and processes to improve.',
      },
    },
    {
      num: '02',
      title: { es: 'Propuesta y Acuerdo', en: 'Proposal & Agreement' },
      desc: {
        es: 'Te presentamos una propuesta detallada y la cerramos por escrito: alcance, tiempos y costo claros antes de empezar.',
        en: 'We present a detailed proposal and put it in writing: clear scope, timeline and cost before we start.',
      },
    },
    {
      num: '03',
      title: { es: 'Diseño y Desarrollo', en: 'Design & Development' },
      desc: {
        es: 'Construimos tu proyecto y te mostramos avances cada semana, en persona o en línea, para que nunca te enteres del resultado hasta el final.',
        en: 'We build your project and show you progress every week, in person or online, so you’re never surprised at the end.',
      },
    },
    {
      num: '04',
      title: { es: 'Pruebas y Refinamiento', en: 'Testing & Refinement' },
      desc: {
        es: 'Auditorías y ajustes precisos sobre la versión casi terminada, para que llegue fluida y sin errores a manos de tu equipo.',
        en: 'Careful reviews and adjustments on the nearly finished version, so it reaches your team smooth and error-free.',
      },
    },
    {
      num: '05',
      title: { es: 'Lanzamiento y Entrega', en: 'Launch & Handoff' },
      desc: {
        es: 'Lanzamos tu proyecto listo para operar, con tu equipo capacitado y todo funcionando en producción.',
        en: 'We launch your project ready to run, with your team trained and everything working in production.',
      },
    },
  ];

  // Editorial (2026-10-05): sin línea de tiempo con circulitos ni tarjetas
  // grises. Cada paso es una fila con filete y número grande, como el índice
  // de una revista.
  return (
    <section id="process" className="section-container process-section">
      <SectionHead
        num="06"
        label={t({ es: 'Proceso', en: 'Process' })}
        lede={t({
          es: (
            <>
              Cinco pasos para transformar tu negocio. En un proyecto de software, de la
              firma del contrato a producción: alrededor de <strong>2 meses</strong>.
            </>
          ),
          en: (
            <>
              Five steps to transform your business. For a software project, from signing to
              production: about <strong>2 months</strong>.
            </>
          ),
        })}
      >
        {t({ es: <>Cómo <em>trabajamos</em></>, en: <>How we <em>work</em></> })}
      </SectionHead>

      <ol className="process-list rule-list">
        {steps.map((step, idx) => (
          <motion.li
            key={step.num}
            className="process-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="process-num">{step.num}</span>
            <h3>{t(step.title)}</h3>
            <p>{t(step.desc)}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};

export default ProcesoTrabajo;
