# -*- coding: utf-8 -*-
"""SEQUENCE A — "THE CASE". 150 frames, 1100x1100, Cycles CPU, film transparent.

Built to the art-direction spec. Every part is a child of `rig`, an empty rotated
90 degrees about X, so that in LOCAL rig space:
    +X = right on screen   +Y = up on screen   +Z = toward the camera
`outline()` builds in local XY and extrudes along local +Z. There is no remaining
world/local ambiguity anywhere below.
"""
import bpy, bmesh, math, json, os, sys
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

OUT = '/tmp/claude-0/blend2'
RES = 960
FRAMES = 150

bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
HDRI = os.environ.get('HDRI', '/home/user/twinbyte-site/tools/hdri/studio_small_09_2k.hdr')
HDRI_S = float(os.environ.get('HDRI_S', '0.55'))   # how much of the room
LAMP_S = float(os.environ.get('LAMP_S', '0.55'))   # the panels and lamps, scaled
S.render.resolution_x = RES          # BEFORE any world_to_camera_view call:
S.render.resolution_y = RES          # the default 1920x1080 silently scales every Y fraction.

# ------------------------------------------------------------------ colour
def hexc(h, a=1.0):
    h = h.lstrip('#')
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(int(h[0:2], 16)), lin(int(h[2:4], 16)), lin(int(h[4:6], 16)), a)

TEAL  = os.environ.get('C_TEAL', '#03455C')
VERM  = os.environ.get('C_VERM', '#8A3726')
COAT  = float(os.environ.get('COAT', '0.07'))
PAPER, INK, STEEL = '#F5F2EC', '#1B1914', '#2E2B23'

def mat(name, hexv, rough=0.30, coat=0.35, metal=0.0, coatr=0.06):
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

M_TEAL  = mat('teal', TEAL, rough=0.22, coat=COAT)
M_VERM  = mat('verm', VERM, rough=0.24, coat=COAT)
M_PAPER = mat('paper', PAPER, rough=0.38, coat=0.18, coatr=0.16)
M_INK   = mat('ink', INK, rough=0.50, coat=0.05)
M_STEEL = mat('steel', STEEL, rough=0.25, coat=0.0, metal=0.85)

# ------------------------------------------------- the brand-mark generator
def outline(size=2.0, r=0.42, sharp='bl', seg=10, aspect=1.0):
    """Rounded rect, three corners radiused, ONE corner dead square.
       This function IS the logo. It must never become a generic rounded box."""
    hx, hy = size / 2.0, size * aspect / 2.0
    corners = [('br', Vector((hx, -hy)), 1, -1),
               ('tr', Vector((hx, hy)), 1, 1),
               ('tl', Vector((-hx, hy)), -1, 1),
               ('bl', Vector((-hx, -hy)), -1, -1)]
    pts = []
    for name, c, cx, cy in corners:
        if name == sharp:
            pts.append(c.copy())
            continue
        cen = Vector((c.x - cx * r, c.y - cy * r))
        if cx > 0 and cy < 0:   a0, a1 = -math.pi / 2, 0.0
        elif cx > 0 and cy > 0: a0, a1 = 0.0, math.pi / 2
        elif cx < 0 and cy > 0: a0, a1 = math.pi / 2, math.pi
        else:                   a0, a1 = math.pi, 3 * math.pi / 2
        for k in range(seg + 1):
            t = a0 + (a1 - a0) * k / seg
            pts.append(Vector((cen.x + math.cos(t) * r, cen.y + math.sin(t) * r)))
    return pts

def shape(name, size, r, sharp, depth, material, bevel=0.05, aspect=1.0, seg=10):
    """Extruded from local z=0 to z=depth, so offsets below are predictable."""
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    S.collection.objects.link(ob)
    bm = bmesh.new()
    verts = [bm.verts.new((p.x, p.y, 0.0)) for p in outline(size, r, sharp, seg, aspect)]
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
    return ob

def cube(name, sx, sy, sz, material, loc=(0, 0, 0), bevel=0.012):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(scale=True)
    ob.data.materials.append(material)
    if bevel:
        mo = ob.modifiers.new('bevel', 'BEVEL')
        mo.width = bevel; mo.segments = 2
        mo.limit_method = 'ANGLE'; mo.angle_limit = math.radians(40)
    return ob

def boolean(target, cutter):
    mo = target.modifiers.new('cut', 'BOOLEAN')
    mo.operation = 'DIFFERENCE'
    mo.object = cutter
    mo.solver = 'EXACT'
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=mo.name)
    bpy.data.objects.remove(cutter, do_unlink=True)

