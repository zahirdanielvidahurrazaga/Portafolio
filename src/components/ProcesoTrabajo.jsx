import React from 'react';
import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
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
  const steps = [
    {
      num: "01",
      title: "Descubrimiento y Diagnóstico",
      desc: "Charla inicial donde entendemos tu negocio a fondo, identificando necesidades clave y procesos a optimizar."
    },
    {
      num: "02",
      title: "Propuesta y Acuerdo",
      desc: "Te presentamos una propuesta tecnológica detallada y la cerramos por escrito: alcance, tiempos y costo claros antes de escribir una línea de código."
    },
    {
      num: "03",
      title: "Ingeniería y Desarrollo",
      desc: "Construimos tu sistema y te mostramos avances cada semana, en persona o en línea, para que nunca te enteres del resultado hasta el final."
    },
    {
      num: "04",
      title: "Pruebas y Refinamiento",
      desc: "Auditorías y ajustes precisos sobre la versión casi terminada, para que llegue fluida y sin errores a manos de tu equipo."
    },
    {
      num: "05",
      title: "Lanzamiento y Entrega",
      desc: "Lanzamos tu proyecto listo para operar, con tu equipo capacitado y todo funcionando en producción."
    }
  ];

  // Editorial (2026-10-05): sin línea de tiempo con circulitos ni tarjetas
  // grises. Cada paso es una fila con filete y número grande, como el índice
  // de una revista.
  return (
    <section id="process" className="section-container process-section">
      <SectionHead
        num="06"
        label="Proceso"
        lede={
          <>
            Cinco pasos para transformar tu negocio. De la firma del contrato a
            producción: alrededor de <strong>2 meses</strong>.
          </>
        }
      >
        Cómo <em>trabajamos</em>
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
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};

export default ProcesoTrabajo;
