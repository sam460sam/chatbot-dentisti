import { ChatMockup } from './ChatMockup'
import { DayStrip } from './DayStrip'
import { Mark, Arrow, ArrowOut } from './marks'
import { SITE, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

/*
 * The hero used to sit inside a 185vh sticky runway that drove the conversation
 * from scroll position. It cost the visitor two screens of scrolling to get past
 * the first screen, and it re-rendered the whole subtree on every frame to
 * produce about six distinct states. It is gone: the hero is one screen, and the
 * conversation plays itself.
 *
 * Both calls to action carry the same weight. The demo practice site is the only
 * finished thing the company owns, and it was a text link.
 */
export function Hero({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <>
      <section className="band-paper pt-7 lg:pt-9">
        <div className="container-page grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div className="enter">
            <h1 className="t-display">{t.hero.title}</h1>

            <p className="t-lead mt-3">{t.hero.lead}</p>

            <div className="mt-4 flex flex-col gap-1 sm:flex-row">
              <a className="btn-teal" href={waLink(t.wa.assistantQuote)} rel="noopener">
                {t.hero.ctaQuote}
                <Arrow />
              </a>
              <a
                className="btn-line"
                href={SITE.demo[lang]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.hero.ctaDemo}
                <ArrowOut />
              </a>
            </div>

            <p className="mt-2 text-small text-ink-mute">{t.hero.note}</p>

            <ul role="list" className="mt-4 grid gap-1 border-t border-paper-edge pt-3 sm:grid-cols-2">
              {t.hero.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-1 text-small text-ink-soft">
                  <Mark />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <ChatMockup t={t} />
        </div>
      </section>

      {/* The signature object: the hours this business is not there to answer. */}
      <section className="band-deep" aria-labelledby="daystrip-title">
        <div className="container-page">
          <p className="t-label">{t.dayStrip.eyebrow}</p>
          <h2 id="daystrip-title" className="t-h2 mt-2 max-w-none break-words">
            {t.dayStrip.title}
          </h2>

          <div className="mt-4">
            <DayStrip t={t} />
          </div>

          <p className="t-body mt-3 max-w-lead">{t.dayStrip.caption}</p>
        </div>
      </section>
    </>
  )
}
