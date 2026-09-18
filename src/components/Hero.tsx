import { HeroStage } from './HeroStage'
import { DayStrip } from './DayStrip'
import { Diary } from './Diary'
import { Mark, Arrow, ArrowOut } from './marks'
import { SITE, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

/*
 * One screen, one composition.
 *
 * The right column used to be a flat card of chat bubbles that stopped in mid
 * air, leaving the bottom-right quarter of the first screen empty. It said
 * "assistant" and nothing about the other half of the business.
 *
 * It is now a lit stage carrying both: the site we build, in a window, and the
 * conversation that site is having at 23:47, on a phone in front of it. The
 * three claims that used to be a bullet list under the buttons are a ruled strip
 * under the whole thing, where they read as a designed row rather than clutter.
 */
export function Hero({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <>
      <section className="band-hero pb-7 pt-9 sm:pb-8 lg:pb-9 lg:pt-10">
        <div className="container-page">
          {/* The launch offer, on the first screen. It is not a floating banner:
              it sits in the flow, above the headline, and it goes away by itself
              when the third client signs. */}
          <a
            href="#prices"
            className="mb-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border border-ink bg-ink px-2 py-1 text-small text-paper transition-colors hover:bg-ink-edge"
          >
            <span aria-hidden="true" className="flex shrink-0 translate-y-0.5 gap-0.5">
              <span className="block h-1 w-1 bg-teal-bright" />
              <span className="block h-1 w-1 bg-verm-bright" />
            </span>
            <span className="font-semibold">{t.pricing.bar.text}</span>
            <span className="text-paper-dim underline underline-offset-2">{t.pricing.bar.cta} →</span>
          </a>

          <div className="grid items-center gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-7">
            <div className="enter">
              <h1 className="t-display">{t.hero.title}</h1>

              <p className="t-lead mt-3">{t.hero.lead}</p>

              <div className="mt-4 flex flex-col gap-1 sm:flex-row">
                <a className="btn-teal sm:whitespace-nowrap" href={waLink(t.wa.assistantQuote)} rel="noopener">
                  {t.hero.ctaQuote}
                  <Arrow />
                </a>
                <a
                  className="btn-line sm:whitespace-nowrap"
                  href={SITE.demo[lang]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.hero.ctaDemo}
                  <ArrowOut />
                </a>
              </div>

              <p className="mt-2 max-w-lead text-small text-ink-mute">{t.hero.note}</p>
            </div>

            <HeroStage t={t} />
          </div>

          <ul role="list" className="facts mt-6 lg:mt-7">
            {t.hero.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-1 text-small text-ink-soft">
                <Mark />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The signature object: the hours this business is not there to answer,
          and the appointment that landed while nobody was in the shop. */}
      <section className="band-deep" aria-labelledby="daystrip-title">
        <div className="container-page">
          <p className="t-label">{t.dayStrip.eyebrow}</p>
          <h2 id="daystrip-title" className="t-h2 mt-2 max-w-none break-words">
            {t.dayStrip.title}
          </h2>

          <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-6">
            <div>
              <DayStrip t={t} />
              <p className="t-body mt-3 max-w-lead">{t.dayStrip.caption}</p>
            </div>

            <Diary t={t} />
          </div>
        </div>
      </section>
    </>
  )
}
