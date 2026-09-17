import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './motion'
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
 * It opens on a question and its answer — never on an empty box — plays out in
 * about three seconds, and then rests on the finished state. It used to loop
 * forever, which meant a setState roughly once a second for as long as the tab
 * was open.
 *
 * `compact` is the version that lives inside the phone in the hero stage: same
 * thread, smaller type, tighter padding.
 */
export function Conversation({
  t,
  compact = false,
  onDone,
}: {
  t: Translation
  compact?: boolean
  onDone?: (done: boolean) => void
}) {
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

    let clock = 900
    messages.forEach((message, index) => {
      if (index < 2) return
      if (message.from === 'bot') {
        at(clock, () => setTyping(true))
        clock += 480
      }
      at(clock, () => {
        setTyping(false)
        setShown(index + 1)
      })
      clock += message.from === 'bot' ? 700 : 520
    })

    const ids = timers.current
    return () => {
      ids.forEach(clearTimeout)
      timers.current = []
    }
  }, [messages, still])

  useEffect(() => {
    onDone?.(shown >= messages.length)
  }, [shown, messages.length, onDone])

  const bubble = compact
    ? 'max-w-[92%] px-1 py-0.5 text-[11px] leading-[16px]'
    : 'max-w-[88%] px-2 py-1 text-small'

  return (
    <div className={`flex flex-col ${compact ? 'gap-0.5' : 'gap-1'}`}>
      {messages.slice(0, shown).map((message, index) => {
        const fromBot = message.from === 'bot'
        return (
          <p
            key={index}
            className={`animate-rise ${bubble} ${
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
        <p
          className={`mark-in self-start bg-teal uppercase text-paper ${
            compact ? 'px-1 py-0.5 text-[9px] leading-[14px]' : 'px-2 py-1 text-micro'
          }`}
        >
          {t.demo.typing}
        </p>
      )}
    </div>
  )
}
