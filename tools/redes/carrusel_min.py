# Carrusel MINIMALISTA en inglés (4:5, 1080×1350), estilo de la referencia "Kuro":
# negro, patrón tenue de la Κ, ΚΛΙΖΣΝ gigante en hueso, poco texto y mucho aire.
#   python3 tools/redes/carrusel_min.py → ~/Desktop/KaiZen-carrusel-minimal/01…05.jpg
import os
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FUENTES = os.path.join(RAIZ, 'tools/marca/.fuentes')
SALIDA = os.path.expanduser('~/Desktop/KaiZen-carrusel-minimal')
os.makedirs(SALIDA, exist_ok=True)

K = 2
W, H = 1080 * K, 1350 * K
PAD = 92 * K
BG = (10, 10, 11)
HUESO = (236, 232, 223)
TENUE = (122, 120, 116)

def F(nombre, tam, peso, opsz=None):
    f = ImageFont.truetype(os.path.join(FUENTES, nombre), int(tam * K))
    f.set_variation_by_axes([peso] if opsz is None else [opsz, peso])
    return f

def texto(d, xy, s, f, fill, track=0.0):
    x, y = xy
    for ch in s:
        d.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + track * f.size
    return x

def ancho(s, f, track=0.0):
    return sum(f.getlength(ch) + track * f.size for ch in s)

WORDMARK = [
    [(7, 0), (7, 100)], [(66, 0), (12, 54)], [(30, 37), (70, 100)],
    [(92, 100), (132, 6), (172, 100)],
    [(201, 0), (201, 100)],
    [(230, 7), (300, 7), (230, 93), (300, 93)],
    [(388, 7), (322, 7), (360, 50), (322, 93), (388, 93)],
    [(417, 100), (417, 7), (473, 93), (473, 0)],
]
K_ICONO = [[(33, 27), (33, 73)], [(66, 27), (38, 52)], [(48, 44), (68, 73)]]

def lineas(d, trazos, escala, ox, oy, grosor, color):
    for t in trazos:
        d.line([(ox + x * escala, oy + y * escala) for x, y in t], fill=color, width=max(1, int(grosor * escala)), joint='curve')

def wordmark(d, x, y, ancho_px, color, grosor=15):
    """ΚΛΙΖΣΝ en trazo recto, como el logo (x,y = esquina superior izquierda)."""
    esc = ancho_px / 473
    # Las puntas de la Λ y la N salen del marco: se recorta igual que en el sitio
    capa = Image.new('L', (W, H), 0)
    dc = ImageDraw.Draw(capa)
    lineas(dc, WORDMARK, esc, x, y, grosor, 255)
    caja = Image.new('L', (W, H), 0)
    ImageDraw.Draw(caja).rectangle([x - 8 * esc, y - 10 * esc, x + 490 * esc, y + 110 * esc], fill=255)
    from PIL import ImageChops
    return ImageChops.multiply(capa, caja), color

def logo_hueso(ancho_px):
    """ΚΛΙΖΣΝ desde el PNG del logo (esquinas en punta, idéntico al del sitio)."""
    lg = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/KaiZen-logo-hueso.png')).convert('RGBA')
    lg = lg.crop(lg.getbbox())
    return lg.resize((int(ancho_px), int(lg.height * ancho_px / lg.width)), Image.LANCZOS)

def icono_k(d, x, y, lado, color):
    s = lado / 100
    lineas(d, K_ICONO, s, x, y, 12, color)

def patron(img, cantidad=2600, semilla=7):
    """Polvo de partículas MUY sutil (la firma del sitio), más denso hacia abajo,
    donde va ΚΛΙΖΣΝ. Reemplazó a un patrón de Κ repetidas que no gustó."""
    import random
    random.seed(semilla)
    w, h = img.size
    capa = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    for _ in range(cantidad):
        x = random.uniform(0, w)
        y = h * (1 - random.random() ** 1.8)  # cargado hacia abajo
        r = random.uniform(0.6, 1.8) * K
        d.ellipse([x - r, y - r, x + r, y + r], fill=HUESO + (random.randint(18, 70),))
    img.paste(Image.alpha_composite(img.convert('RGBA'), capa).convert('RGB'))

def lienzo(con_patron=False):
    img = Image.new('RGB', (W, H), BG)
    if con_patron:
        patron(img)
    d = ImageDraw.Draw(img)
    # Κ pequeña arriba a la derecha (marca discreta en todas)
    icono_k(d, W - PAD - 58 * K, 78 * K, 70 * K, HUESO)
    return img, d

def pegar_mascara(img, mascara, color):
    img.paste(Image.new('RGB', (W, H), color), (0, 0), mascara)

def guardar(img, n):
    img.resize((1080, 1350), Image.LANCZOS).save(os.path.join(SALIDA, f'{n:02d}.jpg'), quality=94)

PEQ = F('Inter.ttf', 22, 500, 14)
GRANDE = F('FG.ttf', 92, 700)
GRANDE_IT = F('FG-It.ttf', 92, 500)

# 01 · Portada estilo "Kuro": línea arriba, ΚΛΙΖΣΝ gigante abajo
img, d = lienzo(con_patron=True)
texto(d, (PAD, 92 * K), 'Digital & Business Solutions.', PEQ, HUESO)
lg = logo_hueso(W - 2 * PAD)
img.paste(lg, (PAD, H - PAD - lg.height), lg)
guardar(img, 1)

# 02 · Technology should adapt to you.
img, d = lienzo()
y = H * 0.40
texto(d, (PAD, y), 'Technology should', GRANDE, HUESO, -0.04)
texto(d, (PAD, y + 104 * K), 'adapt to you.', GRANDE, HUESO, -0.04)
texto(d, (PAD, y + 250 * K), 'Not the other way around.', GRANDE_IT, TENUE, -0.035)
guardar(img, 2)

# 03 · We design. We develop. We automate. We optimize.
img, d = lienzo()
y = H * 0.30
for i, verbo in enumerate(['design.', 'develop.', 'automate.', 'optimize.']):
    x = texto(d, (PAD, y + i * 128 * K), 'We ', GRANDE, TENUE, -0.04)
    texto(d, (x, y + i * 128 * K), verbo, GRANDE_IT, HUESO, -0.035)
guardar(img, 3)

# 04 · Your business. Your way. Built better.
img, d = lienzo()
y = H * 0.33
for i, (s, f, col) in enumerate([('Your business.', GRANDE, HUESO), ('Your way.', GRANDE, HUESO), ('Built better.', GRANDE_IT, TENUE)]):
    texto(d, (PAD, y + i * 116 * K), s, f, col, -0.04)
guardar(img, 4)

# 05 · Cierre: ΚΛΙΖΣΝ al centro + una línea + el sitio, chiquito
img, d = lienzo(con_patron=True)
lg = logo_hueso(W * 0.56)
img.paste(lg, (int((W - lg.width) / 2), int(H * 0.40)), lg)
s = 'Solutions designed around your business.'
f = F('FG.ttf', 34, 500)
texto(d, ((W - ancho(s, f, -0.01)) / 2, H * 0.40 + 190 * K), s, f, HUESO, -0.01)
s = 'KAIZENSTUDIOMX.COM'
texto(d, ((W - ancho(s, PEQ, 0.16)) / 2, H - PAD - 30 * K), s, PEQ, TENUE, 0.16)
guardar(img, 5)
print('listo →', SALIDA)
