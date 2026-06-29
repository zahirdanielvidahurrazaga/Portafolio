/**
 * Liquid Glass REAL — renderer WebGL (vanilla, sin dependencias).
 *
 * Dibuja una "lente" de cristal sobre un fondo procedural (negro casi puro
 * con esferas de glow azul/morada a la deriva, igual que el Hero del sitio) y
 * lo REFRACTA de verdad: SDF de la forma → normal de superficie → muestreo
 * desplazado del fondo + aberración cromática en el borde + brillo especular
 * tipo Fresnel + escarcha interna.
 *
 * WebGL1 + OES_standard_derivatives (soporte universal, incluido Safari).
 * Si no hay WebGL, devuelve null y el CSS backdrop-filter queda como fallback.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2  u_res;     // tamaño del canvas en px
uniform float u_radius;  // radio de esquina (rect redondeado), en unidades-y
uniform float u_shape;     // 0 = rect redondeado, 1 = círculo
uniform float u_intensity; // 1 = fuerte (botón); <1 = más sutil/transparente

// SDF de rectángulo redondeado (p centrado, b = media-extensión, r = radio)
float sdRoundRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// Overlay de ILUMINACIÓN de cristal (transparente en el centro). El frost del
// contenido REAL lo pone el backdrop-filter de CSS por debajo; aquí solo se
// añade el borde refractivo, la aberración cromática, el especular y un barrido
// de luz en movimiento.
void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv - 0.5;
  p.x *= aspect;                          // coords centradas, isotrópicas
  vec2 halfSize = vec2(0.5 * aspect, 0.5);

  float d;
  if (u_shape > 0.5) {
    d = length(p) - 0.5;                  // círculo
  } else {
    d = sdRoundRect(p, halfSize - 0.012, u_radius);
  }

  float aa = fwidth(d);
  float mask = smoothstep(aa, -aa, d);    // 1 dentro, 0 fuera
  if (mask <= 0.001) { discard; }

  float bevel = 0.26;
  float edge = clamp(-d / bevel, 0.0, 1.0);   // 0 en el filo → 1 al centro
  float bend = 1.0 - edge;                    // fuerte en el borde
  float fres = pow(bend, 1.6);                // Fresnel

  vec2 n = normalize(vec2(dFdx(d), dFdy(d)) + 1e-6);

  vec3 col = vec3(0.0);

  // Banda refractiva del borde (luz neutra que se concentra en el filo, tipo
  // lente). Sin color: cristal claro.
  float band = smoothstep(0.5, 1.0, bend);
  col += vec3(0.5) * band;

  // Especular: luz desde arriba-izquierda concentrada en el borde.
  vec2 L = normalize(vec2(-0.5, 0.82));
  float spec = pow(clamp(dot(n, L), 0.0, 1.0), 2.2) * bend;
  col += vec3(0.95, 0.97, 1.0) * spec * 0.75;

  // Barrido de luz que viaja (mata lo "estático").
  vec2 sd = normalize(vec2(0.7, 0.7));
  float proj = dot(p, sd) / aspect;                 // ~[-0.5, 0.5]
  float pos = fract(u_time * 0.16) * 1.6 - 0.8;     // recorre la lente
  float sweep = smoothstep(0.14, 0.0, abs(proj - pos));
  col += vec3(1.0) * sweep * (0.18 + 0.5 * bend);

  // Línea de filo brillante (highlight nítido del cristal), blanco puro.
  float line = smoothstep(0.0, aa * 2.5, -d) - smoothstep(aa * 2.5, aa * 8.0, -d);
  col += vec3(1.0) * max(line, 0.0) * 0.55;

  // Reflejo superior interno tenue.
  float topHi = smoothstep(0.2, 0.55, edge) * smoothstep(0.5, 1.0, uv.y);
  col += vec3(0.14) * topHi;

  // Casi transparente en el centro (se ve el frost real de CSS); sólido al filo.
  // La intensidad controla cuánto "cuerpo" tiene el cristal (transparencia).
  float alpha = mask * clamp((0.07 + 0.85 * fres + sweep * 0.25) * u_intensity, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('[liquidGlass] shader error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ shape?: 'circle'|'rounded', radius?: number, tintA?: string, tintB?: string }} opts
 * @returns {{ destroy(): void } | null}
 */
export function createLiquidGlass(canvas, opts = {}) {
  const gl =
    canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true }) ||
    canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return null;
  if (!gl.getExtension('OES_standard_derivatives')) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[liquidGlass] link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const u = {
    time: gl.getUniformLocation(prog, 'u_time'),
    res: gl.getUniformLocation(prog, 'u_res'),
    radius: gl.getUniformLocation(prog, 'u_radius'),
    shape: gl.getUniformLocation(prog, 'u_shape'),
    intensity: gl.getUniformLocation(prog, 'u_intensity'),
  };

  gl.uniform1f(u.shape, opts.shape === 'circle' ? 1 : 0);
  gl.uniform1f(u.radius, opts.radius ?? 0.5);
  gl.uniform1f(u.intensity, opts.intensity ?? 1.0);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  const resize = () => {
    const cw = Math.max(1, canvas.clientWidth);
    const ch = Math.max(1, canvas.clientHeight);
    if (cw === w && ch === h) return;
    w = cw;
    h = ch;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  let raf = 0;
  let running = true;

  const frame = () => {
    if (!running) return;
    const t = reduce ? 8.0 : (performance.now() - t0) / 1000;
    gl.uniform1f(u.time, t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (reduce) {
      running = false; // un solo frame estático
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  frame();

  // Pausa cuando la pestaña no está visible.
  const onVis = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!reduce) {
      running = true;
      frame();
    }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    },
  };
}
