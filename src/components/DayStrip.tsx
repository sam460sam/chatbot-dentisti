import { useEffect, useState } from 'react'
import type { Translation } from '../i18n'
import { prefersReducedMotion } from './motion'

/*
 * The signature object: one ordinary Tuesday, midnight to midnight, twenty-four
 * cells. Eight of them are inside opening hours. The other sixteen are the ones
 * this business is not there for — and the only number on the strip is a count
 * of its own cells, so it claims nothing we cannot show.
 *
 * Blue is the hour you answer. White is the hour nobody does.
 *
 * The white cells carry a near-black hairline, and they need it: white on the
 * beige ground is 1.24:1, so without the outline two thirds of the strip would
 * be an invisible gap. Both kinds of cell carry the same border so the two never
 * differ by a pixel.
 *
 * It resolves on a load timer, never on scroll. Nothing here gates visibility:
 * every cell is painted and readable at first paint, and the animation only
 * changes the fill of the closed hours. Motion may add to something already
 * visible; it may never decide whether it is visible.
 */
const HOURS = 24
const OPEN_FROM = 9
const OPEN_TO = 17 // exclusive — 09:00 to 17:00 is eight cells

const isOpen = (hour: number) => hour >= OPEN_FROM && hour < OPEN_TO

export function DayStrip({ t }: { t: Translation }) {
  const [resolved, setResolved] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) return
    setResolved(false)
    const id = setTimeout(() => setResolved(true), 420)
    return () => clearTimeout(id)
  }, [])

  const hours = Array.from({ length: HOURS }, (_, i) => i)

  return (
    <div>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${HOURS}, minmax(0, 1fr))` }}>
        {hours.map((hour, i) => {
          const open = isOpen(hour)
          return (
            <div key={hour} className="flex flex-col items-center gap-1">
              <div
                className={`h-6 w-full border border-ink transition-colors duration-500 sm:h-7 ${
                  open ? 'bg-teal' : resolved ? 'bg-white' : 'bg-paper-edge-deep'
                }`}
                style={{ transitionDelay: open ? '0ms' : `${i * 18}ms` }}
              />
              {/* Only every fourth hour is labelled: twenty-four labels at 390px is a smear. */}
              <span className="text-micro tabular-nums text-ink-mute">
                {i % 4 === 0 ? `${String(hour).padStart(2, '0')}` : ' '}
              </span>
            </div>
          )
        })}
      </div>

      <ul role="list" className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <li className="flex items-center gap-1 text-small text-ink-soft">
          <span aria-hidden="true" className="h-1 w-2 border border-ink bg-teal" />
          {t.dayStrip.legendOpen}
        </li>
        <li className="flex items-center gap-1 text-small text-ink-soft">
          <span aria-hidden="true" className="h-1 w-2 border border-ink bg-white" />
          {t.dayStrip.legendShut}
        </li>
      </ul>
    </div>
  )
}
