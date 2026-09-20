"""
film-pack.py — a generated film to the frames the showcase page plays.

Input: an MP4 of an object on pure black. Output: a square crop around the
object, the black keyed to alpha, written as WebP at two sizes, in the layout
public/showcase/index.html already plays (DIR/001.webp ... and DIR-sm/).

    python3 tools/film-pack.py in.mp4 public/showcase/frames-c [--frames 96] [--size 900] [--until 72] [--wide]

--wide keeps the film's own width instead of cropping a square: for an object
that ends up wider than it is tall. --until keeps only the first N frames of the film: a generated film usually
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
quality = int(sys.argv[sys.argv.index('--quality') + 1]) if '--quality' in sys.argv else 78

try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:
    FF = 'ffmpeg'

tmp = tempfile.mkdtemp()
subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-i', src, os.path.join(tmp, '%04d.png')], check=True)
names = sorted(os.listdir(tmp))
print(f'{len(names)} frames in the film')
if until:
    names = names[:until]

# Pick `want` frames evenly, always keeping the first and the last.
idx = np.linspace(0, len(names) - 1, want).round().astype(int)

os.makedirs(out, exist_ok=True)
os.makedirs(out + '-sm', exist_ok=True)

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
    rgba = Image.fromarray(np.dstack([rgb, a]), 'RGBA')
    for d, px in ((out, min(size, w)), (out + '-sm', min(560, w))):
        r = rgba
        if w != px:
            r = rgba.resize((px, round(h * px / w)), Image.LANCZOS)
            # resampling softens the alpha again; cut it back to hard
            ch = r.split()
            r = Image.merge('RGBA', ch[:3] + (ch[3].point(lambda v: 255 if v > 127 else 0),))
        r.save(os.path.join(d, f'{n:03d}.webp'), 'WEBP', quality=quality, method=5)

tot = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out))
print(f'{want} frames -> {out} ({tot // 1024} KB) and {out}-sm')
