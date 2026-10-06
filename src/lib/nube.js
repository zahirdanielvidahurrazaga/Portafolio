import * as THREE from 'three';
import { cinta, RELEVO, fase } from './cintaPuente';

/**
 * LA NUBE: un solo sistema de partículas, fijo detrás de todo el sitio, que
 * hila la página como una presentación (inspirado en lusion.co/about).
 *
 * - En las secciones normales NO SE VE (Zahir no quiso polvo por todo el
 *   sitio): las partículas solo existen cuando forman algo. Su posición de
 *   "polvo" sigue calculándose porque es de donde vienen y a donde se van.
 * - PANTALLA DE CARGA (html.intro, la pone index.html): al abrir solo hay
 *   partículas sueltas por toda la pantalla, en movimiento; luego se arma ΚΛΙΖΣΝ y recién ahí aparece el resto
 *   del sitio (se quita html.intro). Ver INTRO.
 * - En cada "estación" (un <Interludio data-nube="forma">) el polvo se ARMA en
 *   una forma (ΚΛΙΖΣΝ, un teléfono, la Κ…), se queda mientras se lee la frase y
 *   luego EXPLOTA de vuelta a polvo.
 * - APERTURA (la primera estación, modo "apertura"): al cargar, el polvo se
 *   arma solo en ΚΛΙΖΣΝ; al bajar, las partículas viajan hasta la cinta 3D
 *   (que publica su recorrido en cintaPuente.js) y se apagan mientras la cinta
 *   se solidifica. Polvo → marca → materia.
 *
 * FORMA DETERMINISTA, igual que la cinta: la posición de cada partícula es
 * f(tiempo, scroll). Sin física ni memoria → al subir todo regresa en reversa.
 *
 * Coordenadas: cámara ortográfica en px CSS (0,0 = centro de la pantalla). Las
 * formas se muestrean dibujándolas en un canvas 2D del tamaño de su caja
 * (.interludio-forma), así el layout del DOM decide dónde y qué tan grandes.
 * Las posiciones se calculan en CPU (3–7 mil partículas sobra) y se suben cada
 * cuadro. Devuelve null si no hay WebGL.
 */

const TONOS = {
  dark: { color: '#ece8df', blending: THREE.AdditiveBlending },
  light: { color: '#1d1d1f', blending: THREE.NormalBlending },
};

// Pantalla de carga (segundos desde que arranca la nube)
const INTRO = { nube: 1.3, armado: 1.8, listo: 2.9 };

const smooth = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Formas ──────────────────────────────────────────────────────────────
   Cada una dibuja en un contexto 2D ya escalado a su viewBox. Trazos un poco
   más gruesos que en el SVG original: en partículas, un trazo fino se ve ralo. */
