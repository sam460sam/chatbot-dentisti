import { useEffect, useRef } from 'react'
import { mountFlipbook } from '../assembly/flipbook'
import { prefersReducedMotion } from './motion'
import type { Translation } from '../i18n'

const DIR = '/assembly/laptop'
const FRAMES = 100
const RANGES: [number, number][] = [
  [0, 0.3],
  [0.34, 0.7],
  [0.78, 1],
]

/* Where the labels sit, in the film's own pixels (854 x 480). The camera
   holds still for the first sixth of the film and again at the end, so these
   are placed by hand on those frames: three on the parts while the object is
   open, three under it once it is closed. */
const OPEN: [number, number][] = [
  [590, 48],
  [560, 285],
  [585, 395],
]
const CLOSED: number[] = [170, 427, 684]

/*
 * The object pulled apart, put together by the scrollbar. Two photographs
 * and a film generated between them, cut into frames by tools/film-pack.py
 * and played on a canvas by src/assembly/flipbook.ts.
 *
 * With reduced motion the runway is not built at all: the last frame and the
 * last passage, static. Motion here adds to something already on the page;
 * it never decides whether it is visible.
 */
export function Assembly({ t }: { t: Translation }) {
  const runway = useRef<HTMLDivElement>(null)
  const still = prefersReducedMotion()

  useEffect(() => {
    if (still || !runway.current) return
    return mountFlipbook(runway.current, { dir: DIR, frames: FRAMES, bounds: true })
  }, [still])

  const a = t.assembly

  if (still) {
    return (
      <section className="asm on-ink" aria-label={a.title}>
        <div className="container-page py-8">
          <img
            className="mx-auto block w-full max-w-[720px]"
            src={`${DIR}/${String(FRAMES).padStart(3, '0')}.webp`}
            width={854}
            height={480}
            alt=""
            loading="lazy"
          />
          <div className="mx-auto mt-5 max-w-lead text-center">
            <p className="t-label text-verm-bright">{a.beats[2].kick}</p>
            <h2 className="t-h2 mt-2 max-w-none">{a.beats[2].title}</h2>
            <p className="t-body mt-2">{a.beats[2].body}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="asm on-ink" aria-label={a.title}>
      <div className="asm-runway" ref={runway}>
        <div className="asm-sticky">
          <div aria-hidden="true" className="asm-glow" />

          <div className="asm-stage">
            <canvas
              width={854}
              height={480}
              aria-label="A laptop pulled apart into its parts floats on black; as the page scrolls the parts settle into each other and the laptop closes"
            />
            <svg aria-hidden="true" className="asm-pins" viewBox="0 0 854 480">
              {OPEN.map(([x, y], i) => (
                <g key={i} className="asm-pin" data-from="0" data-to="0.16">
                  <line x1={x} y1={y} x2={636} y2={y} />
                  <circle cx={x} cy={y} r={4} />
                  <text x={646} y={y + 4.5}>{a.pins[i]}</text>
                </g>
              ))}
              {CLOSED.map((x, i) => (
                <g key={i} className="asm-pin asm-pin-done" data-from="0.86" data-to="1">
                  <path d={`M${x - 9} 431 l5 5 l10 -11`} />
                  <text x={x + 12} y={436}>{a.pins[3 + i]}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="asm-beats">
            {a.beats.map((b, i) => (
              <div key={b.title} className="asm-beat" data-from={RANGES[i][0]} data-to={RANGES[i][1]}>
                <p className={`t-label ${i === 2 ? 'text-verm-bright' : 'text-teal-bright'}`}>{b.kick}</p>
                <h2 className="t-h2 mt-2 max-w-none">{b.title}</h2>
                <p className="t-body mt-2">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
