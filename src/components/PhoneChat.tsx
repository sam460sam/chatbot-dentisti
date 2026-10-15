import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { prefersReducedMotion } from './motion'

export type ChatLine = { from: 'you' | 'us'; text: string }

/*
 * An example conversation on the drawn phone: the visitor's message, the
 * reply, a confirmed call. Real text in a real list, so a screen reader
 * reads it as a conversation; everything that is only picture (the status
 * bar, the typing dots, the field at the bottom) is hidden from it.
 *
 * Motion never decides whether the chat is visible (see motion.tsx). The
 * final frame is the page: without a script, with reduced motion, on a deep
 * link to #contact, or when the phone is already on screen, the whole
 * conversation is simply there. Only when the phone starts well below the
 * fold is it "armed" (the bubbles wait at opacity 0, off-screen), and it
 * plays once when it arrives. The observer has a scroll check behind it:
 * an observer that fires late must never leave a blank phone.
 */

/* the timeline, in ms: a reply is preceded by typing dots; the card closes it */
const TYPING_GAP = [700, 600]
const TYPING_FOR = [1060, 960]
const AFTER_REPLY = 940
const CARD_AFTER = 640

type Timed = ChatLine & { at: number; typing?: { at: number; for: number } }

function timeline(lines: ChatLine[]): { items: Timed[]; card: number } {
  let t = 0
  let k = 0
  const items = lines.map((line, i): Timed => {
    if (i === 0) return { ...line, at: 0 }
    if (line.from === 'us') {
      const j = Math.min(k++, TYPING_GAP.length - 1)
      const typing = { at: t + TYPING_GAP[j], for: TYPING_FOR[j] }
      t = typing.at + typing.for
      return { ...line, at: t, typing }
    }
    t += AFTER_REPLY
    return { ...line, at: t }
  })
  return { items, card: t + CARD_AFTER }
}

const ms = (n: number) => ({ '--d': `${n}ms` }) as CSSProperties

/* "15-minute" must not break at its hyphen in a narrow bubble */
const unbroken = (text: string) =>
  text.split(/(\S*\d-\S*)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part))

export function PhoneChat({
  lines, card, caption, you, us, placeholder, className = '',
}: {
  lines: ChatLine[]
  card?: { title: string; meta: string }
  caption: string
  you: string
  us: string
  placeholder: string
  className?: string
}) {
  const fig = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'still' | 'armed' | 'playing'>('still')
  const { items, card: cardAt } = timeline(lines)

  useEffect(() => {
    const el = fig.current
    if (!el || prefersReducedMotion()) return
    if (/^#(contact|book)$/.test(window.location.hash)) return
    if (el.getBoundingClientRect().top <= 0.9 * window.innerHeight) return
    setPhase('armed')

    let io: IntersectionObserver | null = null
    const stop = () => {
      io?.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
    const play = () => {
      stop()
      setPhase('playing')
    }
    function check() {
      const r = el!.getBoundingClientRect()
      const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
      if (seen >= 0.5 * r.height) play()
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && play(), { threshold: 0.5 })
      io.observe(el)
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return stop
  }, [])

  const state = phase === 'still' ? '' : phase === 'playing' ? 'is-armed is-playing' : 'is-armed'

  return (
    <figure ref={fig} className={`pc-fig ${state} ${className}`}>
      <div className="pc-phone">
        <PhoneFrame>
          <div className="pc">
            <div className="pc-status" aria-hidden="true">
              <span>21:40</span>
              <span className="pc-battery"><span /></span>
            </div>
            <div className="pc-head" aria-hidden="true">
              <span className="pc-avatar"><img src="/brand/mark.svg" alt="" width={24} height={24} /></span>
              <span className="pc-who">
                <span className="pc-name">Twinbyte</span>
                <span className="pc-sub">{caption}</span>
              </span>
            </div>
            <ol className="pc-list" role="list">
              {items.map((m, i) => (
                <li key={i} className={`pc-row pc-${m.from}`}>
                  <span className="sr-only">{m.from === 'you' ? you : us} </span>
                  <span className="pc-bubble pc-anim" style={ms(m.at)}>{unbroken(m.text)}</span>
                  {m.typing && (
                    <span
                      className="pc-typing"
                      aria-hidden="true"
                      style={{ ...ms(m.typing.at), '--out': `${m.typing.at + m.typing.for - 140}ms` } as CSSProperties}
                    >
                      <i /><i /><i />
                    </span>
                  )}
                </li>
              ))}
              {card && (
                <li className="pc-row pc-us">
                  <span className="sr-only">{us} </span>
                  <span className="pc-card pc-anim" style={ms(cardAt)}>
                    <span className="pc-pulse" aria-hidden="true" style={ms(cardAt + 400)} />
                    <span className="pc-check" aria-hidden="true" style={ms(cardAt + 300)}>
                      <svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
                        <path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
                      </svg>
                    </span>
                    <span className="pc-card-text">
                      <span className="pc-card-title">{card.title}</span>
                      <span className="pc-card-meta">{card.meta}</span>
                    </span>
                  </span>
                </li>
              )}
            </ol>
            <div className="pc-compose" aria-hidden="true">
              <span className="pc-field">{placeholder}</span>
              <span className="pc-send">
                <svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
                  <path d="M5 12h13M13 6.5 18.5 12 13 17.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </PhoneFrame>
      </div>
      <figcaption className="pc-caption">{caption}</figcaption>
    </figure>
  )
}
