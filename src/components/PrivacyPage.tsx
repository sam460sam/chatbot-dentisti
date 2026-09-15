import { ArrowLeft } from 'lucide-react'
import { Link, pathFor, useRoute } from '../router'
import { SITE } from '../site'
import type { Translation } from '../i18n'

export function PrivacyPage({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <main id="main" className="container-page pb-20 pt-28 sm:pt-32">
      <article className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t.privacyPage.title}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {t.privacyPage.updated}: {SITE.lastUpdated}
        </p>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">{t.privacyPage.intro}</p>

        {t.privacyPage.sections.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-base leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <p className="mt-12">
          <Link
            to={pathFor(lang, 'home')}
            className="inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-dark"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            {t.privacyPage.back}
          </Link>
        </p>
      </article>
    </main>
  )
}
