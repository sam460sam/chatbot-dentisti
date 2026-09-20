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
}

export function mountFlipbook(runway: HTMLElement, cfg: FlipbookConfig): () => void {
  const canvas = runway.querySelector<HTMLCanvasElement>('canvas')!
  const ctx = canvas.getContext('2d', { alpha: true })!
  const beats = Array.from(runway.querySelectorAll<HTMLElement>('.asm-beat'))

  const wide = window.innerWidth >= 1024
  const DIR = cfg.dir + (wide ? '' : '-sm')
  const FRAMES = wide ? cfg.frames : Math.ceil(cfg.frames / 2)

  const imgs: (HTMLImageElement | undefined)[] = new Array(FRAMES)
  let current = -1
  let shown = 0
  let target = 0
  let raf: number | null = null
  let box = { x: 0, y: 0, s: 0 }
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
    const s = Math.min(canvas.width, canvas.height)
    box = { s, x: Math.round((canvas.width - s) / 2), y: Math.round((canvas.height - s) / 2) }
  }

  function paint(index: number) {
    const want = Math.min(FRAMES - 1, Math.max(0, Math.round(index)))
    const use = nearest(want)
    if (use < 0 || use === current) return
    current = use
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imgs[use]!, box.x, box.y, box.s, box.s)
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
