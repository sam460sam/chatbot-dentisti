import type { Lang } from './types'

/*
 * Copy for the contact panel on the home page, the contact band that ends
 * the inner pages, and the home sections around them.
 *
 * The prefilled WhatsApp messages are the single source for every wa.me
 * link on the site and for the /wa/* short links behind the QR codes
 * (scripts/wa-redirects.mjs reads this file at build time), so a message
 * changed here changes the button, the code and the redirect together.
 * Type-only imports: Node loads this file with --experimental-strip-types.
 *
 * Dutch uses "u", Italian "tu", like the rest of the site.
 */
export type Topic = 'website' | 'assistant' | 'ads' | 'unsure'
export const TOPICS: Topic[] = ['website', 'assistant', 'ads', 'unsure']

/** The inner pages that end on a contact band, each with its own message. */
export type ContactPage = 'assistant' | 'websites' | 'prices'
export const CONTACT_PAGES: ContactPage[] = ['assistant', 'websites', 'prices']

export interface Prefills {
  default: string
  website: string
  assistant: string
  ads: string
  unsure: string
  assistantPage: string
  pricesPage: string
}

/** Which message each inner page sends (and which its /wa/{lang}/{page} short link opens). */
export const PAGE_PREFILL: Record<ContactPage, keyof Prefills> = {
  assistant: 'assistantPage',
  websites: 'website',
  prices: 'pricesPage',
}

export interface ContactCopy {
  /** *…* marks the one word set in the serif accent */
  title: string
  lead: string
  topicLabel: string
  topics: Record<Topic, string>
  whatsapp: string
  email: string
  /** under the buttons: the message is already written */
  ready: string
  copy: string
  copied: string
  qr: { title: string; body: string; alt: string }
  callLabel: string
  /** the chip between the duration and "free": how the call happens */
  place: string
  stepsTitle: string
  steps: string[]
  band: { title: string; lead: string }
  prefill: Prefills
  mail: {
    subject: string
    pages: Record<ContactPage, string>
    /** one line each; {need} is filled with the chosen topic, or left empty */
    body: string[]
  }
  /** the example conversation on the drawn phone; the first message is the current prefill */
  phone: {
    replies: [string, string, string]
    card: { title: string; meta: string }
    caption: string
    you: string
    us: string
    placeholder: string
  }
  proof: { eyebrow: string; title: string }
  promises: { title: string; items: string[] }
  /** {site} and {assistant} come from the price list (translations[lang].pricing) */
  priceLine: { text: string; link: string }
}

