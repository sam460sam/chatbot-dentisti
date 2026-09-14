import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type Anthropic from "@anthropic-ai/sdk";

type Messages = Anthropic.MessageParam[];
const RETENTION_DAYS = 30;

/** Conversazioni: su Supabase se configurato (SUPABASE_URL + SUPABASE_SERVICE_KEY), altrimenti in memoria. */
let db: SupabaseClient | null = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
  console.log("sessioni: Supabase");
} else {
  console.log("sessioni: memoria (nessun SUPABASE_URL)");
}
const memory = new Map<string, Messages>();

export async function loadSession(sessionId: string): Promise<Messages> {
  if (!db) return memory.get(sessionId) ?? [];
  const { data, error } = await db.from("sessions").select("messages").eq("id", sessionId).maybeSingle();
  if (error) { console.error("[store] load", error.message); return []; }
  return (data?.messages as Messages) ?? [];
}

export async function saveSession(sessionId: string, studioId: string, messages: Messages): Promise<void> {
  if (!db) { memory.set(sessionId, messages); return; }
  const { error } = await db.from("sessions").upsert({ id: sessionId, studio_id: studioId, messages, updated_at: new Date().toISOString() });
  if (error) console.error("[store] save", error.message);
}

/** Cancella le conversazioni più vecchie di RETENTION_DAYS (minimizzazione dati). */
export async function cleanupOldSessions(): Promise<void> {
  if (!db) return;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
  const { error } = await db.from("sessions").delete().lt("updated_at", cutoff);
  if (error) console.error("[store] cleanup", error.message);
}
