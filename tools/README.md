# tools

The pieces that make `public/showcase/` and the pictures on `/websites`, and
are not part of the site build.

## demo-screens.mjs — the demo practice on the laptop and the phone

`/websites` shows the demo practice (`public/demo/`, one page per language)
on a laptop and a phone drawn in code (`src/components/DeviceScroll.tsx`);
its pages scroll past inside both screens as the visitor scrolls. The
screens are full-page screenshots of the real demo, so they go stale when the
demo changes. To make them again:

    npm run build
    npx -y wrangler@4 pages dev dist --port 8806 --compatibility-date 2026-09-01
    node tools/demo-screens.mjs            # or: node tools/demo-screens.mjs http://localhost:8806

The script opens `/demo/`, `/demo/nl/` and `/demo/it/` at 1440 wide (desktop)
and 390 wide (phone) with reduced motion, so no film plays and every picture
is the still. It scrolls down once so lazy pictures load, waits for fonts and
images, hides the floating chat button and the phone's bottom bar (a fixed
bar would be painted once, in the middle of a full-page shot) and cuts the
page above the footer. Each shot is rendered straight at the width the screen
needs (1280 and 400 pixels, the screens' largest size at 2x, and half that
for 1x) and encoded to WebP at quality 0.7 by the browser itself:

    public/media/screens/demo-desk-{en,nl,it}.webp      1280 wide, ~130 KB
    public/media/screens/demo-desk-{en,nl,it}-1x.webp    640 wide,  ~48 KB
    public/media/screens/demo-phone-{en,nl,it}.webp      400 wide, ~103 KB
    public/media/screens/demo-phone-{en,nl,it}-1x.webp   200 wide,  ~38 KB

It also rewrites `src/components/demoScreens.ts` with the pictures' sizes: the
page works out from them how far each picture has to travel, so commit the
two together. If the screens in `DeviceScroll.tsx` are ever drawn larger,
raise `out` in the script to twice their largest CSS width.

## showcase-object.py — the old object

The two message bubbles of the previous brand (three rounded corners, one
sharp). No longer on the page: sequences A and B below replaced it. Kept for
reference only.

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

Writes two sets of WebP with alpha: every frame at the size it was rendered
for wide screens, every second frame at 640px for phones. The page picks
one; a phone never downloads the large set. For the sequences on the page
now: A is 3.47 MB and 1.05 MB, B is 0.85 MB and 0.26 MB.

Nothing here runs at build time. Re-run it only when the object changes.

## hdri/ — the room the object is standing in

Three studio environments, 2K `.hdr`, from Poly Haven (CC0, so they can live in
the repository and be re-used without asking anyone):

| file | what it gives |
|---|---|
| `studio_small_09_2k.hdr` | tight three-softbox studio — the default, and what both showcase sequences load |
| `brown_photostudio_02_2k.hdr` | warmer, one large source, longer falloff |
| `photo_studio_01_2k.hdr` | cooler and broader, softer edges |

A lacquered surface with nothing around it renders as flat plastic: what makes
it read as lacquer is a real softbox with a real falloff rolling across a corner
as the object turns. `film_transparent` keeps the room itself out of the frame —
it is only ever seen in the reflections.

Swap one in without editing the file:

    HDRI=tools/hdri/brown_photostudio_02_2k.hdr python3 tools/showcase-seq-a.py -- proof

## showcase-seq-a.py — sequence A, "the case"

150 frames at 960px, Cycles CPU, 8 samples with denoising: 15 to 23 seconds a
frame on four cores, so 40 to 60 minutes for the sequence. Python 3.11
with `pip install bpy shapely` (bpy 5.0.1 is what rendered the frames on the
page). Paths default to the repository: the HDRI from `tools/hdri/`, the PNGs
into `render/` (`OUT=` moves them).

    python3 tools/showcase-seq-a.py -- proof          # anchors.json, frames 86 and 150
    python3 tools/showcase-seq-a.py -- range 1 150    # the whole thing (resumes: skips PNGs already there)

