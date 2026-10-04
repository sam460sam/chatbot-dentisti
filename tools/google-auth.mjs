#!/usr/bin/env node
/*
 * Gets the Google refresh token the booking page runs on. Run it ONCE, on your
 * own computer, signed in as twinbyteai@gmail.com:
 *
 *   node tools/google-auth.mjs ~/Downloads/client_secret_XXXX.json
 *   (or: node tools/google-auth.mjs <CLIENT_ID> <CLIENT_SECRET>)
 *
 * It opens Google's consent page, catches the answer on 127.0.0.1, and prints
 * the refresh token. Paste the three values into Cloudflare (Settings →
 * Variables and Secrets) as GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and
 * GOOGLE_REFRESH_TOKEN. Nothing is written to disk and nothing leaves your
 * machine except the exchange with Google.
 *
 * The OAuth client must be of type "Desktop app" (loopback redirects are only
 * allowed for that type), and the consent screen must be "In production" —
 * in "Testing" the refresh token stops working after seven days.
 */
import http from 'node:http'
import crypto from 'node:crypto'
import { exec } from 'node:child_process'
import { readFileSync } from 'node:fs'

/* Either the JSON file Google lets you download when the client is created,
   or the two values typed out. */
let [clientId, clientSecret] = process.argv.slice(2)
if (clientId && clientId.endsWith('.json')) {
  try {
    const j = JSON.parse(readFileSync(clientId, 'utf8'))
    const c = j.installed || j.web || {}
    if (j.web) console.warn('This client is of type "Web application". Create a "Desktop app" client instead.')
    ;[clientId, clientSecret] = [c.client_id, c.client_secret]
  } catch (e) {
    console.error('Could not read that file:', e.message)
    process.exit(1)
  }
}
if (!clientId || !clientSecret) {
  console.error('Usage: node tools/google-auth.mjs ~/Downloads/client_secret_XXXX.json')
  process.exit(1)
}

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events', // create and read the call events
  'https://www.googleapis.com/auth/calendar.freebusy', // see which times are taken
  'https://www.googleapis.com/auth/gmail.send', // send the confirmation and the notification
]
const PORT = 8085
const redirect = `http://127.0.0.1:${PORT}`
const verifier = crypto.randomBytes(48).toString('base64url')
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
const state = crypto.randomBytes(16).toString('hex')

const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirect,
  response_type: 'code',
  scope: SCOPES.join(' '),
  access_type: 'offline',
  prompt: 'consent', // always hand out a refresh token, even on a second run
  code_challenge: challenge,
  code_challenge_method: 'S256',
  state,
})}`

const server = http.createServer(async (req, res) => {
  const q = new URL(req.url, redirect).searchParams
  if (!q.get('code') && !q.get('error')) return res.end()
  const finish = (msg) => {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end(msg + '\n\nYou can close this tab and go back to the terminal.')
    server.close()
  }
  if (q.get('error')) {
    console.error('Google said:', q.get('error'))
    return finish('Cancelled: ' + q.get('error'))
  }
  if (q.get('state') !== state) return finish('State mismatch — run the script again.')
  const body = new URLSearchParams({
    code: q.get('code'),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirect,
    grant_type: 'authorization_code',
    code_verifier: verifier,
  })
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body })
  const json = await r.json()
  if (!json.refresh_token) {
    console.error('No refresh token in the answer:', json)
    return finish('Something went wrong — see the terminal.')
  }
  const granted = (json.scope || '').split(' ')
  const missing = SCOPES.filter((s) => !granted.includes(s))
  console.log('\nGOOGLE_REFRESH_TOKEN=' + json.refresh_token + '\n')
  if (missing.length) console.warn('Warning: these permissions were NOT ticked:', missing.join(', '), '\nRun again and tick every box.')
  console.log('Paste it into Cloudflare as an encrypted secret. Do not commit it anywhere.')
  finish('Done. The token is in the terminal.')
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Google. If the browser does not open, paste this link:\n\n' + url + '\n')
  const open = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open'
  exec(`${open} "${url}"`)
})
