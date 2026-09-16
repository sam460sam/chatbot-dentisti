import { useEffect, useRef, useState } from 'react'
import { Menu, Close } from './marks'
import { Link, pathFor, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'

const SECTIONS = ['how', 'benefits', 'security', 'websites', 'faq', 'contact'] as const

export function Header({ t }: { t: Translation }) {
  const { lang, page } = useRoute()
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const home = pathFor(lang, 'home')

  /*
   * The read of scrollHeight forces a layout flush, and the previous frame's
   * style write dirties layout — so doing both straight out of the scroll event
   * made the browser re-lay-out an 8500px document on every tick. Cache the
   * height, recompute it only on resize, and write inside a rAF.
   */
  useEffect(() => {
    let frame = 0
    let max = 0

    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight
    }
    const paint = () => {
      frame = 0
      const bar = barRef.current
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => setOpen(false), [page, lang])

  const links = SECTIONS.map((id) => ({ id, label: t.nav[id], to: `${home}#${id}` }))

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-edge bg-paper">
      <div className="container-page flex h-7 items-center justify-between gap-2">
        <Link to={home} className="flex items-center" aria-label="Twinbyte">
          <img
            src="/logo.png"
            alt="Twinbyte"
            width={640}
            height={175}
            decoding="async"
            className="h-3 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-3 lg:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              className="text-small font-medium text-ink-soft transition-colors hover:text-teal"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <nav aria-label={t.nav.language} className="flex items-center border border-paper-edge">
            {LANGS.map((l) => (
              <Link
                key={l}
                to={pathFor(l, page)}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
                aria-label={LANG_LABELS[l]}
                className={`px-1 py-0.5 text-micro font-bold uppercase transition-colors ${
                  l === lang ? 'bg-ink text-paper' : 'text-ink-mute hover:text-ink'
                }`}
              >
                {l}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="-mr-1 p-1 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Reading progress. One 2px layer, transform only. */}
      <div
        aria-hidden="true"
        ref={barRef}
        className="h-px origin-left scale-x-0 bg-teal"
      />

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-paper-edge bg-paper lg:hidden">
          <ul role="list" className="container-page flex flex-col py-1">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-paper-edge py-2 text-body font-medium text-ink last:border-0"
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
