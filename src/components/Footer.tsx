import { Link, pathFor, useRoute } from '../router'
import { SITE, mailLink } from '../site'
import type { Translation } from '../i18n'

/*
 * The colophon claims only what is true of the built page. Three of the four
 * design directions wanted it to read "0 third-party requests" — but the live
 * page injects the chat widget from another origin and calls the assistant API,
 * so that line would be false, and falsifiable in ten seconds with devtools.
 * On a page whose whole argument is honesty, one unverifiable line is worse
 * than no line at all.
 */
export function Footer({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const year = new Date().getFullYear()

  return (
    <footer className="on-ink border-t border-ink-edge bg-ink text-paper">
      <div className="container-page grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
        <div>
          <img
            src="/logo-white.png"
            alt="Twinbyte"
            width={640}
            height={175}
            loading="lazy"
            decoding="async"
            className="h-3 w-auto"
          />
          <p className="mt-2 max-w-measure text-small text-paper-dim">{t.footer.tagline}</p>
        </div>

        <ul role="list" className="grid gap-0.5 text-small sm:text-right">
          <li>
            <a className="text-paper underline underline-offset-4 hover:text-teal-bright" href={mailLink(t.contact.emailSubject)}>
              {SITE.email}
            </a>
          </li>
          <li>
            <a
              className="text-paper underline underline-offset-4 hover:text-teal-bright"
              href={`https://wa.me/${SITE.whatsappNumber}`}
              rel="noopener"
            >
              WhatsApp {SITE.whatsappDisplay}
            </a>
          </li>
          <li>
            <Link className="text-paper-dim underline underline-offset-4 hover:text-paper" to={pathFor(lang, 'privacy')}>
              {t.footer.privacy}
            </Link>
          </li>
        </ul>
      </div>

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
