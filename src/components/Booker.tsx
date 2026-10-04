import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Arrow, Bubble, Diary } from './marks'

/*
 * The booking flow: day → time → details → done. Everything the visitor sees
 * is in their own time zone; the server only ever deals in UTC instants and
 * Rome hours, so this file never does date arithmetic beyond grouping.
 */

const TURNSTILE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) || ''
const LOCALE = { en: 'en-GB', nl: 'nl-NL', it: 'it-IT' } as const

function visitorZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Rome'
  } catch {
    return 'Europe/Rome'
  }
}

/** YYYY-MM-DD of an instant in a zone: the key slots are grouped by. */
function dayKey(ms: number, zone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(ms)
}

async function api<T>(path: string, body?: unknown): Promise<{ status: number; data: T | null }> {
  const res = await fetch(path, body === undefined
    ? { headers: { accept: 'application/json' } }
    : { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
  /* a missing endpoint would answer with the SPA's HTML and a 200 */
  if (!(res.headers.get('content-type') || '').includes('application/json')) return { status: 0, data: null }
  return { status: res.status, data: (await res.json()) as T }
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
  return { ref, token, reset, needed: !!TURNSTILE_KEY }
}

/* ---------------------------------------------------------------- fields */
function Field({
  label, name, type = 'text', value, onChange, error, optional, autoComplete, inputMode, multiline,
}: {
  label: string; name: string; type?: string; value: string; onChange: (v: string) => void
  error?: string; optional?: string; autoComplete?: string; inputMode?: 'tel' | 'email' | 'text'; multiline?: boolean
}) {
  const id = `f-${name}`
  const cls = `mt-0.5 w-full border bg-white px-1.5 py-1 text-body text-ink outline-none transition-colors focus:border-teal ${
    error ? 'border-verm' : 'border-paper-edge-deep'
  }`
  return (
    <div>
      <label htmlFor={id} className="text-small font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-ink-mute"> · {optional}</span>}
      </label>
      {multiline ? (
        <textarea id={id} name={name} rows={3} value={value} onChange={(e) => onChange(e.currentTarget.value)}
          className={`${cls} resize-y`} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} />
      ) : (
        <input id={id} name={name} type={type} value={value} onChange={(e) => onChange(e.currentTarget.value)}
          autoComplete={autoComplete} inputMode={inputMode} className={cls}
          aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} />
      )}
      {error && <p id={`${id}-e`} className="mt-0.5 text-small text-verm">{error}</p>}
    </div>
  )
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

function Consent({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const { lang } = useRoute()
  const c = booking[lang].form
  return (
    <div>
      <label className="flex items-start gap-1 text-small text-ink-soft">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.currentTarget.checked)}
          className="mt-0.5 h-2 w-2 shrink-0 accent-teal" aria-invalid={!!error} />
        <span>
          {c.consentBefore}
          <Link to={pathFor(lang, 'privacy')} className="text-teal underline underline-offset-2">{c.consentLink}</Link>
          {c.consentAfter}
        </span>
      </label>
      {error && <p className="mt-0.5 text-small text-verm">{error}</p>}
    </div>
  )
}

/* ---------------------------------------------------------------- booker */
type Load = { state: 'loading' } | { state: 'error' } | { state: 'ready'; slots: number[] }
type Step = 'pick' | 'form' | 'done'

