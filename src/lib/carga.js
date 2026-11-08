/**
 * PANTALLA DE CARGA (#carga en index.html). Se queda hasta que esté listo lo
 * pesado: la nube y la cinta (three.js + shaders YA COMPILADOS) y las fuentes.
 * Recién entonces se desvanece y arranca el reloj de la intro de la nube
 * (partículas sueltas → ΚΛΙΖΣΝ). Antes la intro corría mientras three.js aún
 * bajaba, y en celular se veía la pantalla en negro y luego todo trabado.
 *
 * Sin html.intro (llegó con #ancla, reduced-motion, páginas legales) no hay
 * pantalla de carga: todo cuenta como listo desde el principio.
 */
const pendientes = new Set(['nube', 'cinta', 'fuentes']);
const TOTAL = pendientes.size;
const espera = [];
let listo = typeof document === 'undefined' || !document.documentElement.classList.contains('intro');

function terminar() {
  if (listo) return;
  listo = true;
  const el = document.getElementById('carga');
  if (el) {
    el.style.setProperty('--p', '1');
    el.classList.add('is-fuera');
    setTimeout(() => el.remove(), 900);
  }
  espera.splice(0).forEach((cb) => cb());
}

/** Marca una pieza como lista ('nube' | 'cinta' | 'fuentes') */
export function cargado(nombre) {
  try { performance.mark(`carga:${nombre}`); } catch { /* sin Performance API */ }
  if (listo || !pendientes.delete(nombre)) return;
  document.getElementById('carga')?.style.setProperty('--p', String((TOTAL - pendientes.size) / TOTAL));
  if (!pendientes.size) terminar();
}

export const cargaLista = () => listo;

// Respaldo: si algo se atora (red lenta, sin WebGL raro), no dejar al visitante esperando
if (!listo) setTimeout(terminar, 9000);
