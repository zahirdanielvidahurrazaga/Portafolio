import { useSyncExternalStore } from 'react';

/**
 * La VOZ de Kai, compartida entre Kai.jsx (que la toca) y la barra (que tiene el
 * botón de sonido siempre a la mano, como la referencia de adamperlis.com).
 *  · `hay`: hay audios grabados (sin ellos el botón no aparece)
 *  · `voz`: el visitante la prendió (se recuerda en localStorage 'kai-voz')
 * El botón llama `alternarVoz()`, que Kai.jsx registra: el clic es el permiso del
 * navegador para sonar, así que la llamada tiene que ser directa, dentro del clic.
 */
let estado = { hay: false, voz: false };
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
  alternar?.();
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
