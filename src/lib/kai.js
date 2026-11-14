import * as THREE from 'three';
import { tonoCromo, entornoEstudio } from './cromo';

/**
 * KAI, EL GUÍA (2026-11-11). La idea viene del "Buddy" de adamperlis.com —
 * alguien te habla mientras bajas— con forma propia, hecha de las dos materias
 * de la apertura: una PERLA del cromo de la cinta con su ARO (un tramo de cinta
 * que lo orbita), que al cambiar de lugar se deshace en PARTÍCULAS, viaja y se
 * vuelve a armar.
 * Cara: un visor de vidrio negro con dos ojos de luz. Sin boca ni brazos: se
 * expresa con los ojos, la inclinación y los brincos.
 * ⚠️ YA NO EVOLUCIONA (11-nov, pedido de Zahir): antes nacía como nube de
 * partículas y se iba formando con el avance; ahora tiene su aspecto final
 * desde que aparece. No volver a ligar su forma al scroll.
 *
 * DÓNDE VIVE: en los `.kai-lugar` (cajas absolutas de 176 px que NO mueven el
 * layout). Con uno a la vista, Kai se para ahí; si no, espera chico arriba del
 * botón de WhatsApp. Hay de dos tipos:
 *  · de CAPÍTULO (`data-kai="Nº"`, los pone SectionHead a la derecha del
 *    titular): dice la línea del capítulo;
 *  · PARADAS (hero: encaramado en ΚΛΙΖΣΝ y junto a los botones; Servicios:
 *    junto a la hélice, con una línea por servicio — `data-kai` cambia y él lo
 *    nota). `data-kai-talla` lo achica en esa parada. Sin frase, solo está.
 * Está desde que se va la pantalla de carga (index.html trae un Kai de CSS en
 * el mismo lugar). El globo abre hacia el lado con más espacio. En celular
 * nunca deja la esquina: solo habla unos segundos al cambiar de capítulo. Se
 * esconde con un modal abierto.
 *
 * Este archivo no sabe de idiomas, de audio ni del freno del scroll: pide el
 * texto con `frase(id)` y avisa con `alDecir(id, lugar, pedida)`; el componente
 * (Kai.jsx) pone la voz, decide si la página se detiene y devuelve el volumen
 * con `voz(a)` para que los ojos se muevan al hablar.
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
// sale con un rebote (sobrepasa un poco y regresa)
const rebote = (x) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
/**
 * DIRIGIDO (13-nov-2026): la pantalla de carga (index.html) lo pone a actuar —
 * "Kai imprime el logo"— escribiendo `window.__kaiDirector = { x, y, mira, talla }`
 * (centro de Kai y punto al que mira, en px de pantalla). Mientras exista: va
 * exactamente ahí (sin resorte), mira a `mira`, no habla y no se encoge en la
 * esquina. Al volverlo null sigue su vida normal desde ese punto.
 */
const director = () => (typeof window !== 'undefined' ? window.__kaiDirector : null) || null;

/**
 * @param caja    contenedor fijo (.kai)
 * @param canvas  lienzo dentro de la caja
 * @param globo   <p> donde se escribe la frase
 * @param opts.theme 'dark' | 'light'
 * @param opts.frase(id)  → texto del capítulo o de la ocurrencia (en el idioma actual)
 * @param opts.alDecir(id | null, lugar, pedida)  empezó a decir esa frase (null = se calló).
 *        `lugar` = el .kai-lugar donde está parado (null en la esquina / celular);
 *        `pedida` = la repite porque el visitante lo pidió (cambió idioma o prendió la voz)
 * @param opts.sonando()  ¿su voz sigue sonando? (para no quitar el globo a media frase)
 */
