import type { Translation } from '../i18n'

/*
 * The payoff: one day at hour resolution, ruled like a paper diary, with the
 * appointment the assistant made as the only filled block. A single day reads
 * as a real diary on a phone; a week grid reads as a chart.
 *
 * Drawn in CSS — sharp at every pixel density, and 40 kB lighter than the JPEG
 * it replaces.
 */
const ROWS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
const BOOKED = 1 // the 10:00 row

export function Diary({ t }: { t: Translation }) {
  return (
    <div className="border-x border-b border-ink bg-paper">
      <p className="t-label border-b border-paper-edge px-2 py-1">{t.demo.calendarTitle}</p>

      <ul role="list" className="px-2 py-1">
        {ROWS.map((time, i) => (
          <li
            key={time}
            className="flex items-stretch gap-2 border-b border-paper-edge py-0.5 last:border-b-0"
          >
            <span className="w-6 shrink-0 pt-0.5 text-micro tabular-nums text-ink-mute">{time}</span>

            {i === BOOKED ? (
              <span className="mark-in min-w-0 flex-1 bg-teal px-1 py-0.5">
                <span className="block truncate text-small font-semibold text-paper">
                  {t.demo.eventTitle}
                </span>
                <span className="block text-micro text-paper/80">{t.demo.eventBadge}</span>
              </span>
            ) : (
              <span aria-hidden="true" className="h-3 flex-1" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
