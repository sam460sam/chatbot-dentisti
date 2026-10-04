import type { Env } from './config.ts'

/** The part of the Pages Functions context these handlers use. */
export interface Ctx {
  request: Request
  env: Env & { WHATSAPP_NUMBER?: string }
  waitUntil(p: Promise<unknown>): void
}

export const waLink = (env: Ctx['env']) => `https://wa.me/${env.WHATSAPP_NUMBER || '31645745163'}`
