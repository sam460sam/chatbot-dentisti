import type { Studio } from "./demo.js";

/**
 * Twinbyte stessa, per l'assistente sul sito vetrina (twinbyteservices.com).
 * Non prende appuntamenti: risponde alle domande su di noi e, per parlare con
 * una persona, manda su WhatsApp o via email. Tutte le informazioni qui sotto
 * devono restare allineate ai testi del sito.
 */
export const twinbyteStudio: Studio = {
  id: "twinbyte",
  name: "Twinbyte",
  language: "en",
  booking: false,
  customInstructions: [
    "Parli con titolari di studi dentistici e piccole imprese, non con pazienti.",
    "Tono professionale, diretto e breve. Niente emoji, niente linguaggio da vendita.",
    "Non inventare MAI prezzi, numeri di clienti, percentuali o risultati: non li abbiamo pubblicati.",
    "Se chiedono il prezzo: i piani dipendono da quante conversazioni ha l'attività in un mese, quindi serve prima sapere quel numero. Non dare MAI una cifra: invitali a chiederla su WhatsApp.",
    "Se vogliono parlare con una persona o un preventivo: invitali a scrivere su WhatsApp al +31 6 45745163 oppure a info@twinbyteservices.com, e usa escalate_to_human con il loro nome e contatto.",
    "Se chiedono una demo, indica https://twinbyteservices.com/demo/ (studio dentistico di esempio).",
  ].join(" "),
  address: "Da remoto. Lavoriamo con studi nel Regno Unito, in Italia e nei Paesi Bassi.",
  phone: "+31 6 45745163",
  privacyUrl: "https://twinbyteservices.com/privacy",
  timezone: "Europe/Amsterdam",
  hours: {},
  slotMinutes: 30,
  doctors: [],
  services: [],
  handoffContact: "info@twinbyteservices.com",
  faq: [
    {
      q: "What is Twinbyte",
      a: "Twinbyte is Anna and Samuele. We put a digital assistant on a dental practice's website: it answers patients' questions around the clock and books appointments into the calendar the practice already uses. We also build websites for small businesses.",
    },
    {
      q: "How the assistant works",
      a: "We configure it with the practice's opening hours, treatments and the questions patients ask most, then add one line of code to the website the practice already has. Nothing to install, nothing else changes. A WhatsApp version is on the way.",
    },
    {
      q: "Getting started",
      a: "We configure the assistant, put it on the website and it runs from day one. The subscription is month to month with one month of notice — there is no long contract to sign.",
    },
    {
      q: "Price",
      a: "There is no published price list. Plans are priced by how many conversations the business has in a month, so a business with a few hundred pays considerably less than one with thousands. Ask roughly how many customers contact them and hand the question to a person for a figure. Never estimate a price yourself.",
    },
    {
      q: "Languages",
      a: "The assistant is set up in the language the practice works in and answers each patient in the language that patient writes in.",
    },
    {
      q: "Urgencies and medical questions",
      a: "The assistant gives no diagnosis and no medical advice, and does not triage. For an urgent case, or to move or cancel an appointment, it takes the name and phone number and creates a call-back event in the practice's calendar so a member of staff follows up.",
    },
    {
      q: "Data protection",
      a: "To make a booking the assistant needs only a name and a phone number: no medical history, no documents, no payment details. Before going live we sign a data processing agreement with the practice, which stays the controller of the data. Patients are told they are not talking to a person.",
    },
    {
      q: "Which calendars and practice software",
      a: "Google Calendar works today. For other practice software we look at the integration together before we start.",
    },
    {
      q: "Does it work with our current website",
      a: "Yes, as long as one line of code can be added to it. That is the case for almost every site, including WordPress, Wix, Squarespace and custom builds.",
    },
    {
      q: "Websites for small businesses",
      a: "Besides the assistant we build websites: fast on mobile first, with a clear structure, no CMS for the owner to learn, and the assistant can be added to them later.",
    },
    {
      q: "How to get in touch",
      a: "WhatsApp +31 6 45745163 or info@twinbyteservices.com. Anna or Samuele answer personally; there is no call centre.",
    },
    {
      q: "Demo",
      a: "There is a live demo at https://twinbyteservices.com/demo/ — a fictional dental practice where the assistant answers and books on a test diary.",
    },
  ],
};
