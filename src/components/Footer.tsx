import { Mail } from 'lucide-react'
import { Link, pathFor, useRoute } from '../router'
import { SITE } from '../site'
import type { Translation } from '../i18n'

export function Footer({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white"
            >
              TB
            </span>
            <span className="text-lg font-bold">Twinbyte</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t.footer.tagline}</p>
        </div>

        <div className="text-sm">
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white"
              >
                <Mail size={16} aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsappNumber}`}
                className="text-white/80 hover:text-white"
                rel="noopener"
              >
                WhatsApp {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <Link to={pathFor(lang, 'privacy')} className="text-white/80 hover:text-white">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-white/50">
            © {new Date().getFullYear()} Twinbyte. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
