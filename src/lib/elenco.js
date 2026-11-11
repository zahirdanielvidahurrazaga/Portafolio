import * as THREE from 'three';

/**
 * EL ELENCO (Demos, 2026-11-11) — de premotio.com y errormade.tech.
 * Un solo lienzo fijo y las MISMAS demos, que nunca se van: solo cambian de
 * formación con el scroll.
 *   01 NUBE     flotan en profundidad, con foco real: la de enfrente nítida,
 *               las de atrás desenfocadas (no solo más chicas).
 *   02 ANILLO   carrusel sobre un piso pulido que las refleja. Avanza de giro
 *               en giro (se detiene en cada uno) y el texto dice cuál es.
 *   03 ABANICO  una mano de cartas.
 *   04 FILA     formadas como una línea de producto, con su nombre debajo: ya
 *               se pueden tocar (se levanta la que señalas → alElegir).
 * Cada tarjeta es "vidrio": esquinas de pantalla, filo de luz, un brillo que
 * la barre cuando gira y desenfoque por distancia (mipmaps + 5 muestras).
 * Errormade: las orillas de la pantalla las enrollan al entrar y salir (un
 * "tambor" en el shader de vértices), y la velocidad del scroll atrasa su
 * centro y separa los colores.
 * Supone 5 verticales + 1 horizontal al final (tabla NUBE y reparto de la fila).
 * Todo es f(scroll). El DOM (texto, marcas, etiquetas) lo pone Demos.jsx; aquí
 * solo se escribe su contenido y se acomodan las etiquetas bajo cada tarjeta.
 * ⚠️ Las texturas van SIN colorSpace: el shader escribe el color tal cual (con
 * SRGBColorSpace salían oscuras).
 */

// Tramos de p donde cada formación está quieta; entre uno y otro, la mezcla
const T = [
  [0, 0.07],
  [0.18, 0.57],
  [0.68, 0.76],
  [0.88, 1],
];
// Por formación: foco (cuánto desenfoca la distancia), reflejo del piso y cabeceo de la escena
const FOCO = [1, 1, 0, 0];
const REFLEJO = [0, 0.5, 0, 0.16]; // en la fila casi nada: ahí van los nombres
const CABECEO = [0, 0.13, 0, 0.05];
const FOV = 35;
const CAM_Z = 10;
const ASP = 0.56; // tarjeta vertical (las capturas son 0.52: casi no se recortan)
const ASP_ANCHA = 1.7;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;

