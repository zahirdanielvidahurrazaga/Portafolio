import * as THREE from 'three';
import { TONOS, entornoEstudio } from './cromo';
import { cinta, RELEVO, fase, progresoApertura } from './cintaPuente';
import { medidaEstable, alRedimensionar, movil } from './viewport';

/**
 * Cinta 3D del hero (inspirada en el tubo de lusion.co).
 *
 * FORMA DETERMINISTA, LIGADA AL SCROLL. La cinta no tiene "memoria": su forma
 * es una función de (tiempo, progreso de scroll). Así, al bajar avanza y al
 * subir regresa EXACTAMENTE por el mismo camino, en reversa, como en Lusion.
 *
 * - Estado A (hero): una serpiente que vaga sola. La cabeza recorre una curva
 *   de Lissajous y el cuerpo es ese mismo recorrido unos instantes atrás
 *   (punto i = curva(t − i·LAG)), así que el cuerpo sigue a la cabeza sin física.
 * - Estado B (TELÓN, 2026-10-26): la cinta se endereza en una banda diagonal,
 *   se viene al frente y ENGORDA hasta tapar toda la pantalla; ya tapada,
 *   sube y sale por arriba destapando Servicios. Un corte de capítulo hecho
 *   con la misma materia (cromo / grafito). Antes salía por un arco a la
 *   derecha y Servicios aparecía desconectado; también se probaron disolverla
 *   en partículas, dibujar las figuras y subrayar el índice: no le gustaron.
 * - El progreso p va de 0 (arriba del todo) a 1 (encabezado de "Qué puedo
 *   construir…" centrado en pantalla). La cinta acompaña al scroll mientras se
 *   desenrolla y sale; al subir vuelve a entrar por el mismo camino.
 *
 * DELANTE / DETRÁS DEL TITULAR: se pinta en DOS canvas fijos con la misma
 * cámara, uno debajo del contenido y otro encima. Un plano de recorte en z = 0
 * reparte el tubo: z < 0 sale en el de abajo y z > 0 en el de arriba; las dos
 * mitades coinciden en pantalla y la cinta "atraviesa" las letras. En A el
 * recorrido en z va cargado hacia atrás (pasa delante ~30% del tiempo); en B
 * va detrás.
 * Cada canvas tiene su propio contexto WebGL y su propio mapa de entorno: una
 * textura de un contexto no sirve en el otro.
 *
 * LISTÓN (2026-11-11, "poténcialo"): ya no es un tubo. La sección es una elipse
 * aplanada que se RETUERCE a lo largo y con el tiempo (malla propia: anillos
 * de RAD vértices sobre los marcos de la curva), refleja un entorno de estudio
 * con cajas de luz largas (cromo.js) y esa luz la recorre con el tiempo y el
 * scroll (`scene.environmentRotation`). En el TELÓN vuelve a ser redonda: así
 * sigue tapando toda la pantalla con el mismo radio de antes.
 *
 * Material: cromo hueso en oscuro y grafito brillante en claro (paleta mármol).
 * Ahorro: se pausa y se oculta en cuanto termina de salir (p = 0.5) o la
 * pestaña está oculta; limita el DPR. Con prefers-reduced-motion no anima por
 * tiempo: solo se acomoda cuando hay scroll.
 * Devuelve null si no hay WebGL.
 */

const N = 90; // puntos del cuerpo
const LAG = 0.07; // separación en "tiempo" entre puntos del cuerpo
const FOV = 35;
const CAM_Z = 10;

const smooth = (x) => x * x * (3 - 2 * x);
const suave5 = (x) => x * x * x * (x * (x * 6 - 15) + 10); // arranca y llega aún más suave
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function makeLayer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  const env = entornoEstudio(renderer);
  return { canvas, renderer, env };
}

/**
 * @param backCanvas  canvas detrás del contenido
 * @param frontCanvas canvas encima del contenido
 * @param opts.heroEl  sección del hero (estado A)
 * @param opts.nextEl  al centrarse este elemento la cinta ya salió (p = 1)
 * @param opts.onVisible(bool) avisa cuándo mostrar/ocultar los canvas
 * @param opts.openEl  sección de APERTURA (ΚΛΙΖΣΝ en partículas) que va antes
 *   del hero: la cinta nace de esas partículas (ver cintaPuente.js) y hasta
 *   entonces es invisible. Sin ella, la cinta se ve desde el principio.
 */
