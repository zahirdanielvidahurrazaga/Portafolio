import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHead from './SectionHead';
import Escena from './ServiciosEscenas';
import { useLang } from '../lib/LangContext';
import '../styles/Servicios.css';

/*
 * Las 7 líneas de KaiZen, agrupadas por LO QUE EL CLIENTE QUIERE LOGRAR (2026-11-06).
 * Un dueño de negocio no piensa en "Brand / Social / Commerce": piensa "que me
 * conozcan", "que me compren", "que esto funcione sin mí". Los grupos le dicen
 * por dónde empezar antes de leer los nombres.
 *
 * Cada servicio VENDE en tres renglones: `gancho` (el resultado, no la técnica),
 * `entregables` (qué recibe, concreto) y, si existe, `caso` = el proyecto real que lo
 * respalda (abre su modal en Proyectos). Sin precios a propósito: se cotiza por
 * WhatsApp. Nada de cifras inventadas: solo lo que ya entregamos.
 * `tipo` = la opción del formulario de contacto (TIPO_LABEL en Footer.jsx).
 */
const GRUPOS = [
  { id: 'conocer', title: { es: 'Que te conozcan', en: 'Get known' } },
  { id: 'vender', title: { es: 'Que te compren', en: 'Get sales' } },
  { id: 'operar', title: { es: 'Que funcione solo', en: 'Run on autopilot' } },
];

