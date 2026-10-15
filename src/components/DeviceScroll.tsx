import type { CSSProperties } from 'react'
import { useRoute } from '../router'
import { SITE } from '../site'
import type { Translation } from '../i18n'
import { Arrow } from './marks'
import { DEMO_SCREENS } from './demoScreens'
import { PHONE, PhoneFrame, place, type Box } from './PhoneFrame'

/* Where each screen sits inside its drawing, in the drawing's own units. The
   screenshots (tools/demo-screens.mjs) are exactly as wide as the screen, so
   only their height varies: how far a picture travels is what is left of it
   below the screen, as a share of its own height. */
const LAPTOP: Box = { w: 1000, h: 606, x: 91, y: 24, sw: 818, sh: 511 }

function travel(d: Box, shot: { w: number; h: number }): CSSProperties {
  const end = Math.max(0, 1 - (d.sh / d.sw) * (shot.w / shot.h))
  return { '--end': `${(-end * 100).toFixed(2)}%` } as CSSProperties
}

/*
 * The demo practice, on a laptop and a phone drawn here, its pages scrolling
 * past on both screens while the visitor scrolls this one. No script: the
 * pictures are moved by a CSS scroll-driven animation (.dvs-* in site.css).
 * Without one, or with reduced motion, both screens show the top of the demo
 * page, which is a finished picture on its own.
 */
export function DeviceScroll({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const d = t.devices
  const shots = DEMO_SCREENS[lang]
  const src = (kind: 'desk' | 'phone') => `/media/screens/demo-${kind}-${lang}`

  return (
    <section className="band-ink on-ink dvs" aria-labelledby="dvs-title">
      <div className="container-page">
        <div className="dvs-grid">
          <header className="dvs-head">
            <div>
              <p className="eyebrow">{d.eyebrow}</p>
              <h2 id="dvs-title" className="section-title mt-2">{d.title}</h2>
            </div>
            <p className="t-lead mt-2 lg:mt-0">{d.lead}</p>
          </header>

          <div className="dvs-stage">
            <div className="dvs-laptop">
              <svg viewBox={`0 0 ${LAPTOP.w} ${LAPTOP.h}`} aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="dvs-rim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7b828e" />
                    <stop offset="0.5" stopColor="#4a505a" />
                    <stop offset="1" stopColor="#30343c" />
                  </linearGradient>
                  <linearGradient id="dvs-base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#c9ced6" />
                    <stop offset="0.3" stopColor="#a1a8b2" />
                    <stop offset="0.85" stopColor="#6b717b" />
                    <stop offset="1" stopColor="#4c515a" />
                  </linearGradient>
                  <radialGradient id="dvs-led">
                    <stop offset="0" stopColor="#96D3C0" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#96D3C0" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* lid: a thin metal rim round black glass, a camera dot */}
                <rect x="70" y="0" width="860" height="566" rx="20" fill="url(#dvs-rim)" />
                <rect x="73" y="3" width="854" height="560" rx="17" fill="#080a0f" />
                <circle cx="500" cy="13.5" r="3.4" fill="#1c212a" />
                <circle cx="500" cy="13.5" r="1.4" fill="#33405a" />
                {/* hinge, then the front edge of the base */}
                <rect x="120" y="561" width="760" height="13" rx="3" fill="#15181e" />
                <path
                  d="M22 572H978Q994 572 992 580L986 594Q983 600 974 600H26Q17 600 14 594L8 580Q6 572 22 572Z"
                  fill="url(#dvs-base)"
                />
                <path d="M26 573.4H974" stroke="#eef1f5" strokeOpacity="0.7" strokeWidth="1.2" />
                <rect x="96" y="599" width="64" height="6" rx="3" fill="#1a1d23" />
                <rect x="840" y="599" width="64" height="6" rx="3" fill="#1a1d23" />
                {/* the status light, in the brand's mint */}
                <circle cx="60" cy="586" r="9" fill="url(#dvs-led)" />
                <circle cx="60" cy="586" r="2.6" fill="#96D3C0" />
              </svg>
              <div className="dvs-screen" style={place(LAPTOP)}>
                <img
                  className="dvs-shot dvs-shot-desk"
                  style={travel(LAPTOP, shots.desk)}
                  src={`${src('desk')}.webp`}
                  srcSet={`${src('desk')}-1x.webp ${shots.desk.w1}w, ${src('desk')}.webp ${shots.desk.w}w`}
                  sizes="(min-width: 1024px) 634px, (min-width: 640px) 461px, calc(69vw - 22px)"
                  width={shots.desk.w}
                  height={shots.desk.h}
                  alt={d.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* the phone drawing is shared (PhoneFrame); its camera dot and
                sheen stay on .dvs-screen-phone in site.css */}
            <PhoneFrame className="dvs-phone" screenClassName="dvs-screen dvs-screen-phone" glass={false}>
              <img
                className="dvs-shot dvs-shot-phone"
                style={travel(PHONE, shots.phone)}
                src={`${src('phone')}.webp`}
                srcSet={`${src('phone')}-1x.webp ${shots.phone.w1}w, ${src('phone')}.webp ${shots.phone.w}w`}
                sizes="(min-width: 1024px) 184px, (min-width: 640px) 134px, calc(29.5vw - 10px)"
                width={shots.phone.w}
                height={shots.phone.h}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </PhoneFrame>

            <p className="dvs-url cut-line cut-sm" aria-hidden="true">
              <span className="dvs-url-dot" />
              {`twinbyteservices.com${SITE.demo[lang]}`}
            </p>
          </div>

          <div className="dvs-body">
            <ul role="list" className="grid gap-3 lg:grid-cols-3 lg:gap-5">
              {d.points.map((p) => (
                <li key={p.title} className="flex items-start gap-2">
                  <span aria-hidden="true" className="dvs-tick" />
                  <span>
                    <span className="block font-semibold text-paper">{p.title}</span>
                    <span className="mt-0.5 block text-small text-paper-dim">{p.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-4 border-t border-ink-edge pt-4 lg:flex-row lg:items-center lg:justify-between">
              <ul role="list" className="flex flex-wrap gap-1">
                {d.chips.map((c) => (
                  <li key={c} className="dvs-chip cut-line cut-sm">{c}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <a className="btn-mint shrink-0" href={SITE.demo[lang]}>
                  {d.cta}
                  <Arrow />
                </a>
                <p className="max-w-[40ch] text-small text-paper-dim">{d.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
