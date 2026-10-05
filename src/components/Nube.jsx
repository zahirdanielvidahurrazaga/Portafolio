import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';

/**
 * Canvas fijo de LA NUBE (ver lib/nube.js). Igual que la cinta, three.js se
 * carga con import() después de pintar. Al arrancar pone `nube-on` en el
 * <body>: eso esconde los respaldos estáticos de los interludios (el SVG que
 * se ve sin WebGL o con prefers-reduced-motion, donde la nube no corre).
 */
export default function Nube() {
  const ref = useRef(null);
  const instRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.remove('intro');
      return undefined;
    }
    let cancelled = false;
    import('../lib/nube').then(({ createNube }) => {
      if (cancelled || !ref.current) return;
      instRef.current = createNube(ref.current, { theme: themeRef.current });
      if (instRef.current) document.body.classList.add('nube-on');
      // Sin WebGL no hay pantalla de carga que esperar
      else document.documentElement.classList.remove('intro');
    });
    return () => {
      cancelled = true;
      instRef.current?.destroy();
      instRef.current = null;
      document.body.classList.remove('nube-on');
    };
  }, [reduced]);

  useEffect(() => {
    themeRef.current = theme;
    instRef.current?.setTheme(theme);
  }, [theme]);

  if (reduced) return null;
  return <canvas ref={ref} className="nube" aria-hidden="true" />;
}
