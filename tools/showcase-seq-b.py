"""Sequence B — THE PAGE.

A mint tile opens into the page a small business is judged on. The
camera never moves and never turns: it is dead frontal on a long lens, so the
call button at the end lands on the same rectangle of the picture every time.
The renderer writes that rectangle down, and the page lays a real <a href="tel:">
over it — the button you can see is the button you can press.

Local axes, after the rig's 90 degrees about X: +X right, +Y up, +Z toward the
camera. Everything below is in those terms, so there is no world/local
ambiguity anywhere.
"""
import bpy, bmesh, math, json, os, sys
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('OUT', os.path.join(ROOT, 'render'))
RES = int(os.environ.get('RES', '960'))
FRAMES = 84

bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
HDRI = os.environ.get('HDRI', os.path.join(ROOT, 'tools/hdri/studio_small_09_2k.hdr'))
HDRI_S = float(os.environ.get('HDRI_S', '0.55'))
LAMP_S = float(os.environ.get('LAMP_S', '0.55'))
S.render.resolution_x = RES
S.render.resolution_y = RES

# ------------------------------------------------------------------ colour
def hexc(h, a=1.0):
    h = h.lstrip('#')
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(int(h[0:2], 16)), lin(int(h[2:4], 16)), lin(int(h[4:6], 16)), a)

# Pre-darkened: these are the values that LAND on the brand colours once lit.
# Putting the brand hex in here renders them pale. See tools/README.md.
PETROL = os.environ.get('C_PETROL', '#164F6E')
MINT   = os.environ.get('C_MINT', '#86CBB6')     # lands at about #86C9B5 on the last frame
COAT   = float(os.environ.get('COAT', '0.07'))
PAPER  = os.environ.get('C_PAPER', '#F4EFE6')    # cream
INK    = os.environ.get('C_INK', '#0A0F1E')      # navy
DIM    = os.environ.get('C_DIM', '#5B6B80')

def mat(name, hexv, rough=0.30, coat=COAT, metal=0.0, coatr=0.06):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(hexv)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if 'Coat Weight' in b.inputs:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = coatr
    return m

M_PETROL = mat('petrol', PETROL, rough=0.22)
M_MINT   = mat('mint', MINT, rough=0.24)
M_PAPER = mat('paper', PAPER, rough=0.40, coat=0.14, coatr=0.18)
M_INK   = mat('ink', INK, rough=0.52, coat=0.04)
M_DIM   = mat('dim', DIM, rough=0.55, coat=0.04)

# ------------------------------------------------- the brand-mark generator
def outline(size=2.0, r=0.42, cut=True, seg=10, aspect=1.0):
    """The cut corner: top-left and bottom-right chamfered at 45 degrees, the
       other two square. A real paper fold cuts the outer corner along the
       crease, which is why the two ribbons of the mark have flat tips — and
       why every button and card on the site loses those same two corners.
       This function IS the logo. It must never become a generic rounded box.
       cut=False keeps all four corners square (the bevel still softens them)."""
    hx, hy = size / 2.0, size * aspect / 2.0
    if not cut:
        return [Vector((hx, -hy)), Vector((hx, hy)), Vector((-hx, hy)), Vector((-hx, -hy))]
    r = min(r, hx, hy)
    return [Vector((hx, -hy + r)), Vector((hx, hy)), Vector((-hx + r, hy)),
            Vector((-hx, hy - r)), Vector((-hx, -hy)), Vector((hx - r, -hy))]

