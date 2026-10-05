import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Transición en diagonal entre secciones (la de lusion.co al cambiar de
 * página, seg. 26–28 de la grabación). Aquí es de una sola página, así que la
 * sección se DESCUBRE con un corte diagonal que sube conforme entra a
 * pantalla. Ligado al scroll: al subir se vuelve a tapar. Termina cuando la
 * sección va al 60% de la pantalla: más lento dejaba un hueco negro arriba.
 * El corte va de "nada visible" (las dos esquinas abajo) a "todo visible"
 * (las dos arriba, más allá del borde), con la derecha adelantada 30 puntos.
 */
export default function DiagonalReveal({ children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 60%'] });
  const izq = useTransform(scrollYProgress, [0, 1], [130, -30]);
  const der = useTransform(scrollYProgress, [0, 1], [100, -60]);
  const clipPath = useTransform(
    [izq, der],
    // Ya descubierta: sin clip, para no recortar glows/sombras que se salen
    // de la caja de la sección.
    ([l, r]) => (l <= -29.9 ? 'none' : `polygon(0% ${l}%, 100% ${r}%, 100% 100%, 0% 100%)`)
  );

  if (reduced) return children;
  return (
    <motion.div ref={ref} style={{ clipPath }}>
      {children}
    </motion.div>
  );
}
