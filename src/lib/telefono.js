import * as THREE from 'three';
import { tonoCromo, entornoEstudio } from './cromo';

/**
 * EL TELÉFONO DE CROMO de Demos (2026-11-11). El teléfono plano de CSS de los
 * tres pasos ("Nos cuentas · Lo armamos · Lo pruebas") se vuelve un objeto: el
 * mismo cromo de la cinta, con canto, bisel y la Κ grabada en la espalda.
 * (Era el prototipo A del laboratorio; sus giros por giro y su abanico ya los
 * cuenta el elenco, así que aquí se queda con la historia de los 3 pasos.)
 *
 * LA PANTALLA es un lienzo 2D que se pinta según el scroll, con lo mismo que
 * mostraba la versión CSS: se escribe el nombre del negocio → el boceto se
 * dibuja → la demo real lo barre de arriba abajo → cae un pedido nuevo.
 * EL APARATO acompaña: reposa de tres cuartos, da UNA vuelta completa mientras
 * "lo armamos" (enseña la espalda con la Κ y regresa ya con la demo real) y al
 * final se corre y gira hacia el pase de acceso. El cursor lo inclina.
 * Todo es f(progreso): al subir regresa por el mismo camino.
 */

// Medidas del aparato (unidades de mundo); la pantalla respeta las capturas (780×1488)
const CW = 2.04;
const CH = 3.86;
const BISEL = 0.05;
const ZF = 0.11; // cara frontal
const PW = 1.96;
const PH = 3.74;
const LW = 520; // lienzo de la pantalla
const LH = Math.round((LW * PH) / PW);
const BOCETO = [
  [8, 10, 84, 12],
  [8, 28, 84, 70],
  [8, 104, 40, 40],
  [52, 104, 40, 40],
  [8, 156, 84, 14],
  [8, 178, 84, 12],
];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const tramo = (v, [a, b]) => clamp01((v - a) / (b - a));
const smooth = (x) => x * x * (3 - 2 * x);
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function redondo(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}
// ShapeGeometry deja las UV en unidades de la figura: se pasan a 0..1
function carasPlanas(w, h, r) {
  const g = new THREE.ShapeGeometry(redondo(w, h, r), 20);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  return g;
}
// La Κ del favicon, en trazos rectos, para grabarla en la espalda
function texturaK() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#000';
  x.fillRect(0, 0, 256, 256);
  x.strokeStyle = '#fff';
  x.lineWidth = 17;
  x.beginPath();
  x.moveTo(88, 52);
  x.lineTo(88, 204);
  x.moveTo(176, 52);
  x.lineTo(92, 128);
  x.lineTo(176, 204);
  x.stroke();
  return new THREE.CanvasTexture(c);
}

/**
 * @param stage   la caja del teléfono (.dm-stage): define el tamaño
 * @param canvas  lienzo que la cubre
 * @param opts.theme     'dark' | 'light'
 * @param opts.progreso() → p de la escena (0 = se fija, 1 = se suelta)
 * @param opts.tramos    { escribe, boceto, real, prueba } sobre p (los mismos de Demos.jsx)
 * @param opts.textos()  → { nombre, etiqueta, aviso, avisoSub }
 * @param opts.imagen    captura de la demo real
 */
