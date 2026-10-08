import { useEffect, useRef, useState } from 'react'
import { Menu, Close, Bubble } from './marks'
import { Link, pathFor, rememberLang, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { SITE, waLink } from '../site'
import type { Page } from '../router'

const PAGES_IN_NAV: Page[] = ['assistant', 'websites', 'prices']

/*
 * One bar on every page. Over the home hero it starts clear and fills in as
 * the page scrolls (CSS scroll timeline; where that is missing it is simply
 * filled). On a phone the menu is a full sheet with big links.
 */
export function Header({ t }: { t: Translation }) {
  const { lang, page } = useRoute()
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const homePath = pathFor(lang, 'home')
  const nav = booking[lang].nav
  const h = home[lang]

  /* Safari on an iPhone shows :active (the press feedback in site.css) only
     on a page that listens for touches. The listener does nothing else. */
  useEffect(() => {
    const noop = () => {}
    document.addEventListener('touchstart', noop, { passive: true })
    return () => document.removeEventListener('touchstart', noop)
  }, [])

  /*
   * Reading progress. The read of scrollHeight forces layout, so it is cached
   * and only re-measured on resize; the write happens inside a rAF.
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
    /* the page grows after images and the booker load */
    const late = window.setTimeout(onResize, 1500)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
      clearTimeout(late)
    }
  }, [page, lang])

  useEffect(() => setOpen(false), [page, lang])

  /* the open sheet: Escape closes it, the page behind does not scroll */
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      menuButton.current?.focus()
    }
    document.addEventListener('keydown', key)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', key)
      document.body.style.overflow = overflow
    }
  }, [open])

  const links = [
    ...PAGES_IN_NAV.map((p) => ({ id: p as string, label: nav[p as 'assistant' | 'websites' | 'prices'], to: pathFor(lang, p) })),
  ]
  links.splice(2, 0, { id: 'ads', label: h.footer.adsLink, to: `${homePath}#ads` })

  const langSwitch = (big: boolean) => (
    <nav aria-label={t.nav.language} className={`flex items-stretch ${big ? 'gap-1' : 'h-[36px] rounded-full border border-[rgba(244,239,230,0.16)] p-[3px]'}`}>
      {LANGS.map((l) => (
        <Link
          key={l}
          to={pathFor(l, page)}
          hrefLang={l}
          aria-current={l === lang ? 'true' : undefined}
          aria-label={LANG_LABELS[l]}
          onClick={() => rememberLang(l)}
          className={
            big
              ? `cut-sm cut-line flex h-6 min-w-[56px] items-center justify-center text-small font-bold uppercase ${
                  l === lang ? '[--cut-fill:#F4EFE6] [--cut-ink:#F4EFE6] text-ink' : '[--cut-ink:rgba(244,239,230,0.3)] text-paper'
                }`
              : `flex min-w-[34px] items-center justify-center rounded-full px-1 text-micro font-bold uppercase transition-colors ${
                  l === lang ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper'
                }`
          }
        >
          {l}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      <header className={`site-header ${page === 'home' && !open ? 'over-hero' : ''}`}>
        <div className="container-page grid h-7 grid-cols-[auto_1fr] items-center gap-2 lg:h-[64px] lg:grid-cols-[1fr_auto_1fr]">
          <Link to={homePath} className="flex items-center justify-self-start" aria-label="Twinbyte">
            <img src="/brand/logo-on-dark.svg" alt="Twinbyte" width={120} height={25} decoding="async" className="h-[24px] w-auto lg:h-[26px]" />
          </Link>

          <nav aria-label={t.nav.main} className="nav-pill hidden lg:flex">
            {links.map((l) => (
              <Link key={l.id} to={l.to} aria-current={page === l.id ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 justify-self-end">
            <div className="hidden sm:block">{langSwitch(false)}</div>
            {/* the long label only where the bar has room for it on one line in every language */}
            <Link to={`${homePath}#book`} className="btn-mint !min-h-[40px] whitespace-nowrap !px-2">
              <span className="xl:hidden">{nav.bookShort}</span>
              <span className="hidden xl:inline">{nav.book}</span>
            </Link>
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

        {/* reading progress: one 1px layer, transform only */}
        <div aria-hidden="true" ref={barRef} className="h-px origin-left scale-x-0 bg-teal-bright" />
      </header>

      {open && (
        <div id="mobile-menu" className="menu-sheet lg:hidden">
          <nav aria-label={t.nav.main}>
            <ul role="list">
              {links.map((l) => (
                <li key={l.id} className="border-b border-ink-edge">
                  <Link to={l.to} className="menu-big" aria-current={page === l.id ? 'page' : undefined} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-5 grid gap-1">
            <Link to={`${homePath}#book`} onClick={() => setOpen(false)} className="btn-mint w-full">
              {nav.book}
            </Link>
            <a className="btn-ghost w-full" href={waLink(booking[lang].hero.waText)} rel="noopener">
              <Bubble size={16} />
              {booking[lang].hero.whatsapp}
            </a>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-6">
            {langSwitch(true)}
            <a href={`mailto:${SITE.email}`} className="text-small text-paper-dim underline underline-offset-4">
              {SITE.email}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
