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
 * on it. So the browser carries a real small-business page, and the phone in
 * front of it carries the conversation that page is having at 23:47.
 *
 * Still no 3D transform, no filter, no backdrop-filter, no observer. The
 * perspective is drawn, not computed: the phone is rotated in two dimensions
 * and overlaps, which is all the depth a flat composition needs. The float is a
 * single transform on a single element.
 */
export function HeroStage({ t }: { t: Translation }) {
  const s = t.heroSite

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
            <span className="browser-url">{s.url}</span>
          </div>

          <div className="browser-page">
            <div className="site-nav">
              <span className="site-mark">{s.name}</span>
              <span className="site-links">
                {s.nav.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>
            </div>

            <div className="site-body">
              <div aria-hidden="true" className="site-art">
                <span className="site-art-rule" />
                <span className="site-art-rule" />
                <span className="site-art-rule" />
              </div>
              <div className="site-copy">
                <p className="site-hours">{s.hours}</p>
                <p className="site-title">{s.name}</p>
                <p className="site-lead">{s.tagline}</p>
                <div className="site-btns">
                  <span className="site-btn-fill">{s.call}</span>
                  <span className="site-btn-line">{s.book}</span>
                </div>
                <p className="site-addr">{s.address}</p>
              </div>

            </div>

            <div className="site-cells">
              <div className="site-cell">
                <b>{s.nav[0]}</b>
                <span>{s.tagline}</span>
              </div>
              <div className="site-cell">
                <b>{s.nav[1]}</b>
                <span>{s.hours}</span>
              </div>
              <div className="site-cell">
                <b>{s.nav[2]}</b>
                <span>{s.address}</span>
              </div>
            </div>
          </div>

          {/* the assistant, where it actually lives */}
          <span aria-hidden="true" className="site-launcher">
            <Bubble size={18} />
          </span>
        </div>

        {/* --------------------------------------- the conversation it is having */}
        <div className="phone">
          <div className="phone-screen">
            <p className="phone-label">{s.phoneLabel}</p>
            <div className="phone-thread">
              <Conversation t={t} compact />
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="stage-floor" />
    </div>
  )
}
