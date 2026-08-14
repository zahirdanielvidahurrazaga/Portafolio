import { useRef, useEffect } from 'react';
import { createLiquidGlass } from '../lib/liquidGlass';
import { useTheme } from '../lib/ThemeContext';
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
  const { theme } = useTheme();
  // 1 = brillo blanco sobre fondo oscuro; 0 = filo oscuro sobre fondo claro.
  const tone = theme === 'light' ? 0 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Al cambiar de tema se recrea el contexto WebGL a propósito: el tono va
    // horneado en los uniforms al crearlo, y solo pasa al tocar el switch.
    const instance = createLiquidGlass(canvas, { shape, radius, intensity, tone });
    return () => instance?.destroy();
  }, [shape, radius, intensity, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-glass-canvas ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
}