export function crearTelefono(stage, canvas, { theme = 'dark', progreso, tramos: T, textos, imagen }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const env = entornoEstudio(renderer);
  scene.environment = env;
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 6);
  scene.add(key);
  const FOV = 30;
  const CAM_Z = 8.4; // el aparato ocupa ~86% del alto del lienzo
  const camera = new THREE.PerspectiveCamera(FOV, 1, 2, 40);
  camera.position.z = CAM_Z;

  // ── La pantalla: un lienzo 2D que se repinta cuando cambia lo que enseña ──
  const lienzo = document.createElement('canvas');
  lienzo.width = LW;
  lienzo.height = LH;
  const ctx = lienzo.getContext('2d');
  const texPantalla = new THREE.CanvasTexture(lienzo);
  texPantalla.colorSpace = THREE.SRGBColorSpace;
  texPantalla.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const foto = new Image();
  let fotoLista = false;
  foto.onload = () => {
    fotoLista = true;
    clave = '';
  };
  foto.src = imagen;
  let clave = '';
  const pintar = (p, ahora) => {
    const tx = textos();
    const letras = Math.round(tramo(p, T.escribe) * tx.nombre.length);
    const campo = 1 - tramo(p, [T.boceto[0] - 0.04, T.boceto[0]]);
    const boceto = p < T.boceto[0] - 0.02 ? -1 : tramo(p, T.boceto);
    const barrido = tramo(p, T.real);
    const aviso = tramo(p, [T.prueba[0] + 0.06, T.prueba[1]]);
    const caret = campo > 0 && Math.floor(ahora / 500) % 2 === 0;
    const k = `${tx.nombre}|${letras}|${campo.toFixed(2)}|${boceto.toFixed(3)}|${barrido.toFixed(3)}|${aviso.toFixed(2)}|${caret}|${fotoLista}`;
    if (k === clave) return;
    clave = k;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#efe9df';
    ctx.fillRect(0, 0, LW, LH);
    // 1 · el nombre del negocio se escribe
    if (campo > 0) {
      ctx.globalAlpha = campo;
      const x = LW * 0.08;
      const y = LH * 0.42;
      ctx.fillStyle = '#8a847a';
      ctx.font = '500 21px Inter, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText(tx.etiqueta.toUpperCase(), x, y);
      ctx.letterSpacing = '-1.5px';
      ctx.fillStyle = '#1d1d1f';
      ctx.font = '700 50px "Familjen Grotesk", sans-serif';
      const texto = tx.nombre.slice(0, letras);
      ctx.fillText(texto, x, y + 62);
      if (caret) ctx.fillRect(x + ctx.measureText(texto).width + 6, y + 22, 3, 48);
      ctx.fillRect(x, y + 80, LW * 0.84, 3);
      ctx.letterSpacing = '0px';
    }
    // 2 · el boceto se dibuja…
    if (boceto >= 0 && barrido < 1) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#1d1d1f';
      ctx.lineWidth = 2.2;
      const sx = LW / 100;
      const sy = LH / 200;
      for (const [x, y, w, h] of BOCETO) {
        const largo = 2 * (w * sx + h * sy);
        ctx.setLineDash([largo * boceto, largo]);
        ctx.beginPath();
        ctx.roundRect(x * sx, y * sy, w * sx, h * sy, 4 * sx);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    // …y la demo real lo barre de arriba abajo
    if (barrido > 0 && fotoLista) {
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, LW, LH * barrido);
      ctx.clip();
      const alto = (LW * foto.naturalHeight) / foto.naturalWidth;
      ctx.drawImage(foto, 0, 0, LW, alto);
      ctx.restore();
    }
    // 3 · entra un pedido
    if (aviso > 0) {
      ctx.globalAlpha = aviso;
      const y = LH * 0.04 - (1 - aviso) * 56;
      ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
      ctx.beginPath();
      ctx.roundRect(LW * 0.06, y, LW * 0.88, 104, 30);
      ctx.fill();
      ctx.fillStyle = '#f2efe9';
      ctx.beginPath();
      ctx.arc(LW * 0.06 + 34, y + 38, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '700 25px Inter, sans-serif';
      ctx.fillText(tx.aviso, LW * 0.06 + 58, y + 46);
      ctx.font = '400 24px Inter, sans-serif';
      ctx.fillText(tx.avisoSub, LW * 0.06 + 58, y + 80);
    }
    ctx.globalAlpha = 1;
    texPantalla.needsUpdate = true;
  };

  // ── El aparato ──
  const geoCuerpo = new THREE.ExtrudeGeometry(redondo(CW, CH, 0.31), {
    depth: ZF * 2 - BISEL * 2,
    bevelEnabled: true,
    bevelThickness: BISEL,
    bevelSize: BISEL,
    bevelSegments: 8,
    curveSegments: 28,
  });
  geoCuerpo.center();
  const geoMarco = carasPlanas(CW + 0.02, CH + 0.02, 0.32);
  const geoPantalla = carasPlanas(PW, PH, 0.26);
  const geoMarca = new THREE.PlaneGeometry(0.62, 0.62);
  const matCuerpo = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.08 });
  const matMarco = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.35, metalness: 0.2 });
  const matPantalla = new THREE.MeshBasicMaterial({ map: texPantalla, toneMapped: false });
  // Reflejo del vidrio: solo suma el brillo del entorno encima de la pantalla
  const matVidrio = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    metalness: 1,
    roughness: 0.06,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const texMarca = texturaK();
  const matMarca = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.6, alphaMap: texMarca, transparent: true, depthWrite: false });
  const tel = new THREE.Group();
  const marco = new THREE.Mesh(geoMarco, matMarco);
  const pantalla = new THREE.Mesh(geoPantalla, matPantalla);
  const vidrio = new THREE.Mesh(geoPantalla, matVidrio);
  const marca = new THREE.Mesh(geoMarca, matMarca);
  marco.position.z = ZF + 0.002;
  pantalla.position.z = ZF + 0.006;
  vidrio.position.z = ZF + 0.01;
  marca.position.z = -ZF - 0.004;
  marca.rotation.y = Math.PI;
  tel.add(new THREE.Mesh(geoCuerpo, matCuerpo), marco, pantalla, vidrio, marca);
  scene.add(tel);

  const setTheme = (t) => {
    tonoCromo(matCuerpo, t === 'light' ? 'light' : 'dark');
    matMarca.color.set(t === 'light' ? '#8a857d' : '#8f897e');
  };
  setTheme(theme);

  const medir = () => {
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  medir();
  const ro = new ResizeObserver(medir);
  ro.observe(stage);

  let cx = 0;
  let cy = 0;
  let mx = 0;
  let my = 0;
  const alMover = (e) => {
    cx = (e.clientX / window.innerWidth) * 2 - 1;
    cy = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', alMover, { passive: true });

  let raf = 0;
  const cuadro = (ahora) => {
    raf = requestAnimationFrame(cuadro);
    if (document.hidden) return;
    const r = stage.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const p = clamp01(progreso());
    pintar(p, ahora);
    const t = ahora / 1000;
    mx += (cx - mx) * 0.06;
    my += (cy - my) * 0.06;
    // "Lo armamos": una vuelta completa; al regresar de frente ya trae la demo real
    const vuelta = ease(tramo(p, [T.boceto[0] + 0.05, T.real[0] + 0.05]));
    // "Lo pruebas": se corre y gira hacia el pase de acceso que entra a su derecha
    const prueba = smooth(tramo(p, T.prueba));
    tel.rotation.y = -0.3 + vuelta * Math.PI * 2 + prueba * 0.52 + mx * 0.14 + Math.sin(t * 0.6) * 0.03;
    tel.rotation.x = 0.05 + my * 0.08 + Math.sin(t * 0.5) * 0.015;
    tel.rotation.z = -0.02 + prueba * 0.03;
    tel.position.x = -prueba * 0.62;
    tel.position.y = Math.sin(t * 0.8) * 0.03;
    // a media vuelta se aleja un poco: el giro se siente con peso
    tel.position.z = -Math.sin(vuelta * Math.PI) * 0.7;
    renderer.render(scene, camera);
  };
  renderer.compile(scene, camera);
  raf = requestAnimationFrame(cuadro);

  return {
    setTheme,
    /** Cambió el idioma: repinta la pantalla */
    refrescar() {
      clave = '';
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', alMover);
      for (const g of [geoCuerpo, geoMarco, geoPantalla, geoMarca]) g.dispose();
      for (const m of [matCuerpo, matMarco, matPantalla, matVidrio, matMarca]) m.dispose();
      texPantalla.dispose();
      texMarca.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
