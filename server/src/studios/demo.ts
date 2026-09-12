export type Studio = {
  id: string;
  name: string;
  /** lingua delle risposte: "it" | "nl" | "en" */
  language: "it" | "nl" | "en";
  /** testo libero scritto dal dentista: tono, cose da dire/non dire, tu/lei */
  customInstructions: string;
  address: string;
  phone: string;
  privacyUrl: string;
  timezone: string;
  /** giorno settimana (1=lun ... 5=ven) -> fasce orarie */
  hours: Record<number, { from: string; to: string }[]>;
  slotMinutes: number;
  doctors: string[];
  services: { name: string; durationMin: number; priceFrom: number }[];
  faq: { q: string; a: string }[];
  /** email/numero della segreteria per l'escalation */
  handoffContact: string;
};

export const demoStudio: Studio = {
  id: "demo",
  name: "Studio Dentistico Rossi",
  language: "it",
  customInstructions: "Dai del lei ai pazienti. Tono caldo ma professionale, niente emoji. Se chiedono dello sbiancamento, ricorda che serve prima una visita di controllo.",
  address: "Via Roma 12, Castelfranco Veneto (TV)",
  phone: "0423 000000",
  privacyUrl: "https://example.com/privacy",
  timezone: "Europe/Rome",
  hours: {
    1: [{ from: "09:00", to: "13:00" }, { from: "14:30", to: "19:00" }],
    2: [{ from: "09:00", to: "13:00" }, { from: "14:30", to: "19:00" }],
    3: [{ from: "09:00", to: "13:00" }],
    4: [{ from: "09:00", to: "13:00" }, { from: "14:30", to: "19:00" }],
    5: [{ from: "09:00", to: "13:00" }],
  },
  slotMinutes: 30,
  doctors: ["Dott. Marco Rossi", "Dott.ssa Laura Bianchi (igienista)"],
  services: [
    { name: "Prima visita", durationMin: 30, priceFrom: 0 },
    { name: "Igiene / pulizia dentale", durationMin: 45, priceFrom: 70 },
    { name: "Otturazione", durationMin: 60, priceFrom: 90 },
    { name: "Sbiancamento", durationMin: 60, priceFrom: 250 },
    { name: "Visita ortodontica", durationMin: 30, priceFrom: 0 },
  ],
  faq: [
    { q: "Parcheggio", a: "Parcheggio gratuito davanti allo studio." },
    { q: "Pagamenti", a: "Contanti, bancomat, carta. Possibilità di rateizzazione per trattamenti sopra i 500€." },
    { q: "Bambini", a: "Sì, visitiamo bambini dai 4 anni." },
    { q: "Convenzioni", a: "Nessuna convenzione con assicurazioni; rilasciamo fattura per la detrazione." },
  ],
  handoffContact: "segreteria@studiorossi.it",
};

export const tandartsDemo: Studio = {
  id: "tandarts-demo",
  name: "Tandartspraktijk De Vries",
  language: "nl",
  customInstructions: "Spreek de patiënt aan met 'u'. Warme, professionele toon, geen emoji. Nieuwe patiënten altijd eerst een intake (eerste consult) aanbieden.",
  address: "Oude Kijk in 't Jatstraat 12, Groningen",
  phone: "050 123 4567",
  privacyUrl: "https://example.com/privacy",
  timezone: "Europe/Amsterdam",
  hours: {
    1: [{ from: "08:00", to: "12:30" }, { from: "13:30", to: "17:00" }],
    2: [{ from: "08:00", to: "12:30" }, { from: "13:30", to: "17:00" }],
    3: [{ from: "08:00", to: "12:30" }, { from: "13:30", to: "17:00" }],
    4: [{ from: "08:00", to: "12:30" }, { from: "13:30", to: "17:00" }],
    5: [{ from: "08:00", to: "12:30" }],
  },
  slotMinutes: 30,
  doctors: ["Tandarts J. de Vries", "Mondhygiënist S. Bakker"],
  services: [
    { name: "Intake / eerste consult", durationMin: 30, priceFrom: 0 },
    { name: "Periodieke controle", durationMin: 20, priceFrom: 26 },
    { name: "Gebitsreiniging (mondhygiënist)", durationMin: 45, priceFrom: 65 },
    { name: "Vulling", durationMin: 45, priceFrom: 60 },
    { name: "Bleken", durationMin: 60, priceFrom: 275 },
  ],
  faq: [
    { q: "Verzekering", a: "Wij declareren rechtstreeks bij uw zorgverzekeraar als u aanvullend tandheelkundig verzekerd bent." },
    { q: "Parkeren", a: "Betaald parkeren op straat; fietsenstalling voor de deur." },
    { q: "Kinderen", a: "Tandheelkunde voor kinderen tot 18 jaar wordt vergoed uit de basisverzekering." },
    { q: "Spoed", a: "Bij spoed buiten openingstijden: bel de praktijk, u hoort het nummer van de spoeddienst." },
  ],
  handoffContact: "info@tandartsdevries.nl",
};

export const dentalDemo: Studio = {
  id: "dental-demo",
  name: "Riverside Dental Practice",
  language: "en",
  customInstructions: "Friendly but professional tone, no emoji. Always mention that we are a private practice (not NHS). Offer a free 15-minute consultation for implants and Invisalign.",
  address: "14 Bridge Street, Richmond, London TW9",
  phone: "020 7946 0123",
  privacyUrl: "https://example.com/privacy",
  timezone: "Europe/London",
  hours: {
    1: [{ from: "08:30", to: "13:00" }, { from: "14:00", to: "18:00" }],
    2: [{ from: "08:30", to: "13:00" }, { from: "14:00", to: "18:00" }],
    3: [{ from: "08:30", to: "13:00" }, { from: "14:00", to: "18:00" }],
    4: [{ from: "08:30", to: "13:00" }, { from: "14:00", to: "19:00" }],
    5: [{ from: "08:30", to: "13:00" }],
  },
  slotMinutes: 30,
  doctors: ["Dr Emily Carter", "Dr Raj Patel", "Hygienist Laura Ng"],
  services: [
    { name: "New patient exam", durationMin: 30, priceFrom: 65 },
    { name: "Hygiene / scale and polish", durationMin: 45, priceFrom: 75 },
    { name: "White filling", durationMin: 45, priceFrom: 120 },
    { name: "Teeth whitening", durationMin: 60, priceFrom: 350 },
    { name: "Implant consultation", durationMin: 15, priceFrom: 0 },
  ],
  faq: [
    { q: "NHS", a: "We are a private practice and do not offer NHS treatment." },
    { q: "Payment", a: "Card, cash and 0% finance plans over 12 months for treatments above £500." },
    { q: "Parking", a: "Two-hour free parking at the Paradise Road car park, 3 minutes away." },
    { q: "Nervous patients", a: "We offer longer first appointments and sedation options for anxious patients." },
  ],
  handoffContact: "reception@riversidedental.co.uk",
};

export const studios: Record<string, Studio> = {
  demo: demoStudio,
  "tandarts-demo": tandartsDemo,
  "dental-demo": dentalDemo,
};
