/**
 * PANTALLA DE CARGA (#carga en index.html: el logo que se dibuja + Kai + riel).
 * Se queda hasta que TODO lo pesado está listo (11-nov-2026: Zahir la sentía
 * de adorno, "muy rápida"; ahora sí espera a la página completa):
 *   nube · cinta   three.js con sus shaders YA COMPILADOS
 *   fuentes        las caras que usa el hero
 *   kai            el guía (su 3D y su entorno de estudio)
 *   resto          todo lo de debajo de Servicios, ya montado (Resto.jsx)
 *   medios         capturas de las demos, portadas de los videos, logos y el
 *                  código del elenco / teléfono / mármol (ver `precargar`)
 * y además un MÍNIMO en pantalla, para que el logo alcance a dibujarse entero
 * aunque todo venga del caché. Recién entonces se desvanece y arranca el reloj
 * de la intro de la nube (partículas sueltas → ΚΛΙΖΣΝ).
 *
 * Sin html.intro (llegó con #ancla, reduced-motion, páginas legales) no hay
 * pantalla de carga: todo cuenta como listo desde el principio.
 * ⚠️ Cada pieza DEBE avisar con `cargado()` también cuando falla; si alguna se
 * queda colgada, el tope de 9 s abre la página de todos modos.
 */
const pendientes = new Set(['nube', 'cinta', 'fuentes', 'kai', 'resto', 'medios']);
const TOTAL = pendientes.size;
const MINIMO = 2600; // ms (el logo tarda ~1.9 s en dibujarse letra por letra)
const TOPE = 9000;
const inicio = typeof performance !== 'undefined' ? performance.now() : 0;
const espera = [];
let listo = typeof document === 'undefined' || !document.documentElement.classList.contains('intro');
let cita = 0;

// El armado de index.html (Kai pone el logo pieza por pieza). Si no está —un
// error en ese script— se cae a la carga simple: desvanecer.
const armado = () => (typeof window !== 'undefined' ? window.__carga : null);

function cerrar() {
  if (listo) return;
  listo = true;
  clearTimeout(cita);
  // (Kai.css: el Kai de verdad espera a esta clase para aparecer; antes se veía encima de la carga)
  document.documentElement.classList.add('cargado');
  const el = document.getElementById('carga');
  if (el && !armado()) {
    el.style.setProperty('--p', '1');
    el.classList.add('is-fuera');
    setTimeout(() => el.remove(), 900);
  }
  espera.splice(0).forEach((cb) => cb());
}

// Ya llegó todo. Con el armado, ÉL decide cuándo abrir: termina de poner las
// piezas, Kai se sienta y en ese instante llama a cerrar() y el logo vuela a la
// barra. Sin armado, la carga simple con su mínimo de siempre.
function terminar() {
  if (listo || cita) return;
  const a = armado();
  if (a) {
    a.fin(cerrar);
    cita = setTimeout(cerrar, 6000); // por si el armado se trabara
    return;
  }
  const falta = MINIMO - (performance.now() - inicio);
  if (falta > 0) cita = setTimeout(cerrar, falta);
  else cerrar();
}

/** Marca una pieza como lista ('nube' | 'cinta' | 'fuentes' | 'kai' | 'resto' | 'medios') */
export function cargado(nombre) {
  try { performance.mark(`carga:${nombre}`); } catch { /* sin Performance API */ }
  if (listo || !pendientes.delete(nombre)) return;
  const p = (TOTAL - pendientes.size) / TOTAL;
  document.getElementById('carga')?.style.setProperty('--p', String(p));
  armado()?.progreso(p);
  if (!pendientes.size) terminar();
}

export const cargaLista = () => listo;

/**
 * Trae por adelantado lo que la página usa más abajo, para que nada "brinque"
 * al llegar: imágenes (se piden y se DECODIFICAN) y, en escritorio, el código de
 * las escenas 3D que se cargan por partes. Avisa 'medios' pase lo que pase.
 */
const IMAGENES = [
  '/demos/alma.webp',
  '/demos/atlas.webp',
  '/demos/hoja.webp',
  '/demos/dalia.webp',
  '/demos/raiz.webp',
  '/demos/bisagra.webp',
  '/testimonios/befit-poster.jpg',
  '/testimonios/tito-poster.jpg',
  '/logos/befit-mark.png',
  '/logos/tito.png',
];
export function precargar() {
  if (listo) return;
  const imagen = (src) =>
    new Promise((ok) => {
      const img = new Image();
      img.onload = () => (img.decode ? img.decode().then(ok, ok) : ok());
      img.onerror = ok;
      img.src = src;
    });
  const tareas = IMAGENES.map(imagen);
  if (window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
    tareas.push(import('./elenco'), import('./telefono'));
  }
  tareas.push(import('./marmol'));
  Promise.allSettled(tareas).then(() => cargado('medios'));
}

// Respaldo: si algo se atora (red lenta, sin WebGL raro), no dejar al visitante esperando
// Tope: algo no avisó. Se da por cargado (con el armado, Kai termina el logo rápido y abre).
if (!listo) setTimeout(() => { pendientes.clear(); armado()?.progreso(1); terminar(); }, TOPE);
