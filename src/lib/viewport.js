/**
 * Medidas de pantalla ESTABLES para los canvas fijos (nube, cinta).
 *
 * En el celular la barra de direcciones aparece/desaparece al deslizar y eso
 * dispara `resize` con un `innerHeight` distinto. Si cada canvas WebGL hace
 * setSize() en ese momento, el navegador re-aloca el lienzo a mitad del gesto
 * → el hero se trababa. Solución: los canvas miden 100lvh (el alto con la
 * barra escondida, que NO cambia al deslizar) y solo se redimensionan cuando
 * cambia el ancho o ese alto (giro de pantalla, ventana de escritorio).
 */

export const esTactil =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** En celular el lienzo pesa mucho: tope de resolución para materiales pesados */
export const movil = typeof window !== 'undefined' && (esTactil || window.innerWidth < 768);

let sonda = null;
function getSonda() {
  if (sonda) return sonda;
  sonda = document.createElement('div');
  const lvh = typeof CSS !== 'undefined' && CSS.supports?.('height', '100lvh');
  sonda.style.cssText = `position:fixed;top:0;left:0;width:0;height:${lvh ? '100lvh' : '100vh'};visibility:hidden;pointer-events:none`;
  document.body.appendChild(sonda);
  return sonda;
}

/** Ancho y alto "grande" de la pantalla (el mismo que usa el CSS 100lvh) */
export function medidaEstable() {
  return {
    w: window.innerWidth || 1,
    h: getSonda().offsetHeight || window.innerHeight || 1,
  };
}

/** Como addEventListener('resize'), pero ignora la barra del navegador. Devuelve el des-suscriptor. */
export function alRedimensionar(cb) {
  let { w, h } = medidaEstable();
  const onResize = () => {
    const m = medidaEstable();
    if (m.w === w && m.h === h) return;
    w = m.w;
    h = m.h;
    cb(m);
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}
