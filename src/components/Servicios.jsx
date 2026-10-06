import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import '../styles/Servicios.css';

// Las 7 líneas de KaiZen (catálogo "KaiZen Servicios", 2026-10-05). SIN precios
// en el sitio, a propósito: se cotiza por WhatsApp. `linea` = el nombre de la
// línea tal como va en su catálogo. Las apps móviles no tienen línea propia:
// viven en Experience (reservaciones, Wallet) y Commerce (POS en iOS/Android).
const SERVICIOS = [
  {
    forma: 'pluma',
    linea: 'Brand',
    title: { es: 'Identidad de marca', en: 'Brand identity' },
    desc: {
      es: 'Logo, paleta, tipografías y manual de marca: una identidad coherente en todo lo que tu negocio muestra, de la papelería a las redes.',
      en: 'Logo, palette, typography and brand guidelines: one consistent identity across everything your business shows, from stationery to social media.',
    },
  },
  {
    forma: 'social',
    linea: 'Social',
    title: { es: 'Redes sociales', en: 'Social media' },
    desc: {
      es: 'Estrategia, diseño, copy, reels y community management cada mes, con calendario de contenido y reportes de resultados.',
      en: 'Strategy, design, copywriting, reels and community management every month, with a content calendar and results reports.',
    },
  },
  {
    forma: 'cohete',
    linea: 'Launch',
    title: { es: 'Lanzamiento', en: 'Launch' },
    desc: {
      es: 'Tu negocio listo para salir: marca básica, redes configuradas, landing page con formularios y estrategia inicial de contenido.',
      en: 'Your business ready to go: core branding, social accounts set up, a landing page with forms and an initial content strategy.',
    },
  },
  {
    forma: 'navegador',
    linea: 'Web',
    title: { es: 'Sitios web', en: 'Websites' },
    desc: {
      es: 'Landing pages y sitios empresariales a la medida: rápidos, adaptados a celular y con SEO para que te encuentren en Google.',
      en: 'Custom landing pages and business websites: fast, mobile-ready and SEO-optimized so people find you on Google.',
    },
  },
  {
    forma: 'carrito',
    linea: 'Commerce',
    title: { es: 'Tiendas y punto de venta', en: 'Stores & point of sale' },
    desc: {
      es: 'Tiendas en línea con carrito y pagos, y punto de venta multisucursal con inventario y cortes de caja, en web, iOS y Android.',
      en: 'Online stores with cart and payments, and multi-branch point of sale with inventory and cash closing, on web, iOS and Android.',
    },
  },
  {
    forma: 'ia',
    linea: 'Automate',
    title: { es: 'Automatización e IA', en: 'Automation & AI' },
    desc: {
      es: 'Procesos que se hacen solos y asistentes con IA que le ahorran horas de trabajo manual a tu equipo.',
      en: 'Processes that run themselves and AI assistants that save your team hours of manual work.',
    },
  },
  // Aquí viven las apps (Be Fit Lab): reservaciones, lista de espera, pagos, Wallet
  {
    forma: 'telefono',
    linea: 'Experience',
    title: { es: 'Apps y experiencias', en: 'Apps & experiences' },
    desc: {
      es: 'Apps de reservaciones con lista de espera y pagos, pases QR para Apple y Google Wallet, álbumes compartidos, invitaciones y catálogos digitales.',
      en: 'Booking apps with waitlists and payments, QR passes for Apple and Google Wallet, shared albums, invitations and digital catalogs.',
    },
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
  const { t } = useLang();
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
          className="factor-header"
          label={t({ es: 'Servicios', en: 'Services' })}
          lede={t({
            es: 'De la marca y las redes al software a la medida: todo lo que tu negocio necesita para crecer, en un solo estudio.',
            en: 'From branding and social media to custom software: everything your business needs to grow, in one studio.',
          })}
        >
          {t({ es: <>Lo que <em>hacemos</em></>, en: <>What we <em>do</em></> })}
        </SectionHead>
      </div>

      {reduced ? (
        <ol className="srv-indice srv-indice--static section-container">
          {SERVICIOS.map((s, i) => (
            <li key={s.forma} className="is-active">
              <div className="srv-item">
                <span className="srv-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="srv-nombre">{t(s.title)}</span>
              </div>
              <div className="srv-desc">
                <p>{t(s.desc)}</p>
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
                <li key={s.forma} className={i === activo ? 'is-active' : ''}>
                  <button className="srv-item" onClick={() => irA(i)} aria-expanded={i === activo}>
                    <span className="srv-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="srv-nombre">{t(s.title)}</span>
                    <span className="srv-linea">{s.linea}</span>
                  </button>
                  <div className="srv-desc">
                    <p>{t(s.desc)}</p>
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
