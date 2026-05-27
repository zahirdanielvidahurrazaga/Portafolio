import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ProcesoTrabajo.css';

const ProcesoTrabajo = () => {
  const steps = [
    {
      num: "01",
      title: "Descubrimiento y Diagnóstico",
      desc: "Charla inicial donde entendemos tu negocio a fondo, identificando necesidades clave y procesos a optimizar."
    },
    {
      num: "02",
      title: "Arquitectura de la Solución",
      desc: "Diseñamos y te presentamos una propuesta tecnológica detallada con el software ideal para tus objetivos."
    },
    {
      num: "03",
      title: "Formalización del Proyecto",
      desc: "Aseguramos la transparencia, los tiempos y los compromisos mediante la firma de nuestro acuerdo de desarrollo."
    },
    {
      num: "04",
      title: "Ingeniería y Desarrollo",
      desc: "Comenzamos la construcción de tu ecosistema utilizando las tecnologías más avanzadas y robustas del mercado."
    },
    {
      num: "05",
      title: "Sincronización Continua",
      desc: "Mantenemos una comunicación constante, ya sea presencial o en línea, para mostrarte los avances y asegurar el alineamiento."
    },
    {
      num: "06",
      title: "Pruebas y Refinamiento",
      desc: "Realizamos auditorías y ajustes precisos de la versión casi terminada para garantizar una calidad Apple-like, fluida y sin errores."
    },
    {
      num: "07",
      title: "Lanzamiento y Entrega",
      desc: "Desplegamos tu proyecto finalizado, listo para operar, escalar y llevar tu negocio al siguiente nivel tecnológico."
    }
  ];

  return (
    <section id="process" className="section-container process-section">
      <div className="process-header text-center">
        <h2>Ingeniería de Precisión.</h2>
        <p className="text-muted">Tres pasos para transformar tu negocio.</p>
      </div>

      <div className="timeline">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx} 
            className="timeline-item"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <div className="timeline-num">{step.num}</div>
            <div className="timeline-content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProcesoTrabajo;
