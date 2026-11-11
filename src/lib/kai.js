import * as THREE from 'three';
import { tonoCromo, entornoEstudio } from './cromo';

/**
 * KAI, EL GUÍA (2026-11-11). La idea viene del "Buddy" de adamperlis.com —
 * alguien te habla mientras bajas— con forma propia, hecha de las dos materias
 * de la apertura:
 *  · nace como una nube de PARTÍCULAS alrededor de una cuenta de cromo, y
 *  · con el avance se le pegan hasta quedar una PERLA del cromo de la cinta,
 *    con su ARO (un tramo de cinta que lo orbita).
 * Cara: un visor de vidrio negro con dos ojos de luz. Sin boca ni brazos: se
 * expresa con los ojos, la inclinación y los brincos. Kaizen: de idea suelta a
 * pieza terminada, capítulo por capítulo.
 *
 * DÓNDE VIVE: en los `.kai-lugar` (cajas absolutas de 176 px que NO mueven el
 * layout). Con uno a la vista, Kai se para ahí; si no, espera chico arriba del
 * botón de WhatsApp. Hay de dos tipos:
 *  · de CAPÍTULO (`data-kai="Nº"`, los pone SectionHead a la derecha del
 *    titular): dice la línea del capítulo, y de ellos sale cuánto va formado;
 *  · PARADAS (hero: encaramado en ΚΛΙΖΣΝ y junto a los botones; Servicios:
 *    junto a la hélice, con una línea por servicio — `data-kai` cambia y él lo
 *    nota). `data-kai-talla` lo achica en esa parada. Sin frase, solo está.
 * Está desde que se va la pantalla de carga (index.html trae un Kai de CSS en
 * el mismo lugar). El globo abre hacia el lado con más espacio. En celular
 * nunca deja la esquina: solo habla unos segundos al cambiar de capítulo. Se
 * esconde con un modal abierto.
 *
 * Este archivo no sabe de idiomas ni de audio: pide el texto con `frase(id)` y
 * avisa con `alDecir(id)`; el componente (Kai.jsx) pone la voz y devuelve su
 * volumen con `voz(a)` para que los ojos se muevan al hablar.
 *
 * Gotchas: giros de cabeza cortos (pasado ~35° el visor refleja las cajas de
 * luz y se pierde un ojo); entorno SIN luz de frente (se reflejaba como un
 * cuadro en el visor); el barniz se baja dentro del visor con `clearcoatMap`.
 */

const TAM = 176; // px del lienzo (11-nov: más grande, Zahir lo quiere con más peso)
const CAPITULO = /^\d+$/; // los lugares de capítulo llevan su "Nº"; los demás son paradas (hero, escenas)
const NP = 620;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => x * x * (3 - 2 * x);

/**
 * @param caja    contenedor fijo (.kai)
 * @param canvas  lienzo dentro de la caja
 * @param globo   <p> donde se escribe la frase
 * @param opts.theme 'dark' | 'light'
 * @param opts.frase(id)  → texto del capítulo o de la ocurrencia (en el idioma actual)
 * @param opts.ocurrencias  lista de ids de ocurrencias (al tocarlo)
 * @param opts.alDecir(id | null)  empezó a decir esa frase (null = se calló)
 */