def shape(name, size, r, cut, depth, material, bevel=0.03, aspect=1.0, seg=10):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    S.collection.objects.link(ob)
    bm = bmesh.new()
    verts = [bm.verts.new((p.x, p.y, 0.0)) for p in outline(size, r, cut, seg, aspect)]
    face = bm.faces.new(verts)
    ret = bmesh.ops.extrude_face_region(bm, geom=[face])
    moved = [e for e in ret['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=(0, 0, depth))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me); bm.free()
    ob.data.materials.append(material)
    if bevel:
        mo = ob.modifiers.new('bevel', 'BEVEL')
        mo.width = bevel; mo.segments = 3
        mo.limit_method = 'ANGLE'; mo.angle_limit = math.radians(30)
    for p in me.polygons:
        p.use_smooth = True
    # Smooth, but not across a real edge: without this a flat face with only a
    # few corners shades in dark triangles, because each corner's normal leans
    # toward the side walls.
    me.set_sharp_from_angle(angle=math.radians(34))
    return ob

def bar(name, w, h, d, material, loc, bevel=0.008):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    ob = bpy.context.object
    ob.name = name
    ob.scale = (w, h, d)
    bpy.ops.object.transform_apply(scale=True)
    ob.location = loc
    ob.data.materials.append(material)
    if bevel:
        mo = ob.modifiers.new('bevel', 'BEVEL')
        mo.width = bevel; mo.segments = 2
        mo.limit_method = 'ANGLE'; mo.angle_limit = math.radians(40)
    return ob

def empty(name, loc):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.1
    e.location = loc
    S.collection.objects.link(e)
    return e

# ------------------------------------------------------------------- rig
rig = bpy.data.objects.new('rig', None)
S.collection.objects.link(rig)
rig.rotation_euler = (math.radians(90), 0, 0)

PARTS = []
def attach(ob, parent=None):
    ob.parent = parent or rig
    if parent:
        ob.matrix_parent_inverse = Matrix.Identity(4)
    PARTS.append(ob)
    return ob

# ------------------------------------------------------------ the page itself
PW, PA = 2.30, 1.42                      # width, and height as a multiple of it
PH = PW * PA
page = shape('page', PW, 0.20, True, 0.16, M_PAPER, bevel=0.030, aspect=PA)
attach(page)
page.location = (0, 0, 0)

# The tile the page grows out of. Same outline, same cut corners, mint:
# at frame 1 it is the whole object, and it ends up as the button.
bub = shape('bubble', 1.05, 0.18, True, 0.17, M_MINT, bevel=0.028, aspect=0.62)
attach(bub)

# --- what is on the page. Everything is parented to the page and parked above
#     its top edge, so a row "arrives" by sliding down behind the header.
CONTENT = []
def row(name, w, h, material, x, y, z=0.17, bevel=0.008):
    ob = bar(name, w, h, 0.03, material, (x, y, z))
    attach(ob, page)
    CONTENT.append((ob, (x, y, z)))
    return ob

head = shape('head', PW - 0.34, 0.12, True, 0.035, M_MINT, bevel=0.012, aspect=0.215)
head.location = (0, PH / 2 - 0.36, 0.163)
attach(head, page)
name = bar('name', 0.94, 0.100, 0.03, M_INK, (-0.38, PH / 2 - 0.36, 0.200))
attach(name, page)
row('t1',    1.62, 0.130, M_INK,   -0.22, 0.98)
row('t2',    1.18, 0.130, M_INK,   -0.44, 0.76)
row('sub',   1.44, 0.070, M_DIM,   -0.31, 0.54)

# two facts, each with its own petrol tick
for i, (wdot, wline) in enumerate([(0.10, 1.34), (0.10, 1.06)]):
    y = 0.06 - i * 0.34
    row('dot%d' % i, wdot, 0.10, M_PETROL, -0.94, y)
    row('line%d' % i, wline, 0.085, M_DIM, -0.94 + 0.18 + wline / 2, y)

# the rule above the button
row('rule', PW - 0.44, 0.012, M_DIM, 0, -0.62)

# --- the call button. This is the one part whose position on screen is a
#     contract with the page, so it gets corner anchors, not a centre point.
BW, BH = 1.66, 0.46
btn = shape('button', BW, 0.14, True, 0.10, M_MINT, bevel=0.020, aspect=BH / BW)
attach(btn, page)
BTN_AT = (0, -1.12, 0.16)
btn.location = BTN_AT
lab = bar('label', 0.84, 0.085, 0.02, M_INK, (0, 0, 0.101))
attach(lab, btn)

ANCH = {}
for k, (cx, cy) in [('tl', (-BW / 2, BH / 2)), ('br', (BW / 2, -BH / 2))]:
    e = empty('a_btn_' + k, (cx, cy, 0.10))
    e.parent = btn
    e.matrix_parent_inverse = Matrix.Identity(4)
    ANCH['btn_' + k] = e
for k, loc in [('head', (0, PH / 2 - 0.25, 0.22)), ('facts', (-0.30, -0.11, 0.22))]:
    e = empty('a_' + k, loc)
    e.parent = page
    e.matrix_parent_inverse = Matrix.Identity(4)
    ANCH[k] = e

# --------------------------------------------------------------- the room
def panel(name, loc, rot, sx, sy, strength, colour):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (sx, sy, 1)
    ob.rotation_euler = [math.radians(a) for a in rot]
    m = bpy.data.materials.new(name + '-emit')
    m.use_nodes = True
    nt2 = m.node_tree
    for n in list(nt2.nodes):
        nt2.nodes.remove(n)
    o = nt2.nodes.new('ShaderNodeOutputMaterial')
    e = nt2.nodes.new('ShaderNodeEmission')
    e.inputs['Color'].default_value = colour
    e.inputs['Strength'].default_value = strength * LAMP_S
    nt2.links.new(e.outputs['Emission'], o.inputs['Surface'])
    ob.data.materials.append(m)
    ob.visible_camera = False
    ob.visible_shadow = False
    return ob

panel('softbox_l', (-5.0, -5.0, 2.0), (74, 0, -36), 9, 8, 2.2, (0.88, 0.94, 1.0, 1))
panel('softbox_r', (5.4, -3.0, 1.0), (80, 0, 56), 7, 7, 1.2, (1.0, 0.93, 0.84, 1))
# the highlight that crosses the page; SWEEP scales it without touching the rest
sweep = panel('sweep', (-4.6, -3.0, 0.4), (86, 0, -12), 0.9, 9, 46.0 * float(os.environ.get('SWEEP', '0.35')), (1, 1, 1, 1))

bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -PH / 2 - 0.30))
floor = bpy.context.object
floor.name = 'floor'
floor.is_shadow_catcher = True

