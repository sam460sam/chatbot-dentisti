import type { Env } from './config.ts'
import { isMock, notifyEmail } from './config.ts'
import { realGoogle, type Google } from './google.ts'
import { mockGoogle } from './mock.ts'
import { raw } from './mail.ts'

/* _headers rules do not reach Function responses, so these are set here. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'same-origin',
    },
  })
}

export const google = (env: Env): Google => (isMock(env) ? mockGoogle() : realGoogle(env))

export type Lang = 'en' | 'nl' | 'it'
export const asLang = (v: unknown): Lang => (v === 'nl' || v === 'it' ? v : 'en')

/** A visitor's time zone, only if the runtime knows it. */
export function asZone(v: unknown): string {
  if (typeof v !== 'string' || v.length > 64) return 'Europe/Rome'
  try {
    new Intl.DateTimeFormat('en', { timeZone: v })
    return v
  } catch {
    return 'Europe/Rome'
  }
}

/** Trimmed text with control characters removed, or "" if too long.
    Single-line fields (name, phone, business) also lose line breaks;
    only the message keeps them. */
export function text(v: unknown, max: number, multiline = false): string {
  if (typeof v !== 'string') return ''
  let s = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
  if (!multiline) s = s.replace(/[\r\n\t]+/g, ' ')
  s = s.trim()
  /* a long message is cut, not lost; the form already stops the others */
  if (s.length > max) return multiline ? s.slice(0, max).trim() : ''
  return s
}

/* Exactly application/json. A looser test let "text/plain; x=application/json"
   through, and text/plain is a type another site may POST to us from its
   visitors' browsers without asking (no CORS preflight). */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return null
  const len = Number(request.headers.get('content-length') || 0)
  if (len > 20000) return null
  try {
    const v = await request.json()
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

/*
 * Bots. Three cheap layers, all free:
 *  - a field humans never see (`website`); bots fill it
 *  - the form must have been open at least 3 seconds (measured by the
 *    page as a duration, so a visitor whose clock is off is not a bot)
 *  - Cloudflare Turnstile, when TURNSTILE_SECRET is set
 */
export async function looksHuman(env: Env, body: Record<string, unknown>, ip: string | null): Promise<boolean> {
  if (typeof body.website === 'string' && body.website.trim() !== '') return false
  const elapsed = Number(body.elapsed)
  if (!Number.isFinite(elapsed) || elapsed < 3000) return false
  if (!env.TURNSTILE_SECRET) return true
  const token = typeof body.turnstile === 'string' ? body.turnstile : ''
  if (!token) return false
  const form = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token })
  if (ip) form.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
    const out = (await res.json()) as { success?: boolean }
    return out.success === true
  } catch {
    return false
  }
}

/*
 * Pages keeps no logs. A booking that fails while the owners are on the
 * other side of the world would leave no trace, so a failure reports itself
 * by mail — best effort, and never allowed to throw.
 *
 * At most one mail per place and visitor every 30 minutes (per isolate, so
 * roughly): a Google outage must not answer every page view with a mail,
 * and use up the Gmail quota the confirmations need. A different visitor
 * (a different `detail`) still gets a mail of their own.
 */
const reported = new Map<string, number>()
const QUIET_MS = 30 * 60000

export async function reportFailure(env: Env, where: string, error: unknown, detail: Record<string, unknown> = {}) {
  console.error(where, error)
  const key = `${where} ${JSON.stringify(detail)}`
  const now = Date.now()
  if (now - (reported.get(key) ?? -Infinity) < QUIET_MS) return
  if (reported.size > 200) reported.clear()
  reported.set(key, now)
  try {
    const g = google(env)
    const msg = error instanceof Error ? `${error.message}\n${(error as { body?: string }).body || ''}` : String(error)
    const lines = [`Where: ${where}`, `When: ${new Date().toISOString()}`, '', msg, '', JSON.stringify(detail, null, 2)].join('\n')
    await g.send(raw({
      to: notifyEmail(env), from: notifyEmail(env), fromName: 'Twinbyte booking page',
      subject: `[booking page] something failed: ${where}`,
      text: lines, html: `<pre>${lines.replace(/[&<]/g, (c) => (c === '&' ? '&amp;' : '&lt;'))}</pre>`,
    }))
  } catch {
    // the mailbox is what failed; nothing left to tell
  }
}
