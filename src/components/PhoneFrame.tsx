import { useId, type CSSProperties, type ReactNode } from 'react'

/* The phone, in its own units: a 210 x 420 drawing with the screen at
   x 14, y 9, 182 x 402. The screen slot is placed in percentages of the
   drawing, so the phone can be any width and the screen stays inside it. */
export const PHONE = { w: 210, h: 420, x: 14, y: 9, sw: 182, sh: 402 }

export type Box = { w: number; h: number; x: number; y: number; sw: number; sh: number }

export function place(d: Box): CSSProperties {
  return {
    left: `${(d.x / d.w) * 100}%`,
    top: `${(d.y / d.h) * 100}%`,
    width: `${(d.sw / d.w) * 100}%`,
    height: `${(d.sh / d.h) * 100}%`,
  }
}

/*
 * A phone drawn in code: the body, the side buttons and the bezel, with a
 * screen slot for whatever it shows. No photograph and no brand: a phone
 * that belongs to nobody.
 *
 * The gradient id carries a per-instance prefix, so several phones can share
 * a page. `glass` adds the camera dot and the sheen across the screen
 * (.pf-cam, .pf-sheen in contact.css). The phone on /websites keeps its own
 * (.dvs-screen-phone in site.css), so it passes glass={false} and renders
 * exactly as before.
 */
export function PhoneFrame({
  children, className = 'pf', screenClassName = 'pf-screen', glass = true,
}: { children?: ReactNode; className?: string; screenClassName?: string; glass?: boolean }) {
  const id = `pf${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${PHONE.w} ${PHONE.h}`} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5b626e" />
            <stop offset="0.45" stopColor="#30353e" />
            <stop offset="1" stopColor="#1c1f25" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="98" width="5" height="30" rx="2.5" fill="#3b4049" />
        <rect x="1.5" y="136" width="5" height="30" rx="2.5" fill="#3b4049" />
        <rect x="203.5" y="116" width="5" height="46" rx="2.5" fill="#3b4049" />
        <rect x="5" y="0" width="200" height="420" rx="32" fill={`url(#${id}-body)`} />
        <rect x="5.75" y="0.75" width="198.5" height="418.5" rx="31.25" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.5" />
        <rect x="8.5" y="3.5" width="193" height="413" rx="28.5" fill="#07090c" />
      </svg>
      <div className={screenClassName} style={place(PHONE)}>
        {children}
        {glass && (
          <>
            <span className="pf-sheen" aria-hidden="true" />
            <span className="pf-cam" aria-hidden="true" />
          </>
        )}
      </div>
    </div>
  )
}
