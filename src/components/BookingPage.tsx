import { useState } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Booker, RequestForm, smooth } from './Booker'
import { Arrow, ArrowOut, Bubble, Mark, Window } from './marks'
import type { Translation } from '../i18n'

/*
 * The home page has one job: book the 15-minute call.
 *
 * Left, the sentence and the two other ways in (a request, a WhatsApp).
 * Right, the card: who you will talk to, what the call covers, and the
 * calendar. Everything else the business does sits further down, as links to
 * its own page, for the visitor who wants to read before booking.
 */
export function BookingPage({ t: _t }: { t: Translation }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const [mode, setMode] = useState<'book' | 'request'>('book')

  const show = (m: 'book' | 'request') => {
    setMode(m)
    requestAnimationFrame(() => document.getElementById('book')?.scrollIntoView({ block: 'start', behavior: smooth() }))
  }

  /* On a phone the card comes straight after the sentence: the first screen
     shows the calendar, and the other ways in follow it. On a wide screen
     they sit under the sentence, next to the card. */
  const alternatives = (
    <div className="mt-5 w-fit max-w-full">
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-px w-4 bg-paper-edge-deep" />
        <span className="t-label">{c.hero.or}</span>
        <span className="h-px flex-1 bg-paper-edge-deep" />
      </div>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row lg:flex-col 2xl:flex-row">
        <button
          type="button"
          className={mode === 'request' ? 'btn border border-ink bg-ink text-paper' : 'btn-line'}
          aria-pressed={mode === 'request'}
          onClick={() => show(mode === 'request' ? 'book' : 'request')}
        >
          {mode === 'request' ? c.request.back : c.hero.request}
        </button>
        <a className="btn-line" href={waLink(c.hero.waText)} rel="noopener">
          <Bubble size={16} />
          {c.hero.whatsapp}
        </a>
      </div>
      <p className="mt-3 max-w-lead text-small text-ink-soft [text-wrap:pretty]">{c.hero.note}</p>
    </div>
  )

  return (
    <main id="main">
      <section aria-labelledby="book-title" className="band-paper pb-8 pt-8 sm:pt-10">
        <div className="container-page grid items-start gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.55fr)] lg:gap-6">
          {/* ------------------------------------------------ the sentence */}
          <div className="lg:sticky lg:top-10">
            <p className="t-label flex items-center gap-1 text-teal">
              <Mark tone="teal" />
              {c.hero.eyebrow}
            </p>
            <h1 id="book-title" className="t-display mt-2 [hyphens:manual] [overflow-wrap:normal] lg:text-h1 xl:text-display">{c.hero.title}</h1>
            <p className="t-lead mt-3 max-w-lead [text-wrap:pretty]">{c.hero.lead}</p>

            <div className="hidden lg:block">{alternatives}</div>
          </div>

          {/* --------------------------------------------------- the card */}
          {/* On a phone the calendar comes straight after the title: what
              the call covers moves below it, so booking is one scroll away.
              Two columns only where the card is wide enough for them (a
              tablet, or a wide desktop); a small laptop gets the phone order. */}
          <div
            id="book"
            className="flex scroll-mt-2 flex-col border border-ink bg-paper-deep shadow-[6px_6px_0_#17160F] md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:grid-rows-[auto_1fr] lg:flex xl:grid"
          >
            <div className={`order-1 border-b border-paper-edge-deep p-3 md:col-start-1 md:row-start-1 ${
              mode === 'book'
                ? 'md:border-b-0 md:border-r md:pb-0 lg:border-b lg:border-r-0 lg:pb-3 xl:border-b-0 xl:border-r xl:pb-0'
                : 'md:col-span-2 xl:col-span-2'
            }`}>
              <div className="flex items-center gap-1">
                <span aria-hidden="true" className="mark-in flex h-6 w-6 shrink-0 items-center justify-center bg-teal text-paper">
                  <Bubble size={24} />
                </span>
                <p className="text-small leading-tight">
                  <span className="block font-semibold text-ink">{c.card.who}</span>
                  <span className="block text-ink-soft">{c.card.team}</span>
                </p>
              </div>
              {mode === 'book' && (
                <>
                  <h2 className="mt-3 font-display text-h4 font-bold text-ink sm:text-h3 md:text-h4 xl:text-h3">{c.card.title}</h2>
                  <ul role="list" className="mt-2 flex flex-wrap gap-0.5 text-micro font-bold uppercase text-ink">
                    <li className="mark-in border border-ink px-1 py-0.5">{c.card.duration}</li>
                    <li className="mark-in border border-ink px-1 py-0.5">{c.card.place}</li>
                    <li className="mark-in border border-teal bg-teal px-1 py-0.5 text-paper">{c.card.free}</li>
                  </ul>
                </>
              )}
            </div>

            <div className={`order-2 p-3 ${mode === 'book' ? 'md:col-start-2 md:row-span-2 md:row-start-1' : 'md:col-span-2 md:row-start-2'}`}>
              {mode === 'book' ? <Booker onRequest={() => show('request')} /> : <RequestForm onBack={() => show('book')} />}
            </div>

            {mode === 'book' && (
              <div className="order-3 border-t border-paper-edge-deep px-3 pb-3 pt-2 md:col-start-1 md:row-start-2 md:border-r md:border-t-0 lg:border-r-0 lg:border-t xl:border-r xl:border-t-0">
                <p className="t-label md:mt-2 lg:mt-0 xl:mt-2">{c.card.coversTitle}</p>
                <ol role="list" className="mt-1">
                  {c.card.covers.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-1 border-b border-paper-edge-deep py-1 text-small text-ink last:border-0">
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

          <div className="lg:hidden">{alternatives}</div>
        </div>
      </section>

      <Related />
      <Closing />
    </main>
  )
}

/* --------------------------------------------------------------- related */
function Related() {
  const { lang } = useRoute()
  const c = booking[lang].related
  const ink = { assistant: 'border-teal text-teal', websites: 'border-verm text-verm', prices: 'border-ink text-ink', showcase: 'border-ink text-ink' }
  return (
    <section aria-labelledby="related-title" className="band-deep">
      <div className="container-page">
        <p className="t-label">{c.eyebrow}</p>
        <h2 id="related-title" className="t-h2 mt-1">{c.title}</h2>
        <p className="t-lead mt-2">{c.lead}</p>
        <ul role="list" className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {c.cards.map((card) => {
            const inner = (
              <>
                <p className={`t-label flex items-center gap-1 ${ink[card.key].split(' ')[1]}`}>
                  {card.key === 'assistant' ? <Bubble size={16} /> : card.key === 'websites' ? <Window size={16} /> : <Mark tone={card.key === 'prices' ? 'teal' : 'verm'} />}
                  {card.tag}
                </p>
                <h3 className="mt-2 font-display text-h4 font-bold text-ink lg:min-h-[84px]">{card.title}</h3>
                <p className="mt-1 flex-1 text-small text-ink-soft">{card.body}</p>
                <span className="mt-3 inline-flex items-center gap-0.5 text-small font-semibold text-ink group-hover:underline">
                  {card.cta}
                  {card.key === 'showcase' ? <ArrowOut /> : <Arrow />}
                </span>
              </>
            )
            const cls = `group flex h-full flex-col border-t-2 bg-paper p-2 transition-colors hover:bg-white ${ink[card.key].split(' ')[0]}`
            return (
              <li key={card.key}>
                {card.key === 'showcase' ? (
                  <a className={cls} href={lang === 'en' ? '/showcase/' : `/showcase/${lang}/`}>{inner}</a>
                ) : (
                  <Link className={cls} to={pathFor(lang, card.key)}>{inner}</Link>
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
    <section aria-labelledby="closing-title" className="on-flood bg-teal">
      <div className="container-page py-9">
        <h2 id="closing-title" className="max-w-[24ch] font-display text-h3 font-extrabold text-paper sm:text-h2 lg:text-h1">
          {c.closing.title}
        </h2>
        <p className="mt-3 max-w-lead text-lead text-paper">{c.closing.lead}</p>
        <div className="mt-5 flex flex-col gap-1 sm:flex-row">
          <a className="btn border border-paper bg-paper text-teal hover:bg-paper-deep" href="#book">
            {c.closing.book}
            <Arrow />
          </a>
          <a className="btn-line-flood" href={waLink(c.hero.waText)} rel="noopener">
            <Bubble size={16} />
            {c.closing.whatsapp}
          </a>
        </div>
      </div>
    </section>
  )
}
