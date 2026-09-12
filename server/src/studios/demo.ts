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

export const studios: Record<string, Studio> = { demo: demoStudio };
