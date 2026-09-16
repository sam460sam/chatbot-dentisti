import { useEffect, useState } from 'react'
import type { Translation } from '../i18n'
import { prefersReducedMotion } from './motion'

/*
 * The signature object (assistant ink only — terracotta means websites): one ordinary Tuesday, 07:00 to 23:00, sixteen cells.
 * Eight of them are inside opening hours. The other eight are the ones this
 * business is not there for — and the only number on the strip is a count of
 * its own cells, so it claims nothing we cannot show.
 *
 * It resolves on a load timer, never on scroll. Nothing here gates visibility:
 * every cell is painted and readable at first paint, and the animation only
 * changes the fill of the closed hours. Motion may add to something already
 * visible; it may never decide whether it is visible.
 */
const START_HOUR = 7
const HOURS = 16
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

  const hours = Array.from({ length: HOURS }, (_, i) => START_HOUR + i)

  return (
    <div>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${HOURS}, minmax(0, 1fr))` }}>
        {hours.map((hour, i) => {
          const open = isOpen(hour)
          return (
            <div key={hour} className="flex flex-col items-center gap-1">
              <div
                className={`h-6 w-full transition-colors duration-500 sm:h-7 ${
                  open ? 'bg-ink' : resolved ? 'bg-teal-mid' : 'bg-paper-edge-deep'
                }`}
                style={{ transitionDelay: open ? '0ms' : `${i * 26}ms` }}
              />
              {/* Only every third hour is labelled: sixteen labels at 390px is a smear. */}
              <span className="text-micro tabular-nums text-ink-mute">
                {i % 3 === 0 ? `${String(hour).padStart(2, '0')}` : ' '}
              </span>
            </div>
          )
        })}
      </div>

      <ul role="list" className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        <li className="flex items-center gap-1 text-small text-ink-soft">
          <span aria-hidden="true" className="h-0.5 w-2 bg-ink" />
          {t.dayStrip.legendOpen}
        </li>
        <li className="flex items-center gap-1 text-small text-ink-soft">
          <span aria-hidden="true" className="h-0.5 w-2 bg-teal-mid" />
          {t.dayStrip.legendShut}
        </li>
      </ul>
    </div>
  )
}
