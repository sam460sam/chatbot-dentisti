import { Mail, MessageCircle } from 'lucide-react'
import { Link, pathFor, useRoute } from '../router'
import { SITE } from '../site'
import type { Translation } from '../i18n'

export function Footer({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <footer className="on-dark relative overflow-hidden border-t border-white/10 bg-night text-white">
      <div aria-hidden="true" className="noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="container-page relative flex flex-col gap-10 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent-bright to-accent-dark text-[13px] font-extrabold text-white"
            >
              TB
            </span>
            <span className="text-[17px] font-extrabold tracking-tight">Twinbyte</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/50">{t.footer.tagline}</p>
        </div>

        <div className="text-sm">
          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-accent-bright"
              >
                <Mail size={16} aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsappNumber}`}
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-accent-bright"
                rel="noopener"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <Link
                to={pathFor(lang, 'privacy')}
                className="text-white/70 transition-colors hover:text-accent-bright"
              >
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-white/30">
            © {new Date().getFullYear()} Twinbyte. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
