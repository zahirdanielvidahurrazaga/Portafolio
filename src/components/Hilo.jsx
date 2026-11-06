import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLang } from '../lib/LangContext';
import { hilo as puente, SUELTA } from '../lib/hiloPuente';
import '../styles/Hilo.css';

/**
 * EL HILO KAIZEN (2026-11-06). Lo que queda de la cinta después del telón: un
 * hilo que recorre la página de Testimonios al "¿Empezamos?" y se va DIBUJANDO
 * con el scroll — la punta va siempre un poco abajo de la mitad de la pantalla,
 * como una pluma. Es lo que hace que la web se lea como un solo recorrido y no
 * como bloques sueltos (referencias: el tubo de lusion.co, "One Thread" de
 * ysuriadesign.co; la materia y el concepto son nuestros: mejora continua).
 *
 * Reglas:
 *  - Vive en COORDENADAS DE PÁGINA (un SVG del alto del documento, detrás del
 *    contenido): sube y baja con la página, no flota.
 *  - Viaja por los MÁRGENES y cruza de lado solo en los huecos entre secciones.
 *    Nunca detrás de un titular (la cinta brillante detrás del texto lo volvía
 *    ilegible, 2026-10-05).
 *  - En PROCESO baja como ESCALERA: un escalón por paso, y cada número se
 *    enciende cuando la punta llega (clase `hilo-on` en la fila).
 *  - Termina en la Κ del "¿Empezamos?": la punta entra donde se arma la Κ.
 * La ruta se mide del DOM (offsetTop, NO getBoundingClientRect: las filas
 * entran con un translateY de framer-motion y moverían los escalones) y se
 * rehace cuando cambia el alto de la página o el idioma.
 * Con reduced-motion: el hilo se ve completo, sin dibujarse.
 */

// Distancia de la página (px) al elemento, ignorando transforms
const topDe = (el) => {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
};
const leftDe = (el) => {
  let x = 0;
  for (let n = el; n; n = n.offsetParent) x += n.offsetLeft;
  return x;
};
const caja = (sel) => {
  const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
  if (!el) return null;
  const top = topDe(el);
  return { el, top, bottom: top + el.offsetHeight, left: leftDe(el), width: el.offsetWidth };
};

// Dónde va la punta respecto a la pantalla (0 = arriba, 1 = abajo)
const PUNTA = 0.62;
// Largo (px) del tramo brillante detrás de la punta
const ESTELA = 260;

/**
 * Puntos de la ruta en px de página, en ÁNGULOS RECTOS (vertical por los
 * márgenes, horizontal solo en el hueco entre dos secciones); `trazo()` les
 * redondea las esquinas. Una curva libre (Catmull-Rom) se pasaba por encima
 * del texto al cruzar de lado. null si falta alguna sección.
 */
