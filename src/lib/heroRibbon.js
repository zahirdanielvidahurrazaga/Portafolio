import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cinta, RELEVO, fase, progresoApertura } from './cintaPuente';

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
 * - Estado B (salida): un arco fuera de pantalla por la derecha.
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
 * Material: cromo hueso en oscuro y grafito brillante en claro (paleta mármol).
 * Ahorro: se pausa y se oculta en cuanto termina de salir (p = 0.5) o la
 * pestaña está oculta; limita el DPR. Con prefers-reduced-motion no anima por
 * tiempo: solo se acomoda cuando hay scroll.
 * Devuelve null si no hay WebGL.
 */

const TONOS = {
  dark: { color: '#efeae0', metalness: 1, roughness: 0.14, envMapIntensity: 1.25 },
  light: { color: '#3a3734', metalness: 0.85, roughness: 0.2, envMapIntensity: 1.1 },
};

const N = 90; // puntos del cuerpo
const LAG = 0.07; // separación en "tiempo" entre puntos del cuerpo
const FOV = 35;
const CAM_Z = 10;

const smooth = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function makeLayer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
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

  const material = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.08 });
  const setTheme = (t) => {
    const p = TONOS[t] || TONOS.dark;
    material.color.set(p.color);
    material.metalness = p.metalness;
    material.roughness = p.roughness;
    material.envMapIntensity = p.envMapIntensity;
  };
  setTheme(theme);

  const tube = new THREE.Mesh(new THREE.BufferGeometry(), material);
  const capGeo = new THREE.SphereGeometry(1, 32, 16);
  const capHead = new THREE.Mesh(capGeo, material);
  const capTail = new THREE.Mesh(capGeo, material);
  scene.add(tube, capHead, capTail);

  // Medidas del mundo visible en el plano z = 0 (se recalculan al redimensionar)
  let W = 1;
  let H = 1;
  let vw = 1;
  let vh = 1;
  let radius = 0.16;

  const resize = () => {
    vw = window.innerWidth || 1;
    vh = window.innerHeight || 1;
    for (const { renderer } of layers) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
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

  // Estado B: SALIDA. La cinta se estira en un arco suave que queda fuera de
  // pantalla ARRIBA a la derecha, así que al bajar se desenrolla y se va hacia
  // arriba —en sentido contrario al título de Servicios, que sube desde abajo,
  // para no cruzarlo nunca—; al subir regresa. Se probaron una ola, una órbita y un ∞ anclados a Servicios
  // (2026-10-05) y se descartaron: la cinta brillante detrás del título
  // blanco lo hacía ilegible.
  const salida = (s, t, out) =>
    out.set(
      W * 0.3 + s * W * 0.9,
      H * 0.62 + s * H * 0.25 + H * 0.03 * Math.sin(s * 6 + t * 0.8),
      -1 - s * 0.6
    );

  const pts = Array.from({ length: N }, () => new THREE.Vector3());
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
    // Nacimiento: 0 mientras las partículas siguen siendo letras, 1 ya sólida
    const q = progresoApertura(openEl, vh);
    const born = q === null ? 1 : fase(q, RELEVO.cruce);
    return {
      p,
      born,
      // A se queda fija al centro de la pantalla: acompaña al scroll mientras sale
      anchorA: toWorldY(vh / 2),
    };
  };

  let born = 1;
  const shape = (t) => {
    const m = measure();
    const { p, anchorA } = m;
    born = m.born;
    // Termina de salir a la mitad del recorrido: el título de Servicios apenas
    // va entrando por abajo y la pantalla ya está limpia.
    const e = smooth(clamp01(p / 0.5));
    // La profundidad se va atrás MUCHO antes que la forma: en cuanto empieza el
    // scroll la cinta deja de pasar por delante de nada.
    const ez = smooth(clamp01(p / 0.12));
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      wander(t - i * LAG, a);
      a.y += anchorA;
      salida(s, t, b);
      pts[i].lerpVectors(a, b, e);
      pts[i].z = a.z + (b.z - a.z) * ez;
    }
  };

  const draw = () => {
    // La opacidad la decide el relevo con la nube (variable en el CSS)
    for (const { canvas } of layers) canvas.style.setProperty('--born', born.toFixed(3));
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
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 200, radius, 20, false);
    tube.geometry.dispose();
    tube.geometry = geo;
    capHead.position.copy(pts[0]);
    capTail.position.copy(pts[N - 1]);
    capHead.scale.setScalar(radius);
    capTail.scale.setScalar(radius);
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
      cinta.pts[i * 3 + 2] = radius * pxPorUnidad * (CAM_Z / (CAM_Z - pts[i].z));
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

  // Rango activo: mientras la cinta no haya salido del todo (p < 0.5)
  const checkRange = () => {
    const now = measure().p < 0.5;
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
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  inRange = measure().p < 0.5;
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
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      tube.geometry.dispose();
      capGeo.dispose();
      material.dispose();
      for (const { renderer, env } of layers) {
        env.dispose();
        renderer.dispose();
      }
    },
  };
}