It also writes `anchors.json` — where each part is in the frame, as a fraction,
for every frame — so the page can hang a caption off a moving part instead of
guessing at a position.

Every look decision is an environment variable with the approved value as its
default, so a change can be tested against a single frame before it costs an
hour: `C_PETROL`, `C_MINT`, `C_PAPER`, `C_INK`, `C_STEEL`, `COAT`, `EXPO`,
`HDRI`, `HDRI_S`, `HDRI_ROT`, `LAMP_S`, `R1`, `R2`, `AIM_Z`, `SAMPLES`, `RES`,
`OUT`, `PROOF_FRAMES`, `TAG`.

The colours are the brand's: a petrol case, cream plates with navy bars, and a
mint card for the booking. One warning worth the line: a colour does not
survive being lit. The bases are pre-darkened so they LAND on the brand —
`#17628A` lands at about `#34698B` on the case's flat faces (petrol is
`#356F8E`), `#4A8376` at about `#94D9C3` on the card's lit face (mint is
`#96D3C0`). Setting a base to the brand hex makes the render pale.

Every flat part has the brand's cut corner — `outline()` chamfers top-left
and bottom-right at 45 degrees, as the folded ribbons of the mark do and as
every button and card on the site does.

## showcase-seq-b.py — sequence B, "the page"

84 frames, same size and sampling as sequence A, so twenty to thirty minutes. A
mint tile opens into a cream page with navy text, a mint header and a mint
call button — the site's own call-to-action colour. This rig is lit more
softly than A's, so it renders brighter (`EXPO=-0.7`) and its highlight is
turned down (`SWEEP=0.35`) to keep the mint from washing out to white;
`C_MINT=#86CBB6` lands at about `#86C9B5` on the last frame.

    python3 tools/showcase-seq-b.py -- proof
    python3 tools/showcase-seq-b.py -- range 1 84

The camera in this one never moves and never turns. That is not a style choice:
it is what lets the renderer write down the two corners of the call button, in
frame fractions, for every frame — and the page lay a real `<a href>` on exactly
that rectangle. The button you can see is the button you can press. Move the
camera and that contract is gone.

## Packing a sequence

    NAME=frames   FRAMES=render/a OUT=./public/showcase python3 tools/showcase-pack.py
    NAME=frames-b FRAMES=render/b OUT=./public/showcase python3 tools/showcase-pack.py

Then copy that sequence's `anchors.json` in beside its frames — the page fetches
`<name>/anchors.json`, and without it the labels and the live button simply do
not appear. The camera and the motion decide the anchors, not the colours, so
a re-colour leaves them unchanged.

The page fits the object, not the whole frame, to the screen: `fit` in the
`Runway({...})` calls of `public/showcase/index.html` is where in a frame the
object can be, taken from the `EXT` / `extent` lines a proof run prints. Change
the camera or the motion and update it there.

After a re-render, update the "Weight" line in the spec on the page (and its
two translations in `scripts/showcase-i18n.mjs`) to what a phone and a wide
screen really download, and make `public/showcase/og.jpg` again — the share
picture: the last frame of sequence A on navy at 1200 x 630, with the logo,
the word "Showcase" and the address, one picture for all three languages.

A proof is cheap and a sequence is not: render the proof frames first, put
them on the navy of the page next to the brand swatches, and only then start
the ranges (in the background — they resume, skipping PNGs already written).
The last full run here took 51 minutes for A and 20 for B on four cores.

## film-pack.py — a generated film to the frames a page plays

The third sequence on `/showcase` (the burger) and the one on the home page
(the laptop) are not rendered in Blender. Each is two photographs on black —
the object pulled apart, and the object finished — and a five-second film
generated between them (Wan 3.0, first and last frame, via Higgsfield). This
script cuts the film into the frames the pages play:

    pip install pillow numpy imageio-ffmpeg
    python3 tools/film-pack.py burger.mp4 public/showcase/frames-c --frames 84
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
still at 800, 1280, 1920 and a 640 x 1080 portrait crop for phones; the loop
(hero-loop.webm/.mp4, 1600 x 900, wide screens only) is the Kling clip minus its
last frame, which equals the first.