export function createKai(caja, canvas, globo, { theme = 'dark', frase, ocurrencias = [], alDecir } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const PR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(PR);
  renderer.setSize(TAM, TAM, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const env = entornoEstudio(renderer, { frente: false, relleno: 0.055 });
  scene.environment = env;
  const luz = new THREE.DirectionalLight(0xffffff, 1.1);
  luz.position.set(-2, 4, 5);
  scene.add(luz);
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 30);
  camera.position.z = 6.7;

  // ── La cara: el visor va pintado en la textura del cuerpo (negro = vidrio negro) ──
  const pintar = (w, h, fondo, tinta) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const x = c.getContext('2d');
    x.fillStyle = fondo;
    x.fillRect(0, 0, w, h);
    x.fillStyle = tinta;
    const k = w / 1024;
    x.beginPath();
    x.roundRect((256 - 150) * k, (256 - 30 - 84) * k, 300 * k, 168 * k, 84 * k);
    x.fill();
    return new THREE.CanvasTexture(c);
  };
  const visor = pintar(1024, 512, '#fff', '#000');
  visor.colorSpace = THREE.SRGBColorSpace;
  visor.anisotropy = 8;
  const barniz = pintar(512, 256, '#fff', '#3a0000'); // menos barniz en el visor

  const matCuerpo = new THREE.MeshPhysicalMaterial({ map: visor, clearcoat: 1, clearcoatMap: barniz, clearcoatRoughness: 0.06 });
  const matAro = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide });
  const cabeza = new THREE.Group();
  const geoCuerpo = new THREE.SphereGeometry(1, 64, 48);
  const cuerpo = new THREE.Mesh(geoCuerpo, matCuerpo);
  cabeza.add(cuerpo);
  scene.add(cabeza);

  // Ojos: dos píldoras de luz sobre el visor
  const matOjo = new THREE.MeshBasicMaterial({ color: 0xf6f2e8, toneMapped: false });
  const matHalo = new THREE.MeshBasicMaterial({ color: 0xf6f2e8, toneMapped: false, transparent: true, opacity: 0.16, depthWrite: false });
  const geoOjo = new THREE.CapsuleGeometry(0.062, 0.13, 6, 16);
  const mirada = new THREE.Group();
  cabeza.add(mirada);
  const ojos = [-1, 1].map((lado) => {
    const g = new THREE.Group();
    const dir = new THREE.Vector3(Math.sin(lado * 0.27), 0.19, Math.cos(lado * 0.27)).normalize();
    g.position.copy(dir).multiplyScalar(1.006);
    g.lookAt(dir.clone().multiplyScalar(3));
    const o = new THREE.Mesh(geoOjo, matOjo);
    o.scale.z = 0.25;
    const h = new THREE.Mesh(geoOjo, matHalo);
    h.scale.set(1.9, 1.5, 0.2);
    g.add(h, o);
    mirada.add(g);
    return g;
  });

  // El aro: un tramo de cinta que lo orbita
  const geoAro = new THREE.CylinderGeometry(1.34, 1.34, 0.085, 96, 1, true);
  const aro = new THREE.Mesh(geoAro, matAro);
  const ejeAro = new THREE.Group();
  ejeAro.add(aro);
  scene.add(ejeAro);

  // Las partículas (esfera de Fibonacci; el shader las suelta o las pega)
  const geoP = new THREE.BufferGeometry();
  const dir = new Float32Array(NP * 3);
  const seed = new Float32Array(NP * 2);
  for (let i = 0; i < NP; i++) {
    const y = 1 - (i / (NP - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.399963;
    dir[i * 3] = Math.cos(a) * r;
    dir[i * 3 + 1] = y;
    dir[i * 3 + 2] = Math.sin(a) * r;
    seed[i * 2] = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
    seed[i * 2 + 1] = Math.abs((Math.sin(i * 78.233) * 12543.123) % 1);
  }
  geoP.setAttribute('position', new THREE.BufferAttribute(dir, 3));
  geoP.setAttribute('aSeed', new THREE.BufferAttribute(seed, 2));
  const matP = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color('#efeae0') },
      uPR: { value: PR },
      uTime: { value: 0 },
      uF: { value: 0 },
      uCab: { value: 0.4 },
      uViaje: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec2 aSeed;
      uniform float uPR;
      uniform float uTime;
      uniform float uF;
      uniform float uCab;
      uniform float uViaje;
      varying float vAlpha;
      void main() {
        float suelta = 1.0 - uF;
        // cada una se pega a la perla cuando le toca: unas antes, otras después
        float mia = clamp(suelta * 1.6 - aSeed.y * 0.6, 0.0, 1.0);
        float ang = uTime * (0.25 + aSeed.y * 0.6) * (0.35 + suelta);
        float c = cos(ang);
        float s = sin(ang);
        vec3 d = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c);
        d.y += sin(uTime * 0.8 + aSeed.x * 30.0) * 0.06 * mia;
        float r = uCab + 0.03 + mia * (0.22 + aSeed.x * 0.82) + uViaje * (0.3 + aSeed.x * 0.9);
        vec4 mv = modelViewMatrix * vec4(d * r, 1.0);
        gl_PointSize = (1.5 + aSeed.x * 1.5) * uPR * (1.0 + uViaje);
        vAlpha = clamp(mia * 1.5 + uViaje, 0.0, 1.0) * (0.45 + aSeed.y * 0.55);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.25, d) * vAlpha;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor, a);
      }`,
  });
  const nube = new THREE.Points(geoP, matP);
  nube.frustumCulled = false;
  scene.add(nube);

  const setTheme = (t) => {
    const tema = t === 'light' ? 'light' : 'dark';
    tonoCromo(matCuerpo, tema);
    tonoCromo(matAro, tema);
    matP.uniforms.uColor.value.set(tema === 'light' ? '#1d1d1f' : '#efeae0');
  };
  setTheme(theme);

  // ── Hablar ──
  let ocultar = 0;
  let relevo = 0;
  let brinco = -1e6;
  let callado = false;
  let dicho = null; // id de lo que está diciendo (para repetirlo si cambia el idioma)
  const callar = (espera = 0) => {
    clearTimeout(ocultar);
    ocultar = setTimeout(() => {
      caja.classList.remove('kai--habla');
      dicho = null;
      alDecir?.(null);
    }, espera);
  };
  const decir = (id, dura = 0) => {
    const texto = frase?.(id);
    if (!texto || callado) return;
    dicho = id;
    globo.textContent = '';
    texto.split(' ').forEach((palabra, i) => {
      const s = document.createElement('span');
      s.textContent = `${palabra} `;
      s.style.animationDelay = `${0.25 + i * 0.075}s`;
      globo.appendChild(s);
    });
    caja.classList.add('kai--habla');
    brinco = performance.now();
    clearTimeout(ocultar);
    if (dura) callar(dura);
    alDecir?.(id);
  };

  // ── Estado ──
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  // Esquina: el lienzo va a 0.6 → su centro queda sobre el botón de WhatsApp
  const esquinaX = () => vw - 60 - TAM / 2;
  const esquinaY = () => vh - 152 - TAM / 2;
  let x = esquinaX();
  let y = esquinaY();
  let vx = 0;
  let vy = 0;
  let cx = vw / 2;
  let cy = vh / 2;
  let lugares = [];
  let caps = []; // los lugares de capítulo, en orden
  let lugar = null; // el lugar donde está parado (solo escritorio)
  let lugarId = ''; // su data-kai (en Servicios cambia sin cambiar de lugar)
  let capitulo = null; // el último capítulo que empezó
  let nacido = false;
  let giro = -1e6;
  let viaje = -1e6;
  let parpadeo = performance.now() + 2500;
  let formado = 0;
  let volumen = 0;
  let nOcurrencia = 0;
  let nCuadro = 0;
  let raf = 0;
  let antes = performance.now();
  const alMover = (e) => {
    cx = e.clientX;
    cy = e.clientY;
  };
  window.addEventListener('pointermove', alMover, { passive: true });
  const alTocar = () => {
    giro = performance.now();
    if (callado) return;
    if (!ocurrencias.length) return;
    clearTimeout(relevo);
    decir(ocurrencias[nOcurrencia++ % ocurrencias.length], lugar ? 0 : 4600);
    // parado en un capítulo, después de la ocurrencia vuelve a su línea
    if (lugar) relevo = setTimeout(() => lugar && frase?.(lugar.dataset.kai) && decir(lugar.dataset.kai), 4200);
  };
  canvas.addEventListener('click', alTocar);

  const cuadro = (ahora) => {
    raf = requestAnimationFrame(cuadro);
    if (document.hidden) return;
    const dt = Math.min(0.05, (ahora - antes) / 1000) || 0.016;
    antes = ahora;
    const t = ahora / 1000;
    vw = window.innerWidth;
    vh = window.innerHeight;
    const chico = vw < 820;
    // Los capítulos de abajo se montan después (Resto.jsx): se vuelven a buscar cada tanto
    if (nCuadro++ % 40 === 0) {
      lugares = [...document.querySelectorAll('.kai-lugar[data-kai]')];
      caps = lugares.filter((el) => CAPITULO.test(el.dataset.kai));
    }
    if (!lugares.length) return;

    // ¿En qué capítulo vamos y hay un lugar a la vista?
    let nuevoLugar = null;
    let nuevoCap = null;
    for (const el of lugares) {
      const r = el.getBoundingClientRect();
      // (un lugar escondido con display:none mide 0 → nunca está "a la vista")
      const esCap = CAPITULO.test(el.dataset.kai);
      if (esCap && r.height > 0 && r.top < vh * 0.66) nuevoCap = el;
      // Capítulo: mientras su cabecera entra (bajo la barra y en los dos tercios de arriba).
      // Parada: mientras quepa en pantalla.
      const aLaVista = esCap ? r.top > 76 && r.top < vh * 0.7 : r.top > 50 && r.top + r.height * 0.72 < vh;
      if (!chico && !nuevoLugar && r.height > 0 && aLaVista) nuevoLugar = el;
    }
    if (!nacido) {
      nacido = true;
      caja.classList.add('kai--vivo');
    }
    const nuevoId = nuevoLugar ? nuevoLugar.dataset.kai : '';
    if (nuevoLugar !== lugar) {
      lugar = nuevoLugar;
      lugarId = nuevoId;
      viaje = ahora; // se deshace en partículas, viaja y se vuelve a armar
      caja.style.setProperty('--kai-talla', lugar?.dataset.kaiTalla || '1');
      if (lugar && frase?.(lugarId)) decir(lugarId);
      else callar(lugar ? 0 : 1200);
    } else if (lugar && nuevoId !== lugarId) {
      // misma parada, otra línea (Servicios: cambió el servicio activo)
      lugarId = nuevoId;
      if (frase?.(lugarId)) decir(lugarId);
      else callar(0);
    }
    if (nuevoCap !== capitulo) {
      capitulo = nuevoCap;
      // celular: no hay lugares; dice la línea unos segundos al empezar el capítulo
      if (chico && capitulo) decir(capitulo.dataset.kai, 5200);
    }
    let tx = esquinaX();
    let ty = esquinaY();
    if (lugar) {
      const r = lugar.getBoundingClientRect();
      tx = r.left;
      ty = r.top;
    }
    vx += ((tx - x) * 60 - vx * 13) * dt;
    vy += ((ty - y) * 60 - vy * 13) * dt;
    x += vx * dt;
    y += vy * dt;
    const tb = (ahora - brinco) / 1000;
    const salto = tb < 0.5 ? Math.sin((tb / 0.5) * Math.PI) * 14 : 0;
    caja.style.transform = `translate(${x.toFixed(1)}px, ${(y - salto + Math.sin(ahora / 620) * 3).toFixed(1)}px)`;
    caja.classList.toggle('kai--esquina', !lugar);
    // el globo abre hacia donde hay espacio
    const derecha = x + TAM / 2 > vw / 2;
    caja.classList.toggle('kai--izq', derecha);
    // En una cabecera (a la derecha del titular) el globo va DEBAJO: de lado taparía el titular
    caja.classList.toggle('kai--abajo', !!lugar && derecha && CAPITULO.test(lugarId));

    // Cuánto está formado: 0 al entrar el primer capítulo, 1 al llegar al último
    let meta = 0;
    if (caps.length > 1) {
      const r0 = caps[0].getBoundingClientRect().top;
      const r1 = caps[caps.length - 1].getBoundingClientRect().top;
      meta = clamp01((vh * 0.66 - r0) / Math.max(1, r1 - r0));
    }
    formado += (meta - formado) * 0.12;
    const f = smooth(formado);
    const tv = (ahora - viaje) / 1000;
    const va = tv < 0.7 ? Math.sin((tv / 0.7) * Math.PI) : 0;
    const esc = lerp(0.4, 1, f) * (1 - va * 0.55);
    cabeza.scale.setScalar(esc);
    matP.uniforms.uF.value = f;
    matP.uniforms.uCab.value = esc;
    matP.uniforms.uViaje.value = va;
    matP.uniforms.uTime.value = t;

    // El aro aparece cuando ya hay perla que orbitar
    const a = smooth(clamp01((f - 0.45) / 0.45)) * (1 - va);
    ejeAro.visible = a > 0.01;
    ejeAro.scale.setScalar(esc * lerp(1.5, 1, a));
    aro.scale.y = a;
    ejeAro.rotation.set(0.36 + Math.sin(t * 0.7) * 0.09, 0, 0.3 + Math.cos(t * 0.55) * 0.12);

    // Mira al cursor (o hacia donde va, si viaja rápido)
    const rapido = Math.hypot(vx, vy) > 260;
    const mx = rapido ? Math.sign(vx) * 0.7 : clamp01((cx - (x + TAM / 2)) / 520 + 0.5) * 2 - 1;
    const my = rapido ? Math.sign(vy) * 0.5 : clamp01((cy - (y + TAM / 2)) / 420 + 0.5) * 2 - 1;
    const tg = (ahora - giro) / 1000;
    const vuelta = tg < 0.8 ? (1 - Math.pow(1 - tg / 0.8, 3)) * Math.PI * 2 : 0;
    cabeza.rotation.y = lerp(cabeza.rotation.y, mx * 0.22 + vuelta, 0.18);
    cabeza.rotation.x = lerp(cabeza.rotation.x, my * 0.24, 0.14);
    cabeza.rotation.z = lerp(cabeza.rotation.z, clamp01(Math.abs(vx) / 1800) * -Math.sign(vx) * 0.35, 0.2);
    mirada.rotation.y = lerp(mirada.rotation.y, mx * 0.1, 0.2);
    mirada.rotation.x = lerp(mirada.rotation.x, my * 0.08, 0.2);
    const aplasta = tb < 0.5 ? Math.sin((tb / 0.5) * Math.PI * 2) * 0.06 : 0;
    cuerpo.scale.set(1 - aplasta, 1 + aplasta, 1 - aplasta);

    // Ojos: parpadean; al hablar se entrecierran, y con voz laten con su volumen
    let abre = 1;
    if (ahora > parpadeo) {
      const tp = (ahora - parpadeo) / 130;
      abre = tp < 1 ? Math.abs(1 - tp * 2) : 1;
      if (tp >= 1) parpadeo = ahora + 2200 + Math.random() * 3200;
    }
    const habla = tb < 1.6 ? Math.sin((tb / 1.6) * Math.PI) : 0;
    ojos.forEach((o) =>
      o.scale.set(1 + habla * 0.25 + volumen * 0.2, Math.max(0.1, abre) * (1 - habla * 0.42) * (1 + volumen * 0.55), 1)
    );

    renderer.render(scene, camera);
  };
  renderer.compile(scene, camera);
  raf = requestAnimationFrame(cuadro);

  return {
    setTheme,
    /** Volumen de su voz (0…1), cuadro a cuadro: mueve los ojos */
    voz: (a) => {
      volumen = a;
    },
    /** Callado no dice nada (se queda de compañía); tocarlo no lo despierta: lo decide el botón */
    callar: (v) => {
      callado = v;
      if (v) callar(0);
      else if (lugar && frase?.(lugar.dataset.kai)) decir(lugar.dataset.kai);
    },
    /** Cambió el idioma: repite lo que estaba diciendo */
    repetir: () => {
      if (dicho) decir(dicho);
    },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(ocultar);
      clearTimeout(relevo);
      window.removeEventListener('pointermove', alMover);
      canvas.removeEventListener('click', alTocar);
      for (const g of [geoCuerpo, geoOjo, geoAro, geoP]) g.dispose();
      for (const m of [matCuerpo, matAro, matOjo, matHalo, matP]) m.dispose();
      visor.dispose();
      barniz.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
