import type { Env, RateLimitBinding } from "./env.js";
import { dbFor } from "./store.js";

/**
 * Limite di richieste, per non lasciare la spesa API aperta a chiunque.
 *
 * - Al giorno (80 per conversazione, 300 per IP): contatori nella tabella
 *   rate_hits di Supabase (supabase/rate_hits.sql), condivisi da tutte le
 *   istanze. Il giorno è quello di calendario UTC. Se la tabella manca o
 *   Supabase non risponde, la richiesta passa (e l'errore va nei log).
 * - Al minuto (10 per conversazione, 30 per IP): i binding Workers Rate Limiting
 *   (RATE_LIMIT_SESSION, RATE_LIMIT_IP in wrangler.toml), che contano per località
 *   Cloudflare e in modo approssimato, più il conteggio in memoria qui sotto.
 * - In memoria (una Map): vale per un solo isolate, che Cloudflare può riciclare
 *   in qualsiasi momento, quindi da solo è solo indicativo.
 */
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const num = (value: string | undefined, fallback: number) => Number(value ?? fallback) || fallback;

function limitsFor(env: Env) {
  return {
    sessionPerMinute: num(env.RL_SESSION_PER_MIN, 10),
    sessionPerDay: num(env.RL_SESSION_PER_DAY, 80),
    ipPerMinute: num(env.RL_IP_PER_MIN, 30),
    ipPerDay: num(env.RL_IP_PER_DAY, 300),
  };
}

/** timestamp delle richieste recenti, per chiave */
const hits = new Map<string, number[]>();
let lastPrune = 0;

/** Ogni tanto butta via le chiavi vecchie, altrimenti la Map cresce all'infinito (niente timer: sui Workers non si possono avviare fuori da una richiesta). */
function prune(now: number) {
  if (now - lastPrune < 10 * MINUTE) return;
  lastPrune = now;
  const cutoff = now - DAY;
  for (const [key, times] of hits) {
    const recent = times.filter((t) => t > cutoff);
    if (recent.length) hits.set(key, recent);
    else hits.delete(key);
  }
}

function tooMany(key: string, now: number, perMinute: number, perDay: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < DAY);
  recent.push(now);
  hits.set(key, recent);
  const lastMinute = recent.filter((t) => now - t < MINUTE).length;
  return lastMinute > perMinute || recent.length > perDay;
}

const isBinding = (b: unknown): b is RateLimitBinding => typeof (b as RateLimitBinding | undefined)?.limit === "function";

/** true se uno dei binding Cloudflare dice di rifiutare; se i binding mancano o non rispondono, decide solo la memoria. */
async function sharedLimited(env: Env, sessionId: string, ip: string): Promise<boolean> {
  const checks: Promise<{ success: boolean }>[] = [];
  if (isBinding(env.RATE_LIMIT_SESSION)) checks.push(env.RATE_LIMIT_SESSION.limit({ key: `s:${sessionId}` }));
  if (isBinding(env.RATE_LIMIT_IP)) checks.push(env.RATE_LIMIT_IP.limit({ key: `i:${ip}` }));
  if (!checks.length) return false;
  try {
    return (await Promise.all(checks)).some((r) => !r.success);
  } catch (e) {
    console.error("[ratelimit] binding", e instanceof Error ? e.message : e);
    return false;
  }
}

/** true se uno dei contatori giornalieri su Supabase ha superato il limite; senza Supabase o se la chiamata fallisce, false. */
async function dailyLimited(env: Env, sessionId: string, ip: string, perSession: number, perIp: number): Promise<boolean> {
  const db = dbFor(env);
  if (!db) return false;
  try {
    const [s, i] = await Promise.all([
      db.rpc("rate_hit", { k: `s:${sessionId}` }),
      db.rpc("rate_hit", { k: `i:${ip}` }),
    ]);
    if (s.error || i.error) {
      console.error("[ratelimit] daily", (s.error ?? i.error)!.message);
      return false;
    }
    return (s.data as number) > perSession || (i.data as number) > perIp;
  } catch (e) {
    console.error("[ratelimit] daily", e instanceof Error ? e.message : e);
    return false;
  }
}

/** true se la richiesta va rifiutata */
export async function rateLimited(env: Env, sessionId: string, ip: string): Promise<boolean> {
  const now = Date.now();
  prune(now);
  const limits = limitsFor(env);
  const bySession = tooMany(`s:${sessionId}`, now, limits.sessionPerMinute, limits.sessionPerDay);
  const byIp = tooMany(`i:${ip}`, now, limits.ipPerMinute, limits.ipPerDay);
  const [shared, daily] = await Promise.all([
    sharedLimited(env, sessionId, ip),
    dailyLimited(env, sessionId, ip, limits.sessionPerDay, limits.ipPerDay),
  ]);
  return bySession || byIp || shared || daily;
}

const MESSAGE: Record<string, string> = {
  it: "Troppi messaggi in poco tempo. Riprova tra qualche minuto, oppure chiama direttamente lo studio.",
  nl: "Te veel berichten in korte tijd. Probeer het over een paar minuten opnieuw, of bel de praktijk.",
  en: "Too many messages in a short time. Please try again in a few minutes, or call the practice.",
  de: "Zu viele Nachrichten in kurzer Zeit. Bitte versuchen Sie es in ein paar Minuten erneut.",
  es: "Demasiados mensajes en poco tiempo. Vuelve a intentarlo en unos minutos.",
  fr: "Trop de messages en peu de temps. Réessayez dans quelques minutes.",
};

export const rateLimitMessage = (language: string) =>
  MESSAGE[language.slice(0, 2).toLowerCase()] ?? MESSAGE.en;