export function createKai(caja, canvas, globo, { theme = 'dark', frase, alDecir, sonando } = {}) {
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
      uF: { value: 1 }, // 1 = partículas pegadas a la perla (solo se sueltan con uViaje)
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

  // ── OUTFITS (14-nov, como Buddy de adamperlis.com: cada toque, un accesorio) ──
  // Van en la cabeza (giran con ella). Aparecen con un rebote a la mitad de su vuelta.
  const plastico = (color, rough = 0.42) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const matNegro = plastico(0x111111, 0.3);
  const matAmarillo = plastico(0xf2b705, 0.38);
  const matGris = plastico(0x2a2a2a, 0.55);
  // lentes de ESPEJO: reflejan las cajas de luz (negros mate se perdían sobre el cromo oscuro)
  const matEspejo = new THREE.MeshPhysicalMaterial({ color: 0x8a8f99, metalness: 1, roughness: 0.06, clearcoat: 1 });
  const geosOutfit = [];
  const g = (geo) => (geosOutfit.push(geo), geo);
  const OUTFITS = {
    casco: (() => {
      const o = new THREE.Group();
      const domo = new THREE.Mesh(g(new THREE.SphereGeometry(1.07, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2)), matAmarillo);
      domo.scale.y = 0.82;
      domo.position.y = 0.12;
      const ala = new THREE.Mesh(g(new THREE.CylinderGeometry(1.26, 1.3, 0.06, 64)), matAmarillo);
      ala.position.set(0, 0.16, 0.08);
      const cresta = new THREE.Mesh(g(new THREE.TorusGeometry(1.0, 0.07, 10, 48, Math.PI)), matAmarillo);
      cresta.rotation.y = Math.PI / 2;
      cresta.position.y = 0.12;
      cresta.scale.y = 0.85;
      o.add(domo, ala, cresta);
      o.rotation.x = -0.12;
      return o;
    })(),
    lentes: (() => {
      const o = new THREE.Group();
      [-1, 1].forEach((lado) => {
        const d = new THREE.Vector3(Math.sin(lado * 0.3), 0.19, Math.cos(lado * 0.3)).normalize();
        const lente = new THREE.Mesh(g(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 40)), matEspejo);
        lente.scale.set(1.15, 1, 0.85);
        lente.position.copy(d).multiplyScalar(1.07);
        lente.lookAt(d.clone().multiplyScalar(3));
        lente.rotateX(Math.PI / 2);
        o.add(lente);
      });
      const puente = new THREE.Mesh(g(new THREE.BoxGeometry(0.2, 0.05, 0.05)), matNegro);
      puente.position.set(0, 0.24, 1.04);
      o.add(puente);
      return o;
    })(),
    gala: (() => {
      const o = new THREE.Group();
      const copa = new THREE.Mesh(g(new THREE.CylinderGeometry(0.5, 0.55, 0.78, 40)), matNegro);
      copa.position.y = 1.32;
      const cinta = new THREE.Mesh(g(new THREE.CylinderGeometry(0.56, 0.56, 0.13, 40)), matGris);
      cinta.position.y = 1.0;
      const ala = new THREE.Mesh(g(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 48)), matNegro);
      ala.position.y = 0.93;
      const sombrero = new THREE.Group();
      sombrero.add(copa, cinta, ala);
      sombrero.rotation.z = -0.18;
      sombrero.position.x = 0.1;
      // moño bajo la "barbilla"
      const mono = new THREE.Group();
      [-1, 1].forEach((lado) => {
        const ala2 = new THREE.Mesh(g(new THREE.ConeGeometry(0.17, 0.3, 4)), matNegro);
        ala2.rotation.z = (lado * Math.PI) / 2;
        ala2.position.x = lado * 0.16;
        mono.add(ala2);
      });
      const nudo = new THREE.Mesh(g(new THREE.SphereGeometry(0.07, 16, 12)), matNegro);
      mono.add(nudo);
      mono.position.set(0, -0.98, 0.42);
      mono.rotation.x = -0.5;
      o.add(sombrero, mono);
      return o;
    })(),
    audifonos: (() => {
      const o = new THREE.Group();
      const diadema = new THREE.Mesh(g(new THREE.TorusGeometry(1.1, 0.07, 12, 48, Math.PI)), matNegro);
      o.add(diadema);
      [-1, 1].forEach((lado) => {
        const copa = new THREE.Mesh(g(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 32)), matNegro);
        copa.rotation.z = Math.PI / 2;
        copa.position.set(lado * 1.06, -0.02, 0);
        const cojin = new THREE.Mesh(g(new THREE.TorusGeometry(0.26, 0.07, 10, 24)), matGris);
        cojin.rotation.y = Math.PI / 2;
        cojin.position.set(lado * 0.96, -0.02, 0);
        o.add(copa, cojin);
      });
      return o;
    })(),
  };
  const ORDEN_OUTFITS = ['casco', 'lentes', 'gala', 'audifonos', null];
  Object.values(OUTFITS).forEach((o) => {
    o.visible = false;
    cabeza.add(o);
  });
  let outfit = null;
  let outfitPrevio = null;
  let nOutfit = 0;
  let tOutfit = -1e6;

  // ── EL MINI CELULAR: en algunas paradas (`data-kai-cel`) saca un teléfono chiquito
  // que flota a su lado. Pantalla = una imagen (la demo del frente) o "whatsapp". ──
  const cel = new THREE.Group();
  const geoCel = new THREE.BoxGeometry(0.62, 1.18, 0.07);
  const celCuerpo = new THREE.Mesh(geoCel, matNegro);
  const geoPantalla = new THREE.PlaneGeometry(0.54, 1.08);
  const matPantalla = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const pantalla = new THREE.Mesh(geoPantalla, matPantalla);
  pantalla.position.z = 0.037;
  cel.add(celCuerpo, pantalla);
  cel.visible = false;
  scene.add(cel);
  const texturas = {};
  const pantallaDe = (src) => {
    if (texturas[src]) return texturas[src];
    let t;
    if (src === 'whatsapp') {
      // un chat de WhatsApp dibujado: cabecera, el mensaje que se está armando
      const c = document.createElement('canvas');
      c.width = 270;
      c.height = 540;
      const x = c.getContext('2d');
      x.fillStyle = '#0b141a';
      x.fillRect(0, 0, 270, 540);
      x.fillStyle = '#1f2c34';
      x.fillRect(0, 0, 270, 74);
      x.fillStyle = '#25d366';
      x.beginPath();
      x.arc(36, 44, 16, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#e9edef';
      x.font = '600 19px sans-serif';
      x.fillText('KaiZen', 62, 51);
      x.fillStyle = '#005c4b';
      x.beginPath();
      x.roundRect(60, 360, 190, 96, 14);
      x.fill();
      x.fillStyle = '#e9edef';
      x.font = '17px sans-serif';
      ['Hola, equipo KaiZen.', 'Me interesa una', 'app para mi negocio'].forEach((l, i) => x.fillText(l, 74, 390 + i * 24));
      x.fillStyle = '#1f2c34';
      x.beginPath();
      x.roundRect(14, 476, 242, 46, 23);
      x.fill();
      t = new THREE.CanvasTexture(c);
    } else {
      t = new THREE.TextureLoader().load(src);
    }
    t.colorSpace = THREE.SRGBColorSpace;
    return (texturas[src] = t);
  };
  let celSrc = '';
  let tCel = -1e6;

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
  let yDijo = 0; // dónde iba la página cuando empezó a hablar (celular: seguir bajando lo calla)
  let topeFrase = '';
  let cortada = null; // la línea que se guardó al deslizar: tocarlo la repite
  let brinco = -1e6;
  let callado = false;
  let dicho = null; // id de lo que está diciendo (para repetirlo si cambia el idioma)
  // `paciente`: si al cumplirse el plazo su voz sigue sonando, espera a que acabe
  // (en celular el globo dura unos segundos y la frase más larga dura más que eso)
  const callar = (espera = 0, paciente = false) => {
    clearTimeout(ocultar);
    ocultar = setTimeout(() => {
      if (paciente && sonando?.()) {
        callar(300, true);
        return;
      }
      caja.classList.remove('kai--habla');
      dicho = null;
      alDecir?.(null);
    }, espera);
  };
  const decir = (id, dura = 0, pedida = false) => {
    const texto = frase?.(id);
    if (!texto || callado || director()) return;
    dicho = id;
    // En una píldora (KaiPildora.jsx) la frase va DENTRO de la cápsula, no en su globo
    const enPildora = lugar && 'kaiPildora' in lugar.dataset ? lugar.parentElement.querySelector('.kai-pildora-texto') : null;
    const destino = enPildora || globo;
    destino.textContent = '';
    texto.split(' ').forEach((palabra, i) => {
      const s = document.createElement('span');
      s.textContent = `${palabra} `;
      s.style.animationDelay = `${0.25 + i * 0.075}s`;
      destino.appendChild(s);
    });
    if (!enPildora) caja.classList.add('kai--habla');
    else caja.classList.remove('kai--habla');
    brinco = performance.now();
    yDijo = window.scrollY;
    clearTimeout(ocultar);
    if (dura) callar(dura, true);
    alDecir?.(id, lugar, pedida);
  };

  // ── Estado ──
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  // Esquina: el lienzo va a 0.6 → su centro queda sobre el botón de WhatsApp
  // Sin lugar a la vista se GUARDA EN LA BARRA (14-nov, como Buddy de adamperlis.com):
  // el hueco `.kai-dock` de Navbar.jsx. Sin barra (páginas legales), la esquina de siempre.
  let dock = null;
  const enBarra = () => {
    if (!dock || !dock.isConnected) dock = document.querySelector('.kai-dock');
    const r = dock && dock.getBoundingClientRect();
    return r && r.width > 0 ? r : null;
  };
  const esquinaX = () => {
    const r = enBarra();
    return r ? r.left + r.width / 2 - TAM / 2 : vw - 60 - TAM / 2;
  };
  const esquinaY = () => {
    const r = enBarra();
    return r ? r.top + r.height / 2 - TAM / 2 : vh - 152 - TAM / 2;
  };
  let x = esquinaX();
  let y = esquinaY();
  let vx = 0;
  let vy = 0;
  let cx = vw / 2;
  let cy = vh / 2;
  let lugares = [];
  let lugar = null; // el lugar donde está parado (solo escritorio)
  let lugarId = ''; // su data-kai (en Servicios cambia sin cambiar de lugar)
  let capitulo = null; // el último capítulo que empezó
  let nacido = false;
  let giro = -1e6;
  let dirigido = false;
  let tallaDirigida = '';
  let kaiXCss = '';
  let parpadeo = performance.now() + 2500;
  let volumen = 0;
  let nCuadro = 0;
  let raf = 0;
  let antes = performance.now();
  const alMover = (e) => {
    cx = e.clientX;
    cy = e.clientY;
  };
  window.addEventListener('pointermove', alMover, { passive: true });
  // Tocarlo: da una vuelta y sale con OTRO OUTFIT (casco → lentes → gala → audífonos →
  // como vino), diciendo su chiste. La línea cortada del celular sigue teniendo prioridad.
  const alTocar = () => {
    const ahora = performance.now();
    giro = ahora;
    if (cortada && !lugar && !callado) {
      decir(cortada, 5200);
      cortada = null;
      return;
    }
    outfitPrevio = outfit;
    outfit = ORDEN_OUTFITS[nOutfit++ % ORDEN_OUTFITS.length];
    tOutfit = ahora + 380; // a la mitad de la vuelta
    if (callado) return;
    clearTimeout(relevo);
    decir(`outfit-${outfit || 'normal'}`, lugar ? 0 : 4600);
    // parado en un capítulo, después del chiste vuelve a su línea
    if (lugar) relevo = setTimeout(() => lugar && frase?.(lugar.dataset.kai) && decir(lugar.dataset.kai), 4200);
  };
  canvas.addEventListener('click', alTocar);
  // Una escena le pide una vuelta (Contacto: al enviar el formulario)
  const alGirar = () => {
    giro = performance.now();
    brinco = performance.now();
  };
  window.addEventListener('kai:gira', alGirar);
  // ¿A dónde mira en esta parada? (ver data-kai-mira)
  const miraDe = (el) => {
    if (el.dataset.kaiMira === 'centro') return [vw / 2, vh / 2];
    // un selector: mira a ese elemento de la página (la despedida mira al botón de WhatsApp)
    if (/^[.#]/.test(el.dataset.kaiMira)) {
      const r = document.querySelector(el.dataset.kaiMira)?.getBoundingClientRect();
      return r && r.width > 0 ? [r.left + r.width / 2, r.top + r.height / 2] : null;
    }
    let obj = el.parentElement;
    if (el.dataset.kaiMira === 'foco') {
      const a = document.activeElement;
      obj = a && a !== document.body && el.closest('section, footer')?.contains(a) ? a : null;
    }
    const r = obj && obj.getBoundingClientRect();
    return r && r.width > 0 ? [r.left + r.width / 2, r.top + r.height / 2] : null;
  };

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
    // (cada 10 cuadros: hay paradas que aparecen al pasar el cursor —Proyectos— o al abrir una pregunta)
    if (nCuadro++ % 10 === 0) lugares = [...document.querySelectorAll('.kai-lugar[data-kai]')];
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
      // (la parada mide 176 aunque Kai se vea más chico: se mide lo que SE VE, según su talla)
      const medio = (r.height / 2) * (Number(el.dataset.kaiTalla) || 1);
      const centro = r.top + r.height / 2;
      const aLaVista = esCap ? r.top > 76 && r.top < vh * 0.7 : centro - medio > 50 && centro + medio * 0.44 < vh;
      // En celular solo cuentan las paradas marcadas `data-kai-movil` (la de la hélice)
      if ((!chico || 'kaiMovil' in el.dataset) && r.height > 0 && aLaVista) {
        if (!nuevoLugar) nuevoLugar = el;
        // `data-kai-gana`: si se ve, manda sobre las demás (la despedida, al final)
        else if ('kaiGana' in el.dataset) nuevoLugar = el;
      }
    }
    if (!nacido) {
      nacido = true;
      caja.classList.add('kai--vivo');
    }
    const nuevoId = nuevoLugar ? nuevoLugar.dataset.kai : '';
    if (nuevoLugar !== lugar) {
      lugar = nuevoLugar;
      lugarId = nuevoId;
      caja.style.setProperty('--kai-talla', lugar?.dataset.kaiTalla || '1');
      // `data-kai-linea`: la parada le reserva su hueco → la frase va suelta a su lado,
      // sin tarjeta (como Buddy de adamperlis.com), en vez de flotar sobre el contenido
      caja.classList.toggle('kai--linea', !!lugar && 'kaiLinea' in lugar.dataset);
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
      if (chico && capitulo && !lugar) decir(capitulo.dataset.kai, 5200);
    }
    // Celular (12-nov): el globo no tiene dónde pararse y tapaba lo que estás viendo → en
    // cuanto sigues deslizando (tras 1.4 s para alcanzar a leerlo) se guarda. Si su voz
    // está sonando no: la prendiste para oírlo.
    if (
      chico &&
      !lugar &&
      caja.classList.contains('kai--habla') &&
      ahora - brinco > 1400 &&
      Math.abs(window.scrollY - yDijo) > 140 &&
      !sonando?.()
    ) {
      callar(0);
      cortada = capitulo?.dataset.kai || null;
    }
    let tx = esquinaX();
    let ty = esquinaY();
    if (lugar) {
      const r = lugar.getBoundingClientRect();
      tx = r.left;
      ty = r.top;
    }
    const dirige = director();
    if (dirige) {
      const nx = dirige.x - TAM / 2;
      const ny = dirige.y - TAM / 2;
      vx = (nx - x) / dt;
      vy = (ny - y) / dt;
      x = nx;
      y = ny;
      if (dirige.mira) {
        cx = dirige.mira[0];
        cy = dirige.mira[1];
      }
      // `talla`: su tamaño mientras actúa (en celular, más chico que en el hero)
      const td = String(dirige.talla || 1);
      if (td !== tallaDirigida) caja.style.setProperty('--kai-talla', (tallaDirigida = td));
      dirigido = true;
    } else {
      if (dirigido) {
        // lo acaban de soltar: sin el impulso del último cuadro dirigido
        dirigido = false;
        vx = 0;
        vy = 0;
        tallaDirigida = '';
        caja.style.setProperty('--kai-talla', lugar?.dataset.kaiTalla || '1');
      }
      vx += ((tx - x) * 60 - vx * 13) * dt;
      vy += ((ty - y) * 60 - vy * 13) * dt;
      x += vx * dt;
      y += vy * dt;
    }
    const tb = (ahora - brinco) / 1000;
    // guardado en la barra se ve chiquito: brinca y flota en proporción
    const k = !lugar && !dirige && enBarra() ? 0.3 : 1;
    const salto = tb < 0.5 ? Math.sin((tb / 0.5) * Math.PI) * 14 * k : 0;
    caja.style.transform = `translate(${x.toFixed(1)}px, ${(y - salto + Math.sin(ahora / 620) * 3 * k).toFixed(1)}px)`;
    caja.classList.toggle('kai--esquina', !lugar && !dirige);
    caja.classList.toggle('kai--pildora', !!lugar && 'kaiPildora' in lugar.dataset);
    caja.classList.toggle('kai--barra', !lugar && !dirige && !!enBarra());
    // el globo abre hacia donde hay espacio
    const derecha = x + TAM / 2 > vw / 2;
    caja.classList.toggle('kai--izq', derecha);
    // Frase suelta a su izquierda: que nunca pase de la orilla (16 px), aunque Kai quede cerca
    const tope = `${Math.max(120, Math.round((x + 16) / 4) * 4)}px`;
    // (celular, guardado en la barra: el globo se ancla a la pantalla con esto, no a Kai)
    const kxCss = `${Math.round(x)}px`;
    if (kxCss !== kaiXCss) caja.style.setProperty('--kai-x', (kaiXCss = kxCss));
    if (tope !== topeFrase) caja.style.setProperty('--kai-tope', (topeFrase = tope));
    // En una cabecera (a la derecha del titular) el globo va DEBAJO: de lado taparía el titular
    const globoParada = lugar?.dataset.kaiGlobo || '';
    caja.classList.toggle('kai--abajo', !!lugar && ((derecha && CAPITULO.test(lugarId)) || globoParada.startsWith('abajo')));
    // `abajo-angosto`: abajo y hacia la izquierda, sobre su propia escena (el video), sin taparle el título
    caja.classList.toggle('kai--angosto', globoParada === 'abajo-angosto');
    // `data-kai-globo="debajo"`: la escena le deja espacio abajo (no a los lados)
    caja.classList.toggle('kai--debajo', !!lugar && lugar.dataset.kaiGlobo === 'debajo');

    // Siempre con su aspecto final (perla + aro). Lo único que lo deshace es el VIAJE
    // entre lugares: se suelta en partículas, llega y se vuelve a armar.
    // 14-nov: YA NO se deshace en partículas al viajar (Zahir no las quiso detrás de él):
    // viaja completo, perla y aro (antes: `va` = sin(π·t/0.7) durante 0.7 s al cambiar de lugar).
    const va = 0;
    const esc = 1 - va * 0.55;
    cabeza.scale.setScalar(esc);
    matP.uniforms.uCab.value = esc;
    matP.uniforms.uViaje.value = va;
    matP.uniforms.uTime.value = t;

    // El aro se recoge mientras viaja
    const a = smooth(1 - va);
    ejeAro.visible = a > 0.01;
    ejeAro.scale.setScalar(esc * lerp(1.5, 1, a));
    aro.scale.y = a;
    ejeAro.rotation.set(0.36 + Math.sin(t * 0.7) * 0.09, 0, 0.3 + Math.cos(t * 0.55) * 0.12);

    // Mira al cursor (o hacia donde va, si viaja rápido). En una parada con
    // `data-kai-mira` mira a la ESCENA en vez del cursor: "" = a su contenedor (el video
    // del testimonio, la demo del frente…), "foco" = al campo que estás llenando.
    let miraX = cx;
    let miraY = cy;
    const mira = lugar && !dirige && 'kaiMira' in lugar.dataset ? miraDe(lugar) : null;
    if (mira) {
      miraX = mira[0];
      miraY = mira[1];
    }
    // (dirigido con `mira`, o mirando la escena: ve a donde le dicen aunque vaya rápido)
    const rapido = !dirige?.mira && !mira && Math.hypot(vx, vy) > 260;
    const mx = rapido ? Math.sign(vx) * 0.7 : clamp01((miraX - (x + TAM / 2)) / 520 + 0.5) * 2 - 1;
    const my = rapido ? Math.sign(vy) * 0.5 : clamp01((miraY - (y + TAM / 2)) / 420 + 0.5) * 2 - 1;
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

    // Outfit: cambia a la mitad de la vuelta y entra con un rebote
    const puesto = ahora >= tOutfit ? outfit : outfitPrevio;
    const pop = ahora >= tOutfit ? rebote(clamp01((ahora - tOutfit) / 380)) : 1;
    for (const k in OUTFITS) {
      const o = OUTFITS[k];
      o.visible = k === puesto;
      if (o.visible) o.scale.setScalar(Math.max(0.001, pop));
    }

    // Mini celular: sale en las paradas con `data-kai-cel` y flota a su lado
    const quiereCel = lugar && !dirige ? lugar.dataset.kaiCel || '' : '';
    if (quiereCel !== celSrc) {
      celSrc = quiereCel;
      tCel = ahora;
      if (celSrc) {
        matPantalla.map = pantallaDe(celSrc);
        matPantalla.needsUpdate = true;
      }
    }
    const tc = clamp01((ahora - tCel) / 420);
    const celEsc = celSrc ? rebote(tc) : 1 - smooth(tc);
    cel.visible = celEsc > 0.01;
    if (cel.visible) {
      cel.scale.setScalar(celEsc * 0.86);
      cel.position.set(1.12, -0.48 + Math.sin(t * 1.6) * 0.04, 0.75);
      cel.rotation.set(-0.08, -0.38 + Math.sin(t * 0.9) * 0.05, 0.1);
    }

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
    /** Cambió el idioma o prendieron la voz: repite lo que estaba diciendo */
    repetir: () => {
      if (dicho) decir(dicho, 0, true);
    },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(ocultar);
      clearTimeout(relevo);
      window.removeEventListener('pointermove', alMover);
      canvas.removeEventListener('click', alTocar);
      window.removeEventListener('kai:gira', alGirar);
      for (const geo of [geoCuerpo, geoOjo, geoAro, geoP, geoCel, geoPantalla, ...geosOutfit]) geo.dispose();
      for (const m of [matCuerpo, matAro, matOjo, matHalo, matP, matNegro, matAmarillo, matGris, matEspejo, matPantalla]) m.dispose();
      Object.values(texturas).forEach((tx) => tx.dispose());
      visor.dispose();
      barniz.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