const SERVICIOS = [
  {
    grupo: 'conocer',
    forma: 'pluma',
    linea: 'Brand',
    tipo: 'marca',
    title: { es: 'Identidad de marca', en: 'Brand identity' },
    gancho: { es: <>Que te reconozcan <em>a la primera.</em></>, en: <>Be recognized <em>at first glance.</em></> },
    desc: {
      es: 'Una identidad coherente en todo lo que tu negocio muestra, de la papelería a las redes.',
      en: 'One consistent identity across everything your business shows, from stationery to social media.',
    },
    entregables: {
      es: ['Logo y sus variantes', 'Paleta y tipografías', 'Manual de marca y papelería'],
      en: ['Logo and its variations', 'Palette and typography', 'Brand guidelines and stationery'],
    },
  },
  {
    grupo: 'conocer',
    forma: 'social',
    linea: 'Social',
    tipo: 'redes',
    title: { es: 'Redes sociales', en: 'Social media' },
    gancho: { es: <>Publica cada semana <em>sin que te quite el día.</em></>, en: <>Post every week <em>without losing your day.</em></> },
    desc: {
      es: 'Nos encargamos de la estrategia, el diseño y la conversación con tu comunidad, mes con mes.',
      en: 'We handle the strategy, the design and the conversation with your community, month after month.',
    },
    entregables: {
      es: ['Calendario y diseño de contenido', 'Reels y copy', 'Community management y reporte mensual'],
      en: ['Content calendar and design', 'Reels and copywriting', 'Community management and monthly report'],
    },
  },
  {
    grupo: 'conocer',
    forma: 'cohete',
    linea: 'Launch',
    tipo: 'lanzamiento',
    title: { es: 'Lanzamiento', en: 'Launch' },
    gancho: { es: <>Abre tu negocio <em>con todo listo.</em></>, en: <>Open your business <em>fully ready.</em></> },
    desc: {
      es: 'Marca, redes y página en un solo paquete, para salir al mercado desde el primer día sin armarlo por partes.',
      en: 'Brand, social and website in one package, to go to market on day one without piecing it together.',
    },
    entregables: {
      es: ['Marca básica', 'Redes configuradas', 'Landing page con formulario'],
      en: ['Core branding', 'Social accounts set up', 'Landing page with a contact form'],
    },
  },
  {
    grupo: 'vender',
    forma: 'navegador',
    linea: 'Web',
    tipo: 'sitio',
    title: { es: 'Sitios web', en: 'Websites' },
    gancho: { es: <>Que te encuentren en Google <em>y te escriban.</em></>, en: <>Get found on Google <em>and get messages.</em></> },
    desc: {
      es: 'Landing pages y sitios empresariales a la medida, rápidos y pensados para que el visitante te contacte.',
      en: 'Custom landing pages and business websites, fast and built so visitors reach out to you.',
    },
    entregables: {
      es: ['Diseño a la medida, sin plantillas', 'Adaptado a celular', 'SEO y contacto directo a WhatsApp'],
      en: ['Custom design, no templates', 'Mobile-ready', 'SEO and straight-to-WhatsApp contact'],
    },
  },
  {
    grupo: 'vender',
    forma: 'carrito',
    linea: 'Commerce',
    tipo: 'tienda',
    title: { es: 'Tiendas y punto de venta', en: 'Stores & point of sale' },
    gancho: { es: <>Vende, cobra y controla <em>desde el celular.</em></>, en: <>Sell, charge and keep track <em>from your phone.</em></> },
    desc: {
      es: 'Tienda en línea con pagos o punto de venta para tu mostrador, con el inventario siempre al día.',
      en: 'An online store with payments or a point of sale for your counter, with inventory always up to date.',
    },
    entregables: {
      es: ['Tienda en línea con carrito y pagos', 'Punto de venta multisucursal', 'Inventario y cortes de caja'],
      en: ['Online store with cart and payments', 'Multi-branch point of sale', 'Inventory and cash closing'],
    },
    caso: { id: 'pos', nombre: 'Plásticos y Jarciería Tito' },
  },
  {
    grupo: 'operar',
    forma: 'ia',
    linea: 'Automate',
    tipo: 'ia',
    title: { es: 'Automatización e IA', en: 'Automation & AI' },
    gancho: { es: <>Que lo repetitivo <em>se haga solo.</em></>, en: <>Let the repetitive work <em>run itself.</em></> },
    desc: {
      es: 'Procesos automáticos y asistentes con IA que le devuelven horas de trabajo manual a tu equipo.',
      en: 'Automated processes and AI assistants that give your team back hours of manual work.',
    },
    entregables: {
      es: ['Flujos automáticos entre tus herramientas', 'Asistentes con IA', 'Avisos y reportes que llegan solos'],
      en: ['Automated flows between your tools', 'AI assistants', 'Alerts and reports that arrive on their own'],
    },
  },
  // Aquí viven las apps (Be Fit Lab): reservaciones, lista de espera, pagos, Wallet
  {
    grupo: 'operar',
    forma: 'telefono',
    linea: 'Experience',
    tipo: 'app',
    title: { es: 'Apps y experiencias', en: 'Apps & experiences' },
    gancho: { es: <>Tu negocio <em>en el bolsillo de tus clientes.</em></>, en: <>Your business <em>in your customers’ pocket.</em></> },
    desc: {
      es: 'Apps de reservaciones con lista de espera y pagos, pases digitales, álbumes compartidos e invitaciones.',
      en: 'Booking apps with waitlists and payments, digital passes, shared albums and invitations.',
    },
    entregables: {
      es: ['Reservaciones y pagos', 'Pases para Apple y Google Wallet', 'Publicada en App Store y Google Play'],
      en: ['Bookings and payments', 'Apple and Google Wallet passes', 'Published on the App Store and Google Play'],
    },
    caso: { id: 'befit', nombre: 'Be Fit Lab' },
  },
];
const N = SERVICIOS.length;
const pad = (n) => String(n).padStart(2, '0');

const irAContacto = (tipo) => {
  window.dispatchEvent(new CustomEvent('kaizen:cotizar', { detail: { tipo } }));
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};
const abrirCaso = (id) => window.dispatchEvent(new CustomEvent('kaizen:proyecto', { detail: { id } }));

