import { useState } from 'react'
import { RIBBON_A, RIBBON_B } from '../brand/mark'
import { prefersReducedMotion } from './motion'

/*
 * The opening: the two ribbons fold into the mark, then the curtain lifts.
 *
 * Once per browser tab, on the home page only, never with reduced motion. It
 * is a curtain over a page that is already rendered underneath, so it never
 * delays what loads; and it ignores the pointer, so a quick visitor can
 * already scroll or tap through it.
 *
 * Not on a reload, nor on the way back from the showcase: the flag lives in
 * sessionStorage, which stays in this tab and is never sent anywhere. Not
 * when the page mounted late either (a slow phone, a slow line): that
 * visitor has already looked at a navy screen long enough.
 */
let played = false
let startedAt = 0
const SEEN = 'tb-intro'

/** True while the intro is running: a hero that mounts now times its entrance with it. */
export const introRuns = () => startedAt > 0 && performance.now() - startedAt < 900

function firstInThisTab(): boolean {
  try {
    if (sessionStorage.getItem(SEEN)) return false
    sessionStorage.setItem(SEEN, '1')
  } catch {
    /* storage blocked: once per page load, as before */
  }
  return true
}

const A = ['#F4EFE6', '#C9C2B4']
const B = ['#96D3C0', '#6DB8A2']

export function Intro() {
  const [show, setShow] = useState(() => {
    if (played || typeof window === 'undefined' || prefersReducedMotion() || performance.now() > 1200) return false
    played = true
    if (!firstInThisTab()) return false
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
