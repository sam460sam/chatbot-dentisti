import type { Lang } from './types'

/*
 * Copy for the booking page and the pages around it. Kept apart from the big
 * site translations so this page can change without touching those.
 * Dutch uses "u", like the rest of the Dutch site.
 */
export interface BookingCopy {
  nav: { book: string; assistant: string; websites: string; prices: string }
  hero: {
    eyebrow: string
    title: string
    lead: string
    or: string
    request: string
    whatsapp: string
    waText: string
    note: string
  }
  card: {
    who: string
    title: string
    coversTitle: string
    covers: string[]
    duration: string
    place: string
    free: string
    tz: (zone: string) => string
  }
  pick: {
    day: string
    time: string
    noSlotsDay: string
    noneAtAll: string
    loading: string
    unavailable: string
    back: string
    change: string
    weekdays: string[]
  }
  form: {
    title: string
    name: string
    email: string
    phone: string
    business: string
    message: string
    optional: string
    consentBefore: string
    consentLink: string
    consentAfter: string
    submit: string
    sending: string
    required: string
    badEmail: string
    badPhone: string
    needConsent: string
  }
  errors: { slot_taken: string; already_booked: string; generic: string; bot: string }
  done: {
    title: string
    body: (email: string) => string
    meet: string
    add: string
    whatsapp: string
  }
  request: {
    title: string
    lead: string
    message: string
    submit: string
    done: (email: string) => string
    back: string
    waText: string
  }
  related: {
    eyebrow: string
    title: string
    lead: string
    cards: { key: 'assistant' | 'websites' | 'prices' | 'showcase'; tag: string; title: string; body: string; cta: string }[]
  }
  closing: { title: string; lead: string; book: string; whatsapp: string }
  page: { book: string; bookLead: string }
  float: string
  privacy: { title: string; body: string[] }
}

