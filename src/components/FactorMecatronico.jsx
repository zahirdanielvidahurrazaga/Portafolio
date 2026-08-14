import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Globe, ShoppingBag, Store, Zap, QrCode } from 'lucide-react';
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
  // Antes decía "Hardware & Biometría: reconocimiento facial e IoT" — cosas que
  // no se hacen. Se cambió por lo que sí: lector QR, impresión de tickets y
  // pases de Wallet. Aquí también entra lo de Wallet, en vez de sumar una
  // séptima tarjeta al carrusel.
  {
    icon: QrCode,
    title: 'Acceso QR y tickets',
    desc: 'Pases de membresía en Apple Wallet y Google Wallet, control de acceso con lector QR e impresión de tickets en el mostrador.',
  },
];

/*
 * Carrusel de servicios que se DETIENE en cada tarjeta y la abre sola.
 *
 * Reescrito el 2026-08-13 porque la primera versión se sentía trabada. Tres
 * causas, todas de lo mismo —abrir cambiaba el layout— y las tres corregidas:
 *
 *  1. La tarjeta abierta pasaba de ~200px a 360px de ancho: empujaba a las
 *     siguientes hacia la derecha ("se alarga del lado derecho") y cambiaba el
 *     scrollWidth del carril, con lo que la medida que usa el bucle para dar la
 *     vuelta sin salto quedaba mal → tirón al reanudar.
 *     → Ahora TODAS las tarjetas miden lo mismo (CSS) y abrir solo crece hacia
 *       abajo. En una fila flex con align-items:flex-start eso no mueve a nadie.
 *  2. Al crecer hacia abajo empujaba la PÁGINA entera.
 *     → `.service-marquee` reserva el alto de la tarjeta abierta (min-height).
 *  3. El bucle rAF y una transición de CSS escribían los dos el `transform`,
 *     peleándose por él.
 *     → El bucle es el ÚNICO que toca `transform`. Frenar y arrancar son
 *       interpolaciones dentro del mismo bucle, no transiciones de CSS.
 */
