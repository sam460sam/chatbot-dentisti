import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, pathFor, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'

const SECTIONS = ['how', 'benefits', 'security', 'websites', 'faq', 'contact'] as const

export function Header({ t }: { t: Translation }) {
  const { lang, page } = useRoute()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const home = pathFor(lang, 'home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const bar = barRef.current
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [page, lang])

  /** Transparent over the dark hero, solid once you scroll or on the privacy page. */
  const solid = scrolled || open || page !== 'home'
  const links = SECTIONS.map((id) => ({ id, label: t.nav[id], to: `${home}#${id}` }))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'border-b border-white/10 bg-surface'
          : 'on-dark border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link to={home} className="flex items-center" aria-label="Twinbyte">
          <img
            src="/logo-white.png"
            alt="Twinbyte"
            width={640}
            height={175}
            decoding="async"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              className={`text-[14px] font-medium transition-colors ${
                solid ? 'text-ink-soft hover:text-accent-bright' : 'text-white/65 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <nav
            aria-label={t.nav.language}
            className="flex items-center rounded-lg bg-white/10 p-0.5"
          >
            {LANGS.map((l) => (
              <Link
                key={l}
                to={pathFor(l, page)}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
                aria-label={LANG_LABELS[l]}
                className={`rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  l === lang
                    ? 'bg-white/90 text-night'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {l}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="-mr-2 rounded-lg p-2 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        ref={barRef}
        className="h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-bright"
      />

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-white/10 bg-surface lg:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/5 py-3.5 text-[15px] font-medium text-ink-soft last:border-0"
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
