import type { Studio } from "./studios/demo.js";

export type Booking = {
  id: string;
  studioId: string;
  start: string; // ISO
  service: string;
  patientName: string;
  phone: string;
};

/** Stesso contratto che implementerai con Google Calendar / Cal.com / AlfaDocs. */
export interface CalendarProvider {
  getSlots(studio: Studio, dateISO: string, durationMin: number): Promise<string[]>;
  book(studio: Studio, b: Omit<Booking, "id">): Promise<Booking>;
}

const bookings: Booking[] = [];

function toMin(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Tutti gli slot HH:MM negli orari di apertura di quel giorno (senza controllare le prenotazioni). */
export function workingSlots(studio: Studio, dateISO: string, durationMin: number): string[] {
  const day = new Date(dateISO + "T00:00:00");
  const ranges = studio.hours[day.getDay()] ?? [];
  const slots: string[] = [];
  for (const r of ranges) {
    for (let t = toMin(r.from); t + durationMin <= toMin(r.to); t += studio.slotMinutes) {
      slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const memoryCalendar: CalendarProvider = {
  async getSlots(studio, dateISO, durationMin) {
    const taken = bookings
      .filter((b) => b.studioId === studio.id && b.start.startsWith(dateISO))
      .map((b) => b.start.slice(11, 16));
    return workingSlots(studio, dateISO, durationMin).filter((s) => !taken.includes(s));
  },

  async book(studio, b) {
    const clash = bookings.some((x) => x.studioId === studio.id && x.start === b.start);
    if (clash) throw new Error("Orario non più disponibile");
    const booking: Booking = { id: `bk_${Date.now()}`, ...b };
    bookings.push(booking);
    console.log("[BOOKING]", booking);
    return booking;
  },
};
