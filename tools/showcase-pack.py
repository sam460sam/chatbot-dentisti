from PIL import Image
import os, glob, shutil

SRC = os.environ.get('FRAMES', './render')
OUT = os.environ.get('OUT', './public/showcase')
sets = [('frames', 900, 86), ('frames-sm', 560, 74)]

files = sorted(glob.glob(SRC + '/*.png'))
print(len(files), 'source frames')

for name, side, q in sets:
    d = os.path.join(OUT, name)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d, exist_ok=True)
    total = 0
    for i, f in enumerate(files, 1):
        im = Image.open(f).convert('RGBA')
        if im.width != side:
            im = im.resize((side, side), Image.LANCZOS)
        p = os.path.join(d, f'{i:03d}.webp')
        im.save(p, 'WEBP', quality=q, method=6)
        total += os.path.getsize(p)
    print(f'{name}: {len(files)} frames, {total/1024/1024:.2f} MB, {total/len(files)/1024:.1f} KB avg')
