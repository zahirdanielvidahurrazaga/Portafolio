import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, X } from 'lucide-react';
import LiquidGlass from './LiquidGlass';
import { useLang } from '../lib/LangContext';
import { WHATSAPP } from '../data/contacto';
import { KAI_RESPUESTAS, KAI_SUGERIDAS, KAI_NO_SE, buscarRespuesta } from '../data/kaiRespuestas';
import '../styles/KaiPregunta.css';

/**
 * PREGÚNTALE A KAI (14-nov-2026). Una píldora junto al botón de WhatsApp abre un chat
 * chiquito: sugerencias + campo de texto. Las respuestas son PREPARADAS
 * (data/kaiRespuestas.js), sin IA ni servidor; si no hay una que empate, manda a WhatsApp.
 * Cada respuesta hace que Kai dé una vuelta (evento `kai:gira`), para que se sienta suyo.
 */
const POR_ID = Object.fromEntries(KAI_RESPUESTAS.map((x) => [x.id, x]));

export default function KaiPregunta() {
  const { t } = useLang();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState('');
  const [chat, setChat] = useState([]); // { de: 'yo' | 'kai', texto, ir? }
  const lista = useRef(null);
  const campo = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const tecla = (e) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', tecla);
    const id = setTimeout(() => campo.current?.focus({ preventScroll: true }), 250);
    return () => {
      window.removeEventListener('keydown', tecla);
      clearTimeout(id);
    };
  }, [abierto]);

  // Cualquier parte de la página la abre con window.dispatchEvent(new Event('kai:pregunta'))
  useEffect(() => {
    const abrir = () => setAbierto(true);
    window.addEventListener('kai:pregunta', abrir);
    return () => window.removeEventListener('kai:pregunta', abrir);
  }, []);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' });
  }, [chat]);

  const preguntar = (q, x = buscarRespuesta(q)) => {
    if (!q.trim()) return;
    setChat((c) => [
      ...c,
      { de: 'yo', texto: q.trim() },
      x ? { de: 'kai', texto: t(x.r), ir: x.ir } : { de: 'kai', texto: t(KAI_NO_SE), ir: 'whatsapp' },
    ]);
    setTexto('');
    window.dispatchEvent(new Event('kai:gira'));
  };

  const boton = (ir) => {
    if (ir === 'whatsapp') {
      const msg = t({ es: 'Hola, KaiZen. Le pregunté a Kai y quiero saber más: ', en: 'Hi, KaiZen. I asked Kai and I’d like to know more: ' });
      return (
        <a className="kp-ir" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">
          {t({ es: 'Escribir por WhatsApp', en: 'Message on WhatsApp' })} <ArrowUpRight size={14} />
        </a>
      );
    }
    return (
      <a className="kp-ir" href={ir} onClick={() => setAbierto(false)}>
        {t({ es: 'Llévame ahí', en: 'Take me there' })} <ArrowUpRight size={14} />
      </a>
    );
  };

  return (
    <>
      {/* La píldora es también la CASA de Kai: sin lugar en la escena se guarda en su hueco
          (.kai-dock, lib/kai.js), como Buddy en la barra de adamperlis.com */}
      <div className={`kp-pildora${abierto ? ' is-oculta' : ''}`}>
        <LiquidGlass shape="rounded" radius={0.5} intensity={0.8} className="kp-vidrio" />
        <span className="kai-dock" aria-hidden="true" />
        <button type="button" className="kp-abrir" onClick={() => setAbierto(true)} aria-haspopup="dialog">
          {t({ es: 'Pregúntale a Kai', en: 'Ask Kai' })}
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="kp-panel"
            role="dialog"
            aria-label={t({ es: 'Pregúntale a Kai', en: 'Ask Kai' })}
            data-lenis-prevent
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="kp-cabeza">
              <span>
                <b>Kai</b>
                <small>{t({ es: 'Respuestas rápidas sobre KaiZen', en: 'Quick answers about KaiZen' })}</small>
              </span>
              <button type="button" className="kp-x" onClick={() => setAbierto(false)} aria-label={t({ es: 'Cerrar', en: 'Close' })}>
                <X size={18} />
              </button>
            </header>

            <div ref={lista} className="kp-lista" aria-live="polite">
              <p className="kp-msg kp-msg--kai">
                {t({ es: '¡Hola! Soy Kai. ¿Qué quieres saber de KaiZen?', en: 'Hi! I’m Kai. What would you like to know about KaiZen?' })}
              </p>
              {chat.map((m, i) => (
                <div key={i} className={`kp-msg kp-msg--${m.de}`}>
                  {m.texto}
                  {m.de === 'kai' && m.ir && boton(m.ir)}
                </div>
              ))}
            </div>

            <div className="kp-sugeridas">
              {KAI_SUGERIDAS.map((id) => (
                <button key={id} type="button" onClick={() => preguntar(t(POR_ID[id].pregunta), POR_ID[id])}>
                  {t(POR_ID[id].pregunta)}
                </button>
              ))}
            </div>

            <form
              className="kp-form"
              onSubmit={(e) => {
                e.preventDefault();
                preguntar(texto);
              }}
            >
              <input
                ref={campo}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={t({ es: 'Escribe tu pregunta…', en: 'Type your question…' })}
                maxLength={160}
                aria-label={t({ es: 'Tu pregunta', en: 'Your question' })}
              />
              <button type="submit" aria-label={t({ es: 'Preguntar', en: 'Ask' })} disabled={!texto.trim()}>
                <ArrowUp size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
