/* POST /api/request — the "send us a request" form. One mail to us, with
   Reply-To set to the visitor so answering is one click. */
import { notifyEmail } from '../_lib/config.ts'
import { google, json, readJson, looksHuman, asLang, text, reportFailure } from '../_lib/http.ts'
import { isAddress } from '../_lib/mail.ts'
import { ownerRequest } from '../_lib/emails.ts'
import type { Ctx } from '../_lib/ctx.ts'

export const onRequestPost = async ({ request, env }: Ctx) => {
  const body = await readJson(request)
  if (!body) return json({ error: 'bad_request' }, 400)
  const r = {
    name: text(body.name, 80),
    email: text(body.email, 254).toLowerCase(),
    phone: text(body.phone, 40),
    business: text(body.business, 120),
    message: text(body.message, 3000, true),
    lang: asLang(body.lang),
  }
  if (!r.name || !isAddress(r.email) || !r.message) return json({ error: 'invalid' }, 422)
  if (r.phone && !/^[+()\d\s.-]{6,40}$/.test(r.phone)) return json({ error: 'invalid_phone' }, 422)
  if (body.consent !== true) return json({ error: 'consent' }, 422)
  if (!(await looksHuman(env, body, request.headers.get('cf-connecting-ip')))) return json({ error: 'bot' }, 403)
  try {
    await google(env).send(ownerRequest(r, notifyEmail(env)))
    return json({ ok: true })
  } catch (e) {
    await reportFailure(env, 'POST /api/request', e, { email: r.email })
    return json({ error: 'unavailable' }, 503)
  }
}
