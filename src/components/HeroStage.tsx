import { useState } from 'react'
import { Conversation } from './Conversation'
import { Bubble } from './marks'
import type { Translation } from '../i18n'

/*
 * THE STAGE.
 *
 * Everywhere else on this page depth is drawn with a hard offset plate — print
 * out of register, zero blur. The hero is the one exception, and it is a
 * deliberate one: the hero is a photograph of the product, the rest of the page
 * is the document. So here, and only here, the two devices sit on a lit ground
 * with soft contact shadows.
 *
 * What it must say in one look: we build the website AND the thing that answers
 * on it, and the answer ends in a booking. So the browser carries a real
 * small-business page, the phone in front of it carries the conversation that
 * page is having at 23:47, and when the conversation is done the appointment
 * appears on the calendar card at the window's edge.
 *
 * Still no 3D transform, no filter, no backdrop-filter, no observer. The phone
 * stands straight and overlaps, which is all the depth a flat composition
 * needs. The float is a single transform on a single element. The calendar
 * card is always in the layout and only changes opacity, so nothing shifts
 * when it arrives.
 */
export function HeroStage({ t }: { t: Translation }) {
  const s = t.heroSite
  const [booked, setBooked] = useState(false)

  return (
    <div className="stage">
      <div aria-hidden="true" className="stage-light" />

      <div className="stage-float">
        {/* ------------------------------------------------ the site we build */}
        <div className="browser" aria-label={s.name} role="img">
          <div className="browser-bar">
            <span aria-hidden="true" className="browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="browser-url">
              <svg aria-hidden="true" width="9" height="11" viewBox="0 0 9 11" fill="none">
                <rect x="0.5" y="4.5" width="8" height="6" rx="1.5" stroke="currentColor" />
                <path d="M2.5 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" />
              </svg>
              {s.url}
            </span>
          </div>

          <div className="browser-page">
            <div className="site-nav">
              <span className="site-mark">{s.name}</span>
              <span className="site-links">
                {s.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
              <span className="site-nav-btn">{s.book}</span>
            </div>

            <div className="site-body">
              {/* No stock photograph stands in for a business we have not met.
                  The picture is the terracotta ink with light on it — plainly a
                  drawing. On a phone, where it is not behind the device, it
                  carries the address. */}
              <div aria-hidden="true" className="site-art">
                <span className="site-art-chip">{s.address}</span>
              </div>
              <div className="site-copy">
                <p className="site-hours">{s.hours}</p>
                <p className="site-title">{s.name}</p>
                <p className="site-lead">{s.tagline}</p>
                <div className="site-btns">
                  <span className="site-btn-fill">{s.call}</span>
                  <span className="site-btn-line">{s.book}</span>
                </div>
              </div>
            </div>
          </div>

          {/* the assistant, where it actually lives */}
          <span aria-hidden="true" className="site-launcher">
            <Bubble size={18} />
          </span>
        </div>

        {/* --------------------------------------- the conversation it is having */}
        <div className="phone" role="img" aria-label={s.phoneLabel}>
          <span aria-hidden="true" className="phone-island" />
          <div className="phone-screen">
            <div aria-hidden="true" className="phone-status">
              <span>23:47</span>
              <svg width="34" height="10" viewBox="0 0 34 10" fill="currentColor">
                <rect x="0" y="6" width="2" height="4" rx="0.5" />
                <rect x="3" y="4" width="2" height="6" rx="0.5" />
                <rect x="6" y="2" width="2" height="8" rx="0.5" />
                <rect x="9" y="0" width="2" height="10" rx="0.5" />
                <rect x="16" y="0.5" width="15" height="9" rx="2" fill="none" stroke="currentColor" />
                <rect x="17.5" y="2" width="11" height="6" rx="1" />
                <rect x="32" y="3" width="1.5" height="4" rx="0.5" />
              </svg>
            </div>

            <div className="phone-head">
              <span aria-hidden="true" className="phone-avatar">
                <Bubble size={14} />
              </span>
              <span className="phone-who">
                <b>{s.name}</b>
                <small>{s.status}</small>
              </span>
            </div>

            <div className="phone-thread">
              <Conversation t={t} compact onDone={setBooked} />
            </div>

            <div aria-hidden="true" className="phone-input">
              <span>{s.input}</span>
              <i>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V6M6 12l6-6 6 6" />
                </svg>
              </i>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------- the appointment, made */}
        <div aria-hidden="true" className="stage-card" data-shown={booked}>
          <span className="stage-card-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
          </span>
          <span className="stage-card-text">
            <b>{t.demo.eventTitle}</b>
            <small>{t.demo.eventTime}</small>
            <em>{t.demo.eventBadge}</em>
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="stage-floor" />
    </div>
  )
}
