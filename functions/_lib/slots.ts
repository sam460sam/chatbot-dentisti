/*
 * Which call slots exist. Pure functions, no I/O, so they can be tested on
 * their own — this is the part that has to survive the clock change.
 *
 * Opening hours are written in WALL-CLOCK time in one zone (Europe/Rome).
 * Every slot is built as "this date, this hour, in Rome" and converted to a
 * UTC instant once, through Intl. That is what makes the October and March
 * switches harmless: 10:00 in Rome is 08:00Z in summer and 09:00Z in winter,
 * and nothing here ever adds hours to an instant to get to the next day.
 */

export interface Window {
  /** minutes after midnight, wall clock */
  from: number
  to: number
}

/** 0 = Sunday … 6 = Saturday, as Date#getUTCDay */
export type WeekHours = Record<number, Window[]>

export interface SlotRules {
  zone: string
  hours: WeekHours
  /** distance between two slot starts */
  stepMinutes: number
  /** how much of the calendar a booking blocks, buffer included */
  blockMinutes: number
  noticeMinutes: number
  days: number
}

const DAY_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function minutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m) throw new Error(`bad time "${hhmm}"`)
  const h = Number(m[1]), mi = Number(m[2])
  if (h > 24 || mi > 59 || (h === 24 && mi > 0)) throw new Error(`bad time "${hhmm}"`)
  return h * 60 + mi
}

/**
 * "mon-fri 10:00-13:00,14:00-18:00; sat 10:00-12:00"
 * Days are a single name or a range; ranges may wrap (fri-mon). Several
 * groups are separated by ";". Anything malformed throws, so a typo in the
 * dashboard shows up as an error instead of silently offering no slots.
 */
export function parseHours(spec: string): WeekHours {
  const out: WeekHours = {}
  for (const group of spec.split(';').map((g) => g.trim()).filter(Boolean)) {
    const [dayPart, ...rest] = group.split(/\s+/)
    const windows = rest.join(' ')
    if (!windows) throw new Error(`no hours in "${group}"`)
    const days: number[] = []
    for (const piece of dayPart.toLowerCase().split(',')) {
      const [a, b] = piece.split('-')
      const ia = DAY_NAMES.indexOf(a)
      const ib = b === undefined ? ia : DAY_NAMES.indexOf(b)
      if (ia < 0 || ib < 0) throw new Error(`bad day "${piece}"`)
      for (let d = ia; ; d = (d + 1) % 7) {
        days.push(d)
        if (d === ib) break
      }
    }
    const list: Window[] = windows.split(',').map((w) => {
      const [f, t] = w.split('-')
      if (t === undefined) throw new Error(`bad window "${w}"`)
      const from = minutes(f), to = minutes(t)
      if (to <= from) throw new Error(`window ends before it starts: "${w}"`)
      return { from, to }
    })
    for (const d of days) out[d] = [...(out[d] || []), ...list]
  }
  return out
}

/** Calendar date (y, m, d) and weekday of an instant, as seen in `zone`. */
export function zonedParts(instant: number, zone: string) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short',
  })
  const p: Record<string, string> = {}
  for (const x of f.formatToParts(new Date(instant))) p[x.type] = x.value
  return {
    y: Number(p.year), m: Number(p.month), d: Number(p.day),
    h: Number(p.hour), mi: Number(p.minute), s: Number(p.second),
    weekday: DAY_NAMES.indexOf(p.weekday.toLowerCase().slice(0, 3)),
  }
}

/** UTC offset of `zone` at `instant`, in minutes (Rome: +60 or +120). */
function offsetAt(instant: number, zone: string): number {
  const p = zonedParts(instant, zone)
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s)
  return Math.round((asUtc - Math.floor(instant / 1000) * 1000) / 60000)
}

/**
 * The instant at which the wall clock in `zone` shows y-m-d hh:mm.
 * Two passes, because the offset to use is the one in force at the RESULT,
 * which is only known after a first guess.
 */
export function wallClockToUtc(y: number, m: number, d: number, minuteOfDay: number, zone: string): number {
  const naive = Date.UTC(y, m - 1, d, 0, minuteOfDay)
  let guess = naive - offsetAt(naive, zone) * 60000
  guess = naive - offsetAt(guess, zone) * 60000
  return guess
}

export interface Busy {
  start: number
  end: number
}

/** Every slot start (UTC ms) inside the window, before removing busy time. */
export function candidateSlots(rules: SlotRules, now: number): number[] {
  const earliest = now + rules.noticeMinutes * 60000
  const latest = now + rules.days * 86400000
  const today = zonedParts(now, rules.zone)
  const out: number[] = []
  /* Walk calendar dates, not 24-hour steps: the 25-hour day in October would
     otherwise make one step land on the same date twice. */
  for (let i = 0; i <= rules.days; i++) {
    const date = new Date(Date.UTC(today.y, today.m - 1, today.d + i))
    const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate()
    const windows = rules.hours[date.getUTCDay()] || []
    for (const w of windows) {
      for (let t = w.from; t + rules.blockMinutes <= w.to; t += rules.stepMinutes) {
        const start = wallClockToUtc(y, m, d, t, rules.zone)
        if (start >= earliest && start < latest) out.push(start)
      }
    }
  }
  /* On the March switch 02:00–03:00 does not exist on the wall clock: hours
     that cover it would give 02:00 and 03:00 the same instant, twice. */
  return [...new Set(out)].sort((a, b) => a - b)
}

/** Candidate slots minus anything that overlaps busy time. */
export function freeSlots(rules: SlotRules, now: number, busy: Busy[]): number[] {
  const block = rules.blockMinutes * 60000
  return candidateSlots(rules, now).filter(
    (s) => !busy.some((b) => s < b.end && s + block > b.start),
  )
}
