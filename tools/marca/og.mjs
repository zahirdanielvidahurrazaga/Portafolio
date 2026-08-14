// Genera la imagen que sale al compartir el link. Ver README.md de esta carpeta.
// node tools/marca/og.mjs
//
// ⚠️ WhatsApp cachea la vista previa por URL: si cambias el DISEÑO de una imagen
//    YA PUBLICADA, cambia SALIDA a og-image-v3.jpg y actualiza og:image y
//    twitter:image en index.html, o seguirá enseñando la vieja durante días.
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../..');
const PUB = path.join(RAIZ, 'public');
const SALIDA = path.join(PUB, 'og-image-v2.jpg');
const FOTO = path.join(PUB, 'sobre-mi.jpg');
const AVATAR = path.join(AQUI, '.avatar-tmp.jpg');
const TMP = path.join(AQUI, '.og-tmp.png');

// Recorte cuadrado a la cara. `sobre-mi.jpg` es de cuerpo entero: si se mete tal
// cual en el círculo, la cabeza queda diminuta y la foto deja de aportar confianza.
// ⚠️ Estas coordenadas son de ESA foto (800×999). Si se cambia la foto, hay que
//    volver a encuadrar: abrir la imagen y ajustar la caja hasta encerrar cabeza y hombros.
const CAJA = [198, 30, 602, 434];

execFileSync('python3', [
  '-c',
  `from PIL import Image
im = Image.open(${JSON.stringify(FOTO)})
im.crop(${JSON.stringify(CAJA)}).resize((520, 520), Image.LANCZOS).save(${JSON.stringify(AVATAR)}, quality=92)`,
]);

const html = fs
  .readFileSync(path.join(AQUI, 'og.html'), 'utf8')
  .replaceAll('__AVATAR__', 'file://' + AVATAR);
fs.writeFileSync(path.join(AQUI, '.og-render.html'), html);

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
// Se fotografía al doble y luego se baja a 1200×630: el texto queda mucho más limpio
// que capturando directo al tamaño final.
const page = await browser.newPage({
  viewport: { width: 1240, height: 700 },
  deviceScaleFactor: 2,
});
await page.goto('file://' + path.join(AQUI, '.og-render.html'));
await page.waitForTimeout(1200);
await page.locator('#og').screenshot({ path: TMP });
await browser.close();

execFileSync('python3', [
  '-c',
  `from PIL import Image
im = Image.open(${JSON.stringify(TMP)}).convert('RGB').resize((1200, 630), Image.LANCZOS)
im.save(${JSON.stringify(SALIDA)}, quality=88, optimize=True)`,
]);

for (const f of [TMP, AVATAR, path.join(AQUI, '.og-render.html')]) fs.rmSync(f, { force: true });
console.log('ok →', path.relative(RAIZ, SALIDA), (fs.statSync(SALIDA).size / 1024).toFixed(0) + ' KB');