function ruta(vw, vh) {
  const test = caja('#testimonios');
  const demos = caja('#demos');
  const port = caja('#portfolio');
  const nos = caja('#sobre-mi');
  const proc = caja('#process');
  const faq = caja('#faq');
  const k = caja('.interludio--k');
  if (!test || !demos || !port || !nos || !proc || !faq || !k) return null;

  const movil = vw < 900;
  // Márgenes: a medio camino entre la orilla y la retícula de 1280. A la
  // derecha un poco más adentro para no pisar la barra de scroll.
  const L = movil ? 7 : Math.max(14, (vw - 1280) / 4);
  const R = movil ? vw - 7 : vw - Math.max(56, (vw - 1280) / 4 + 16);
  const P = [];
  const p = (x, y, luz) => P.push({ x, y, luz });

  // El hilo DIBUJA EL FILETE de cada capítulo (6-nov, "más protagonismo"): en vez de
  // cruzar en el hueco entre secciones, cruza a lo ancho JUSTO sobre la línea de
  // "ETIQUETA ——— Nº 0X" de su SectionHead, y alterna de lado capítulo a capítulo.
  const filete = (c) => {
    const r = c.el.querySelector('.sh-rule');
    return r ? topDe(r) + r.offsetHeight - 0.5 : c.top + 40;
  };
  // Testimonios: entra desde fuera por la derecha, sobre su filete, y baja por la izquierda
  p(vw + 40, filete(test));
  p(L, filete(test));
  // Demos: izquierda → derecha
  p(L, filete(demos));
  p(R, filete(demos));
  // Proyectos: derecha → izquierda
  p(R, filete(port));
  p(L, filete(port));
  // Nosotros: izquierda → derecha
  p(L, filete(nos));
  p(R, filete(nos));
  // NOSOTROS: baja por el margen derecho junto a la bio y, en escritorio, entra
  // por la RANURA del centro entre las dos mitades del estudio (las une: un solo
  // equipo); sale por arriba de la frase hacia el margen derecho.
  const mit = caja('.nos-mitades');
  const frase = caja('.nos-frase');
  if (mit && frase && !movil) {
    const cx = mit.left + mit.width / 2;
    const yArriba = mit.top - 34; // entre el kicker y el filete de las mitades
    p(R, yArriba);
    p(cx, yArriba);
    p(cx, frase.top - 44);
    p(R, frase.top - 44);
  }
  // (En celular sigue por el margen izquierdo hasta Proceso)

  // PROCESO: escalera en la columna de los números, a la derecha del número
  const filas = [...proc.el.querySelectorAll('.process-row')].map(caja);
  let x = R;
  if (filas.length) {
    // El número es un item de grid (ocupa toda su columna): la escalera se mide
    // desde el TÍTULO — el último escalón queda 36px a su izquierda
    const tit = caja(filas[0].el.querySelector('h3'));
    const paso = movil ? 0 : 24;
    const x0 = movil ? L : tit.left - 36 - (filas.length - 1) * paso;
    const yEntra = filas[0].top - 34;
    // Baja por el margen en el que venía hasta arriba de la lista
    p(P[P.length - 1].x, yEntra);
    filas.forEach((f, i) => {
      const xi = x0 + i * paso;
      if (i === 0) p(xi, yEntra);
      else p(xi, f.top); // el escalón: sobre el filete de la fila
      p(xi, f.top + 26, f.el); // aquí llega la punta: se enciende el paso
      x = xi;
      if (i < filas.length - 1 && paso) p(xi, filas[i + 1].top);
    });
  }

  // Proceso → FAQ: baja del último escalón al filete de Preguntas y lo recorre
  // hacia la izquierda; al final, al centro: donde se arma la Κ
  p(x, filete(faq));
  p(L, filete(faq));
  const forma = k.el.querySelector('.interludio-forma');
  const fy = forma ? forma.offsetTop : vh * 0.3;
  const yK = k.top + Math.max(20, fy * 0.35);
  p(L, yK);
  p(vw / 2, yK);
  p(vw / 2, k.top + fy + (forma ? forma.offsetHeight * 0.1 : 0));
  // Sin puntos repetidos (rompen el redondeo)
  return P.filter((q, i) => i === 0 || Math.hypot(q.x - P[i - 1].x, q.y - P[i - 1].y) > 0.5 || q.luz);
}

// Polilínea con esquinas redondeadas (radio R_ESQ, o menos si el tramo es corto)
const R_ESQ = 46;
function trazo(P) {
  const f = (n) => n.toFixed(1);
  let d = `M${f(P[0].x)},${f(P[0].y)}`;
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1];
    const b = P[i];
    const c = P[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y);
    const l2 = Math.hypot(c.x - b.x, c.y - b.y);
    if (l1 < 0.5 || l2 < 0.5) {
      d += ` L${f(b.x)},${f(b.y)}`;
      continue;
    }
    const r = Math.min(R_ESQ, l1 / 2, l2 / 2);
    const p1x = b.x + ((a.x - b.x) / l1) * r;
    const p1y = b.y + ((a.y - b.y) / l1) * r;
    const p2x = b.x + ((c.x - b.x) / l2) * r;
    const p2y = b.y + ((c.y - b.y) / l2) * r;
    d += ` L${f(p1x)},${f(p1y)} Q${f(b.x)},${f(b.y)} ${f(p2x)},${f(p2y)}`;
  }
  const z = P[P.length - 1];
  return `${d} L${f(z.x)},${f(z.y)}`;
}