def empty(name, loc):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.12
    e.location = loc
    S.collection.objects.link(e)
    return e

# ------------------------------------------------------------------- rig
rig = bpy.data.objects.new('rig', None)
S.collection.objects.link(rig)
rig.rotation_euler = (math.radians(90), 0, 0)

PARTS = []
def attach(ob):
    ob.parent = rig
    PARTS.append(ob)
    return ob

# ------------------------------------------------------------------ geometry
tray = shape('tray', 2.6, 0.52, 'bl', 0.24, M_TEAL, bevel=0.05)
cut = shape('traycut', 2.48, 0.46, 'bl', 0.20, M_TEAL, bevel=0.0)
cut.location = (0, 0, 0.04)
bpy.context.view_layer.update()
boolean(tray, cut)
attach(tray)

lid = shape('lid', 2.6, 0.52, 'bl', 0.18, M_TEAL, bevel=0.05)
lidcut = shape('lidcut', 2.48, 0.46, 'bl', 0.12, M_TEAL, bevel=0.0)
lidcut.location = (0, 0, -0.06)
bpy.context.view_layer.update()
boolean(lid, lidcut)
lid.location = (0, 0, 0.24)
attach(lid)

# three fact plates: paper face, ink bevel rim so they never merge into one slab
PLATE_START = [(0, 0, 0.060), (0, 0, 0.105), (0, 0, 0.150)]
PLATE_END = [(-0.42, -0.14, 0.30), (0.00, 0.20, 0.56), (0.42, 0.50, 0.82)]
BARS = [1.20, 0.95, 1.30, 0.66]
plates = []
for i in range(3):
    pl = shape('plate%d' % i, 1.70, 0.10, 'none', 0.055, M_PAPER, bevel=0.016, aspect=0.560)
    pl.data.materials.append(M_INK)           # slot 1
    pl.modifiers['bevel'].material = 1        # the rim that makes three cards read as three
    pl.location = PLATE_START[i]
    attach(pl)
    plates.append(pl)
    from mathutils import Matrix
    for j, w in enumerate(BARS):
        b = cube('bar%d_%d' % (i, j), w, 0.070, 0.022, M_INK, loc=(0, 0, 0), bevel=0.004)
        b.parent = pl
        b.matrix_parent_inverse = Matrix.Identity(4)
        b.location = (-0.10 + (1.30 - w) * 0.0, 0.29 - j * 0.155, 0.056)

rail = cube('rail', 2.60, 0.18, 0.18, M_STEEL, loc=(0, -0.86, 0.52), bevel=0.012)
attach(rail)
rail.location = (0.00, -40.0, 0.52)

card_in = shape('card_in', 0.72, 0.14, 'bl', 0.07, M_TEAL, bevel=0.012)
card_in.location = (-1.15, -0.86, 0.72)
attach(card_in)

card_out = shape('card_out', 0.72, 0.14, 'br', 0.07, M_VERM, bevel=0.012)
card_out.location = (-1.15, -0.86, 0.72)
attach(card_out)

from mathutils import Matrix
cal = shape('calendar', 1.30, 0.10, 'none', 0.14, M_PAPER, bevel=0.02, aspect=0.62)
cal.location = (0.05, -1.42, 0.30)
attach(cal)
for k in range(5):
    sl = cube('slot%d' % k, 1.08, 0.055, 0.03, M_INK, loc=(0, 0, 0), bevel=0.003)
    sl.parent = cal
    sl.matrix_parent_inverse = Matrix.Identity(4)
    sl.location = (0, 0.16 - k * 0.08, 0.142)
flap = cube('flap', 1.08, 0.075, 0.025, M_TEAL, loc=(0.05, -1.42 - 0.08, 0.45), bevel=0.005)
attach(flap)

# Parked for good. They were two terracotta tabs hanging off the right edge and
# they read as mistakes rather than as parts; the terracotta card carries the
# second ink on its own. Kept in the scene so the anchor table stays whole.
gate = cube('gate', 0.50, 0.36, 0.05, M_VERM, loc=(1.05, -40.0, 0.30), bevel=0.01)
attach(gate)
handoff = shape('handoff', 1.00, 0.16, 'br', 0.06, M_VERM, bevel=0.02, aspect=0.64)
attach(handoff)
handoff.location = (1.45, -40.0, -2.20)

for ob in PARTS:
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(34))
    except Exception:
        pass
    ob.select_set(False)

