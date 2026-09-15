import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Was a scroll-triggered fade-in. Sections now render visible from the first
 * paint: on a real phone the observer sometimes fired late or not at all, and
 * a visitor would sit in front of an empty screen waiting for content that had
 * already loaded. Kept as a wrapper so the layout code stays unchanged.
 */
export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** Moves the highlight inside .card to follow the cursor. */
export function spotlight(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  el.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
