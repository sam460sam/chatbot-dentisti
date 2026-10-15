import { useEffect, useRef, useState } from 'react'
import { Menu, Close, Bubble, Mail } from './marks'
import { Link, pathFor, rememberLang, useRoute } from '../router'
import { LANGS, LANG_LABELS, type Translation } from '../i18n'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { SITE, mailLink, waLink } from '../site'
import { prefersReducedMotion } from './motion'
import type { Page } from '../router'

const PAGES_IN_NAV: Page[] = ['assistant', 'websites', 'prices']
/* The pages that end in the contact panel (#contact): there the button
   stays on the page. Privacy and the 404 page send it to the home page's. */
const PAGES_WITH_CONTACT: Page[] = ['home', 'assistant', 'websites', 'prices']

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
   * Reading progress, where the browser cannot drive it from the scroll
   * itself (site.css .read-bar). The read of scrollHeight forces layout, so
   * it is cached and only re-measured on resize; the write happens inside a
   * rAF.
   */
  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()') && !prefersReducedMotion()) return
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
  /* the phone menu has one more: the live demo, a page of its own outside the app */
  const menuLinks = [...links, { id: 'demo', label: h.menuDemo, to: SITE.demo[lang] }]

  const contactLabel = (
    <>
      <span className="xl:hidden">{nav.bookShort}</span>
      <span className="hidden xl:inline">{nav.book}</span>
    </>
  )
  const contactClass = 'btn-mint !min-h-[44px] whitespace-nowrap !px-2'

  /* The small switch is a whole touch target (44px) on a tablet; next to
     the desktop nav it keeps its compact size, or the two pills would touch
     in the longer languages. */
  const langSwitch = (big: boolean) => (
    <nav aria-label={t.nav.language} className={`flex items-stretch ${big ? 'gap-1' : 'h-[44px] rounded-full border border-[rgba(244,239,230,0.16)] p-[3px] lg:h-[36px]'}`}>
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
              : `flex min-w-[44px] items-center justify-center rounded-full px-1 text-micro font-bold uppercase transition-colors lg:min-w-[34px] ${
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
          <Link to={homePath} className="flex min-h-[44px] items-center justify-self-start" aria-label="Twinbyte">
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
            {/* the long label only where the bar has room for it on one line in
                every language; a plain link where the panel is on this page */}
            {PAGES_WITH_CONTACT.includes(page) ? (
              <a href="#contact" className={contactClass} onClick={() => setOpen(false)}>
                {contactLabel}
              </a>
            ) : (
              <Link to={`${homePath}#contact`} className={contactClass} onClick={() => setOpen(false)}>
                {contactLabel}
              </Link>
            )}
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
        <div aria-hidden="true" ref={barRef} className="read-bar h-px origin-left scale-x-0 bg-teal-bright" />
      </header>

      {open && (
        <div id="mobile-menu" className="menu-sheet lg:hidden">
          <nav aria-label={t.nav.main}>
            <ul role="list">
              {menuLinks.map((l, i) => {
                const current = page === l.id
                const inner = (
                  <>
                    <span className="t-folio menu-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">{l.label}</span>
                    {current && <span aria-hidden="true" className="menu-tick" />}
                  </>
                )
                return (
                  <li key={l.id} className="border-b border-ink-edge">
                    {l.id === 'demo' ? (
                      <a href={l.to} className="menu-big">
                        {inner}
                      </a>
                    ) : (
                      <Link to={l.to} className="menu-big" aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>
                        {inner}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="mt-5 grid gap-1">
            <a className="btn-mint menu-tile w-full" href={waLink(booking[lang].hero.waText)} rel="noopener">
              <Bubble size={20} />
              {booking[lang].hero.whatsapp}
            </a>
            <a className="btn-ghost menu-tile w-full" href={mailLink(t.contact.emailSubject)}>
              <Mail size={20} />
              {t.contact.email}
            </a>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-6">
            {langSwitch(true)}
            <a href={mailLink(t.contact.emailSubject)} className="text-small text-paper-dim underline underline-offset-4">
              {SITE.email}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
