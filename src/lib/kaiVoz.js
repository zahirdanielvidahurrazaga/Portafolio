import { useSyncExternalStore } from 'react';

/**
 * La VOZ de Kai, compartida entre Kai.jsx (que la toca) y la barra (que tiene el
 * botón de sonido siempre a la mano, como la referencia de adamperlis.com).
 *  · `hay`: hay audios grabados (sin ellos el botón no aparece)
 *  · `voz`: el visitante la prendió (se recuerda en localStorage 'kai-voz')
 * El botón llama `alternarVoz()`, que Kai.jsx registra: el clic es el permiso del
 * navegador para sonar, así que la llamada tiene que ser directa, dentro del clic.
 */
// `bloqueada`: la voz está prendida pero el navegador no dejó sonar (aún no hay clic en la
// página; el scroll no cuenta como permiso). La barra lo enseña y un toque la hace sonar.
let estado = { hay: false, voz: false, bloqueada: false };
let pendiente = null;
const subs = new Set();
let alternar = null;

export function fijarVoz(parcial) {
  estado = { ...estado, ...parcial };
  subs.forEach((f) => f());
}
export function registrarAlternar(fn) {
  alternar = fn;
}
export function alternarVoz() {
  // Bloqueada: el toque NO apaga la voz, hace sonar lo que Kai quería decir
  if (estado.bloqueada && pendiente) {
    const f = pendiente;
    pendiente = null;
    fijarVoz({ bloqueada: false });
    f();
    return;
  }
  alternar?.();
}
/** Kai.jsx avisa que el navegador bloqueó el audio y deja lista la reproducción */
export function vozBloqueada(reproducir) {
  pendiente = reproducir;
  if (!estado.bloqueada) fijarVoz({ bloqueada: true });
}
export function vozLibre() {
  pendiente = null;
  if (estado.bloqueada) fijarVoz({ bloqueada: false });
}
export function useVozKai() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => estado,
    () => estado
  );
}