export default function Hilo() {
  const svgRef = useRef(null);
  const reduced = useReducedMotion();
  const { lang } = useLang();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const trazos = [...svg.querySelectorAll('.hilo-trazo')];
    const punta = svg.querySelector('.hilo-punta');
    const estela = svg.querySelector('.hilo-estela');
    const base = trazos[0];

    let largo = 0;
    let muestras = []; // { len, y (máximo acumulado), x, yReal }
    let luces = []; // { el, len }
    let raf = 0;

    const construir = () => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const P = ruta(vw, vh);
      if (!P) {
        svg.style.display = 'none';
        return;
      }
      svg.style.display = '';
      // Medir SIN el hilo: si no, su alto anterior sostiene el documento y la página
      // nunca se encoge (al cerrar una pregunta del FAQ, enviar el formulario…)
      svg.style.height = '0px';
      const alto = document.documentElement.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${vw} ${alto}`);
      svg.style.height = `${alto}px`;
      const d = trazo(P);
      trazos.forEach((t) => t.setAttribute('d', d));
      estela.setAttribute('d', d);
      largo = base.getTotalLength();
      // Tabla largo → y, con la y como máximo acumulado: "hasta dónde llega el
      // hilo cuando la punta está a esta altura" (las curvas pueden subir un poco)
      muestras = [];
      let maxY = -Infinity;
      const N = Math.max(200, Math.ceil(largo / 6));
      for (let i = 0; i <= N; i++) {
        const len = (largo * i) / N;
        const pt = base.getPointAtLength(len);
        maxY = Math.max(maxY, pt.y);
        muestras.push({ len, y: maxY, x: pt.x, yReal: pt.y });
      }
      // Cada paso del proceso se enciende en el largo donde la ruta pasa por su punto
      luces = P.filter((q) => q.luz).map((q) => {
        let mejor = 0;
        let dist = Infinity;
        for (const m of muestras) {
          const dd = Math.hypot(m.x - q.x, m.yReal - q.y);
          if (dd < dist) {
            dist = dd;
            mejor = m.len;
          }
        }
        return { el: q.luz, len: mejor };
      });
      trazos.forEach((t) => (t.style.strokeDasharray = `${largo} ${largo + 10}`));
      pintar();
    };

    // Largo dibujado para una altura de punta (búsqueda binaria en la tabla)
    const largoEn = (y) => {
      if (!muestras.length || y <= muestras[0].y) return 0;
      let lo = 0;
      let hi = muestras.length - 1;
      if (y >= muestras[hi].y) return largo;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (muestras[mid].y < y) lo = mid;
        else hi = mid;
      }
      const a = muestras[lo];
      const b = muestras[hi];
      const f = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
      return a.len + (b.len - a.len) * f;
    };

    // CIERRE: progreso del estallido según la escena de la Κ (misma pista que
    // usa la nube). Arranca cuando la punta ya llegó a su lugar.
    const kEl = document.querySelector('.interludio--k');
    const estallidoEn = () => {
      if (!kEl || reduced) return 0;
      const r = kEl.getBoundingClientRect();
      const q = -r.top / Math.max(1, r.height - window.innerHeight);
      const x = Math.min(1, Math.max(0, (q + 0.2) / 0.34));
      return x * x * (3 - 2 * x);
    };
    // Tramo final que se vuelve partículas (de largo − TRAMO a la punta)
    const tramo = () => Math.min(largo, window.innerHeight * 1.2);
    const publicar = (sy) => {
      const T = tramo();
      const desde = largo - T;
      const k0 = muestras.findIndex((m) => m.len >= desde);
      if (k0 < 0) return;
      const sel = muestras.slice(k0);
      const n = Math.min(240, sel.length);
      if (puente.pts.length !== n * 2) puente.pts = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        const m = sel[Math.floor((i * (sel.length - 1)) / Math.max(1, n - 1))];
        puente.pts[i * 2] = m.x;
        puente.pts[i * 2 + 1] = m.yReal - sy;
      }
      puente.n = n;
      puente.listo = true;
    };

    const pintar = () => {
      raf = 0;
      if (!largo) return;
      const sy = window.scrollY;
      const est = estallidoEn();
      puente.estallido = est;
      publicar(sy);
      // El hilo se consume de la punta hacia atrás al mismo paso en que se
      // sueltan las partículas (ver SUELTA en hiloPuente.js)
      const consumido = tramo() * Math.min(1, est / SUELTA);
      const len = Math.min(
        reduced ? largo : largoEn(sy + window.innerHeight * PUNTA),
        largo - consumido
      );
      const off = largo - len;
      trazos.forEach((t) => (t.style.strokeDashoffset = `${off}`));
      // Estela: solo los últimos ESTELA px antes de la punta, mientras dibuja
      const cola = Math.min(ESTELA, len);
      estela.style.strokeDasharray = `0 ${Math.max(0, len - cola)} ${cola} ${largo + 10}`;
      estela.style.opacity = len > 1 && len < largo - 1 && !reduced && est === 0 ? '1' : '0';
      if (len > 1 && len < largo - 1 && !reduced && est === 0) {
        const pt = base.getPointAtLength(len);
        punta.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
        punta.classList.add('is-on');
      } else {
        punta.classList.remove('is-on');
      }
      for (const l of luces) l.el.classList.toggle('hilo-on', reduced || len >= l.len);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    let t = 0;
    const reconstruir = () => {
      clearTimeout(t);
      t = setTimeout(construir, 120);
    };

    construir();
    const ro = new ResizeObserver(reconstruir);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', reconstruir);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', reconstruir);
      for (const l of luces) l.el.classList.remove('hilo-on');
    };
  }, [reduced, lang]);

  return (
    <svg ref={svgRef} className="hilo" aria-hidden="true" preserveAspectRatio="none">
      {/* Halo suave + cuerpo + filo de luz = un tubo con luz propia, como la cinta.
          La ESTELA es el tramo brillante justo detrás de la punta (no se dibuja
          con los demás: su dash se calcula aparte en pintar). */}
      <path className="hilo-trazo hilo-aura" />
      <path className="hilo-trazo hilo-cuerpo" />
      <path className="hilo-trazo hilo-brillo" />
      <path className="hilo-estela" />
      <g className="hilo-punta">
        <circle className="hilo-halo" r="16" />
        <circle className="hilo-nucleo" r="4.5" />
      </g>
    </svg>
  );
}
