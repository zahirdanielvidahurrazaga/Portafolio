import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/LangContext';
import '../styles/BarraScroll.css';

/**
 * Indicador de scroll a la derecha (como el de lusion.co). Como el sitio es una
 * presentación con escenas fijas largas, la barra del navegador no orienta:
 * aquí se ve CUÁNTO va de la página (el "pulgar") y DÓNDE empieza cada sección
 * (las marcas), para saber cuánto falta para la siguiente.
 * Reemplaza a la barra nativa (se esconde en index.css). No captura el mouse.
 * Se oculta durante la pantalla de carga (html.intro).
 */
const SECCIONES = ['about', 'testimonios', 'demos', 'portfolio', 'sobre-mi', 'process', 'faq', 'contact'];
// Capítulo que se lee junto al pulgar (2026-11-06): con escenas fijas largas uno
// pierde dónde va; el número es el mismo "Nº" de cada SectionHead.
const CAPITULOS = [
  { es: 'Inicio', en: 'Home' },
  { es: 'Servicios', en: 'Services' },
  { es: 'Testimonios', en: 'Testimonials' },
  { es: 'Demos', en: 'Demos' },
  { es: 'Proyectos', en: 'Work' },
  { es: 'Nosotros', en: 'About' },
  { es: 'Proceso', en: 'Process' },
  { es: 'Preguntas', en: 'FAQ' },
  { es: 'Contacto', en: 'Contact' },
];

export default function BarraScroll() {
  const pulgar = useRef(null);
  const [marcas, setMarcas] = useState([]);
  const [cap, setCap] = useState(0);
  const { t } = useLang();
  const marcasRef = useRef([]);
  const riel = useRef(null);

  useEffect(() => {
    let raf = 0;
    let alto = 1;
    const medir = () => {
      const doc = document.documentElement;
      alto = Math.max(1, doc.scrollHeight - window.innerHeight);
      // Tamaño del pulgar = qué fracción de la página cabe en pantalla (con mínimo)
      const frac = Math.min(1, window.innerHeight / doc.scrollHeight);
      pulgar.current?.style.setProperty('--tam', `${Math.max(0.07, frac) * 100}%`);
      const m = SECCIONES.map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((el) => Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / alto));
      marcasRef.current = m;
      setMarcas(m);
      pintar();
    };
    const pintar = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / alto));
      pulgar.current?.style.setProperty('--p', String(p));
      // Capítulo = cuántas secciones ya empezaron (con la mitad de la pantalla)
      const linea = (window.scrollY + window.innerHeight * 0.5) / alto;
      setCap(marcasRef.current.filter((m) => m <= linea).length);
    };
    // El capítulo se lee solo MIENTRAS te mueves: quieto, estorbaría al texto de la derecha
    let quieto = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
      riel.current?.classList.add('is-moving');
      clearTimeout(quieto);
      quieto = setTimeout(() => riel.current?.classList.remove('is-moving'), 1400);
    };
    medir();
    // El alto de la página cambia cuando cargan imágenes o se monta algo tarde
    const ro = new ResizeObserver(medir);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(quieto);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', medir);
    };
  }, []);

  return (
    <div ref={riel} className="barra-scroll" aria-hidden="true">
      {marcas.map((m, i) => (
        <i key={i} className="barra-scroll-marca" style={{ top: `${m * 100}%` }} />
      ))}
      <span ref={pulgar} className="barra-scroll-pulgar">
        <span key={cap} className="barra-scroll-cap">
          <b>{String(cap + 1).padStart(2, '0')}</b> {t(CAPITULOS[cap] || CAPITULOS[0])}
        </span>
      </span>
    </div>
  );
}
