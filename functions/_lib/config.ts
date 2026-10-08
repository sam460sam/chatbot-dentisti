import { parseHours, type SlotRules } from './slots.ts'

export interface Env {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REFRESH_TOKEN?: string
  /** "primary" means the calendar of the account that owns the refresh token */
  CALENDAR_ID?: string
  /** where booking and request notifications go */
  NOTIFY_EMAIL?: string
  /** "mon-fri 10:00-13:00,14:00-18:00; sat 10:00-12:00", in BOOKING_ZONE */
  BOOKING_HOURS?: string
  BOOKING_ZONE?: string
  TURNSTILE_SECRET?: string
  /** "1" = no Google at all: fake calendar and mailbox, for local tests */
  GOOGLE_MOCK?: string
}

/*
 * Placeholder hours until the owners choose theirs. Changing them is a
 * dashboard edit (BOOKING_HOURS) plus a redeploy, never a code change.
 */
export const DEFAULT_HOURS = 'mon-fri 18:00-21:00; sat 09:00-13:00'

export const CALL_MINUTES = 15

export function rules(env: Env): SlotRules {
  return {
    zone: env.BOOKING_ZONE || 'Europe/Rome',
    hours: parseHours(env.BOOKING_HOURS || DEFAULT_HOURS),
    stepMinutes: 30,
    /* the call is 15 minutes; the slot keeps 30 free so calls never run
       back to back */
    blockMinutes: 30,
    noticeMinutes: 4 * 60,
    days: 14,
  }
}

export const notifyEmail = (env: Env) => env.NOTIFY_EMAIL || 'twinbyteai@gmail.com'
export const calendarId = (env: Env) => env.CALENDAR_ID || 'primary'
export const isMock = (env: Env) => env.GOOGLE_MOCK === '1'
/** Without all three Google secrets nothing can be booked or sent. That is
    the site before its one-time setup: a state, not a failure. */
export const isConfigured = (env: Env) =>
  isMock(env) || !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN)
