import { useEffect, useRef, useState } from 'react'
import { Menu, Close } from './marks'
import { Link, pathFor, rememberLang, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'
import { booking } from '../i18n/booking'
import type { Page } from '../router'

const PAGES_IN_NAV: Page[] = ['assistant', 'websites', 'prices']

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

  const nav = booking[lang].nav
  const links = PAGES_IN_NAV.map((p) => ({ id: p, label: nav[p as 'assistant' | 'websites' | 'prices'], to: pathFor(lang, p) }))

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-edge bg-black">
      <div className="container-page flex h-7 items-center justify-between gap-2">
        <Link to={home} className="flex items-center" aria-label="Twinbyte">
          <img
            src="/logo-white.png"
            alt="Twinbyte"
            width={640}
            height={175}
            decoding="async"
            className="h-3 w-auto"
          />
        </Link>

        <nav aria-label={t.nav.main} className="hidden items-center gap-3 lg:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              to={l.to}
              aria-current={page === l.id ? 'page' : undefined}
              className={`text-small font-medium transition-colors hover:text-paper ${page === l.id ? 'text-paper' : 'text-paper-dim'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to={`${home}#book`}
            className="mark-out hidden items-center whitespace-nowrap bg-teal-bright px-2 py-1 text-small font-semibold leading-none text-ink transition-colors hover:bg-paper sm:inline-flex"
          >
            {nav.book}
          </Link>
          <nav aria-label={t.nav.language} className="flex items-center border border-ink-edge">
            {LANGS.map((l) => (
              <Link
                key={l}
                to={pathFor(l, page)}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
                aria-label={LANG_LABELS[l]}
                onClick={() => rememberLang(l)}
                className={`px-1 py-0.5 text-micro font-bold uppercase transition-colors ${
                  l === lang ? 'bg-paper text-ink' : 'text-paper-mute hover:text-paper'
                }`}
              >
                {l}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="-mr-1 p-1 text-paper lg:hidden"
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
        <nav id="mobile-menu" aria-label={t.nav.main} className="border-t border-ink-edge bg-black lg:hidden">
          <ul role="list" className="container-page flex flex-col py-1">
            {[{ id: 'home', label: nav.book, to: `${home}#book` }, ...links].map((l) => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink-edge py-2 text-body font-medium text-paper last:border-0"
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
