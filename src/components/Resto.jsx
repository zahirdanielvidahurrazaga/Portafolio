import React, { useEffect } from 'react';
import Testimonios from './Testimonios';
import Demos from './Demos';
import PortafolioShowcase from './PortafolioShowcase';
import DiagonalReveal from './DiagonalReveal';
import SobreMi from './SobreMi';
import ProcesoTrabajo from './ProcesoTrabajo';
import Faq from './Faq';
import Interludio from './Interludio';
import Footer from './Footer';
import { useLang } from '../lib/LangContext';
import { cargado } from '../lib/carga';

/**
 * TODO LO QUE VA DEBAJO DE SERVICIOS, en su propio archivo (App lo carga con
 * React.lazy). En el celular, pintar la página entera de golpe eran 3 bloqueos
 * de 100–150 ms (×3 o más en un teléfono) justo mientras arrancaba la intro;
 * ahora el primer pintado es solo hero + Servicios y esto llega enseguida, en
 * paralelo. El hero mide ~6 pantallas: nadie alcanza a llegar aquí antes.
 * Servicios se queda en App porque la cinta del hero sale rumbo a su título.
 */

// Respaldo del interludio final (sin WebGL o con reduced-motion): la misma forma en trazo
const FallbackK = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <rect x="2" y="2" width="96" height="96" rx="22" strokeWidth="3" />
    <path d="M33 27V73 M66 27 38 52 M48 44 68 73" strokeWidth="11" />
  </svg>
);

export default function Resto() {
  const { t } = useLang();
  // Si se llegó con #seccion, el navegador buscó el ancla antes de que esto
  // existiera: se lleva ahí en cuanto está pintado.
  // La pantalla de carga espera a que todo esto ya esté montado
  useEffect(() => {
    cargado('resto');
  }, []);
  useEffect(() => {
    let id = window.location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* ancla mal escrita (#%): se busca tal cual */ }
    if (!id) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);
  return (
    <>
      <Testimonios />
      {/* "Pruébalo antes de tenerlo": quita el miedo a pagar sin ver; luego
          Proyectos prueba que entregan */}
      <Demos />
      <PortafolioShowcase />
      {/* Corte diagonal al entrar (estilo Lusion). Solo en dos secciones: en
          todas se volvería tic y dejaría de notarse. */}
      <DiagonalReveal>
        <SobreMi />
      </DiagonalReveal>
      <DiagonalReveal>
        <ProcesoTrabajo />
      </DiagonalReveal>
      <Faq />
      <Interludio
        forma="k"
        origen="hilo"
        kicker={t({ es: 'Tu turno', en: 'Your turn' })}
        fallback={<FallbackK />}
        extra={
          <a href="#contact" className="btn-metallic btn-large">
            {t({ es: 'Cuéntanos tu proyecto', en: 'Tell us about your project' })}
          </a>
        }
      >
        {t({ es: <>¿<em>Empezamos</em>?</>, en: <>Shall we <em>start</em>?</> })}
      </Interludio>
    </>
  );
}

export const Pie = Footer;
