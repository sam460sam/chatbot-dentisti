/*
 * A frame sequence played by the scrollbar, on a canvas.
 *
 * The same trick the big product launches use, and the same code as the two
 * sequences on /showcase, without the pins: a runway of some viewport-heights,
 * a sticky screen inside it, one canvas, one drawImage per scroll frame. It
 * follows the scrollbar with a little easing so a wheel notch does not skip.
 *
 * Frames are DIR/001.webp ... on a desktop and DIR-sm/ on a phone, which plays
 * every second frame of the same sequence: half the weight, and at a phone's
 * scroll distance the step between two frames is the same size on screen.
 * Loading is coarse to fine: every eighth frame, then every fourth, then the
 * rest, so the sequence is usable early and only gets smoother.
 *
 * No observer: the frame is a function of scroll position, never of whether
 * something "became visible".
 */
export interface FlipbookConfig {
  dir: string
  frames: number
  /** DIR/bounds.json exists: where the object is in every frame, so the
      canvas can zoom to it instead of showing the whole (mostly empty) film.
      On a phone this is the difference between a laptop and a black square. */
  bounds?: boolean
}

interface Bounds {
  w: number
  h: number
  boxes: number[][]
}

export function mountFlipbook(runway: HTMLElement, cfg: FlipbookConfig): () => void {
  const canvas = runway.querySelector<HTMLCanvasElement>('canvas')!
  const ctx = canvas.getContext('2d', { alpha: true })!
  /* passages and pins alike: anything that says when it is on */
  const beats = Array.from(runway.querySelectorAll<HTMLElement | SVGElement>('[data-from]'))
  const svg = runway.querySelector<SVGSVGElement>('svg.asm-pins')
  let bounds: Bounds | null = null

  const wide = window.innerWidth >= 1024
  const DIR = cfg.dir + (wide ? '' : '-sm')
  const FRAMES = wide ? cfg.frames : Math.ceil(cfg.frames / 2)

  const imgs: (HTMLImageElement | undefined)[] = new Array(FRAMES)
  let current = -1
  let shown = 0
  let target = 0
  let raf: number | null = null
  let alive = true

  const path = (i: number) => `${DIR}/${String(i + 1).padStart(3, '0')}.webp`

  function progress(): number {
    const r = runway.getBoundingClientRect()
    const span = r.height - window.innerHeight
    if (span <= 0) return 0
    const p = -r.top / span
    return p < 0 ? 0 : p > 1 ? 1 : p
  }

  function nearest(i: number): number {
    if (imgs[i]) return i
    for (let d = 1; d < FRAMES; d++) {
      if (i - d >= 0 && imgs[i - d]) return i - d
      if (i + d < FRAMES && imgs[i + d]) return i + d
    }
    return -1
  }

  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(canvas.clientWidth * dpr)
    canvas.height = Math.round(canvas.clientHeight * dpr)
  }

  /* The frame on a phone is every second one of the renderer's. */
  const toRender = (i: number) => Math.round((i * (cfg.frames - 1)) / (FRAMES - 1))

  function paint(index: number) {
    const want = Math.min(FRAMES - 1, Math.max(0, Math.round(index)))
    const use = nearest(want)
    if (use < 0 || use === current) return
    current = use
    const img = imgs[use]!
    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight

    /* Contain the whole frame, or, with bounds, the object with a little air
       around it: never closer than 2.2x the whole-frame fit, which is where
       a 854px frame starts to look soft. */
    let s = Math.min(cw / iw, ch / ih)
    let cx = iw / 2
    let cy = ih / 2
    if (bounds) {
      const k = iw / bounds.w
      const [bx, by, bw, bh] = bounds.boxes[Math.min(bounds.boxes.length - 1, toRender(use))]
      s = Math.min(Math.min(cw / (bw * k * 1.16), ch / (bh * k * 1.16)), s * 2.2)
      cx = (bx + bw / 2) * k
      cy = (by + bh / 2) * k
    }
    const dx = cw / 2 - cx * s
    const dy = ch / 2 - cy * s
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, iw * s, ih * s)

    /* The pins are drawn in the film's own pixels: show them the same window. */
    if (svg && bounds) {
      const k = iw / bounds.w
      const u = k * s
      svg.setAttribute('viewBox', `${(-dx / u).toFixed(1)} ${(-dy / u).toFixed(1)} ${(cw / u).toFixed(1)} ${(ch / u).toFixed(1)}`)
    }
  }

  function beat(p: number) {
    for (const b of beats) {
      const on = p >= parseFloat(b.dataset.from || '0') && p <= parseFloat(b.dataset.to || '1')
      if (on !== b.classList.contains('on')) b.classList.toggle('on', on)
    }
  }

  function tick() {
    const gap = target - shown
    if (Math.abs(gap) < 0.4) {
      shown = target
      paint(shown)
      raf = null
      return
    }
    shown += gap * 0.2
    paint(shown)
    raf = requestAnimationFrame(tick)
  }

  function onScroll() {
    const p = progress()
    target = p * (FRAMES - 1)
    beat(p)
    if (raf === null) raf = requestAnimationFrame(tick)
  }

  function onResize() {
    measure()
    current = -1
    paint(shown)
  }

  function load(i: number, then?: () => void) {
    const im = new Image()
    im.decoding = 'async'
    im.onload = () => {
      if (!alive) return
      imgs[i] = im
      then?.()
    }
    im.onerror = () => then?.()
    im.src = path(i)
  }

  function chain(order: number[], k: number) {
    if (!alive || k >= order.length) return
    load(order[k], () => {
      current = -1
      paint(shown)
      chain(order, k + 1)
    })
  }

  measure()
  if (cfg.bounds) {
    fetch(`${cfg.dir}/bounds.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Bounds | null) => {
        if (!alive || !j || !j.boxes) return
        bounds = j
        current = -1
        paint(shown)
      })
      .catch(() => {})
  }
  load(0, () => {
    const p = progress()
    target = shown = p * (FRAMES - 1)
    paint(shown)
    beat(p)
    const order: number[] = []
    const seen: Record<number, true> = {}
    for (let step = 8; step >= 1; step = step >> 1) {
      for (let i = 0; i < FRAMES; i += step) {
        if (!seen[i]) {
          seen[i] = true
          order.push(i)
        }
      }
    }
    chain(order, 0)
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  return () => {
    alive = false
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    if (raf !== null) cancelAnimationFrame(raf)
  }
}