/** La ficha del servicio: el resultado, qué incluye, la prueba y el botón */
function Ficha({ s, i }) {
  const { t, lang } = useLang();
  const grupo = GRUPOS.find((g) => g.id === s.grupo);
  return (
    <>
      <p className="srv-ficha-kicker">
        <span>{pad(i + 1)} / {pad(N)}</span>
        <span>{t(grupo.title)}</span>
      </p>
      <h3 className="srv-ficha-gancho">{t(s.gancho)}</h3>
      <p className="srv-ficha-desc">{t(s.desc)}</p>
      <ul className="srv-ficha-lista">
        {s.entregables[lang === 'en' ? 'en' : 'es'].map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      {/* En celular la escena va AQUÍ, dentro de la ficha (en escritorio vive en su
          propia columna y esta copia se oculta por CSS) */}
      <div className="srv-ficha-escena">
        <Escena forma={s.forma} />
      </div>
      <div className="srv-ficha-acciones">
        <button type="button" className="btn-metallic srv-ficha-cta" onClick={() => irAContacto(s.tipo)}>
          {t({ es: 'Cotizar', en: 'Get a quote for' })} {t(s.title).toLowerCase()} <ArrowRight size={16} />
        </button>
        {s.caso && (
          <button type="button" className="srv-ficha-caso" onClick={() => abrirCaso(s.caso.id)}>
            {t({ es: 'Ver caso real', en: 'See real case' })}: {s.caso.nombre} <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </>
  );
}

/**
 * SERVICIOS v2 (2026-11-06) — "Índice · Ficha · Nube". Sigue siendo una escena
 * fija con un tramo de scroll por servicio, pero ahora en TRES columnas:
 *  - Índice: los 7 nombres agrupados en 3 necesidades; el activo se enciende.
 *  - Ficha: lo que VENDE — resultado, entregables, caso real y "Cotizar X", que
 *    lleva al formulario con el servicio ya elegido.
 *  - Escena del resultado (ServiciosEscenas.jsx): una mini pantalla con lo que el
 *    cliente VA A VER en su negocio. Sin íconos (Zahir, 6-nov: "no quiero íconos").
 *    (Hasta el 6-nov era la nube de partículas en modo "secuencia": por eso el
 *    cambio va en u + 0.19, a la mitad de lo que era su morph.)
 * Antes la descripción vivía DENTRO del índice (un párrafo gris de 2 renglones)
 * y no decía qué recibes ni lo respaldaba nada.
 * Con reduced-motion: todas las fichas, una debajo de otra.
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

  const head = (
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
  );

  if (reduced) {
    return (
      <section id="about" className="servicios">
        {head}
        <div className="srv-estaticas section-container">
          {SERVICIOS.map((s, i) => (
            <article key={s.forma} className="srv-ficha">
              <Ficha s={s} i={i} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  const s = SERVICIOS[activo];
  return (
    <section id="about" className="servicios">
      {head}
      <div ref={pista} className="srv-pista">
        <div className="srv-escena">
          <nav className="srv-indice" aria-label={t({ es: 'Servicios', en: 'Services' })}>
            {GRUPOS.map((g) => (
              <div key={g.id} className={`srv-grupo${s.grupo === g.id ? ' is-active' : ''}`}>
                <p className="srv-grupo-titulo">{t(g.title)}</p>
                <ol>
                  {SERVICIOS.map((x, i) =>
                    x.grupo !== g.id ? null : (
                      <li key={x.forma} className={i === activo ? 'is-active' : ''}>
                        <button type="button" className="srv-item" onClick={() => irA(i)} aria-current={i === activo}>
                          <span className="srv-num">{pad(i + 1)}</span>
                          <span className="srv-nombre">{t(x.title)}</span>
                        </button>
                      </li>
                    )
                  )}
                </ol>
              </div>
            ))}
          </nav>

          <div className="srv-ficha" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activo}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Ficha s={s} i={activo} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="srv-forma">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={s.forma}
                className="srv-forma-in"
                exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                transition={{ duration: 0.22 }}
              >
                <Escena forma={s.forma} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