const VERT = /* glsl */ `
  uniform float uTan;
  uniform float uVel;
  uniform vec3 uPisoP;
  uniform vec3 uPisoN;
  varying vec2 vUv;
  varying float vHondo;
  varying float vPiso;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPiso = dot(wp.xyz - uPisoP, uPisoN); // altura sobre el piso (negativa = es un reflejo)
    vec4 mv = viewMatrix * wp;
    // el centro de cada tarjeta se atrasa con la velocidad del scroll
    mv.y += uVel * sin(uv.x * 3.14159);
    // el tambor: cerca de la orilla de arriba o de abajo, la tarjeta se enrolla hacia atrás
    float h = -mv.z * uTan;
    float lim = h * 0.7;
    float R = h * 0.6;
    float fuera = max(0.0, abs(mv.y) - lim);
    float phi = min(fuera / R, 1.5708);
    float z = R * (1.0 - cos(phi));
    mv.y = sign(mv.y) * (min(abs(mv.y), lim) + R * sin(phi));
    mv.z -= z;
    vHondo = z / R;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uCubre;
  uniform float uAsp;
  uniform float uVel;
  uniform float uBlur;
  uniform float uApaga;
  uniform float uBrillo;
  uniform float uBrilloF;
  uniform float uReflejo;
  uniform vec3 uFondo;
  uniform vec3 uTinta;
  varying vec2 vUv;
  varying float vHondo;
  varying float vPiso;
  void main() {
    float atras = gl_FrontFacing ? 0.0 : 1.0;
    // por detrás se ve la misma pantalla (sin espejo), como a través de un vidrio esmerilado
    float ux = mix(vUv.x, 1.0 - vUv.x, atras);
    vec2 uv = vec2((ux - 0.5) * uCubre.x + 0.5, 1.0 - (1.0 - vUv.y) * uCubre.y);
    float b = clamp(uBlur + atras * 0.5 + vHondo * 0.6, 0.0, 1.0);
    vec3 col;
    if (b < 0.02) {
      float off = uVel * 0.02;
      col = vec3(texture2D(uTex, uv + vec2(0.0, off)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(0.0, off)).b);
    } else {
      // desenfoque: niveles bajos del mipmap + 5 muestras para que no se vea cuadriculado
      float lod = b * 5.5;
      vec2 r = vec2(b * 0.014 / uAsp, b * 0.014);
      col = (texture2D(uTex, uv, lod).rgb * 2.0
        + texture2D(uTex, uv + r, lod).rgb + texture2D(uTex, uv - r, lod).rgb
        + texture2D(uTex, uv + vec2(r.x, -r.y), lod).rgb + texture2D(uTex, uv + vec2(-r.x, r.y), lod).rgb) / 6.0;
    }
    // forma: esquinas de pantalla (en unidades del alto), borde más suave si está fuera de foco
    vec2 caja = vec2(uAsp, 1.0);
    float rad = 0.07;
    vec2 q = abs(vUv - 0.5) * caja - (caja * 0.5 - rad);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad;
    float suave = 0.004 + b * 0.04;
    float a = 1.0 - smoothstep(-suave, suave, d);
    if (a < 0.01) discard;
    // brillo que barre el vidrio cuando la tarjeta gira
    float s = (vUv.x * uAsp + vUv.y * 0.55) - uBrillo;
    col += exp(-s * s / 0.045) * 0.16 * uBrilloF * (1.0 - atras);
    // filo de luz en el canto
    float filo = (1.0 - smoothstep(0.0, 0.011, abs(d + 0.009))) * (1.0 - b);
    col = mix(col, uTinta, filo * 0.3);
    col = mix(col, uFondo, clamp(uApaga + vHondo * 0.7 + atras * 0.42, 0.0, 0.92));
    // el reflejo en el piso se apaga con la distancia
    if (uReflejo > 0.0) {
      a *= uReflejo * (1.0 - smoothstep(0.0, 1.15, -vPiso));
      col = mix(col, uFondo, 0.2);
    }
    gl_FragColor = vec4(col, a);
  }
`;

/**
 * @param pista  la pista alta (.el-pista) con .el-escena, .el-txt, .el-n, .el-titulo, .el-sub, .el-ticks i, .el-etq
 * @param opts.demos   [{ id, img, ancha? }] (la horizontal va al final)
 * @param opts.textos()  → { formaciones: [[kicker, tituloHTML, sub], null, […], […]], giros: [{ titulo, sub }], giro: 'Giro' }
 * @param opts.alElegir(demo)  clic en una tarjeta de la fila
 */
