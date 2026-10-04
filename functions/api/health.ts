/*
 * GET /api/health — refreshes the Google token and says whether it worked.
 * A refresh token that goes six months unused dies. Point any free uptime
 * monitor at this URL once a week and it never will, even in a quiet month.
 */
import { google, json } from '../_lib/http.ts'
import type { Ctx } from '../_lib/ctx.ts'

export const onRequestGet = async ({ env }: Ctx) => {
  try {
    await google(env).ping()
    return json({ ok: true })
  } catch {
    return json({ ok: false }, 503)
  }
}
