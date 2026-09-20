/*
 * An object pulled apart in a photograph, put back together by the scrollbar.
 *
 * The page holds one still of the exploded object cut into layers, and one of
 * the finished object. As the runway scrolls, each layer slides to where it
 * sits in the closed stack; then the stack gives way to the photograph of the
 * finished thing. Every frame is a 2D translate or scale on a few elements:
 * no canvas, no 3D transform, no filter, no observer — the same rules as the
 * rest of the site, for the same reason (whole tiles going white on an iPhone).
 *
 * The same code, minus the types, runs inline on /showcase.
 */
export interface Layer {
  src: string
  x: number
  y: number
  w: number
  h: number
  /** where its top edge ends up, in frame pixels */
  ty: number
  fade: boolean
}

export interface AssemblyData {
  frame: number
  stack: number
  layers: Layer[]
  done: { src: string; w: number; h: number }
}

const COLLAPSE_END = 0.7
const SWAP_START = 0.72

function ease(t: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return t * t * (3 - 2 * t)
}

export function mountAssembly(runway: HTMLElement, data: AssemblyData): () => void {
  const stage = runway.querySelector<HTMLElement>('.asm-stage')!
  const parts = runway.querySelector<HTMLElement>('.asm-parts')!
  const done = runway.querySelector<HTMLElement>('.asm-done')!
  const layers = Array.from(runway.querySelectorAll<HTMLElement>('.asm-layer'))
  const beats = Array.from(runway.querySelectorAll<HTMLElement>('.asm-beat'))

  /* The finished photograph fits the frame; it starts at the size of the closed
     stack and grows to full size while it fades in. */
  const fit = Math.min((data.frame * 0.96) / data.done.w, (data.frame * 0.96) / data.done.h)
  const k0 = data.stack / (data.done.h * fit)

  let scale = 1
  let target = 0
  let shown = 0
  let raf: number | null = null
  let last = -1

  function progress(): number {
    const r = runway.getBoundingClientRect()
    const span = r.height - window.innerHeight
    if (span <= 0) return 0
    const p = -r.top / span
    return p < 0 ? 0 : p > 1 ? 1 : p
  }

  function paint(p: number) {
    const n = layers.length
    for (let i = 0; i < n; i++) {
      const L = data.layers[i]
      const start = 0.08 + 0.035 * i
      const q = ease((p - start) / (COLLAPSE_END - start))
      layers[i].style.transform = `translateY(${((L.ty - L.y) * q * scale).toFixed(2)}px)`
      if (L.fade) layers[i].style.opacity = String(1 - q)
    }

    const c = ease((p - SWAP_START) / 0.18)
    parts.style.opacity = String(1 - c)
    parts.style.transform = `scale(${(1 + 0.16 * c).toFixed(4)})`

    const d = ease((p - SWAP_START) / 0.14)
    const g = ease((p - SWAP_START) / 0.28)
    done.style.opacity = String(d)
    done.style.transform = `translate(-50%, -50%) scale(${(k0 + (1 - k0) * g).toFixed(4)})`

    for (const b of beats) {
      const on = p >= parseFloat(b.dataset.from || '0') && p <= parseFloat(b.dataset.to || '1')
      if (on !== b.classList.contains('on')) b.classList.toggle('on', on)
    }
  }

  function tick() {
    const gap = target - shown
    if (Math.abs(gap) < 0.0015) {
      shown = target
    } else {
      shown += gap * 0.22
    }
    if (shown !== last) {
      last = shown
      paint(shown)
    }
    raf = shown === target ? null : requestAnimationFrame(tick)
  }

  function onScroll() {
    target = progress()
    if (raf === null) raf = requestAnimationFrame(tick)
  }

  function onResize() {
    scale = stage.clientWidth / data.frame
    last = -1
    paint(shown)
  }

  scale = stage.clientWidth / data.frame
  target = shown = progress()
  paint(shown)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    if (raf !== null) cancelAnimationFrame(raf)
  }
}
