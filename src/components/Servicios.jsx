import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import SectionHead from './SectionHead';
import '../styles/Servicios.css';

const SERVICIOS = [
  {
    forma: 'telefono',
    title: 'Apps móviles',
    desc: 'Aplicaciones iOS y Android nativas, publicadas en las tiendas y conectadas a tu operación en tiempo real.',
  },
  {
    forma: 'navegador',
    title: 'Sitios web',
    desc: 'Landing pages y sitios premium: rápidos, responsivos y diseñados para convertir visitantes en clientes.',
  },
  {
    forma: 'carrito',
    title: 'E-commerce',
    desc: 'Tiendas en línea con catálogo, carrito y pagos integrados (tarjeta, Apple Pay y Google Pay).',
  },
  {
    forma: 'ticket',
    title: 'Punto de venta',
    desc: 'Sistema POS multi-sucursal con cobro, control de inventario y cortes de caja en tiempo real, en web y móvil.',
  },
  {
    forma: 'ia',
    title: 'Automatización & IA',
    desc: 'Procesos inteligentes y asistentes con IA que le ahorran horas de trabajo manual a tu equipo.',
  },
  // Nada de sobreprometer: lo que sí se hace (lector QR, tickets, pases de Wallet)
  {
    forma: 'qr',
    title: 'Acceso QR y tickets',
    desc: 'Pases de membresía en Apple Wallet y Google Wallet, control de acceso con lector QR e impresión de tickets en el mostrador.',
  },
];
const N = SERVICIOS.length;

/**
 * SERVICIOS = "Índice + nube" (modo presentación). Reemplazó al carrusel de
 * cápsulas (FactorMecatronico, 2026-10-05): se veía "plantilla" junto al hero.
 * La pista (.srv-pista) mide ~6 tramos; la escena se queda fija y:
 *  - a la izquierda, un índice de revista: el servicio del tramo se enciende y
 *    abre su descripción, los demás quedan tenues;
 *  - a la derecha, LA NUBE (lib/nube.js, modo "secuencia") se transforma de la
 *    figura de un servicio a la del siguiente, sin explotar entre ellas.
 * El texto cambia a la MITAD del morph (la nube morfea en el último 38% de cada
 * tramo → u + 0.19), para que figura y nombre coincidan.
 * Clic en un servicio = scroll a su tramo. Con reduced-motion: lista estática.
 */
export default function Servicios() {
  const pista = useRef(null);
  const reduced = useReducedMotion();
  const [activo, setActivo] = useState(0);
  const { scrollYProgress } = useScroll({ target: pista, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const u = Math.min(1, Math.max(0, v)) * N * 0.99999;
    setActivo(Math.min(N - 1, Math.floor(u + 0.19)));
  });

  const irA = (i) => {
    const el = pista.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.35) / N) * travel, behavior: 'smooth' });
  };

  return (
    <section id="about" className="servicios">
      <div className="section-container servicios-head">
        <SectionHead
          num="02"
          label="Servicios"
          className="factor-header"
          lede="Del sitio web al punto de venta, conectado con el lector y la impresora de tu mostrador."
        >
          Lo que <em>construimos</em>
        </SectionHead>
      </div>

      {reduced ? (
        <ol className="srv-indice srv-indice--static section-container">
          {SERVICIOS.map((s, i) => (
            <li key={s.title} className="is-active">
              <div className="srv-item">
                <span className="srv-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="srv-nombre">{s.title}</span>
              </div>
              <div className="srv-desc">
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div
          ref={pista}
          className="srv-pista"
          data-nube={SERVICIOS.map((s) => s.forma).join(',')}
          data-nube-modo="secuencia"
        >
          <div className="srv-escena">
            <ol className="srv-indice">
              {SERVICIOS.map((s, i) => (
                <li key={s.title} className={i === activo ? 'is-active' : ''}>
                  <button className="srv-item" onClick={() => irA(i)} aria-expanded={i === activo}>
                    <span className="srv-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="srv-nombre">{s.title}</span>
                  </button>
                  <div className="srv-desc">
                    <p>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* La nube dibuja aquí la figura del servicio activo */}
            <div className="interludio-forma srv-forma" aria-hidden="true" />
          </div>
        </div>
      )}
    </section>
  );
}
