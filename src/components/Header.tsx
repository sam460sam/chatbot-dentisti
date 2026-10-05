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

  /* the open menu closes on Escape, and on a tap outside it */
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      menuButton.current?.focus()
    }
    const away = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('header')) setOpen(false)
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', away)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('pointerdown', away)
    }
  }, [open])

  const nav = booking[lang].nav
  const links = PAGES_IN_NAV.map((p) => ({ id: p, label: nav[p as 'assistant' | 'websites' | 'prices'], to: pathFor(lang, p) }))

  return (
    <header className="on-ink fixed inset-x-0 top-0 z-50 border-b border-ink-edge bg-black">
      <div className="container-page grid h-7 grid-cols-[auto_1fr] items-center gap-2 lg:grid-cols-[1fr_auto_1fr]">
        <Link to={home} className="flex items-center justify-self-start" aria-label="Twinbyte">
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

        <div className="flex items-center gap-1 justify-self-end">
          {/* on a phone a short label, so every page has a way to book in view;
              on the phone home page the calendar itself is right there */}
          <Link
            to={`${home}#book`}
            className={`mark-out h-4 items-center whitespace-nowrap bg-teal-bright px-1 text-small font-semibold leading-none text-ink transition-colors hover:bg-paper sm:inline-flex sm:px-2 ${page === 'home' ? 'hidden' : 'inline-flex'}`}
          >
            <span className="sm:hidden">{nav.bookShort}</span>
            <span className="hidden sm:inline">{nav.book}</span>
          </Link>
          <nav aria-label={t.nav.language} className="flex h-4 items-stretch border border-ink-edge">
            {LANGS.map((l) => (
              <Link
                key={l}
                to={pathFor(l, page)}
                hrefLang={l}
                aria-current={l === lang ? 'true' : undefined}
                aria-label={LANG_LABELS[l]}
                onClick={() => rememberLang(l)}
                className={`flex min-w-[30px] items-center justify-center px-1 text-micro font-bold uppercase transition-colors ${
                  l === lang ? 'bg-paper text-ink' : 'text-paper-mute hover:text-paper'
                }`}
              >
                {l}
              </Link>
            ))}
          </nav>

          <button
            ref={menuButton}
            type="button"
            className="-mr-1 p-[11px] text-paper lg:hidden"
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
            {links.map((l) => (
              <li key={l.id} className="border-b border-ink-edge last:border-0">
                <Link
                  to={l.to}
                  aria-current={page === l.id ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-body font-medium ${page === l.id ? 'text-teal-bright' : 'text-paper'}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pb-2 pt-1">
              <Link
                to={`${home}#book`}
                onClick={() => setOpen(false)}
                className="mark-out flex min-h-[48px] items-center justify-center bg-teal-bright px-2 text-body font-semibold text-ink"
              >
                {nav.book}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
