# Edición del video de Historias: acercamientos, transiciones y tarjeta final.
# Entrada: frames/*.jpg (1350×2400) + marcas.json. Salida: final/*.jpg (1080×1920).
import json, os, shutil, math
from PIL import Image, ImageDraw, ImageFont

FUENTES = '/Users/karimeperez/Developer/Portafolio/tools/marca/.fuentes'
W, H = 1080, 1920
marcas = json.load(open('marcas.json'))
INICIO_ZOOM_MAC = 0.28 if sum(m['cuadros'] for m in marcas) > 600 else 0.42
shutil.rmtree('final', ignore_errors=True); os.makedirs('final')

def suave(x):
    x = min(1, max(0, x)); return x * x * (3 - 2 * x)

# Acercamiento por toma: f(t) -> (zoom, foco_x, foco_y), t = 0..1 dentro de la toma
ZOOM = {
    'intro':     lambda t: (1.0 + 0.10 * suave(t), 0.5, 0.45),
    'hero':      lambda t: (1.10 - 0.10 * suave(t / 0.45), 0.5, 0.40),
    'titular':   lambda t: (1.0 + 0.04 * t, 0.45, 0.35),
    'servicios': lambda t: (1.0 + 0.06 * suave(t), 0.5, 0.33),
    # La Mac: primero crece sola; ya a pantalla completa se acerca a la animación
    # (en la de 30 s la Mac llena la pantalla antes: el acercamiento empieza en 0.28)
    'mac':       lambda t: (1.0 + 0.75 * suave((t - INICIO_ZOOM_MAC) / 0.4), 0.5, 0.52),
    'final':     lambda t: (1.0, 0.5, 0.5),  # sin zoom: con zoom se cortaba el logo de la barra
}

def encuadre(im, z, fx, fy):
    sw, sh = im.size
    cw, ch = sw / z, sh / z
    x0 = min(max(fx * sw - cw / 2, 0), sw - cw)
    y0 = min(max(fy * sh - ch / 2, 0), sh - ch)
    return im.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch))

def fuente(nombre, tam, peso, opsz=None):
    f = ImageFont.truetype(os.path.join(FUENTES, nombre), tam)
    f.set_variation_by_axes([peso] if opsz is None else [opsz, peso])
    return f

URL = fuente('FG.ttf', 78, 700)
USUARIO = fuente('Inter.ttf', 36, 500, 14)
HUESO = (236, 232, 223)

def tarjeta(im, a):
    """Cierre: velo abajo + kaizenstudiomx.com + @kaizen.studio.mx (a = 0..1)."""
    if a <= 0: return im
    velo = Image.new('L', (W, H), 0)
    dv = ImageDraw.Draw(velo)
    for y in range(int(H * 0.79), H):
        dv.line([(0, y), (W, y)], fill=int(235 * a * min(1, (y - H * 0.79) / (H * 0.06))))
    im = Image.composite(Image.new('RGB', (W, H), (8, 8, 9)), im, velo)
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    sube = (1 - a) * 30
    for texto, f, y, alfa in (('kaizenstudiomx.com', URL, 1600, 255), ('@kaizen.studio.mx', USUARIO, 1712, 170)):
        w = d.textlength(texto, font=f)
        d.text(((W - w) / 2, y + sube), texto, font=f, fill=HUESO + (int(alfa * a),))
    return Image.alpha_composite(im.convert('RGBA'), capa).convert('RGB')

n = 0
previo = None
TRANS = 5  # cuadros de disolvencia entre tomas
total = sum(m['cuadros'] for m in marcas)
for k, m in enumerate(marcas):
    for i in range(m['cuadros']):
        t = i / max(1, m['cuadros'] - 1)
        im = Image.open(f"frames/{m['desde'] + i:04d}.jpg").convert('RGB')
        z, fx, fy = ZOOM[m['nombre']](t)
        out = encuadre(im, z, fx, fy)
        if k > 0 and i < TRANS and previo is not None:
            out = Image.blend(previo, out, (i + 1) / (TRANS + 1))
        if m['nombre'] == 'final':
            out = tarjeta(out, suave((t - 0.35) / 0.4))
        out.save(f'final/{n:04d}.jpg', quality=94)
        n += 1
    previo = out
print('editados', n, 'de', total)
