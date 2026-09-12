import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { studios } from "./studios/demo.js";
import { buildSystemPrompt } from "./prompt.js";
import { toolDefinitions, executeTool } from "./tools.js";

const client = new Anthropic(); // legge ANTHROPIC_API_KEY
const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5";
const MAX_TOOL_ROUNDS = 5;

// history per sessione, in memoria (da spostare su DB con Supabase)
const sessions = new Map<string, Anthropic.MessageParam[]>();

const app = new Hono();
app.use(
  "/chat",
  cors({ origin: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",") }),
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

  const history = sessions.get(sessionId) ?? [];
  history.push({ role: "user", content: message.trim() });

  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: buildSystemPrompt(studio, new Date()), cache_control: { type: "ephemeral" } },
  ];

  let reply = "";
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system,
      tools: toolDefinitions,
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
        content: await executeTool(t.name, t.input, studio),
      });
    }
    history.push({ role: "user", content: results });
  }

  // limita la history per non far crescere i token
  sessions.set(sessionId, history.slice(-40));
  return c.json({ reply });
});

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port });
console.log(`server su http://localhost:${port}`);
