# Carrusel de lanzamiento "Nº 01" (Instagram/Facebook, 4:5 = 1080×1350).
# Misma estética del sitio: negro + hueso, Familjen Grotesk, cabecera de revista
# con filete, ΚΛΙΖΣΝ e íconos hechos de PARTÍCULAS. Se dibuja al doble y se baja.
#   python3 tools/redes/carrusel.py  → ~/Desktop/KaiZen-carrusel/01…06.jpg
# Fuentes: tools/marca/.fuentes (ver tools/marca/og.py).
import os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FUENTES = os.path.join(RAIZ, 'tools/marca/.fuentes')
SALIDA = os.path.expanduser('~/Desktop/KaiZen-carrusel')
os.makedirs(SALIDA, exist_ok=True)

K = 2
W, H = 1080 * K, 1350 * K
PAD = 84 * K
BG = (11, 11, 12)
HUESO = (236, 232, 223)
BLANCO = (245, 245, 247)
MUTED = (134, 134, 139)
LINEA = (62, 62, 66)
TOTAL = 6

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

def degradado(img, xy, s, f, track=-0.045, de=(255, 255, 255), a=(165, 160, 152)):
    """Texto con el degradado de "haces negocio" (blanco → gris cálido)."""
    m = Image.new('L', img.size, 0)
    texto(ImageDraw.Draw(m), xy, s, f, 255, track)
    w = ancho(s, f, track)
    g = Image.new('RGB', img.size)
    gd = ImageDraw.Draw(g)
    for i in range(int(xy[0]), int(xy[0] + w) + 2):
        t = min(1, max(0, (i - xy[0]) / max(1, w)))
        gd.line([(i, 0), (i, img.size[1])], fill=tuple(int(p + (q - p) * t) for p, q in zip(de, a)))
    img.paste(g, (0, 0), m)

