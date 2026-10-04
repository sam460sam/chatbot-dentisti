/*
 * A pretend Google, for `wrangler pages dev` with GOOGLE_MOCK=1. It keeps
 * events and sent mail in memory for the life of the isolate and prints the
 * mail to the console, so the whole booking can be clicked through locally
 * without touching a real calendar.
 */
import type { CalendarEvent, Google, NewEvent } from './google.ts'

interface Stored extends CalendarEvent {
  startMs: number
  endMs: number
}

const events: Stored[] = []
export const outbox: string[] = []

/* One fixed busy hour tomorrow, so the mock shows a gap like a real week. */
function seed() {
  if (events.length) return
  const t = new Date()
  t.setUTCDate(t.getUTCDate() + 1)
  t.setUTCHours(9, 0, 0, 0)
  const s = t.getTime()
  events.push({ id: 'seed', startMs: s, endMs: s + 3600000, start: { dateTime: t.toISOString() }, end: { dateTime: new Date(s + 3600000).toISOString() } })
}

export function mockGoogle(): Google {
  seed()
  return {
    async busy(from, to) {
      return events.filter((e) => e.startMs < to && e.endMs > from).map((e) => ({ start: e.startMs, end: e.endMs }))
    },
    async insert(ev: NewEvent) {
      const id = 'mock' + Math.random().toString(36).slice(2, 10)
      const stored: Stored = {
        id, startMs: ev.start, endMs: ev.end, created: new Date().toISOString(),
        start: { dateTime: new Date(ev.start).toISOString() },
        end: { dateTime: new Date(ev.end).toISOString() },
        hangoutLink: `https://meet.google.com/mock-${id.slice(4, 7)}-${id.slice(7, 11)}`,
        extendedProperties: { private: ev.privateProps },
      }
      events.push(stored)
      console.log(`[mock] event ${id} ${stored.start.dateTime} for ${ev.attendee}`)
      return stored
    },
    async get(id) {
      const e = events.find((x) => x.id === id)
      if (!e) throw new Error('not found')
      return e
    },
    async list(from, to, prop) {
      const [k, v] = prop.split('=')
      return events.filter((e) => e.startMs < to && e.endMs > from && e.extendedProperties?.private?.[k] === v)
    },
    async remove(id) {
      const i = events.findIndex((e) => e.id === id)
      if (i >= 0) events.splice(i, 1)
    },
    async send(raw) {
      outbox.push(raw)
      const text = atob(raw.replace(/-/g, '+').replace(/_/g, '/'))
      console.log('[mock] mail\n' + text.split('\r\n\r\n')[0])
    },
    async ping() {},
  }
}
