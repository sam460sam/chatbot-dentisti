# tools

The pieces that make `public/showcase/` and are not part of the site build.

## showcase-object.py — the object

The two message bubbles, modelled in Blender from code: three rounded corners
and one sharp one, and which corner is sharp is the brand mark. Teal is the
assistant (sharp bottom-left, said TO you), terracotta is the websites (sharp
bottom-right, your turn).

Blender is installed as a Python module, so there is nothing to click:

    pip install bpy
    python3 -c "
    import sys; sys.argv=['x','--samples','40','--frames','120']
    exec(open('tools/showcase-object.py').read())
    import bpy, os
    os.makedirs('render', exist_ok=True)
    S = bpy.context.scene
    for f in range(1, 121):
        S.frame_set(f)
        S.render.filepath = f'render/{f:03d}.png'
        bpy.ops.render.render(write_still=True)
    "

About 15 seconds a frame on four cores, so around half an hour for the turn.
The film is transparent: the page behind it can be any colour.

## showcase-pack.py — the frames the page actually loads

    FRAMES=./render OUT=./public/showcase python3 tools/showcase-pack.py

Writes two sets of WebP with alpha — 900px for desktop, 560px for phones, about
1.5 MB and 1.0 MB for the whole turn. The page picks one; a phone never
downloads the large set.

Nothing here runs at build time. Re-run it only when the object changes.

## hdri/ — the room the object is standing in

Three studio environments, 2K `.hdr`, from Poly Haven (CC0, so they can live in
the repository and be re-used without asking anyone):

| file | what it gives |
|---|---|
| `studio_small_09_2k.hdr` | tight three-softbox studio — the default, and what `showcase-seq-a.py` loads |
| `brown_photostudio_02_2k.hdr` | warmer, one large source, longer falloff |
| `photo_studio_01_2k.hdr` | cooler and broader, softer edges |

A lacquered surface with nothing around it renders as flat plastic: what makes
it read as lacquer is a real softbox with a real falloff rolling across a corner
as the object turns. `film_transparent` keeps the room itself out of the frame —
it is only ever seen in the reflections.

Swap one in without editing the file:

    HDRI=tools/hdri/brown_photostudio_02_2k.hdr python3 tools/showcase-seq-a.py -- proof

## showcase-seq-a.py — sequence A, "the case"

150 frames at 960px, Cycles CPU, 40 samples with denoising: about 35 seconds a
frame on four cores, so roughly an hour and a half for the sequence.

    python3 tools/showcase-seq-a.py -- proof          # frames 86 and 150 only
    python3 tools/showcase-seq-a.py -- range 1 150    # the whole thing

It also writes `anchors.json` — where each part is in the frame, as a fraction,
for every frame — so the page can hang a caption off a moving part instead of
guessing at a position.

Every look decision is an environment variable with the approved value as its
default, so a change can be tested against a single frame before it costs an
hour: `C_TEAL`, `C_VERM`, `COAT`, `EXPO`, `HDRI`, `HDRI_S`, `HDRI_ROT`,
`LAMP_S`, `R1`, `R2`, `AIM_Z`, `PROOF_FRAMES`, `TAG`.

One warning worth the line: the brand teal does not survive being lit. Base
colour `#03455C` under this rig lands at roughly `#22596F` on the flat faces,
which is the teal the brand actually uses. Setting the base to the brand hex
makes the render pale blue.

## showcase-seq-b.py — sequence B, "the page"

84 frames, same size and sampling as sequence A, so about three quarters of an
hour.

    python3 tools/showcase-seq-b.py -- proof
    python3 tools/showcase-seq-b.py -- range 1 84

The camera in this one never moves and never turns. That is not a style choice:
it is what lets the renderer write down the two corners of the call button, in
frame fractions, for every frame — and the page lay a real `<a href>` on exactly
that rectangle. The button you can see is the button you can press. Move the
camera and that contract is gone.

## Packing a sequence

    NAME=frames   FRAMES=/path/to/a OUT=./public/showcase python3 tools/showcase-pack.py
    NAME=frames-b FRAMES=/path/to/b OUT=./public/showcase python3 tools/showcase-pack.py

Then copy that sequence's `anchors.json` in beside its frames — the page fetches
`<name>/anchors.json`, and without it the labels and the live button simply do
not appear.

## film-pack.py — a generated film to the frames a page plays

The third sequence on `/showcase` (the burger) and the one on the home page
(the laptop) are not rendered in Blender. Each is two photographs on black —
the object pulled apart, and the object finished — and a five-second film
generated between them (Wan 3.0, first and last frame, via Higgsfield). This
script cuts the film into the frames the pages play:

    pip install pillow numpy imageio-ffmpeg
    python3 tools/film-pack.py burger.mp4 public/showcase/frames-c --frames 72 --until 72
    python3 tools/film-pack.py laptop.mp4 public/assembly/laptop --frames 100 --wide

Square crop by default, `--wide` keeps the film's own width; the black is
keyed to a hard alpha so the frames sit on black. `--until` drops the tail of
a film that finishes its move early and then holds. `DIR-sm/` holds every
second frame at 560px, as for the rendered sequences: a phone plays half the
frames, and a `-sm` set with all of them would end the film halfway. A wide
set also gets `bounds.json`, where the object is in every frame, so the home
page can keep it framed on a phone. `--resm` and `--bounds` rebuild those two
things from frames already written. Frames are never upscaled past the
film's own height, so a 480p film gives 854px frames.

## logo.py, logo-png.mjs — the mark

    pip install shapely fonttools brotli uharfbuzz
    python3 tools/logo.py        # public/brand/*.svg, public/favicon.svg, src/brand/mark.ts
    node tools/logo-png.mjs      # public/icon-*.png and public/og.png (needs Playwright)

Two identical ribbons, the second turned 180 degrees; every fold cuts its outer
corner along the crease. The geometry is in `ribbon()`; change `BAND` and `GAP`
there, never by hand in the SVGs.

## logo-3d.py — the footer film

Same geometry, in Blender (Python 3.11 with `pip install bpy shapely`):

    python tools/logo-3d.py --out render --frames 144 --size 600 --samples 32

About 10 seconds a frame on four cores. Frames are transparent; the footer
navy is put behind them while packing:

    ffmpeg -f lavfi -i "color=c=0x0A0F1E:s=600x600:r=24" -framerate 24 -i render/%03d.png \
      -filter_complex "[0][1]overlay=shortest=1,format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 38 -an public/media/mark-3d.webm
    ffmpeg -f lavfi -i "color=c=0x0A0F1E:s=600x600:r=24" -framerate 24 -i render/%03d.png \
      -filter_complex "[0][1]overlay=shortest=1,format=yuv420p" -c:v libx264 -crf 26 -movflags +faststart -an public/media/mark-3d.mp4
    convert render/001.png -background '#0A0F1E' -flatten -quality 82 public/media/mark-3d.webp

## public/media — photographs and the hero loop

Generated with Higgsfield (GPT Image 2.5 for the stills, Kling 3 for the loop,
with the same image as first and last frame so it loops without a cut). No
people. Each photograph is shipped as WebP at 640, 960 and 1600 px; the hero
still at 800, 1280, 1920 and a 640 x 1080 portrait crop for phones.
