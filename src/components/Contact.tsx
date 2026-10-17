import { useEffect, useRef, useState } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { translations, type Lang } from '../i18n'
import {
  contact, mailBody, needOf, PAGE_PREFILL, TOPICS, type ContactPage, type Topic,
} from '../i18n/contact'
import { SITE, mailLink, waLink } from '../site'
import { ArrowOut, Bubble, Mail } from './marks'
import { PhoneChat } from './PhoneChat'
import { prefersReducedMotion } from './motion'

/* "15-minute" must not break at its hyphen in a big heading. */
export function keepTogether(text: string) {
  return text.split(/(\S*\d-\S*)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part))
}

/* The panel title marks its one accent word with *…*: set in the serif. */
function accented(text: string) {
  return text.split(/\*(.+?)\*/).map((part, i) => (i % 2 ? <em key={i} className="accent">{part}</em> : <span key={i}>{keepTogether(part)}</span>))
}

/** "Websites from €590 · Assistant from €79 a month", read from the price list. */
export function priceLine(lang: Lang): string {
  const plans = translations[lang].pricing.plans
  return contact[lang].priceLine.text.replace('{site}', plans[0].setup).replace('{assistant}', plans[2].month)
}

/* An email address may break after the "@" and nowhere else. */
function address(email: string) {
  const [user, host] = email.split('@')
  return <>{user}@<wbr />{host}</>
}

/* ----------------------------------------------------------------- buttons
   The two ways to reach us, as large tiles. WhatsApp opens the chat with the
   message already written; email opens the mail app with a subject and a
   short form to fill in. The copy button exists only once the script runs:
   it needs the clipboard. */
