import { useEffect, useRef, useState } from 'react';
import '../styles/BarraScroll.css';

/**
 * Indicador de scroll a la derecha (como el de lusion.co). Como el sitio es una
 * presentación con escenas fijas largas, la barra del navegador no orienta:
 * aquí se ve CUÁNTO va de la página (el "pulgar") y DÓNDE empieza cada sección
 * (las marcas), para saber cuánto falta para la siguiente.
 * Reemplaza a la barra nativa (se esconde en index.css). No captura el mouse.
 * Se oculta durante la pantalla de carga (html.intro).
 */
const SECCIONES = ['about', 'testimonios', 'portfolio', 'sobre-mi', 'process', 'faq', 'contact'];

export default function BarraScroll() {
  const pulgar = useRef(null);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    let raf = 0;
    let alto = 1;
    const medir = () => {
      const doc = document.documentElement;
      alto = Math.max(1, doc.scrollHeight - window.innerHeight);
      // Tamaño del pulgar = qué fracción de la página cabe en pantalla (con mínimo)
      const frac = Math.min(1, window.innerHeight / doc.scrollHeight);
      pulgar.current?.style.setProperty('--tam', `${Math.max(0.07, frac) * 100}%`);
      setMarcas(
        SECCIONES.map((id) => document.getElementById(id))
          .filter(Boolean)
          .map((el) => Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / alto))
      );
      pintar();
    };
    const pintar = () => {
      raf = 0;
      pulgar.current?.style.setProperty('--p', String(Math.min(1, Math.max(0, window.scrollY / alto))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', medir);
    };
  }, []);

  return (
    <div className="barra-scroll" aria-hidden="true">
      {marcas.map((m, i) => (
        <i key={i} className="barra-scroll-marca" style={{ top: `${m * 100}%` }} />
      ))}
      <span ref={pulgar} className="barra-scroll-pulgar" />
    </div>
  );
}