export function Booker({ onRequest }: { onRequest: () => void }) {
  const { lang } = useRoute()
  const c = booking[lang]
  const zone = useMemo(visitorZone, [])
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [day, setDay] = useState('')
  const [slot, setSlot] = useState<number | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [notice, setNotice] = useState('')
  const [result, setResult] = useState<{ start: number; meet: string | null; email: string } | null>(null)
  const top = useRef<HTMLDivElement>(null)

  const fetchSlots = async () => {
    setLoad({ state: 'loading' })
    try {
      const { status, data } = await api<{ slots: string[] }>('/api/slots')
      if (status !== 200 || !data) throw new Error('slots')
      const slots = data.slots.map((s) => Date.parse(s)).filter(Number.isFinite)
      setLoad({ state: 'ready', slots })
      return slots
    } catch {
      setLoad({ state: 'error' })
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

  const goStep = (s: Step) => {
    setStep(s)
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
  }

  /* ------- the calendar: from today, 15 days, laid out Monday-first */
  const grid = useMemo(() => {
    const today = Date.parse(`${dayKey(Date.now(), zone)}T12:00:00Z`)
    const days = Array.from({ length: 15 }, (_, i) => {
      const d = new Date(today + i * 86400000)
      return { key: d.toISOString().slice(0, 10), num: d.getUTCDate(), dow: (d.getUTCDay() + 6) % 7 }
    })
    const lead = days[0].dow
    return { cells: [...Array.from({ length: lead }, () => null), ...days], month: new Date(today) }
  }, [zone])

  const monthLabel = new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(grid.month)

  return (
    <div ref={top} className="scroll-mt-9">
      {step === 'done' && result ? (
        <Done result={result} zone={zone} fmtDay={fmtDay} fmtTime={fmtTime} />
      ) : step === 'form' && slot !== null ? (
        <BookForm
          slot={slot}
          zone={zone}
          label={`${fmtDay(slot)} · ${fmtTime(slot)}`}
          onBack={() => goStep('pick')}
          onDone={(r) => {
            setResult(r)
            goStep('done')
          }}
          onTaken={async (msg) => {
            setNotice(msg)
            setSlot(null)
            await fetchSlots()
            goStep('pick')
          }}
        />
      ) : (
        <div>
          {notice && (
            <p role="alert" className="mb-2 border-l-2 border-verm bg-white px-1.5 py-1 text-small text-ink">
              {notice}
            </p>
          )}

          <div className="flex items-baseline justify-between gap-1">
            <h3 className="font-display text-h4 font-bold text-ink">{c.pick.day}</h3>
            <span className="text-small capitalize text-ink-mute">{monthLabel}</span>
          </div>

          {load.state === 'loading' && <p className="mt-2 text-small text-ink-mute" aria-live="polite">{c.pick.loading}</p>}

          {load.state === 'error' && (
            <div className="mt-2 border-l-2 border-verm bg-white px-1.5 py-1">
              <p className="text-small text-ink">{c.pick.unavailable}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <button type="button" className="btn-line" onClick={onRequest}>{c.hero.request}</button>
                <a className="btn-teal" href={waLink(c.hero.waText)} rel="noopener">{c.hero.whatsapp}</a>
              </div>
            </div>
          )}

          {load.state === 'ready' && (
            <>
              <div className="mt-2 grid grid-cols-7 gap-0.5 text-center" role="group" aria-label={c.pick.day}>
                {c.pick.weekdays.map((w) => (
                  <span key={w} className="pb-0.5 text-micro font-bold uppercase text-ink-mute">{w}</span>
                ))}
                {grid.cells.map((cell, i) => {
                  if (!cell) return <span key={`b${i}`} />
                  const free = byDay.get(cell.key)?.length || 0
                  const on = day === cell.key
                  return (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={!free}
                      aria-pressed={on}
                      aria-label={free ? fmtDay(Date.parse(`${cell.key}T12:00:00Z`)) : undefined}
                      onClick={() => {
                        setDay(cell.key)
                        setNotice('')
                      }}
                      className={`relative flex h-5 items-center justify-center text-small font-semibold tabular-nums transition-colors ${
                        on
                          ? 'mark-in bg-teal text-paper'
                          : free
                            ? 'mark-in bg-white text-ink hover:bg-teal hover:text-paper'
                            : 'cursor-default text-paper-dim'
                      }`}
                    >
                      {cell.num}
                      {free > 0 && !on && <span aria-hidden="true" className="absolute bottom-0.5 h-[3px] w-[3px] rounded-full bg-teal" />}
                    </button>
                  )
                })}
              </div>

              {byDay.size === 0 ? (
                <div className="mt-3 border-l-2 border-teal bg-white px-1.5 py-1">
                  <p className="text-small text-ink">{c.pick.noneAtAll}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <button type="button" className="btn-line" onClick={onRequest}>{c.hero.request}</button>
                    <a className="btn-teal" href={waLink(c.hero.waText)} rel="noopener">{c.hero.whatsapp}</a>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <h3 className="font-display text-h4 font-bold text-ink">
                    {c.pick.time}
                    {day && <span className="ml-1 text-small font-normal text-ink-mute first-letter:uppercase">{fmtDay(Date.parse(`${day}T12:00:00Z`))}</span>}
                  </h3>
                  <ul role="list" className="mt-1.5 grid grid-cols-3 gap-1 sm:grid-cols-4">
                    {(byDay.get(day) || []).map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => {
                            setSlot(s)
                            setNotice('')
                            goStep('form')
                          }}
                          className="mark-out w-full border border-teal bg-white py-1 text-small font-semibold tabular-nums text-teal transition-colors hover:bg-teal hover:text-paper"
                        >
                          {fmtTime(s)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {(byDay.get(day) || []).length === 0 && <p className="text-small text-ink-mute">{c.pick.noSlotsDay}</p>}
                </div>
              )}
            </>
          )}

          <p className="mt-3 text-micro normal-case tracking-normal text-ink-mute">{c.card.tz(zone)}</p>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- the form */
function BookForm({
  slot, zone, label, onBack, onDone, onTaken,
}: {
  slot: number; zone: string; label: string; onBack: () => void
  onDone: (r: { start: number; meet: string | null; email: string }) => void
  onTaken: (msg: string) => void
}) {
  const { lang } = useRoute()
  const c = booking[lang]
  const [v, setV] = useState({ name: '', email: '', phone: '', business: '', message: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const openedAt = useRef(Date.now())
  const ts = useTurnstile(true, lang)
  const set = (k: keyof typeof v) => (x: string) => setV((o) => ({ ...o, [k]: x }))

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!v.name.trim()) err.name = c.form.required
    if (!EMAIL.test(v.email.trim())) err.email = v.email.trim() ? c.form.badEmail : c.form.required
    if (!PHONE.test(v.phone.trim())) err.phone = c.form.badPhone
    if (!v.business.trim()) err.business = c.form.required
    if (!consent) err.consent = c.form.needConsent
    setErrors(err)
    setFail('')
    if (Object.keys(err).length) return
    setBusy(true)
    try {
      const { status, data } = await api<{ ok?: boolean; error?: string; meet?: string | null }>('/api/book', {
        ...v, start: new Date(slot).toISOString(), lang, zone, consent, openedAt: openedAt.current, turnstile: ts.token,
      })
      if (status === 200 && data?.ok) return onDone({ start: slot, meet: data.meet || null, email: v.email.trim() })
      const code = data?.error
      if (code === 'slot_taken' || code === 'slot_invalid') return onTaken(c.errors.slot_taken)
      setFail(code === 'already_booked' ? c.errors.already_booked : code === 'bot' ? c.errors.bot : c.errors.generic)
      ts.reset()
    } catch {
      setFail(c.errors.generic)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-2">
      <div className="flex items-start justify-between gap-1 border-b border-paper-edge pb-1.5">
        <div>
          <p className="t-label">{c.card.title}</p>
          <p className="mt-0.5 font-display text-h4 font-bold text-ink first-letter:uppercase">{label}</p>
        </div>
        <button type="button" onClick={onBack} className="shrink-0 text-small font-semibold text-teal underline underline-offset-2">
          {c.pick.change}
        </button>
      </div>

      <h3 className="font-display text-h4 font-bold text-ink">{c.form.title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={c.form.name} name="name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field label={c.form.business} name="business" value={v.business} onChange={set('business')} error={errors.business} autoComplete="organization" />
        <Field label={c.form.email} name="email" type="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field label={c.form.phone} name="phone" type="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
      </div>
      <Field label={c.form.message} name="message" optional={c.form.optional} value={v.message} onChange={set('message')} multiline />
      <Honeypot value={v.website} onChange={set('website')} />
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      {ts.needed && <div ref={ts.ref} />}
      {fail && (
        <p role="alert" className="border-l-2 border-verm bg-white px-1.5 py-1 text-small text-ink">
          {fail}{' '}
          <a className="text-teal underline" href={waLink(c.hero.waText)} rel="noopener">WhatsApp</a>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1">
        <button type="submit" disabled={busy} className="btn-teal disabled:opacity-60">
          {busy ? c.form.sending : c.form.submit}
          {!busy && <Arrow />}
        </button>
        <button type="button" onClick={onBack} className="text-small font-semibold text-ink-soft underline underline-offset-2">
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
  result, fmtDay, fmtTime,
}: {
  result: { start: number; meet: string | null; email: string }; zone: string
  fmtDay: (n: number) => string; fmtTime: (n: number) => string
}) {
  const { lang } = useRoute()
  const c = booking[lang]
  const end = result.start + 15 * 60000
  const add = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE', text: 'Twinbyte — discovery call', dates: `${stamp(result.start)}/${stamp(end)}`, details: result.meet || '',
  })}`
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <div className="animate-rise" aria-live="polite">
      <span aria-hidden="true" className="mark-in flex h-5 w-5 items-center justify-center bg-teal text-paper">
        <Diary size={20} />
      </span>
      <h3 ref={heading} tabIndex={-1} className="mt-2 font-display text-h3 font-bold text-ink outline-none">{c.done.title}</h3>
      <p className="mt-1 font-display text-h4 font-bold text-teal first-letter:uppercase">
        {fmtDay(result.start)} · {fmtTime(result.start)}
      </p>
      <p className="t-body mt-2">{withAddress(c.done.body, result.email)}</p>
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:flex-wrap">
        {result.meet && (
          <a className="btn-teal" href={result.meet} target="_blank" rel="noopener">
            {c.done.meet}
            <Arrow />
          </a>
        )}
        <a className="btn-line" href={add} target="_blank" rel="noopener">{c.done.add}</a>
      </div>
      <p className="mt-3 text-small">
        <a className="inline-flex items-center gap-0.5 text-teal underline underline-offset-2" href={waLink(c.hero.waText)} rel="noopener">
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
  const [v, setV] = useState({ name: '', email: '', phone: '', business: '', message: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const [sent, setSent] = useState('')
  const openedAt = useRef(Date.now())
  const ts = useTurnstile(!sent, lang)
  const set = (k: keyof typeof v) => (x: string) => setV((o) => ({ ...o, [k]: x }))

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!v.name.trim()) err.name = c.form.required
    if (!EMAIL.test(v.email.trim())) err.email = v.email.trim() ? c.form.badEmail : c.form.required
    if (v.phone.trim() && !PHONE.test(v.phone.trim())) err.phone = c.form.badPhone
    if (!v.message.trim()) err.message = c.form.required
    if (!consent) err.consent = c.form.needConsent
    setErrors(err)
    setFail('')
    if (Object.keys(err).length) return
    setBusy(true)
    try {
      const { status, data } = await api<{ ok?: boolean; error?: string }>('/api/request', {
        ...v, lang, consent, openedAt: openedAt.current, turnstile: ts.token,
      })
      if (status === 200 && data?.ok) return setSent(v.email.trim())
      setFail(data?.error === 'bot' ? c.errors.bot : c.errors.generic)
      ts.reset()
    } catch {
      setFail(c.errors.generic)
    } finally {
      setBusy(false)
    }
  }

  if (sent)
    return (
      <div className="animate-rise" aria-live="polite">
        <h3 className="font-display text-h3 font-bold text-ink">{c.request.title}</h3>
        <p className="t-body mt-2">{withAddress(c.request.done, sent)}</p>
        <button type="button" onClick={onBack} className="btn-line mt-3">{c.request.back}</button>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-2">
      <div>
        <h3 className="font-display text-h3 font-bold text-ink">{c.request.title}</h3>
        <p className="t-body mt-1 text-small">{c.request.lead}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={c.form.name} name="name" value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field label={c.form.email} name="email" type="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <Field label={c.form.business} name="business" optional={c.form.optional} value={v.business} onChange={set('business')} autoComplete="organization" />
        <Field label={c.form.phone} name="phone" type="tel" inputMode="tel" optional={c.form.optional} value={v.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
      </div>
      <Field label={c.request.message} name="message" value={v.message} onChange={set('message')} error={errors.message} multiline />
      <Honeypot value={v.website} onChange={set('website')} />
      <Consent checked={consent} onChange={setConsent} error={errors.consent} />
      {ts.needed && <div ref={ts.ref} />}
      {fail && <p role="alert" className="border-l-2 border-verm bg-white px-1.5 py-1 text-small text-ink">{fail}</p>}
      <div className="flex flex-wrap items-center gap-1">
        <button type="submit" disabled={busy} className="btn-teal disabled:opacity-60">
          {busy ? c.form.sending : c.request.submit}
        </button>
        <button type="button" onClick={onBack} className="text-small font-semibold text-ink-soft underline underline-offset-2">
          {c.request.back}
        </button>
      </div>
    </form>
  )
}
