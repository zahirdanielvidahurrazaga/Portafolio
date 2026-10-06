# Imagen al compartir el link (WhatsApp, redes) — KaiZen, 2026-10-05.
# Reemplazó a og.mjs/og.html (estos usaban playwright, que ya no está instalado,
# y traían la foto de Zahir y el slogan viejo).
#   python3 tools/marca/og.py   → public/og-image-vN.jpg (ajustar SALIDA)
# Fuentes (OFL, no van en el repo): bajarlas a tools/marca/.fuentes/
#   FG.ttf     https://github.com/google/fonts/raw/main/ofl/familjengrotesk/FamiljenGrotesk%5Bwght%5D.ttf
#   FG-It.ttf  https://github.com/google/fonts/raw/main/ofl/familjengrotesk/FamiljenGrotesk-Italic%5Bwght%5D.ttf
#   Inter.ttf  https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf
# ⚠️ WhatsApp cachea la vista previa por URL: si cambias el diseño, sube el
#    número (og-image-v4.jpg…) y actualiza og:image y twitter:image en index.html.
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '.fuentes'))
SALIDA = os.path.join('..', '..', '..', 'public', 'og-image-v4.jpg')
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

K = 2
W, H = 1200 * K, 630 * K
BG = (11, 11, 12)
HUESO = (236, 232, 223)
MUTED = (134, 134, 139)

def fuente(path, size, peso, opsz=None):
    f = ImageFont.truetype(path, size * K)
    ejes = [peso] if opsz is None else [opsz, peso]
    f.set_variation_by_axes(ejes)
    return f

def texto(draw, xy, s, f, fill, track=0.0):
    """Texto con tracking (en em). Devuelve el x final."""
    x, y = xy
    for ch in s:
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + track * f.size
    return x

def ancho(s, f, track=0.0):
    return sum(f.getlength(ch) + track * f.size for ch in s)

img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)
PAD = 64 * K

# Cabecera de revista con filete (como el hero)
inter = fuente('Inter.ttf', 17, 500, 14)
texto(d, (PAD, 58 * K), 'MARCA · REDES · WEB · APPS', inter, MUTED, 0.12)
derecha = 'Nº 01 — 2026'
texto(d, (W - PAD - ancho(derecha, inter, 0.12), 58 * K), derecha, inter, MUTED, 0.12)
d.line([(PAD, 96 * K), (W - PAD, 96 * K)], fill=(70, 70, 74), width=K)

# Titular: "Evoluciona la forma / en que *haces negocio*"
t1 = fuente('FG.ttf', 100, 700)
t2 = fuente('FG-It.ttf', 100, 600)
TR = -0.045
y1, y2 = 150 * K, 252 * K
texto(d, (PAD, y1), 'Evoluciona la forma', t1, (245, 245, 247), TR)
x = texto(d, (PAD, y2), 'en que ', t1, (245, 245, 247), TR)
# Itálica con el degradado del sitio (blanco → gris cálido)
mask = Image.new('L', (W, H), 0)
texto(ImageDraw.Draw(mask), (x, y2), 'haces negocio', t2, 255, TR)
grad = Image.new('RGB', (W, H))
gd = ImageDraw.Draw(grad)
for i in range(W):
    t = min(1, max(0, (i - x) / (ancho('haces negocio', t2, TR) or 1)))
    c = tuple(int(a + (b - a) * t) for a, b in zip((255, 255, 255), (165, 160, 152)))
    gd.line([(i, 0), (i, H)], fill=c)
img.paste(grad, (0, 0), mask)

# ΚΛΙΖΣΝ hecho de PARTÍCULAS (como la apertura del sitio), abajo a la izquierda
esc = 0.78 * K
ox, oy = PAD + 8 * K, 468 * K
wm = Image.new('L', (W, H), 0)
wd = ImageDraw.Draw(wm)
trazos = [
    [(7, 0), (7, 100)], [(66, 0), (12, 54)], [(30, 37), (70, 100)],
    [(92, 100), (132, 6), (172, 100)],
    [(201, 0), (201, 100)],
    [(230, 7), (300, 7), (230, 93), (300, 93)],
    [(388, 7), (322, 7), (360, 50), (322, 93), (388, 93)],
    [(417, 100), (417, 7), (473, 93), (473, 0)],
]
for tr in trazos:
    pts = [(ox + px * esc, oy + py * esc) for px, py in tr]
    wd.line(pts, fill=255, width=int(16 * esc), joint='curve')
random.seed(20261005)
px = wm.load()
capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
cd = ImageDraw.Draw(capa)
x0, y0, x1, y1b = wm.getbbox()
n = 0
while n < 5200:
    rx, ry = random.uniform(x0, x1), random.uniform(y0, y1b)
    if px[int(rx), int(ry)] > 128:
        r = random.uniform(0.9, 2.1) * K
        a = random.randint(150, 255)
        cd.ellipse([rx - r, ry - r, rx + r, ry + r], fill=HUESO + (a,))
        n += 1
# Unas cuantas sueltas alrededor: se siente "formándose"
for _ in range(420):
    rx = random.gauss((x0 + x1) / 2, (x1 - x0) * 0.42)
    ry = random.gauss((y0 + y1b) / 2, (y1b - y0) * 0.9)
    r = random.uniform(0.7, 1.5) * K
    cd.ellipse([rx - r, ry - r, rx + r, ry + r], fill=HUESO + (random.randint(40, 120),))
img = Image.alpha_composite(img.convert('RGBA'), capa).convert('RGB')
d = ImageDraw.Draw(img)

# Firma a la derecha, al ras del wordmark
lema = fuente('FG-It.ttf', 30, 500)
s = 'Proyectos reales, no demos.'
texto(d, (W - PAD - ancho(s, lema, -0.02), 528 * K), s, lema, MUTED, -0.02)

img.resize((1200, 630), Image.LANCZOS).save(SALIDA, quality=88, optimize=True)
print('ok')
