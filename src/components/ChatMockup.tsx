import { useEffect, useRef, useState } from 'react'
import { CalendarCheck, PhoneCall, ShieldCheck } from 'lucide-react'
import { prefersReducedMotion } from './motion'
import type { Translation } from '../i18n'

/**
 * The floating "conversation → calendar entry" mock in the hero.
 * It replays the example conversation on a timer; with reduced motion it just
 * shows the finished state.
 */
export function ChatMockup({
  t,
  progress = null,
}: {
  t: Translation
  /** 0-1 while the hero is scrolled past; null when the mock plays on a timer. */
  progress?: number | null
}) {
  const messages = t.demo.messages
  const still = prefersReducedMotion()
  const [shown, setShown] = useState(still ? messages.length : 2)
  const [typing, setTyping] = useState(false)
  const timers = useRef<number[]>([])

  // Scroll-driven: the conversation advances with the page, not with a clock.
  useEffect(() => {
    if (progress === null) return
    // the last stretch of the scroll is spent on the finished state
    const eased = Math.min(progress / 0.82, 1)
    setTyping(false)
    setShown(Math.max(2, Math.round(eased * messages.length)))
  }, [progress, messages.length])

  useEffect(() => {
    if (still || progress !== null) return
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

    const run = () => {
      let clock = 600
      messages.forEach((message, index) => {
        if (message.from === 'bot') {
          at(clock, () => setTyping(true))
          clock += 900
        }
        at(clock, () => {
          setTyping(false)
          setShown(index + 1)
        })
        clock += message.from === 'bot' ? 1500 : 1100
      })
      at(clock + 5200, () => {
        setShown(0)
        run()
      })
    }

    run()
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [messages, still, progress])

  const done = shown >= messages.length

  return (
    <div>
      {/* Browser frame */}
      <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-night-card/90 shadow-float">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 truncate rounded-md bg-black/30 px-3 py-1 text-[11px] text-white/45">
            {t.demo.siteLabel}
          </span>
        </div>

        <div className="flex items-center justify-between px-5 pt-5">
          <span className="eyebrow border-accent-bright/25 text-accent-bright">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
            {t.demo.tag}
          </span>
          <ShieldCheck size={16} className="text-white/25" aria-hidden="true" />
        </div>

        <div className="mt-4 flex items-center gap-3 border-b border-white/5 px-5 pb-4">
          <img
            src="/icon-192.png"
            alt=""
            width={192}
            height={192}
            decoding="async"
            className="h-9 w-9 rounded-full"
          />
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-white/90">{t.demo.assistant}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t.demo.online}
            </p>
          </div>
        </div>

        <div className="flex h-[250px] flex-col justify-end gap-2.5 overflow-hidden px-5 pb-5 pt-4">
          {messages.slice(Math.max(0, shown - 4), shown).map((message, index) => (
            <div
              key={`${message.text}-${index}`}
              className={`animate-pop max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug ${
                message.from === 'patient'
                  ? 'self-end rounded-br-md bg-white/10 text-white/85'
                  : 'self-start rounded-bl-md bg-accent text-white shadow-glow'
              }`}
            >
              {message.text}
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md bg-accent/25 px-3.5 py-3">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-white" />
              <span
                className="h-1.5 w-1.5 animate-blink rounded-full bg-white"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="h-1.5 w-1.5 animate-blink rounded-full bg-white"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Calendar card: sits under the frame so it never covers the conversation */}
      <div
        className={`mt-5 w-[262px] rounded-xl border border-white/12 bg-night-soft/95 p-4 shadow-float transition-all duration-700 sm:w-[290px] ${
          done ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: `translateY(${done ? '0px' : '14px'})` }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          <CalendarCheck size={14} className="text-accent-bright" />
          {t.demo.calendarTitle}
        </div>
        <div className="mt-3 rounded-lg border-l-2 border-accent-bright bg-accent/25 px-3 py-2.5">
          <p className="text-[13px] font-semibold text-white">{t.demo.eventTitle}</p>
          <p className="mt-0.5 text-[11px] text-white/50">{t.demo.eventTime}</p>
        </div>
        <p className="mt-2 text-[11px] text-accent-bright/80">{t.demo.eventBadge}</p>
      </div>

      {/* Urgency hand-off card */}
      <div
        className="absolute -right-3 -top-7 hidden items-center gap-2 rounded-xl border border-white/12 bg-night-soft/95 px-3.5 py-2.5 shadow-float sm:flex lg:-right-10"
        
        aria-hidden="true"
      >
        <PhoneCall size={14} className="text-accent-bright" />
        <span className="text-[12px] font-medium text-white/80">{t.demo.callback}</span>
      </div>
    </div>
  )
}
