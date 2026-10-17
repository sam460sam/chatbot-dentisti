/**
 * Token OAuth di una service account Google senza google-auth-library, che sui
 * Workers non gira: JWT firmato RS256 con WebCrypto (Workers e Node 20+),
 * scambiato su oauth2.googleapis.com, tenuto in memoria fino a poco prima che scada.
 */
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const JWT_GRANT = "urn:ietf:params:oauth:grant-type:jwt-bearer";
/** come google-auth-library: rinnova il token 5 minuti prima della scadenza */
const REFRESH_MARGIN_MS = 5 * 60_000;

export type ServiceAccount = { client_email: string; private_key: string; private_key_id?: string };

type Fetch = (input: string, init: RequestInit) => Promise<Response>;
// fetch va chiamata così e non come metodo di un altro oggetto: sui Workers darebbe "Illegal invocation"
const defaultFetch: Fetch = (input, init) => fetch(input, init);

const encoder = new TextEncoder();

function base64url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? encoder.encode(data) : data;
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Chiave privata PEM PKCS#8 ("-----BEGIN PRIVATE KEY-----", come nel JSON della service account) → CryptoKey RS256. */
export function importPrivateKey(pem: string): Promise<CryptoKey> {
  const b64 = pem
    .replace(/\\n/g, "\n") // se il JSON è stato incollato con gli "\n" raddoppiati
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
  return crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
}

/** JWT per lo scambio con Google (RFC 7523): valido un'ora da `nowSec`. */
export async function signServiceAccountJwt(
  sa: ServiceAccount,
  key: CryptoKey,
  scopes: string[],
  nowSec: number,
): Promise<string> {
  const header = { alg: "RS256", typ: "JWT", ...(sa.private_key_id ? { kid: sa.private_key_id } : {}) };
  const claims = { iss: sa.client_email, scope: scopes.join(" "), aud: GOOGLE_TOKEN_URL, iat: nowSec, exp: nowSec + 3600 };
  const input = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(input));
  return `${input}.${base64url(new Uint8Array(signature))}`;
}

type Cache = { id: string; sa: ServiceAccount; key: CryptoKey; token?: string; expiresAt?: number };
let cache: Cache | null = null;

/**
 * Access token per `scopes`, dato il contenuto del JSON della service account.
 * Si tiene in memoria il token già ottenuto (non la promessa: sui Workers una
 * richiesta non deve aspettare l'I/O di un'altra).
 */
export async function getServiceAccountToken(
  serviceAccountJson: string,
  scopes: string[],
  deps: { fetch?: Fetch; now?: () => number } = {},
): Promise<string> {
  const doFetch = deps.fetch ?? defaultFetch;
  const now = deps.now ?? Date.now;
  const id = `${scopes.join(" ")}\n${serviceAccountJson}`;

  if (cache?.id !== id) {
    const sa = JSON.parse(serviceAccountJson) as ServiceAccount;
    cache = { id, sa, key: await importPrivateKey(sa.private_key) };
  }
  const entry = cache;
  if (entry.token && entry.expiresAt && entry.expiresAt - REFRESH_MARGIN_MS > now()) return entry.token;

  const assertion = await signServiceAccountJwt(entry.sa, entry.key, scopes, Math.floor(now() / 1000));
  const res = await doFetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: JWT_GRANT, assertion }).toString(),
  });
  if (!res.ok) throw new Error(`Google OAuth token: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Google OAuth token: risposta senza access_token");

  entry.token = data.access_token;
  entry.expiresAt = now() + (data.expires_in ?? 3600) * 1000;
  return entry.token;
}