export function createHeroRibbon(
  backCanvas,
  frontCanvas,
  { theme = 'dark', heroEl, nextEl, openEl, onVisible } = {}
) {
  let layers;
  try {
    layers = [
      { ...makeLayer(backCanvas), plane: new THREE.Plane(new THREE.Vector3(0, 0, -1), 0) },
      { ...makeLayer(frontCanvas), plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) },
    ];
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 6);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAM_Z;

  // Celular: sin la capa de barniz (clearcoat), que casi duplica el costo del
  // shader a pantalla completa; el metal y sus reflejos se quedan
  const material = new THREE.MeshPhysicalMaterial({ clearcoat: movil ? 0 : 1, clearcoatRoughness: 0.08 });
  const setTheme = (t) => {
    const p = TONOS[t] || TONOS.dark;
    material.color.set(p.color);
    material.metalness = p.metalness;
    material.roughness = p.roughness;
    baseRough = p.roughness;
    material.envMapIntensity = p.envMapIntensity;
  };
  let baseRough = 0.14;
  setTheme(theme);

  // Malla del listón: SEG tramos a lo largo × RAD vértices por anillo (cada
  // anillo cierra sobre sí mismo). Los índices se arman una vez; las posiciones
  // se reescriben en cada cuadro. Celular: menos de todo (se ve igual de lisa).
  const SEG = movil ? 120 : 220;
  const RAD = movil ? 14 : 26;
  const geo = new THREE.BufferGeometry();
  const posA = new Float32Array((SEG + 1) * RAD * 3);
  const norA = new Float32Array((SEG + 1) * RAD * 3);
  const centros = new Float32Array((SEG + 1) * 3);
  const COS = Float32Array.from({ length: RAD }, (_, j) => Math.cos((j / RAD) * Math.PI * 2));
  const SEN = Float32Array.from({ length: RAD }, (_, j) => Math.sin((j / RAD) * Math.PI * 2));
  geo.setAttribute('position', new THREE.BufferAttribute(posA, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('normal', new THREE.BufferAttribute(norA, 3).setUsage(THREE.DynamicDrawUsage));
  {
    const idx = [];
    for (let i = 0; i < SEG; i++) {
      for (let j = 0; j < RAD; j++) {
        const a = i * RAD + j;
        const b = i * RAD + ((j + 1) % RAD);
        idx.push(a, a + RAD, b, b, a + RAD, b + RAD);
      }
    }
    geo.setIndex(idx);
  }
  const tube = new THREE.Mesh(geo, material);
  tube.frustumCulled = false;
  scene.add(tube);

  // Medidas del mundo visible en el plano z = 0 (se recalculan al redimensionar)
  let W = 1;
  let H = 1;
  let vw = 1;
  let vh = 1;
  let radius = 0.16;

  const resize = () => {
    ({ w: vw, h: vh } = medidaEstable());
    for (const { renderer } of layers) {
      // Celular: el metal con clearcoat a pantalla completa, dos veces por
      // cuadro, es lo más caro del hero → tope 1.25 (a esa densidad no se nota)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, movil ? 1.25 : 1.75));
      renderer.setSize(vw, vh, false);
    }
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    H = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    W = H * camera.aspect;
    // En pantallas angostas el tubo se haría enorme respecto al ancho
    radius = Math.min(H, W * 1.4) * 0.026;
  };

  // px de pantalla (eje y hacia abajo) → unidades del mundo (eje y hacia arriba)
  const toWorldY = (yPx) => -(yPx - vh / 2) * (H / vh);

  // Estado A: punto de la serpiente en el instante u
  const wander = (u, out) =>
    out.set(
      W * 0.4 * Math.sin(u * 0.31 + Math.sin(u * 0.17) * 1.2),
      H * 0.34 * Math.sin(u * 0.43 + 1.3) + H * 0.04 * Math.sin(u * 1.1),
      // Cargado hacia atrás: solo los picos pasan de z = 0 (delante del texto)
      1.7 * Math.sin(u * 0.27) - 0.75
    );

  // TELÓN: banda diagonal (≈22°) de cinta. o = desplazamiento perpendicular
  // del eje (0 = centro de pantalla, + = hacia arriba). Larga de sobra para
  // que sus puntas nunca se vean. zc > 0: la silueta cae en el canvas de
  // ENFRENTE y tapa el contenido.
  const DIR = new THREE.Vector2(Math.cos(0.38), Math.sin(0.38));
  const NRM = new THREE.Vector2(-DIR.y, DIR.x);
  const ZC = 0.3;
  const telon = (s, t, o, out) => {
    const L = (W + H) * 2.2;
    const u = (s - 0.5) * L;
    // Una ondulación larga y suave: que se lea cinta, no tubo
    const ola = H * 0.06 * Math.sin(s * Math.PI * 2 + t * 0.4);
    return out.set(
      DIR.x * u + NRM.x * (o + ola),
      DIR.y * u + NRM.y * (o + ola),
      ZC
    );
  };
  // Medio ancho de la pantalla medido a lo largo de la normal de la banda, en
  // el plano de la banda (con perspectiva): con un radio mayor, la tapa toda
  const medioAncho = () => {
    const f = (CAM_Z - ZC) / CAM_Z;
    return ((W * f * Math.abs(NRM.x) + H * f * Math.abs(NRM.y)) / 2);
  };

  const pts = Array.from({ length: N }, () => new THREE.Vector3());
  const P = new THREE.Vector3();
  const ANCHO = 1.15; // cuánto más ancho que el tubo de antes (×2.15). Con 1.5 tapaba demasiado titular al cruzar por delante
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();

  // Progreso de scroll y anclas, medidos del DOM real en cada cuadro. El hero
  // es un escenario fijo de varias pantallas (Hero.jsx): p arranca cuando se
  // SUELTA (su fondo llega al fondo de la pantalla).
  const measure = () => {
    const sy = window.scrollY;
    const hero = heroEl.getBoundingClientRect();
    const next = nextEl.getBoundingClientRect();
    const releaseY = hero.top + sy + Math.max(0, hero.height - vh);
    const nextCenterPage = next.top + next.height / 2 + sy;
    const travel = Math.max(1, nextCenterPage - vh / 2 - releaseY); // scroll para centrarlo
    const p = clamp01((sy - releaseY) / travel);
    // Progreso del escenario fijo (0…1): el telón empieza a prepararse en su último 10%
    const qh = clamp01(-hero.top / Math.max(1, hero.height - vh));
    // Nacimiento: 0 mientras las partículas siguen siendo letras, 1 ya sólida
    const q = progresoApertura(openEl, vh);
    const born = q === null ? 1 : fase(q, RELEVO.cruce);
    return {
      p,
      qh,
      born,
      // A se queda fija al centro de la pantalla: acompaña al scroll mientras sale
      anchorA: toWorldY(vh / 2),
    };
  };

  let born = 1;
  let bornCss = '';
  let medioA = radius; // medio ancho de la sección
  let medioC = radius; // medio canto
  let satin = 0; // 0 = cromo pulido (hero) … 1 = satinado (telón: reflejos anchos y suaves)
  let liston = 1; // 1 = listón plano que se retuerce, 0 = sin giro (telón)
  let tiempo = 0;
  // Cuánto va retorcido el listón en el punto s (lo usan la malla y el destino de las partículas)
  const giroEn = (s) => (s * 7.5 + tiempo * 0.32) * liston;
  const shape = (t) => {
    tiempo = t;
    const m = measure();
    const { p, anchorA } = m;
    born = m.born;
    // TELÓN (rehecho 11-nov: "salta de la nada"). Ya no arranca al soltarse el
    // hero: se PREPARA en el último 10% del escenario, mientras el titular se va.
    // τ = ese tramo (0 → 0.2) + p (0 = el hero se suelta, 1 = título de Servicios
    // centrado). Sobre τ: la serpiente se estira en banda diagonal → deja de
    // retorcerse → ENSANCHA hasta tapar (sigue tapando antes de que asome el
    // título de Servicios, p ≈ 0.26) → sube y destapa. Todo con arranque y
    // llegada suaves (suave5), para que sea un solo gesto.
    const tau = smooth(clamp01((m.qh - 0.9) / 0.1)) * 0.2 + p;
    const e = suave5(clamp01(tau / 0.24)); // de serpiente a banda
    const crece = suave5(clamp01((tau - 0.14) / 0.32)); // ensancha: tapa todo en τ 0.46
    const sube = suave5(clamp01((p - 0.5) / 0.4)); // 0.50 → 0.90 se va
    const ha = medioAncho();
    const rMax = ha * 1.12;
    liston = 1 - suave5(clamp01((tau - 0.06) / 0.26)); // deja de retorcerse mientras ensancha
    // Sección: listón (ancho × canto) → al tapar, un óvalo gordo (no un tubo redondo:
    // sus reflejos son más anchos y tranquilos)
    medioA = radius * (1 + liston * ANCHO) + (rMax - radius) * crece;
    medioC = radius * (1 - liston * 0.72) + (rMax * 0.55 - radius) * crece;
    satin = crece;
    const o = sube * (ha + rMax) * 1.15;
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      wander(t - i * LAG, a);
      a.y += anchorA;
      telon(s, t, o, b);
      pts[i].lerpVectors(a, b, e);
    }
  };

  const draw = () => {
    // La opacidad la decide el relevo con la nube (variable en el CSS)
    const b = born.toFixed(3);
    if (b !== bornCss) {
      bornCss = b;
      for (const { canvas } of layers) canvas.style.setProperty('--born', b);
    }
    if (born <= 0) {
      for (const { renderer } of layers) renderer.clear();
      return;
    }
    for (const { renderer, env, plane } of layers) {
      scene.environment = env;
      material.clippingPlanes = [plane];
      renderer.render(scene, camera);
    }
  };

  const rebuild = () => {
    // Antes de nacer la cinta no se dibuja: solo hace falta publicar su recorrido
    if (born <= 0) {
      publicar();
      return;
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    // Centros de cada anillo (parámetro uniforme: los puntos ya van parejos)
    for (let i = 0; i <= SEG; i++) {
      curve.getPoint(i / SEG, P);
      centros[i * 3] = P.x;
      centros[i * 3 + 1] = P.y;
      centros[i * 3 + 2] = P.z;
    }
    // MARCOS PROPIOS (11-nov): antes `computeFrenetFrames`, que elige su normal
    // inicial según la componente más chica de la primera tangente; cuando esa
    // componente cambiaba, TODA la cinta giraba de golpe (los "saltos"). Ahora
    // cada anillo saca su marco de una referencia fija (el eje Z, hacia la
    // cámara): lado ancho = perpendicular a la tangente dentro de la pantalla.
    for (let i = 0; i <= SEG; i++) {
      const s = i / SEG;
      const i0 = Math.max(0, i - 1) * 3;
      const i1 = Math.min(SEG, i + 1) * 3;
      let tx = centros[i1] - centros[i0];
      let ty = centros[i1 + 1] - centros[i0 + 1];
      let tz = centros[i1 + 2] - centros[i0 + 2];
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl;
      ty /= tl;
      tz /= tl;
      // V = Z sin su parte a lo largo de la tangente (el canto, hacia la cámara)
      let vx = -tz * tx;
      let vy = -tz * ty;
      let vz = 1 - tz * tz;
      const vl = Math.hypot(vx, vy, vz) || 1;
      vx /= vl;
      vy /= vl;
      vz /= vl;
      // U = T × V (el ancho, dentro de la pantalla)
      const ux = ty * vz - tz * vy;
      const uy = tz * vx - tx * vz;
      const uz = tx * vy - ty * vx;
      // Puntas redondeadas (antes eran dos esferas); en el telón no se ven
      const borde = Math.max(0, (Math.abs(s * 2 - 1) - 0.94) / 0.06);
      const punta = Math.sqrt(Math.max(0, 1 - borde * borde));
      const giro = giroEn(s);
      const cg = Math.cos(giro);
      const sg = Math.sin(giro);
      const cx = centros[i * 3];
      const cy = centros[i * 3 + 1];
      const cz = centros[i * 3 + 2];
      for (let j = 0; j < RAD; j++) {
        const x = COS[j] * medioA * punta;
        const y = SEN[j] * medioC * punta;
        const a2 = x * cg - y * sg;
        const b2 = x * sg + y * cg;
        const k = (i * RAD + j) * 3;
        posA[k] = cx + ux * a2 + vx * b2;
        posA[k + 1] = cy + uy * a2 + vy * b2;
        posA[k + 2] = cz + uz * a2 + vz * b2;
        // Normal de la elipse, girada igual (sin recalcular toda la malla en cada cuadro)
        const nx0 = COS[j] / medioA;
        const ny0 = SEN[j] / medioC;
        const na = nx0 * cg - ny0 * sg;
        const nb = nx0 * sg + ny0 * cg;
        let nx = ux * na + vx * nb;
        let ny = uy * na + vy * nb;
        let nz = uz * na + vz * nb;
        const nl = Math.hypot(nx, ny, nz) || 1;
        norA[k] = nx / nl;
        norA[k + 1] = ny / nl;
        norA[k + 2] = nz / nl;
      }
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.normal.needsUpdate = true;
    // Telón: de cromo pulido a satinado (los filos duros de luz se vuelven degradados)
    material.roughness = baseRough + satin * 0.24;
    material.clearcoatRoughness = 0.08 + satin * 0.34;
    // La luz recorre el metal: el estudio gira con el tiempo y con el scroll
    scene.environmentRotation.set(0, tiempo * 0.22 + window.scrollY * 0.0022, 0);
    publicar();
  };

  // Recorrido proyectado a pantalla para la nube (solo hace falta antes de nacer)
  const proy = new THREE.Vector3();
  const publicar = () => {
    if (!openEl || born >= 1) return;
    if (cinta.pts.length !== N * 3) cinta.pts = new Float32Array(N * 3);
    // La matriz de la cámara solo se actualiza al renderizar, y mientras la
    // cinta no ha nacido NO se renderiza: sin esto project() da basura.
    camera.updateMatrixWorld();
    const pxPorUnidad = vh / H;
    for (let i = 0; i < N; i++) {
      proy.copy(pts[i]).project(camera);
      cinta.pts[i * 3] = ((proy.x + 1) / 2) * vw;
      cinta.pts[i * 3 + 1] = ((1 - proy.y) / 2) * vh;
      // Perspectiva: más cerca de la cámara (z mayor) se ve más gruesa
      // Medio ancho QUE SE VE del listón en ese punto: ancho de cara, angosto de canto
      // (antes se publicaba el radio del tubo viejo y las partículas armaban un tubo
      // antes de volverse listón)
      const g = giroEn(i / (N - 1));
      const visto = Math.hypot(medioA * Math.cos(g), medioC * Math.sin(g));
      cinta.pts[i * 3 + 2] = visto * pxPorUnidad * (CAM_Z / (CAM_Z - pts[i].z));
    }
    cinta.n = N;
    cinta.listo = true;
  };

  resize();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let running = false;
  let inRange = true;
  let last = performance.now();
  let t = 4; // fase inicial: la curva arranca en una zona bonita

  const render = () => {
    shape(t);
    rebuild();
    draw();
  };

  const frame = (now) => {
    t += Math.min((now - last) / 1000, 1 / 20);
    last = now;
    render();
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reduced || !inRange || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Rango activo: mientras el telón no haya salido del todo (p < 0.9)
  const checkRange = () => {
    const now = measure().p < 0.9;
    if (now !== inRange) {
      inRange = now;
      onVisible?.(inRange);
      if (inRange) start();
      else {
        // Pintar la pose final (fuera de pantalla) antes de parar: con un
        // salto de scroll se quedaba congelado un cuadro intermedio.
        render();
        stop();
      }
    }
    if (reduced && inRange) render();
  };

  const onScroll = () => checkRange();
  const onResize = () => {
    resize();
    if (!running) render();
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  window.addEventListener('scroll', onScroll, { passive: true });
  const quitarResize = alRedimensionar(onResize);
  document.addEventListener('visibilitychange', onVisibility);

  // Compilar los shaders del metal YA (detrás de la pantalla de carga). Antes se
  // compilaban la primera vez que la cinta nacía, a media apertura: el tirón
  // justo antes de que se armara el titular.
  for (const { renderer, env, plane } of layers) {
    scene.environment = env;
    material.clippingPlanes = [plane];
    renderer.compile(scene, camera);
  }

  inRange = measure().p < 0.9;
  onVisible?.(inRange);
  render();
  start();

  return {
    setTheme: (th) => {
      setTheme(th);
      if (!running) draw();
    },
    destroy() {
      stop();
      window.removeEventListener('scroll', onScroll);
      quitarResize();
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      material.dispose();
      for (const { renderer, env } of layers) {
        env.dispose();
        renderer.dispose();
      }
    },
  };
}
