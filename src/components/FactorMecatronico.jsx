import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Globe, ShoppingBag, Store, Zap, Cpu } from 'lucide-react';
import '../styles/FactorMecatronico.css';

const SERVICIOS = [
  {
    icon: Smartphone,
    title: 'Apps móviles',
    desc: 'Aplicaciones iOS y Android nativas, publicadas en las tiendas y conectadas a tu operación en tiempo real.',
  },
  {
    icon: Globe,
    title: 'Sitios web',
    desc: 'Landing pages y sitios premium: rápidos, responsivos y diseñados para convertir visitantes en clientes.',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce',
    desc: 'Tiendas en línea con catálogo, carrito y pagos integrados (tarjeta, Apple Pay y Google Pay).',
  },
  {
    icon: Store,
    title: 'Punto de venta',
    desc: 'Sistema POS multi-sucursal con cobro, control de inventario y cortes de caja en tiempo real, en web y móvil.',
  },
  {
    icon: Zap,
    title: 'Automatización & IA',
    desc: 'Procesos inteligentes y asistentes con IA que le ahorran horas de trabajo manual a tu equipo.',
  },
  {
    icon: Cpu,
    title: 'Hardware & Biometría',
    desc: 'Control de acceso, códigos QR, reconocimiento facial e integraciones con dispositivos físicos (IoT).',
  },
];

const FactorMecatronico = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const trackRef = useRef(null);
  const marqueeRef = useRef(null);
  const offsetRef = useRef(0); // px desplazados (marquee controlado por JS)
  const halfRef = useRef(1); // ancho de UN set (la mitad, por el duplicado)
  const pausedRef = useRef(false); // pausa por hover/touch
  const openRef = useRef(false); // hay una tarjeta abierta
  const reduceRef = useRef(false);

  const items = [...SERVICIOS, ...SERVICIOS];

  // Medir el ancho de un set para el loop sin costuras.
  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = () => {
      const t = trackRef.current;
      if (t) halfRef.current = t.scrollWidth / 2 || 1;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Marquee por requestAnimationFrame (control total del desplazamiento).
  useEffect(() => {
    if (reduceRef.current) return;
    const speed = 45; // px por segundo
    let last = performance.now();
    let raf = 0;
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current && !openRef.current) {
        let o = offsetRef.current + speed * dt;
        const W = halfRef.current;
        if (o >= W) o -= W; // wrap sin salto (el contenido es periódico)
        offsetRef.current = o;
        const t = trackRef.current;
        if (t) t.style.transform = `translateX(${-o}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const closeCard = () => {
    setOpenIdx(null);
    openRef.current = false;
    const t = trackRef.current;
    if (t) t.style.transition = '';
  };

  const handleClick = (i, chipEl) => {
    if (openIdx === i) {
      closeCard();
      return;
    }
    setOpenIdx(i);
    openRef.current = true;
    if (reduceRef.current) return; // layout estático: ya se ve todo

    // Tras pintar la tarjeta expandida, recolocar el carrusel para centrarla.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const t = trackRef.current;
        const m = marqueeRef.current;
        if (!t || !m) return;
        const M = m.clientWidth;
        const trackRect = t.getBoundingClientRect();
        const chipRect = chipEl.getBoundingClientRect();
        const center = chipRect.left - trackRect.left + chipRect.width / 2;
        let target = center - M / 2;
        target = Math.max(0, Math.min(target, Math.max(0, t.scrollWidth - M)));
        t.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        t.style.transform = `translateX(${-target}px)`;
        offsetRef.current = target;
        window.setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = '';
        }, 480);
      })
    );
  };

  return (
    <section id="about" className="section-container factor-section">
      <div className="factor-header text-center">
        <h2>Qué puedo construir para tu negocio.</h2>
        <p>
          Soluciones completas, del software al hardware. Como ingeniero en
          mecatrónica, también conecto lo que otros no pueden. Toca cada uno para
          saber más.
        </p>
      </div>

      <div className="service-marquee" ref={marqueeRef}>
        <div
          className="service-track"
          ref={trackRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onTouchStart={() => (pausedRef.current = true)}
          onTouchEnd={() => (pausedRef.current = false)}
        >
          {items.map((s, i) => {
            const Icon = s.icon;
            const active = openIdx === i;
            return (
              <div key={i} className={`service-chip ${active ? 'is-active' : ''}`}>
                <button
                  className="service-chip-head"
                  onClick={(e) => handleClick(i, e.currentTarget.closest('.service-chip'))}
                  aria-expanded={active}
                >
                  <Icon size={22} />
                  <span>{s.title}</span>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      className="service-chip-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{s.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FactorMecatronico;
