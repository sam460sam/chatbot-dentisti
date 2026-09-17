"""Turn the rendered PNGs into the two sets the page actually loads.

Desktop gets the whole turn at 1100px. A phone gets every second frame of the
same turn at 560px, renumbered from 001 — half the weight, and at a phone's
scroll distance the step between frames is the same size on screen.
"""
from PIL import Image
import os, glob, shutil

SRC = os.environ.get('FRAMES', './render')
OUT = os.environ.get('OUT', './public/showcase')

files = sorted(glob.glob(SRC + '/*.png'))
if not files:
    raise SystemExit('no frames in ' + SRC)
print(len(files), 'source frames')

sets = [
    ('frames', 1100, 86, 1),
    ('frames-sm', 560, 74, 2),
]

for name, side, q, step in sets:
    d = os.path.join(OUT, name)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d, exist_ok=True)
    total = 0
    n = 0
    for src in files[::step]:
        n += 1
        im = Image.open(src).convert('RGBA')
        if im.width != side:
            im = im.resize((side, side), Image.LANCZOS)
        p = os.path.join(d, f'{n:03d}.webp')
        im.save(p, 'WEBP', quality=q, method=6)
        total += os.path.getsize(p)
    print(f'{name}: {n} frames at {side}px, {total/1024/1024:.2f} MB, {total/n/1024:.1f} kB each')