export const contact: Record<Lang, ContactCopy> = {
  en: {
    title: 'A free 15-minute call, *one message* away.',
    lead: 'Write to us on WhatsApp or by email. We agree the time with you, then talk for 15 minutes by phone, WhatsApp or Google Meet — whichever you prefer.',
    topicLabel: 'What is it about?',
    topics: { website: 'A website', assistant: 'The assistant', ads: 'Online ads', unsure: 'Not sure yet' },
    whatsapp: 'WhatsApp',
    email: 'Email',
    ready: 'The message is already written: change it if you like, then press send.',
    copy: 'Copy address',
    copied: 'Copied',
    qr: {
      title: 'On a computer?',
      body: 'Scan with your phone. WhatsApp opens there, message ready.',
      alt: 'QR code that opens the same WhatsApp chat on your phone',
    },
    callLabel: 'The call',
    place: 'Phone or video',
    stepsTitle: 'What happens next',
    steps: [
      'You write two lines: your business and what you need.',
      'We usually reply within 24 hours. Together we pick a time for the free 15-minute call, no obligation.',
      'In the call we agree the plan and the timing. The prices are the ones on the site.',
    ],
    band: {
      title: 'Interested? Write to us.',
      lead: 'Two lines are enough: the Twinbyte team answers, not a call centre. We usually reply within 24 hours. Then we talk for 15 minutes, free, by phone, WhatsApp or Google Meet — whichever you prefer.',
    },
    prefill: {
      default: 'Hi Twinbyte, I run a business and would like to talk about what I need. When could we have a quick call?',
      website: 'Hi Twinbyte, I would like a website for my business. When could we talk?',
      assistant: 'Hi Twinbyte, I would like the digital assistant on my website. When could we talk?',
      ads: 'Hi Twinbyte, I would like to run Instagram and Facebook ads for my business. When could we talk?',
      unsure: 'Hi Twinbyte, I run a business and I am not sure yet what I need. When could we talk?',
      assistantPage: 'Hi Twinbyte, I read about the digital assistant and would like it for my business. When could we talk?',
      pricesPage: 'Hi Twinbyte, I have looked at the prices and would like to talk about a plan. When could we talk?',
    },
    mail: {
      subject: '15-minute call with Twinbyte',
      pages: {
        assistant: 'The digital assistant for my business',
        websites: 'A website for my business',
        prices: 'A plan from your price list',
      },
      body: [
        'Hi Twinbyte,',
        '',
        'My business: ',
        'Town: ',
        'What I need (website / digital assistant / online ads): {need}',
        'Days and times that suit me for the 15-minute call: ',
        '',
        'Thanks,',
      ],
    },
    phone: {
      replies: [
        'Happy to. Does Thursday at 10:30 work for a 15-minute call?',
        'Thursday works.',
        'Done. On Thursday at 10:30 we call you — phone, WhatsApp or Meet, as you like.',
      ],
      card: { title: 'Discovery call', meta: 'Thursday 10:30 · 15 min · Phone or video' },
      caption: 'Example conversation, for illustration',
      you: 'You:',
      us: 'Twinbyte:',
      placeholder: 'Write a message',
    },
    proof: {
      eyebrow: 'Try it yourself',
      title: 'A real site with a real assistant. Ask it anything, book a test appointment.',
    },
    promises: {
      title: 'What we promise, in writing',
      items: [
        'Prices on the page: no call needed to know what you pay',
        'Month to month, one month’s notice. No long contract, ever.',
        'The monthly fee covers hosting, the security certificate, a standard domain and small changes.',
        'Online in about a week, once we have your texts and photos.',
        'Small changes (hours, prices, texts, photos): send them on WhatsApp, done within a week.',
        'We usually reply within 24 hours.',
        'No cookies, no tracking, no banner',
        'You talk to the Twinbyte team. No call centre.',
        'Need a shop with hundreds of products? We are not the right people, and we will say so.',
      ],
    },
    priceLine: { text: 'Websites from {site} · Assistant from {assistant} a month', link: 'See every price' },
  },

  nl: {
    title: 'Een gratis gesprek van 15 minuten, op *één bericht* afstand.',
    lead: 'Stuur ons een WhatsApp of een e-mail. We spreken samen een tijd af en praten dan 15 minuten, telefonisch, via WhatsApp of Google Meet — wat u het liefst heeft.',
    topicLabel: 'Waar gaat het over?',
    topics: { website: 'Een website', assistant: 'De assistent', ads: 'Online advertenties', unsure: 'Weet ik nog niet' },
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    ready: 'Het bericht staat al klaar: pas het gerust aan en druk op verzenden.',
    copy: 'Adres kopiëren',
    copied: 'Gekopieerd',
    qr: {
      title: 'Op een computer?',
      body: 'Scan met uw telefoon. WhatsApp opent daar, met het bericht klaar.',
      alt: 'QR-code die hetzelfde WhatsApp-gesprek op uw telefoon opent',
    },
    callLabel: 'Het gesprek',
    place: 'Telefoon of video',
    stepsTitle: 'Wat er daarna gebeurt',
    steps: [
      'U stuurt twee regels: uw bedrijf en wat u nodig heeft.',
      'We antwoorden meestal binnen 24 uur. Samen kiezen we een moment voor het gratis gesprek van 15 minuten, vrijblijvend.',
      'In het gesprek spreken we het pakket en de planning af. De prijzen zijn die op de site.',
    ],
    band: {
      title: 'Interesse? Stuur ons een bericht.',
      lead: 'Twee regels is genoeg: u krijgt antwoord van het team van Twinbyte, niet van een callcenter. We antwoorden meestal binnen 24 uur. Daarna praten we 15 minuten, gratis, telefonisch, via WhatsApp of Google Meet — wat u het liefst heeft.',
    },
    prefill: {
      default: 'Hallo Twinbyte, ik heb een bedrijf en wil graag bespreken wat ik nodig heb. Wanneer kunnen we even bellen?',
      website: 'Hallo Twinbyte, ik wil graag een website voor mijn bedrijf. Wanneer kunnen we even bellen?',
      assistant: 'Hallo Twinbyte, ik wil graag de digitale assistent op mijn website. Wanneer kunnen we even bellen?',
      ads: 'Hallo Twinbyte, ik wil graag adverteren op Instagram en Facebook voor mijn bedrijf. Wanneer kunnen we even bellen?',
      unsure: 'Hallo Twinbyte, ik heb een bedrijf en weet nog niet precies wat ik nodig heb. Wanneer kunnen we even bellen?',
      assistantPage: 'Hallo Twinbyte, ik las over de digitale assistent en wil die graag voor mijn bedrijf. Wanneer kunnen we even bellen?',
      pricesPage: 'Hallo Twinbyte, ik heb de tarieven bekeken en wil graag een pakket bespreken. Wanneer kunnen we even bellen?',
    },
    mail: {
      subject: 'Gesprek van 15 minuten met Twinbyte',
      pages: {
        assistant: 'De digitale assistent voor mijn bedrijf',
        websites: 'Een website voor mijn bedrijf',
        prices: 'Een pakket uit uw prijslijst',
      },
      body: [
        'Hallo Twinbyte,',
        '',
        'Mijn bedrijf: ',
        'Plaats: ',
        'Waar ik hulp bij zoek (website / digitale assistent / online advertenties): {need}',
        'Dagen en tijden die mij uitkomen voor het gesprek van 15 minuten: ',
        '',
        'Met vriendelijke groet,',
      ],
    },
    phone: {
      replies: [
        'Graag! Past donderdag om 10:30 voor een gesprek van 15 minuten?',
        'Donderdag is goed.',
        'Genoteerd. Donderdag om 10:30 bellen we u — telefonisch, via WhatsApp of Meet, wat u wilt.',
      ],
      card: { title: 'Kennismakingsgesprek', meta: 'Donderdag 10:30 · 15 min · Telefoon of video' },
      caption: 'Voorbeeldgesprek, ter illustratie',
      you: 'U:',
      us: 'Twinbyte:',
      placeholder: 'Typ een bericht',
    },
    proof: {
      eyebrow: 'Probeer het zelf',
      title: 'Een echte site met een echte assistent. Stel een vraag, boek een testafspraak.',
    },
    promises: {
      title: 'Wat we beloven, zwart op wit',
      items: [
        'Prijzen op de pagina: geen telefoontje nodig om te weten wat u betaalt',
        'Maand per maand, één maand opzegtermijn. Nooit een lang contract.',
        'Het maandbedrag dekt hosting, het beveiligingscertificaat, een standaard domeinnaam en kleine wijzigingen.',
        'Online in ongeveer een week, zodra we uw teksten en foto’s hebben.',
        'Kleine wijzigingen (openingstijden, prijzen, teksten, foto’s): stuur ze via WhatsApp, binnen een week geregeld.',
        'We antwoorden meestal binnen 24 uur.',
        'Geen cookies, geen tracking, geen banner',
        'U spreekt met het team van Twinbyte. Geen callcenter.',
        'Webshop met honderden producten nodig? Dan zijn wij niet de juiste partij, en dat zeggen we.',
      ],
    },
    priceLine: { text: 'Websites vanaf {site} · Assistent vanaf {assistant} per maand', link: 'Alle prijzen' },
  },

  it: {
    title: 'Una chiamata gratuita di 15 minuti, a *un messaggio* di distanza.',
    lead: 'Scrivici su WhatsApp o per email. Concordiamo l’orario insieme, poi parliamo 15 minuti al telefono, su WhatsApp o in Google Meet, come preferisci.',
    topicLabel: 'Di cosa si tratta?',
    topics: { website: 'Un sito web', assistant: 'L’assistente', ads: 'Pubblicità online', unsure: 'Non lo so ancora' },
    whatsapp: 'WhatsApp',
    email: 'Email',
    ready: 'Il messaggio è già scritto: cambialo se vuoi, poi premi invia.',
    copy: 'Copia l’indirizzo',
    copied: 'Copiato',
    qr: {
      title: 'Sei al computer?',
      body: 'Inquadralo con il telefono: WhatsApp si apre lì, con il messaggio pronto.',
      alt: 'Codice QR che apre la stessa chat WhatsApp sul tuo telefono',
    },
    callLabel: 'La chiamata',
    place: 'Telefono o video',
    stepsTitle: 'Cosa succede dopo',
    steps: [
      'Ci scrivi due righe: che attività hai e cosa ti serve.',
      'Di solito rispondiamo entro 24 ore. Poi fissiamo insieme la chiamata gratuita di 15 minuti, senza impegno.',
      'Nella chiamata concordiamo piano e tempi. I prezzi sono quelli del sito.',
    ],
    band: {
      title: 'Ti interessa? Scrivici.',
      lead: 'Bastano due righe: ti risponde il team Twinbyte, non un call center. Di solito rispondiamo entro 24 ore. Poi parliamo 15 minuti, gratis, al telefono, su WhatsApp o in Google Meet, come preferisci.',
    },
    prefill: {
      default: 'Ciao Twinbyte, ho un’attività e vorrei parlarvi di cosa mi serve. Quando possiamo sentirci?',
      website: 'Ciao Twinbyte, vorrei un sito per la mia attività. Quando possiamo sentirci?',
      assistant: 'Ciao Twinbyte, vorrei l’assistente digitale sul mio sito. Quando possiamo sentirci?',
      ads: 'Ciao Twinbyte, vorrei fare pubblicità su Instagram e Facebook per la mia attività. Quando possiamo sentirci?',
      unsure: 'Ciao Twinbyte, ho un’attività e non so ancora bene cosa mi serve. Quando possiamo sentirci?',
      assistantPage: 'Ciao Twinbyte, ho letto dell’assistente digitale e lo vorrei per la mia attività. Quando possiamo sentirci?',
      pricesPage: 'Ciao Twinbyte, ho visto i prezzi e vorrei parlare di un piano. Quando possiamo sentirci?',
    },
    mail: {
      subject: 'Chiamata di 15 minuti con Twinbyte',
      pages: {
        assistant: 'L’assistente digitale per la mia attività',
        websites: 'Un sito per la mia attività',
        prices: 'Un piano del vostro listino',
      },
      body: [
        'Ciao Twinbyte,',
        '',
        'La mia attività: ',
        'Città: ',
        'Di cosa ho bisogno (sito web / assistente digitale / pubblicità online): {need}',
        'Giorni e orari in cui posso fare la chiamata di 15 minuti: ',
        '',
        'Grazie,',
      ],
    },
    phone: {
      replies: [
        'Volentieri! Giovedì alle 10:30 ti va bene per una chiamata di 15 minuti?',
        'Giovedì va bene.',
        'Fatto. Giovedì alle 10:30 ti chiamiamo: al telefono, su WhatsApp o in Meet, come preferisci.',
      ],
      card: { title: 'Chiamata conoscitiva', meta: 'Giovedì 10:30 · 15 min · Telefono o video' },
      caption: 'Conversazione di esempio, a scopo illustrativo',
      you: 'Tu:',
      us: 'Twinbyte:',
      placeholder: 'Scrivi un messaggio',
    },
    proof: {
      eyebrow: 'Provalo tu',
      title: 'Un sito vero con un assistente vero. Fagli una domanda, prenota un appuntamento di prova.',
    },
    promises: {
      title: 'Quello che promettiamo, per iscritto',
      items: [
        'Prezzi sulla pagina: non serve una telefonata per sapere quanto spendi',
        'Mese per mese, un mese di preavviso. Mai un contratto lungo.',
        'Il canone mensile copre hosting, certificato di sicurezza, un dominio standard e piccole modifiche.',
        'Online in circa una settimana, da quando abbiamo testi e foto.',
        'Piccole modifiche (orari, prezzi, testi, foto): mandacele su WhatsApp, fatte entro una settimana.',
        'Di solito rispondiamo entro 24 ore.',
        'Niente cookie, niente tracciamento, niente banner',
        'Parli con il team Twinbyte. Nessun call center.',
        'Ti serve un e-commerce con centinaia di prodotti? Non siamo le persone giuste, e te lo diciamo.',
      ],
    },
    priceLine: { text: 'Siti da {site} · Assistente da {assistant} al mese', link: 'Tutti i prezzi' },
  },
}

/** The "What I need" value: the topic's label with a lower-case first letter. */
export function needOf(label: string): string {
  return label ? label.charAt(0).toLocaleLowerCase() + label.slice(1) : ''
}

/** The email body, one line per item, with the need filled in (or left empty). */
export function mailBody(lang: Lang, need: string): string {
  return contact[lang].mail.body.map((line) => line.replace('{need}', need)).join('\n')
}
