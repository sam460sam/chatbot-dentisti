import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type Anthropic from "@anthropic-ai/sdk";
import type { Env } from "./env.js";

type Messages = Anthropic.MessageParam[];
const RETENTION_DAYS = 30;

/**
 * Conversazioni: su Supabase se configurato (SUPABASE_URL + SUPABASE_SERVICE_KEY), altrimenti in memoria.
 * Il client si crea alla prima richiesta e si riusa finché URL e chiave non cambiano.
 */
let cached: { url: string; key: string; db: SupabaseClient } | null = null;
let memoryLogged = false;

function dbFor(env: Env): SupabaseClient | null {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    if (!memoryLogged) { console.log("sessioni: memoria (nessun SUPABASE_URL)"); memoryLogged = true; }
    return null;
  }
  if (cached?.url !== url || cached.key !== key) {
    cached = {
      url,
      key,
      // nessun utente da tenere loggato: solo la service key, quindi niente sessione né refresh
      db: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
    };
    console.log("sessioni: Supabase");
  }
  return cached.db;
}

const memory = new Map<string, Messages>();

export async function loadSession(env: Env, sessionId: string): Promise<Messages> {
  const db = dbFor(env);
  if (!db) return memory.get(sessionId) ?? [];
  const { data, error } = await db.from("sessions").select("messages").eq("id", sessionId).maybeSingle();
  if (error) { console.error("[store] load", error.message); return []; }
  return (data?.messages as Messages) ?? [];
}

export async function saveSession(env: Env, sessionId: string, studioId: string, messages: Messages): Promise<void> {
  const db = dbFor(env);
  if (!db) { memory.set(sessionId, messages); return; }
  const { error } = await db.from("sessions").upsert({ id: sessionId, studio_id: studioId, messages, updated_at: new Date().toISOString() });
  if (error) console.error("[store] save", error.message);
}

/** Cancella le conversazioni più vecchie di RETENTION_DAYS (minimizzazione dati). */
export async function cleanupOldSessions(env: Env): Promise<void> {
  const db = dbFor(env);
  if (!db) return;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
  const { error } = await db.from("sessions").delete().lt("updated_at", cutoff);
  if (error) console.error("[store] cleanup", error.message);
}
