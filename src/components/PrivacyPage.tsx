import { Link, pathFor, useRoute } from '../router'
import { SITE } from '../site'
import type { Translation } from '../i18n'
import { booking } from '../i18n/booking'

/*
 * Lines still carrying a TODO_ placeholder are not rendered.
 *
 * They used to print verbatim: visitors to /privacy, /nl/privacy and /it/privacy
 * read "Controller: TODO_LEGAL_NAME" as body text. An unfilled placeholder shown
 * to the public is worse than a missing line, so the line is withheld until the
 * real value exists — and the build shouts about it (scripts/check-placeholders.mjs).
 */
const unfilled = (line: string) => /TODO_[A-Z_]+/.test(line)

export function PrivacyPage({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <main id="main">
      <section className="page-head page-head-plain on-ink">
        <div className="hero-copy container-page">
          <p className="hero-eyebrow"><span aria-hidden="true" className="hero-dot" />{t.privacyPage.updated}: {SITE.lastUpdated}</p>
          <h1 className="hero-title">{t.privacyPage.title}</h1>
          <p className="hero-lead">{t.privacyPage.intro}</p>
        </div>
      </section>
      <div className="band-paper">
      <article className="container-page max-w-measure">

        {[...t.privacyPage.sections.slice(0, 1), booking[lang].privacy, ...t.privacyPage.sections.slice(1)].map((section) => {
          const body = section.body.filter((line) => !unfilled(line))
          if (body.length === 0) return null
          return (
            <section key={section.title} className="mt-6 border-t border-paper-edge pt-3 first:mt-0">
              <h2 className="t-h3">{section.title}</h2>
              {body.map((paragraph) => (
                <p key={paragraph} className="t-body mt-2 text-small">
                  {paragraph}
                </p>
              ))}
            </section>
          )
        })}

        <p className="mt-8">
          <Link
            to={pathFor(lang, 'home')}
            className="text-body font-semibold text-teal underline underline-offset-4 hover:text-teal-deep"
          >
            {t.privacyPage.back}
          </Link>
        </p>
      </article>
      </div>
    </main>
  )
}
