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

export const memoryCalendar: CalendarProvider = {
  async getSlots(studio, dateISO, durationMin) {
    const day = new Date(dateISO + "T00:00:00");
    const ranges = studio.hours[day.getDay()] ?? [];
    const taken = bookings
      .filter((b) => b.studioId === studio.id && b.start.startsWith(dateISO))
      .map((b) => b.start.slice(11, 16));
    const slots: string[] = [];
    for (const r of ranges) {
      for (let t = toMin(r.from); t + durationMin <= toMin(r.to); t += studio.slotMinutes) {
        const hhmm = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
        if (!taken.includes(hhmm)) slots.push(hhmm);
      }
    }
    return slots;
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
