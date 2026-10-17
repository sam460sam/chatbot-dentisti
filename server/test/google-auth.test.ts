/**
 * Il flusso OAuth della service account Google fatto con WebCrypto (google-auth.ts):
 * il JWT si firma con una chiave RSA appena generata e si verifica con la chiave
 * pubblica tramite node:crypto, cioè con un'implementazione indipendente.
 * Esegui con: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, verify, type KeyObject } from "node:crypto";
import {
  GOOGLE_TOKEN_URL,
  getServiceAccountToken,
  importPrivateKey,
  signServiceAccountJwt,
  type ServiceAccount,
} from "../src/google-auth.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function freshServiceAccount(email = "bot@example-project.iam.gserviceaccount.com"): { sa: ServiceAccount; publicKey: KeyObject } {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  return { sa: { client_email: email, private_key: pem, private_key_id: "key-123" }, publicKey };
}

const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString("utf8"));

/** true se la firma RS256 del JWT è valida per la chiave pubblica */
function verifies(jwt: string, publicKey: KeyObject): boolean {
  const [h, p, s] = jwt.split(".");
  return verify("RSA-SHA256", Buffer.from(`${h}.${p}`), publicKey, Buffer.from(s, "base64url"));
}

test("JWT firmato con WebCrypto si verifica con la chiave pubblica", async () => {
  const { sa, publicKey } = freshServiceAccount();
  const key = await importPrivateKey(sa.private_key);
  const jwt = await signServiceAccountJwt(sa, key, SCOPES, 1_800_000_000);

  const [h, p] = jwt.split(".");
  assert.equal(jwt.split(".").length, 3);
  assert.ok(!/[+/=]/.test(jwt), "base64url senza padding");
  assert.deepEqual(decode(h), { alg: "RS256", typ: "JWT", kid: "key-123" });
  assert.deepEqual(decode(p), {
    iss: sa.client_email,
    scope: SCOPES[0],
    aud: GOOGLE_TOKEN_URL,
    iat: 1_800_000_000,
    exp: 1_800_003_600,
  });
  assert.ok(verifies(jwt, publicKey), "firma valida");

  // un payload cambiato non deve più verificare
  const forged = `${h}.${Buffer.from(JSON.stringify({ ...decode(p), scope: "x" })).toString("base64url")}.${jwt.split(".")[2]}`;
  assert.ok(!verifies(forged, publicKey), "payload alterato rifiutato");
  // e nemmeno con un'altra chiave
  assert.ok(!verifies(jwt, freshServiceAccount().publicKey), "chiave sbagliata rifiutata");
});

test("accetta la chiave con gli \\n non decodificati (JSON incollato male)", async () => {
  const { sa, publicKey } = freshServiceAccount();
  const key = await importPrivateKey(sa.private_key.replace(/\n/g, "\\n"));
  assert.ok(verifies(await signServiceAccountJwt(sa, key, SCOPES, 1_800_000_000), publicKey));
});

test("scambia il JWT con un access token e lo tiene finché non sta per scadere", async () => {
  const { sa, publicKey } = freshServiceAccount("cache@example-project.iam.gserviceaccount.com");
  const json = JSON.stringify(sa);
  let now = 1_800_000_000_000;
  const calls: { url: string; init: RequestInit }[] = [];
  const fakeFetch = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return Response.json({ access_token: `tok-${calls.length}`, expires_in: 3599, token_type: "Bearer" });
  };
  const deps = { fetch: fakeFetch, now: () => now };

  assert.equal(await getServiceAccountToken(json, SCOPES, deps), "tok-1");
  const { url, init } = calls[0];
  assert.equal(url, "https://oauth2.googleapis.com/token");
  assert.equal(init.method, "POST");
  assert.deepEqual(init.headers, { "content-type": "application/x-www-form-urlencoded" });
  const body = new URLSearchParams(String(init.body));
  assert.equal(body.get("grant_type"), "urn:ietf:params:oauth:grant-type:jwt-bearer");
  const assertion = body.get("assertion")!;
  assert.ok(verifies(assertion, publicKey), "l'assertion inviata a Google è firmata con la chiave della service account");
  assert.equal(decode(assertion.split(".")[1]).iat, 1_800_000_000);

  now += 50 * 60_000; // 50 minuti dopo: ancora valido (scade a ~60, si rinnova a ~55)
  assert.equal(await getServiceAccountToken(json, SCOPES, deps), "tok-1");
  assert.equal(calls.length, 1, "token riusato dalla cache");

  now += 6 * 60_000; // 56 minuti: dentro il margine di 5 minuti, si rinnova
  assert.equal(await getServiceAccountToken(json, SCOPES, deps), "tok-2");
  assert.equal(calls.length, 2);
});

test("errore leggibile se Google rifiuta il JWT", async () => {
  const { sa } = freshServiceAccount("denied@example-project.iam.gserviceaccount.com");
  const fakeFetch = async () =>
    Response.json({ error: "invalid_grant", error_description: "Invalid JWT Signature." }, { status: 400 });
  await assert.rejects(getServiceAccountToken(JSON.stringify(sa), SCOPES, { fetch: fakeFetch }), /Google OAuth token: 400 .*invalid_grant/);
});
