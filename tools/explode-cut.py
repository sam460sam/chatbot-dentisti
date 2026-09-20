"""
explode-cut.py — cut an exploded-view photograph into layers.

Input: a photograph of an object pulled apart along one axis, on black, and a
second photograph of the same object put together. Output: one WebP with alpha
per layer, one for the finished object, and a layers.json the page reads to
slide the layers back together on scroll.

The cuts are horizontal rows chosen by hand (see SPECS): where two parts overlap
in the picture no algorithm knows which pixel belongs to which, so the rows sit
in the valleys of the picture, where the fewest pixels are lit.

Nothing here runs at build time. Re-run it only when a photograph changes:

    python3 tools/explode-cut.py
"""
import json, os
import numpy as np
from PIL import Image

UP = os.environ.get('UPLOADS', '/root/.claude/uploads/dd943220-cd4a-59f9-b53b-da252b2665fb/')

SPECS = {
    # frame: the square the page draws in, in source pixels, around the object.
    # cuts: rows. keep: how much of a layer stays visible above the one under it
    # once the stack is closed. fade: the layer disappears as it moves.
    'laptop': {
        'exploded': UP + 'ace1c50d-image.jpg',
        'done': UP + '35aaf7b3-image.jpg',
        'out': 'public/assembly/laptop',
        'json': 'src/assembly/laptop.json',
        'cuts': [41, 184, 261, 401, 474, 570, 722],
        'names': ['lid', 'display', 'deck', 'board', 'battery', 'case'],
        'keep': [0.26, 0.08, 0.16, 0.07, 0.11, 1.0],
        'fade': [False] * 6,
        'frame': 780,
    },
    'burger': {
        'exploded': UP + '65682b08-image.jpg',
        'done': UP + 'ad2fddaf-image.jpg',
        'out': 'public/showcase/burger',
        'json': 'public/showcase/burger/layers.json',
        'cuts': [52, 208, 284, 360, 395, 480, 562, 604, 716],
        'names': ['bun', 'lettuce', 'tomato', 'cheese', 'patty', 'rings', 'sauce', 'base'],
        'keep': [0.92, 0.55, 0.5, 0.45, 0.72, 0.5, 0.12, 1.0],
        'fade': [False, False, False, False, False, False, True, False],
        'frame': 760,
    },
}

THRESHOLD = 8   # below this the pixel is background
RAMP = 26       # over this many levels the edge goes from clear to solid


def matte(rgb):
    """Alpha from brightness. The background is black, the object is not: a
    ramp rather than a hard cut keeps the soft edges soft."""
    lum = rgb.max(axis=2).astype(float)
    a = np.clip((lum - THRESHOLD) / RAMP, 0, 1)
    return (a * 255).astype(np.uint8)


def crop(rgba):
    a = rgba[:, :, 3]
    ys, xs = np.where(a > 0)
    if len(xs) == 0:
        return None, (0, 0)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    return rgba[y0:y1, x0:x1], (int(x0), int(y0))


def save(rgba, path):
    Image.fromarray(rgba, 'RGBA').save(path, 'WEBP', quality=84, method=6)


def run(name, spec):
    os.makedirs(spec['out'], exist_ok=True)
    src = np.asarray(Image.open(spec['exploded']).convert('RGB'))
    H, W = src.shape[:2]
    alpha = matte(src)
    rgba = np.dstack([src, alpha])

    cuts = spec['cuts']
    layers = []
    for i in range(len(cuts) - 1):
        band = np.zeros_like(rgba)
        band[cuts[i]:cuts[i + 1]] = rgba[cuts[i]:cuts[i + 1]]
        piece, (x, y) = crop(band)
        file = f'{i + 1:02d}-{spec["names"][i]}.webp'
        save(piece, os.path.join(spec['out'], file))
        layers.append({'src': file, 'x': x, 'y': y, 'w': int(piece.shape[1]), 'h': int(piece.shape[0]),
                       'keep': spec['keep'][i], 'fade': spec['fade'][i]})

    # The frame: a square around the exploded object, in source pixels.
    ys, xs = np.where(alpha > 0)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    F = spec['frame']
    fx, fy = cx - F / 2, cy - F / 2
    for L in layers:
        L['x'] = round(L['x'] - fx, 1)
        L['y'] = round(L['y'] - fy, 1)

    # Where each layer ends up: stacked from the bottom one, each showing only
    # `keep` of its height above the one beneath, then the whole stack centred
    # where the exploded object was.
    bottom = layers[-1]
    top = bottom['y']
    targets = [0.0] * len(layers)
    targets[-1] = bottom['y']
    for i in range(len(layers) - 2, -1, -1):
        top = top - layers[i]['h'] * layers[i]['keep']
        targets[i] = top
    stack_top, stack_bottom = targets[0], targets[-1] + bottom['h']
    shift = (F / 2) - (stack_top + stack_bottom) / 2
    for L, t in zip(layers, targets):
        L['ty'] = round(t + shift, 1)

    done = np.asarray(Image.open(spec['done']).convert('RGB'))
    drgba = np.dstack([done, matte(done)])
    piece, _ = crop(drgba)
    save(piece, os.path.join(spec['out'], 'done.webp'))

    out = {
        'frame': F,
        'stack': round(stack_bottom - stack_top, 1),
        'layers': layers,
        'done': {'src': 'done.webp', 'w': int(piece.shape[1]), 'h': int(piece.shape[0])},
    }
    os.makedirs(os.path.dirname(spec['json']), exist_ok=True)
    with open(spec['json'], 'w') as f:
        json.dump(out, f, indent=1)
    size = sum(os.path.getsize(os.path.join(spec['out'], f)) for f in os.listdir(spec['out']) if f.endswith('.webp'))
    print(f'{name}: {len(layers)} layers, stack {out["stack"]}px of {F}, {size // 1024} KB')


for name, spec in SPECS.items():
    run(name, spec)