function ContactButtons({ lang, prefill, subject, need, describedBy, tiles = false }: {
  lang: Lang; prefill: string; subject: string; need: string; describedBy: string; tiles?: boolean
}) {
  const c = contact[lang]
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const addr = useRef<HTMLSpanElement>(null)
  const timer = useRef(0)
  useEffect(() => {
    setReady(true)
    return () => clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* no clipboard (an old browser, a denied permission): select the
         address instead, so a long press or Ctrl+C copies it */
      const el = addr.current
      const sel = window.getSelection()
      if (!el || !sel) return
      const range = document.createRange()
      range.selectNodeContents(el)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }

  return (
    <div className={`cbtns ${tiles ? 'cbtns-tiles' : ''}`}>
      <a className="cbtn cbtn-wa" href={waLink(prefill)} rel="noopener" aria-describedby={describedBy}>
        <span className="cbtn-icon"><Bubble size={24} /></span>
        <span className="cbtn-text">
          <span className="cbtn-label">{c.whatsapp}</span>
          <span className="cbtn-sub">{SITE.whatsappDisplay}</span>
        </span>
        <ArrowOut size={20} className="cbtn-arrow" />
      </a>
      <a className="cbtn cbtn-mail" href={mailLink(subject, mailBody(lang, need))} aria-describedby={describedBy}>
        <span className="cbtn-ring" aria-hidden="true" />
        <span className="cbtn-icon"><Mail size={24} /></span>
        <span className="cbtn-text">
          <span className="cbtn-label">{c.email}</span>
          <span className="cbtn-sub" ref={addr}>{address(SITE.email)}</span>
        </span>
        <ArrowOut size={20} className="cbtn-arrow" />
      </a>
      {ready && (
        <p className="cbtn-copy">
          <button type="button" onClick={copy}>{copied ? c.copied : c.copy}</button>
          <span className="sr-only" aria-live="polite">{copied ? `${c.copied}: ${SITE.email}` : ''}</span>
        </p>
      )}
    </div>
  )
}

/* The message the buttons send, quoted, and the QR code for a visitor on a
   computer. The QR group is shown only with a mouse on a wide screen; on a
   phone it is display:none, so its image is never fetched. */
function Ready({ lang, prefill, ids, qr }: { lang: Lang; prefill: string; ids: [string, string]; qr: string }) {
  const c = contact[lang]
  return (
    <div className="cp-ready">
      <div>
        <p id={ids[0]} className="cp-ready-note">{c.ready}</p>
        <p id={ids[1]} className="cp-quote" aria-live="polite">“{prefill}”</p>
      </div>
      <div className="cp-qr">
        <span className="cp-qr-tile">
          <img src={qr} alt={c.qr.alt} width={144} height={144} loading="lazy" decoding="async" />
        </span>
        <p className="cp-qr-text">
          <span className="cp-qr-title">{c.qr.title}</span>
          <span className="cp-qr-body">{c.qr.body}</span>
        </p>
      </div>
    </div>
  )
}

/* Duration and "free" are the calendar card's words; how the call happens
   is the contact copy's own (phone, WhatsApp or Meet, not only Meet). */
function Chips({ lang, className = '' }: { lang: Lang; className?: string }) {
  const card = booking[lang].card
  return (
    <ul role="list" className={`cp-chips ${className}`}>
      <li className="cut-line cut-sm">{card.duration}</li>
      <li className="cut-line cut-sm">{contact[lang].place}</li>
      <li className="cut cut-sm cp-chip-free">{card.free}</li>
    </ul>
  )
}

/* The night street behind the phone (A1), after the load event, and on a
   wide screen its slow loop (A2). The loop follows the hero's rules: only from 1024px, only after the
   page has loaded, never with Save-Data or reduced motion, paused while the
   panel is off screen. If it never comes, the still is the backdrop. */
const NIGHT = {
  src: '/media/contact-night-880.webp',
  srcSet: '/media/contact-night-640.webp 640w, /media/contact-night-880.webp 880w',
}
const NIGHT_LOOP = { webm: '/media/contact-loop.webm', mp4: '/media/contact-loop.mp4' }

function Backdrop({ panel }: { panel: React.RefObject<HTMLElement> }) {
  const [still, setStill] = useState(false)
  const [loop, setLoop] = useState(false)
  const [playing, setPlaying] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  /* The still waits for the load event too. On a phone the panel starts
     just under the hero, inside the lazy-loading distance, so a plain lazy
     image would share the first second's bandwidth with the hero picture
     (the LCP). It is only a shaded backdrop: until it comes, the plate's
     own navy is behind the phone, in a box that never changes size. */
  useEffect(() => {
    const show = () => setStill(true)
    if (document.readyState === 'complete') show()
    else window.addEventListener('load', show, { once: true })
    return () => window.removeEventListener('load', show)
  }, [])

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (prefersReducedMotion() || saveData || !matchMedia('(min-width: 1024px)').matches) return
    let timer = 0
    const start = () => {
      timer = window.setTimeout(() => setLoop(true), 600)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const v = video.current
    const p = panel.current
    if (!loop || !v || !p || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => {})
      else v.pause()
    })
    io.observe(p)
    return () => io.disconnect()
  }, [loop, panel])

  return (
    <div className="cp-backdrop" aria-hidden="true">
      <div className="cp-backdrop-media">
        {still && (
          <img
            src={NIGHT.src}
            srcSet={NIGHT.srcSet}
            sizes="(min-width: 1024px) 440px, 100vw"
            alt=""
            width={880}
            height={1556}
            loading="lazy"
            decoding="async"
          />
        )}
        {loop && (
          <video
            ref={video}
            className={playing ? 'is-on' : ''}
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster={NIGHT.src}
            onPlaying={() => setPlaying(true)}
            onError={() => setLoop(false)}
          >
            <source src={NIGHT_LOOP.webm} type="video/webm" />
            <source src={NIGHT_LOOP.mp4} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="cp-backdrop-shade" />
    </div>
  )
}

/* ------------------------------------------------------------------ panel
   "The Conversation": the home page's job. Two very large buttons, a row of
   topics that rewrites the message they send, and a phone that shows how
   the conversation goes. From 1024px it overlaps the bottom of the hero. */
export function ContactPlate() {
  const { lang } = useRoute()
  const c = contact[lang]
  const b = booking[lang]
  const [topic, setTopic] = useState<Topic | null>(null)
  const plate = useRef<HTMLDivElement>(null)

  const prefill = topic ? c.prefill[topic] : c.prefill.default
  const need = topic ? needOf(c.topics[topic]) : ''

  return (
    <section id="contact" aria-labelledby="contact-title" className="band-paper contact-band contact-home">
      <span id="book" aria-hidden="true" className="contact-alias" />
      <div className="container-page">
        <div ref={plate} className="book-card book-card-dark contact-plate on-ink">
          <div className="cp-top">
            <div className="cp-main">
              <p className="eyebrow">{b.hero.eyebrow}</p>
              <h2 id="contact-title" className="section-title cp-title">{accented(c.title)}</h2>
              <p className="cp-lead">{c.lead}</p>

              <div className="cp-topics" role="group" aria-labelledby="contact-topic-label">
                <p id="contact-topic-label" className="cp-topics-label">{c.topicLabel}</p>
                <div className="cp-topics-row">
                  {TOPICS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className="cut-line cut-sm cp-topic"
                      aria-pressed={topic === k}
                      onClick={() => setTopic(topic === k ? null : k)}
                    >
                      {c.topics[k]}
                    </button>
                  ))}
                </div>
              </div>

              <ContactButtons
                lang={lang}
                prefill={prefill}
                subject={c.mail.subject}
                need={need}
                describedBy="contact-ready contact-quote"
                tiles
              />
              <Ready lang={lang} prefill={prefill} ids={['contact-ready', 'contact-quote']} qr={`/brand/qr-wa-${lang}.svg`} />
            </div>

            <div className="cp-side">
              <Backdrop panel={plate} />
              <PhoneChat
                lines={[
                  { from: 'you', text: prefill },
                  { from: 'us', text: c.phone.replies[0] },
                  { from: 'you', text: c.phone.replies[1] },
                  { from: 'us', text: c.phone.replies[2] },
                ]}
                card={c.phone.card}
                caption={c.phone.caption}
                you={c.phone.you}
                us={c.phone.us}
                placeholder={c.phone.placeholder}
                className="cp-phone"
              />
            </div>
          </div>

          <div className="cp-facts">
            <div>
              <p className="cp-facts-label">{c.callLabel}</p>
              <Chips lang={lang} className="mt-2" />
            </div>
            <div>
              <p className="cp-facts-label">{c.stepsTitle}</p>
              <ol role="list" className="cp-steps">
                {c.steps.map((s, i) => (
                  <li key={s}>
                    <span className="cp-step-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="cp-note">{b.hero.note}</p>
              <p className="cp-prep">
                {b.card.prep}{' '}
                <Link to={pathFor(lang, 'prices')} className="cp-prep-link">{b.card.prepLink}</Link>
              </p>
            </div>
          </div>
          <span className="cp-ring" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- band
   The end of every inner page: the same plate, without the phone and the
   topics. The message, the mail subject and the QR code are this page's. */
export function ContactBand({ page }: { page: ContactPage }) {
  const { lang } = useRoute()
  const c = contact[lang]
  const b = booking[lang]
  const prefill = c.prefill[PAGE_PREFILL[page]]
  const need = page === 'assistant' ? needOf(c.topics.assistant) : page === 'websites' ? needOf(c.topics.website) : ''

  return (
    <section id="contact" aria-labelledby="contact-title" className="band-paper contact-band">
      <div className="container-page">
        <div className="book-card book-card-dark contact-plate cb-plate on-ink">
          <div className="cb-head">
            <p className="eyebrow">{b.hero.eyebrow}</p>
            <h2 id="contact-title" className="cb-title">{c.band.title}</h2>
            <p className="cb-lead">{c.band.lead}</p>
          </div>
          <div className="cb-actions">
            <ContactButtons
              lang={lang}
              prefill={prefill}
              subject={c.mail.pages[page]}
              need={need}
              describedBy="contact-ready contact-quote"
            />
            <Ready lang={lang} prefill={prefill} ids={['contact-ready', 'contact-quote']} qr={`/brand/qr-wa-${lang}-${page}.svg`} />
          </div>
          <Chips lang={lang} className="cb-chips" />
          <span className="cp-ring" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
