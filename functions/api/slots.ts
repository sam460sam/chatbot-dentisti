/*
 * GET /api/slots → { zone, slots: ["2026-10-06T08:00:00.000Z", …] }
 * The free starts in the next 14 days, as UTC instants. The page turns them
 * into days and times in the visitor's own zone.
 */
import { rules, isConfigured } from '../_lib/config.ts'
import { freeSlots } from '../_lib/slots.ts'
import { google, json, reportFailure } from '../_lib/http.ts'
import type { Ctx } from '../_lib/ctx.ts'

export const onRequestGet = async ({ env, waitUntil }: Ctx) => {
  /* The page shows its calm "write to us" card for this; nobody is mailed. */
  if (!isConfigured(env)) return json({ error: 'not_configured' }, 503)
  try {
    const r = rules(env)
    const now = Date.now()
    const busy = await google(env).busy(now, now + (r.days + 1) * 86400000)
    const slots = freeSlots(r, now, busy).map((s) => new Date(s).toISOString())
    return new Response(JSON.stringify({ zone: r.zone, minutes: 15, slots }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        /* never reused: after "someone just took this time" the page asks
           again and must not get the old list back from the browser cache */
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    })
  } catch (e) {
    /* reported after the answer: the page must not wait for a mail */
    waitUntil(reportFailure(env, 'GET /api/slots', e))
    return json({ error: 'unavailable' }, 503)
  }
}