const FactorMecatronico = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const trackRef = useRef(null);
  const marqueeRef = useRef(null);
  const offsetRef = useRef(0); // px desplazados
  const halfRef = useRef(1); // ancho de UN set (la mitad, por el duplicado)
  const pausedRef = useRef(false); // pausa por hover/touch
  const openRef = useRef(false); // hay una tarjeta abierta
  const reduceRef = useRef(false);

  const autoTimerRef = useRef(0); // temporizador de cierre
  const ultimoAutoRef = useRef(-1); // último abierto (no reengancharlo enseguida)
  const frenarRef = useRef(null); // lo llena el bucle; lo usa el clic
  const reanudarRef = useRef(null); // lo llena el bucle; lo usa el cierre
  const cerrarRef = useRef(null); // se reasigna en cada render (el bucle tiene deps [])
  const LECTURA_MS = 3200; // lo que tarda en leerse una descripción

  const items = [...SERVICIOS, ...SERVICIOS];

  // Medir el ancho de un set para el loop sin costuras. Ahora es una medida
  // ESTABLE: como las tarjetas no cambian de ancho al abrirse, no se invalida.
  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const measure = () => {
      const t = trackRef.current;
      if (!t || !t.children[SERVICIOS.length]) return;
      // El periodo real es la distancia de la 1ª tarjeta a su copia, con el hueco
      // incluido. `scrollWidth / 2` NO sirve: son 12 tarjetas y 11 huecos, así
      // que la mitad se queda corta por medio hueco (8px) y el carrusel pegaba
      // un brinco de 8px cada vez que daba la vuelta.
      halfRef.current =
        t.children[SERVICIOS.length].offsetLeft - t.children[0].offsetLeft || 1;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (reduceRef.current) return undefined;

    const VELOCIDAD = 70; // px/s a marcha plena
    const ARRANQUE_MS = 620; // volver a marcha plena
    const ENGANCHE = 48; // px antes del centro donde empieza a frenar

    let modo = 'corriendo'; // corriendo · frenando
    let desde = 0; // offset al empezar a frenar
    let objetivo = 0; // offset con la tarjeta justo en el centro
    let pendiente = -1; // qué tarjeta abrir al terminar de frenar
    let inicioFreno = 0;
    let duracionFreno = 0; // se calcula al enganchar (ver frenarRef)
    let vActual = 0; // velocidad real en este momento
    let arranque = performance.now();
    let ultimaRevision = 0;
    let last = performance.now();
    let raf = 0;

    const pintar = () => {
      const t = trackRef.current;
      if (t) t.style.transform = `translateX(${-offsetRef.current}px)`;
    };

    /* Frenar hasta dejar la tarjeta `i` centrada, y abrirla al llegar.
     *
     * La DURACIÓN se calcula, no es fija: la velocidad baja de la actual a cero
     * en línea recta, así que la distancia recorrida es v·T/2 → T = 2·d/v. Con
     * eso el frenado ENTRA exactamente a la velocidad que ya llevaba el carrusel.
     * Antes la duración era fija (520 ms) y la curva arrancaba el frenado a unos
     * 300 px/s —más de 4× la marcha—: daba un acelerón y luego un alto en seco.
     * Ese era el "parón de golpe". */
    frenarRef.current = (i, desvio) => {
      desde = offsetRef.current;
      objetivo = offsetRef.current + desvio; // avanzar `desvio` la centra
      pendiente = i;
      const v = Math.max(vActual, 8); // por si engancha casi detenido
      duracionFreno = (2000 * Math.abs(desvio)) / v;
      inicioFreno = performance.now();
      modo = 'frenando';
    };
    reanudarRef.current = () => {
      modo = 'corriendo';
      arranque = performance.now(); // el arranque vuelve a ser progresivo
    };

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = trackRef.current;
      const m = marqueeRef.current;

      if (t && m && !pausedRef.current && !openRef.current) {
        if (modo === 'corriendo') {
          // Acelera desde 0: arrancar en seco es la mitad de la sensación de tirón.
          const p = Math.min(1, (now - arranque) / ARRANQUE_MS);
          vActual = VELOCIDAD * (p * p * (3 - 2 * p)); // smoothstep: arranca sin tirón
          let o = offsetRef.current + vActual * dt;
          const W = halfRef.current;
          if (o >= W) o -= W; // el contenido va duplicado: la vuelta no se ve
          offsetRef.current = o;
          pintar();

          // ¿Alguna tarjeta va llegando al centro? Se revisa cada 100ms y no en
          // cada fotograma: medir 12 elementos obliga a recalcular layout.
          if (now - ultimaRevision > 100) {
            ultimaRevision = now;
            const centroM = m.getBoundingClientRect().left + m.clientWidth / 2;
            for (let i = 0; i < t.children.length; i++) {
              const r = t.children[i].getBoundingClientRect();
              const desvio = r.left + r.width / 2 - centroM;
              // Se engancha ANTES del centro, para tener con qué frenar.
              if (desvio > 0 && desvio < ENGANCHE && i !== ultimoAutoRef.current) {
                ultimoAutoRef.current = i;
                frenarRef.current(i, desvio);
                break;
              }
            }
          }
        } else if (modo === 'frenando') {
          const p = Math.min(1, (now - inicioFreno) / duracionFreno);
          // easeOutQuad = velocidad que decae en línea recta hasta 0. Es la
          // única que empalma con la marcha sin escalón (ver frenarRef).
          const e = p * (2 - p);
          offsetRef.current = desde + (objetivo - desde) * e;
          pintar();
          if (p >= 1 && pendiente >= 0) {
            const i = pendiente;
            pendiente = -1;
            setOpenIdx(i);
            openRef.current = true;
            autoTimerRef.current = window.setTimeout(() => cerrarRef.current?.(), LECTURA_MS);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(autoTimerRef.current);
    };
  }, []);

  cerrarRef.current = () => {
    window.clearTimeout(autoTimerRef.current);
    setOpenIdx(null);
    openRef.current = false;
    reanudarRef.current?.();
  };

  const handleClick = (i, desvioAlCentro) => {
    window.clearTimeout(autoTimerRef.current); // manda el visitante, no el reloj
    if (openIdx === i) {
      cerrarRef.current();
      return;
    }
    // Soltar la que estuviera abierta: mientras openRef siga en true el bucle
    // no avanza y no podría frenar hacia la nueva.
    setOpenIdx(null);
    openRef.current = false;
    ultimoAutoRef.current = i;
    if (reduceRef.current) {
      setOpenIdx(i); // rejilla estática: no hay nada que centrar
      openRef.current = true;
      return;
    }
    // Reusa el mismo frenado que la apertura automática: la tarjeta se acomoda
    // en el centro y se abre ahí, en vez de abrirse a medio salir de la pantalla.
    frenarRef.current?.(i, desvioAlCentro);
  };

  const desvioDe = (chipEl) => {
    const m = marqueeRef.current;
    if (!m || !chipEl) return 0;
    const r = chipEl.getBoundingClientRect();
    const mr = m.getBoundingClientRect();
    return r.left + r.width / 2 - (mr.left + m.clientWidth / 2);
  };

  return (
    <section id="about" className="section-container factor-section">
      <div className="factor-header text-center">
        <h2>Qué puedo construir para tu negocio.</h2>
        <p>
          Del sitio web al punto de venta, conectado con el lector y la
          impresora de tu mostrador.
        </p>
      </div>

      <div className="service-marquee" ref={marqueeRef}>
        <div
          className="service-track"
          ref={trackRef}
          /* Si está leyendo, el reloj no le cierra la tarjeta encima. */
          onMouseEnter={() => {
            pausedRef.current = true;
            window.clearTimeout(autoTimerRef.current);
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
            if (openRef.current) {
              autoTimerRef.current = window.setTimeout(() => cerrarRef.current?.(), 900);
            }
          }}
          onTouchStart={() => {
            pausedRef.current = true;
            window.clearTimeout(autoTimerRef.current);
          }}
          onTouchEnd={() => (pausedRef.current = false)}
        >
          {items.map((s, i) => {
            const Icon = s.icon;
            const active = openIdx === i;
            return (
              <div key={i} className={`service-chip ${active ? 'is-active' : ''}`}>
                <button
                  className="service-chip-head"
                  onClick={(e) =>
                    handleClick(i, desvioDe(e.currentTarget.closest('.service-chip')))
                  }
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