const FORMAS = {
  // Wordmark ΚΛΙΖΣΝ (mismo trazo que KaizenWordmark.jsx)
  kaizen: {
    box: [-8, -10, 498, 120],
    draw(ctx) {
      ctx.lineWidth = 17;
      ctx.lineJoin = 'miter';
      for (const d of [
        'M7 0V100 M66 0 12 54 M30 37 70 100',
        'M92 100 132 6 172 100',
        'M201 0V100',
        'M230 7H300L230 93H300',
        'M388 7H322L360 50 322 93H388',
        'M417 100V7L473 93V0',
      ]) ctx.stroke(new Path2D(d));
    },
  },
  // Teléfono con el "plano" de una app (misma geometría que KaizenReel)
  telefono: {
    box: [640, 170, 320, 640],
    draw(ctx) {
      ctx.lineWidth = 9;
      ctx.stroke(
        new Path2D(
          'M698 180H902A48 48 0 0 1 950 228V752A48 48 0 0 1 902 800H698A48 48 0 0 1 650 752V228A48 48 0 0 1 698 180Z'
        )
      );
      ctx.lineWidth = 5;
      const r = (x, y, w, h, rr) => {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, rr);
        ctx.stroke();
      };
      r(680, 232, 240, 40, 10);
      r(680, 292, 240, 150, 14);
      r(680, 462, 112, 112, 14);
      r(808, 462, 112, 112, 14);
      // Gráfica dentro de la tarjeta grande
      [38, 62, 50, 84, 104].forEach((h, i) => ctx.fillRect(702 + i * 44, 428 - h, 28, h));
      // Botón lleno
      ctx.beginPath();
      ctx.roundRect(680, 600, 240, 60, 30);
      ctx.fill();
    },
  },
  // ── Nosotros: las dos mitades del estudio (se funden luego en "telefono") ──
  // Izquierda (I · diseño): un lápiz terminando de trazar un boceto.
  // Derecha (II · ingeniería): </>. Centradas en x≈250 y x≈760 de la caja,
  // que en SobreMi.css tiene la misma proporción 1000×480.
  mitades: {
    box: [0, 0, 1000, 480],
    draw(ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Boceto: una pantalla a mano alzada y el trazo que va dejando el lápiz
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.roundRect(90, 70, 230, 160, 18);
      ctx.stroke();
      ctx.lineWidth = 6;
      ctx.stroke(new Path2D('M120 120H250 M120 152H220 M120 184H270'));
      ctx.lineWidth = 7;
      ctx.stroke(new Path2D('M90 330C140 290 170 370 220 330S300 300 330 320'));
      // Lápiz: cuerpo a 45°, la punta toca el final del trazo (330, 320)
      ctx.save();
      ctx.translate(330, 320);
      ctx.rotate(-Math.PI / 4);
      ctx.lineWidth = 7;
      ctx.stroke(new Path2D('M0 0L34 -18H190V18H34Z'));
      ctx.fill(new Path2D('M0 0L14 -7V7Z'));
      ctx.stroke(new Path2D('M160 -18V18'));
      ctx.restore();
      // </>
      ctx.lineWidth = 26;
      ctx.stroke(new Path2D('M700 130L610 240L700 350 M860 130L950 240L860 350 M805 100L755 380'));
    },
  },
  // ── Servicios (escena Índice + nube): una figura por línea de KaiZen ──
  // Brand: la plumilla de la herramienta "pluma" de diseño, con su curva
  pluma: {
    box: [0, 0, 300, 300],
    draw(ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 9;
      // Curva bezier con sus dos manijas, como en un programa de diseño
      ctx.stroke(new Path2D('M20 250C60 120 120 300 170 210'));
      ctx.lineWidth = 5;
      ctx.stroke(new Path2D('M20 250L52 168 M170 210L222 262'));
      for (const [x, y] of [[52, 168], [222, 262]]) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      // Plumilla (la punta toca el final de la curva)
      ctx.save();
      ctx.translate(170, 210);
      ctx.rotate(-Math.PI / 4.6);
      ctx.lineWidth = 9;
      ctx.stroke(new Path2D('M0 0L-46 -80L-28 -170H28L46 -80Z'));
      ctx.stroke(new Path2D('M0 0V-92'));
      ctx.beginPath();
      ctx.arc(0, -100, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillRect(-30, -196, 60, 20);
      ctx.restore();
    },
  },
  // Social: globo de conversación con un corazón (un "me gusta")
  social: {
    box: [0, 0, 300, 280],
    draw(ctx) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = 10;
      ctx.stroke(new Path2D('M60 20H240A40 40 0 0 1 280 60V170A40 40 0 0 1 240 210H120L62 262V210H60A40 40 0 0 1 20 170V60A40 40 0 0 1 60 20Z'));
      ctx.fill(
        new Path2D('M150 176C96 138 82 112 92 88C102 64 136 62 150 88C164 62 198 64 208 88C218 112 204 138 150 176Z')
      );
    },
  },
  // Launch: cohete despegando
  cohete: {
    box: [0, 0, 260, 320],
    draw(ctx) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = 10;
      ctx.stroke(new Path2D('M130 12C188 60 198 140 178 214H82C62 140 72 60 130 12Z'));
      ctx.beginPath();
      ctx.arc(130, 100, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.stroke(new Path2D('M84 160L40 236L84 222 M176 160L220 236L176 222'));
      // Fuego
      ctx.fill(new Path2D('M100 226Q130 320 160 226Z'));
    },
  },
  // Ventana de navegador con un sitio dentro
  navegador: {
    box: [0, 0, 340, 250],
    draw(ctx) {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(6, 6, 328, 238, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, 46);
      ctx.lineTo(334, 46);
      ctx.stroke();
      for (const x of [30, 52, 74]) {
        ctx.beginPath();
        ctx.arc(x, 26, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(110, 15, 190, 22, 11);
      ctx.stroke();
      // Titular, texto e imagen del "sitio"
      ctx.fillRect(30, 72, 150, 20);
      ctx.fillRect(30, 104, 120, 9);
      ctx.fillRect(30, 122, 135, 9);
      ctx.beginPath();
      ctx.roundRect(30, 150, 90, 30, 15);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(200, 70, 112, 150, 12);
      ctx.stroke();
    },
  },
  // Carrito de compra
  carrito: {
    box: [0, 0, 250, 220],
    draw(ctx) {
      ctx.lineWidth = 9;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(new Path2D('M14 30H52L82 146H206L232 62H64'));
      ctx.lineWidth = 6;
      ctx.stroke(new Path2D('M100 90H200 M108 118H192'));
      for (const x of [98, 190]) {
        ctx.beginPath();
        ctx.arc(x, 186, 15, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.stroke();
      }
    },
  },
  // IA: destello de cuatro puntas con dos más chicos
  ia: {
    box: [0, 0, 260, 260],
    draw(ctx) {
      const estrella = (cx, cy, r) =>
        new Path2D(
          `M${cx} ${cy - r}Q${cx + r * 0.12} ${cy - r * 0.12} ${cx + r} ${cy}Q${cx + r * 0.12} ${cy + r * 0.12} ${cx} ${cy + r}Q${cx - r * 0.12} ${cy + r * 0.12} ${cx - r} ${cy}Q${cx - r * 0.12} ${cy - r * 0.12} ${cx} ${cy - r}Z`
        );
      ctx.fill(estrella(112, 140, 104));
      ctx.fill(estrella(212, 52, 38));
      ctx.fill(estrella(218, 214, 24));
    },
  },
  // Ícono Κ (mismo que el favicon)
  k: {
    box: [0, 0, 100, 100],
    draw(ctx) {
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.roundRect(2, 2, 96, 96, 22);
      ctx.stroke();
      ctx.lineWidth = 12;
      ctx.stroke(new Path2D('M33 27V73 M66 27 38 52 M48 44 68 73'));
    },
  },
};

/** Puntos (x, y relativos al centro, px CSS) que llenan la forma en una caja w×h */
function muestrear(nombre, w, h) {
  const f = FORMAS[nombre];
  if (!f || w < 4 || h < 4) return new Float32Array(0);
  const cw = Math.ceil(w);
  const ch = Math.ceil(h);
  const cv = document.createElement('canvas');
  cv.width = cw;
  cv.height = ch;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const [bx, by, bw, bh] = f.box;
  const s = Math.min(cw / bw, ch / bh);
  ctx.translate((cw - bw * s) / 2, (ch - bh * s) / 2);
  ctx.scale(s, s);
  ctx.translate(-bx, -by);
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#000';
  f.draw(ctx);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts = [];
  const paso = 2;
  for (let y = 0; y < ch; y += paso) {
    for (let x = 0; x < cw; x += paso) {
      if (data[(y * cw + x) * 4 + 3] > 110) pts.push(x - cw / 2, y - ch / 2);
    }
  }
  // Ordenados por ÁNGULO alrededor del centro (no al azar): la partícula i va
  // a la fracción i/N de cada forma, así que al pasar de una forma a otra
  // (secuencia de Servicios) viaja a la parte equivalente y la figura se
  // tuerce de una a otra en vez de volverse una bola a la mitad.
  const n = pts.length / 2;
  const orden = Array.from({ length: n }, (_, i) => i);
  const ang = (i) => Math.atan2(pts[2 * i + 1], pts[2 * i]);
  const angs = orden.map(ang);
  orden.sort((a, b) => angs[a] - angs[b]);
  const out = new Float32Array(n * 2);
  orden.forEach((j, i) => {
    out[2 * i] = pts[2 * j];
    out[2 * i + 1] = pts[2 * j + 1];
  });
  return out;
}


/**
 * @param canvas canvas fijo a pantalla completa
 * @param opts.theme 'dark' | 'light'
 */
export function createNube(canvas, { theme = 'dark' } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  const movil = vw < 768;
  // Celular: 5000 (antes 3200 y las figuras se veían ralas). Un teléfono actual
  // mueve esto sin problema: el cálculo es lineal y solo corre con forma en pantalla.
  const N = movil ? 5000 : 7000;
  const rand = mulberry32(20261005);

  // Semillas por partícula (constantes)
  const ax = new Float32Array(N);
  const ay = new Float32Array(N);
  const dep = new Float32Array(N); // profundidad: lejos (0.2) … cerca (1)
  const ph = new Float32Array(N);
  const sp = new Float32Array(N);
  const jx = new Float32Array(N);
  const jy = new Float32Array(N);
  const burst = new Float32Array(N);
  const sizes = new Float32Array(N);
  const cs = new Float32Array(N); // lugar a lo largo de la cinta (0…1)
  const cang = new Float32Array(N); // lugar alrededor del tubo
  for (let i = 0; i < N; i++) {
    cs[i] = rand();
    cang[i] = rand() * Math.PI * 2;
    ax[i] = rand();
    ay[i] = rand();
    dep[i] = 0.2 + 0.8 * rand() ** 1.6;
    ph[i] = rand() * Math.PI * 2;
    sp[i] = 0.5 + rand();
    jx[i] = (rand() - 0.5) * 1.6;
    jy[i] = (rand() - 0.5) * 1.6;
    burst[i] = 0.3 + rand() ** 2 * 1.2;
    sizes[i] = 1 + 2.4 * dep[i];
  }

  const pos = new Float32Array(N * 3);
  const alpha = new Float32Array(N);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(TONOS.dark.color) },
      uPR: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      attribute float aSize;
      uniform float uPR;
      varying float vAlpha;
      varying float vPx;
      void main() {
        vAlpha = aAlpha;
        gl_PointSize = aSize * uPR;
        vPx = gl_PointSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      varying float vPx;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        // Borde de ~1 píxel FÍSICO, sea cual sea el tamaño del punto. Antes era
        // un difuminado fijo (0.15→0.5) que en pantallas chicas se comía casi
        // todo el punto y en celular se veían manchitas en vez de puntos.
        float borde = min(0.35, 1.2 / vPx);
        float a = smoothstep(0.5, 0.5 - borde, d) * vAlpha;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
  });
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.OrthographicCamera(-vw / 2, vw / 2, vh / 2, -vh / 2, -10, 10);

  const setTheme = (t) => {
    const tono = TONOS[t] || TONOS.dark;
    material.uniforms.uColor.value.set(tono.color);
    material.blending = tono.blending;
    material.needsUpdate = true;
  };
  setTheme(theme);

  const resize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    // Resolución real de la pantalla (iPhone = 3×). Con tope en 2 el lienzo se
    // estiraba 1.5× y las partículas se veían borrosas en el celular.
    const pr = Math.min(window.devicePixelRatio || 1, 3);
    renderer.setPixelRatio(pr);
    renderer.setSize(vw, vh, false);
    material.uniforms.uPR.value = pr;
    camera.left = -vw / 2;
    camera.right = vw / 2;
    camera.top = vh / 2;
    camera.bottom = -vh / 2;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  // Estaciones: se leen del DOM. data-nube = una forma, o varias separadas por
  // coma (modo "secuencia": se transforman una en otra SIN explotar, ver
  // Servicios.jsx). Las muestras se guardan por forma y se rehacen si cambia el
  // tamaño de la caja.
  const leerEstaciones = () =>
    [...document.querySelectorAll('[data-nube]')].map((el) => ({
      el,
      caja: el.querySelector('.interludio-forma'),
      formas: el.dataset.nube.split(','),
      apertura: el.dataset.nubeModo === 'apertura',
      secuencia: el.dataset.nubeModo === 'secuencia',
      cache: {},
    }));
  let estaciones = leerEstaciones();
  // Si React cambia las escenas (recarga en caliente al editar, o una sección
  // que se monta después), se vuelven a leer. Sin esto la nube seguía buscando
  // escenas que ya no existían y la nueva no se dibujaba.
  let releer = 0;
  const mo = new MutationObserver(() => {
    clearTimeout(releer);
    releer = setTimeout(() => {
      const n = document.querySelectorAll('[data-nube]');
      const cambio = n.length !== estaciones.length || estaciones.some((st, i) => st.el !== n[i]);
      if (cambio) estaciones = leerEstaciones();
    }, 150);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  const muestra = (st, nombre, c) => {
    const m = st.cache[nombre];
    if (m && Math.abs(c.width - m.w) <= 2 && Math.abs(c.height - m.h) <= 2) return m.pts;
    const pts = muestrear(nombre, c.width, c.height);
    st.cache[nombre] = { pts, w: c.width, h: c.height };
    return pts;
  };

  // Qué estación manda ahora y en qué fase (a = armado, e = explosión). Las
  // estaciones están lejos entre sí: nunca hay dos activas a la vez.
  const estado = (t) => {
    let mejor = null;
    for (const st of estaciones) {
      const r = st.el.getBoundingClientRect();
      const travel = Math.max(1, r.height - vh);
      const q = -r.top / travel; // 0 = se fija arriba, 1 = se suelta
      if (st.apertura) {
        if (q > 1.05) continue;
        // Se arma sola al cargar (por tiempo); luego manda el scroll
        mejor = {
          st,
          a: smooth(clamp01((t - inicioArmado) / duracionArmado)),
          e: 0,
          // Lineal: cada partícula le aplica su propio retraso (ola) y suavizado
          flujo: clamp01((q - RELEVO.flujo[0]) / (RELEVO.flujo[1] - RELEVO.flujo[0])),
          cruce: fase(q, RELEVO.cruce),
        };
        break;
      }
      if (st.secuencia) {
        // Se arma al entrar, recorre sus formas mientras está fija y explota
        // cuando la escena ya se va soltando
        const a = fase(q, [-0.2, 0.05]);
        const e = fase(q, [1, 1.2]);
        if (!(a > 0 && e < 1)) continue;
        const n = st.formas.length;
        const u = clamp01(q) * n * 0.99999;
        const j = Math.floor(u);
        // Cada tramo: la forma se sostiene y en su último 38% se vuelve la siguiente
        const m = j < n - 1 ? smooth(clamp01((u - j - 0.62) / 0.38)) : 0;
        mejor = { st, a, e, fa: st.formas[j], fb: st.formas[Math.min(j + 1, n - 1)], m };
        break;
      }
      const a = smooth(clamp01((q + 0.3) / 0.42));
      const e = smooth(clamp01((q - 0.66) / 0.36));
      if (a > 0 && e < 1) {
        mejor = { st, a, e };
        break;
      }
    }
    if (!mejor) return null;
    const { st } = mejor;
    const c = st.caja.getBoundingClientRect();
    const pts = muestra(st, mejor.fa || st.formas[0], c);
    const ptsB = mejor.m > 0 ? muestra(st, mejor.fb, c) : null;
    // Centro de la caja en coordenadas de la cámara (y hacia arriba)
    return {
      ...mejor,
      pts,
      ptsB,
      w: c.width,
      cx: c.left + c.width / 2 - vw / 2,
      cy: vh / 2 - (c.top + c.height / 2),
    };
  };

  // Con pantalla de carga la nube gira un rato antes de armarse; sin ella (llegó
  // con #ancla, o reduced-motion quitó la clase) se arma enseguida.
  const conIntro = document.documentElement.classList.contains('intro');
  const inicioArmado = conIntro ? INTRO.nube : 0.1;
  const duracionArmado = conIntro ? INTRO.armado : 1.2;
  let introPendiente = conIntro;
  let limpio = false; // ya se borró el canvas (no hay nada que dibujar)

  let raf = 0;
  const t0 = performance.now();

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const t = (now - t0) / 1000;
    if (introPendiente && t >= INTRO.listo) {
      introPendiente = false;
      document.documentElement.classList.remove('intro');
    }
    const sy = window.scrollY;
    const est = estado(t);
    const M = est ? est.pts.length / 2 : 0;
    const MB = est && est.ptsB ? est.ptsB.length / 2 : 0;
    // Sin forma en pantalla no hay nada que ver: no se calcula ni se dibuja
    if (!est || M === 0) {
      if (!limpio) {
        renderer.clear();
        limpio = true;
      }
      return;
    }
    limpio = false;
    const H = vh * 1.3;
    // Partículas sueltas de la pantalla de carga (solo antes de que se arme ΚΛΙΖΣΝ)
    const nubeAl = 0.85 * smooth(clamp01(t / 0.8));

    for (let i = 0; i < N; i++) {
      const d = dep[i];
      // Polvo (invisible fuera de la apertura): de aquí vienen y aquí regresan
      // las formas. Deriva en dos frecuencias para que se vea vivo, no en órbita.
      let x =
        ax[i] * vw * 1.1 -
        vw * 0.55 +
        Math.sin(t * 0.13 * sp[i] + ph[i]) * 40 * d +
        Math.sin(t * 0.55 * sp[i] + ay[i] * 7) * 34 * d;
      let yy =
        (ay[i] * H -
          sy * 0.25 * d +
          Math.cos(t * 0.11 * sp[i] + ph[i]) * 30 * d +
          Math.cos(t * 0.47 * sp[i] + ax[i] * 7) * 28 * d) %
        H;
      if (yy < 0) yy += H;
      let y = vh / 2 + vh * 0.15 - yy;
      let al = est.st.apertura ? nubeAl * (0.35 + 0.65 * d) : 0;

      if (est && M > 0) {
        // Fracción i/N de la forma (ver muestrear: puntos ordenados por ángulo)
        const k = Math.floor((i * M) / N) * 2;
        let px = est.pts[k];
        let py = est.pts[k + 1];
        // Secuencia: de esta forma a la siguiente, en curva (sin pasar por polvo)
        if (MB > 0) {
          const kb = Math.floor((i * MB) / N) * 2;
          const dx = est.ptsB[kb] - px;
          const dy = est.ptsB[kb + 1] - py;
          const g = Math.sin(Math.PI * est.m) * 0.35 * (burst[i] - 0.6);
          px += dx * est.m - dy * g;
          py += dy * est.m + dx * g;
        }
        // Punto destino en la forma (+ un temblor mínimo, como si respirara)
        const fx = est.cx + px + jx[i] + Math.sin(t * 1.3 + ph[i]) * 0.9;
        const fy = est.cy - py + jy[i] + Math.cos(t * 1.1 + ph[i]) * 0.9;
        const { a, e } = est;
        if (e > 0) {
          // Explosión: de la forma hacia el polvo, empujada hacia afuera del centro
          let dx = fx - est.cx;
          let dy = fy - est.cy;
          const len = Math.hypot(dx, dy) || 1;
          dx /= len;
          dy /= len;
          const empuje = Math.sin(Math.PI * e) * 320 * burst[i];
          x = fx + (x - fx) * e + dx * empuje;
          y = fy + (y - fy) * e + dy * empuje;
          // Se apaga rápido: sin "polvo" regado sobre la sección siguiente
          al = al + (0.92 - al) * (1 - e) * (1 - e);
        } else {
          // Armado: del polvo a la forma, en curva (no en línea recta)
          const vx = fx - x;
          const vy = fy - y;
          const giro = Math.sin(Math.PI * a) * 0.35 * (burst[i] - 0.6);
          x = x + vx * a - vy * giro;
          y = y + vy * a + vx * giro;
          // Se encienden ya cerca de la forma (a²): de lejos casi no se ven
          al = al + (0.92 - al) * a * a;
        }
        // Apertura: de las letras a la superficie de la cinta, y se apagan
        // mientras la cinta aparece
        if (est.st.apertura) {
          if (est.flujo > 0 && cinta.listo && M > 0) {
            const u = cs[i] * (cinta.n - 1);
            const j = Math.min(cinta.n - 2, Math.floor(u));
            const fr = u - j;
            const P = cinta.pts;
            const x0 = P[j * 3];
            const y0 = P[j * 3 + 1];
            const x1 = P[j * 3 + 3];
            const y1 = P[j * 3 + 4];
            const rr = P[j * 3 + 2] + (P[j * 3 + 5] - P[j * 3 + 2]) * fr;
            let nx = y0 - y1;
            let ny = x1 - x0;
            const nl = Math.hypot(nx, ny) || 1;
            // Ancho visible del tubo: desplazamiento perpendicular ∈ [−r, r]
            const off = rr * Math.cos(cang[i]) * 0.95 / nl;
            nx *= off;
            ny *= off;
            const cxp = x0 + (x1 - x0) * fr + nx - vw / 2;
            const cyp = vh / 2 - (y0 + (y1 - y0) * fr + ny);
            // Ola de izquierda a derecha: las letras se sueltan en orden
            const ola = clamp01((est.pts[k] + est.w / 2) / (est.w || 1)) * 0.4;
            const f = smooth(clamp01((est.flujo - ola) / 0.6));
            const vx = cxp - x;
            const vy = cyp - y;
            const giro = Math.sin(Math.PI * f) * 0.25 * (burst[i] - 0.6);
            x = x + vx * f - vy * giro;
            y = y + vy * f + vx * giro;
          }
          al *= 1 - est.cruce;
        }
      }
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      alpha[i] = al;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setTheme,
    destroy() {
      cancelAnimationFrame(raf);
      mo.disconnect();
      clearTimeout(releer);
      window.removeEventListener('resize', resize);
      geo.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