# ------------------------------------------------------------- anchor empties
ANCH = {
    'seam':   empty('a_seam', (0.95, 0.00, 0.245)),
    'plate0': empty('a_plate0', (0, 0, 0)),
    'plate1': empty('a_plate1', (0, 0, 0)),
    'plate2': empty('a_plate2', (0, 0, 0)),
    'stack':  empty('a_stack', (0.00, -0.70, 0.30)),
    'card':   empty('a_card', (0, 0, 0)),
    'cal':    empty('a_cal', (0.85, -1.62, 0.26)),
    'gate':   empty('a_gate', (1.05, -0.86, 0.40)),
    'handoff': empty('a_handoff', (0, 0, 0)),
}
for k, e in ANCH.items():
    e.parent = rig
for i in range(3):
    ANCH['plate%d' % i].parent = plates[i]
    ANCH['plate%d' % i].location = (0.55, 0.0, 0.07)
    ANCH['plate%d' % i].matrix_parent_inverse = plates[i].matrix_world.inverted()
ANCH['card'].parent = card_in
ANCH['card'].location = (0, 0, 0.09)
ANCH['card'].matrix_parent_inverse = card_in.matrix_world.inverted()
ANCH['handoff'].parent = handoff
ANCH['handoff'].location = (0, 0, 0.09)
ANCH['handoff'].matrix_parent_inverse = handoff.matrix_world.inverted()

# ------------------------------------------------------------------ camera
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 55
cam_data.sensor_width = 36
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 3.6
cam = bpy.data.objects.new('cam', cam_data)
S.collection.objects.link(cam)
S.camera = cam
focus = empty('focus', (0, 0, 0))
focus.parent = plates[1]
focus.matrix_parent_inverse = plates[1].matrix_world.inverted()
cam_data.dof.focus_object = focus

aim = empty('aim', (0, 0, 0))
aim.parent = rig
aim.location = (0.10, -0.30, float(os.environ.get('AIM_Z', '0.34')))
_track = cam.constraints.new('TRACK_TO')
_track.target = aim
_track.track_axis = 'TRACK_NEGATIVE_Z'
_track.up_axis = 'UP_Y'

def place_cam(az_deg, el_deg, r):
    az, el = math.radians(az_deg), math.radians(el_deg)
    a = aim.matrix_world.translation
    cam.location = (a.x + r * math.sin(az) * math.cos(el),
                    a.y - r * math.cos(az) * math.cos(el),
                    a.z + r * math.sin(el))

# ------------------------------- the room: something for the lacquer to reflect
#  A lacquered surface with nothing around it renders as flat plastic. Two large
#  emissive panels off camera give it highlights to roll across as it turns, and
#  a shadow catcher under it puts it on a floor instead of in a void — while
#  film_transparent keeps the background the page's job.
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
    ob.visible_camera = False          # it lights and reflects; it is never seen
    ob.visible_shadow = False
    return ob

panel('softbox_l', (-5.2, -4.6, 2.2), (72, 0, -38), 9, 7, 2.0, (0.86, 0.93, 1.0, 1))
panel('softbox_r', (5.6, -2.2, 1.4), (78, 0, 58), 7, 6, 1.1, (1.0, 0.92, 0.82, 1))
panel('strip_top', (0.2, -2.8, 5.0), (12, 0, 0), 5, 1.2, 3.2, (1.0, 0.98, 0.95, 1))
sweep = panel('sweep', (-5.0, -3.4, 1.2), (86, 0, -14), 0.8, 9, 60.0, (1, 1, 1, 1))

bpy.ops.mesh.primitive_plane_add(size=26, location=(0, 0, -1.62))
floor = bpy.context.object
floor.name = 'floor'
floor.is_shadow_catcher = True

