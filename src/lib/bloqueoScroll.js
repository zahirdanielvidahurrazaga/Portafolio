/**
 * PAUSA DEL SCROLL mientras Kai habla (11-nov-2026, pedido de Zahir: si se
 * sigue bajando, su frase —y su voz— se corta a la mitad).
 * Igual que la pantalla de carga, NO toca overflow ni usa lenis.stop() (en
 * Safari eso rompe los position:sticky): se ignoran rueda y teclas, en captura,
 * antes que Lenis. No bloquea los links del menú ni la barra de scroll: quien
 * quiera irse, puede.
 *
 * REGLAS (segunda vuelta, 11-nov: "en algunas partes se queda trabado"). Quién
 * frena lo decide Kai.jsx; aquí solo está el mecanismo:
 *  · La pausa no congela la página donde caiga: la LLEVA a `destino` (la cabecera
 *    del capítulo bien puesta, con Kai y su globo completos) y ahí espera.
 *  · Solo tiene sentido si el visitante venía bajando con rueda o teclas
 *    (`vieneDeScroll`): si llegó por un link del menú o arrastrando la barra, un
 *    freno a medio camino lo dejaba varado en el primer capítulo que cruzaba.
 *  · El dedo (touchmove) ya NO se frena: en un celular el gesto en curso no se puede
 *    cancelar, así que el freno solo se sentía después, como pantalla que no responde.
 */
const TECLAS = { ' ': 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, Home: 1, End: 1 };
const RECIENTE = 1600; // ms: la inercia de Lenis sigue ~1.15 s después del último golpe de rueda
let hasta = 0;
let ultimo = -1e9; // último golpe de rueda o tecla de scroll
let instalado = false;

// Las teclas de scroll son del formulario, de un botón o de un link si el foco está ahí
// (el "Callar" del propio Kai): no cuentan como scroll (lo cachó Codex)
const enControl = (t) =>
  t instanceof Element && !!t.closest('input, textarea, select, button, a, [contenteditable], [role="button"]');

/** Se instala al cargar Kai (no al primer freno): hay que saber de dónde venía el visitante */
export function vigilarScroll() {
  if (instalado || typeof window === 'undefined') return;
  instalado = true;
  const alScroll = (e) => {
    if (e.type === 'keydown' && (!TECLAS[e.key] || enControl(e.target))) return;
    // dentro de un modal no se frena nada
    if (document.body.classList.contains('pm-open')) return;
    ultimo = performance.now();
    if (ultimo >= hasta) return;
    e.preventDefault();
    e.stopPropagation();
  };
  for (const tipo of ['wheel', 'keydown']) {
    window.addEventListener(tipo, alScroll, { passive: false, capture: true });
  }
  // Un clic (link del menú, índice de Servicios, la barra de scroll): lo que se mueva
  // después ya no es "venía bajando"
  window.addEventListener('pointerdown', () => { ultimo = -1e9; }, { passive: true, capture: true });
}

/** ¿El visitante venía moviendo la página con rueda o teclas? */
export function vieneDeScroll() {
  return performance.now() - ultimo < RECIENTE;
}

/**
 * Frena el scroll durante `ms` (un nuevo llamado reemplaza al anterior).
 * Con `destino` (px), la página se desliza hasta ahí y ahí espera; sin él, se queda donde está.
 */
export function bloquearScroll(ms, destino = null) {
  vigilarScroll();
  hasta = performance.now() + ms;
  const lenis = window.__lenis;
  if (!lenis) return;
  if (destino == null) {
    // Lenis trae inercia: se le dice "ya llegaste" para que la página no siga resbalando
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  } else {
    lenis.scrollTo(destino, { duration: 0.9, force: true });
  }
}

/** Cambia cuánto falta de un freno EN CURSO, sin mover la página (no hace nada si ya se soltó) */
export function alargarBloqueo(ms) {
  if (performance.now() < hasta) hasta = performance.now() + ms;
}

export function soltarScroll() {
  hasta = 0;
}
