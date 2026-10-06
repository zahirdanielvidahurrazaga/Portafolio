// Captura cuadro por cuadro del sitio para el video de Historias (9:16).
// El reloj de la página está controlado (page.clock) y el scroll se fija en
// cada cuadro, así el resultado es perfectamente fluido.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const FPS = 30;
const DT = 1000 / FPS;
const OUT = 'frames';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lin = (x) => x;
// Suave pero SIN detenerse en los extremos (velocidad 0.55 al entrar y salir):
// con ease-in-out puro cada toma arrancaba desde cero tras el corte y se sentía trabada
const fluida = (x) => 0.55 * x + 0.45 * (0.5 - 0.5 * Math.cos(Math.PI * x));

// Tomas: sel = elemento cuya pista de scroll se recorre (q 0..1), de/a = progreso
// Duración total según VERSION (15 o 30 s). La de 30 es la misma historia, más pausada.
const VERSION = process.env.VERSION === '30' ? 30 : 15;
const TOMAS =
  VERSION === 30
    ? [
        { nombre: 'intro', dur: 4.5, sel: null },
        { nombre: 'hero', dur: 7.0, sel: '.hero-section', de: 0.03, a: 0.74, curva: fluida },
        { nombre: 'titular', dur: 1.8, sel: '.hero-section', de: 0.74, a: 0.85, curva: lin },
        // Más figuras: plumilla → corazón → cohete → navegador → carrito
        { nombre: 'servicios', dur: 6.0, sel: '.srv-pista', de: 0.02, a: 0.62, curva: lin },
        // Hasta que cae la Κ en la pantalla de inicio (el video termina en 0.8)
        { nombre: 'mac', dur: 6.0, sel: '.reel', de: 0.04, a: 0.66, curva: fluida },
        { nombre: 'final', dur: 4.5, sel: '.interludio--k', de: -0.02, a: 0.42, curva: fluida },
      ]
    : [
        { nombre: 'intro', dur: 3.0, sel: null },
        { nombre: 'hero', dur: 3.6, sel: '.hero-section', de: 0.03, a: 0.74, curva: fluida },
        { nombre: 'titular', dur: 0.8, sel: '.hero-section', de: 0.74, a: 0.82, curva: lin },
        // Menos figuras (corazón → cohete → navegador): con 4 cambios en 3 s cada morph duraba 3 cuadros
        { nombre: 'servicios', dur: 3.0, sel: '.srv-pista', de: 0.1, a: 0.44, curva: lin },
        { nombre: 'mac', dur: 2.7, sel: '.reel', de: 0.04, a: 0.6, curva: fluida },
        { nombre: 'final', dur: 2.2, sel: '.interludio--k', de: -0.02, a: 0.42, curva: fluida },
      ];

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--enable-gpu-rasterization'],
});
const ctx = await browser.newContext({
  viewport: { width: 405, height: 720 },
  deviceScaleFactor: 3.3333,
  colorScheme: 'dark',
  locale: 'es-MX',
});
const page = await ctx.newPage();
await page.clock.install({ time: 0 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
// Sin el botón de WhatsApp ni la barra de scroll en el video
await page.addStyleTag({ content: '.floating-whatsapp,.barra-scroll,.interludio--k .interludio-extra{display:none!important}' });

const scrollDe = (sel, q) =>
  page.evaluate(
    ([sel, q]) => {
      const el = document.querySelector(sel);
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      return Math.max(0, top + q * travel);
    },
    [sel, q]
  );

let n = 0;
let reloj = 0;
const marcas = [];
for (const toma of TOMAS) {
  const cuadros = process.env.RAPIDO ? 3 : Math.round(toma.dur * FPS);
  marcas.push({ nombre: toma.nombre, desde: n, cuadros });
  let y0 = 0;
  let y1 = 0;
  if (toma.sel) {
    y0 = await scrollDe(toma.sel, toma.de);
    y1 = await scrollDe(toma.sel, toma.a);
  }
  for (let i = 0; i < cuadros; i++) {
    if (toma.sel) {
      const y = y0 + (y1 - y0) * toma.curva(i / (cuadros - 1));
      // El evento de scroll se dispara a mano: si se espera al del navegador, a
      // veces llegaba DESPUÉS de la foto y el cuadro salía repetido (tirón).
      await page.evaluate((y) => {
        window.scrollTo(0, y);
        window.dispatchEvent(new Event('scroll'));
      }, y);
    }
    await page.clock.runFor(DT);
    reloj += DT;
    // Las transiciones de CSS corren en tiempo REAL (no las mueve page.clock):
    // filmando en cámara lenta aparecían de golpe. Se pausan y se les pone el
    // tiempo del reloj virtual, desde que nacen.
    await page.evaluate((vt) => {
      for (const a of document.getAnimations()) {
        if (!(a instanceof CSSTransition)) continue; // las de KaizenReel se manejan solas
        if (a.__vt0 === undefined) {
          a.__vt0 = vt;
          a.pause();
        }
        a.currentTime = vt - a.__vt0;
      }
    }, reloj);
    await page.screenshot({ path: `${OUT}/${String(n).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 93 });
    n++;
    if (n % 30 === 0) console.log(`${toma.nombre} · ${n} cuadros`);
  }
}
fs.writeFileSync('marcas.json', JSON.stringify(marcas, null, 1));
console.log('listo', n);
await browser.close();
