import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHead from './SectionHead';
import { useLang } from '../lib/LangContext';
import '../styles/Faq.css';

// Adaptadas a las 7 líneas (5-oct): ya no solo software — también marca y redes.
// Los tiempos son los que Zahir confirmó (~2 meses en software); el resto se
// dice sin números inventados.
const FAQS = [
  {
    q: { es: '¿Cuánto tarda mi proyecto?', en: 'How long will my project take?' },
    a: {
      es: 'Depende de lo que necesites. Una identidad de marca o una landing page toma semanas; un proyecto de software, alrededor de 2 meses desde que firmamos hasta que está operando. Las redes sociales se trabajan mes con mes. El tiempo exacto de tu caso va por escrito en la propuesta.',
      en: 'It depends on what you need. A brand identity or a landing page takes weeks; a software project, about 2 months from signing until it’s up and running. Social media is managed month by month. The exact timeline for your case goes in writing in the proposal.',
    },
  },
  {
    q: { es: '¿Manejan nuestras redes sociales?', en: 'Do you manage our social media?' },
    a: {
      es: 'Sí. Planeamos el calendario, diseñamos y redactamos las publicaciones, hacemos reels, las programamos, respondemos a tu comunidad y te entregamos reportes de resultados cada mes.',
      en: 'Yes. We plan the calendar, design and write the posts, make reels, schedule everything, respond to your community and send you results reports every month.',
    },
  },
  {
    q: { es: '¿La publicidad pagada está incluida?', en: 'Is paid advertising included?' },
    a: {
      es: 'No. Podemos crear y administrar tus campañas, pero el presupuesto de anuncios (Meta, TikTok, Google) lo pagas directo a cada plataforma, así siempre tienes el control de cuánto inviertes.',
      en: 'No. We can create and manage your campaigns, but the ad budget (Meta, TikTok, Google) is paid directly to each platform, so you always control how much you invest.',
    },
  },
  {
    q: { es: '¿Lo que construyen es mío?', en: 'Do I own what you build?' },
    a: {
      es: 'Sí. Al liquidar el proyecto, tu marca, tu sitio, tu código y tus datos son tuyos, sin ataduras ni dependencias hacia nosotros.',
      en: 'Yes. Once the project is paid in full, your brand, your website, your code and your data are yours, with no strings attached to us.',
    },
  },
  {
    q: { es: '¿Dan soporte y mantenimiento después del lanzamiento?', en: 'Do you offer support and maintenance after launch?' },
    a: {
      es: 'Sí. Ofrecemos planes de soporte y mantenimiento para mantener tu sitio o sistema actualizado, seguro y funcionando sin interrupciones.',
      en: 'Yes. We offer support and maintenance plans to keep your site or system up to date, secure and running without interruptions.',
    },
  },
  {
    q: { es: '¿Trabajan con mi presupuesto?', en: 'Can you work with my budget?' },
    a: {
      es: 'Cada proyecto se cotiza a la medida. Podemos arrancar con lo esencial y crecer por fases, a tu ritmo. Escríbenos y te decimos qué conviene para tu caso.',
      en: 'Every project is quoted individually. We can start with the essentials and grow in phases, at your pace. Message us and we’ll tell you what makes sense for your case.',
    },
  },
  {
    q: { es: '¿Suben mi app a la App Store y Google Play?', en: 'Do you publish my app on the App Store and Google Play?' },
    a: {
      es: 'Sí, nos encargamos de la publicación. Las cuentas de desarrollador de Apple y Google van a nombre de tu negocio (para que la app sea tuya) y sus cuotas anuales se pagan directo a ellos.',
      en: 'Yes, we handle the publishing. The Apple and Google developer accounts are in your business’s name (so the app is yours) and their annual fees are paid directly to them.',
    },
  },
];

const Faq = () => {
  const [open, setOpen] = useState(null);
  const { t } = useLang();

  return (
    <section id="faq" className="section-container faq-section">
      <SectionHead
        num="07"
        label={t({ es: 'Preguntas frecuentes', en: 'FAQ' })}
        lede={t({ es: 'Lo que la mayoría quiere saber antes de empezar.', en: 'What most people want to know before getting started.' })}
      >
        {t({ es: <>Antes de <em>empezar</em></>, en: <>Before we <em>start</em></> })}
      </SectionHead>

      <div className="faq-list rule-list">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
              <button
                className="faq-q"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{t(f.q)}</span>
                <Plus className="faq-chevron" size={22} aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="faq-a"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{t(f.a)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
