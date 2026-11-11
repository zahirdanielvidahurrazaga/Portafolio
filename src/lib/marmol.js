import * as THREE from 'three';

/*
 * MÁRMOL VIVO — la losa de Contacto (el ÚNICO lugar del sitio con mármol:
 * Zahir lo quiso como acento, no como fondo; 2026-11-11).
 * Mármol generado en el shader (ruido deformado sobre sí mismo → vetas) que
 * fluye despacio. El cursor deja un "empujón" en una textura chica de flujo
 * (se va apagando sola) y esa textura desplaza las vetas: el mármol se deja
 * mover como si estuviera fresco. Sin color; cambia con el tema.
 */

const TONOS = {
  // base, nube y veta en sRGB 0..1 (el shader escribe el color tal cual)
  dark: { base: [0.035, 0.035, 0.038], nube: [0.115, 0.11, 0.105], veta: [0.86, 0.83, 0.77], fuerza: 0.62 },
  light: { base: [0.965, 0.955, 0.93], nube: [0.875, 0.86, 0.825], veta: [0.36, 0.34, 0.31], fuerza: 0.7 },
};

export const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FLUJO = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uAspect;
  uniform float uDecay;
  varying vec2 vUv;
  void main() {
    vec2 f = texture2D(uPrev, vUv).xy;
    // se arrastra a sí mismo: los remolinos viajan un poco antes de apagarse
    f = texture2D(uPrev, vUv - f * 0.006).xy * uDecay;
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    f += uVel * exp(-dot(d, d) / 0.014);
    gl_FragColor = vec4(clamp(f, -3.0, 3.0), 0.0, 1.0);
  }
`;

export const MARMOL = /* glsl */ `
  precision highp float;
  uniform sampler2D uFlow;
  uniform float uTime;
  uniform float uAspect;
  uniform float uFuerza;
  uniform vec3 uBase;
  uniform vec3 uNube;
  uniform vec3 uVeta;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p * 2.03 + 11.7;
      a *= 0.5;
    }
    return v;
  }
  float veta(float x, float filo) { return pow(1.0 - abs(sin(x)), filo); }

  void main() {
    vec2 flow = texture2D(uFlow, vUv).xy;
    vec2 p = vec2(vUv.x * uAspect, vUv.y) * 1.3;
    p -= flow * 0.42;
    float t = uTime;
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.03)), fbm(p + vec2(5.2, 1.3) - t * 0.02));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.02), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.015));
    float f = fbm(p + 3.2 * r);

    float v1 = veta((p.x * 0.55 + p.y * 0.95 + f * 2.7) * 2.1, 22.0);
    float v2 = veta((p.x * 1.4 - p.y * 0.5 + r.y * 3.2) * 2.3, 38.0) * 0.34;
    float v3 = veta((p.y * 1.2 + q.x * 4.5) * 3.2, 70.0) * 0.12;
    float manto = smoothstep(0.3, 0.8, f);

    vec3 col = mix(uBase, uNube, clamp(manto * 0.8 + (r.x - 0.5) * 0.5, 0.0, 1.0));
    float v = clamp(v1 * 0.9 + v2 + v3, 0.0, 1.0) * (0.45 + 0.55 * smoothstep(0.25, 0.7, q.y));
    col = mix(col, uVeta, v * uFuerza);
    col += (hash(gl_FragCoord.xy + fract(t) * 91.7) - 0.5) * 0.014;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * @param zona    el contenedor (define el tamaño; el cursor se lee sobre él)
 * @param canvas  lienzo que lo cubre
 * @param opts.theme 'dark' | 'light' · opts.fuerza  cuánto se marcan las vetas (1 = normal)
 */
export function crearMarmol(zona, canvas, { theme = 'dark', fuerza = 1 } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  } catch {
    return null;
  }
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(2, 2);

  const opciones = {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
  };
  let a = new THREE.WebGLRenderTarget(256, 256, opciones);
  let b = new THREE.WebGLRenderTarget(256, 256, opciones);

  const matFlujo = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FLUJO,
    uniforms: {
      uPrev: { value: a.texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uAspect: { value: 1 },
      uDecay: { value: 0.985 },
    },
  });
  const matMarmol = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: MARMOL,
    uniforms: {
      uFlow: { value: a.texture },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uFuerza: { value: 0.6 },
      uBase: { value: new THREE.Vector3() },
      uNube: { value: new THREE.Vector3() },
      uVeta: { value: new THREE.Vector3() },
    },
  });
  const escFlujo = new THREE.Scene();
  escFlujo.add(new THREE.Mesh(geo, matFlujo));
  const escMarmol = new THREE.Scene();
  escMarmol.add(new THREE.Mesh(geo, matMarmol));

  const setTheme = (t) => {
    const p = TONOS[t] || TONOS.dark;
    matMarmol.uniforms.uBase.value.fromArray(p.base);
    matMarmol.uniforms.uNube.value.fromArray(p.nube);
    matMarmol.uniforms.uVeta.value.fromArray(p.veta);
    matMarmol.uniforms.uFuerza.value = p.fuerza * fuerza;
  };
  setTheme(theme);

  const medir = () => {
    const w = zona.clientWidth;
    const h = zona.clientHeight;
    const tactil = window.matchMedia('(hover: none)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tactil ? 1 : 1.5));
    renderer.setSize(w, h, false);
    matMarmol.uniforms.uAspect.value = w / h;
    matFlujo.uniforms.uAspect.value = w / h;
  };
  medir();
  const ro = new ResizeObserver(medir);
  ro.observe(zona);

  // Empujón del cursor, en coordenadas 0..1 de la zona (y hacia arriba)
  const m = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, dentro: false };
  const alMover = (e) => {
    const r = zona.getBoundingClientRect();
    m.x = (e.clientX - r.left) / r.width;
    m.y = 1 - (e.clientY - r.top) / r.height;
    if (!m.dentro) {
      m.px = m.x;
      m.py = m.y;
      m.dentro = true;
    }
  };
  const alSalir = () => {
    m.dentro = false;
  };
  zona.addEventListener('pointermove', alMover, { passive: true });
  zona.addEventListener('pointerleave', alSalir);

  const inicio = performance.now();
  let raf = 0;
  const cuadro = (ahora) => {
    raf = requestAnimationFrame(cuadro);
    if (document.hidden) return;
    const r = zona.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;

    const asp = matFlujo.uniforms.uAspect.value;
    let vx = (m.x - m.px) * asp;
    let vy = m.y - m.py;
    m.px = m.x;
    m.py = m.y;
    const mag = Math.hypot(vx, vy);
    const tope = 0.06;
    if (mag > tope) {
      vx *= tope / mag;
      vy *= tope / mag;
    }
    matFlujo.uniforms.uMouse.value.set(m.x, m.y);
    matFlujo.uniforms.uVel.value.set(vx * 9, vy * 9);
    matFlujo.uniforms.uPrev.value = a.texture;
    renderer.setRenderTarget(b);
    renderer.render(escFlujo, cam);
    renderer.setRenderTarget(null);
    [a, b] = [b, a];

    matMarmol.uniforms.uFlow.value = a.texture;
    matMarmol.uniforms.uTime.value = (ahora - inicio) / 1000;
    renderer.render(escMarmol, cam);
  };
  raf = requestAnimationFrame(cuadro);
  return {
    setTheme,
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      zona.removeEventListener('pointermove', alMover);
      zona.removeEventListener('pointerleave', alSalir);
      a.dispose();
      b.dispose();
      geo.dispose();
      matFlujo.dispose();
      matMarmol.dispose();
      renderer.dispose();
    },
  };
}
