import { lazy, Suspense } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { SITE, waLink } from '../site'
import { HomeHero } from './HomeHero'
import { ContactPlate } from './Contact'
import { Picture, type PictureName } from './Picture'
import { Arrow, ArrowOut, Bubble } from './marks'

/* The calendar card, only while SITE.booking.calendar is on: a chunk of its
   own, so Booker and booker.css are never fetched while it is off. */
const CalendarCardLazy = lazy(() => import('./CalendarCard').then((m) => ({ default: m.CalendarCard })))

/*
 * The home page: the hero, then the call. The card is the page's job — who
 * you will talk to, what the call covers, and the calendar. Below it, what
 * the business does, each with its own page, and a last word before the
 * footer.
 */
export function BookingPage() {
  return (
    <main id="main">
      <HomeHero />
      {SITE.booking.calendar ? (
        <Suspense fallback={null}>
          <CalendarCardLazy />
        </Suspense>
      ) : (
        <ContactPlate />
      )}

      <Services />
      <Closing />
    </main>
  )
}

/* -------------------------------------------------------------- services */
function Services() {
  const { lang } = useRoute()
  const c = booking[lang].related
  const ads = home[lang].ads
  const card = (k: 'assistant' | 'websites' | 'prices' | 'showcase') => c.cards.find((x) => x.key === k)!
  const big: { key: string; pic: PictureName; tag: string; title: string; body: string; cta: string; to: string; id?: string }[] = [
    { ...card('assistant'), pic: 'assistant', to: pathFor(lang, 'assistant') },
    { ...card('websites'), pic: 'websites', to: pathFor(lang, 'websites') },
    { key: 'ads', ...ads, pic: 'ads', to: '#book', id: 'ads' },
  ]
  const small = [card('prices'), card('showcase')]

  return (
    <section id="services" aria-labelledby="related-title" className="band-deep pb-9 pt-7 sm:pt-9 lg:pb-10 lg:pt-10">
      <div className="container-page">
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-6" data-rise>
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="related-title" className="section-title mt-2">{c.title}</h2>
          </div>
          <p className="t-lead [text-wrap:pretty]">{c.lead}</p>
        </div>

        <ul role="list" className="service-row mt-6 grid gap-5 md:grid-cols-3 md:gap-x-3 md:gap-y-0 lg:gap-x-4">
          {big.map((s) => {
            const inner = (
              <>
                <div className="service-media">
                  <Picture name={s.pic} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <p className="eyebrow mt-3">{s.tag}</p>
                <h3 className="mt-1 font-display text-h3 font-bold text-ink [text-wrap:balance]">{s.title}</h3>
                <p className="mt-1 flex-1 text-body text-ink-soft">{s.body}</p>
                <span className="mt-3 inline-flex items-center gap-0.5 text-small font-semibold text-ink group-hover:underline">
                  {s.cta}
                  <Arrow />
                </span>
              </>
            )
            return (
              <li key={s.key} id={s.id} className="scroll-mt-10" data-rise>
                {s.to.startsWith('#') ? (
                  <a className="service-card group" href={s.to}>{inner}</a>
                ) : (
                  <Link className="service-card group" to={s.to}>{inner}</Link>
                )}
              </li>
            )
          })}
        </ul>

        <ul role="list" className="mt-5 grid gap-2 sm:grid-cols-2" data-rise>
          {small.map((s) => {
            const inner = (
              <>
                <span>
                  <span className="t-label block">{s.tag}</span>
                  <span className="mt-1 block font-display text-h4 font-bold text-ink">{s.title}</span>
                  <span className="mt-0.5 block text-small text-ink-soft">{s.body}</span>
                </span>
                <span className="cut cut-sm flex h-6 w-6 shrink-0 items-center justify-center text-paper [--cut-fill:#0A0F1E] group-hover:[--cut-fill:#356F8E]">
                  {s.key === 'showcase' ? <ArrowOut /> : <Arrow />}
                </span>
              </>
            )
            const cls = 'cut-line cut-lg group flex h-full items-center justify-between gap-3 p-3 [--cut-fill:#F4EFE6] [--cut-ink:#CBC1AE] hover:[--cut-fill:#FFFFFF] sm:p-4'
            return (
              <li key={s.key}>
                {s.key === 'showcase' ? (
                  <a className={cls} href={lang === 'en' ? '/showcase/' : `/showcase/${lang}/`}>{inner}</a>
                ) : (
                  <Link className={cls} to={pathFor(lang, 'prices')}>{inner}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- closing */
function Closing() {
  const { lang } = useRoute()
  const c = booking[lang]
  return (
    <section aria-labelledby="closing-title" className="picture-band parallax on-ink">
      <Picture name="call" sizes="100vw" />
      <div className="container-page py-9 sm:py-11 lg:py-12">
        <div data-rise>
          <h2 id="closing-title" className="section-title max-w-[20ch]">{c.closing.title}</h2>
          <p className="mt-3 max-w-lead text-lead text-paper">{c.closing.lead}</p>
          <div className="mt-5 flex flex-col gap-1 sm:flex-row">
            <a className="btn-mint" href="#book">
              {c.closing.book}
              <Arrow />
            </a>
            <a className="btn-ghost" href={waLink(c.hero.waText)} rel="noopener">
              <Bubble size={16} />
              {c.closing.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
