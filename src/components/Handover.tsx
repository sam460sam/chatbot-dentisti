import type { Translation } from '../i18n'
import { Mark } from './marks'

/*
 * Where the assistant stops.
 *
 * Drawn with divs and 1px rules rather than an SVG with embedded <text>, so the
 * Dutch and Italian labels reflow instead of overlapping. The empty name and
 * number boxes are the point: they show what gets taken, and that a person is
 * the one who acts on it.
 */
export function Handover({ t }: { t: Translation }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
      <div>
        <p className="t-label">{t.scenes.handover.eyebrow}</p>
        <h2 className="t-h2 mt-2">
          {t.scenes.handover.lead} <span className="serif text-teal-bright">{t.scenes.handover.accent}</span>
          {t.scenes.handover.tail ? ` ${t.scenes.handover.tail}` : ''}
        </h2>
        <p className="t-body mt-3">{t.scenes.handover.body}</p>
      </div>

      <div className="rule-ink pt-3">
        {/* The question */}
        <p className="font-display text-h4 font-bold text-paper">{t.demo.knows}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {/* Yes — it books */}
          <div className="mark-in border border-teal-bright bg-teal/25 p-2">
            <p className="text-micro font-bold uppercase text-teal-bright">{t.demo.yes}</p>
            <p className="mt-1 text-small text-paper">{t.demo.books}</p>
          </div>

          {/* No — it takes the details and hands over */}
          <div className="mark-out border border-verm-bright bg-verm/30 p-2">
            <p className="text-micro font-bold uppercase text-verm-bright">{t.demo.no}</p>
            <p className="mt-1 text-small text-paper">{t.demo.toAPerson}</p>

            <div className="mt-2 grid gap-1">
              {[t.demo.fieldName, t.demo.fieldPhone].map((label) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="text-micro uppercase text-paper-mute">{label}</span>
                  <span aria-hidden="true" className="h-2 flex-1 border border-ink-edge" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-1 text-small text-paper-dim">
          <Mark tone="paper" />
          <span>{t.demo.callback}</span>
        </p>
      </div>
    </div>
  )
}
