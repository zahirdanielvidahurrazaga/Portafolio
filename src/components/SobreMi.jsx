import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import { REDES } from '../data/contacto';
import '../styles/SobreMi.css';

/**
 * NOSOTROS = "DOS MITADES, UN HILO" (2026-11-06). El id sigue siendo #sobre-mi.
 * Antes: escena fija donde LA NUBE dibujaba un lápiz y un </> y los fundía en un
 * teléfono (íconos de partículas; Zahir: "no quiero íconos").
 * Ahora, en flujo normal (sin escena fija, ~1,000 px menos):
 *  1. "Somos KaiZen" + la bio de mejora continua;
 *  2. LAS DOS MITADES del estudio en dos columnas grandes, cada una con los
 *     servicios que cubre (los mismos nombres de Servicios). EL HILO (Hilo.jsx)
 *     baja justo por la ranura del centro: las une — un solo equipo;
 *  3. la frase "De una idea a las manos de tus clientes.", a la que llega el hilo;
 *  4. Misión · Visión · Valores + CTA.
 * En celular las mitades se apilan y el hilo va por el margen.
 */
const MITADES = [
  {
    num: 'I',
    titulo: { es: 'Estrategia, marca y redes', en: 'Strategy, brand & social' },
    texto: {
      es: 'Escuchamos tu negocio, diseñamos su identidad y su experiencia, y cuidamos cómo se comunica en redes, de la primera charla a cada publicación.',
      en: 'We listen to your business, design its identity and experience, and take care of how it speaks on social media, from the first call to every post.',
    },
    servicios: {
      es: ['Identidad de marca', 'Redes sociales', 'Lanzamiento'],
      en: ['Brand identity', 'Social media', 'Launch'],
    },
    redes: true,
  },
  {
    num: 'II',
    titulo: { es: 'Tecnología', en: 'Technology' },
    texto: {
      es: 'Construimos sitios web, tiendas en línea, apps en App Store y Google Play y sistemas a la medida, conectados con lo que ya usa tu negocio.',
      en: 'We build websites, online stores, apps on the App Store and Google Play, and custom systems, connected to what your business already uses.',
    },
    servicios: {
      es: ['Sitios web', 'Tiendas y punto de venta', 'Automatización e IA', 'Apps y experiencias'],
      en: ['Websites', 'Stores & point of sale', 'Automation & AI', 'Apps & experiences'],
    },
    tiendas: true,
  },
];

// Insignias de tienda (14-nov-2026, decorativas a pedido de Zahir: no llevan enlace —
// KaiZen no tiene app propia; dicen que las apps que hacemos se publican ahí).
const APPLE = 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701';
// Insignias de REDES (14-nov-2026, par de las de tiendas): llevan a las cuentas de KaiZen
const ICONOS_RED = {
  Instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};
function Redes() {
  const { t } = useLang();
  return (
    <div className="nos-tiendas">
      {REDES.map(([nombre, url]) => (
        <a key={nombre} className="nos-tienda nos-red" href={url} target="_blank" rel="noopener noreferrer" aria-label={`KaiZen ${t({ es: 'en', en: 'on' })} ${nombre}`}>
          {ICONOS_RED[nombre]}
          <span><small>{t({ es: 'Síguenos en', en: 'Follow us on' })}</small>{nombre}</span>
        </a>
      ))}
    </div>
  );
}

function Tiendas() {
  const { t } = useLang();
  return (
    <div className="nos-tiendas" role="img" aria-label={t({ es: 'Publicamos apps en App Store y Google Play', en: 'We publish apps on the App Store and Google Play' })}>
      <span className="nos-tienda" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d={APPLE} fill="currentColor" /></svg>
        <span><small>{t({ es: 'Descárgala en', en: 'Download on the' })}</small>App Store</span>
      </span>
      <span className="nos-tienda" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="22">
          <path d="M3.6 1.8 13.5 12 3.6 22.2c-.4-.2-.6-.6-.6-1.1V2.9c0-.5.2-.9.6-1.1z" fill="#00d7fe" />
          <path d="m16.9 8.6-3.4 3.4-9.9-10.2c.2-.1.5-.1.8 0l12.5 6.8z" fill="#32bb5d" />
          <path d="m16.9 15.4-12.5 6.8c-.3.1-.6.1-.8 0l9.9-10.2 3.4 3.4z" fill="#f5333f" />
          <path d="m21.1 13.1-4.2 2.3-3.4-3.4 3.4-3.4 4.2 2.3c.9.5.9 1.7 0 2.2z" fill="#ffd000" />
        </svg>
        <span><small>{t({ es: 'Disponible en', en: 'Get it on' })}</small>Google Play</span>
      </span>
    </div>
  );
}

