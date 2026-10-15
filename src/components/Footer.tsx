import { Link, pathFor, useRoute } from '../router'
import { SITE, mailLink, waLink } from '../site'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { MarkFilm } from './MarkFilm'
import { ArrowOut } from './marks'
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
    { to: pathFor(lang, 'assistant'), label: b.nav.assistant },
    { to: pathFor(lang, 'websites'), label: b.nav.websites },
    { to: `${homePath}#ads`, label: h.footer.adsLink },
    { to: pathFor(lang, 'prices'), label: b.nav.prices },
  ]
  const linkClass = 'flex min-h-[44px] items-center text-lead font-medium text-paper transition-colors hover:text-teal-bright'

  /* The two ways to write are the only contact links here, written out in
     full, so nothing is listed twice. */
  const rows = [
    { href: waLink(b.hero.waText), label: `WhatsApp ${SITE.whatsappDisplay}`, external: true },
    { href: mailLink(t.contact.emailSubject), label: SITE.email, external: false },
  ]

  return (
    <footer className="site-footer on-ink">
      {/* One grid, one film: on a phone the mark sits small beside the logo
          and the tagline; from 1024px it takes the right-hand column. */}
      <div className="container-page grid grid-cols-[168px_minmax(0,1fr)] items-center gap-x-2 gap-y-5 pb-6 pt-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-x-8 lg:pt-10">
        <div className="col-start-2 row-start-1 lg:col-start-1">
          <img src="/brand/logo-on-dark.svg" alt="Twinbyte" width={154} height={32} loading="lazy" decoding="async" className="h-3 w-auto sm:h-4" />
          <p className="mt-1 max-w-[34ch] text-body text-paper-dim sm:mt-2 sm:text-lead">{t.footer.tagline}</p>
        </div>

        <div className="col-start-1 row-start-1 lg:col-start-2 lg:row-span-3 lg:justify-self-end">
          <MarkFilm label={h.footer.film} />
        </div>

        <ul role="list" className="col-span-2 grid lg:col-span-1 lg:col-start-1">
          {rows.map((r) => (
            <li key={r.href}>
              <a className="footer-row" href={r.href} rel={r.external ? 'noopener' : undefined}>
                <span className="min-w-0 [overflow-wrap:anywhere]">{r.label}</span>
                <ArrowOut />
              </a>
            </li>
          ))}
        </ul>

        <div className="col-span-2 grid gap-5 sm:grid-cols-2 lg:col-span-1 lg:col-start-1">
          <div>
            <p className="t-label">{h.footer.pages}</p>
            <ul role="list" className="mt-1 grid">
              {pages.map((p) => (
                <li key={p.to}>
                  <Link className={linkClass} to={p.to}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label">{h.footer.more}</p>
            <ul role="list" className="mt-1 grid">
              <li>
                <a className={linkClass} href={SITE.demo[lang]}>
                  {h.menuDemo}
                </a>
              </li>
              <li>
                <a className={linkClass} href={lang === 'en' ? '/showcase/' : `/showcase/${lang}/`}>
                  {h.footer.showcase}
                </a>
              </li>
              <li>
                <Link className={linkClass} to={pathFor(lang, 'privacy')}>
                  {t.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="footer-word container-page">twinbyte</div>

      {/* the bottom padding keeps the last line clear of the floating WhatsApp
          button (16px + 48px), and of the iPhone's home indicator */}
      <div className="container-page">
        <div className="footer-base rule-ink flex flex-col gap-1 pt-3 text-micro text-paper-mute sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-measure normal-case tracking-normal">{t.footer.colophon}</p>
          <p className="tabular-nums normal-case tracking-normal">
            © {year} Twinbyte. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
