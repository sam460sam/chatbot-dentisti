import { useEffect, useRef } from 'react'
import { mountAssembly } from '../assembly/engine'
import data from '../assembly/laptop.json'
import { prefersReducedMotion } from './motion'
import type { Translation } from '../i18n'

const BASE = '/assembly/laptop/'
const RANGES: [number, number][] = [
  [0, 0.3],
  [0.34, 0.7],
  [0.78, 1],
]

/*
 * The object pulled apart, put together by the scrollbar. The layers are cut
 * from one photograph by tools/explode-cut.py; the engine only moves them.
 *
 * With reduced motion the runway is not built at all: the finished object and
 * the last passage, static. Motion here adds to something already on the
 * page; it never decides whether it is visible.
 */
export function Assembly({ t }: { t: Translation }) {
  const runway = useRef<HTMLDivElement>(null)
  const still = prefersReducedMotion()

  useEffect(() => {
    if (still || !runway.current) return
    return mountAssembly(runway.current, data)
  }, [still])

  const a = t.assembly
  const F = data.frame
  const fit = Math.min((F * 0.96) / data.done.w, (F * 0.96) / data.done.h)

  if (still) {
    return (
      <section className="asm on-ink" aria-label={a.title}>
        <div className="container-page py-8">
          <img
            className="mx-auto block w-full max-w-[640px]"
            src={BASE + data.done.src}
            width={data.done.w}
            height={data.done.h}
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

          <div aria-hidden="true" className="asm-stage">
            <div className="asm-parts">
              {data.layers.map((L) => (
                <img
                  key={L.src}
                  className="asm-layer"
                  src={BASE + L.src}
                  width={L.w}
                  height={L.h}
                  alt=""
                  style={{ left: `${(L.x / F) * 100}%`, top: `${(L.y / F) * 100}%`, width: `${(L.w / F) * 100}%` }}
                />
              ))}
            </div>
            <img
              className="asm-done"
              src={BASE + data.done.src}
              width={data.done.w}
              height={data.done.h}
              alt=""
              style={{ width: `${((data.done.w * fit) / F) * 100}%` }}
            />
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