// Borrador de KaiZen (5-oct): que Karime y Zahir lo ajusten a su voz.
const MVV = [
  {
    titulo: { es: 'Misión', en: 'Mission' },
    texto: {
      es: 'Ayudar a los negocios a crecer con una marca clara, una presencia constante en redes y tecnología hecha a su medida, mejorándolos un paso a la vez.',
      en: 'To help businesses grow with a clear brand, a consistent presence on social media and technology built for them, improving them one step at a time.',
    },
  },
  {
    titulo: { es: 'Visión', en: 'Vision' },
    texto: {
      es: 'Ser el estudio de confianza de los negocios que quieren evolucionar: el aliado que entiende su operación de punta a punta, de la marca al software.',
      en: 'To be the trusted studio for businesses that want to evolve: the partner that understands their operation end to end, from brand to software.',
    },
  },
  {
    titulo: { es: 'Valores', en: 'Values' },
    lista: {
      es: [
        ['Mejora continua', 'cada entrega es mejor que la anterior'],
        ['A la medida', 'nada de plantillas, todo parte de tu negocio'],
        ['Claridad', 'alcance, tiempos y costos por escrito, sin sorpresas'],
        ['Resultados reales', 'lo medimos en tu operación, no en promesas'],
      ],
      en: [
        ['Continuous improvement', 'every delivery is better than the last'],
        ['Tailor-made', 'no templates, everything starts from your business'],
        ['Clarity', 'scope, timelines and costs in writing, no surprises'],
        ['Real results', 'measured in your operation, not in promises'],
      ],
    },
  },
];

const FINAL = {
  kicker: { es: 'Marca + tecnología, un solo equipo', en: 'Brand + technology, one team' },
  frase: {
    es: <>De una idea a <em>las manos de tus clientes.</em></>,
    en: <>From an idea to <em>your customers’ hands.</em></>,
  },
};

const entra = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
});

function Mitades() {
  const { t, lang } = useLang();
  return (
    <div className="nos-mitades">
      {/* Kai, sentado en medio de las dos mitades: él es la unión */}
      <span className="kai-lugar kai-lugar--union" data-kai="nosotros" data-kai-talla="0.6" aria-hidden="true" />
      {MITADES.map((m, i) => (
        <motion.div key={m.num} className="nos-mitad" {...entra(i)}>
          <span className="nos-mitad-num">{m.num}</span>
          <h3 className="nos-mitad-titulo">{t(m.titulo)}</h3>
          <p className="nos-mitad-texto">{t(m.texto)}</p>
          <ul className="nos-mitad-servicios">
            {m.servicios[lang === 'en' ? 'en' : 'es'].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {m.tiendas && <Tiendas />}
          {m.redes && <Redes />}
        </motion.div>
      ))}
    </div>
  );
}

const SobreMi = () => {
  const { t } = useLang();
  return (
    <section id="sobre-mi" className="sobre-section">
      <div className="section-container sobre-head">
        <SectionHead num="06" label={t({ es: 'Nosotros', en: 'About' })}>
          {t({ es: <>Somos <em>KaiZen</em></>, en: <>We are <em>KaiZen</em></> })}
        </SectionHead>

        <motion.p
          className="sobre-bio"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t({
            es: (
              <>
                Kaizen es la filosofía japonesa de la <em>mejora continua</em>: pasos pequeños,
                todos los días. Así acompañamos a cada negocio: cuidamos su marca, le damos voz
                en redes y construimos la tecnología que lo hace crecer. Sin plantillas, y
                mejorándolo contigo después del lanzamiento.
              </>
            ),
            en: (
              <>
                Kaizen is the Japanese philosophy of <em>continuous improvement</em>: small steps,
                every day. That’s how we work with every business: we care for its brand, give it a
                voice on social media and build the technology that helps it grow. No templates, and
                we keep improving it with you after launch.
              </>
            ),
          })}
        </motion.p>

      </div>

      <div className="section-container nos-cuerpo">
        <p className="nos-kicker">{t(FINAL.kicker)}</p>
        <Mitades />
        <motion.h2 className="nos-frase" {...entra()}>
          {t(FINAL.frase)}
        </motion.h2>

        {/* Misión · Visión · Valores (5-oct): cortas y en el mismo tono editorial */}
        <div className="sobre-mvv">
          {MVV.map((b, i) => (
            <motion.div key={b.titulo.es} className="sobre-mvv-col" {...entra(i)}>
              <h3>{t(b.titulo)}</h3>
              {b.texto && <p>{t(b.texto)}</p>}
              {b.lista && (
                <ul>
                  {t(b.lista).map(([nombre, d]) => (
                    <li key={nombre}>
                      <strong>{nombre}.</strong> {d}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <a href="#contact" className="sobre-cta">
          {t({ es: 'Trabajemos juntos →', en: 'Let’s work together →' })}
        </a>
      </div>
    </section>
  );
};

export default SobreMi;
