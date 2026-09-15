import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Fades and lifts its children into view the first time they are scrolled to.
 * The hiding class is applied from JS only, so without JS (or without
 * IntersectionObserver) the content is simply visible.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      setState('shown')
      return
    }
    // Already on screen at first paint: show it, don't animate what the user sees.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setState('shown')
      return
    }

    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const classes =
    state === 'idle' ? '' : state === 'hidden' ? 'reveal' : 'reveal reveal-in'

  return (
    <div
      ref={ref}
      className={`${classes} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

/** Rotates the element slightly towards the pointer. Ignored on touch and with reduced motion. */
export function useTilt<T extends HTMLElement>(max = 7, baseX = 0, baseY = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const zone = el.parentElement ?? el
    let frame = 0

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = zone.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        el.style.setProperty('--ry', `${baseY + x * max * 2}deg`)
        el.style.setProperty('--rx', `${baseX - y * max * 2}deg`)
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--rx', `${baseX}deg`)
      el.style.setProperty('--ry', `${baseY}deg`)
    }

    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', reset)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(frame)
    }
  }, [max, baseX, baseY])

  return ref
}

/** Moves the highlight inside .card to follow the cursor. */
export function spotlight(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
