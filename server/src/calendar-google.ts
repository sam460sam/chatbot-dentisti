import { JWT } from "google-auth-library";
import type { Studio } from "./studios/demo.js";
import { workingSlots, type Booking, type CalendarProvider } from "./calendar.js";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const API = "https://www.googleapis.com/calendar/v3";

let client: JWT | null = null;

/** true se la variabile GOOGLE_SERVICE_ACCOUNT_JSON è impostata (contenuto del file JSON della service account). */
export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

function auth(): JWT {
  if (client) return client;
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  client = new JWT({ email: creds.client_email, key: creds.private_key, scopes: SCOPES });
  return client;
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { token } = await auth().getAccessToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Google Calendar ${method} ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Offset (minuti) del fuso orario `tz` alla data/ora locale indicata. */
function tzOffsetMinutes(dateISO: string, hhmm: string, tz: string): number {
  const utcGuess = new Date(`${dateISO}T${hhmm}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  }).formatToParts(utcGuess);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const asLocal = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return (asLocal - utcGuess.getTime()) / 60000;
}

/** "2026-09-22" + "09:30" nel fuso dello studio → RFC3339 con offset, es. 2026-09-22T09:30:00+02:00 */
function toRFC3339(dateISO: string, hhmm: string, tz: string): string {
  const off = tzOffsetMinutes(dateISO, hhmm, tz);
  const sign = off >= 0 ? "+" : "-";
  const a = Math.abs(off);
  return `${dateISO}T${hhmm}:00${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

function addMinutes(hhmm: string, min: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const t = h * 60 + m + min;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

export const googleCalendar: CalendarProvider = {
  async getSlots(studio, dateISO, durationMin) {
    const calId = studio.googleCalendarId!;
    const fb = await call<{ calendars: Record<string, { busy: { start: string; end: string }[] }> }>(
      "POST", "/freeBusy", {
        timeMin: toRFC3339(dateISO, "00:00", studio.timezone),
        timeMax: toRFC3339(dateISO, "23:59", studio.timezone),
        timeZone: studio.timezone,
        items: [{ id: calId }],
      });
    const busy = (fb.calendars[calId]?.busy ?? []).map((b) => [Date.parse(b.start), Date.parse(b.end)] as const);
    return workingSlots(studio, dateISO, durationMin).filter((hhmm) => {
      const s = Date.parse(toRFC3339(dateISO, hhmm, studio.timezone));
      const e = Date.parse(toRFC3339(dateISO, addMinutes(hhmm, durationMin), studio.timezone));
      return !busy.some(([bs, be]) => s < be && e > bs);
    });
  },

  async book(studio, b) {
    const [dateISO, hhmm] = [b.start.slice(0, 10), b.start.slice(11, 16)];
    const svc = studio.services.find((s) => s.name === b.service);
    const duration = svc?.durationMin ?? studio.slotMinutes;
    // ricontrollo disponibilità prima di scrivere (evita doppie prenotazioni)
    const free = await this.getSlots(studio, dateISO, duration);
    if (!free.includes(hhmm)) throw new Error("Orario non più disponibile");
    const ev = await call<{ id: string }>("POST", `/calendars/${encodeURIComponent(studio.googleCalendarId!)}/events`, {
      summary: `${b.service} – ${b.patientName}`,
      description: `Prenotato dall'assistente virtuale.\nTelefono: ${b.phone}`,
      start: { dateTime: toRFC3339(dateISO, hhmm, studio.timezone), timeZone: studio.timezone },
      end: { dateTime: toRFC3339(dateISO, addMinutes(hhmm, duration), studio.timezone), timeZone: studio.timezone },
    });
    const booking: Booking = { id: ev.id, ...b };
    console.log("[BOOKING:google]", booking.id, booking.start, booking.service);
    return booking;
  },
};

const CALLBACK_TITLE: Record<string, string> = {
  it: "DA RICHIAMARE",
  nl: "TERUGBELLEN",
  en: "CALL BACK",
  de: "RÜCKRUF",
  fr: "RAPPELER",
  es: "LLAMAR",
};

/** Le note in agenda restano nella lingua dello studio; inglese per le lingue non mappate. */
const callbackTitle = (language: string) =>
  CALLBACK_TITLE[language.slice(0, 2).toLowerCase()] ?? CALLBACK_TITLE.en;

/** Segna nel calendario dello studio una richiesta da gestire a mano (urgenze, modifiche, domande senza risposta). */
export async function addCallbackNote(studio: Studio, reason: string, contact?: string): Promise<string> {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 60000);
  const ev = await call<{ id: string }>("POST", `/calendars/${encodeURIComponent(studio.googleCalendarId!)}/events`, {
    summary: `${callbackTitle(studio.language)} – ${contact?.trim() || "?"}`,
    description: `${reason}\n\n(segnalazione dell'assistente virtuale)`,
    start: { dateTime: now.toISOString() },
    end: { dateTime: end.toISOString() },
    colorId: "11",
  });
  console.log("[HANDOFF:google]", ev.id, studio.id, reason);
  return ev.id;
}
