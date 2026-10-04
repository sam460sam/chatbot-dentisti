/*
 * One RFC 5322 message, built by hand because the Gmail API wants it raw.
 *
 * Everything a visitor typed reaches a header only through `address()` —
 * which accepts exactly one plain address — or through an RFC 2047 encoded
 * word, which cannot carry a line break. That is what stops "header
 * injection": a name like "x\r\nBcc: everyone@…" never becomes a header.
 */

function b64(bytes: Uint8Array): string {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

const utf8 = (s: string) => new TextEncoder().encode(s)

/** =?UTF-8?B?…?= for any header text that is not plain ASCII. */
function word(s: string): string {
  const clean = s.replace(/[\r\n]+/g, ' ').trim()
  return /^[\x20-\x7e]*$/.test(clean) ? clean : `=?UTF-8?B?${b64(utf8(clean))}?=`
}

const ADDRESS = /^[^\s@<>(),;:"\\[\]]+@[^\s@<>(),;:"\\[\]]+\.[a-z]{2,}$/i

export function isAddress(s: string): boolean {
  return s.length <= 254 && ADDRESS.test(s)
}

/* A display name is always encoded, never written as plain text: a name
   like "Eve Bcc: all@x.com" contains ":" and "@", which plain header syntax
   reads as a group of recipients. An encoded word is just a name. */
function address(email: string, name?: string): string {
  if (!isAddress(email)) throw new Error('not an email address')
  const clean = (name || '').replace(/[\r\n]+/g, ' ').trim()
  return clean ? `=?UTF-8?B?${b64(utf8(clean))}?= <${email}>` : email
}

/** base64 body wrapped at 76 columns */
function body(s: string): string {
  return b64(utf8(s)).replace(/.{76}/g, '$&\r\n')
}

export interface Message {
  to: string
  toName?: string
  fromName: string
  from: string
  replyTo?: string
  subject: string
  text: string
  html: string
}

/** The message, base64url-encoded, ready for gmail users.messages.send. */
export function raw(m: Message): string {
  const boundary = 'tb_' + crypto.randomUUID().replace(/-/g, '')
  const lines = [
    `From: ${address(m.from, m.fromName)}`,
    `To: ${address(m.to, m.toName)}`,
    ...(m.replyTo ? [`Reply-To: ${address(m.replyTo)}`] : []),
    `Subject: ${word(m.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body(m.text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body(m.html),
    `--${boundary}--`,
    '',
  ]
  return b64(utf8(lines.join('\r\n'))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
