import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { cleanupOldSessions } from "./store.js";
import type { Env } from "./env.js";

/**
 * Entry Node, per chi vuole far girare il server fuori da Cloudflare
 * (npm run dev / npm start). In produzione si usa worker.ts.
 */
const env = process.env as Env;

cleanupOldSessions(env);
setInterval(() => cleanupOldSessions(env), 24 * 3600 * 1000);

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: (req) => app.fetch(req, env), port });
console.log(`server su http://localhost:${port}`);
