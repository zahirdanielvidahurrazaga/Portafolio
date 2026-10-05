import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Scroll suave con inercia (Lenis), la base del "se siente vivo" de lusion.co.
 * - Solo suaviza rueda/trackpad; en touch el celular conserva su scroll nativo.
 * - Se apaga con prefers-reduced-motion.
 * - Se detiene mientras haya un modal abierto (`body.pm-open`), porque el modal
 *   congela el fondo y scrollea su propio contenedor.
 * - La pantalla de carga (`html.intro`) NO lo detiene: lenis.stop() pone
 *   overflow:clip en <html>, y en Safari alternar el overflow de la raíz rompe
 *   los position:sticky. Ese bloqueo va por eventos en index.html.
 * - `anchors` hace que los links #seccion también lleguen con suavidad.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ duration: 1.15, autoRaf: true, anchors: true });
    const sync = () =>
      document.body.classList.contains('pm-open') ? lenis.stop() : lenis.start();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mo.disconnect();
      lenis.destroy();
    };
  }, []);
}
