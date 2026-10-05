/**
 * Puente entre la cinta 3D (heroRibbon.js) y la nube (nube.js) para la
 * APERTURA: las partículas de ΚΛΙΖΣΝ fluyen hasta la cinta y la cinta "se
 * solidifica" mientras ellas se apagan. Son dos canvas distintos, así que la
 * cinta publica aquí, en cada cuadro, su recorrido YA proyectado a pantalla, y
 * la nube lo usa como destino. Módulo = una sola instancia compartida.
 */
export const cinta = {
  listo: false,
  n: 0,
  // x, y (px CSS desde la esquina superior izquierda) y radio en px, por punto
  pts: new Float32Array(0),
};

/* Tiempos del relevo, en progreso del escenario de apertura (Hero.jsx; q: 0 =
   arriba del todo, 1 = el escenario se suelta). Los usan los TRES lados (nube,
   cinta y textos del hero): si se mueven aquí, siguen sincronizados. El
   escenario mide ~7 pantallas, así que cada fase pide varios golpes de rueda. */
export const RELEVO = {
  texto: [0.08, 0.2], // la frase y el kicker se tuercen y se van
  flujo: [0.12, 0.5], // las partículas viajan de las letras a la cinta (largo: ~2 pantallas)
  cruce: [0.46, 0.6], // la cinta aparece y las partículas se apagan
};

export const smooth = (x) => x * x * (3 - 2 * x);
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const fase = (q, [a, b]) => smooth(clamp01((q - a) / (b - a)));

/** Progreso de la apertura (0…1) o null si no existe */
export function progresoApertura(el, vh) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return -r.top / Math.max(1, r.height - vh);
}
