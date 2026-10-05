import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../lib/ThemeContext';
import '../styles/HeroRibbon.css';

/**
 * Cinta 3D del hero que, al hacer scroll, se desenrolla y sale de escena
 * antes de la sección de servicios (ver heroRibbon.js). Son DOS canvas fijos a pantalla: uno detrás
 * del contenido y otro delante, para que la cinta pueda cruzar las letras.
 * Vive en App (no dentro del Hero) porque acompaña al scroll fuera del hero.
 * three.js (~150 KB gzip) se carga con import() DESPUÉS de pintar la página,
 * así el titular aparece al instante y la cinta entra con un fade cuando está
 * lista. Sin WebGL no pinta nada.
 */
export default function HeroRibbon() {
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const instRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const [ready, setReady] = useState(false);
  const [inRange, setInRange] = useState(true);

  useEffect(() => {
    let cancelled = false;
    import('../lib/heroRibbon').then(({ createHeroRibbon }) => {
      const heroEl = document.querySelector('.hero-section');
      const nextEl = document.querySelector('#about .factor-header');
      // La cinta nace de las partículas de la apertura (ΚΛΙΖΣΝ), que vive en el
      // mismo escenario del hero. Con reduced-motion no existe → nace sólida.
      const openEl = document.querySelector('[data-nube-modo="apertura"]');
      if (cancelled || !backRef.current || !frontRef.current || !heroEl || !nextEl) {
        return;
      }
      instRef.current = createHeroRibbon(backRef.current, frontRef.current, {
        theme: themeRef.current,
        heroEl,
        nextEl,
        openEl,
        onVisible: setInRange,
      });
      if (instRef.current) setReady(true);
    });
    return () => {
      cancelled = true;
      instRef.current?.destroy();
      instRef.current = null;
    };
  }, []);

  useEffect(() => {
    themeRef.current = theme;
    instRef.current?.setTheme(theme);
  }, [theme]);

  const cls = `hero-ribbon${ready && inRange ? ' is-ready' : ''}`;
  return (
    <>
      <canvas ref={backRef} className={`${cls} hero-ribbon--back`} aria-hidden="true" />
      <canvas ref={frontRef} className={`${cls} hero-ribbon--front`} aria-hidden="true" />
    </>
  );
}
