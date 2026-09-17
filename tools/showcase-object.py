import bpy, bmesh, math, sys
from mathutils import Vector

# ---------------------------------------------------------------- clean slate
bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene

def hexc(h, a=1.0):
    h = h.lstrip('#')
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    # sRGB -> linear
    def lin(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (lin(r), lin(g), lin(b), a)

TEAL   = '#0E5266'
TEALHI = '#59B9CC'
VERM   = '#A14531'
PAPER  = '#F5F2EC'

# ------------------------------------------------------- the bubble outline
# A square with three rounded corners and one sharp one. Which corner is sharp
# is the whole brand mark: sharp bottom-left = said TO you, sharp bottom-right
# = your turn.
def outline(size=2.0, r=0.42, sharp='bl', seg=16):
    h = size / 2
    corners = [
        ('br', Vector(( h, -h))),
        ('tr', Vector(( h,  h))),
        ('tl', Vector((-h,  h))),
        ('bl', Vector((-h, -h))),
    ]
    pts = []
    for i, (name, c) in enumerate(corners):
        if name == sharp:
            pts.append(c.copy())
            continue
        # direction of the two edges meeting at this corner
        cx = 1 if c.x > 0 else -1
        cy = 1 if c.y > 0 else -1
        centre = Vector((c.x - cx * r, c.y - cy * r))
        a0 = math.atan2(c.y - centre.y, 0.0) if False else None
        # sweep the quarter arc from the x-edge to the y-edge
        start = 0.0 if cx > 0 else math.pi
        if cx > 0 and cy < 0:   start, end = -math.pi / 2, 0.0
        elif cx > 0 and cy > 0: start, end = 0.0, math.pi / 2
        elif cx < 0 and cy > 0: start, end = math.pi / 2, math.pi
        else:                   start, end = math.pi, 3 * math.pi / 2
        for k in range(seg + 1):
            t = start + (end - start) * k / seg
            pts.append(Vector((centre.x + math.cos(t) * r, centre.y + math.sin(t) * r)))
    return pts

def bubble(name, sharp, colour, depth=0.34, size=2.0, radius=0.42, bevel=0.05):
    me = bpy.data.meshes.new(name)
    ob = bpy.data.objects.new(name, me)
    S.collection.objects.link(ob)

    bm = bmesh.new()
    verts = [bm.verts.new((p.x, p.y, 0.0)) for p in outline(size, radius, sharp)]
    face = bm.faces.new(verts)
    bmesh.ops.translate(bm, verts=bm.verts[:], vec=(0, 0, -depth / 2))
    ret = bmesh.ops.extrude_face_region(bm, geom=[face])
    moved = [e for e in ret['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=(0, 0, depth))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bmesh.ops.bevel(bm, geom=bm.verts[:] + bm.edges[:], offset=bevel, segments=4,
                    profile=0.5, affect='EDGES', clamp_overlap=True)
    bm.to_mesh(me)
    bm.free()

    mat = bpy.data.materials.new(name + '-mat')
    mat.use_nodes = True
    b = mat.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(colour)
    b.inputs['Roughness'].default_value = 0.30
    if 'Coat Weight' in b.inputs:
        b.inputs['Coat Weight'].default_value = 0.35
        b.inputs['Coat Roughness'].default_value = 0.12
    ob.data.materials.append(mat)

    for p in me.polygons:
        p.use_smooth = True
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(34))
    except Exception:
        pass
    ob.select_set(False)
    return ob

def dot(name, loc, colour=PAPER, r=0.19):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=32, ring_count=16, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.scale = (1, 1, 0.40)
    mat = bpy.data.materials.new(name + '-mat')
    mat.use_nodes = True
    b = mat.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexc(colour)
    b.inputs['Roughness'].default_value = 0.45
    ob.data.materials.append(mat)
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob

# --------------------------------------------------------------- the objects
rig = bpy.data.objects.new('rig', None)
S.collection.objects.link(rig)

front = bubble('bubble-in', 'bl', TEAL, depth=0.36, size=2.05, radius=0.44)
front.location = (-0.30, -0.26, 0.18)
front.rotation_euler = (math.radians(90), 0, 0)

back = bubble('bubble-out', 'br', VERM, depth=0.32, size=1.70, radius=0.38)
back.location = (0.76, 0.34, -0.48)
back.rotation_euler = (math.radians(90), 0, math.radians(-9))

d1 = dot('dot-1', (-0.63, -0.26 - 0.185, 0.20))
d2 = dot('dot-2', (0.03, -0.26 - 0.185, 0.20))

for ob in (front, back, d1, d2):
    ob.parent = rig

# ------------------------------------------------------------------- camera
cam_data = bpy.data.cameras.new('cam')
cam_data.lens = 66
cam = bpy.data.objects.new('cam', cam_data)
S.collection.objects.link(cam)
cam.location = (0.30, -8.0, 2.6)
cam.rotation_euler = (math.radians(78.0), 0, math.radians(2.0))
S.camera = cam

# --------------------------------------------------------------------- world
# A black world leaves a lacquered surface with nothing to reflect, which is why
# the first render looked like matte plastic. This is a soft vertical gradient,
# dim enough not to lift the transparent film.
world = bpy.data.worlds.new('world')
S.world = world
world.use_nodes = True
nt = world.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)
out = nt.nodes.new('ShaderNodeOutputWorld')
bg = nt.nodes.new('ShaderNodeBackground')
grad = nt.nodes.new('ShaderNodeTexGradient')
grad.gradient_type = 'LINEAR'
mapn = nt.nodes.new('ShaderNodeMapping')
texc = nt.nodes.new('ShaderNodeTexCoord')
ramp = nt.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].color = (0.02, 0.03, 0.04, 1)
ramp.color_ramp.elements[1].color = (0.42, 0.50, 0.55, 1)
mapn.inputs['Rotation'].default_value[1] = math.radians(90)
nt.links.new(texc.outputs['Generated'], mapn.inputs['Vector'])
nt.links.new(mapn.outputs['Vector'], grad.inputs['Vector'])
nt.links.new(grad.outputs['Color'], ramp.inputs['Fac'])
nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = 0.55
nt.links.new(bg.outputs['Background'], out.inputs['Surface'])