export const booking: Record<Lang, BookingCopy> = {
  en: {
    nav: { book: 'Book a call', assistant: 'Digital assistant', websites: 'Websites', prices: 'Prices' },
    hero: {
      eyebrow: 'Discovery call · 15 minutes · free',
      title: 'Let’s talk about your business.',
      lead: '15 minutes to get to know each other, understand what you need, and show you how we work.',
      or: 'Or',
      request: 'Send a request',
      whatsapp: 'WhatsApp us',
      waText: 'Hi Twinbyte, I would like to talk about my business.',
      note: 'You always talk to us, Anna or Samuele. There is no call centre.',
    },
    card: {
      who: 'Anna & Samuele · Twinbyte',
      title: 'Discovery call',
      coversTitle: 'What we cover',
      covers: ['Introductions', 'Your business and what you need', 'How we work', 'Next steps'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Free, no obligation',
      tz: (z) => `Times in your time zone · ${z}`,
    },
    pick: {
      day: 'Choose a day',
      time: 'Choose a time',
      noSlotsDay: 'No free times left on this day.',
      noneAtAll: 'No free times in the next two weeks. Send us a request or a WhatsApp and we will find one.',
      loading: 'Loading free times…',
      unavailable: 'Booking is not available right now. Send us a request or a WhatsApp and we will answer just as fast.',
      back: 'Back',
      change: 'Change',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    form: {
      title: 'Your details',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      business: 'Business name',
      message: 'Anything we should know?',
      optional: 'optional',
      consentBefore: 'I agree that Twinbyte uses these details to arrange this call, as described in the ',
      consentLink: 'privacy statement',
      consentAfter: '.',
      submit: 'Book the call',
      sending: 'Booking…',
      required: 'Please fill this in.',
      badEmail: 'This does not look like an email address.',
      badPhone: 'Please enter a phone number.',
      needConsent: 'Please tick the box to continue.',
    },
    errors: {
      slot_taken: 'Someone just took this time. Please pick another one.',
      already_booked: 'You already have a call booked with us. To move it, reply to the confirmation email or message us on WhatsApp.',
      generic: 'Something went wrong on our side. Please try again, or message us on WhatsApp.',
      bot: 'That was quick. Please wait a moment and try again.',
    },
    done: {
      title: 'You’re booked.',
      body: (e) => `We sent the details to ${e}. Google Calendar will also send you an invitation with the same link.`,
      meet: 'Google Meet link',
      add: 'Add to Google Calendar',
      whatsapp: 'Questions before the call? WhatsApp us',
    },
    request: {
      title: 'Send us a request',
      lead: 'Tell us what you need. We will write back by email.',
      message: 'What do you need?',
      submit: 'Send request',
      done: (e) => `Thank you, we have it. We will write back to ${e}.`,
      back: 'Back to booking',
      waText: 'Hi Twinbyte, I have a question.',
    },
    related: {
      eyebrow: 'Before you book',
      title: 'Want to look around first?',
      lead: 'Everything we do, on separate pages. Read what you need, then book the call.',
      cards: [
        { key: 'assistant', tag: 'Digital assistant', title: 'Answers your customers when you cannot', body: 'It sits on your website, answers from your information only, and books appointments into the calendar you already use.', cta: 'How the assistant works' },
        { key: 'websites', tag: 'Websites', title: 'The page they judge you on', body: 'Fast, clear websites for small businesses: hours, prices, where you are, one tap to call.', cta: 'What a website includes' },
        { key: 'prices', tag: 'Prices', title: 'The whole price list, on the page', body: 'Every plan with its price. The first three clients get the launch offer.', cta: 'See the prices' },
        { key: 'showcase', tag: 'Showcase', title: 'What we can build', body: 'A scroll-driven page we built to show the kind of work we do.', cta: 'Open the showcase' },
      ],
    },
    closing: {
      title: 'A missed call does not leave a message. It calls the next business on the list.',
      lead: '15 minutes is enough to see whether we can help.',
      book: 'Book the 15-minute call',
      whatsapp: 'WhatsApp us',
    },
    page: { book: 'Book a free 15-minute call', bookLead: 'Questions about this page? Ask them in the call.' },
    float: 'WhatsApp',
    privacy: {
      title: 'When you book a call or send a request',
      body: [
        'When you book a call, we process your name, email address, phone number, business name, the message you add, the time you choose, the language of the page and your time zone. When you send a request, we process the same details except the time.',
        'We use them only to arrange and hold the call or answer your request. The legal basis is the steps you ask us to take before a possible agreement (Art. 6(1)(b) GDPR) and your consent, which you give with the tick box and can withdraw at any time.',
        'The booking is stored as an event in our Google Calendar, Google creates the Google Meet link and sends you the invitation, and our emails go through Gmail. Google is therefore a recipient of these details. Google may process data outside the EU; Google LLC is certified under the EU-US Data Privacy Framework.',
        'To keep automated spam out, the forms may use Cloudflare Turnstile, which checks the browser without cookies. Cloudflare’s Turnstile privacy addendum applies: https://www.cloudflare.com/turnstile-privacy-policy/',
        'We delete the calendar event and the emails within 12 months after the call, unless the conversation becomes an agreement, in which case we keep what the law requires.',
      ],
    },
  },

  nl: {
    nav: { book: 'Plan een gesprek', assistant: 'Digitale assistent', websites: 'Websites', prices: 'Tarieven' },
    hero: {
      eyebrow: 'Kennismakingsgesprek · 15 minuten · gratis',
      title: 'Laten we het over uw bedrijf hebben.',
      lead: '15 minuten om kennis te maken, te begrijpen wat u nodig heeft en te laten zien hoe we werken.',
      or: 'Of',
      request: 'Stuur een aanvraag',
      whatsapp: 'Stuur een WhatsApp',
      waText: 'Hallo Twinbyte, ik wil graag over mijn bedrijf praten.',
      note: 'U spreekt altijd met ons, Anna of Samuele. Er is geen callcenter.',
    },
    card: {
      who: 'Anna & Samuele · Twinbyte',
      title: 'Kennismakingsgesprek',
      coversTitle: 'Waar we het over hebben',
      covers: ['Kennismaking', 'Uw bedrijf en wat u nodig heeft', 'Hoe wij werken', 'De volgende stap'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Gratis, vrijblijvend',
      tz: (z) => `Tijden in uw tijdzone · ${z}`,
    },
    pick: {
      day: 'Kies een dag',
      time: 'Kies een tijd',
      noSlotsDay: 'Op deze dag is niets meer vrij.',
      noneAtAll: 'De komende twee weken is er niets vrij. Stuur een aanvraag of een WhatsApp, dan zoeken we samen een moment.',
      loading: 'Vrije tijden laden…',
      unavailable: 'Plannen lukt op dit moment niet. Stuur een aanvraag of een WhatsApp, dan reageren we net zo snel.',
      back: 'Terug',
      change: 'Wijzigen',
      weekdays: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
    },
    form: {
      title: 'Uw gegevens',
      name: 'Naam',
      email: 'E-mail',
      phone: 'Telefoon',
      business: 'Bedrijfsnaam',
      message: 'Is er iets dat we moeten weten?',
      optional: 'optioneel',
      consentBefore: 'Ik ga ermee akkoord dat Twinbyte deze gegevens gebruikt om dit gesprek te plannen, zoals beschreven in de ',
      consentLink: 'privacyverklaring',
      consentAfter: '.',
      submit: 'Gesprek inplannen',
      sending: 'Bezig met inplannen…',
      required: 'Vul dit veld in.',
      badEmail: 'Dit lijkt geen e-mailadres.',
      badPhone: 'Vul een telefoonnummer in.',
      needConsent: 'Vink het vakje aan om verder te gaan.',
    },
    errors: {
      slot_taken: 'Iemand heeft deze tijd net geboekt. Kies een andere tijd.',
      already_booked: 'U heeft al een gesprek met ons gepland. Wilt u het verzetten? Beantwoord de bevestigingsmail of stuur ons een WhatsApp.',
      generic: 'Er ging aan onze kant iets mis. Probeer het opnieuw, of stuur ons een WhatsApp.',
      bot: 'Dat ging snel. Wacht even en probeer het opnieuw.',
    },
    done: {
      title: 'Het gesprek staat gepland.',
      body: (e) => `We hebben de gegevens naar ${e} gestuurd. U krijgt van Google Agenda ook een uitnodiging met dezelfde link.`,
      meet: 'Google Meet-link',
      add: 'Zet het in Google Agenda',
      whatsapp: 'Vragen vóór het gesprek? Stuur een WhatsApp',
    },
    request: {
      title: 'Stuur ons een aanvraag',
      lead: 'Vertel wat u nodig heeft. We antwoorden per e-mail.',
      message: 'Waar kunnen we u mee helpen?',
      submit: 'Aanvraag versturen',
      done: (e) => `Dank u, we hebben het ontvangen. We antwoorden naar ${e}.`,
      back: 'Terug naar plannen',
      waText: 'Hallo Twinbyte, ik heb een vraag.',
    },
    related: {
      eyebrow: 'Eerst rondkijken?',
      title: 'Wilt u eerst meer weten?',
      lead: 'Alles wat we doen, op aparte pagina’s. Lees wat u nodig heeft en plan dan het gesprek.',
      cards: [
        { key: 'assistant', tag: 'Digitale assistent', title: 'Staat uw klanten te woord als u dat niet kunt', body: 'Hij staat op uw website, antwoordt alleen met uw eigen informatie en zet afspraken in de agenda die u al gebruikt.', cta: 'Hoe de assistent werkt' },
        { key: 'websites', tag: 'Websites', title: 'De pagina waarop men u beoordeelt', body: 'Snelle, duidelijke websites voor kleine bedrijven: openingstijden, prijzen, waar u zit, met één tik bellen.', cta: 'Wat een website omvat' },
        { key: 'prices', tag: 'Tarieven', title: 'De hele prijslijst, gewoon op de pagina', body: 'Elk pakket met zijn prijs. De eerste drie klanten krijgen het introductieaanbod.', cta: 'Bekijk de tarieven' },
        { key: 'showcase', tag: 'Showcase', title: 'Wat we kunnen bouwen', body: 'Een pagina die meebeweegt met het scrollen, gebouwd om te laten zien wat voor werk we maken.', cta: 'Open de showcase' },
      ],
    },
    closing: {
      title: 'Een gemiste oproep laat geen bericht achter. Die belt het volgende bedrijf op de lijst.',
      lead: '15 minuten is genoeg om te zien of we u kunnen helpen.',
      book: 'Plan het gesprek van 15 minuten',
      whatsapp: 'Stuur een WhatsApp',
    },
    page: { book: 'Plan een gratis gesprek van 15 minuten', bookLead: 'Vragen over deze pagina? Stel ze in het gesprek.' },
    float: 'WhatsApp',
    privacy: {
      title: 'Als u een gesprek plant of een aanvraag stuurt',
      body: [
        'Als u een gesprek plant, verwerken we uw naam, e-mailadres, telefoonnummer, bedrijfsnaam, het bericht dat u toevoegt, de gekozen tijd, de taal van de pagina en uw tijdzone. Bij een aanvraag verwerken we dezelfde gegevens, behalve de tijd.',
        'We gebruiken ze alleen om het gesprek te plannen en te voeren, of om uw aanvraag te beantwoorden. De grondslag is de stap die u ons vraagt te zetten vóór een mogelijke overeenkomst (art. 6 lid 1 sub b AVG) en uw toestemming, die u met het vinkje geeft en altijd kunt intrekken.',
        'De afspraak wordt als afspraak in onze Google Agenda opgeslagen, Google maakt de Google Meet-link aan en stuurt u de uitnodiging, en onze e-mails gaan via Gmail. Google is dus ontvanger van deze gegevens. Google kan gegevens buiten de EU verwerken; Google LLC is gecertificeerd onder het EU-VS Data Privacy Framework.',
        'Om geautomatiseerde spam tegen te houden kunnen de formulieren Cloudflare Turnstile gebruiken, dat de browser controleert zonder cookies. Daarvoor geldt de Turnstile-privacybijlage van Cloudflare: https://www.cloudflare.com/turnstile-privacy-policy/',
        'We verwijderen de agenda-afspraak en de e-mails binnen 12 maanden na het gesprek, tenzij het gesprek tot een overeenkomst leidt; dan bewaren we wat de wet vraagt.',
      ],
    },
  },

  it: {
    nav: { book: 'Prenota una chiamata', assistant: 'Assistente digitale', websites: 'Siti web', prices: 'Prezzi' },
    hero: {
      eyebrow: 'Chiamata conoscitiva · 15 minuti · gratuita',
      title: 'Parliamo della tua attività.',
      lead: '15 minuti per conoscerci, capire cosa ti serve e mostrarti come lavoriamo.',
      or: 'Oppure',
      request: 'Invia una richiesta',
      whatsapp: 'Scrivici su WhatsApp',
      waText: 'Ciao Twinbyte, vorrei parlare della mia attività.',
      note: 'Parli sempre con noi, Anna o Samuele. Nessun call center.',
    },
    card: {
      who: 'Anna & Samuele · Twinbyte',
      title: 'Chiamata conoscitiva',
      coversTitle: 'Di cosa parliamo',
      covers: ['Presentazioni', 'La tua attività e cosa ti serve', 'Come lavoriamo', 'I prossimi passi'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Gratuita, senza impegno',
      tz: (z) => `Orari nel tuo fuso · ${z}`,
    },
    pick: {
      day: 'Scegli un giorno',
      time: 'Scegli un orario',
      noSlotsDay: 'In questo giorno non ci sono più orari liberi.',
      noneAtAll: 'Nelle prossime due settimane non ci sono orari liberi. Mandaci una richiesta o un WhatsApp e lo troviamo insieme.',
      loading: 'Carico gli orari liberi…',
      unavailable: 'In questo momento non si può prenotare. Mandaci una richiesta o un WhatsApp: rispondiamo altrettanto in fretta.',
      back: 'Indietro',
      change: 'Cambia',
      weekdays: ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'],
    },
    form: {
      title: 'I tuoi dati',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      business: 'Nome dell’attività',
      message: 'C’è qualcosa che dovremmo sapere?',
      optional: 'facoltativo',
      consentBefore: 'Acconsento a che Twinbyte usi questi dati per organizzare la chiamata, come descritto nell’',
      consentLink: 'informativa privacy',
      consentAfter: '.',
      submit: 'Prenota la chiamata',
      sending: 'Prenoto…',
      required: 'Compila questo campo.',
      badEmail: 'Questo non sembra un indirizzo email.',
      badPhone: 'Inserisci un numero di telefono.',
      needConsent: 'Spunta la casella per continuare.',
    },
    errors: {
      slot_taken: 'Qualcuno ha appena preso questo orario. Scegline un altro.',
      already_booked: 'Hai già una chiamata prenotata con noi. Per spostarla, rispondi all’email di conferma o scrivici su WhatsApp.',
      generic: 'Qualcosa non ha funzionato da parte nostra. Riprova, oppure scrivici su WhatsApp.',
      bot: 'Troppo veloce. Aspetta un attimo e riprova.',
    },
    done: {
      title: 'Prenotazione fatta.',
      body: (e) => `Ti abbiamo mandato i dettagli a ${e}. Riceverai anche un invito da Google Calendar con lo stesso link.`,
      meet: 'Link Google Meet',
      add: 'Aggiungi a Google Calendar',
      whatsapp: 'Domande prima della chiamata? Scrivici su WhatsApp',
    },
    request: {
      title: 'Inviaci una richiesta',
      lead: 'Raccontaci cosa ti serve. Ti rispondiamo per email.',
      message: 'Di cosa hai bisogno?',
      submit: 'Invia la richiesta',
      done: (e) => `Grazie, l’abbiamo ricevuta. Ti rispondiamo a ${e}.`,
      back: 'Torna alla prenotazione',
      waText: 'Ciao Twinbyte, ho una domanda.',
    },
    related: {
      eyebrow: 'Prima di prenotare',
      title: 'Vuoi dare prima un’occhiata?',
      lead: 'Tutto quello che facciamo, in pagine separate. Leggi quello che ti serve, poi prenota la chiamata.',
      cards: [
        { key: 'assistant', tag: 'Assistente digitale', title: 'Risponde ai tuoi clienti quando tu non puoi', body: 'Sta sul tuo sito, risponde solo con le tue informazioni e fissa gli appuntamenti nell’agenda che usi già.', cta: 'Come funziona l’assistente' },
        { key: 'websites', tag: 'Siti web', title: 'La pagina su cui ti giudicano', body: 'Siti veloci e chiari per piccole attività: orari, prezzi, dove sei, un tocco per chiamare.', cta: 'Cosa comprende un sito' },
        { key: 'prices', tag: 'Prezzi', title: 'Il listino completo, scritto sulla pagina', body: 'Ogni piano con il suo prezzo. I primi tre clienti hanno l’offerta di lancio.', cta: 'Vedi i prezzi' },
        { key: 'showcase', tag: 'Showcase', title: 'Cosa possiamo costruire', body: 'Una pagina che si muove con lo scroll, costruita per mostrare il tipo di lavoro che facciamo.', cta: 'Apri lo showcase' },
      ],
    },
    closing: {
      title: 'Una chiamata persa non lascia messaggi. Chiama l’attività successiva sulla lista.',
      lead: '15 minuti bastano per capire se possiamo aiutarti.',
      book: 'Prenota la chiamata da 15 minuti',
      whatsapp: 'Scrivici su WhatsApp',
    },
    page: { book: 'Prenota una chiamata gratuita di 15 minuti', bookLead: 'Domande su questa pagina? Falle durante la chiamata.' },
    float: 'WhatsApp',
    privacy: {
      title: 'Quando prenoti una chiamata o invii una richiesta',
      body: [
        'Quando prenoti una chiamata trattiamo nome, indirizzo email, numero di telefono, nome dell’attività, il messaggio che aggiungi, l’orario scelto, la lingua della pagina e il tuo fuso orario. Quando invii una richiesta trattiamo gli stessi dati, tranne l’orario.',
        'Li usiamo solo per organizzare e fare la chiamata, o per rispondere alla tua richiesta. La base giuridica sono le misure che ci chiedi prima di un possibile contratto (art. 6, par. 1, lett. b GDPR) e il tuo consenso, che dai con la casella e puoi revocare in qualsiasi momento.',
        'La prenotazione viene salvata come evento nel nostro Google Calendar, Google crea il link Google Meet e ti manda l’invito, e le nostre email passano da Gmail. Google è quindi destinatario di questi dati. Google può trattare i dati fuori dall’UE; Google LLC è certificata secondo l’EU-US Data Privacy Framework.',
        'Per fermare lo spam automatico i moduli possono usare Cloudflare Turnstile, che controlla il browser senza cookie. Vale l’addendum privacy di Turnstile di Cloudflare: https://www.cloudflare.com/turnstile-privacy-policy/',
        'Cancelliamo l’evento in calendario e le email entro 12 mesi dalla chiamata, a meno che la conversazione non diventi un contratto: in quel caso conserviamo quello che la legge richiede.',
      ],
    },
  },
}
