import { useState } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { waLink } from '../site'
import { Booker, RequestForm, smooth } from './Booker'
import { HomeHero } from './HomeHero'
import { Picture, type PictureName } from './Picture'
import { Arrow, ArrowOut, Bubble } from './marks'

/* "15-minute" must not break at its hyphen in a big heading. */
function keepTogether(text: string) {
  return text.split(/(\S*\d-\S*)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part))
}

/*
 * The home page: the hero, then the call. The card is the page's job — who
 * you will talk to, what the call covers, and the calendar. Below it, what
 * the business does, each with its own page, and a last word before the
 * footer.
 */
export function BookingPage() {
  const { lang } = useRoute()
  const c = booking[lang]
  const [mode, setMode] = useState<'book' | 'request'>('book')

  const show = (m: 'book' | 'request') => {
    setMode(m)
    requestAnimationFrame(() => document.getElementById('book')?.scrollIntoView({ block: 'start', behavior: smooth() }))
  }

  const alternatives = (
    <div className="w-fit max-w-full">
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-px w-4 bg-paper-edge-deep" />
        <span className="t-label">{c.hero.or}</span>
        <span className="h-px flex-1 bg-paper-edge-deep" />
      </div>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row">
        <button
          type="button"
          className="btn-ghost-dark"
          aria-pressed={mode === 'request'}
          onClick={() => show(mode === 'request' ? 'book' : 'request')}
        >
          {mode === 'request' ? c.request.back : c.hero.request}
        </button>
        <a className="btn-ghost-dark" href={waLink(c.hero.waText)} rel="noopener">
          <Bubble size={16} />
          {c.hero.whatsapp}
        </a>
      </div>
    </div>
  )

  return (
    <main id="main">
      <HomeHero />

      <section aria-labelledby="book-title" className="band-paper pb-9 pt-9 lg:pb-10 lg:pt-10">
        <div className="container-page">
          <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-6" data-rise>
            <div>
              <p className="eyebrow">{c.hero.eyebrow}</p>
              <h2 id="book-title" className="section-title mt-2">{keepTogether(c.page.book)}</h2>
            </div>
            <div>
              <p className="t-lead [text-wrap:pretty]">{c.hero.note}</p>
              <div className="mt-3 hidden lg:block">{alternatives}</div>
            </div>
          </div>

          {/* The card. On a phone: who, the calendar, then what the call
              covers. From a tablet up the calendar takes the right column. */}
          <div
            id="book"
            className="book-card mt-6 flex scroll-mt-2 flex-col md:grid md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.6fr)] md:grid-rows-[auto_1fr]"
          >
            <div className={`order-1 border-b border-paper-edge p-3 sm:p-4 md:col-start-1 md:row-start-1 ${
              mode === 'book' ? 'md:border-b-0 md:border-r md:pb-0' : 'md:col-span-2'
            }`}>
              <div className="flex items-center gap-1">
                <img src="/brand/mark.svg" alt="" width={44} height={44} className="h-[44px] w-[44px] shrink-0" />
                <p className="text-small leading-tight">
                  <span className="block font-semibold text-ink">{c.card.who}</span>
                  <span className="block text-ink-soft">{c.card.team}</span>
                </p>
              </div>
              {mode === 'book' && (
                <>
                  <h3 className="mt-3 font-display text-h3 font-bold text-ink">{c.card.title}</h3>
                  <ul role="list" className="mt-2 flex flex-wrap gap-0.5 text-micro font-bold uppercase text-ink">
                    <li className="cut-line cut-sm px-1 py-0.5 [--cut-ink:#0A0F1E]">{c.card.duration}</li>
                    <li className="cut-line cut-sm px-1 py-0.5 [--cut-ink:#0A0F1E]">{c.card.place}</li>
                    <li className="cut cut-sm px-1 py-0.5 text-paper [--cut-fill:#356F8E]">{c.card.free}</li>
                  </ul>
                </>
              )}
            </div>

            <div className={`order-2 p-3 sm:p-4 ${mode === 'book' ? 'md:col-start-2 md:row-span-2 md:row-start-1' : 'md:col-span-2 md:row-start-2'}`}>
              {mode === 'book' ? <Booker onRequest={() => show('request')} /> : <RequestForm onBack={() => show('book')} />}
            </div>

            {mode === 'book' && (
              <div className="order-3 border-t border-paper-edge px-3 pb-4 pt-2 sm:px-4 md:col-start-1 md:row-start-2 md:border-r md:border-t-0">
                <p className="t-label md:mt-3">{c.card.coversTitle}</p>
                <ol role="list" className="mt-1">
                  {c.card.covers.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-1 border-b border-paper-edge py-1 text-small text-ink last:border-0">
                      <span className="t-folio tabular-nums text-teal">{String(i + 1).padStart(2, '0')}</span>
                      <span className="[text-wrap:balance]">{item}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-small text-ink-soft">
                  {c.card.prep}{' '}
                  <Link to={pathFor(lang, 'prices')} className="inline-flex items-center gap-0.5 font-semibold text-teal underline underline-offset-2">
                    {c.card.prepLink}
                  </Link>
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 lg:hidden">{alternatives}</div>
        </div>
      </section>

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
    <section id="services" aria-labelledby="related-title" className="band-deep pb-9 pt-9 lg:pb-10 lg:pt-10">
      <div className="container-page">
        <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-6" data-rise>
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="related-title" className="section-title mt-2">{c.title}</h2>
          </div>
          <p className="t-lead [text-wrap:pretty]">{c.lead}</p>
        </div>

        <ul role="list" className="mt-6 grid gap-5 md:grid-cols-3 md:gap-3 lg:gap-4">
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
      <div className="container-page py-11 lg:py-12">
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
