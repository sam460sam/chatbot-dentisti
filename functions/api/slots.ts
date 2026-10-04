/*
 * GET /api/slots → { zone, slots: ["2026-10-06T08:00:00.000Z", …] }
 * The free starts in the next 14 days, as UTC instants. The page turns them
 * into days and times in the visitor's own zone.
 */
import { rules } from '../_lib/config.ts'
import { freeSlots } from '../_lib/slots.ts'
import { google, json, reportFailure } from '../_lib/http.ts'
import type { Ctx } from '../_lib/ctx.ts'

export const onRequestGet = async ({ env }: Ctx) => {
  try {
    const r = rules(env)
    const now = Date.now()
    const busy = await google(env).busy(now, now + (r.days + 1) * 86400000)
    const slots = freeSlots(r, now, busy).map((s) => new Date(s).toISOString())
    return new Response(JSON.stringify({ zone: r.zone, minutes: 15, slots }), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        /* a few seconds of edge cache absorbs a burst of visitors from one post,
           and is short enough that a slot taken a minute ago is not offered */
        'cache-control': 'public, max-age=15',
        'x-content-type-options': 'nosniff',
      },
    })
  } catch (e) {
    await reportFailure(env, 'GET /api/slots', e)
    return json({ error: 'unavailable' }, 503)
  }
}
