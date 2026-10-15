import type { Lang } from './types'
import { contact } from './contact'

/*
 * Copy for the booking page and the pages around it. Kept apart from the big
 * site translations so this page can change without touching those.
 * Dutch uses "u", like the rest of the Dutch site.
 */
export interface BookingCopy {
  nav: { book: string; bookShort: string; assistant: string; websites: string; prices: string }
  hero: {
    eyebrow: string
    title: string
    lead: string
    or: string
    request: string
    whatsapp: string
    /** the default WhatsApp message: contact[lang].prefill.default */
    waText: string
    email: string
    note: string
  }
  card: {
    who: string
    team: string
    title: string
    coversTitle: string
    covers: string[]
    duration: string
    place: string
    free: string
    tz: (zone: string) => string
    prep: string
    prepLink: string
  }
  pick: {
    day: string
    time: string
    noSlotsDay: string
    noneAtAll: string
    loading: string
    unavailableTitle: string
    unavailable: string
    email: string
    emailSubject: string
    back: string
    change: string
    changeLabel: string
    retry: string
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
  errors: {
    slot_taken: string; already_booked: (when: string) => string; generic: string; bot: string; verifying: string; waCta: string
    /* the request could not be sent: what the visitor typed goes on by WhatsApp or email */
    notSent: string; byWhatsApp: string; byEmail: string
  }
  done: {
    title: string
    body: (email: string) => string
    next: string
    meet: string
    add: string
    whatsapp: string
  }
  request: {
    title: string
    lead: string
    message: string
    submit: string
    sending: string
    consentBefore: string
    doneTitle: string
    done: (email: string) => string
    back: string
    waText: string
    mailSubject: string
  }
  related: {
    eyebrow: string
    title: string
    lead: string
    cards: { key: 'assistant' | 'websites' | 'prices' | 'showcase'; tag: string; title: string; body: string; cta: string }[]
  }
  closing: { title: string; lead: string; book: string; whatsapp: string }
  page: { book: string; bookLead: string }
  mail: { websitesSubject: string; bundleWa: string }
  float: string
  privacy: { title: string; body: string[] }
}

export const booking: Record<Lang, BookingCopy> = {
  en: {
    nav: { book: 'Write to us', bookShort: 'Contact', assistant: 'Digital assistant', websites: 'Websites', prices: 'Prices' },
    hero: {
      eyebrow: 'Discovery call · 15 minutes · free',
      title: 'The shop is closed. Your website isn’t.',
      lead: 'We build fast websites like this one for local businesses, with an assistant that answers your customers and books their appointments, even at night. And if you want them, Instagram and Facebook ads for people nearby.',
      or: 'Or',
      request: 'Send a request',
      whatsapp: 'WhatsApp us',
      waText: contact.en.prefill.default,
      email: 'Email us',
      note: 'You always talk directly to the Twinbyte team. There is no call centre.',
    },
    card: {
      who: 'Twinbyte',
      team: 'Digital studio for local businesses',
      title: 'Discovery call',
      coversTitle: 'What we cover',
      covers: ['Introductions', 'Your business and what you need', 'How we work', 'Next steps'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Free, no obligation',
      tz: (z) => `Times in your time zone: ${z}`,
      prep: 'No preparation needed. And you do not need a call to find out what it costs: the prices are on the site.',
      prepLink: 'See the prices',
    },
    pick: {
      day: 'Choose a day',
      time: 'Choose a time',
      noSlotsDay: 'No free times left on this day.',
      noneAtAll: 'No free times in the next two weeks. Send us a request or a WhatsApp and we will find one.',
      loading: 'Loading free times…',
      unavailableTitle: 'Book with a message',
      unavailable: 'The online calendar is not reachable right now. Write to us and we will find a time with you, just as fast.',
      email: 'Email us',
      emailSubject: 'Booking a discovery call',
      back: 'Back',
      change: 'Change',
      changeLabel: 'Change the time',
      retry: 'Try again',
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
      badPhone: 'This number does not look right. Write it in full, with digits, spaces or +.',
      needConsent: 'Please tick the box to continue.',
    },
    errors: {
      slot_taken: 'Someone just took this time. Please pick another one.',
      already_booked: (w) => `You already have a call booked with us${w ? `: ${w}` : ''}. To move it, reply to the confirmation email or message us on WhatsApp.`,
      generic: 'Something went wrong on our side. Please try again, or message us on WhatsApp.',
      bot: 'That was quick. Please wait a moment and try again.',
      verifying: 'One moment: we are checking that the form is not spam. Press again in a few seconds.',
      waCta: 'Open WhatsApp',
      notSent: 'We could not send it from here. Your message is ready to go by WhatsApp or email: one tap, nothing to type again.',
      byWhatsApp: 'Send by WhatsApp',
      byEmail: 'Send by email',
    },
    done: {
      title: 'You’re booked.',
      body: (e) => `We sent the details to ${e}. Google Calendar will also send you an invitation with the same link.`,
      next: 'No preparation needed. Need another time? Reply to the confirmation email or message us on WhatsApp.',
      meet: 'Google Meet link',
      add: 'Add to Google Calendar',
      whatsapp: 'Questions before the call? WhatsApp us',
    },
    request: {
      title: 'Send us a request',
      lead: 'Tell us what you need. We will write back by email.',
      message: 'What do you need?',
      submit: 'Send request',
      sending: 'Sending…',
      consentBefore: 'I agree that Twinbyte uses these details to answer my request, as described in the ',
      doneTitle: 'Request received.',
      done: (e) => `Thank you, we have it. We will write back to ${e}.`,
      back: 'Back to booking',
      waText: 'Hi Twinbyte, I have a question.',
      mailSubject: 'Request from the website',
    },
    related: {
      eyebrow: 'What we do',
      title: 'Three things, done properly.',
      lead: 'Read what interests you. Website and assistant prices are on the site; ads we agree with you.',
      cards: [
        { key: 'assistant', tag: 'Digital assistant', title: 'Answers your customers when you cannot', body: 'It sits on your website, answers from your information only, and books appointments into the calendar you already use.', cta: 'How the assistant works' },
        { key: 'websites', tag: 'Websites', title: 'The page they judge you on', body: 'Fast, clear websites for small businesses: hours, prices, where you are, one tap to call.', cta: 'What a website includes' },
        { key: 'prices', tag: 'Prices', title: 'The whole price list, on the page', body: 'Every plan with its price. The first three clients get the launch offer.', cta: 'See the prices' },
        { key: 'showcase', tag: 'Showcase', title: 'What we can build', body: 'A scroll-driven page we built to show the kind of work we do.', cta: 'Open the showcase' },
      ],
    },
    closing: {
      title: 'A missed call does not leave a message. It calls the next business on the list.',
      lead: 'Send us two lines: what your business is and what you need. We set up the free 15-minute call at a time that suits you.',
      book: 'Book the 15-minute call',
      whatsapp: 'WhatsApp us',
    },
    page: { book: 'Book a free 15-minute call', bookLead: 'Questions about this page? Ask them in the call.' },
    mail: { websitesSubject: 'Question about a website for my business', bundleWa: 'Hi Twinbyte, I am interested in the Full site + Assistant bundle. When could we talk?' },
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
    nav: { book: 'Neem contact op', bookShort: 'Contact', assistant: 'Digitale assistent', websites: 'Websites', prices: 'Tarieven' },
    hero: {
      eyebrow: 'Kennismakings\u00ADgesprek · 15 minuten · gratis',
      title: 'De winkel is dicht. Uw website niet.',
      lead: 'Wij bouwen snelle websites zoals deze voor lokale bedrijven, met een assistent die uw klanten antwoordt en hun afspraken inplant, ook ’s avonds laat. En als u wilt: advertenties op Instagram en Facebook voor mensen in uw buurt.',
      or: 'Of',
      request: 'Stuur een aanvraag',
      whatsapp: 'Stuur een WhatsApp',
      waText: contact.nl.prefill.default,
      email: 'Stuur een e-mail',
      note: 'U spreekt altijd rechtstreeks met het team van Twinbyte. Er is geen callcenter.',
    },
    card: {
      who: 'Twinbyte',
      team: 'Digitale studio voor lokale bedrijven',
      title: 'Kennismakings\u00ADgesprek',
      coversTitle: 'Waar we het over hebben',
      covers: ['Kennismaking', 'Uw bedrijf en wat u nodig heeft', 'Hoe wij werken', 'De volgende stap'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Gratis, vrijblijvend',
      tz: (z) => `Tijden in uw tijdzone: ${z}`,
      prep: 'U hoeft niets voor te bereiden. En u hoeft niet te bellen om te weten wat het kost: de tarieven staan op de site.',
      prepLink: 'Bekijk de tarieven',
    },
    pick: {
      day: 'Kies een dag',
      time: 'Kies een tijdstip',
      noSlotsDay: 'Op deze dag is niets meer vrij.',
      noneAtAll: 'De komende twee weken is er niets vrij. Stuur een aanvraag of een WhatsApp, dan zoeken we samen een moment.',
      loading: 'Vrije tijden laden…',
      unavailableTitle: 'Plan via een bericht',
      unavailable: 'De online agenda is nu even niet bereikbaar. Stuur ons een bericht, dan zoeken we samen een moment, net zo snel.',
      email: 'Stuur een e-mail',
      emailSubject: 'Een kennismakingsgesprek plannen',
      back: 'Terug',
      change: 'Wijzigen',
      changeLabel: 'Tijd wijzigen',
      retry: 'Opnieuw proberen',
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
      badPhone: 'Dit nummer lijkt niet te kloppen. Vul het volledig in, met cijfers, spaties of +.',
      needConsent: 'Vink het vakje aan om verder te gaan.',
    },
    errors: {
      slot_taken: 'Iemand heeft deze tijd net geboekt. Kies een andere tijd.',
      already_booked: (w) => `U heeft al een gesprek met ons gepland${w ? `: ${w}` : ''}. Wilt u het verzetten? Beantwoord de bevestigingsmail of stuur ons een WhatsApp.`,
      generic: 'Er ging aan onze kant iets mis. Probeer het opnieuw, of stuur ons een WhatsApp.',
      bot: 'Dat ging snel. Wacht even en probeer het opnieuw.',
      verifying: 'Een moment: we controleren of het formulier geen spam is. Druk over een paar seconden opnieuw.',
      waCta: 'Open WhatsApp',
      notSent: 'Versturen lukte hier niet. Uw bericht staat klaar voor WhatsApp of e-mail: één tik, niets opnieuw typen.',
      byWhatsApp: 'Verstuur via WhatsApp',
      byEmail: 'Verstuur per e-mail',
    },
    done: {
      title: 'Het gesprek staat gepland.',
      body: (e) => `We hebben de gegevens naar ${e} gestuurd. U krijgt van Google Agenda ook een uitnodiging met dezelfde link.`,
      next: 'U hoeft niets voor te bereiden. Komt het toch niet uit? Beantwoord de bevestigingsmail of stuur ons een WhatsApp.',
      meet: 'Google Meet-link',
      add: 'Zet het in Google Agenda',
      whatsapp: 'Vragen vóór het gesprek? Stuur een WhatsApp',
    },
    request: {
      title: 'Stuur ons een aanvraag',
      lead: 'Vertel wat u nodig heeft. We antwoorden per e-mail.',
      message: 'Waar kunnen we u mee helpen?',
      submit: 'Aanvraag versturen',
      sending: 'Bezig met versturen…',
      consentBefore: 'Ik ga ermee akkoord dat Twinbyte deze gegevens gebruikt om mijn aanvraag te beantwoorden, zoals beschreven in de ',
      doneTitle: 'Aanvraag ontvangen.',
      done: (e) => `Dank u, we hebben het ontvangen. We antwoorden naar ${e}.`,
      back: 'Terug naar plannen',
      waText: 'Hallo Twinbyte, ik heb een vraag.',
      mailSubject: 'Aanvraag via de website',
    },
    related: {
      eyebrow: 'Wat we doen',
      title: 'Drie dingen, goed gedaan.',
      lead: 'Lees wat u interesseert. De prijzen van websites en assistent staan op de site; advertenties spreken we met u af.',
      cards: [
        { key: 'assistant', tag: 'Digitale assistent', title: 'Staat uw klanten te woord als u dat niet kunt', body: 'Hij staat op uw website, antwoordt alleen met uw eigen informatie en zet afspraken in de agenda die u al gebruikt.', cta: 'Hoe de assistent werkt' },
        { key: 'websites', tag: 'Websites', title: 'De pagina waarop klanten u beoordelen', body: 'Snelle, duidelijke websites voor kleine bedrijven: openingstijden, prijzen, waar u zit, met één tik bellen.', cta: 'Wat u krijgt bij een website' },
        { key: 'prices', tag: 'Tarieven', title: 'De hele prijslijst, gewoon op de pagina', body: 'Elk pakket met zijn prijs. De eerste drie klanten krijgen het introductieaanbod.', cta: 'Bekijk de tarieven' },
        { key: 'showcase', tag: 'Showcase', title: 'Wat we kunnen bouwen', body: 'Een pagina die meebeweegt met het scrollen, gebouwd om te laten zien wat voor werk we maken.', cta: 'Open de showcase' },
      ],
    },
    closing: {
      title: 'Wie u niet bereikt, spreekt geen bericht in. Die belt het volgende bedrijf op de lijst.',
      lead: 'Stuur ons twee regels: wat voor bedrijf u heeft en wat u nodig heeft. Het gratis gesprek van 15 minuten plannen we op een moment dat u uitkomt.',
      book: 'Plan het gesprek van 15 minuten',
      whatsapp: 'Stuur een WhatsApp',
    },
    page: { book: 'Plan een gratis gesprek van 15 minuten', bookLead: 'Vragen over deze pagina? Stel ze in het gesprek.' },
    mail: { websitesSubject: 'Vraag over een website voor mijn bedrijf', bundleWa: 'Hallo Twinbyte, ik heb interesse in het pakket Volledige site + Assistent. Wanneer kunnen we even bellen?' },
    float: 'WhatsApp',
    privacy: {
      title: 'Als u een gesprek plant of een aanvraag stuurt',
      body: [
        'Als u een gesprek plant, verwerken we uw naam, e-mailadres, telefoonnummer, bedrijfsnaam, het bericht dat u toevoegt, de gekozen tijd, de taal van de pagina en uw tijdzone. Bij een aanvraag verwerken we dezelfde gegevens, behalve de tijd.',
        'We gebruiken ze alleen om het gesprek te plannen en te voeren, of om uw aanvraag te beantwoorden. De grondslag is de stap die u ons vraagt te zetten vóór een mogelijke overeenkomst (art. 6 lid 1 sub b AVG) en uw toestemming, die u met het vinkje geeft en altijd kunt intrekken.',
        'De boeking wordt als afspraak in onze Google Agenda opgeslagen, Google maakt de Google Meet-link aan en stuurt u de uitnodiging, en onze e-mails gaan via Gmail. Google is dus ontvanger van deze gegevens. Google kan gegevens buiten de EU verwerken; Google LLC is gecertificeerd onder het EU-VS Data Privacy Framework.',
        'Om geautomatiseerde spam tegen te houden kunnen de formulieren Cloudflare Turnstile gebruiken, dat de browser controleert zonder cookies. Daarvoor geldt de Turnstile-privacybijlage van Cloudflare: https://www.cloudflare.com/turnstile-privacy-policy/',
        'We verwijderen de agenda-afspraak en de e-mails binnen 12 maanden na het gesprek, tenzij het gesprek tot een overeenkomst leidt; dan bewaren we wat de wet vraagt.',
      ],
    },
  },

  it: {
    nav: { book: 'Scrivici', bookShort: 'Scrivici', assistant: 'Assistente digitale', websites: 'Siti web', prices: 'Prezzi' },
    hero: {
      eyebrow: 'Chiamata conoscitiva · 15 minuti · gratuita',
      title: 'Il negozio è chiuso. Il tuo sito no.',
      lead: 'Facciamo siti veloci come questo per attività locali, con un assistente che risponde ai clienti e fissa gli appuntamenti, anche di notte. E se vuoi, pubblicità su Instagram e Facebook per chi abita in zona.',
      or: 'Oppure',
      request: 'Invia una richiesta',
      whatsapp: 'Scrivici su WhatsApp',
      waText: contact.it.prefill.default,
      email: 'Scrivici un’email',
      note: 'Parli sempre direttamente con il team Twinbyte. Nessun call center.',
    },
    card: {
      who: 'Twinbyte',
      team: 'Studio digitale per attività locali',
      title: 'Chiamata conoscitiva',
      coversTitle: 'Di cosa parliamo',
      covers: ['Presentazioni', 'La tua attività e cosa ti serve', 'Come lavoriamo', 'I prossimi passi'],
      duration: '15 min',
      place: 'Google Meet',
      free: 'Gratuita, senza impegno',
      tz: (z) => `Orari nel tuo fuso orario: ${z}`,
      prep: 'Non serve preparare niente. E non serve una chiamata per sapere quanto costa: i prezzi sono sul sito.',
      prepLink: 'Vedi i prezzi',
    },
    pick: {
      day: 'Scegli un giorno',
      time: 'Scegli un orario',
      noSlotsDay: 'In questo giorno non ci sono più orari liberi.',
      noneAtAll: 'Nelle prossime due settimane non ci sono orari liberi. Mandaci una richiesta o un WhatsApp e lo troviamo insieme.',
      loading: 'Carico gli orari liberi…',
      unavailableTitle: 'Prenota con un messaggio',
      unavailable: 'Il calendario online in questo momento non è raggiungibile. Scrivici e troviamo insieme un orario, altrettanto in fretta.',
      email: 'Scrivici un’email',
      emailSubject: 'Prenotare una chiamata conoscitiva',
      back: 'Indietro',
      change: 'Cambia',
      changeLabel: 'Cambia orario',
      retry: 'Riprova',
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
      sending: 'Prenotazione in corso…',
      required: 'Compila questo campo.',
      badEmail: 'Questo non sembra un indirizzo email.',
      badPhone: 'Questo numero non sembra valido. Scrivilo per intero, con cifre, spazi o +.',
      needConsent: 'Spunta la casella per continuare.',
    },
    errors: {
      slot_taken: 'Qualcuno ha appena preso questo orario. Scegline un altro.',
      already_booked: (w) => `Hai già una chiamata prenotata con noi${w ? `: ${w}` : ''}. Per spostarla, rispondi all’email di conferma o scrivici su WhatsApp.`,
      generic: 'Qualcosa non ha funzionato da parte nostra. Riprova, oppure scrivici su WhatsApp.',
      bot: 'Troppo veloce. Aspetta un attimo e riprova.',
      verifying: 'Un attimo: stiamo controllando che il modulo non sia spam. Riprova tra qualche secondo.',
      waCta: 'Apri WhatsApp',
      notSent: 'Da qui non siamo riusciti a inviarla. Il tuo messaggio è pronto per WhatsApp o email: un tocco, niente da riscrivere.',
      byWhatsApp: 'Invia su WhatsApp',
      byEmail: 'Invia per email',
    },
    done: {
      title: 'Prenotazione fatta.',
      body: (e) => `Ti abbiamo mandato i dettagli a ${e}. Riceverai anche un invito da Google Calendar con lo stesso link.`,
      next: 'Non serve preparare niente. Ti serve un altro orario? Rispondi all’email di conferma o scrivici su WhatsApp.',
      meet: 'Link Google Meet',
      add: 'Aggiungi a Google Calendar',
      whatsapp: 'Domande prima della chiamata? Scrivici su WhatsApp',
    },
    request: {
      title: 'Inviaci una richiesta',
      lead: 'Raccontaci cosa ti serve. Ti rispondiamo per email.',
      message: 'Di cosa hai bisogno?',
      submit: 'Invia la richiesta',
      sending: 'Invio in corso…',
      consentBefore: 'Acconsento a che Twinbyte usi questi dati per rispondere alla mia richiesta, come descritto nell’',
      doneTitle: 'Richiesta ricevuta.',
      done: (e) => `Grazie, l’abbiamo ricevuta. Ti rispondiamo a ${e}.`,
      back: 'Torna alla prenotazione',
      waText: 'Ciao Twinbyte, ho una domanda.',
      mailSubject: 'Richiesta dal sito',
    },
    related: {
      eyebrow: 'Cosa facciamo',
      title: 'Tre cose, fatte bene.',
      lead: 'Leggi quello che ti interessa. I prezzi di siti e assistente sono sul sito; la pubblicità la concordiamo con te.',
      cards: [
        { key: 'assistant', tag: 'Assistente digitale', title: 'Risponde ai tuoi clienti quando tu non puoi', body: 'Sta sul tuo sito, risponde solo con le tue informazioni e fissa gli appuntamenti nell’agenda che usi già.', cta: 'Come funziona l’assistente' },
        { key: 'websites', tag: 'Siti web', title: 'La pagina su cui ti giudicano', body: 'Siti veloci e chiari per piccole attività: orari, prezzi, dove sei, un tocco per chiamare.', cta: 'Cosa comprende un sito' },
        { key: 'prices', tag: 'Prezzi', title: 'Tutti i prezzi, nero su bianco', body: 'Ogni piano con il suo prezzo. I primi tre clienti hanno l’offerta di lancio.', cta: 'Vedi i prezzi' },
        { key: 'showcase', tag: 'Showcase', title: 'Cosa possiamo costruire', body: 'Una pagina che si muove con lo scroll, costruita per mostrare il tipo di lavoro che facciamo.', cta: 'Apri lo showcase' },
      ],
    },
    closing: {
      title: 'Chi non ti trova non lascia un messaggio. Chiama il prossimo della lista.',
      lead: 'Scrivici due righe: che attività hai e cosa ti serve. La chiamata gratuita di 15 minuti la fissiamo quando va bene a te.',
      book: 'Prenota la chiamata da 15 minuti',
      whatsapp: 'Scrivici su WhatsApp',
    },
    page: { book: 'Prenota una chiamata gratuita di 15 minuti', bookLead: 'Domande su questa pagina? Falle durante la chiamata.' },
    mail: { websitesSubject: 'Domanda su un sito web per la mia attività', bundleWa: 'Ciao Twinbyte, mi interessa il pacchetto Sito completo + Assistente. Quando possiamo sentirci?' },
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
