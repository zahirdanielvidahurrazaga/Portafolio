# Pantalla para el MOCKUP de la portada (iPad horizontal, 2732×2048 = iPad Pro 12.9").
# Se mete en Shots.so / Mockuuups (con manos) — como la referencia "Kuro", pero con
# lo nuestro: negro, polvo de partículas sutil, ΚΛΙΖΣΝ gigante en hueso.
#   python3 tools/redes/pantalla_ipad.py → ~/Desktop/KaiZen-carrusel-minimal/pantalla-ipad.png
import os, random
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FUENTES = os.path.join(RAIZ, 'tools/marca/.fuentes')
W, H = 2732, 2048
PAD = 190
BG = (10, 10, 11)
HUESO = (236, 232, 223)

def F(nombre, tam, peso, opsz=None):
    f = ImageFont.truetype(os.path.join(FUENTES, nombre), tam)
    f.set_variation_by_axes([peso] if opsz is None else [opsz, peso])
    return f

WORDMARK = [
    [(7, 0), (7, 100)], [(66, 0), (12, 54)], [(30, 37), (70, 100)],
    [(92, 100), (132, 6), (172, 100)], [(201, 0), (201, 100)],
    [(230, 7), (300, 7), (230, 93), (300, 93)],
    [(388, 7), (322, 7), (360, 50), (322, 93), (388, 93)],
    [(417, 100), (417, 7), (473, 93), (473, 0)],
]

img = Image.new('RGB', (W, H), BG)
# Polvo sutil, más denso abajo
random.seed(11)
capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(capa)
for _ in range(5200):
    x = random.uniform(0, W)
    y = H * (1 - random.random() ** 1.8)
    r = random.uniform(1.2, 3.6)
    d.ellipse([x - r, y - r, x + r, y + r], fill=HUESO + (random.randint(18, 70),))
img = Image.alpha_composite(img.convert('RGBA'), capa).convert('RGB')
d = ImageDraw.Draw(img)

# Arriba a la izquierda: una sola línea
f = F('Inter.ttf', 54, 500, 14)
d.text((PAD, PAD - 10), 'Digital & Business Solutions.', font=f, fill=HUESO)
# Arriba a la derecha: la Κ
s = 1.7
for t in [[(33, 27), (33, 73)], [(66, 27), (38, 52)], [(48, 44), (68, 73)]]:
    d.line([(W - PAD - 120 + x * s, PAD - 50 + y * s) for x, y in t], fill=HUESO, width=int(12 * s), joint='curve')

# ΚΛΙΖΣΝ gigante abajo, desde el PNG del logo (esquinas en punta como el original)
lg = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/KaiZen-logo-hueso.png')).convert('RGBA')
lg = lg.crop(lg.getbbox())
ancho = W - 2 * PAD
lg = lg.resize((ancho, int(lg.height * ancho / lg.width)), Image.LANCZOS)
img.paste(lg, (PAD, H - PAD - lg.height), lg)

out = os.path.expanduser('~/Desktop/KaiZen-carrusel-minimal/pantalla-ipad.png')
img.save(out, optimize=True)
print('listo →', out)
