import { Link, pathFor, useRoute } from '../router'
import { SITE, mailLink, waLink } from '../site'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { MarkFilm } from './MarkFilm'
import { Arrow } from './marks'
import type { Translation } from '../i18n'

/*
 * The colophon claims only what is true of the built page: the assistant
 * widget on /assistant does load from another origin, so there is no
 * "zero third-party requests" line here, and there never should be.
 */
export function Footer({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const year = new Date().getFullYear()
  const b = booking[lang]
  const h = home[lang]
  const homePath = pathFor(lang, 'home')

  const pages = [
    { to: homePath, label: b.nav.book },
    { to: pathFor(lang, 'assistant'), label: b.nav.assistant },
    { to: pathFor(lang, 'websites'), label: b.nav.websites },
    { to: `${homePath}#ads`, label: h.footer.adsLink },
    { to: pathFor(lang, 'prices'), label: b.nav.prices },
  ]

  return (
    <footer className="site-footer on-ink">
      <div className="container-page grid items-center gap-6 pb-6 pt-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8 lg:pt-10">
        <div className="order-2 lg:order-1">
          <img src="/brand/logo-on-dark.svg" alt="Twinbyte" width={154} height={32} loading="lazy" decoding="async" className="h-4 w-auto" />
          <p className="mt-2 max-w-[34ch] text-lead text-paper-dim">{t.footer.tagline}</p>
          <Link to={`${homePath}#book`} className="btn-mint mt-4">
            {b.nav.book}
            <Arrow />
          </Link>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="t-label">{h.footer.pages}</p>
              <ul role="list" className="mt-2 grid gap-1">
                {pages.map((p) => (
                  <li key={p.to}>
                    <Link className="text-lead font-medium text-paper transition-colors hover:text-teal-bright" to={p.to}>
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label">{h.footer.contact}</p>
              <ul role="list" className="mt-2 grid gap-1 text-body">
                <li>
                  <a className="text-paper underline decoration-ink-edge underline-offset-4 hover:text-teal-bright [overflow-wrap:anywhere]" href={mailLink(t.contact.emailSubject)}>
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a className="text-paper underline decoration-ink-edge underline-offset-4 hover:text-teal-bright" href={waLink(b.hero.waText)} rel="noopener">
                    WhatsApp {SITE.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <Link className="text-paper-dim underline decoration-ink-edge underline-offset-4 hover:text-paper" to={pathFor(lang, 'privacy')}>
                    {t.footer.privacy}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <MarkFilm label={h.footer.film} />
        </div>
      </div>

      <div aria-hidden="true" className="footer-word container-page">twinbyte</div>

      {/* the bottom padding keeps the last line clear of the floating WhatsApp button */}
      <div className="container-page">
        <div className="rule-ink flex flex-col gap-1 pb-9 pt-3 text-micro text-paper-mute sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-measure normal-case tracking-normal">{t.footer.colophon}</p>
          <p className="tabular-nums normal-case tracking-normal">
            © {year} Twinbyte. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
