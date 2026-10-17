import { app } from "./app.js";
import { cleanupOldSessions } from "./store.js";
import type { Env } from "./env.js";

/**
 * Entry di Cloudflare Workers (wrangler.toml → main).
 * fetch: l'API (GET /health, POST /chat). scheduled: il cron giornaliero che
 * cancella le conversazioni vecchie, quello che su Node faceva setInterval.
 */

// i pochi tipi del runtime Workers che servono qui, senza tirare dentro @cloudflare/workers-types
type ScheduledController = { cron: string; scheduledTime: number };
type ExecutionContext = { waitUntil(promise: Promise<unknown>): void };

export default {
  fetch: app.fetch,
  scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log("[cron]", controller.cron, "pulizia sessioni");
    ctx.waitUntil(cleanupOldSessions(env));
  },
};
