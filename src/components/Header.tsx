import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, pathFor, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'

const SECTIONS = ['how', 'benefits', 'security', 'websites', 'faq', 'contact'] as const

export function Header({ t }: { t: Translation }) {
  const { lang, page } = useRoute()
  const [open, setOpen] = useState(false)
  const home = pathFor(lang, 'home')

  const links = SECTIONS.map((id) => ({ id, label: t.nav[id], to: `${home}#${id}` }))

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to={home}
          className="flex items-center gap-2 font-bold tracking-tight text-ink"
          aria-label="Twinbyte"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white"
          >
            TB
          </span>
          <span className="text-lg">Twinbyte</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              className="text-sm font-medium text-ink-soft hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <nav aria-label={t.nav.language} className="flex items-center gap-1">
            {LANGS.map((l) => (
              <Link
                key={l}
                to={pathFor(l, page)}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
                aria-label={LANG_LABELS[l]}
                className={
                  l === lang
                    ? 'rounded px-2 py-1 text-xs font-bold uppercase text-accent'
                    : 'rounded px-2 py-1 text-xs font-semibold uppercase text-ink-muted hover:text-ink'
                }
              >
                {l}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="-mr-2 rounded-lg p-2 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-ink/10 bg-white lg:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-ink-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
