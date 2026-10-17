/**
 * Configurazione del server. Su Cloudflare arriva dalle variabili e dai secret
 * del Worker (c.env), in locale da .dev.vars (wrangler dev) o da .env (Node).
 * Niente process.env qui: ogni modulo riceve l'env per richiesta.
 */
export type Env = {
  ANTHROPIC_API_KEY?: string;
  CLAUDE_MODEL?: string;
  /** domini autorizzati a chiamare /chat, separati da virgola */
  ALLOWED_ORIGINS?: string;
  /** contenuto del file JSON della service account Google (facoltativo) */
  GOOGLE_SERVICE_ACCOUNT_JSON?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_KEY?: string;
  /** limiti di richieste facoltativi, vedi ratelimit.ts */
  RL_SESSION_PER_MIN?: string;
  RL_SESSION_PER_DAY?: string;
  RL_IP_PER_MIN?: string;
  RL_IP_PER_DAY?: string;
};