# ------------------------------------------------------------------- lights
def area(name, loc, rot, energy, size, colour=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.energy = energy
    ld.size = size
    ld.color = colour
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    S.collection.objects.link(ob)
    return ob

area('key',   (-3.9, -4.4,  5.2), (44, 0, -40), 1750, 5.5)
area('fill',  ( 5.6, -3.0,  0.4), (88, 0,  60),  420, 9, (1.0, 0.93, 0.86))
area('rim',   ( 2.2,  4.8,  3.0), (-56, 0, 18), 1800, 4, (0.55, 0.85, 0.98))
area('kick',  (-5.2,  2.6,  0.2), (92, 0, -66),  900, 4, (0.98, 0.72, 0.58))

# ------------------------------------------------------------------- render
S.render.engine = 'CYCLES'
S.cycles.device = 'CPU'
S.cycles.samples = int(sys.argv[sys.argv.index('--samples') + 1]) if '--samples' in sys.argv else 40
S.cycles.use_denoising = True
S.cycles.max_bounces = 6
S.render.film_transparent = True
S.render.resolution_x = 900
S.render.resolution_y = 900
S.render.resolution_percentage = 100
S.render.image_settings.file_format = 'PNG'
S.render.image_settings.color_mode = 'RGBA'
S.view_settings.view_transform = 'Standard'

# -------------------------------------------------------------- the turntable
FRAMES = int(sys.argv[sys.argv.index('--frames') + 1]) if '--frames' in sys.argv else 120
S.frame_start = 1
S.frame_end = FRAMES
bpy.context.preferences.edit.keyframe_new_interpolation_type = 'LINEAR'
rig.rotation_mode = 'XYZ'
TILT = math.radians(-7)
rig.rotation_euler = (TILT, 0, 0)
rig.keyframe_insert('rotation_euler', frame=1)
rig.rotation_euler = (TILT, 0, math.radians(360))
rig.keyframe_insert('rotation_euler', frame=FRAMES + 1)
print('SCENE READY', FRAMES, 'frames')
