"""
film-pack.py — a generated film to the frames the showcase page plays.

Input: an MP4 of an object on pure black. Output: a square crop around the
object, the black keyed to alpha, written as WebP at two sizes, in the layout
public/showcase/index.html already plays (DIR/001.webp ... and DIR-sm/).

    python3 tools/film-pack.py in.mp4 public/showcase/frames-c [--frames 96] [--size 900] [--until 72] [--wide]

--wide keeps the film's own width instead of cropping a square: for an object
that ends up wider than it is tall. A wide set also gets a bounds.json: where
the object is in every frame, so the page can keep it framed on a phone.
--bounds alone recomputes that file from frames already written. --resm
rebuilds DIR-sm from the frames already in DIR. --until keeps only the first N frames of the film: a generated film usually
finishes the move early and then holds, and the hold is one frame, not thirty.
The frames are never upscaled past the film's own height.
"""
import os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

src = sys.argv[1]
out = sys.argv[2]
want = int(sys.argv[sys.argv.index('--frames') + 1]) if '--frames' in sys.argv else 96
size = int(sys.argv[sys.argv.index('--size') + 1]) if '--size' in sys.argv else 900
until = int(sys.argv[sys.argv.index('--until') + 1]) if '--until' in sys.argv else None
wide = '--wide' in sys.argv
quality = int(sys.argv[sys.argv.index('--quality') + 1]) if '--quality' in sys.argv else 86
# --lift 0.85: a gamma under 1 brightens the mid-tones of a dark object on
# black without touching the black itself or clipping the highlights.
lift = float(sys.argv[sys.argv.index('--lift') + 1]) if '--lift' in sys.argv else 1.0

try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FF = 'ffmpeg'

def bounds(out):
    """Where the object is in every frame, as [x, y, w, h] in the frame's own
    pixels, smoothed over a few neighbours so the framing glides rather than
    jumps when a screw appears. Written next to the frames."""
    import json
    names = sorted(f for f in os.listdir(out) if f.endswith('.webp'))
    raw = []
    W = H = 0
    for f in names:
        a = np.asarray(Image.open(os.path.join(out, f)).convert('RGBA'))[:, :, 3]
        H, W = a.shape
        ys, xs = np.where(a > 0)
        raw.append([int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1] if len(xs) else [0, 0, W, H])
    arr = np.array(raw, dtype=float)
    # The union of the neighbours, not their average: an average lags a fast
    # move and the framing cuts the object. A union can only be too generous.
    k = 4
    sm = []
    for i in range(len(arr)):
        w = arr[max(0, i - k):i + k + 1]
        sm.append([w[:, 0].min(), w[:, 1].min(), w[:, 2].max(), w[:, 3].max()])
    boxes = [[round(x0), round(y0), round(x1 - x0), round(y1 - y0)] for x0, y0, x1, y1 in sm]
    with open(os.path.join(out, 'bounds.json'), 'w') as fh:
        json.dump({'w': W, 'h': H, 'boxes': boxes}, fh)
    print(f'bounds.json: {len(boxes)} boxes')


def harden(r):
    ch = r.split()
    return Image.merge('RGBA', ch[:3] + (ch[3].point(lambda v: 255 if v > 127 else 0),))


def small(out):
    """DIR-sm: every second frame of DIR at 560 wide, renumbered from 001 —
    the layout the pages expect. A phone plays half the frames and, at a
    phone's scroll distance, the step between two is the same size on screen."""
    names = sorted(f for f in os.listdir(out) if f.endswith('.webp'))
    os.makedirs(out + '-sm', exist_ok=True)
    for f in os.listdir(out + '-sm'):
        os.remove(os.path.join(out + '-sm', f))
    n = 0
    for i, f in enumerate(names):
        if i % 2:
            continue
        n += 1
        im = Image.open(os.path.join(out, f)).convert('RGBA')
        w, h = im.size
        px = min(560, w)
        r = harden(im.resize((px, round(h * px / w)), Image.LANCZOS)) if w != px else im
        r.save(os.path.join(out + '-sm', f'{n:03d}.webp'), 'WEBP', quality=quality, method=5)
    print(f'{n} frames -> {out}-sm')


if '--bounds' in sys.argv:
    bounds(out)
    sys.exit(0)

if '--resm' in sys.argv:
    small(out)
    sys.exit(0)

tmp = tempfile.mkdtemp()
subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-i', src, os.path.join(tmp, '%04d.png')], check=True)
names = sorted(os.listdir(tmp))
print(f'{len(names)} frames in the film')
if until:
    names = names[:until]

# Pick `want` frames evenly, always keeping the first and the last.
idx = np.linspace(0, len(names) - 1, want).round().astype(int)

os.makedirs(out, exist_ok=True)

# A generated film's black is not quite black: compression noise and a faint
# floor sit a few levels above it, so the cut is made above them and the
# film's rectangle does not show against the page. The alpha is hard, not a
# ramp: WebP stores a soft alpha almost losslessly and a noisy one cost more
# than the picture. The page draws these on pure black, where a hard edge on
# a dark object is invisible.
def matte(rgb):
    lum = rgb.max(axis=2)
    return (lum > 18).astype(float)

for n, i in enumerate(idx, 1):
    im = Image.open(os.path.join(tmp, names[i])).convert('RGB')
    w, h = im.size
    s = min(w, h)
    if not wide:
        im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
        w = h = s
    rgb = np.asarray(im)
    a = (matte(rgb) * 255).astype(np.uint8)
    if lift != 1.0:
        rgb = (255 * (rgb / 255.0) ** lift).round().astype(np.uint8)
    rgba = Image.fromarray(np.dstack([rgb, a]), 'RGBA')
    px = min(size, w)
    r = harden(rgba.resize((px, round(h * px / w)), Image.LANCZOS)) if w != px else rgba
    r.save(os.path.join(out, f'{n:03d}.webp'), 'WEBP', quality=quality, method=5)

small(out)

if wide:
    bounds(out)
tot = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out) if f.endswith('.webp'))
print(f'{want} frames -> {out} ({tot // 1024} KB) and {out}-sm')
