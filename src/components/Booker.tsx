import { useEffect, useMemo, useRef, useState } from 'react'
import { pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { mailLink, waLink } from '../site'
import { Arrow, Bubble, Diary } from './marks'
import '../booker.css'

/*
 * The booking flow: day → time → details → done. Everything the visitor sees
 * is in their own time zone; the server only ever deals in UTC instants and
 * Rome hours, so this file never does date arithmetic beyond grouping.
 */

const TURNSTILE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || ''
const LOCALE = { en: 'en-GB', nl: 'nl-NL', it: 'it-IT' } as const
const CALL_MS = 15 * 60000

/* JS scrolling ignores the CSS reduced-motion rule, so ask every time. */
export function smooth(): ScrollBehavior {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  } catch {
    return 'auto'
  }
}

function visitorZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome'
  } catch {
    return 'Europe/Rome'
  }
}

/** "Central European Time" rather than "Europe/Amsterdam". */
function zoneName(zone: string, lang: keyof typeof LOCALE): string {
  try {
    const part = new Intl.DateTimeFormat(LOCALE[lang], { timeZone: zone, timeZoneName: 'longGeneric' })
      .formatToParts(Date.now())
      .find((p) => p.type === 'timeZoneName')?.value
    if (part && !/^GMT[+-]/.test(part)) return part
  } catch {
    /* older browsers: fall through */
  }
  return zone.replace(/_/g, ' ')
}

/** YYYY-MM-DD of an instant in a zone: the key slots are grouped by. */
function dayKey(ms: number, zone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ms)
}

/* A stalled request must end in an error the visitor can act on, never in
   "Loading…" forever. */
async function api<T>(path: string, body?: unknown): Promise<{ status: number; data: T | null }> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), body === undefined ? 10000 : 20000)
  try {
    const res = await fetch(path, body === undefined
      ? { headers: { accept: 'application/json' }, cache: 'no-store', signal: ctl.signal }
      : { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body), signal: ctl.signal })
    /* a missing endpoint would answer with the SPA's HTML and a 200 */
    if (!(res.headers.get('content-type') || '').includes('application/json')) return { status: 0, data: null }
    return { status: res.status, data: (await res.json()) as T }
  } finally {
    clearTimeout(timer)
  }
}

/* ---------------------------------------------------------------- Turnstile */
declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void }
  }
}

/** Loads Cloudflare Turnstile only when a site key exists and a form is open. */
function useTurnstile(active: boolean, lang: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [token, setToken] = useState('')
  const [blocked, setBlocked] = useState(false)
  const widget = useRef<string | null>(null)

  useEffect(() => {
    if (!TURNSTILE_KEY || !active || !ref.current) return
    let cancelled = false
    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile || widget.current) return
      widget.current = window.turnstile.render(ref.current, {
        sitekey: TURNSTILE_KEY,
        language: lang,
        appearance: 'interaction-only',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
      })
    }
    if (window.turnstile) mount()
    else if (!document.querySelector('script[data-turnstile]')) {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.dataset.turnstile = 'true'
      s.onload = mount
      s.onerror = () => setBlocked(true)
      document.head.appendChild(s)
    } else {
      const t = window.setInterval(() => window.turnstile && (window.clearInterval(t), mount()), 200)
      return () => window.clearInterval(t)
    }
    return () => {
      cancelled = true
    }
  }, [active, lang])

  const reset = () => {
    setToken('')
    if (window.turnstile && widget.current) window.turnstile.reset(widget.current)
  }
  return { ref, token, reset, blocked, needed: !!TURNSTILE_KEY }
}

/* ---------------------------------------------------------------- fields */

/* The phone keyboard's return key goes to the next field instead of sending
   a half-filled form. The message box keeps return for new lines. */
function nextField(e: { key: string; preventDefault(): void; currentTarget: HTMLInputElement }) {
  if (e.key !== 'Enter') return
  e.preventDefault()
  const form = e.currentTarget.form
  if (!form) return
  const all = Array.from(form.querySelectorAll<HTMLElement>('input:not([name=website]), textarea'))
  all[all.indexOf(e.currentTarget) + 1]?.focus()
}

