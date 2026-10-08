/*
 * The two mails a booking sends, and the one a request sends.
 * The visitor's mail is in the language they booked in; ours is in English,
 * which both of us read.
 */
import { escapeHtml as h, raw } from './mail.ts'
import type { Lang } from './http.ts'

const LOCALE: Record<Lang, string> = { en: 'en-GB', nl: 'nl-NL', it: 'it-IT' }

export function when(start: number, lang: Lang, zone: string): { date: string; time: string } {
  const loc = LOCALE[lang]
  return {
    date: new Intl.DateTimeFormat(loc, { timeZone: zone, weekday: 'long', day: 'numeric', month: 'long' }).format(start),
    time: new Intl.DateTimeFormat(loc, { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(start),
  }
}

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** "Add to Google Calendar", for people whose calendar did not pick the invite up. */
export function addToGoogle(start: number, end: number, title: string, details: string): string {
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(start)}/${stamp(end)}`, details })
  return `https://calendar.google.com/calendar/render?${q}`
}

const TITLE = { en: 'Twinbyte — discovery call', nl: 'Twinbyte — kennismakingsgesprek', it: 'Twinbyte — chiamata conoscitiva' } as const
export const callTitle = (lang: Lang) => TITLE[lang]

const COPY = {
  en: {
    subject: (d: string, t: string) => `Your call with Twinbyte — ${d}, ${t}`,
    hello: (n: string) => `Hi ${n},`,
    booked: 'your 15-minute call with Twinbyte is booked.',
    whenL: 'When', whereL: 'Where', tzNote: (z: string) => `Time shown in ${z}.`,
    meet: 'Google Meet — join here',
    invite: 'Google Calendar will also send you an invitation with the same link.',
    add: 'Add it to Google Calendar',
    agenda: 'In 15 minutes we get to know each other, you tell us about your business and what you need, we show you how we work, and we agree on next steps. No preparation needed.',
    change: 'Need another time? Just reply to this email, or message us on WhatsApp.',
    sign: 'The Twinbyte team',
  },
  nl: {
    subject: (d: string, t: string) => `Uw gesprek met Twinbyte — ${d}, ${t}`,
    hello: (n: string) => `Hallo ${n},`,
    booked: 'uw gesprek van 15 minuten met Twinbyte staat gepland.',
    whenL: 'Wanneer', whereL: 'Waar', tzNote: (z: string) => `Tijd in ${z}.`,
    meet: 'Google Meet — hier deelnemen',
    invite: 'U krijgt van Google Agenda ook een uitnodiging met dezelfde link.',
    add: 'Zet het in Google Agenda',
    agenda: 'In 15 minuten maken we kennis, vertelt u over uw bedrijf en wat u nodig heeft, laten wij zien hoe we werken en spreken we de volgende stap af. U hoeft niets voor te bereiden.',
    change: 'Komt het toch niet uit? Beantwoord gewoon deze e-mail, of stuur ons een WhatsApp-bericht.',
    sign: 'Het Twinbyte-team',
  },
  it: {
    subject: (d: string, t: string) => `La tua chiamata con Twinbyte — ${d}, ${t}`,
    hello: (n: string) => `Ciao ${n},`,
    booked: 'la tua chiamata di 15 minuti con Twinbyte è prenotata.',
    whenL: 'Quando', whereL: 'Dove', tzNote: (z: string) => `Orario nel fuso ${z}.`,
    meet: 'Google Meet — entra qui',
    invite: 'Riceverai anche un invito da Google Calendar con lo stesso link.',
    add: 'Aggiungila a Google Calendar',
    agenda: 'In 15 minuti ci conosciamo, ci racconti la tua attività e cosa ti serve, ti mostriamo come lavoriamo e decidiamo insieme i prossimi passi. Non serve preparare niente.',
    change: 'Ti serve un altro orario? Rispondi a questa email, oppure scrivici su WhatsApp.',
    sign: 'Il team Twinbyte',
  },
} as const

const shell = (inner: string) => `<!doctype html><html><body style="margin:0;background:#F5F2EC;font-family:Arial,Helvetica,sans-serif;color:#17160F">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #D9D4C8">
<tr><td style="background:#17160F;padding:16px 24px;color:#F5F2EC;font-weight:bold;font-size:18px;letter-spacing:-0.02em">twinbyte</td></tr>
<tr><td style="padding:24px;font-size:15px;line-height:23px">${inner}</td></tr>
</table></td></tr></table></body></html>`

export interface Booking {
  name: string
  email: string
  phone: string
  business: string
  message: string
  lang: Lang
  zone: string
  start: number
  end: number
  meet?: string
}

export function visitorConfirmation(b: Booking, from: string, wa: string): string {
  const c = COPY[b.lang]
  const { date, time } = when(b.start, b.lang, b.zone)
  const add = addToGoogle(b.start, b.end, TITLE[b.lang], b.meet || '')
  const meetLine = b.meet ? `${c.meet}: ${b.meet}` : ''
  const text = [
    c.hello(b.name), '', c.booked, '',
    `${c.whenL}: ${date}, ${time}`, c.tzNote(b.zone),
    b.meet ? `${c.whereL}: ${meetLine}` : '', '',
    c.invite, `${c.add}: ${add}`, '', c.agenda, '', c.change, `WhatsApp: ${wa}`, '', c.sign,
  ].join('\n')
  const html = shell(`
<p style="margin:0 0 12px">${h(c.hello(b.name))}</p>
<p style="margin:0 0 20px">${h(c.booked)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:2px solid #0E5266;margin:0 0 20px">
<tr><td style="padding:12px 0 2px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#66625A">${h(c.whenL)}</td></tr>
<tr><td style="font-size:20px;font-weight:bold;padding:0 0 2px">${h(date)}, ${h(time)}</td></tr>
<tr><td style="font-size:13px;color:#66625A;padding:0 0 12px">${h(c.tzNote(b.zone))}</td></tr>
</table>
${b.meet ? `<p style="margin:0 0 20px"><a href="${h(b.meet)}" style="display:inline-block;background:#0E5266;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px 10px 10px 0">${h(c.meet)}</a></p>` : ''}
<p style="margin:0 0 8px;color:#4A4740">${h(c.invite)}</p>
<p style="margin:0 0 20px"><a href="${h(add)}" style="color:#0E5266">${h(c.add)}</a></p>
<p style="margin:0 0 20px;color:#4A4740">${h(c.agenda)}</p>
<p style="margin:0 0 4px;color:#4A4740">${h(c.change)}</p>
<p style="margin:0 0 20px"><a href="${h(wa)}" style="color:#A14531">WhatsApp</a></p>
<p style="margin:0;font-weight:bold">${h(c.sign)}</p>`)
  return raw({ to: b.email, toName: b.name, from, fromName: 'Twinbyte', subject: c.subject(date, time), text, html })
}

function rows(pairs: [string, string][]) {
  const text = pairs.map(([k, v]) => `${k}: ${v || '—'}`).join('\n')
  const html = `<table role="presentation" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">${pairs
    .map(([k, v]) => `<tr><td style="border-bottom:1px solid #EAE5DA;color:#66625A;width:34%;vertical-align:top">${h(k)}</td><td style="border-bottom:1px solid #EAE5DA;white-space:pre-wrap">${h(v || '—')}</td></tr>`)
    .join('')}</table>`
  return { text, html }
}

export function ownerBooking(b: Booking, to: string): string {
  const rome = when(b.start, 'en', 'Europe/Rome')
  const theirs = when(b.start, 'en', b.zone)
  const { text, html } = rows([
    ['When (Rome)', `${rome.date}, ${rome.time}`],
    ['When (their time)', `${theirs.date}, ${theirs.time} — ${b.zone}`],
    ['Name', b.name], ['Email', b.email], ['Phone', b.phone], ['Business', b.business],
    ['Message', b.message], ['Language', b.lang.toUpperCase()], ['Google Meet', b.meet || '(not created)'],
  ])
  return raw({
    to, from: to, fromName: 'Twinbyte booking page', replyTo: b.email,
    subject: `New call: ${b.name}${b.business ? ` (${b.business})` : ''} — ${rome.date} ${rome.time}`,
    text: `New discovery call booked.\n\n${text}\n\nReply to this mail to write to them.`,
    html: shell(`<p style="margin:0 0 16px;font-weight:bold">New discovery call booked.</p>${html}<p style="margin:16px 0 0;color:#66625A">Reply to this mail to write to them.</p>`),
  })
}

export interface Req {
  name: string
  email: string
  phone: string
  business: string
  message: string
  lang: Lang
}

export function ownerRequest(r: Req, to: string): string {
  const { text, html } = rows([
    ['Name', r.name], ['Email', r.email], ['Phone', r.phone], ['Business', r.business],
    ['Message', r.message], ['Language', r.lang.toUpperCase()],
  ])
  return raw({
    to, from: to, fromName: 'Twinbyte booking page', replyTo: r.email,
    subject: `New request: ${r.name}${r.business ? ` (${r.business})` : ''}`,
    text: `New request from the website.\n\n${text}\n\nReply to this mail to write to them.`,
    html: shell(`<p style="margin:0 0 16px;font-weight:bold">New request from the website.</p>${html}<p style="margin:16px 0 0;color:#66625A">Reply to this mail to write to them.</p>`),
  })
}