def particulas(img, mascara, n, rmin=1.0, rmax=2.2, sueltas=0, semilla=1):
    """Llena la máscara (L) con puntos hueso, como la nube del sitio."""
    random.seed(semilla)
    px = mascara.load()
    bb = mascara.getbbox()
    if not bb:
        return img
    x0, y0, x1, y1 = bb
    capa = Image.new('RGBA', img.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(capa)
    hechos = 0
    while hechos < n:
        x, y = random.uniform(x0, x1 - 1), random.uniform(y0, y1 - 1)
        if px[int(x), int(y)] > 128:
            r = random.uniform(rmin, rmax) * K
            cd.ellipse([x - r, y - r, x + r, y + r], fill=HUESO + (random.randint(150, 255),))
            hechos += 1
    for _ in range(sueltas):
        x = random.gauss((x0 + x1) / 2, (x1 - x0) * 0.45)
        y = random.gauss((y0 + y1) / 2, (y1 - y0) * 0.9)
        r = random.uniform(0.6, 1.4) * K
        cd.ellipse([x - r, y - r, x + r, y + r], fill=HUESO + (random.randint(40, 110),))
    return Image.alpha_composite(img.convert('RGBA'), capa).convert('RGB')

def trazos(lineas, escala, ox, oy, grosor):
    """Máscara con polilíneas en coordenadas del diseño (como los SVG del sitio)."""
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    for l in lineas:
        d.line([(ox + x * escala, oy + y * escala) for x, y in l], fill=255, width=int(grosor * escala), joint='curve')
        for x, y in (l[0], l[-1]):
            r = grosor * escala / 2
            d.ellipse([ox + x * escala - r, oy + y * escala - r, ox + x * escala + r, oy + y * escala + r], fill=255)
    return m

def bezier(p0, p1, p2, p3, n=40):
    return [tuple((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * e
                  for a, b, c, e in zip(p0, p1, p2, p3)) for t in (i / n for i in range(n + 1))]

WORDMARK = [
    [(7, 0), (7, 100)], [(66, 0), (12, 54)], [(30, 37), (70, 100)],
    [(92, 100), (132, 6), (172, 100)],
    [(201, 0), (201, 100)],
    [(230, 7), (300, 7), (230, 93), (300, 93)],
    [(388, 7), (322, 7), (360, 50), (322, 93), (388, 93)],
    [(417, 100), (417, 7), (473, 93), (473, 0)],
]

# Tipografías
CAB = F('Inter.ttf', 17, 500, 14)
TIT = F('FG.ttf', 112, 700)
TIT_IT = F('FG-It.ttf', 112, 600)
MED = F('FG.ttf', 64, 700)
MED_IT = F('FG-It.ttf', 64, 600)
LEDE = F('FG.ttf', 38, 500)
CUERPO = F('Inter.ttf', 27, 400, 14)
CHICO = F('Inter.ttf', 20, 500, 14)
IDX = F('FG.ttf', 50, 700)
IDX_IT = F('FG-It.ttf', 50, 600)

def base(n, etiqueta):
    """Fondo + cabecera de revista (ΚΛΙΖΣΝ chico · etiqueta · Nº) + contador abajo."""
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    # ΚΛΙΖΣΝ chico en trazo (como la barra del sitio)
    m = trazos(WORDMARK, 0.36 * K, PAD, 62 * K, 15)
    img.paste(Image.new('RGB', (W, H), HUESO), (0, 0), m)
    d = ImageDraw.Draw(img)
    texto(d, (PAD + 230 * K, 66 * K), etiqueta.upper(), CAB, MUTED, 0.14)
    s = 'Nº 01 — 2026'
    texto(d, (W - PAD - ancho(s, CAB, 0.14), 66 * K), s, CAB, MUTED, 0.14)
    d.line([(PAD, 112 * K), (W - PAD, 112 * K)], fill=LINEA, width=K)
    # Pie: contador y sitio
    d.line([(PAD, H - 118 * K), (W - PAD, H - 118 * K)], fill=LINEA, width=K)
    texto(d, (PAD, H - 92 * K), 'KAIZENSTUDIOMX.COM', CHICO, MUTED, 0.14)
    s = f'{n:02d} / {TOTAL:02d}'
    texto(d, (W - PAD - ancho(s, CHICO, 0.14), H - 92 * K), s, CHICO, MUTED, 0.14)
    return img

def guardar(img, n):
    img.resize((1080, 1350), Image.LANCZOS).save(os.path.join(SALIDA, f'{n:02d}.jpg'), quality=93)

# ── 01 · Portada ────────────────────────────────────────────────────────────
img = base(1, 'Estudio de marca y tecnología')
esc = 1.74 * K
ancho_wm = 473 * esc
m = trazos(WORDMARK, esc, (W - ancho_wm) / 2, 250 * K, 17)
img = particulas(img, m, 9000, sueltas=900)
d = ImageDraw.Draw(img)
y = 560 * K
texto(d, (PAD, y), 'Evoluciona la forma', TIT, BLANCO, -0.045)
x = texto(d, (PAD, y + 118 * K), 'en que ', TIT, BLANCO, -0.045)
degradado(img, (PAD, y + 236 * K), 'haces negocio', TIT_IT)
d = ImageDraw.Draw(img)
texto(d, (PAD, 1005 * K), 'Marca · Redes · Web · Apps', LEDE, MUTED, -0.01)
s = 'DESLIZA  →'
texto(d, (W - PAD - ancho(s, CHICO, 0.18), 1150 * K), s, CHICO, HUESO, 0.18)
guardar(img, 1)

# ── 02 · La filosofía ───────────────────────────────────────────────────────
img = base(2, 'La filosofía')
kanji = ImageFont.truetype('/System/Library/Fonts/Hiragino Sans GB.ttc', 330 * K)
m = Image.new('L', (W, H), 0)
dm = ImageDraw.Draw(m)
s = '改善'
dm.text(((W - dm.textlength(s, font=kanji)) / 2, 175 * K), s, font=kanji, fill=255)
img = particulas(img, m, 11000, sueltas=700, semilla=2)
d = ImageDraw.Draw(img)
s = 'KAI · ZEN'
texto(d, ((W - ancho(s, CHICO, 0.4)) / 2, 640 * K), s, CHICO, MUTED, 0.4)
y = 720 * K
texto(d, (PAD, y), 'Mejora continua:', MED, BLANCO, -0.04)
texto(d, (PAD, y + 74 * K), 'pasos pequeños,', MED, BLANCO, -0.04)
degradado(img, (PAD, y + 148 * K), 'todos los días.', MED_IT, -0.04)
d = ImageDraw.Draw(img)
for i, l in enumerate(['Así acompañamos a cada negocio: cuidamos su marca,',
                       'le damos voz en redes y construimos la tecnología',
                       'que lo hace crecer.']):
    texto(d, (PAD, 1000 * K + i * 42 * K), l, CUERPO, MUTED)
guardar(img, 2)

# ── 03 · Lo que hacemos (índice) ────────────────────────────────────────────
img = base(3, 'Lo que hacemos')
d = ImageDraw.Draw(img)
texto(d, (PAD, 160 * K), 'Siete servicios,', MED, BLANCO, -0.04)
degradado(img, (PAD, 234 * K), 'un solo estudio.', MED_IT, -0.04)
d = ImageDraw.Draw(img)
LINEAS = [('Identidad de marca', 'BRAND'), ('Redes sociales', 'SOCIAL'), ('Lanzamiento', 'LAUNCH'),
          ('Sitios web', 'WEB'), ('Tiendas y punto de venta', 'COMMERCE'), ('Automatización e IA', 'AUTOMATE'),
          ('Apps y experiencias', 'EXPERIENCE')]
y = 380 * K
for i, (nombre, linea) in enumerate(LINEAS):
    d.line([(PAD, y), (W - PAD, y)], fill=LINEA, width=K)
    texto(d, (PAD, y + 34 * K), f'{i + 1:02d}', CHICO, MUTED, 0.14)
    texto(d, (PAD + 80 * K, y + 18 * K), nombre, IDX if i % 2 == 0 else IDX_IT, BLANCO if i % 2 == 0 else HUESO, -0.04)
    texto(d, (W - PAD - ancho(linea, CHICO, 0.16), y + 34 * K), linea, CHICO, MUTED, 0.16)
    y += 104 * K
d.line([(PAD, y), (W - PAD, y)], fill=LINEA, width=K)
guardar(img, 3)

# ── 04 · Proyecto real (render de Shots.so) ─────────────────────────────────
img = base(4, 'Proyectos reales, no demos')
d = ImageDraw.Draw(img)
texto(d, (PAD, 160 * K), 'CASO · ESTUDIO DE PILATES', CHICO, MUTED, 0.16)
degradado(img, (PAD, 196 * K), 'Be Fit Lab', TIT_IT)
d = ImageDraw.Draw(img)
mock = Image.open(os.path.join(RAIZ, 'public/mockups/befit-mac.webp')).convert('RGBA')
mw = W - 2 * PAD + 40 * K
mock = mock.resize((int(mw), int(mock.height * mw / mock.width)), Image.LANCZOS)
sombra = Image.new('RGBA', img.size, (0, 0, 0, 0))
mx, my = (W - mock.width) // 2, 380 * K
alfa = mock.split()[3].point(lambda a: int(a * 0.55))
sombra.paste((0, 0, 0, 255), (mx, my + 34 * K), alfa)
sombra = sombra.filter(ImageFilter.GaussianBlur(28 * K))
img = Image.alpha_composite(img.convert('RGBA'), sombra)
img.alpha_composite(mock, (mx, my))
img = img.convert('RGB')
d = ImageDraw.Draw(img)
for i, l in enumerate(['Reservas, membresías con acceso QR, cafetería con pago',
                       'en la app y panel en tiempo real. Publicada en App Store',
                       'y Google Play, ya en operación.']):
    texto(d, (PAD, 1030 * K + i * 42 * K), l, CUERPO, MUTED)
guardar(img, 4)

# ── 05 · Quiénes somos (dos mitades) ────────────────────────────────────────
img = base(5, 'Nosotros')
d = ImageDraw.Draw(img)
texto(d, (PAD, 160 * K), 'Marca + tecnología,', MED, BLANCO, -0.04)
degradado(img, (PAD, 234 * K), 'un solo equipo.', MED_IT, -0.04)
# I · plumilla con su curva   II · </>
cx1, cx2, cy = W * 0.29, W * 0.71, 560 * K
pl = bezier((-120, 110), (-70, -20), (-10, 160), (40, 70))
m = trazos([pl, [(-120, 110), (-88, 28)], [(40, 70), (92, 122)]], 1.25 * K, cx1, cy, 9)
dm = ImageDraw.Draw(m)
ang = -math.pi / 4.6
def rot(x, y):
    return (cx1 + (40 + x * math.cos(ang) - y * math.sin(ang)) * 1.25 * K,
            cy + (70 + x * math.sin(ang) + y * math.cos(ang)) * 1.25 * K)
dm.line([rot(*p) for p in [(0, 0), (-46, -80), (-28, -170), (28, -170), (46, -80), (0, 0)]], fill=255, width=int(11 * K), joint='curve')
dm.line([rot(0, 0), rot(0, -92)], fill=255, width=int(9 * K))
cxr, cyr = rot(0, -100)
dm.ellipse([cxr - 13 * K, cyr - 13 * K, cxr + 13 * K, cyr + 13 * K], outline=255, width=int(9 * K))
codigo = [[(-60, -80), (-120, 0), (-60, 80)], [(60, -80), (120, 0), (60, 80)], [(25, -105), (-25, 105)]]
m2 = trazos(codigo, 1.25 * K, cx2, cy + 30 * K, 24)
mascara = Image.fromarray(__import__('numpy').maximum(__import__('numpy').asarray(m), __import__('numpy').asarray(m2)))
img = particulas(img, mascara, 9000, sueltas=500, semilla=5)
d = ImageDraw.Draw(img)
for x0, num, tit, lineas in (
    (PAD, 'I', 'Estrategia, marca y redes', ['Tu identidad y cómo se', 'comunica en redes.']),
    (W / 2 + 20 * K, 'II', 'Tecnología', ['Sitios, tiendas, apps y', 'sistemas a la medida.']),
):
    d.line([(x0, 850 * K), (x0 + W / 2 - PAD - 20 * K, 850 * K)], fill=LINEA, width=K)
    texto(d, (x0, 874 * K), num, F('FG-It.ttf', 30, 600), MUTED)
    texto(d, (x0, 916 * K), tit, F('FG.ttf', 34, 700), BLANCO, -0.02)
    for i, l in enumerate(lineas):
        texto(d, (x0, 970 * K + i * 38 * K), l, CUERPO, MUTED)
guardar(img, 5)

# ── 06 · Cierre ─────────────────────────────────────────────────────────────
img = base(6, 'Tu turno')
lado = 330 * K
x0, y0 = (W - lado) / 2, 250 * K
m = Image.new('L', (W, H), 0)
dm = ImageDraw.Draw(m)
dm.rounded_rectangle([x0, y0, x0 + lado, y0 + lado], radius=int(lado * 0.22), outline=255, width=int(9 * K))
s = lado / 100
for l in [[(33, 27), (33, 73)], [(66, 27), (38, 52)], [(48, 44), (68, 73)]]:
    dm.line([(x0 + x * s, y0 + y * s) for x, y in l], fill=255, width=int(11 * s))
img = particulas(img, m, 7000, sueltas=500, semilla=6)
d = ImageDraw.Draw(img)
s = '¿Empezamos?'
f = F('FG-It.ttf', 96, 600)
texto(d, ((W - ancho(s, f, -0.04)) / 2, 660 * K), s, f, BLANCO, -0.04)
for i, l in enumerate(['Escríbenos por DM o WhatsApp y cuéntanos', 'qué quieres construir para tu negocio.']):
    texto(d, ((W - ancho(l, CUERPO)) / 2, 830 * K + i * 42 * K), l, CUERPO, MUTED)
s = 'kaizenstudiomx.com'
f = F('FG.ttf', 58, 700)
texto(d, ((W - ancho(s, f, -0.02)) / 2, 980 * K), s, f, HUESO, -0.02)
s = '@kaizen.studio.mx'
texto(d, ((W - ancho(s, CHICO, 0.06)) / 2, 1060 * K), s, CHICO, MUTED, 0.06)
guardar(img, 6)
print('listo →', SALIDA)
