import { HeroStage } from './HeroStage'
import { Arrow, ArrowOut } from './marks'
import { SITE, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

/*
 * The first screen, on black.
 *
 * Two lines that say what the thing is, one sentence, two buttons, and the
 * product itself: the site we build in a window, the conversation it is
 * having on a phone in front of it, and the appointment that comes out of
 * it. Everything that used to sit around that (three bullets, a note, a bar
 * with the launch offer) is gone or reduced to one small line, because the
 * picture already says it.
 */
export function Hero({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <section className="band-hero on-ink pb-8 pt-9 sm:pb-9 lg:pt-10">
      <div className="container-page">
        <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-9">
          <div className="enter">
            <h1 className="t-display">{t.hero.title}</h1>

            <p className="t-lead mt-3">{t.hero.lead}</p>

            <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:flex-wrap">
              <a className="btn-teal-bright sm:whitespace-nowrap" href={waLink(t.wa.assistantQuote)} rel="noopener">
                {t.hero.ctaQuote}
                <Arrow />
              </a>
              <a
                className="btn-line-flood sm:whitespace-nowrap"
                href={SITE.demo[lang]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.hero.ctaDemo}
                <ArrowOut />
              </a>
            </div>

            {/* The launch offer, one line. It goes away when the third client signs. */}
            <p className="mt-3 text-small text-paper-dim">
              {t.pricing.bar.text}{' '}
              <a href="#prices" className="text-teal-bright underline underline-offset-4 hover:text-paper">
                {t.pricing.bar.cta}
              </a>
            </p>
          </div>

          <HeroStage t={t} />
        </div>
      </div>
    </section>
  )
}
