"""Turn the rendered PNGs into the two sets the page actually loads.

Desktop gets the whole sequence at the size it was rendered. A phone gets every
second frame at 640px, renumbered from 001 — half the frames, and at a phone's
scroll distance the step between frames is the same size on screen. 640, not
smaller: the page fits the object, not the empty film around it, to the
screen, so on a phone a frame is drawn about 500 CSS pixels wide.

Nothing is ever enlarged. A frame resized up is a frame with invented detail in
it, and on a canvas at full width that shows.
"""
from PIL import Image
import os, glob, shutil

SRC = os.environ.get('FRAMES', './render')
OUT = os.environ.get('OUT', './public/showcase')

files = sorted(glob.glob(SRC + '/*.png'))
if not files:
    raise SystemExit('no frames in ' + SRC)
print(len(files), 'source frames')

# name, longest side (None keeps what the renderer produced), colour quality,
# alpha quality, step.
#
# The alpha quality is the line that matters. The colour in these frames costs
# almost nothing to encode; the soft contact shadow does, because it is a wide
# smooth gradient in the alpha channel and WebP keeps alpha near-lossless by
# default. At 86/50 the whole sequence is 3.5 MB instead of 7.8 MB and the
# shadow is indistinguishable side by side. Baking the page's background into
# the frames would be lighter still, and was rejected: lossy encoding moves a
# flat dark field by a unit or two, which on a dark page draws a faint square
# around the object.
NAME = os.environ.get('NAME', 'frames')   # 'frames' or 'frames-b'

sets = [
    (NAME, None, 86, 50, 1),
    (NAME + '-sm', 640, 82, 45, 2),
]

for name, side, q, aq, step in sets:
    d = os.path.join(OUT, name)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d, exist_ok=True)
    total = 0
    n = 0
    for src in files[::step]:
        n += 1
        im = Image.open(src).convert('RGBA')
        if side and im.width > side:
            im = im.resize((side, side), Image.LANCZOS)
        p = os.path.join(d, f'{n:03d}.webp')
        im.save(p, 'WEBP', quality=q, alpha_quality=aq, method=6)
        total += os.path.getsize(p)
    print(f'{name}: {n} frames at {side or im.width}px, {total/1024/1024:.2f} MB, {total/n/1024:.1f} kB each')
