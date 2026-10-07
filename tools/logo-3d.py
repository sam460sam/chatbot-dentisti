"""
The footer film: the Twinbyte mark in 3D, turning gently on the footer's navy.

The geometry comes from tools/logo.py, so the 3D mark is the same drawing as
the flat one. Each ribbon segment is its own slab, stacked a hair higher than
the one before it, the way folded paper lies on itself.

Blender runs as a Python module (Python 3.11):

    pip install bpy shapely
    python tools/logo-3d.py --out render/ --frames 144 --size 720 --samples 48
    python tools/logo-3d.py --out render/ --still 1          # one test frame

Then pack the frames into the two videos the footer loads (see tools/README.md).
"""
import argparse
import math
import os
import sys

import bpy
import bmesh

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from logo import SEGMENTS, SEGMENTS_B, MINX, MAXX, CREAM, CREAM_BACK, MINT, MINT_BACK  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument('--out', default='render')
ap.add_argument('--frames', type=int, default=144)
ap.add_argument('--size', type=int, default=720)
ap.add_argument('--samples', type=int, default=48)
ap.add_argument('--still', type=int, default=0, help='render only this frame')
args = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene


def lin(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def material(name, hexcol, rough=0.38):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = lin(hexcol)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Coat Weight'].default_value = 0.25
    p.inputs['Coat Roughness'].default_value = 0.2
    return m


MATS = {
    'a0': material('cream', CREAM), 'a1': material('cream-back', CREAM_BACK),
    'b0': material('mint', MINT), 'b1': material('mint-back', MINT_BACK),
}

SCALE = 2.0 / (MAXX - MINX)       # the mark spans 2 Blender units
DEPTH, STEP = 0.11, 0.035          # slab thickness, and how much each fold lifts the next segment


def slab(name, poly, z, mat, parent):
    """A convex polygon extruded into a bevelled slab."""
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    S.collection.objects.link(ob)
    ob.parent = parent
    bm = bmesh.new()
    pts = list(poly.exterior.coords)[:-1]
    # shapely y grows downward on screen; flip so the mark is not mirrored
    vs = [bm.verts.new(((x - (MINX + MAXX) / 2) * SCALE, -(y - (MINX + MAXX) / 2) * SCALE, z)) for x, y in pts]
    face = bm.faces.new(vs)
    bmesh.ops.recalc_face_normals(bm, faces=[face])
    if face.normal.z < 0:
        face.normal_flip()
    ext = bmesh.ops.extrude_face_region(bm, geom=[face])
    top = [v for v in ext['geom'] if isinstance(v, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, DEPTH), verts=top)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    bm.free()
    bev = ob.modifiers.new('bevel', 'BEVEL')
    bev.width, bev.segments, bev.limit_method = 0.018, 3, 'ANGLE'
    me.materials.append(mat)
    for f in me.polygons:
        f.use_smooth = True
    return ob


def ribbon(name, segs, key):
    root = bpy.data.objects.new(name, None)
    S.collection.objects.link(root)
    for i, poly in enumerate(segs):
        slab(f'{name}{i}', poly, i * STEP, MATS[f'{key}{i % 2}'], root)
    return root


mark = bpy.data.objects.new('mark', None)
S.collection.objects.link(mark)
A = ribbon('A', SEGMENTS, 'a')
B = ribbon('B', SEGMENTS_B, 'b')
A.parent = B.parent = mark

# ------------------------------------------------------------------ light
world = bpy.data.worlds.new('studio')
S.world = world
world.use_nodes = True
nt = world.node_tree
env = nt.nodes.new('ShaderNodeTexEnvironment')
env.image = bpy.data.images.load(os.path.join(ROOT, 'tools/hdri/studio_small_09_2k.hdr'))
nt.links.new(env.outputs['Color'], nt.nodes['Background'].inputs['Color'])
nt.nodes['Background'].inputs['Strength'].default_value = 0.9

def area(name, loc, rot, energy, color, size):
    d = bpy.data.lights.new(name, 'AREA')
    d.energy, d.color, d.size = energy, color, size
    o = bpy.data.objects.new(name, d)
    o.location, o.rotation_euler = loc, rot
    S.collection.objects.link(o)

area('key', (-2.5, -3.0, 4.0), (math.radians(40), 0, math.radians(-35)), 260, (1.0, 0.96, 0.9), 3)
area('rim', (3.0, 2.5, 1.5), (math.radians(-60), math.radians(40), math.radians(140)), 320, (0.35, 0.62, 0.78), 2)   # petrol rim

# ------------------------------------------------------------------ camera
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam'))
cam.data.lens = 85
cam.location = (0, -9.2, 0.6)
cam.rotation_euler = (math.radians(86.3), 0, 0)
S.collection.objects.link(cam)
S.camera = cam
mark.rotation_mode = 'XYZ'
mark.rotation_euler = (math.radians(90), 0, 0)   # stand the mark up to face the camera

# ------------------------------------------------------------------ motion
# One loop of N frames: a slow sway, a slower nod, and the two ribbons
# breathing apart in depth so the fold shows. Everything is periodic in N.
N = args.frames


@bpy.app.handlers.persistent
def pose(scene, *_):
    t = 2 * math.pi * ((scene.frame_current - 1) % N) / N
    mark.rotation_euler = (math.radians(90 + 9 * math.sin(2 * t + 0.6)), math.radians(26 * math.sin(t)), 0)
    gap = 0.16 * (1 - math.cos(t)) / 2
    A.location.z, B.location.z = gap, -gap


bpy.app.handlers.frame_change_pre.append(pose)

# ------------------------------------------------------------------ render
S.render.engine = 'CYCLES'
S.cycles.device = 'CPU'
S.cycles.samples = args.samples
S.cycles.use_denoising = True
S.render.film_transparent = True
S.render.resolution_x = S.render.resolution_y = args.size
S.render.image_settings.file_format = 'PNG'
S.render.image_settings.color_mode = 'RGBA'
S.view_settings.view_transform = 'Standard'
S.frame_start, S.frame_end = 1, N
os.makedirs(args.out, exist_ok=True)
frames = [args.still] if args.still else range(1, N + 1)
for f in frames:
    S.frame_set(f)
    S.render.filepath = os.path.join(os.path.abspath(args.out), f'{f:03d}.png')
    if os.path.exists(S.render.filepath) and not args.still:
        continue                  # resumable: a killed run picks up where it stopped
    bpy.ops.render.render(write_still=True)
    print('frame', f, flush=True)
