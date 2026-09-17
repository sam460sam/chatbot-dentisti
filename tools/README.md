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
