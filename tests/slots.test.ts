// Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseHours, candidateSlots, freeSlots, wallClockToUtc, type SlotRules } from '../functions/_lib/slots.ts'

const ROME = 'Europe/Rome'
const rules = (over: Partial<SlotRules> = {}): SlotRules => ({
  zone: ROME, hours: parseHours('mon-fri 10:00-12:00'),
  stepMinutes: 30, blockMinutes: 30, noticeMinutes: 240, days: 14, ...over,
})
const iso = (ms: number) => new Date(ms).toISOString()

test('parseHours: ranges, lists, several groups, wrap-around', () => {
  const h = parseHours('mon-fri 10:00-13:00,14:00-18:00; sat 10:00-12:00')
  assert.deepEqual(h[1], [{ from: 600, to: 780 }, { from: 840, to: 1080 }])
  assert.deepEqual(h[6], [{ from: 600, to: 720 }])
  assert.equal(h[0], undefined)
  assert.deepEqual(Object.keys(parseHours('fri-mon 09:00-10:00')).sort(), ['0', '1', '5', '6'])
})

test('parseHours: a typo is an error, not an empty week', () => {
  assert.throws(() => parseHours('mon-fry 10:00-12:00'))
  assert.throws(() => parseHours('mon 12:00-10:00'))
  assert.throws(() => parseHours('mon 10-12'))
  assert.throws(() => parseHours('mon'))
})

test('wallClockToUtc: Rome is +2 in summer and +1 in winter', () => {
  assert.equal(iso(wallClockToUtc(2026, 10, 23, 600, ROME)), '2026-10-23T08:00:00.000Z')
  assert.equal(iso(wallClockToUtc(2026, 10, 26, 600, ROME)), '2026-10-26T09:00:00.000Z')
  assert.equal(iso(wallClockToUtc(2027, 3, 29, 600, ROME)), '2027-03-29T08:00:00.000Z')
})

test('October switch: 10:00 Rome stays 10:00 across the 25-hour day', () => {
  // Friday 23 Oct 2026, 06:00Z. Window reaches over Sun 25 Oct (DST ends).
  const now = Date.UTC(2026, 9, 23, 6, 0)
  const slots = candidateSlots(rules(), now)
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: ROME, weekday: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  const shown = slots.map((s) => fmt.format(s))
  // every slot is 10:00, 10:30, 11:00 or 11:30 Rome time, before and after the switch
  for (const s of shown) assert.match(s, / (10|11):(00|30)$/, s)
  // Mon 26 Oct has four slots, at 09:00Z (winter), not 08:00Z
  const mon = slots.filter((s) => iso(s).startsWith('2026-10-26'))
  assert.deepEqual(mon.map(iso), ['09:00', '09:30', '10:00', '10:30'].map((t) => `2026-10-26T${t}:00.000Z`))
  // no weekend slots
  assert.ok(!shown.some((s) => /^(Sat|Sun)/.test(s)))
})

test('March switch: the 23-hour day does not shift the hours either', () => {
  const now = Date.UTC(2027, 2, 26, 6, 0) // Fri 26 Mar 2027, DST starts Sun 28 Mar
  const mon = candidateSlots(rules(), now).filter((s) => iso(s).startsWith('2027-03-29'))
  assert.deepEqual(mon.map(iso)[0], '2027-03-29T08:00:00.000Z')
})

test('four hours of notice: nothing that starts sooner', () => {
  const now = Date.UTC(2026, 10, 2, 7, 15) // Mon 2 Nov 2026 08:15 Rome
  const first = candidateSlots(rules(), now)[0]
  assert.ok(first >= now + 4 * 3600000)
  // 08:15 + 4h = 12:15 Rome, after the last morning slot: first slot is tomorrow 10:00
  assert.equal(iso(first), '2026-11-03T09:00:00.000Z')
})

test('fourteen days and no further', () => {
  const now = Date.UTC(2026, 10, 2, 5, 0)
  const slots = candidateSlots(rules(), now)
  assert.ok(slots.every((s) => s < now + 14 * 86400000))
  assert.ok(slots.length > 0)
})

test('busy time removes every slot it touches, buffer included', () => {
  const now = Date.UTC(2026, 10, 2, 5, 0)
  const busyStart = Date.UTC(2026, 10, 3, 9, 15) // 10:15-10:45 Rome
  const free = freeSlots(rules(), now, [{ start: busyStart, end: busyStart + 30 * 60000 }])
  const tue = free.filter((s) => iso(s).startsWith('2026-11-03')).map(iso)
  // 10:00 (block 10:00-10:30 overlaps), 10:30 overlaps; 11:00 and 11:30 stay
  assert.deepEqual(tue, ['2026-11-03T10:00:00.000Z', '2026-11-03T10:30:00.000Z'])
})

test('a slot needs the whole block to fit before closing time', () => {
  const r = rules({ hours: parseHours('mon-fri 10:00-11:15') })
  const now = Date.UTC(2026, 10, 2, 5, 0)
  const mon = candidateSlots(r, now).filter((s) => iso(s).startsWith('2026-11-02')).map(iso)
  assert.deepEqual(mon, ['2026-11-02T09:00:00.000Z', '2026-11-02T09:30:00.000Z'])
})
