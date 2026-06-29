import { useRef, useEffect } from 'react';
import { createLiquidGlass } from '../lib/liquidGlass';
import '../styles/LiquidGlass.css';

/**
 * Capa de cristal líquido REAL (WebGL) que se ajusta a su contenedor.
 * Pensado para ir detrás del contenido de un elemento (inset: 0).
 * Si WebGL no está disponible, no pinta nada → el CSS del padre sirve de fallback.
 */
export default function LiquidGlass({
  shape = 'rounded',
  radius = 0.5,
  intensity = 1.0,
  className = '',
  style,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const instance = createLiquidGlass(canvas, { shape, radius, intensity });
    return () => instance?.destroy();
  }, [shape, radius, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-glass-canvas ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}
