import metaJson from './meta.json'
import type { Translation } from './types'

export const it: Translation = {
  htmlLang: 'it',
  meta: metaJson.it,
  nav: {
    how: 'Come funziona',
    benefits: 'Cosa ottenete',
    security: 'Privacy e sicurezza',
    websites: 'Siti web',
    prices: 'Prezzi',
    faq: 'Domande frequenti',
    contact: 'Contatti',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
    language: 'Lingua',
    main: 'Navigazione principale',
    skip: 'Vai al contenuto',
  },
  hero: {
    title: 'Il sito che prende gli appuntamenti al posto vostro.',
    lead: 'Il sito lo costruiamo noi. L\u2019assistente che ci mettiamo sopra risponde ai clienti e riempie la vostra agenda, a qualsiasi ora.',
    ctaQuote: 'Guardate quanto costa',
    ctaDemo: 'Guardatelo fissare un appuntamento',
  },
  heroSite: {
    url: 'iltuolocale.it',
    name: 'La tua attività',
    tagline: 'La pagina che i clienti guardano prima di chiamarti.',
    hours: 'Aperto lun–ven · 09:00–17:00',
    address: 'Via Roma 12, Castelfranco Veneto',
    nav: ['Cosa facciamo', 'Prezzi', 'Dove siamo'],
    call: 'Chiama ora',
    book: 'Prenota online',
    phoneLabel: 'Sul telefono, 23:47',
    status: 'Risponde subito',
    input: 'Scrivi un messaggio',
  },
  pricing: {
    eyebrow: 'Quanto costa',
    title: 'Il listino completo, scritto sulla pagina',
    lead: 'Non serve una telefonata per sapere quanto spendete. Questi sono prezzi di lancio \u2014 saliranno quando avremo un portfolio, e chi firma adesso tiene i suoi.',
    launch: {
      tag: 'Offerta di lancio \u2014 primi tre clienti',
      body: 'Sito completo + Assistente, con l\u2019attivazione dell\u2019assistente azzerata e i primi tre mesi offerti. Dal quarto mese parte il canone del pacchetto. Tre clienti, poi finisce.',
      rows: [
        { label: 'Attivazione', value: '\u20AC620', was: 'invece di \u20AC1.080' },
        { label: 'Primi tre mesi', value: '\u20AC0', was: 'invece di \u20AC118 al mese' },
        { label: 'Dal quarto mese', value: '\u20AC89', was: 'invece di \u20AC118' },
      ],
      savingLabel: 'Risparmio nei primi tre mesi',
      saving: '\u20AC814',
    },
    bar: {
      text: 'Primi tre clienti: l\u2019assistente \u00e8 incluso con il sito.',
      cta: 'Vedi i prezzi',
    },
    setupLabel: 'Attivazione',
    monthLabel: 'Al mese',
    plans: [
      {
        name: 'Sito una pagina',
        setup: '\u20AC490',
        month: '\u20AC19',
        points: ['Tutto su una schermata: orari, indirizzo, un tocco per chiamare', 'Scritto nella vostra lingua', 'Hosting e piccole modifiche inclusi'],
      },
      {
        name: 'Sito completo',
        setup: '\u20AC890',
        month: '\u20AC29',
        points: ['Fino a cinque pagine', 'Trovabile su Google, in ogni lingua in cui vendete', 'Hosting e piccole modifiche inclusi'],
      },
      {
        name: 'Assistente',
        setup: '\u20AC190',
        month: '\u20AC89',
        points: ['300 conversazioni al mese', 'Fissa nell\u2019agenda che usate gi\u00e0', 'Una lingua'],
      },
      {
        name: 'Assistente Pro',
        setup: '\u20AC290',
        month: '\u20AC139',
        plus: 'Tutto quello che c’è in Assistente, più:',
        points: ['1.000 conversazioni al mese', 'Anche su WhatsApp, non solo sul sito', 'Tutte le lingue in cui vi scrivono'],
      },
    ],
    bundle: {
      tag: 'Tutti e due insieme',
      name: 'Sito completo + Assistente',
      setup: '\u20AC750',
      month: '\u20AC89',
      body: 'Trenta per cento in meno sull\u2019attivazione, e il canone del sito lo offriamo noi finch\u00e9 tenete l\u2019assistente. Costruirli insieme per noi \u00e8 davvero meno lavoro, quindi la differenza resta a voi.',
    },
    fine: [
      'Conversazioni oltre il piano: \u20AC0,08 l\u2019una. Ve lo diciamo prima di superare la soglia, non dopo.',
      'Pagina aggiuntiva su un sito completo: \u20AC120.',
      'Mese per mese, un mese di preavviso. Mai un contratto lungo.',
      'Prezzi in euro, per aziende. L\u2019IVA, dove dovuta, \u00e8 indicata in preventivo.',
    ],
    cta: 'Chiedete un preventivo',
  },
  split: {
    title: 'Due servizi, fatti bene entrambi',
    assistant: {
      tag: 'Assistente digitale',
      title: 'Smettete di perdere le chiamate che non sentite',
      body: 'Sta sul sito che avete già e gestisce le domande e le prenotazioni che altrimenti prendereste al telefono: la sera, nel weekend, mentre siete con un cliente.',
      points: [
        'Risponde in pochi secondi, solo con le vostre informazioni',
        'Prenota direttamente nella vostra agenda',
        'Passa a una persona del vostro team tutto ciò che è delicato',
      ],
      cta: 'Guarda come funziona',
      quote: 'Chiedi un preventivo',
    },
    websites: {
      tag: 'Siti web',
      title: 'Un sito che la gente legge, non che ammira',
      body: 'Per chi ha clienti che lo controllano dal telefono prima di decidere se chiamare. Orari, cosa fate e come contattarvi, trovabili in dieci secondi.',
      points: [
        'Veloce dal telefono, anche con poca linea',
        'Nessun CMS da imparare: ce lo dite e aggiorniamo noi',
        'L’assistente si può aggiungere in seguito',
      ],
      cta: 'Guarda cosa realizziamo',
      quote: 'Chiedi un preventivo',
    },
  },
  scenes: {
    handover: {
      eyebrow: 'Quando conta',
      lead: 'Quello che \u00e8 delicato passa a',
      accent: 'una persona',
      tail: '',
      body: 'Urgente, insolito o fuori da quello che sa: l\u2019assistente si ferma, prende i dati e mette un richiamo nella vostra agenda. Chiude il cerchio qualcuno del vostro team.',
    },
  },
  assembly: {
    title: 'Come lo costruiamo',
    beats: [
      {
        kick: 'Come lavoriamo',
        title: 'Ogni pezzo, fatto su misura.',
        body: 'Un sito è una pila di piccole decisioni: le parole, gli orari, il bottone, la cosa che risponde. Ognuna la prendiamo apposta.',
      },
      {
        kick: 'Montato',
        title: 'Niente di preconfezionato.',
        body: 'Nessun template con il vostro logo incollato sopra. I pezzi sono tagliati per la vostra attività e montati a mano, nell’ordine giusto.',
      },
      {
        kick: 'Consegnato',
        title: 'Chiuso, testato, vostro.',
        body: 'Una cosa finita che funziona sul telefono, a un prezzo scritto sulla pagina, mese per mese.',
      },
    ],
    pins: ['Le vostre pagine', 'L\u2019assistente', 'Hosting incluso', 'Funziona sul telefono', 'Prezzo sulla pagina', 'Mese per mese'],
  },
  dayStrip: {
    eyebrow: 'Un martedì',
    title: 'Siete aperti otto di queste ventiquattro ore',
    caption: 'Le altre sedici non sono di nessuno. Chi scrive alle 21:40 non è un rompiscatole: è l’ora in cui finalmente si è seduto.',
    legendOpen: 'Aperto — rispondete voi',
    legendShut: 'Chiuso — risponde l’assistente',
  },
  how: {
    title: 'Come funziona',
    lead: 'Tre passaggi, e il lavoro da parte vostra è quasi tutto nel primo.',
    steps: [
      {
        title: 'Lo configuriamo con i vostri dati',
        body: 'Ci mandate orari, servizi e le domande che i clienti fanno più spesso. Costruiamo l’assistente intorno a quelle informazioni, così le risposte sono le vostre e non un testo generico.',
      },
      {
        title: 'Lo inseriamo sul vostro sito',
        body: 'Una riga di codice sul sito che avete già. Niente da installare, il resto del sito non cambia. La versione WhatsApp è in arrivo.',
      },
      {
        title: 'I clienti prenotano da soli',
        body: 'L’assistente controlla le disponibilità, chiede nome e numero di telefono e crea l’appuntamento nell’agenda che usate già. Il controllo resta interamente vostro.',
      },
    ],
  },
  benefits: {
    title: 'Cosa ci guadagna la vostra attività',
    lead: 'È nato negli studi dentistici, dove una chiamata persa è un paziente perso. Lo stesso problema c’è in qualsiasi attività che prende appuntamenti: un salone, un’officina, uno studio professionale, una clinica, un centro estetico.',
    items: [
      {
        title: 'Meno telefonate a cui rispondere',
        body: 'Orari, indirizzo, parcheggio, prezzi, come si svolge il primo appuntamento: le domande di routine trovano risposta senza che nessuno alzi la cornetta.',
      },
      {
        title: 'Prenotazioni fuori orario',
        body: 'Sere, weekend, festivi, e qualsiasi fuso orario in cui si trovino i vostri clienti. Chi avrebbe chiamato domani — o avrebbe chiamato un concorrente — prenota stasera.',
      },
      {
        title: 'Parla la lingua dei vostri clienti',
        body: 'Configuriamo l’assistente nella lingua in cui lavorate e, se un cliente chiede di essere seguito in un’altra lingua, passa alla sua. Utile ovunque i clienti non siano tutti del posto.',
      },
    ],
  },
  security: {
    title: 'Privacy e sicurezza',
    lead: 'I dati dei vostri clienti sono vostri, non nostri. Il nostro criterio è toccarne il meno possibile.',
    items: [
      {
        title: 'Chiediamo il minimo indispensabile',
        body: 'Per fissare un appuntamento all’assistente servono un nome e un numero di telefono. Nessun documento, nessun dato di pagamento e nulla di sensibile che alla vostra attività non serva per prendere una prenotazione.',
      },
      {
        title: 'Il cliente sa che non è una persona',
        body: 'L’assistente lo dichiara prima che inizi la conversazione. Non dà consulenze professionali né consigli medici: tutto ciò che richiede un giudizio passa a voi.',
      },
      {
        title: 'Accordo sul trattamento dei dati firmato',
        body: 'Prima di andare online firmiamo con voi un accordo sul trattamento dei dati (DPA): cosa viene trattato, perché e per quanto tempo. Il titolare del trattamento restate voi.',
      },
    ],
  },
  websites: {
    title: 'Siti web per piccole aziende',
    lead: 'Oltre all’assistente realizziamo siti web: quelli che servono davvero a una piccola azienda, non una vetrina per noi.',
    cta: 'Chiedi informazioni su un sito',
    includesTitle: 'Cosa comprende un sito',
    includes: [
      'Pagine scritte insieme a voi — parole vostre, niente testo riempitivo',
      'Impostato bene per Google: titoli, descrizioni, la vostra attività sulla mappa',
      'Contatti che la gente usa davvero: WhatsApp, telefono, email',
      'Hosting su piano gratuito, quindi nessun canone mensile di hosting',
      'Niente cookie e niente tracciamento, quindi nessun banner in faccia al cliente',
    ],
    whoTitle: 'Per chi va bene',
    who: 'Negozi, officine, artigiani, studi, centri, chiunque venga cercato dal telefono prima di essere chiamato. Se vi serve un e-commerce con centinaia di prodotti non siamo le persone giuste, e ve lo diciamo.',
    quoteNote: 'Prezzo e tempi dopo una chiamata di dieci minuti: dipende da quante pagine servono e se avete già testi e foto.',
    showcase: 'Guardate una pagina fatta per colpire',
  },
  faq: {
    title: 'Domande frequenti',
    lead: 'Se manca qualcosa, scrivetecelo su WhatsApp.',
    items: [
      {
        q: 'I miei clienti odiano i chatbot. Perché questo dovrebbe essere diverso?',
        a: 'Perché la maggior parte non risponde: filtra. Menu infiniti per evitare una persona. Questo risponde alla domanda, fissa l’appuntamento e, appena non può aiutare, prende nome e numero e passa la palla a voi. Al cliente viene detto dalla prima riga che non è una persona.',
      },
      {
        q: 'Cosa gli impedisce di dire cose sbagliate?',
        a: 'Risponde partendo dalle informazioni che ci date — i vostri orari, i vostri servizi, i vostri prezzi — e da nient’altro. Quando non sa una cosa lo dice, prende i dati e passa la domanda a voi invece di inventare una risposta.',
      },
      {
        q: 'Quanto costa?',
        a: 'Il listino completo è su questa pagina: non teniamo niente nascosto fino alla telefonata. L’assistente costa €190 di attivazione e €89 al mese per 300 conversazioni; i siti partono da €490. Prendendo tutti e due, l’attivazione cala del trenta per cento e il canone del sito lo offriamo noi.',
      },
      {
        q: 'Funziona con il sito che abbiamo già?',
        a: 'Sì, se possiamo aggiungerci una riga di codice. È possibile su quasi tutti i siti — WordPress, Wix, Squarespace, Shopify o sviluppati su misura. Per il resto il vostro sito resta esattamente com’è.',
      },
      {
        q: 'Dobbiamo cambiare agenda o gestionale?',
        a: 'No. Configuriamo l’assistente sull’agenda con cui lavorate già: con Google Calendar è pronto, per altri gestionali valutiamo insieme l’integrazione prima di partire. Gli appuntamenti compaiono come eventi normali e potete spostarli o cancellarli come sempre.',
      },
      {
        q: 'E se volessimo smettere?',
        a: 'Ce lo dite e togliamo l’assistente dal sito. L’abbonamento è mese per mese, con un mese di preavviso.',
      },
    ],
  },
  contact: {
    title: 'Parliamone',
    email: 'Scrivici un’email',
    emailSubject: 'Domanda sull’assistente Twinbyte',
    note: 'Vi risponde sempre Anna o Samuele: dietro non c’è nessun call center.',
    regions: 'Lavoriamo da remoto con attività in qualsiasi parte del mondo. Ovunque siate, l’assistente risponde nella lingua dei vostri clienti.',
  },
  footer: {
    tagline: 'Assistente digitale per piccole attività e siti web che caricano veloci.',
    colophon: 'Composto in Bricolage Grotesque e Inter. Fatto nei Paesi Bassi. Questo sito non usa cookie, non fa analytics e non carica pixel di tracciamento.',
    privacy: 'Informativa privacy',
    rights: 'Tutti i diritti riservati.',
  },
  privacyPage: {
    title: 'Informativa privacy',
    updated: 'Ultimo aggiornamento',
    intro:
      'Questa informativa spiega cosa succede ai dati personali su questo sito e quando ci contattate. È volutamente breve, perché questo sito raccoglie quasi nulla.',
    sections: [
      {
        title: 'Chi siamo',
        body: [
          'Twinbyte — Anna e Samuele.',
          'Titolare del trattamento: TODO_LEGAL_NAME',
          'Indirizzo: TODO_ADDRESS',
          'Partita IVA / numero di registrazione: TODO_VAT_NUMBER',
          'Email: info@twinbyteservices.com',
        ],
      },
      {
        title: 'Questo sito',
        body: [
          'Questo sito non usa cookie. Non viene salvato nulla per statistiche, pubblicità o profilazione, ed è per questo che non trovate un banner cookie da chiudere.',
          'Non usiamo analytics né strumenti di tracciamento, e i font sono serviti da questo dominio.',
          'Il sito è ospitato su Cloudflare Pages. Come qualsiasi server web, il fornitore di hosting tratta dati tecnici della richiesta, come indirizzo IP e tipo di browser, per mostrare le pagine e proteggere il servizio da abusi.',
        ],
      },
      {
        title: 'L’assistente su questa pagina',
        body: [
          'La bolla di chat in basso a destra è il nostro assistente, ed è l’unica cosa di questa pagina che il vostro browser carica da un altro server. Lo script arriva da un server che gestiamo su Vercel e le risposte da un server su Railway. Poiché è il vostro browser a richiederli direttamente, quei due fornitori vedono il vostro indirizzo IP e il tipo di browser.',
          'Se aprite la chat, quello che scrivete viene inviato a quel server per ricevere una risposta, insieme alla lingua della pagina. Non scriveteci nulla che non ci mandereste anche per e-mail — per un appuntamento o un preventivo scriveteci su WhatsApp o a info@twinbyteservices.com.',
        ],
      },
      {
        title: 'Quando ci contattate',
        body: [
          'Se ci scrivete su WhatsApp o via email trattiamo quello che ci mandate: il vostro nome, i vostri recapiti e il contenuto del messaggio. Li usiamo per rispondervi e, se la conversazione prosegue, per preparare una proposta.',
          'Conserviamo la corrispondenza per il tempo necessario alla conversazione e ai nostri obblighi di legge, poi la cancelliamo.',
          'WhatsApp è fornito da Meta e la nostra email da Google: ai messaggi in transito e conservati sui loro server si applicano le loro condizioni.',
        ],
      },
      {
        title: 'L’assistente sui siti dei nostri clienti',
        body: [
          'L’assistente descritto in questa pagina funziona sui siti dei nostri clienti. Per quelle conversazioni il titolare del trattamento è il cliente e Twinbyte agisce come responsabile, sulla base di un accordo sul trattamento dei dati firmato.',
          'Questa informativa riguarda quindi solo questo sito. Chi parla con un assistente sul sito di un cliente deve fare riferimento all’informativa di quell’azienda.',
        ],
      },
      {
        title: 'I vostri diritti',
        body: [
          'Potete chiederci l’accesso ai vostri dati, la rettifica, la cancellazione o la limitazione, una copia in formato portabile, e potete opporvi al trattamento. Scrivete a info@twinbyteservices.com e ce ne occupiamo.',
          'Se ritenete che non trattiamo correttamente i vostri dati, potete presentare reclamo all’autorità di controllo del vostro Paese.',
          'TODO_SUPERVISORY_AUTHORITY',
        ],
      },
      {
        title: 'Modifiche',
        body: ['Se questa informativa cambia, aggiorniamo la data in cima alla pagina.'],
      },
    ],
    back: 'Torna alla home',
  },
  demo: {
    tag: 'Conversazione di esempio',
    siteLabel: 'il-vostro-sito.it',
    messages: [
      { from: 'patient', text: 'Buonasera, posso prenotare un appuntamento la prossima settimana?' },
      { from: 'bot', text: 'Certo. Giovedì 18 alle 10:30 oppure venerdì 19 alle 16:00?' },
      { from: 'patient', text: 'Giovedì va bene.' },
      { from: 'bot', text: 'Mi lascia il suo nome e un numero di telefono?' },
      { from: 'patient', text: 'Laura Bianchi, 340 1234567' },
      { from: 'bot', text: 'Fissato: giovedì 18 alle 10:30. È già nella vostra agenda.' },
    ],
    typing: 'sta scrivendo',
    calendarTitle: 'La vostra agenda',
    eventTitle: 'Appuntamento — Laura Bianchi',
    eventTime: 'gio 18 set · 10:30 – 11:00',
    eventBadge: 'Creato dall’assistente',
    callback: 'Da richiamare — richiesta urgente',
    tryHere: 'La bolla di chat in basso a destra è l’assistente vero. Provatelo.',
    knows: 'Conosce la risposta?',
    yes: 'Sì',
    books: 'Risponde e fissa l’appuntamento.',
    no: 'No, oppure è urgente',
    toAPerson: 'Si ferma e prende due cose:',
    fieldName: 'Nome',
    fieldPhone: 'Telefono',
  },
  widgetHello:
    'Ciao! Rispondo alle domande su Twinbyte — come si configura l’assistente, quanto costa, la privacy. Cosa vuoi sapere?',
  wa: {
    generic: 'Ciao Twinbyte, ho una domanda sul vostro assistente digitale.',
    assistantQuote:
      'Ciao Twinbyte, vorrei un preventivo per l’assistente digitale per la mia attività.',
    websitesQuote: 'Ciao Twinbyte, vorrei un preventivo per un sito web per la mia attività.',
  },
}
