// Rasteriza la marca a los PNG de respaldo. Ver README.md de esta carpeta.
// node tools/marca/iconos.mjs
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUB = path.join(RAIZ, 'public');

// La Z es el glifo de SF Pro Display Bold horneado como trazo (ver z-glifo.py).
const ZPATH =
  'M171.85 365V335.24L282.74 185.52V184.62H174.42V147H337.05V176.69L226.62 326.48V327.38H340.15V365Z';

const svg = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs><linearGradient id="zg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0A84FF"/><stop offset="1" stop-color="#0052CC"/>
  </linearGradient></defs>
  <rect width="512" height="512" rx="${rx}" fill="url(#zg)"/>
  <path fill="#fff" d="${ZPATH}"/>
</svg>`;

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

// [archivo, tamaño, radio, fondo transparente]
// El apple-touch-icon va a sangre (rx 0): iOS le pone sus propias esquinas.
const salidas = [
  ['favicon-32.png', 32, 115, true],
  ['favicon-96.png', 96, 115, true],
  ['apple-touch-icon.png', 180, 0, false],
];

for (const [nombre, size, rx, alfa] of salidas) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0;width:${size}px;height:${size}px">${svg(rx)}</body>`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(PUB, nombre), omitBackground: alfa });
  await page.close();
  console.log('ok →', nombre, size + 'px');
}
await browser.close();
