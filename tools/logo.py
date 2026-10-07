"""
The Twinbyte mark, from code.

Two identical ribbons, the second turned 180 degrees. Each one is folded three
times; a real paper fold cuts the outer corner along the crease, which is why
the diamond has flat tips. After every fold you see the other face of the
ribbon, so the colour logo shows each ribbon in two tones.

Built in square coordinates (axis-aligned bands), then turned 45 degrees.

    pip install shapely fonttools brotli uharfbuzz
    python3 tools/logo.py            # writes public/brand/*.svg and public/favicon.svg
    node tools/logo-png.mjs          # renders the PNG icons and og.png from them
"""
import io
import math
import os

from shapely import affinity
from shapely.geometry import MultiPolygon, Polygon, box
from shapely.ops import unary_union

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, 'src/fonts/bricolage-latin-var.woff2')
OUT = os.path.join(ROOT, 'public/brand')

NAVY, NAVY_BACK = '#0A0F1E', '#24324F'
MINT, MINT_BACK = '#96D3C0', '#6DB8A2'
CREAM, CREAM_BACK = '#F4EFE6', '#C9C2B4'
WHITE = '#FFFFFF'

BAND = 0.44   # ribbon width, the square is 2 x 2
GAP = 0.10    # where one ribbon's end meets the other ribbon


def below(a, b, c):
    """The half-plane a*x + b*y <= c, clipped to a large square."""
    n = math.hypot(a, b)
    a, b, c = a / n, b / n, c / n
    px, py, tx, ty, r = a * c, b * c, -b, a, 20
    return Polygon([
        (px + tx * r, py + ty * r), (px - tx * r, py - ty * r),
        (px - tx * r - a * r, py - ty * r - b * r), (px + tx * r - a * r, py + ty * r - b * r),
    ])


def ribbon(w=BAND, g=GAP):
    """Ribbon A as its four segments: wall up -> top band left -> left band down -> bottom band right."""
    h, r2 = w / 2, math.sqrt(2)
    wall = box(-h, -1, h, 0).intersection(below(-1, 1, -g / r2))              # ends at the centre
    top = box(-1, -1, h, -1 + w)
    left = box(-1, -1, -1 + w, 1)
    bottom = box(-1, 1 - w, h, 1).intersection(below(1, -1, -(1 - h + g * r2)))  # ends at B's fold
    creases = below(-1, -1, 2 - w).intersection(below(-1, 1, 2 - w)).intersection(below(1, -1, 1 - h))
    return [s.intersection(creases) for s in (wall, top, left, bottom)]


def turn(geom, a):
    return affinity.rotate(geom, a, origin=(0, 0))


SEGMENTS = [turn(s, 45) for s in ribbon()]
SEGMENTS_B = [turn(s, 180) for s in SEGMENTS]
MINX, MINY, MAXX, MAXY = unary_union(SEGMENTS + SEGMENTS_B).bounds


def d(geom, k, ox, oy):
    polys = geom.geoms if isinstance(geom, MultiPolygon) else [geom]
    out = []
    for p in polys:
        for ring in [p.exterior, *p.interiors]:
            pts = list(ring.coords)[:-1]
            out.append('M' + ' '.join(f'{ox + x * k:.2f} {oy + y * k:.2f}' for x, y in pts) + 'Z')
    return ''.join(out).replace('.00', '')


def mark(colors, size=100, x0=0, y0=0):
    """colors = (A front, A back, B front, B back). The mark fills size x size at (x0, y0)."""
    k = size / (MAXX - MINX)
    ox, oy = x0 - MINX * k, y0 - MINY * k
    out = []
    for segs, front, back in ((SEGMENTS, colors[0], colors[1]), (SEGMENTS_B, colors[2], colors[3])):
        for i, s in enumerate(segs):
            out.append(f'<path fill="{front if i % 2 == 0 else back}" d="{d(s, k, ox, oy)}"/>')
    return ''.join(out)


def wordmark(text='twinbyte', wght=700, opsz=48):
    """Outlined wordmark: path data (baseline at y=0), advance width, x-height. Font units."""
    import uharfbuzz as hb
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    inst = instantiateVariableFont(TTFont(FONT), {'wght': wght, 'opsz': opsz})
    inst.flavor = None
    buf = io.BytesIO()
    inst.save(buf)
    font = hb.Font(hb.Face(buf.getvalue()))
    shaped = hb.Buffer()
    shaped.add_str(text)
    shaped.guess_segment_properties()
    hb.shape(font, shaped, {'kern': True})
    glyphs, order = inst.getGlyphSet(), inst.getGlyphOrder()
    x, parts = 0, []
    for info, pos in zip(shaped.glyph_infos, shaped.glyph_positions):
        pen = SVGPathPen(glyphs)
        glyphs[order[info.codepoint]].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, -pos.y_offset)))
        parts.append(pen.getCommands())
        x += pos.x_advance
    return ''.join(parts), x, inst['OS/2'].sxHeight


def lockup(word, colors):
    path, adv, xh = WORD
    mh, gap, pad = 960, 250, 40
    cy = -xh / 2 - 90                       # a touch above the middle of the x-height
    top, x_word = cy - mh / 2, mh + gap
    y0, y1 = min(top, -760) - pad, max(cy + mh / 2, 230) + pad
    w = x_word + adv + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {y0:g} {w:g} {y1 - y0:g}">'
            f'{mark(colors, mh, 0, top)}<path fill="{word}" transform="translate({x_word} 0)" d="{path}"/></svg>\n')


def square(colors, extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">{extra}{mark(colors)}</svg>\n'


COLOR = (NAVY, NAVY_BACK, MINT, MINT_BACK)
FLAT = (NAVY, NAVY, MINT, MINT)
ON_DARK = (CREAM, CREAM_BACK, MINT, MINT_BACK)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    WORD = wordmark()
    files = {
        'logo.svg': lockup(NAVY, COLOR),
        'logo-flat.svg': lockup(NAVY, FLAT),
        'logo-on-dark.svg': lockup(CREAM, ON_DARK),
        'logo-white.svg': lockup(WHITE, (WHITE,) * 4),
        'logo-navy.svg': lockup(NAVY, (NAVY,) * 4),
        'mark.svg': square(COLOR),
        'mark-flat.svg': square(FLAT),
        'mark-on-dark.svg': square(ON_DARK),
        'mark-white.svg': square((WHITE,) * 4),
        'mark-navy.svg': square((NAVY,) * 4),
    }
    for name, svg in files.items():
        with open(os.path.join(OUT, name), 'w') as f:
            f.write(svg)
    # The tab icon follows the browser theme: the navy ribbon turns cream on a dark tab bar.
    k = 100 / (MAXX - MINX)
    a = ''.join(f'<path class="a" d="{d(s, k, -MINX * k, -MINY * k)}"/>' for s in SEGMENTS)
    b = ''.join(f'<path fill="{MINT}" d="{d(s, k, -MINX * k, -MINY * k)}"/>' for s in SEGMENTS_B)
    with open(os.path.join(ROOT, 'public/favicon.svg'), 'w') as f:
        f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>.a{fill:%s}'
                '@media (prefers-color-scheme:dark){.a{fill:%s}}</style>%s%s</svg>\n' % (NAVY, CREAM, a, b))
    print('wrote', len(files) + 1, 'files')
