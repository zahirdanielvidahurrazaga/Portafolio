import { motion } from 'framer-motion';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
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
  },
];

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