export function crearElenco(pista, { demos: DEMOS, textos, alElegir } = {}) {
  const N = DEMOS.length;
  const escena = pista.querySelector('.el-escena');
  const elTxt = pista.querySelector('.el-txt');
  const elN = pista.querySelector('.el-n');
  const elTitulo = pista.querySelector('.el-titulo');
  const elSub = pista.querySelector('.el-sub');
  const canvas = document.createElement('canvas');
  canvas.className = 'el-canvas';
  document.body.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    canvas.remove();
    pista.classList.add('sin-webgl');
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAM_Z;
  const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  // mundo (cabeceo + cursor) → tarjetas, y su espejo bajo el piso
  const mundo = new THREE.Group();
  const espejo = new THREE.Group();
  espejo.scale.y = -1;
  mundo.add(espejo);
  scene.add(mundo);
  const geo = new THREE.PlaneGeometry(1, 1, 10, 36);
  const loader = new THREE.TextureLoader();
  const fondo = new THREE.Color();
  const tinta = new THREE.Color();
  const pisoP = new THREE.Vector3();
  const pisoN = new THREE.Vector3(0, 1, 0);

  const ticks = [...pista.querySelectorAll('.el-ticks i')];
  const etqs = [...pista.querySelectorAll('.el-etq')];

  const cartas = DEMOS.map((d, i) => {
    const uniforms = {
      uTex: { value: null },
      uCubre: { value: new THREE.Vector2(1, 1) },
      uAsp: { value: 1 },
      uTan: { value: tan },
      uVel: { value: 0 },
      uBlur: { value: 0 },
      uApaga: { value: 0 },
      uBrillo: { value: 0 },
      uBrilloF: { value: 0 },
      uReflejo: { value: 0 },
      uFondo: { value: fondo },
      uTinta: { value: tinta },
      uPisoP: { value: pisoP },
      uPisoN: { value: pisoN },
    };
    const base = { vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, transparent: true };
    const mat = new THREE.ShaderMaterial({ ...base, uniforms });
    // El reflejo comparte todo menos su fuerza
    const matR = new THREE.ShaderMaterial({ ...base, depthWrite: false, uniforms: { ...uniforms, uReflejo: { value: 0 } } });
    const o = {
      ...d,
      i,
      mat,
      matR,
      mesh: new THREE.Mesh(geo, mat),
      refl: new THREE.Mesh(geo, matR),
      aspImg: d.ancha ? 1.79 : 0.52,
      sube: 0,
    };
    const tex = loader.load(d.img, (t) => {
      o.aspImg = t.image.width / t.image.height;
    });
    tex.anisotropy = 8;
    uniforms.uTex.value = tex;
    o.mesh.frustumCulled = false;
    o.refl.frustumCulled = false;
    o.refl.renderOrder = -1;
    mundo.add(o.mesh);
    espejo.add(o.refl);
    return o;
  });

  const leerTema = () => {
    const cs = getComputedStyle(document.documentElement);
    fondo.set(cs.getPropertyValue('--bg-color').trim() || '#000');
    tinta.set(cs.getPropertyValue('--text-strong').trim() || '#fff');
  };
  leerTema();
  const mo = new MutationObserver(leerTema);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let vw = 1;
  let vh = 1;
  let W = 1;
  let H = 1;
  const medir = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    H = 2 * CAM_Z * tan;
    W = H * camera.aspect;
  };
  medir();
  window.addEventListener('resize', medir);

  let cx = 0;
  let cy = 0;
  let mx = 0;
  let my = 0;
  let ratonX = -1;
  let ratonY = -1;
  const alMover = (e) => {
    cx = (e.clientX / window.innerWidth) * 2 - 1;
    cy = (e.clientY / window.innerHeight) * 2 - 1;
    ratonX = e.clientX;
    ratonY = e.clientY;
  };
  window.addEventListener('pointermove', alMover, { passive: true });

  // ── Formaciones: cada una escribe posición, giro, escala (y su piso) para la tarjeta c ──
  const NUBE = [
    [-0.44, 0.15, -3.0, 0.14, 0.5, -0.08, 0.82],
    [0.5, 0.19, -1.5, 0.1, -0.5, 0.1, 0.86],
    [0.04, -0.12, 1.3, -0.08, -0.26, 0.05, 0.96],
    [-0.12, 0.24, -6.2, -0.14, 0.3, -0.05, 0.86],
    [0.66, -0.2, -4.4, 0.18, -0.3, -0.1, 0.84],
    [-0.52, -0.26, -0.5, -0.08, 0.42, 0.07, 0.8],
  ];
  const eul = new THREE.Euler(0, 0, 0, 'YXZ');
  const medidas = () => {
    const chico = vw < 820;
    const hC = Math.min(H * (chico ? 0.34 : 0.46), W * 0.22);
    return { chico, hC, centro: chico ? 0 : W * 0.15 };
  };
  let anillo = 0; // qué giro va al frente (puede ir entre dos)
  const formacion = (k, c, t, m, out) => {
    const { hC, centro } = m;
    const i = c.i;
    const prop = c.ancha ? 0.6 : 1; // la horizontal mide menos de alto
    out.piso = -H * 0.31;
    if (k === 0) {
      const n = NUBE[i];
      out.esc = n[6];
      out.pos.set(centro + n[0] * W * 0.5, n[1] * H + Math.sin(t * 0.5 + i * 1.7) * 0.1, n[2]);
      eul.set(n[3] + Math.sin(t * 0.4 + i) * 0.04, n[4] + Math.cos(t * 0.35 + i * 2.1) * 0.05, n[5]);
    } else if (k === 1) {
      const R = Math.max(2.1, Math.min(W * 0.2, 3.1));
      const ang = (i - anillo) * ((Math.PI * 2) / N);
      // la de enfrente crece un poco; las de los lados no dan del todo el canto (se alcanzan a leer)
      const frente = Math.max(0, Math.cos(ang));
      out.esc = 0.94 + 0.12 * frente * frente;
      out.pos.set(centro + Math.sin(ang) * R, out.piso + (hC * prop * out.esc) / 2 + 0.03, 0.5 - R + Math.cos(ang) * R);
      eul.set(0, ang * 0.74, 0);
    } else if (k === 2) {
      const a = (i - (N - 1) / 2) * 0.17 * (1 + mx * 0.12);
      const Rf = H * 0.95;
      out.esc = 0.94;
      out.pos.set(centro + Math.sin(a) * Rf, -H * 1.0 + Math.cos(a) * Rf, -0.7 + i * 0.1);
      eul.set(0, 0, -a);
    } else {
      // fila: 5 verticales + la horizontal, repartidas a lo ancho y paradas en el piso
      const cw = Math.min((W * 0.84) / 7.9, H * 0.4 * ASP);
      const ch = cw / ASP;
      const g = cw * 0.22;
      const anchaW = ch * 0.6 * ASP_ANCHA;
      const total = 5 * cw + anchaW + 5 * g;
      const x = -total / 2 + (c.ancha ? 5 * (cw + g) + anchaW / 2 : i * (cw + g) + cw / 2);
      out.piso = -H * 0.34;
      out.esc = ch / hC;
      out.pos.set(x, out.piso + (ch * prop) / 2 + 0.03 + c.sube * 0.1, c.sube * 0.45);
      eul.set(0, (-x / W) * 0.3, 0);
    }
    out.quat.setFromEuler(eul);
  };

  const A = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), esc: 1, piso: 0 };
  const B = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), esc: 1, piso: 0 };
  const v3 = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const qm = new THREE.Quaternion();
  let ultimoY = window.scrollY;
  let vel = 0;
  let limpio = true;
  let claveTexto = '';
  let version = 0; // sube al cambiar de idioma: obliga a reescribir el texto
  let sobre = -1;
  let enFila = 0;
  let raf = 0;

  const escribir = (clave, n, titulo, sub) => {
    if (clave === claveTexto) return;
    claveTexto = clave;
    elN.textContent = n;
    elTitulo.innerHTML = titulo;
    elSub.textContent = sub;
    elTxt.classList.remove('el-entra');
    void elTxt.offsetWidth;
    elTxt.classList.add('el-entra');
  };

  const cuadro = (ahora) => {
    raf = requestAnimationFrame(cuadro);
    if (document.hidden) return;
    const y = window.scrollY;
    vel += (Math.max(-80, Math.min(80, y - ultimoY)) - vel) * 0.14;
    ultimoY = y;
    const rp = pista.getBoundingClientRect();
    if (rp.bottom < -vh * 0.3 || rp.top > vh * 1.3) {
      sobre = -1; // fuera de pantalla no hay tarjeta señalada
      if (!limpio) {
        renderer.clear();
        limpio = true;
        escena.style.cursor = '';
      }
      return;
    }
    limpio = false;
    const t = ahora / 1000;
    const p = clamp01(-rp.top / (rp.height - vh));
    // ¿entre qué formaciones estamos?
    let k = 0;
    let f = 0;
    for (let j = 0; j < T.length; j++) if (p >= T[j][0]) k = j;
    if (k < T.length - 1 && p > T[k][1]) f = (p - T[k][1]) / (T[k + 1][0] - T[k][1]);
    const k2 = Math.min(T.length - 1, k + 1);
    const fs = smooth(f);
    // El anillo avanza de giro en giro: se detiene en cada uno y luego pasa al siguiente
    const r = clamp01((p - T[1][0]) / (T[1][1] - T[1][0])) * (N - 1);
    const j0 = Math.min(N - 2, Math.floor(r));
    anillo = Math.min(N - 1, j0 + smooth(clamp01((r - j0 - 0.42) / 0.58)));
    const alFrente = Math.round(anillo);

    const m = medidas();
    // El escenario fijo viaja con la página al entrar y al salir: ahí se ve la lente
    const er = escena.getBoundingClientRect();
    const sube = -er.top * (H / vh);
    mx += (cx - mx) * 0.05;
    my += (cy - my) * 0.05;
    mundo.rotation.set(lerp(CABECEO[k], CABECEO[k2], fs) + my * 0.035 + vel * 0.0012, mx * 0.07, 0);
    mundo.position.y = sube;
    mundo.updateMatrixWorld(true);
    const foco = lerp(FOCO[k], FOCO[k2], fs);
    const reflejo = lerp(REFLEJO[k], REFLEJO[k2], fs);
    enFila = k === 3 ? 1 : k === 2 ? fs : 0;

    // ¿Qué tarjeta señala el cursor? (solo ya formadas en fila)
    let nuevoSobre = -1;
    let piso = 0;
    let cerca = 1e9;
    for (const c of cartas) {
      const fi = smooth(clamp01(f * 1.3 - c.i * 0.05));
      formacion(k, c, t, m, A);
      if (fi > 0 && k < T.length - 1) {
        formacion(k + 1, c, t, m, B);
        A.pos.lerp(B.pos, fi);
        // un arco hacia la cámara a media mezcla: se cruzan en profundidad, no en plano
        A.pos.z += Math.sin(fi * Math.PI) * (0.7 + (c.i % 3) * 0.45);
        A.quat.slerp(B.quat, fi);
        // y media vuelta de más, para que la mezcla se sienta como un gesto
        qm.setFromAxisAngle(v3.set(0, 1, 0), Math.sin(fi * Math.PI) * 0.55 * (c.i % 2 ? 1 : -1));
        A.quat.multiply(qm);
        A.esc = lerp(A.esc, B.esc, fi);
        A.piso = lerp(A.piso, B.piso, fi);
      }
      piso = A.piso;
      const asp = c.ancha ? ASP_ANCHA : ASP;
      const alto = m.hC * A.esc * (c.ancha ? 0.6 : 1);
      c.mesh.position.copy(A.pos);
      c.mesh.quaternion.copy(A.quat);
      c.mesh.scale.set(alto * asp, alto, 1);
      c.refl.position.copy(A.pos);
      c.refl.quaternion.copy(A.quat);
      c.refl.scale.copy(c.mesh.scale);
      const u = c.mat.uniforms;
      u.uAsp.value = asp;
      u.uCubre.value.set(Math.min(1, asp / c.aspImg), Math.min(1, c.aspImg / asp));
      u.uVel.value = vel * (H / vh) * 0.9;
      // distancia a la cámara → desenfoque y apagado
      v3.copy(A.pos).applyMatrix4(mundo.matrixWorld);
      const dist = CAM_Z - v3.z;
      cerca = Math.min(cerca, dist);
      c.dist = dist;
      // hacia dónde mira → brillo que la barre
      nrm.set(0, 0, 1).applyQuaternion(A.quat).applyQuaternion(mundo.quaternion);
      u.uBrillo.value = asp * 0.5 + 0.28 + nrm.x * 1.7 + mx * 0.25;
      u.uBrilloF.value = Math.min(1, Math.abs(nrm.x) * 2.2 + Math.abs(vel) * 0.03);
      // pantalla: caja y centro en px (para el cursor y las etiquetas de la fila)
      v3.project(camera);
      c.px = ((v3.x + 1) / 2) * vw;
      c.py = ((1 - v3.y) / 2) * vh;
      const pxU = vh / (2 * tan * dist);
      c.mw = (alto * asp * pxU) / 2;
      c.mh = (alto * pxU) / 2;
      if (enFila > 0.98 && Math.abs(ratonX - c.px) < c.mw + 6 && Math.abs(ratonY - c.py) < c.mh + 6) nuevoSobre = c.i;
    }
    sobre = nuevoSobre;
    escena.style.cursor = sobre >= 0 ? 'pointer' : '';
    // piso (en mundo) para apagar el reflejo con la distancia
    espejo.position.y = 2 * piso;
    pisoP.set(0, piso, 0).applyMatrix4(mundo.matrixWorld);
    pisoN.set(0, 1, 0).applyQuaternion(mundo.quaternion);
    for (const c of cartas) {
      const u = c.mat.uniforms;
      const lejos = clamp01((c.dist - cerca) / 7);
      u.uBlur.value = lejos * 0.85 * foco;
      const otra = sobre >= 0 && sobre !== c.i ? 0.42 : 0;
      c.apaga = lerp(c.apaga ?? 0, lejos * 0.38 * foco + otra, 0.15);
      u.uApaga.value = c.apaga;
      c.matR.uniforms.uReflejo.value = reflejo;
      c.refl.visible = reflejo > 0.01;
      c.sube += ((sobre === c.i ? 1 : 0) - c.sube) * 0.14;
    }

    // ── Texto y marcas ──
    const kT = f > 0.5 ? k + 1 : k;
    escena.classList.toggle('el-escena--fila', kT === 3);
    escena.classList.toggle('el-escena--anillo', kT === 1);
    const tx = textos();
    if (kT === 1) {
      const d = tx.giros[alFrente];
      escribir(`${version}-1-${alFrente}`, `${tx.giro} ${String(alFrente + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`, d.titulo, d.sub);
      ticks.forEach((el, i) => el.classList.toggle('on', i === alFrente));
    } else {
      const x = tx.formaciones[kT];
      escribir(`${version}-${kT}`, x[0], x[1], x[2]);
    }
    // Etiquetas de la fila: debajo de cada tarjeta
    const verEtq = k === 3 ? 1 : 0;
    etqs.forEach((el, i) => {
      const c = cartas[i];
      el.style.opacity = verEtq;
      el.style.transform = `translate(${(c.px - er.left).toFixed(1)}px, ${(c.py + c.mh + 14 - er.top).toFixed(1)}px) translateX(-50%)`;
      el.classList.toggle('on', sobre === i);
    });
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(cuadro);

  // Solo cuenta un clic de verdad SOBRE la tarjeta señalada (antes bastaba con que el cursor
  // se hubiera quedado encima: un Enter en cualquier link abría WhatsApp; lo cachó Codex)
  const alClic = (e) => {
    if (sobre < 0 || enFila < 0.98) return;
    const c = cartas[sobre];
    const encima = Math.abs(e.clientX - c.px) < c.mw + 6 && Math.abs(e.clientY - c.py) < c.mh + 6;
    const enControl = e.target instanceof Element && e.target.closest('a, button, input, textarea, select');
    if (encima && !enControl) alElegir?.(DEMOS[sobre]);
  };
  window.addEventListener('click', alClic);

  return {
    /** Cambió el idioma: vuelve a escribir el texto */
    refrescar() {
      version++;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', medir);
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('click', alClic);
      mo.disconnect();
      canvas.remove();
      geo.dispose();
      for (const c of cartas) {
        c.mat.uniforms.uTex.value?.dispose();
        c.mat.dispose();
        c.matR.dispose();
      }
      renderer.dispose();
    },
  };
}
