import { useEffect } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import meta from '../i18n/meta.json'
import { pageMeta } from '../pageMeta'
import { waLink } from '../site'
import { Arrow, Bubble } from './marks'
import type { Translation } from '../i18n'

/*
 * Any address that is not a page. Cloudflare answers it with a 404 status
 * and the not-found shell of its language; this is what the app draws in
 * it: where you are, and the three ways on — home, the call, WhatsApp.
 */
export function NotFound({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const { title, description } = pageMeta(lang, 'notfound')
  const home = pathFor(lang, 'home')

  /* A missing page has no canonical address and no language versions, and
     must not be indexed. The shell already says so; this keeps it true when
     the back button lands here from a real page, and undoes it on the way
     out (the real pages put their own canonical and hreflang back). */
  useEffect(() => {
    document.title = title
    document.documentElement.lang = lang
    document.head.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.head
      .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:url"]')
      .forEach((el) => el.remove())
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex'
    return () => robots.remove()
  }, [lang, title, description])

  return (
    <main id="main">
      <section className="page-head page-head-plain on-ink !min-h-[72svh]">
        <div className="hero-copy container-page">
          <p className="hero-eyebrow"><span aria-hidden="true" className="hero-dot" />404</p>
          <h1 className="hero-title">{meta[lang].notfoundHeading}</h1>
          <p className="hero-lead">{description}</p>
          <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:flex-wrap">
            <Link className="btn-mint" to={home}>
              {t.privacyPage.back}
              <Arrow />
            </Link>
            <Link className="btn-ghost" to={`${home}#book`}>
              {c.nav.book}
            </Link>
            <a className="btn-ghost" href={waLink(c.hero.waText)} rel="noopener">
              <Bubble size={16} />
              {c.hero.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
