import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

/** "Cotizar X" y el caso real. En celular la escena los repite debajo de la hélice */
function Acciones({ s, className = '' }) {
  const { t } = useLang();
  return (
    <div className={`srv-ficha-acciones ${className}`}>
      <button type="button" className="btn-metallic srv-ficha-cta" onClick={() => irAContacto(s.tipo)}>
        {t({ es: 'Cotizar', en: 'Get a quote for' })} {t(s.title).toLowerCase()} <ArrowRight size={16} />
      </button>
      {s.caso && (
        <button type="button" className="srv-ficha-caso" onClick={() => abrirCaso(s.caso.id)}>
          {t({ es: 'Ver caso real', en: 'See real case' })}: {s.caso.nombre} <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}

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
      <Acciones s={s} />
    </>
  );
}

/*
 * LA HÉLICE (2026-11-11, de la escalera de tarjetas de madetodisrupt.com): las
 * 7 escenas del resultado viven sobre una espiral — cada una a 95° y un tramo
 * más abajo que la anterior — y el scroll la gira y la sube: la escena ya no
 * aparece y desaparece, sube girando y trae a la siguiente. CSS 3D puro.
 * Mismo ritmo que el texto: cada servicio se sostiene y gira al siguiente en
 * el último 38% de su tramo (el texto cambia a media vuelta, u + 0.19).
 * 2ª versión, mismo día: la 1ª iba apretada en una columna angosta (radio 170,
 * vecinas casi escondidas) y Zahir: "no luce el efecto". Ahora es la del
 * laboratorio que aprobó: la columna es la más ancha de la escena, radio
 * grande, las vecinas SE VEN (la que se va arriba a la izquierda, la que
 * viene abajo a la derecha, y las de atrás como vidrio) y el cursor inclina
 * toda la espiral.
 */
const PASO = 95; // grados entre una escena y la siguiente
// En celular las tarjetas van a escala (con transform, no zoom: Kai necesita su medida real).
// La escala sale de lo que SOBRA de alto: barra, números, titular, aire de Kai, botón y "Ver caso real" ≈ 455 px;
// la tarjeta más alta llena el resto. La calcula Helice (necesita medir las tarjetas).
let escala = 0.8;
const escalaCarta = () => (window.innerWidth <= 900 ? escala : 1);
const acota = (v, a, b) => Math.max(a, Math.min(b, v));

function Helice({ progreso, activo, kai }) {
  const anillo = useRef(null);
  const cartas = useRef([]);
  const ponerRef = useRef(null); // re-acomodar las tarjetas al cambiar la escala
  // Kai se trepa en la esquina de arriba a la derecha de la tarjeta del frente
  useLayoutEffect(() => {
    if (!kai) return;
    // Las medidas van en la caja de la hélice (.srv-forma): las heredan la percha de Kai y,
    // en celular, las tarjetas (alineadas arriba) y el alto de la caja (= la más alta)
    const poner = () => {
      const esc = cartas.current[activo]?.querySelector('.esc');
      const caja = anillo.current?.parentElement;
      if (!esc || !caja) return;
      const altos = cartas.current.map((c) => c?.querySelector('.esc')?.offsetHeight || 0);
      const alto = Math.max(...altos) || 1;
      escala = acota((window.innerHeight - 455) / alto, 0.55, 0.85);
      const k = escalaCarta();
      caja.style.setProperty('--w', `${esc.offsetWidth * k}px`);
      caja.style.setProperty('--h', `${esc.offsetHeight * k}px`);
      caja.style.setProperty('--h-max', `${alto * k}px`);
      ponerRef.current?.(progreso.get());
    };
    poner();
    window.addEventListener('resize', poner);
    return () => window.removeEventListener('resize', poner);
  }, [activo, kai, progreso]);
  const poner = useCallback((v) => {
    const u = acota(v, 0, 1) * N * 0.99999;
    const k = Math.min(N - 1, Math.floor(u));
    const f = k < N - 1 ? acota((u - k - 0.62) / 0.38, 0, 1) : 0;
    const a = k + f * f * (3 - 2 * f);
    const radio = window.innerWidth <= 900 ? window.innerWidth * 0.3 : kai ? Math.min(360, window.innerWidth * 0.23) : Math.min(300, window.innerWidth * 0.19);
    const dy = window.innerHeight * (window.innerWidth <= 900 ? 0.16 : 0.3);
    cartas.current.forEach((el, i) => {
      if (!el) return;
      const rel = i - a;
      const lejos = Math.abs(rel);
      if (lejos > 2.4) {
        el.style.visibility = 'hidden';
        return;
      }
      el.style.visibility = '';
      // De espaldas el texto se ve en espejo ("ARBA ARAP OTSIL"): esa cara va lisa,
      // como vidrio, y su contenido se apaga (lo pidió Zahir, 11-nov)
      el.classList.toggle('is-dorso', Math.cos((rel * PASO * Math.PI) / 180) < 0.05);
      el.style.transform = `translate(-50%, -50%) translateZ(${-radio}px) rotateY(${rel * PASO}deg) translateZ(${radio}px) translateY(${rel * dy}px) scale(${escalaCarta()})`;
      // Las vecinas se ven más. (Sin desenfoque: un blur que cambia cada cuadro se repinta
      // en cada scroll y lo trababa — 12-nov)
      el.style.opacity = kai ? acota(1 - lejos * 0.42, 0.32, 1) : acota(1 - lejos * 0.6, 0.2, 1);
      el.style.pointerEvents = lejos < 0.3 ? '' : 'none';
    });
  }, [kai]);
  useEffect(() => {
    ponerRef.current = poner;
  }, [poner]);
  useMotionValueEvent(progreso, 'change', poner);
  useEffect(() => {
    const on = () => poner(progreso.get());
    on();
    window.addEventListener('resize', on);
    // El cursor inclina la espiral (solo mientras se mueve: sin bucle permanente)
    let raf = 0;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    const paso = () => {
      mx += (cx - mx) * 0.08;
      my += (cy - my) * 0.08;
      if (anillo.current) anillo.current.style.transform = `rotateX(${(-my * 4).toFixed(2)}deg) rotateY(${(mx * 7).toFixed(2)}deg)`;
      raf = Math.abs(cx - mx) + Math.abs(cy - my) > 0.002 ? requestAnimationFrame(paso) : 0;
    };
    const mover = (e) => {
      cx = (e.clientX / window.innerWidth) * 2 - 1;
      cy = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(paso);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('pointermove', mover);
      cancelAnimationFrame(raf);
    };
  }, [poner, progreso]);
  return (
    <div ref={anillo} className="srv-helice">
      {kai && (
        <span
          className="kai-lugar kai-lugar--percha"
          data-kai={`srv-${SERVICIOS[activo].forma}`}
          data-kai-talla="0.5"
          data-kai-linea
          data-kai-movil
          aria-hidden="true"
        />
      )}
      {SERVICIOS.map((x, i) => (
        <div key={x.forma} ref={(el) => { cartas.current[i] = el; }} className="srv-helice-carta" aria-hidden={i !== activo}>
          {/* Al quedar de frente se vuelve a montar: sus renglones entran en cascada */}
          <Escena key={i === activo ? 'on' : 'off'} forma={x.forma} />
        </div>
      ))}
    </div>
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
 *    Desde el 11-nov las 7 van en HÉLICE (ver arriba), no una que aparece y se va.
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
            <Helice progreso={scrollYProgress} activo={activo} kai />
          </div>
          <Acciones s={s} className="srv-acciones-movil" />
        </div>
      </div>
    </section>
  );
}
