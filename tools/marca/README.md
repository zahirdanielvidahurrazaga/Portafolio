# Generadores de marca

Scripts para **regenerar** los assets de marca. No corren en el build; se usan a mano cuando
cambia el logo, la foto o el texto de la vista previa.

Requieren `playwright-core` (no está en las deps del proyecto a propósito, solo se usa aquí) y
Chrome del sistema:

```bash
npm i -D playwright-core     # o instalarlo en un scratchpad
node tools/marca/iconos.mjs  # → public/favicon-32.png, favicon-96.png, apple-touch-icon.png
node tools/marca/og.mjs      # → public/og-image-v2.jpg (imagen al compartir)
```

## `iconos.mjs` — favicons

Rasteriza `public/favicon.svg` a los PNG de respaldo. El `apple-touch-icon` sale **a sangre
(`rx=0`)**: iOS le pone sus propias esquinas redondeadas y si el PNG ya trae las suyas queda
doble redondeo.

El `.ico` se hace aparte, con PIL:

```bash
python3 -c "from PIL import Image; Image.open('public/favicon-96.png').save('public/favicon.ico', sizes=[(16,16),(32,32),(48,48)])"
```

## `og.mjs` + `og.html` — imagen al compartir

Diseña la imagen **como una página web** y la fotografía a 1200×630. Se edita con CSS, no
píxel por píxel.

⚠️ **WhatsApp cachea la vista previa por URL.** Si cambias el diseño, hay que **renombrar** el
archivo (`og-image-v3.jpg`…) y actualizar `og:image` y `twitter:image` en `index.html`, o
seguirá enseñando la vieja durante días.

## `z-glifo.py` — la Z del logo

Solo hace falta si se cambia la letra o el peso. Saca el contorno real de **SF Pro Display
Bold** y lo convierte en un `<path>`, para que el logo no dependa de que el sistema tenga la
fuente. `SFNS.ttf` es una fuente **variable**: hay que instanciarla en `wght=700` antes de
leer el glifo.

```bash
pip3 install --target ./py fonttools
PYTHONPATH=./py python3 tools/marca/z-glifo.py
```