def area(name, loc, rot, energy, size, colour=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.energy = energy * LAMP_S; ld.size = size; ld.color = colour
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    S.collection.objects.link(ob)
    return ob

area('key',  (-3.0, -5.6, 3.8), (40, 0, -28), 800, 5)
area('fill', (4.2, -4.0, 0.6), (86, 0, 50), 240, 8)
area('rim',  (1.2, 4.6, 2.6), (-52, 0, 10), 1100, 3, (0.70, 0.83, 1.0))

world = bpy.data.worlds.new('world'); S.world = world
world.use_nodes = True
nt = world.node_tree
for n in list(nt.nodes): nt.nodes.remove(n)
out = nt.nodes.new('ShaderNodeOutputWorld')
bg = nt.nodes.new('ShaderNodeBackground')
bg.inputs['Strength'].default_value = HDRI_S
if os.path.exists(HDRI):
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(HDRI)
    mapn = nt.nodes.new('ShaderNodeMapping')
    texc = nt.nodes.new('ShaderNodeTexCoord')
    mapn.inputs['Rotation'].default_value[2] = math.radians(float(os.environ.get('HDRI_ROT', '-34')))
    nt.links.new(texc.outputs['Generated'], mapn.inputs['Vector'])
    nt.links.new(mapn.outputs['Vector'], env.inputs['Vector'])
    nt.links.new(env.outputs['Color'], bg.inputs['Color'])
else:
    bg.inputs['Color'].default_value = (0.09, 0.11, 0.13, 1)
nt.links.new(bg.outputs['Background'], out.inputs['Surface'])

# ------------------------------------------------------------------ camera
# Fixed. Not keyframed, not tracked, not nudged. The whole point of this
# sequence is that a rectangle of the last frame is a place on the screen.
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = float(os.environ.get('LENS', '70'))
cam_data.dof.use_dof = True
cam_data.dof.focus_distance = float(os.environ.get('CAMD', '9.0'))
cam_data.dof.aperture_fstop = 5.6
cam = bpy.data.objects.new('cam', cam_data)
cam.location = (0, -float(os.environ.get('CAMD', '9.0')), 0)
cam.rotation_euler = (math.radians(90), 0, 0)
S.collection.objects.link(cam)
S.camera = cam

# ------------------------------------------------------------------ motion
PREF = bpy.context.preferences.edit
def key(ob, path, frame, value, interp='BEZIER'):
    PREF.keyframe_new_interpolation_type = interp
    if path == 'location':   ob.location = value
    elif path == 'rotation_euler': ob.rotation_euler = value
    elif path == 'scale':    ob.scale = value
    elif path == 'energy':
        ob.data.energy = value
        ob.data.keyframe_insert('energy', frame=frame)
        return
    ob.keyframe_insert(path, frame=frame)

S.frame_start, S.frame_end = 1, FRAMES

# 1-18   the bubble alone, turning the last few degrees to square up
# 18-44  the page opens out from behind it, top-down
# 26-62  the rows arrive, each one a little after the last
# 52-70  the bubble travels down and becomes the button
# 70-84  settle, and the highlight leaves
OPEN_A, OPEN_B = 18, 44
key(bub, 'location', 1, (0, 0.10, 0.44))
key(bub, 'rotation_euler', 1, (0, math.radians(-16), math.radians(7)))
key(bub, 'scale', 1, (1.30, 1.30, 1.30))
key(bub, 'location', 18, (0, 0.10, 0.40))
key(bub, 'rotation_euler', 18, (0, 0, 0))
key(bub, 'scale', 18, (1.22, 1.22, 1.22))
key(bub, 'location', 62, (0, 0.10, 0.40))
key(bub, 'scale', 62, (1.22, 1.22, 1.22))
key(bub, 'location', 70, BTN_AT)
key(bub, 'scale', 70, (BW / 1.05, BH / (1.05 * 0.62), 0.60))

# the page grows down out of the header line
key(page, 'scale', 1, (1, 0.001, 1))
key(page, 'location', 1, (0, 40.0, 0), 'CONSTANT')
key(page, 'location', OPEN_A - 1, (0, 40.0, 0), 'CONSTANT')
key(page, 'scale', OPEN_A, (1, 0.001, 1))
key(page, 'location', OPEN_A, (0, PH / 2, 0))
key(page, 'scale', OPEN_B, (1, 1, 1))
key(page, 'location', OPEN_B, (0, 0, 0))

# every row starts flat and above where it belongs, and drops into place
for i, (ob, at) in enumerate(CONTENT):
    a = 26 + i * 4
    b = a + 12
    key(ob, 'scale', 1, (0.04, 0.02, 1))
    key(ob, 'scale', a, (0.04, 0.02, 1))
    key(ob, 'scale', b, (1, 1, 1))

# the button only exists once the bubble has finished being the bubble
key(btn, 'scale', 1, (0.001, 0.001, 0.001))
key(btn, 'scale', 69, (0.001, 0.001, 0.001))
key(btn, 'scale', 70, (1, 1, 1), 'CONSTANT')
key(lab, 'scale', 1, (0.001, 0.001, 0.001))
key(lab, 'scale', 69, (0.001, 0.001, 0.001))
key(lab, 'scale', 70, (1, 1, 1), 'CONSTANT')
# and the bubble stops existing at the same instant, so the swap is invisible
key(bub, 'scale', 69, (BW / 1.05, BH / (1.05 * 0.62), 0.60))
key(bub, 'location', 71, (0, -40.0, 0.16), 'CONSTANT')

key(sweep, 'location', 1, (-4.6, -3.0, 0.4))
key(sweep, 'location', 58, (1.6, -3.0, 0.4))
key(sweep, 'location', 84, (6.4, -3.0, 0.4))

# ------------------------------------------------------------------- render
S.render.engine = 'CYCLES'
S.cycles.device = 'CPU'
S.cycles.samples = int(os.environ.get('SAMPLES', '8'))   # the denoiser does the rest
S.cycles.use_denoising = True
S.render.use_persistent_data = True   # the scene is built once, not once a frame
S.cycles.max_bounces = 8
S.render.film_transparent = True
S.render.image_settings.file_format = 'PNG'
S.render.image_settings.color_mode = 'RGBA'
S.view_settings.view_transform = 'Standard'
S.view_settings.exposure = float(os.environ.get('EXPO', '-0.7'))   # the page lands on cream, not grey

def bake_anchors(path):
    data = {k: {} for k in ANCH}
    ext = {}
    for f in range(1, FRAMES + 1):
        S.frame_set(f)
        bpy.context.view_layer.update()
        for k, e in ANCH.items():
            c = world_to_camera_view(S, cam, e.matrix_world.translation)
            data[k][f] = [round(c.x, 4), round(1.0 - c.y, 4)]
        xs, ys = [], []
        for ob in PARTS:
            if f < OPEN_A and (ob is page or ob.parent is page or (ob.parent and ob.parent.parent is page)):
                continue
            if ob.name == 'bubble' and f > 70:
                continue
            if ob.name in ('button', 'label') and f < 70:
                continue
            for corner in ob.bound_box:
                c = world_to_camera_view(S, cam, ob.matrix_world @ Vector(corner))
                xs.append(c.x); ys.append(1.0 - c.y)
        ext[f] = [round(min(xs), 3), round(max(xs), 3), round(min(ys), 3), round(max(ys), 3)]
    json.dump({'frames': FRAMES, 'anchors': data, 'extent': ext}, open(path, 'w'))
    return ext

if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    mode = args[0] if args else 'proof'
    os.makedirs(OUT + '/b', exist_ok=True)
    if mode == 'proof':
        ext = bake_anchors(OUT + '/b/anchors.json')
        bad = [f for f, e in ext.items() if e[0] < 0.03 or e[1] > 0.97 or e[2] < 0.03 or e[3] > 0.97]
        for f in (1, 30, 56, 84):
            print('EXT f%d' % f, ext[f])
        print('OFF-FRAME count', len(bad), bad[:10])
        for f in [int(x) for x in os.environ.get('PROOF_FRAMES', '1,30,56,84').split(',')]:
            S.frame_set(f)
            S.render.filepath = OUT + '/proof_b_%03d%s.png' % (f, os.environ.get('TAG', ''))
            bpy.ops.render.render(write_still=True)
        print('PROOF DONE')
    else:
        lo, hi = int(args[1]), int(args[2])
        for f in range(lo, hi + 1):
            p = OUT + '/b/%03d.png' % f
            if os.path.exists(p):
                continue
            S.frame_set(f)
            S.render.filepath = p
            bpy.ops.render.render(write_still=True)
        print('RANGE DONE', lo, hi)
