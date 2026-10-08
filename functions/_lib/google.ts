/*
 * The only three things we need from Google, over plain fetch:
 *   - an access token, from the owner's refresh token (OAuth, not a service
 *     account: a service account cannot invite a guest or create a Meet link
 *     on a personal @gmail.com calendar)
 *   - the calendar: free/busy, create an event with a Meet link, list, delete
 *   - Gmail: send one message
 */
import type { Env } from './config.ts'
import { calendarId } from './config.ts'
import type { Busy } from './slots.ts'

/* Fields written out, not as constructor parameter properties: the tests
   run on Node's type stripping, which cannot compile those. */
export class GoogleError extends Error {
  status: number
  body: string
  constructor(message: string, status: number, body: string) {
    super(message)
    this.status = status
    this.body = body
  }
}

export interface CalendarEvent {
  id: string
  created?: string
  hangoutLink?: string
  htmlLink?: string
  start: { dateTime: string }
  end: { dateTime: string }
  conferenceData?: { entryPoints?: { entryPointType: string; uri: string }[]; createRequest?: { status?: { statusCode: string } } }
  extendedProperties?: { private?: Record<string, string> }
}

export interface NewEvent {
  summary: string
  description: string
  start: number
  end: number
  zone: string
  attendee: string
  privateProps: Record<string, string>
}

export interface Google {
  busy(from: number, to: number): Promise<Busy[]>
  insert(ev: NewEvent): Promise<CalendarEvent>
  get(id: string): Promise<CalendarEvent>
  list(from: number, to: number, privateProp: string): Promise<CalendarEvent[]>
  remove(id: string, notify: boolean): Promise<void>
  send(raw: string): Promise<void>
  ping(): Promise<void>
}

const API = 'https://www.googleapis.com/calendar/v3'

async function ok(res: Response, what: string): Promise<Response> {
  if (res.ok) return res
  const body = await res.text().catch(() => '')
  throw new GoogleError(`${what} failed: ${res.status}`, res.status, body.slice(0, 600))
}

/** Token cached per isolate; Google gives an hour, we keep it 50 minutes. */
let cached: { token: string; until: number } | null = null

async function accessToken(env: Env): Promise<string> {
  if (cached && cached.until > Date.now()) return cached.token
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) {
    throw new GoogleError('Google credentials are not configured', 500, '')
  }
  const res = await ok(
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        refresh_token: env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    }),
    'token refresh',
  )
  const json = (await res.json()) as { access_token: string; expires_in: number }
  cached = { token: json.access_token, until: Date.now() + Math.min(json.expires_in, 3000) * 1000 }
  return json.access_token
}

export function realGoogle(env: Env): Google {
  const cal = encodeURIComponent(calendarId(env))
  const call = async (url: string, init: RequestInit, what: string) => {
    const token = await accessToken(env)
    return ok(
      await fetch(url, {
        ...init,
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(init.headers || {}) },
      }),
      what,
    )
  }

  return {
    async busy(from, to) {
      const res = await call(`${API}/freeBusy`, {
        method: 'POST',
        body: JSON.stringify({
          timeMin: new Date(from).toISOString(),
          timeMax: new Date(to).toISOString(),
          items: [{ id: calendarId(env) }],
        }),
      }, 'freebusy')
      const json = (await res.json()) as {
        calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }>
      }
      const entry = Object.values(json.calendars)[0]
      /* freebusy fails per calendar inside a 200 response. Treating that as
         "nothing busy" would offer every slot, so it is an error. */
      if (!entry || entry.errors?.length) {
        throw new GoogleError(`freebusy: ${entry?.errors?.map((e) => e.reason).join(',') || 'no calendar'}`, 502, '')
      }
      return (entry.busy || []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }))
    },

    async insert(ev) {
      const res = await call(`${API}/calendars/${cal}/events?conferenceDataVersion=1&sendUpdates=all`, {
        method: 'POST',
        body: JSON.stringify({
          summary: ev.summary,
          description: ev.description,
          start: { dateTime: new Date(ev.start).toISOString(), timeZone: ev.zone },
          end: { dateTime: new Date(ev.end).toISOString(), timeZone: ev.zone },
          attendees: [{ email: ev.attendee }],
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          extendedProperties: { private: ev.privateProps },
          reminders: { useDefault: true },
          /* "busy" so the slot disappears for the next visitor */
          transparency: 'opaque',
        }),
      }, 'events.insert')
      return (await res.json()) as CalendarEvent
    },

    async get(id) {
      const res = await call(`${API}/calendars/${cal}/events/${encodeURIComponent(id)}`, { method: 'GET' }, 'events.get')
      return (await res.json()) as CalendarEvent
    },

    async list(from, to, privateProp) {
      const q = new URLSearchParams({
        timeMin: new Date(from).toISOString(),
        timeMax: new Date(to).toISOString(),
        singleEvents: 'true',
        privateExtendedProperty: privateProp,
        maxResults: '50',
      })
      const res = await call(`${API}/calendars/${cal}/events?${q}`, { method: 'GET' }, 'events.list')
      const json = (await res.json()) as { items?: CalendarEvent[] }
      return json.items || []
    },

    async remove(id, notify) {
      await call(
        `${API}/calendars/${cal}/events/${encodeURIComponent(id)}?sendUpdates=${notify ? 'all' : 'none'}`,
        { method: 'DELETE' },
        'events.delete',
      )
    },

    async send(raw) {
      await call('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        body: JSON.stringify({ raw }),
      }, 'gmail.send')
    },

    async ping() {
      cached = null
      await accessToken(env)
    },
  }
}

/** Meet link of an event, wherever Google put it. */
export function meetLink(ev: CalendarEvent): string | undefined {
  return ev.hangoutLink || ev.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri
}
