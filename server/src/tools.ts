import type Anthropic from "@anthropic-ai/sdk";
import type { Studio } from "./studios/demo.js";
import { memoryCalendar, type CalendarProvider } from "./calendar.js";

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: "get_available_slots",
    description: "Restituisce gli orari liberi di un giorno per un servizio. Usalo prima di proporre orari.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Giorno in formato YYYY-MM-DD" },
        service: { type: "string", description: "Nome del servizio come nella lista dello studio" },
      },
      required: ["date", "service"],
    },
  },
  {
    name: "book_appointment",
    description: "Prenota un appuntamento. Chiamalo SOLO dopo conferma esplicita del paziente con tutti i dati raccolti.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "YYYY-MM-DD" },
        time: { type: "string", description: "HH:MM, uno degli orari restituiti da get_available_slots" },
        service: { type: "string" },
        patient_name: { type: "string", description: "Nome e cognome" },
        phone: { type: "string" },
      },
      required: ["date", "time", "service", "patient_name", "phone"],
    },
  },
  {
    name: "escalate_to_human",
    description: "Passa la conversazione alla segreteria (urgenze, richieste cliniche, modifiche appuntamenti, domande senza risposta).",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Motivo in una frase" },
        patient_contact: { type: "string", description: "Nome e telefono se già noti, altrimenti vuoto" },
      },
      required: ["reason"],
    },
  },
];

export async function executeTool(
  name: string,
  input: any,
  studio: Studio,
  calendar: CalendarProvider = memoryCalendar,
): Promise<string> {
  try {
    switch (name) {
      case "get_available_slots": {
        const svc = studio.services.find((s) => s.name.toLowerCase() === String(input.service).toLowerCase());
        const duration = svc?.durationMin ?? studio.slotMinutes;
        const slots = await calendar.getSlots(studio, input.date, duration);
        return JSON.stringify({ date: input.date, slots });
      }
      case "book_appointment": {
        const b = await calendar.book(studio, {
          studioId: studio.id,
          start: `${input.date}T${input.time}:00`,
          service: input.service,
          patientName: input.patient_name,
          phone: input.phone,
        });
        return JSON.stringify({ ok: true, bookingId: b.id, start: b.start });
      }
      case "escalate_to_human": {
        // TODO: inviare email/WhatsApp a studio.handoffContact
        console.log("[HANDOFF]", studio.id, input);
        return JSON.stringify({ ok: true, message: `Segreteria avvisata (${studio.handoffContact})` });
      }
      default:
        return JSON.stringify({ error: `Tool sconosciuto: ${name}` });
    }
  } catch (e: any) {
    return JSON.stringify({ error: e.message ?? String(e) });
  }
}
