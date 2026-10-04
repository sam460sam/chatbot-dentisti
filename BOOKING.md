# The booking page

`twinbyte.online` is one page: book a free 15-minute call. Everything else the
business does lives on its own page (`/assistant`, `/websites`, `/prices`),
linked from below the booking card.

```
src/components/BookingPage.tsx   the home page: the sentence, the card, the related pages
src/components/Booker.tsx        day → time → details → done, and the request form
src/i18n/booking.ts              every word of it, EN / NL / IT
functions/api/slots.ts           GET  free starts for the next 14 days
functions/api/book.ts            POST the booking
functions/api/request.ts         POST the "send a request" form
functions/api/health.ts          GET  is the Google token still alive?
functions/_lib/slots.ts          the hours, the 4-hour notice, the clock change — pure, tested
```

Cost: EUR 0. Cloudflare Pages Functions free (100,000 calls a day; going over
fails, it never bills), Google Calendar and Gmail API free. **Never link a
billing account to the Google Cloud project.**

## Rules

- 15-minute call on a 30-minute grid: every call keeps the next 15 minutes free.
- At least 4 hours' notice, at most 14 days ahead.
- Hours are written in Rome time and shown in the visitor's own time zone.
- One upcoming call per email address. A second booking is refused with a
  message to reply to the confirmation or use WhatsApp.
- Two people taking the same slot in the same second: the later one is undone
  and told to pick another time.
- Bots: a hidden field, a 3-second minimum, and Cloudflare Turnstile when its
  keys are set.
- Anything that fails sends a mail to `NOTIFY_EMAIL`, because Pages keeps no logs.

## One-time setup (about 45 minutes)

### 1. Google Cloud — signed in as twinbyteai@gmail.com

1. console.cloud.google.com → new project "twinbyte-booking". Do **not** start
   the free trial and do **not** add billing.
2. APIs & Services → Library → enable **Google Calendar API** and **Gmail API**.
3. OAuth consent screen → External → app name "Twinbyte booking", your email
   twice → Save. Then **Publish app** so the status is **In production**.
   In "Testing" the token dies after 7 days. Google will say the app is
   unverified: that is fine, only you ever sign in to it.
4. Credentials → Create credentials → OAuth client ID → type **Desktop app**.
   Copy the client ID and the client secret right away: since 2025 the secret
   is shown only once.
5. On your computer, in this repository:
   `node tools/google-auth.mjs <CLIENT_ID> <CLIENT_SECRET>`
   Sign in as twinbyteai@gmail.com. You will see "Google hasn't verified this
   app" → Advanced → Go to Twinbyte booking. Tick **all three** boxes. The
   terminal prints `GOOGLE_REFRESH_TOKEN=…`.

### 2. Cloudflare — the Pages project that serves twinbyte.online

Workers & Pages → the project → Settings → Variables and Secrets. Add for
**Production** (and for **Preview**, if you want to test on the preview URL —
see the warning below):

| name | type | value |
|---|---|---|
| `GOOGLE_CLIENT_ID` | secret | from step 4 |
| `GOOGLE_CLIENT_SECRET` | secret | from step 4 |
| `GOOGLE_REFRESH_TOKEN` | secret | from step 5 |
| `NOTIFY_EMAIL` | text | `twinbyteai@gmail.com` |
| `BOOKING_HOURS` | text | `mon-fri 18:00-21:00; sat 09:00-13:00` |

Optional, against spam (free): Turnstile → Add widget → hostname
`twinbyte.online` and `pages.dev`, mode Managed. Then add
`TURNSTILE_SECRET` (secret) and `VITE_TURNSTILE_SITE_KEY` (text — it is read at
build time).

Secrets are read by the deployment that comes **after** you save them:
Deployments → latest → Retry deployment.

**Warning:** preview URLs are public. With the real Google values on Preview,
anyone who has the preview link can put an event in the calendar. Fine for a
test afternoon; remove them afterwards if you like.

### 3. Keep the token alive

A Google refresh token that is unused for six months stops working. Any free
uptime monitor (UptimeRobot, Better Stack…) pointed at
`https://twinbyte.online/api/health` once a day keeps it alive, and tells you
the day it ever answers `{"ok":false}`.

## Changing the hours

Edit `BOOKING_HOURS` in Cloudflare, then Retry deployment. Format: day or day
range, a space, one or more `HH:MM-HH:MM` windows separated by commas; groups
separated by `;`. A typo is an error, not an empty calendar.

## Running it locally

```
cp .dev.vars.example .dev.vars     # GOOGLE_MOCK=1: pretend calendar and mailbox
npm run dev:api                    # http://localhost:8788
npm test                           # the slot and mail tests
```

## End-to-end test on the preview

On `https://booking-page.<project>.pages.dev`, with the real values on Preview:

1. The calendar shows only days and times inside `BOOKING_HOURS`, nothing in
   the next 4 hours, nothing past 14 days.
2. Book a time with your own other email address. Expect: the confirmation
   screen with a Meet link; an event in twinbyteai@gmail.com's calendar; an
   invitation from Google and a mail from Twinbyte in the inbox you used; a
   "New call" mail at twinbyteai@gmail.com.
3. Reload: that time is gone.
4. Book again with the same email: refused, with the WhatsApp message.
5. Send a request from "Send a request": a "New request" mail arrives.
6. Delete the test event from the calendar.

Then merge `booking-page` into `claude/twinbyte-showcase-site-7zns0j` — that is
the branch both Pages projects publish as production, not `main`.

## The old site

Branch `old-site`, commit `baa223f`: the full site as it was live before this
page. It also stays viewable at `old-site.twinbyte-c82.pages.dev`.
