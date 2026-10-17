import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { studios, type Studio } from "./studios/demo.js";
import { buildClockPrompt, buildSystemPrompt } from "./prompt.js";
import { toolsFor, executeTool } from "./tools.js";
import { loadSession, saveSession } from "./store.js";
import { rateLimited, rateLimitMessage } from "./ratelimit.js";
import type { Env } from "./env.js";

/**
 * L'API della chat, uguale su Cloudflare Workers (worker.ts) e su Node (index.ts):
 * la configurazione arriva per richiesta da c.env, mai da process.env.
 */
const MAX_TOOL_ROUNDS = 5;

/** Un client Anthropic per isolate, rifatto solo se cambia la chiave. */
let anthropic: { key: string | undefined; client: Anthropic } | null = null;
function anthropicFor(env: Env): Anthropic {
  if (!anthropic || anthropic.key !== env.ANTHROPIC_API_KEY) {
    anthropic = { key: env.ANTHROPIC_API_KEY, client: new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) };
  }
  return anthropic.client;
}

/** domini autorizzati: ALLOWED_ORIGINS separati da virgola, spazi ignorati */
const allowedOrigins = (env: Env) =>
  (env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",").map((o) => o.trim()).filter(Boolean);

/** Il prompt di sistema dipende solo dallo studio: si costruisce una volta per isolate (meno CPU per richiesta). */
const systemPrompts = new WeakMap<Studio, string>();
function systemPromptFor(studio: Studio): string {
  let text = systemPrompts.get(studio);
  if (text === undefined) systemPrompts.set(studio, (text = buildSystemPrompt(studio)));
  return text;
}

// Lavoro fatto una volta all'avvio dell'isolate (global scope, che ha un suo limite di 1 s)
// invece che nella prima richiesta, che sul piano gratuito ha 10 ms di CPU: carica i dati
// ICU di Intl (nomi delle lingue, fusi orari) e costruisce i prompt di tutti gli studi.
for (const s of Object.values(studios)) systemPromptFor(s);
buildClockPrompt(studios.demo, new Date(0));

export const app = new Hono<{ Bindings: Env }>();
app.use(
  "/chat",
  cors({ origin: (origin, c) => (allowedOrigins(c.env).includes(origin) ? origin : null) }),
);

app.get("/health", (c) => c.text("ok"));

app.post("/chat", async (c) => {
  const { studioId, sessionId, message } = await c.req.json<{
    studioId: string;
    sessionId: string;
    message: string;
  }>();

  const studio = studios[studioId];
  if (!studio) return c.json({ error: "studio non trovato" }, 404);
  if (!message?.trim()) return c.json({ error: "messaggio vuoto" }, 400);

  if (!sessionId || sessionId.length > 80) return c.json({ error: "sessionId non valido" }, 400);

  const ip = (c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (await rateLimited(c.env, sessionId, ip)) {
    console.log("[RATELIMIT]", studio.id, ip);
    return c.json({ reply: rateLimitMessage(studio.language) }, 429);
  }
  const history = await loadSession(c.env, sessionId);
  history.push({ role: "user", content: message.trim() });

  // Il blocco stabile va in cache; l'orologio, che cambia ogni minuto, sta fuori.
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: systemPromptFor(studio), cache_control: { type: "ephemeral" } },
    { type: "text", text: buildClockPrompt(studio, new Date()) },
  ];

  const client = anthropicFor(c.env);
  let reply = "";
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const res = await client.messages.create({
      model: c.env.CLAUDE_MODEL ?? "claude-sonnet-5",
      max_tokens: 800,
      system,
      tools: toolsFor(studio),
      messages: history,
    });

    history.push({ role: "assistant", content: res.content });

    const toolUses = res.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (res.stop_reason !== "tool_use" || toolUses.length === 0) {
      reply = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      break;
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const t of toolUses) {
      results.push({
        type: "tool_result",
        tool_use_id: t.id,
        content: await executeTool(t.name, t.input, studio, c.env),
      });
    }
    history.push({ role: "user", content: results });
  }

  // limita la history per non far crescere i token
  await saveSession(c.env, sessionId, studioId, history.slice(-40));
  return c.json({ reply });
});
