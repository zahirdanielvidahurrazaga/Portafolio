/**
 * PAUSA DEL SCROLL mientras Kai habla (11-nov-2026, pedido de Zahir: si se
 * sigue bajando, su frase —y su voz— se corta a la mitad).
 * Igual que la pantalla de carga, NO toca overflow ni usa lenis.stop() (en
 * Safari eso rompe los position:sticky): se ignoran rueda, dedo y teclas, en
 * captura, antes que Lenis. No bloquea los links del menú ni la barra de
 * scroll: quien quiera irse, puede.
 */
const TECLAS = { ' ': 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, Home: 1, End: 1 };
let hasta = 0;
let instalado = false;

function instalar() {
  if (instalado || typeof window === 'undefined') return;
  instalado = true;
  const frena = (e) => {
    if (performance.now() >= hasta) return;
    if (e.type === 'keydown') {
      if (!TECLAS[e.key]) return;
      // Escribiendo en el formulario, o con el foco en un botón o link (el "Callar" del
      // propio Kai): esas teclas son suyas, no del scroll (lo cachó Codex)
      const t = e.target;
      if (t instanceof Element && t.closest('input, textarea, select, button, a, [contenteditable], [role="button"]')) return;
    }
    // dentro de un modal o del propio globo no se frena nada
    if (document.body.classList.contains('pm-open')) return;
    e.preventDefault();
    e.stopPropagation();
  };
  for (const tipo of ['wheel', 'touchmove', 'keydown']) {
    window.addEventListener(tipo, frena, { passive: false, capture: true });
  }
}

/** Frena el scroll durante `ms` (un nuevo llamado reemplaza al anterior) */
export function bloquearScroll(ms) {
  instalar();
  hasta = performance.now() + ms;
  // Lenis trae inercia: se le dice "ya llegaste" para que la página no siga resbalando
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
}

export function soltarScroll() {
  hasta = 0;
}