function Field({
  label, name, type = 'text', value, onChange, error, optional, autoComplete, inputMode, multiline, maxLength,
}: {
  label: string; name: string; type?: string; value: string; onChange: (v: string) => void
  error?: string; optional?: string; autoComplete?: string; inputMode?: 'tel' | 'email' | 'text'; multiline?: boolean
  maxLength: number
}) {
  const id = `f-${name}`
  /* the field the visitor is sent to keeps its red edge while focused */
  const cls = `mt-0.5 w-full border bg-white px-2 py-1 text-body text-ink outline-none transition-colors ${
    error ? 'border-danger focus:shadow-[0_0_0_1px_#B42318]' : 'border-paper-edge-deep hover:border-ink-mute focus:border-teal focus:shadow-[0_0_0_1px_#356F8E]'
  }`
  const aria = { 'aria-invalid': !!error, 'aria-required': !optional, 'aria-describedby': error ? `${id}-e` : undefined }
  return (
    <div>
      <label htmlFor={id} className="text-small font-semibold text-ink">
        {label}
        {optional && <> <span className="whitespace-nowrap font-normal text-ink-soft">·&nbsp;{optional}</span></>}
      </label>
      {multiline ? (
        <textarea id={id} name={name} rows={3} value={value} maxLength={maxLength}
          onChange={(e) => onChange(e.currentTarget.value)} className={`${cls} resize-y`} {...aria} />
      ) : (
        <input id={id} name={name} type={type} value={value} maxLength={maxLength}
          onChange={(e) => onChange(e.currentTarget.value)} onKeyDown={nextField}
          autoComplete={autoComplete} inputMode={inputMode} enterKeyHint="next" className={cls}
          autoCapitalize={type === 'email' ? 'none' : undefined}
          autoCorrect={type === 'email' ? 'off' : undefined}
          spellCheck={type === 'email' ? false : undefined}
          {...aria} />
      )}
      {error && <p id={`${id}-e`} className="mt-0.5 text-small text-danger">{error}</p>}
    </div>
  )
}

/* On a phone the first wrong field is usually above the button, off screen:
   pressing "Book" then looked like it did nothing. Go to it and focus it. */
function showFirstError(err: Record<string, string>, order: string[]) {
  const first = order.find((k) => err[k])
  if (!first) return
  requestAnimationFrame(() => {
    const el = document.getElementById(`f-${first}`)
    if (!el) return
    el.scrollIntoView({ block: 'center', behavior: smooth() })
    el.focus({ preventScroll: true })
  })
}

/** A field humans never see. Bots fill it in. */
const Honeypot = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
    <label>
      Website
      <input tabIndex={-1} autoComplete="off" name="website" value={value} onChange={(e) => onChange(e.currentTarget.value)} />
    </label>
  </div>
)

const EMAIL = /^[^\s@<>(),;:"\\[\]]+@[^\s@<>(),;:"\\[\]]+\.[a-z]{2,}$/i
const PHONE = /^[+()\d\s.-]{6,40}$/

function Consent({ checked, onChange, error, before }: { checked: boolean; onChange: (v: boolean) => void; error?: string; before: string }) {
  const { lang } = useRoute()
  const c = booking[lang].form
  return (
    <div>
      <label className="flex items-start gap-1 text-small text-ink-soft">
        <input id="f-consent" type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)}
          className="mt-0.5 h-[20px] w-[20px] shrink-0 accent-teal" aria-invalid={!!error}
          aria-describedby={error ? 'f-consent-e' : undefined} />
        <span>
          {before}
          {/* a new tab: reading the statement must not throw away the form */}
          <a href={pathFor(lang, 'privacy')} target="_blank" rel="noopener" className="text-teal underline underline-offset-2">{c.consentLink}</a>
          {c.consentAfter}
        </span>
      </label>
      {error && <p id="f-consent-e" className="mt-0.5 text-small text-danger">{error}</p>}
    </div>
  )
}