# ------------------------------------------------------------------- lights
def area(name, loc, rot, energy, size, colour=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.energy = energy * LAMP_S; ld.size = size; ld.color = colour
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    S.collection.objects.link(ob)
    return ob

area('key',  (-3.4, -5.2, 4.6), (36, 0, -30), 700, 5)
area('fill', (4.8, -3.4, 0.9), (84, 0, 54), 220, 8)
area('rim',  (1.4, 4.8, 3.0), (-50, 0, 12), 1200, 3, (0.70, 0.83, 1.0))
area('top',  (0, -1.2, 5.6), (0, 0, 0), 260, 6)
inner = area('inner', (0, -0.55, 0.30), (90, 0, 0), 0, 2.6, (1.00, 0.96, 0.90))

# The room itself. A measured studio environment is what makes lacquer read as
# lacquer: the highlight rolling across a corner is a real softbox with a real
# falloff, not a painted gradient. film_transparent keeps it out of the picture
# — it is only ever seen in the reflections.
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
else:                                   # no file: the old painted sky, so the
    bg.inputs['Color'].default_value = (0.09, 0.11, 0.13, 1)   # script still runs
nt.links.new(bg.outputs['Background'], out.inputs['Surface'])

# ------------------------------------------------------------------- motion
PREF = bpy.context.preferences.edit
def key(ob, path, frame, value, interp='LINEAR'):
    PREF.keyframe_new_interpolation_type = interp
    if path == 'location':
        ob.location = value
    elif path == 'rotation_euler':
        ob.rotation_euler = value
    elif path == 'energy':
        ob.data.energy = value
        ob.data.keyframe_insert('energy', frame=frame)
        return
    ob.keyframe_insert(path, frame=frame)

def ease(a, b, t):
    return tuple(x + (y - x) * t for x, y in zip(a, b))

S.frame_start, S.frame_end = 1, FRAMES

# rig turn-in
key(rig, 'rotation_euler', 1, (math.radians(90), 0, math.radians(-28)), 'BEZIER')
key(rig, 'rotation_euler', 40, (math.radians(90), 0, 0), 'BEZIER')

# the highlight travels. Slow at first, then away — the eye reads polish from the
# way a reflection moves, not from how bright it is.
key(sweep, 'location', 1, (-5.0, -3.4, 1.2), 'BEZIER')
key(sweep, 'location', 46, (1.8, -3.4, 1.2), 'BEZIER')
key(sweep, 'location', 96, (7.0, -3.4, 1.2), 'BEZIER')

# lid leaves the top of frame and never comes back
key(lid, 'location', 40, (0, 0, 0.24), 'BEZIER')
key(lid, 'rotation_euler', 40, (0, 0, 0), 'BEZIER')
key(lid, 'location', 86, (0, 6.20, 0.34), 'BEZIER')
key(lid, 'rotation_euler', 86, (math.radians(-10), 0, 0), 'BEZIER')

# plates fan on three axes, staggered
for i, pl in enumerate(plates):
    a, b = 44 + i * 8, 44 + i * 8 + 26
    key(pl, 'location', 40, PLATE_START[i], 'BEZIER')
    key(pl, 'location', a, PLATE_START[i], 'BEZIER')
    key(pl, 'location', b, PLATE_END[i], 'BEZIER')

key(inner, 'energy', 44, 0, 'BEZIER')
key(inner, 'energy', 62, 110, 'BEZIER')

key(rail, 'location', 1, (0.00, -40.0, 0.52))
key(rail, 'location', 85, (0.00, -40.0, 0.52))
key(rail, 'location', 86, (0.00, -0.86, 0.52))
key(rail, 'location', 100, (0.00, -0.86, 0.52), 'BEZIER')

# the read: the teal card runs the rail and nudges each plate it passes
key(card_in, 'location', 1, (-1.15, -40.0, 0.72))
key(card_in, 'location', 85, (-1.15, -40.0, 0.72))
key(card_in, 'location', 86, (-1.15, -0.86, 0.72))
key(card_in, 'location', 100, (-1.15, -0.86, 0.72))
key(card_in, 'location', 118, (0.85, -0.86, 0.72))
key(card_in, 'location', 124, (0.85, -0.86, 0.17), 'BEZIER')
for i, pl in enumerate(plates):
    tick = 102 + i * 6
    key(pl, 'location', tick, PLATE_END[i], 'BEZIER')
    key(pl, 'location', tick + 3, (PLATE_END[i][0], PLATE_END[i][1], PLATE_END[i][2] - 0.05), 'BEZIER')
    key(pl, 'location', tick + 6, PLATE_END[i], 'BEZIER')
key(flap, 'rotation_euler', 120, (0, 0, 0), 'BEZIER')
key(flap, 'rotation_euler', 124, (math.radians(-78), 0, 0), 'BEZIER')

# THE GATE — the terracotta card runs the same rail and nothing ticks
key(card_out, 'location', 1, (-1.15, -40.0, 0.72))
key(card_out, 'location', 121, (-1.15, -40.0, 0.72))
key(card_out, 'location', 122, (-1.15, -0.86, 0.72))
key(card_out, 'location', 140, (0.72, -0.86, 0.72))
key(card_out, 'location', 150, (0.86, -0.86, 0.46), 'BEZIER')
key(card_out, 'rotation_euler', 140, (0, 0, 0), 'BEZIER')
key(card_out, 'rotation_euler', 150, (0, math.radians(-16), 0), 'BEZIER')

ONSCREEN = lambda ob, f: not (
    (ob.name == 'lid' and f > 72) or
    (ob.name == 'card_out' and f < 124) or
    ob.name in ('handoff', 'gate') or
    (ob.name == 'card_in' and f < 86) or
    (ob.name == 'rail' and f < 86))

def core_extent(frame, az, el, r):
    S.frame_set(frame)
    place_cam(az, el, r)
    bpy.context.view_layer.update()
    xs, ys = [], []
    for ob in PARTS:
        if not ONSCREEN(ob, frame):
            continue
        for corner in ob.bound_box:
            c = world_to_camera_view(S, cam, ob.matrix_world @ Vector(corner))
            xs.append(c.x); ys.append(1.0 - c.y)
    return min(xs), max(xs), min(ys), max(ys)

def fit(frames, az, el, lo=4.0, hi=30.0, pad=0.06):
    for _ in range(24):
        mid = (lo + hi) / 2
        ok = True
        for fr in frames:
            x0, x1, y0, y1 = core_extent(fr, az, el, mid)
            if x0 < pad or x1 > 1 - pad or y0 < pad or y1 > 1 - pad:
                ok = False; break
        if ok: hi = mid
        else:  lo = mid
    return round(hi, 3)

R1 = float(os.environ.get('R1', '7.00'))
R2 = float(os.environ.get('R2', '6.80'))
for fr in (1, 40, 86, 124, 150):
    az, el, r = (26, 14, R1) if fr <= 40 else (14, 9, R2)
    print('EXT f%d' % fr, [round(v, 3) for v in core_extent(fr, az, el, r)])
CAM_KEYS = [(1, 26, 14, R1), (40, 26, 14, R1), (86, 14, 9, R2), (150, 14, 9, R2)]
for f, az, el, r in CAM_KEYS:
    S.frame_set(f)
    place_cam(az, el, r)
    PREF.keyframe_new_interpolation_type = 'BEZIER'
    cam.keyframe_insert('location', frame=f)

# ------------------------------------------------------------------- render
S.render.engine = 'CYCLES'
S.cycles.device = 'CPU'
S.cycles.samples = 40
S.cycles.use_denoising = True
S.cycles.max_bounces = 8
S.render.film_transparent = True
S.render.image_settings.file_format = 'PNG'
S.render.image_settings.color_mode = 'RGBA'
S.view_settings.view_transform = 'Standard'
S.view_settings.exposure = float(os.environ.get('EXPO', '-1.2'))

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
            if ob.name == 'card_out' and f < 124:
                continue
            if ob.name in ('handoff', 'gate') or (ob.name == 'card_in' and f < 86):
                continue
            if ob.name == 'lid' and f > 70:
                continue
            for corner in ob.bound_box:
                w = ob.matrix_world @ Vector(corner)
                c = world_to_camera_view(S, cam, w)
                xs.append(c.x); ys.append(1.0 - c.y)
        ext[f] = [round(min(xs), 3), round(max(xs), 3), round(min(ys), 3), round(max(ys), 3)]
    json.dump({'frames': FRAMES, 'anchors': data}, open(path, 'w'))
    return ext

if __name__ == '__main__':
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    mode = args[0] if args else 'proof'
    os.makedirs(OUT + '/a', exist_ok=True)
    if mode == 'proof':
        ext = bake_anchors(OUT + '/a/anchors.json')
        bad = [f for f, e in ext.items() if e[0] < 0.02 or e[1] > 0.98 or e[2] < 0.02 or e[3] > 0.98]
        print('EXTENT f1', ext[1], 'f40', ext[40], 'f86', ext[86], 'f124', ext[124], 'f150', ext[150])
        print('OFF-FRAME FRAMES:', bad[:12], 'count', len(bad))
        for f in [int(x) for x in os.environ.get('PROOF_FRAMES', '86,150').split(',')]:
            S.frame_set(f)
            S.render.filepath = OUT + '/proof_a_%03d%s.png' % (f, os.environ.get('TAG', ''))
            bpy.ops.render.render(write_still=True)
        print('PROOF DONE')
    else:
        lo, hi = int(args[1]), int(args[2])
        for f in range(lo, hi + 1):
            p = OUT + '/a/%03d.png' % f
            if os.path.exists(p):
                continue
            S.frame_set(f)
            S.render.filepath = p
            bpy.ops.render.render(write_still=True)
        print('RANGE DONE', lo, hi)
