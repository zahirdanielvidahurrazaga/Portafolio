import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import SectionHead from './SectionHead';
import '../styles/Servicios.css';

// Las 7 líneas de KaiZen (catálogo "KaiZen Servicios", 2026-10-05). SIN precios
// en el sitio, a propósito: se cotiza por WhatsApp. `linea` = el nombre de la
// línea tal como va en su catálogo. Las apps móviles no tienen línea propia:
// viven en Experience (reservaciones, Wallet) y Commerce (POS en iOS/Android).
const SERVICIOS = [
  {
    forma: 'pluma',
    linea: 'Brand',
    title: 'Identidad de marca',
    desc: 'Logo, paleta, tipografías y manual de marca: una identidad coherente en todo lo que tu negocio muestra, de la papelería a las redes.',
  },
  {
    forma: 'social',
    linea: 'Social',
    title: 'Redes sociales',
    desc: 'Estrategia, diseño, copy, reels y community management cada mes, con calendario de contenido y reportes de resultados.',
  },
  {
    forma: 'cohete',
    linea: 'Launch',
    title: 'Lanzamiento',
    desc: 'Tu negocio listo para salir: marca básica, redes configuradas, landing page con formularios y estrategia inicial de contenido.',
  },
  {
    forma: 'navegador',
    linea: 'Web',
    title: 'Sitios web',
    desc: 'Landing pages y sitios empresariales a la medida: rápidos, adaptados a celular y con SEO para que te encuentren en Google.',
  },
  {
    forma: 'carrito',
    linea: 'Commerce',
    title: 'Tiendas y punto de venta',
    desc: 'Tiendas en línea con carrito y pagos, y punto de venta multisucursal con inventario y cortes de caja, en web, iOS y Android.',
  },
  {
    forma: 'ia',
    linea: 'Automate',
    title: 'Automatización e IA',
    desc: 'Procesos que se hacen solos y asistentes con IA que le ahorran horas de trabajo manual a tu equipo.',
  },
  // Aquí viven las apps (Be Fit Lab): reservaciones, lista de espera, pagos, Wallet
  {
    forma: 'telefono',
    linea: 'Experience',
    title: 'Apps y experiencias',
    desc: 'Apps de reservaciones con lista de espera y pagos, pases QR para Apple y Google Wallet, álbumes compartidos, invitaciones y catálogos digitales.',
  },
];
const N = SERVICIOS.length;

/**
 * SERVICIOS = "Índice + nube" (modo presentación). 7 líneas desde el 5-oct. Reemplazó al carrusel de
 * cápsulas (FactorMecatronico, 2026-10-05): se veía "plantilla" junto al hero.
 * La pista (.srv-pista) mide un tramo por servicio; la escena se queda fija y:
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
          lede="De la marca y las redes al software a la medida: todo lo que tu negocio necesita para crecer, en un solo estudio."
        >
          Lo que <em>hacemos</em>
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
                    <span className="srv-linea">{s.linea}</span>
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