/** A failure the visitor can act on: the sentence, and WhatsApp when it says so. */
function Fail({ text, wa }: { text: string; wa: boolean }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => ref.current?.focus({ preventScroll: false }), [text])
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="border-l-2 border-danger bg-paper px-2 py-1 text-small text-ink outline-none">
      <p>{text}</p>
      {wa && (
        <a className="mt-0.5 inline-flex min-h-[44px] items-center gap-0.5 font-semibold text-teal underline underline-offset-2" href={waLink(c.hero.waText)} rel="noopener">
          <Bubble size={16} />
          {c.errors.waCta}
        </a>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- booker */
/* "setup": the server has no Google secrets yet, so nothing here can book or
   send, and trying again cannot help. "down": a timeout or an outage. */
type Load = { state: 'loading' } | { state: 'error'; why: 'setup' | 'down'; retrying?: boolean } | { state: 'ready'; slots: number[] }
type Step = 'pick' | 'form' | 'done'
type Draft = { name: string; email: string; phone: string; business: string; message: string; website: string }
const EMPTY: Draft = { name: '', email: '', phone: '', business: '', message: '', website: '' }

export function Booker({ onRequest }: { onRequest: () => void }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const zone = useMemo(visitorZone, [])
  const zoneLabel = useMemo(() => zoneName(zone, lang), [zone, lang])
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState<number | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState<{ start: number; meet: string | null; email: string } | null>(null)
  /* what the visitor typed survives "Change" and "someone just took this time" */
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [consent, setConsent] = useState(false)
  const top = useRef<HTMLDivElement>(null)

  const fetchSlots = async () => {
    /* "Try again" keeps its card on screen while it asks */
    setLoad((l) => (l.state === 'error' ? { ...l, retrying: true } : { state: 'loading' }))
    let why: 'setup' | 'down' = 'down'
    try {
      const { status, data } = await api<{ slots?: string[]; error?: string }>('/api/slots')
      if (data?.error === 'not_configured') why = 'setup'
      if (status !== 200 || !data || !Array.isArray(data.slots)) throw new Error('slots')
      const slots = data.slots.map((s) => Date.parse(s)).filter(Number.isFinite)
      setLoad({ state: 'ready', slots })
      return slots
    } catch {
      setLoad({ state: 'error', why })
      return []
    }
  }

  useEffect(() => {
    void fetchSlots()
  }, [])

  const byDay = useMemo(() => {
    const m = new Map<string, number[]>()
    if (load.state !== 'ready') return m
    for (const s of load.slots) {
      const k = dayKey(s, zone)
      m.set(k, [...(m.get(k) || []), s])
    }
    return m
  }, [load, zone])

  /* first day with a free slot, chosen for the visitor */
  useEffect(() => {
    if (load.state === 'ready' && (!day || !byDay.has(day))) setDay(byDay.keys().next().value || '')
  }, [byDay, load.state, day])

  const fmtTime = (ms: number) => new Intl.DateTimeFormat(LOCALE[lang], { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(ms)
  const fmtDay = (ms: number) => new Intl.DateTimeFormat(LOCALE[lang], { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' }).format(ms)
  /* A day key is a calendar date, not an instant: format it in UTC, or a
     visitor at UTC+13 sees every day labelled one day late. */
  const fmtKey = (key: string) => new Intl.DateTimeFormat(LOCALE[lang], { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(Date.parse(`${key}T12:00:00Z`))

  /* Move to the step: scroll only when the card's top is out of sight, then
     put focus somewhere that tells a screen reader where it is. */
  const goStep = (s: Step, focus?: () => HTMLElement | null) => {
    setStep(s)
    requestAnimationFrame(() => {
      const el = top.current
      if (!el) return
      const y = el.getBoundingClientRect().top
      if (y < 64 || y > window.innerHeight - 160) el.scrollIntoView({ block: 'start', behavior: smooth() })
      focus?.()?.focus({ preventScroll: true })
    })
  }
  const selectedDay = () => top.current?.querySelector<HTMLElement>('[aria-pressed="true"]') || null

  /* ------- the calendar: 15 days, Monday-first. A first week with nothing
     free (a Sunday, or late in the day) is dropped instead of shown grey. */
  const grid = useMemo(() => {
    const today = Date.parse(`${dayKey(Date.now(), zone)}T12:00:00Z`)
    let days = Array.from({ length: 15 }, (_, i) => {
      const d = new Date(today + i * 86400000)
      return { key: d.toISOString().slice(0, 10), num: d.getUTCDate(), dow: (d.getUTCDay() + 6) % 7, ms: d.getTime() }
    })
    const firstWeek = 7 - days[0].dow
    if (byDay.size && days.slice(0, firstWeek).every((d) => !byDay.has(d.key))) days = days.slice(firstWeek)
    /* and a last row of days that are all past the last free time */
    while (byDay.size && days.length > 7 && days[days.length - 1].dow < 6 && !byDay.has(days[days.length - 1].key)) {
      const row = days.slice(days.length - 1 - days[days.length - 1].dow)
      if (row.some((d) => byDay.has(d.key))) break
      days = days.slice(0, days.length - row.length)
    }
    const lead = days[0].dow
    return { cells: [...Array.from({ length: lead }, () => null), ...days], first: days[0].ms, last: days[days.length - 1].ms }
  }, [zone, byDay])

  /* "October – November 2026" when the two weeks cross a month */
  const monthLabel = useMemo(() => {
    const f = new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' })
    const a = new Date(grid.first)
    const b = new Date(grid.last)
    if (a.getUTCMonth() === b.getUTCMonth()) return f.format(a)
    const m = (d: Date, year: boolean) => new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' }).format(d)
    return a.getUTCFullYear() === b.getUTCFullYear() ? `${m(a, false)} – ${m(b, true)}` : `${m(a, true)} – ${m(b, true)}`
  }, [grid, lang])
  const monthShort = (ms: number) => new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', timeZone: 'UTC' }).format(ms).replace('.', '')

  const daySlots = byDay.get(day) || []

  return (
    <div ref={top} className="scroll-mt-2">
      {step === 'done' && result ? (
        <Done result={result} fmtDay={fmtDay} fmtTime={fmtTime} zoneLabel={zoneLabel} />
      ) : step === 'form' && slot !== null ? (
        <BookForm
          slot={slot}
          zone={zone}
          zoneLabel={zoneLabel}
          fmtDay={fmtDay}
          fmtTime={fmtTime}
          draft={draft}
          setDraft={setDraft}
          consent={consent}
          setConsent={setConsent}
          onBack={() => goStep('pick', selectedDay)}
          onDone={(r) => {
            setResult(r)
            setDraft(EMPTY)
            setConsent(false)
            goStep('done')
          }}
          onTaken={async (msg) => {
            const taken = slot
            setNotice(msg)
            setSlot(null)
            /* drop it at once: the new list may take a moment */
            setLoad((l) => (l.state === 'ready' ? { ...l, slots: l.slots.filter((x) => x !== taken) } : l))
            goStep('pick', () => top.current?.querySelector<HTMLElement>('[data-notice]') || null)
            const fresh = await fetchSlots()
            if (fresh.includes(taken)) setLoad({ state: 'ready', slots: fresh.filter((x) => x !== taken) })
          }}
        />
      ) : (
        <div className={load.state === 'ready' && byDay.size > 0 ? 'xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-4' : ''}>
          <div>
          {notice && (
            <p data-notice tabIndex={-1} role="alert" className="mb-2 border-l-2 border-danger bg-paper px-2 py-1 text-small text-ink outline-none">
              {notice}
            </p>
          )}

          {load.state !== 'error' && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <h3 className="font-display text-h4 font-bold text-ink">{c.pick.day}</h3>
              {load.state === 'ready' && <span className="text-small capitalize text-ink-soft">{monthLabel}</span>}
            </div>
          )}

          {load.state === 'loading' && <p className="mt-2 text-small text-ink-soft" aria-live="polite">{c.pick.loading}</p>}

          {/* No calendar to show: what this visitor sees until the Google
              setup is done, or on an outage. Not an error to them — two ways
              to reach us that work right now, WhatsApp first. The request
              form needs Google too, so before the setup it is email instead,
              and "Try again" only appears when trying again can help. */}
          {load.state === 'error' && (
            <div role="status" data-unavailable={load.why}>
              <span aria-hidden="true" className="cut cut-sm flex h-6 w-6 items-center justify-center text-paper [--cut-fill:#356F8E]">
                <Bubble size={22} />
              </span>
              <h3 className="mt-2 font-display text-h4 font-bold text-ink">{c.pick.unavailableTitle}</h3>
              <p className="mt-1 max-w-measure text-small text-ink-soft">{c.pick.unavailable}</p>
              <div className="mt-3 grid gap-1 sm:flex sm:flex-wrap sm:items-center">
                <a className="btn-petrol" href={waLink(c.hero.waText)} rel="noopener">
                  <Bubble size={16} />
                  {c.hero.whatsapp}
                </a>
                {load.why === 'setup' ? (
                  <a className="btn-ghost-dark" href={`${mailLink(c.pick.emailSubject)}&body=${encodeURIComponent(c.hero.waText)}`}>{c.pick.email}</a>
                ) : (
                  <button type="button" className="btn-ghost-dark" onClick={onRequest}>{c.hero.request}</button>
                )}
                {load.why === 'down' && (
                  <button type="button" aria-disabled={load.retrying} onClick={() => !load.retrying && void fetchSlots()}
                    className="inline-flex min-h-[44px] items-center justify-center px-1 text-small font-semibold text-ink-soft underline underline-offset-2">
                    {load.retrying ? c.pick.loading : c.pick.retry}
                  </button>
                )}
              </div>
            </div>
          )}

          {load.state === 'ready' && (
            <>
              <div className="mt-2 grid grid-cols-7 gap-0.5 text-center" role="group" aria-label={c.pick.day}>
                {c.pick.weekdays.map((w) => (
                  <span key={w} aria-hidden="true" className="pb-0.5 text-micro font-bold uppercase text-ink-soft">{w}</span>
                ))}
                {grid.cells.map((cell, i) => {
                  if (!cell) return <span key={`b${i}`} aria-hidden="true" />
                  const free = byDay.get(cell.key)?.length || 0
                  const on = day === cell.key
                  /* the 1st of a new month carries its name, so "3" is never read as the wrong month */
                  const tag = cell.num === 1 && i > 0 ? <span aria-hidden="true" className="absolute top-[2px] text-[9px] font-bold uppercase leading-none tracking-wide">{monthShort(cell.ms)}</span> : null
                  if (!free)
                    return (
                      <span key={cell.key} aria-hidden="true" className="relative flex h-[44px] items-center justify-center text-small tabular-nums text-paper-dim">
                        {tag}
                        {cell.num}
                      </span>
                    )
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      aria-pressed={on}
                      aria-label={fmtKey(cell.key)}
                      onClick={() => {
                        setDay(cell.key)
                        setNotice('')
                      }}
                      className={`cut cut-sm flex h-[44px] items-center justify-center text-small font-semibold tabular-nums ${
                        on
                          ? 'text-paper [--cut-fill:#356F8E]'
                          : 'text-ink [--cut-fill:#EEF3F1] hover:text-teal hover:[--cut-fill:#DCEBE6]'
                      }`}
                    >
                      {tag}
                      {cell.num}
                      {!on && <span aria-hidden="true" className="day-dot absolute bottom-[5px] h-[3px] w-[3px] rounded-full bg-teal" />}
                    </button>
                  )
                })}
              </div>

              {byDay.size === 0 && (
                <div className="mt-3 border-l-2 border-teal bg-paper px-2 py-1">
                  <p className="text-small text-ink">{c.pick.noneAtAll}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <button type="button" className="btn-ghost-dark" onClick={onRequest}>{c.hero.request}</button>
                    <a className="btn-petrol" href={waLink(c.hero.waText)} rel="noopener">{c.hero.whatsapp}</a>
                  </div>
                </div>
              )}
            </>
          )}
          </div>

          {load.state === 'ready' && byDay.size > 0 && (
                <div className="mt-4 xl:mt-0 xl:border-l xl:border-paper-edge xl:pl-4">
                  <h3 className="font-display text-h4 font-bold text-ink">{c.pick.time}</h3>
                  {day && <p className="mt-0.5 text-small text-ink-soft first-letter:uppercase">{fmtKey(day)}</p>}
                  <ul role="list" className="mt-2 grid grid-cols-3 gap-1 sm:grid-cols-4">
                    {daySlots.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          aria-label={`${fmtDay(s)}, ${fmtTime(s)}`}
                          onClick={() => {
                            setSlot(s)
                            setNotice('')
                            goStep('form', () => document.getElementById('slot-title'))
                          }}
                          className="cut-line cut-sm flex h-6 w-full items-center justify-center text-small font-semibold tabular-nums text-teal [--cut-fill:#FFFFFF] [--cut-ink:#356F8E] hover:text-paper hover:[--cut-fill:#356F8E]"
                        >
                          {fmtTime(s)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {daySlots.length === 0 && <p className="text-small text-ink-soft">{c.pick.noSlotsDay}</p>}
                  <p className="mt-2 text-small text-ink-soft">{c.card.tz(zoneLabel)}</p>
                </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- the form */
function BookForm({
  slot, zone, zoneLabel, fmtDay, fmtTime, draft: v, setDraft, consent, setConsent, onBack, onDone, onTaken,
}: {
  slot: number; zone: string; zoneLabel: string
  fmtDay: (n: number) => string; fmtTime: (n: number) => string
  draft: Draft; setDraft: (f: (d: Draft) => Draft) => void
  consent: boolean; setConsent: (v: boolean) => void
  onBack: () => void
  onDone: (r: { start: number; meet: string | null; email: string }) => void
  onTaken: (msg: string) => void
}) {
  const { lang } = useRoute()
  const c = booking[lang]
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState<{ text: string; wa: boolean } | null>(null)
  /* a duration, not a timestamp: the visitor's clock may be wrong */
  const openedAt = useRef(performance.now())
  const ts = useTurnstile(true, lang)
  const set = (k: keyof Draft) => (x: string) => {
    setDraft((o) => ({ ...o, [k]: x }))
    setErrors((e) => (e[k] ? { ...e, [k]: '' } : e))
  }

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (busy) return
    const err: Record<string, string> = {}
    if (!v.name.trim()) err.name = c.form.required
    if (!EMAIL.test(v.email.trim())) err.email = v.email.trim() ? c.form.badEmail : c.form.required
    if (!PHONE.test(v.phone.trim())) err.phone = c.form.badPhone
    if (!v.business.trim()) err.business = c.form.required
    if (!consent) err.consent = c.form.needConsent
    setErrors(err)
    setFail(null)
    if (Object.keys(err).length) return showFirstError(err, ['name', 'business', 'email', 'phone', 'consent'])
    if (ts.needed && !ts.token) return setFail(ts.blocked ? { text: c.errors.generic, wa: true } : { text: c.errors.verifying, wa: false })
    setBusy(true)
    try {
      const { status, data } = await api<{ ok?: boolean; error?: string; meet?: string | null; start?: string }>('/api/book', {
        ...v, start: new Date(slot).toISOString(), lang, zone, consent,
        elapsed: Math.round(performance.now() - openedAt.current), turnstile: ts.token,
      })
      if (status === 200 && data?.ok) return onDone({ start: slot, meet: data.meet || null, email: v.email.trim() })
      const code = data?.error
      if (code === 'slot_taken' || code === 'slot_invalid') return onTaken(c.errors.slot_taken)
      if (code === 'invalid_phone') return setErrors({ phone: c.form.badPhone }), showFirstError({ phone: '1' }, ['phone'])
      if (code === 'already_booked') {
        const at = data?.start ? Date.parse(data.start) : NaN
        setFail({ text: c.errors.already_booked(Number.isFinite(at) ? `${fmtDay(at)}, ${fmtTime(at)}` : ''), wa: true })
      } else if (code === 'bot') setFail({ text: c.errors.bot, wa: false })
      else setFail({ text: c.errors.generic, wa: true })
      ts.reset()
    } catch {
      setFail({ text: c.errors.generic, wa: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-2">
      <div className="flex items-start justify-between gap-1 border-b border-paper-edge-deep pb-2">
        <div>
          <p className="t-label">{c.card.title}</p>
          <h3 id="slot-title" tabIndex={-1} className="mt-0.5 font-display text-h4 font-bold text-ink outline-none">
            <span className="block first-letter:uppercase">{fmtDay(slot)}</span>
            <span className="block tabular-nums">{fmtTime(slot)}–{fmtTime(slot + CALL_MS)}</span>
          </h3>
          <p className="mt-0.5 text-small text-ink-soft">{c.card.tz(zoneLabel)}</p>
        </div>
        <button type="button" onClick={onBack} aria-label={c.pick.changeLabel}
          className="-mr-1 -mt-1 inline-flex min-h-[44px] shrink-0 items-center px-1 text-small font-semibold text-teal underline underline-offset-2">
          {c.pick.change}
        </button>
      </div>

      <h3 className="font-display text-h4 font-bold text-ink">{c.form.title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={c.form.name} name="name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" maxLength={80} />
        <Field label={c.form.business} name="business" value={v.business} onChange={set('business')} error={errors.business} autoComplete="organization" maxLength={120} />
        <Field label={c.form.email} name="email" type="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" maxLength={254} />
        <Field label={c.form.phone} name="phone" type="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" maxLength={40} />
      </div>
      <Field label={c.form.message} name="message" optional={c.form.optional} value={v.message} onChange={set('message')} multiline maxLength={1500} />
      <Honeypot value={v.website} onChange={set('website')} />
      <Consent
        before={c.form.consentBefore}
        checked={consent}
        onChange={(on) => {
          setConsent(on)
          if (on) setErrors((e) => ({ ...e, consent: '' }))
        }}
        error={errors.consent}
      />
      {ts.needed && <div ref={ts.ref} />}
      {fail && <Fail text={fail.text} wa={fail.wa} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <button type="submit" aria-disabled={busy} className="btn-petrol">
          {busy ? c.form.sending : c.form.submit}
          {!busy && <Arrow />}
        </button>
        <button type="button" onClick={onBack} className="inline-flex min-h-[44px] items-center px-1 text-small font-semibold text-ink-soft underline underline-offset-2">
          {c.pick.back}
        </button>
      </div>
    </form>
  )
}

/* An email address in running text: never hyphenated, may break anywhere. */
function withAddress(sentence: (email: string) => string, email: string) {
  const [before, after] = sentence('\u0000').split('\u0000')
  return (
    <>
      {before}
      <strong className="font-semibold text-ink [hyphens:none] [overflow-wrap:anywhere]">{email}</strong>
      {after}
    </>
  )
}

/* ---------------------------------------------------------------- done */
const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

function Done({
  result, fmtDay, fmtTime, zoneLabel,
}: {
  result: { start: number; meet: string | null; email: string }
  fmtDay: (n: number) => string; fmtTime: (n: number) => string; zoneLabel: string
}) {
  const { lang } = useRoute()
  const c = booking[lang]
  const end = result.start + CALL_MS
  const add = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE', text: `Twinbyte — ${c.card.title.replace(/\u00AD/g, '')}`, dates: `${stamp(result.start)}/${stamp(end)}`, details: result.meet || '',
  })}`
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus({ preventScroll: true }), [])
  return (
    <div className="animate-rise">
      <span aria-hidden="true" className="cut cut-sm flex h-6 w-6 items-center justify-center text-paper [--cut-fill:#356F8E]">
        <Diary size={22} />
      </span>
      <h3 ref={heading} tabIndex={-1} className="mt-2 font-display text-h3 font-bold text-ink outline-none">{c.done.title}</h3>
      <p className="mt-1 font-display text-h4 font-bold text-teal">
        <span className="block first-letter:uppercase">{fmtDay(result.start)}</span>
        <span className="block tabular-nums">{fmtTime(result.start)}–{fmtTime(end)}</span>
      </p>
      <p className="mt-0.5 text-small text-ink-soft">{c.card.tz(zoneLabel)}</p>
      <p className="t-body mt-2">{withAddress(c.done.body, result.email)}</p>
      <p className="t-body mt-1">{c.done.next}</p>
      {/* the call may be days away: putting it in the calendar comes first */}
      <div className="mt-3 grid max-w-[22rem] gap-1">
        <a className="btn-petrol" href={add} target="_blank" rel="noopener">
          {c.done.add}
          <Arrow />
        </a>
        {result.meet && (
          <a className="btn-ghost-dark" href={result.meet} target="_blank" rel="noopener">{c.done.meet}</a>
        )}
      </div>
      <p className="mt-3 text-small">
        <a className="inline-flex min-h-[44px] items-center gap-0.5 text-teal underline underline-offset-2" href={waLink(c.hero.waText)} rel="noopener">
          <Bubble size={16} />
          {c.done.whatsapp}
        </a>
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- request */
export function RequestForm({ onBack }: { onBack: () => void }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const [v, setV] = useState<Draft>(EMPTY)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState<{ text: string; wa: boolean } | null>(null)
  const [sent, setSent] = useState('')
  const openedAt = useRef(performance.now())
  const ts = useTurnstile(!sent, lang)
  const heading = useRef<HTMLHeadingElement>(null)
  const set = (k: keyof Draft) => (x: string) => {
    setV((o) => ({ ...o, [k]: x }))
    setErrors((e) => (e[k] ? { ...e, [k]: '' } : e))
  }

  /* The thank-you is much shorter than the form: without this it lands above
     the screen on a phone and pressing "Send" looks like it did nothing. */
  useEffect(() => {
    if (!sent) return
    requestAnimationFrame(() => {
      document.getElementById('book')?.scrollIntoView({ block: 'start', behavior: smooth() })
      heading.current?.focus({ preventScroll: true })
    })
  }, [sent])

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (busy) return
    const err: Record<string, string> = {}
    if (!v.name.trim()) err.name = c.form.required
    if (!EMAIL.test(v.email.trim())) err.email = v.email.trim() ? c.form.badEmail : c.form.required
    if (v.phone.trim() && !PHONE.test(v.phone.trim())) err.phone = c.form.badPhone
    if (!v.message.trim()) err.message = c.form.required
    if (!consent) err.consent = c.form.needConsent
    setErrors(err)
    setFail(null)
    if (Object.keys(err).length) return showFirstError(err, ['name', 'email', 'business', 'phone', 'message', 'consent'])
    if (ts.needed && !ts.token) return setFail(ts.blocked ? { text: c.errors.generic, wa: true } : { text: c.errors.verifying, wa: false })
    setBusy(true)
    try {
      const { status, data } = await api<{ ok?: boolean; error?: string }>('/api/request', {
        ...v, lang, consent, elapsed: Math.round(performance.now() - openedAt.current), turnstile: ts.token,
      })
      if (status === 200 && data?.ok) return setSent(v.email.trim())
      if (data?.error === 'invalid_phone') return setErrors({ phone: c.form.badPhone }), showFirstError({ phone: '1' }, ['phone'])
      setFail(data?.error === 'bot' ? { text: c.errors.bot, wa: false } : { text: c.errors.generic, wa: true })
      ts.reset()
    } catch {
      setFail({ text: c.errors.generic, wa: true })
    } finally {
      setBusy(false)
    }
  }

  if (sent)
    return (
      <div className="animate-rise">
        <span aria-hidden="true" className="cut cut-sm flex h-6 w-6 items-center justify-center text-paper [--cut-fill:#356F8E]">
          <Bubble size={22} />
        </span>
        <h3 ref={heading} tabIndex={-1} className="mt-2 font-display text-h3 font-bold text-ink outline-none">{c.request.doneTitle}</h3>
        <p className="t-body mt-2">{withAddress(c.request.done, sent)}</p>
        <button type="button" onClick={onBack} className="btn-ghost-dark mt-3">{c.request.back}</button>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-2">
      <div>
        <h3 id="request-title" tabIndex={-1} className="font-display text-h3 font-bold text-ink outline-none">{c.request.title}</h3>
        <p className="mt-1 text-small text-ink-soft">{c.request.lead}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={c.form.name} name="name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" maxLength={80} />
        <Field label={c.form.email} name="email" type="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" maxLength={254} />
        <Field label={c.form.business} name="business" optional={c.form.optional} value={v.business} onChange={set('business')} autoComplete="organization" maxLength={120} />
        <Field label={c.form.phone} name="phone" type="tel" inputMode="tel" optional={c.form.optional} value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" maxLength={40} />
      </div>
      <Field label={c.request.message} name="message" value={v.message} onChange={set('message')} error={errors.message} multiline maxLength={3000} />
      <Honeypot value={v.website} onChange={set('website')} />
      <Consent
        before={c.request.consentBefore}
        checked={consent}
        onChange={(on) => {
          setConsent(on)
          if (on) setErrors((e) => ({ ...e, consent: '' }))
        }}
        error={errors.consent}
      />
      {ts.needed && <div ref={ts.ref} />}
      {fail && <Fail text={fail.text} wa={fail.wa} />}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <button type="submit" aria-disabled={busy} className="btn-petrol">
          {busy ? c.request.sending : c.request.submit}
          {!busy && <Arrow />}
        </button>
        <button type="button" onClick={onBack} className="inline-flex min-h-[44px] items-center px-1 text-small font-semibold text-ink-soft underline underline-offset-2">
          {c.request.back}
        </button>
      </div>
    </form>
  )
}
