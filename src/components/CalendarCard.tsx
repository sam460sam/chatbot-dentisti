import { useState } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Booker, RequestForm, smooth } from './Booker'
import { keepTogether } from './BookingPage'
import { Bubble } from './marks'

/*
 * The booking card with the Google Calendar behind it: who, what the call
 * covers, and the free times. Switched off while SITE.booking.calendar is
 * false; it is then a separate chunk that is never downloaded, and with it
 * Booker and booker.css. Turning it back on needs the Google setup in
 * BOOKING.md.
 */
export function CalendarCard() {
  const { lang } = useRoute()
  const c = booking[lang]
  const [mode, setMode] = useState<'book' | 'request'>('book')

  /* Switching between booking and the request form scrolls to the card and
     moves focus into it: left on the toggle, focus would sit under the fixed
     header once the card scrolls up. */
  const show = (m: 'book' | 'request') => {
    setMode(m)
    requestAnimationFrame(() => {
      const card = document.getElementById('book')
      card?.scrollIntoView({ block: 'start', behavior: smooth() })
      const target = m === 'request' ? document.getElementById('request-title') : card?.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (target) return target.focus({ preventScroll: true })
      card?.setAttribute('tabindex', '-1')
      card?.focus({ preventScroll: true })
    })
  }

  const alternatives = (
    <div className="w-full max-w-full lg:w-fit">
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
    <section aria-labelledby="book-title" className="band-paper pb-7 pt-9 sm:pb-9 lg:pb-10 lg:pt-10">
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
          className="book-card mt-6 flex scroll-mt-2 flex-col md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.6fr)]"
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
  )
}
