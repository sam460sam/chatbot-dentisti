/**
 * Limite di richieste in memoria, per non lasciare la spesa API aperta a chiunque.
 * Il server è una singola istanza, quindi una Map basta: niente Redis.
 */
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const num = (name: string, fallback: number) => Number(process.env[name] ?? fallback) || fallback;

const LIMITS = {
  sessionPerMinute: num("RL_SESSION_PER_MIN", 10),
  sessionPerDay: num("RL_SESSION_PER_DAY", 80),
  ipPerMinute: num("RL_IP_PER_MIN", 30),
  ipPerDay: num("RL_IP_PER_DAY", 300),
};

/** timestamp delle richieste recenti, per chiave */
const hits = new Map<string, number[]>();

function tooMany(key: string, now: number, perMinute: number, perDay: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < DAY);
  recent.push(now);
  hits.set(key, recent);
  const lastMinute = recent.filter((t) => now - t < MINUTE).length;
  return lastMinute > perMinute || recent.length > perDay;
}

/** true se la richiesta va rifiutata */
export function rateLimited(sessionId: string, ip: string): boolean {
  const now = Date.now();
  const bySession = tooMany(`s:${sessionId}`, now, LIMITS.sessionPerMinute, LIMITS.sessionPerDay);
  const byIp = tooMany(`i:${ip}`, now, LIMITS.ipPerMinute, LIMITS.ipPerDay);
  return bySession || byIp;
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

/** Ogni tanto butta via le chiavi vecchie, altrimenti la Map cresce all'infinito. */
setInterval(() => {
  const cutoff = Date.now() - DAY;
  for (const [key, times] of hits) {
    const recent = times.filter((t) => t > cutoff);
    if (recent.length) hits.set(key, recent);
    else hits.delete(key);
  }
}, 10 * MINUTE).unref?.();
