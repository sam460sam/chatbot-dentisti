/*
 * POST /api/book — the whole booking, in order:
 *   1. the request is a person, with valid fields and consent
 *   2. the slot is one we actually offer (hours, notice, window)
 *   3. it is still free right now
 *   4. this email has no other upcoming call (one at a time)
 *   5. create the event: Meet link, Google's own invitation to the visitor
 *   6. two people can pass step 3 in the same second: if this created a
 *      second booking in the slot, the later one is undone
 *   7. our mail to the visitor, in their language, and the notification to us
 */
import { rules, notifyEmail, CALL_MINUTES } from '../_lib/config.ts'
import { candidateSlots } from '../_lib/slots.ts'
import { google, json, readJson, looksHuman, asLang, asZone, text, reportFailure } from '../_lib/http.ts'
import { isAddress } from '../_lib/mail.ts'
import { meetLink } from '../_lib/google.ts'
import { visitorConfirmation, ownerBooking, callTitle, type Booking } from '../_lib/emails.ts'
import { waLink, type Ctx } from '../_lib/ctx.ts'

export const onRequestPost = async ({ request, env, waitUntil }: Ctx) => {
  const body = await readJson(request)
  if (!body) return json({ error: 'bad_request' }, 400)

  const b: Booking = {
    name: text(body.name, 80),
    email: text(body.email, 254).toLowerCase(),
    phone: text(body.phone, 40),
    business: text(body.business, 120),
    message: text(body.message, 1500, true),
    lang: asLang(body.lang),
    zone: asZone(body.zone),
    start: Date.parse(String(body.start || '')),
    end: 0,
  }
  if (!b.name || !isAddress(b.email) || !b.phone || !b.business) return json({ error: 'invalid' }, 422)
  if (!/^[+()\d\s.-]{6,40}$/.test(b.phone)) return json({ error: 'invalid_phone' }, 422)
  if (body.consent !== true) return json({ error: 'consent' }, 422)
  if (!(await looksHuman(env, body, request.headers.get('cf-connecting-ip')))) return json({ error: 'bot' }, 403)

  const r = rules(env)
  const now = Date.now()
  if (!Number.isFinite(b.start) || !candidateSlots(r, now).includes(b.start)) return json({ error: 'slot_invalid' }, 409)
  b.end = b.start + CALL_MINUTES * 60000
  const blockEnd = b.start + r.blockMinutes * 60000

  const g = google(env)
  try {
    const busy = await g.busy(b.start, blockEnd)
    if (busy.length) return json({ error: 'slot_taken' }, 409)

    const mine = await g.list(now, now + (r.days + 1) * 86400000, `tbEmail=${b.email}`)
    if (mine.length) return json({ error: 'already_booked', start: mine[0].start.dateTime }, 409)

    const lines = [
      `Name: ${b.name}`, `Business: ${b.business}`, `Phone: ${b.phone}`, `Email: ${b.email}`,
      `Language: ${b.lang.toUpperCase()}`, `Time zone: ${b.zone}`, '', b.message || '(no message)',
    ]
    let ev = await g.insert({
      /* the visitor gets this event as their invitation, so it speaks their language */
      summary: `${callTitle(b.lang)} — ${b.name}${b.business ? ` (${b.business})` : ''}`,
      description: lines.join('\n'),
      start: b.start, end: b.end, zone: r.zone, attendee: b.email,
      privateProps: { tbBooking: '1', tbEmail: b.email, tbLang: b.lang },
    })

    const clash = await g.list(b.start, blockEnd, 'tbBooking=1')
    if (clash.length > 1) {
      const first = clash.slice().sort((x, y) => String(x.created).localeCompare(String(y.created)) || x.id.localeCompare(y.id))[0]
      if (first.id !== ev.id) {
        await g.remove(ev.id, true)
        return json({ error: 'slot_taken' }, 409)
      }
    }

    /* The Meet link is usually there at once; when Google is still creating
       it, one more read is enough. */
    b.meet = meetLink(ev)
    if (!b.meet) {
      ev = await g.get(ev.id)
      b.meet = meetLink(ev)
    }

    const to = notifyEmail(env)
    waitUntil(
      Promise.all([
        g.send(visitorConfirmation(b, to, waLink(env))),
        g.send(ownerBooking(b, to)),
      ]).catch((e) => reportFailure(env, 'booking mail', e, { email: b.email, start: new Date(b.start).toISOString() })),
    )

    return json({ ok: true, start: new Date(b.start).toISOString(), end: new Date(b.end).toISOString(), meet: b.meet || null })
  } catch (e) {
    waitUntil(reportFailure(env, 'POST /api/book', e, { email: b.email, start: new Date(b.start).toISOString() }))
    return json({ error: 'unavailable' }, 503)
  }
}
