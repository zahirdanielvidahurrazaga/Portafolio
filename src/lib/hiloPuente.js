/**
 * Puente entre EL HILO (Hilo.jsx, un SVG) y LA NUBE (nube.js, three.js) para el
 * CIERRE: al llegar a la Κ del "¿Empezamos?" el hilo se consume de la punta
 * hacia atrás y cada pedazo se vuelve una partícula que vuela a armar la Κ.
 * Mismo patrón que cintaPuente.js (apertura): el hilo publica aquí, en cada
 * scroll, su TRAMO FINAL ya en px de pantalla, y la nube lo usa como origen.
 * Módulo = una sola instancia compartida.
 */
export const hilo = {
  listo: false,
  n: 0,
  // x, y (px CSS desde la esquina superior izquierda) del tramo final, de su
  // inicio (s = 0) a la punta (s = 1)
  pts: new Float32Array(0),
  // 0 = el hilo entero, 1 = ya todo se volvió partículas
  estallido: 0,
};

/** Cuánto del estallido ya pasó cuando la partícula de la fracción s (0 inicio, 1 punta) se suelta */
export const SUELTA = 0.6;
export const suelta = (s) => (1 - s) * SUELTA;
