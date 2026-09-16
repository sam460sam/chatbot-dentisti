import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './motion'
import { Diary } from './Diary'
import type { Translation } from '../i18n'

/*
 * The example conversation, in the site's own grammar: which corner is square
 * tells you who is talking. The assistant's bubbles are .mark-in (said TO you);
 * the customer's are .mark-out (your turn).
 *
 * The customer's bubbles carry a near-black hairline. They used to be a pale fill
 * on a pale panel — 1.12:1 — so on a real screen only the assistant's side of the
 * conversation was visible and the mock looked broken.
 *
 * It opens on a question and its answer — never on an empty box — plays out in about
 * three seconds, and then rests on the finished state. It used
 * to loop forever — which meant a setState roughly once a second for as long as
 * the tab was open, still firing while the visitor was 7000px down reading the
 * FAQ, and a timer array that grew unbounded at about 200 entries an hour.
 */
export function ChatMockup({ t }: { t: Translation }) {
  const messages = t.demo.messages
  const still = prefersReducedMotion()
  const [shown, setShown] = useState(still ? messages.length : 2)
  const [typing, setTyping] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (still) return
    /* messages changes identity on a language switch; without this the new
       thread renders in full and is then collapsed back by the old timers. */
    setShown(2)
    setTyping(false)
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

    let clock = 500
    messages.forEach((message, index) => {
      if (index < 2) return
      if (message.from === 'bot') {
        at(clock, () => setTyping(true))
        clock += 420
      }
      at(clock, () => {
        setTyping(false)
        setShown(index + 1)
      })
      clock += message.from === 'bot' ? 620 : 480
    })

    const ids = timers.current
    return () => {
      ids.forEach(clearTimeout)
      timers.current = []
    }
  }, [messages, still])

  const done = shown >= messages.length

  return (
    <div className="bg-paper">
      <section
        aria-label={t.demo.tag}
        className="border-x border-t border-ink bg-paper"
      >
        <header className="flex items-center justify-between gap-2 border-b border-paper-edge px-2 py-1">
          <p className="t-label">{t.demo.tag}</p>
          <p className="text-micro text-ink-mute">{t.demo.siteLabel}</p>
        </header>

        <div className="flex flex-col gap-1 p-2">
          {messages.slice(0, shown).map((message, index) => {
            const fromBot = message.from === 'bot'
            return (
              <p
                key={index}
                className={`max-w-[88%] px-2 py-1 text-small animate-rise ${
                  fromBot
                    ? 'mark-in self-start bg-teal text-paper'
                    : 'mark-out self-end border border-ink bg-paper-deep text-ink'
                }`}
              >
                {message.text}
              </p>
            )
          })}

          {typing && (
            <p className="mark-in self-start bg-teal px-2 py-1 text-micro uppercase text-paper">
              {t.demo.typing}
            </p>
          )}
        </div>
      </section>

      {/* The result: the appointment lands in the diary the business already uses. */}
      <div
        className={`mt-1 transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!done}
      >
        <Diary t={t} />
      </div>
    </div>
  )
}
