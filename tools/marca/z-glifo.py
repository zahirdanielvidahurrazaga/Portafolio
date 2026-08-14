# Saca la Z de SF Pro Display Bold como <path> para el logo.
# Solo hace falta si se cambia la letra o el peso. Ver README.md de esta carpeta.
#   pip3 install --target ./py fonttools
#   PYTHONPATH=./py python3 tools/marca/z-glifo.py
import re

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

LETRA = "Z"
TILE = 512      # lado del cuadro del logo
ALTO_Z = 218    # alto de la letra dentro del cuadro (≈42% del tile)

# SFNS.ttf es VARIABLE: hay que instanciarla, no basta con abrirla.
fuente = TTFont("/System/Library/Fonts/SFNS.ttf")
inst = instancer.instantiateVariableFont(
    fuente, {"wght": 700, "opsz": 96, "wdth": 100, "GRAD": 400}
)
gs = inst.getGlyphSet()
glifo = gs[inst.getBestCmap()[ord(LETRA)]]

limites = BoundsPen(gs)
glifo.draw(limites)
x0, y0, x1, y1 = limites.bounds

escala = ALTO_Z / (y1 - y0)
ancho = (x1 - x0) * escala
tx = (TILE - ancho) / 2 - x0 * escala   # centrado horizontal
ty = (TILE + ALTO_Z) / 2                # base; el eje Y del SVG va al revés

pluma = SVGPathPen(gs)
glifo.draw(TransformPen(pluma, Transform(escala, 0, 0, -escala, tx, ty)))

d = re.sub(
    r"-?\d+\.\d+",
    lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."),
    pluma.getCommands(),
)
print(d)
print(f"\n↑ pégalo en public/favicon.svg y en tools/marca/iconos.mjs (ZPATH)")
