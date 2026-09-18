import { Mark, Arrow } from './marks'
import { waLink } from '../site'
import type { Translation } from '../i18n'

/*
 * The price list, on the page.
 *
 * Every competitor in this market makes you ask. Publishing the figures is the
 * one thing on this site that turns a visitor who likes the demo into a
 * customer, and it costs us nothing to be the only ones who do it.
 *
 * The first two plans are the websites (terracotta), the last two the assistant
 * (teal) — the ink tells you which half of the business you are reading, the
 * same as everywhere else on the page. The order is fixed in the translation,
 * so the ink is assigned by index and never travels in the copy.
 */
export function Pricing({ t }: { t: Translation }) {
  const p = t.pricing

  return (
    <section id="prices" aria-labelledby="prices-title" className="band-paper">
      <div className="container-page">
        <div className="flex items-baseline gap-2 border-t-2 border-ink pt-2">
          <span className="t-folio">{p.eyebrow}</span>
          <h2 id="prices-title" className="t-h2">
            {p.title}
          </h2>
        </div>

        <p className="t-lead mt-2">{p.lead}</p>

        {/* The launch offer. It is a plate, not a banner: it is the loudest
            thing in this band on purpose, and it has an end date built into
            its own wording — three clients, then it is gone. */}
        <div className="mt-5 border border-ink bg-ink px-3 py-3 plate-teal sm:px-4 sm:py-4">
          <p className="t-label text-paper-mute">{p.launch.tag}</p>
          <p className="mt-1 max-w-measure text-body text-paper">{p.launch.body}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {p.plans.map((plan, i) => {
            const teal = i >= 2
            return (
              <article
                key={plan.name}
                className={`flex flex-col border border-ink bg-paper p-3 sm:p-4 ${
                  teal ? 'plate-teal' : 'plate-verm'
                }`}
              >
                <h3 className="t-h3">{plan.name}</h3>

                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-y border-paper-edge py-2">
                  <div>
                    <dt className="text-micro uppercase tracking-[0.14em] text-ink-mute">
                      {p.setupLabel}
                    </dt>
                    <dd className="font-display text-h3 font-bold tabular-nums text-ink">
                      {plan.setup}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-micro uppercase tracking-[0.14em] text-ink-mute">
                      {p.monthLabel}
                    </dt>
                    <dd
                      className={`font-display text-h3 font-bold tabular-nums ${
                        teal ? 'text-teal' : 'text-verm'
                      }`}
                    >
                      {plan.month}
                    </dd>
                  </div>
                </dl>

                <ul role="list" className="mt-3 grid gap-1">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-start gap-1 text-small text-ink-soft">
                      <Mark tone={teal ? 'teal' : 'verm'} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        {/* The bundle is the offer we actually want taken, so it gets the width
            the single plans do not. */}
        <article className="mt-3 border border-ink bg-paper-deep p-3 plate-ink sm:p-4">
          <p className="t-label">{p.bundle.tag}</p>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h3 className="t-h3">{p.bundle.name}</h3>
            <p className="font-display text-h3 font-bold tabular-nums text-ink">
              {p.bundle.setup}
              <span className="text-small font-semibold text-ink-mute"> · {p.setupLabel}</span>
            </p>
            <p className="font-display text-h3 font-bold tabular-nums text-teal">
              {p.bundle.month}
              <span className="text-small font-semibold text-ink-mute"> · {p.monthLabel}</span>
            </p>
          </div>

          <p className="t-body mt-2">{p.bundle.body}</p>

          <a className="btn-teal mt-3" href={waLink(t.wa.assistantQuote)} rel="noopener">
            {p.cta}
            <Arrow />
          </a>
        </article>

        <ul role="list" className="mt-4 grid gap-1 border-t border-paper-edge pt-3">
          {p.fine.map((line) => (
            <li key={line} className="text-small text-ink-mute">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
