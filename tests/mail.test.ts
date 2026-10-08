// Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { raw, isAddress } from '../functions/_lib/mail.ts'
import { readJson, reportFailure } from '../functions/_lib/http.ts'
import { outbox } from '../functions/_lib/mock.ts'
import { onRequestPost as postRequest } from '../functions/api/request.ts'

const decode = (r: string) => Buffer.from(r.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')

test('a name with a line break cannot add a header', () => {
  const msg = decode(raw({
    to: 'a@example.com', toName: 'Evil\r\nBcc: everyone@example.com',
    from: 'twinbyteai@gmail.com', fromName: 'Twinbyte',
    subject: 'Hi\r\nBcc: x@example.com', text: 'x', html: 'x',
  }))
  const headers = msg.split('\r\n\r\n')[0]
  assert.ok(!/^Bcc:/im.test(headers), headers)
})

test('only one plain address is accepted', () => {
  assert.ok(isAddress('anna@twinbyteservices.com'))
  for (const bad of ['a@b.com, c@d.com', 'a@b.com\r\nBcc: c@d.com', '<a@b.com>', 'nope', 'a@b', 'a b@c.com']) {
    assert.equal(isAddress(bad), false, bad)
  }
  assert.throws(() => raw({ to: 'a@b.com, c@d.com', from: 'x@y.com', fromName: 'X', subject: 's', text: 't', html: 'h' }))
})

test('non-ASCII subjects and bodies survive (é, ë, €)', () => {
  const msg = decode(raw({ to: 'a@b.com', from: 'x@y.com', fromName: 'Twinbyte', subject: 'Prenotazione confermata — è fatta', text: 'Één € ë', html: '<p>é</p>' }))
  assert.match(msg, /Subject: =\?UTF-8\?B\?/)
  const textPart = msg.split('Content-Transfer-Encoding: base64\r\n\r\n')[1].split('\r\n--')[0]
  assert.equal(Buffer.from(textPart.replace(/\r\n/g, ''), 'base64').toString('utf8'), 'Één € ë')
})

test('a display name with ":" and "@" is encoded, never a group of recipients', () => {
  const msg = decode(raw({ to: 'e@example.com', toName: 'Eve Bcc: all@example.com', from: 'x@y.com', fromName: 'X', subject: 's', text: 't', html: 'h' }))
  const to = msg.split('\r\n').find((l) => l.startsWith('To:'))!
  assert.match(to, /^To: =\?UTF-8\?B\?[A-Za-z0-9+/=]+\?= <e@example\.com>$/)
})

/* ---------------------------------------------------------------- the forms */

const post = (type: string, body = '{"a":1}') =>
  new Request('https://twinbyteservices.com/api/request', { method: 'POST', headers: { 'content-type': type }, body })

test('the forms take JSON only, not text/plain dressed up as JSON', async () => {
  assert.deepEqual(await readJson(post('application/json')), { a: 1 })
  assert.deepEqual(await readJson(post('Application/JSON; charset=utf-8')), { a: 1 })
  for (const t of ['text/plain; a=application/json', 'text/plain', 'application/jsonp', 'multipart/form-data; boundary=application/json']) {
    assert.equal(await readJson(post(t)), null, t)
  }
})

test('a request before the Google setup: "not_configured", and nothing is sent', async () => {
  const real = globalThis.fetch
  let fetched = 0
  globalThis.fetch = (async () => { fetched++; throw new Error('no network in tests') }) as typeof fetch
  try {
    const later: Promise<unknown>[] = []
    const body = JSON.stringify({ name: 'Mario', email: 'mario@example.com', message: 'Ciao', consent: true, elapsed: 5000, lang: 'it' })
    const res = await postRequest({
      request: new Request('https://twinbyteservices.com/api/request', { method: 'POST', headers: { 'content-type': 'application/json' }, body }),
      env: {}, waitUntil: (p) => void later.push(p),
    })
    assert.equal(res.status, 503)
    assert.deepEqual(await res.json(), { error: 'not_configured' })
    assert.equal(fetched + later.length, 0)
  } finally {
    globalThis.fetch = real
  }
})

/* ---------------------------------------------------------------- failure reports */

test('a failure is mailed once per place and visitor, not once per page view', async (t) => {
  /* reportFailure logs, and the pretend mailbox prints every mail */
  t.mock.method(console, 'error', () => {})
  t.mock.method(console, 'log', () => {})
  const env = { GOOGLE_MOCK: '1' }
  const before = outbox.length
  for (let i = 0; i < 5; i++) await reportFailure(env, 'GET /api/slots (test)', new Error('freebusy failed: 500'))
  assert.equal(outbox.length, before + 1)
  await reportFailure(env, 'POST /api/request (test)', new Error('x'), { email: 'a@example.com' })
  await reportFailure(env, 'POST /api/request (test)', new Error('x'), { email: 'a@example.com' })
  await reportFailure(env, 'POST /api/request (test)', new Error('x'), { email: 'b@example.com' })
  assert.equal(outbox.length, before + 3)
})
