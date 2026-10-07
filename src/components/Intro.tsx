import { useState } from 'react'
import { RIBBON_A, RIBBON_B } from '../brand/mark'
import { prefersReducedMotion } from './motion'

/*
 * The opening: the two ribbons fold into the mark, then the curtain lifts.
 *
 * Once per page load, on the home page only, never with reduced motion. It is
 * a curtain over a page that is already rendered underneath, so it never
 * delays what loads; and it ignores the pointer, so a quick visitor can
 * already scroll or tap through it.
 */
let played = false
let startedAt = 0

/** True while the intro is running: a hero that mounts now times its entrance after it. */
export const introRuns = () => startedAt > 0 && performance.now() - startedAt < 1500

const A = ['#F4EFE6', '#C9C2B4']
const B = ['#96D3C0', '#6DB8A2']

export function Intro() {
  const [show, setShow] = useState(() => {
    if (played || typeof window === 'undefined' || prefersReducedMotion()) return false
    played = true
    startedAt = performance.now()
    return true
  })
  if (!show) return null
  return (
    <div className="intro" aria-hidden="true" onAnimationEnd={(e) => e.target === e.currentTarget && setShow(false)}>
      <svg viewBox="0 0 100 100" className="intro-mark">
        <g className="intro-a">
          {RIBBON_A.map((d, i) => <path key={i} d={d} fill={A[i % 2]} />)}
        </g>
        <g className="intro-b">
          {RIBBON_B.map((d, i) => <path key={i} d={d} fill={B[i % 2]} />)}
        </g>
      </svg>
    </div>
  )
}
