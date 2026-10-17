import metaJson from './meta.json'
import type { Translation } from './types'

export const it: Translation = {
  htmlLang: 'it',
  meta: metaJson.it,
  nav: {
    how: 'Come funziona',
    benefits: 'Cosa ottieni',
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
    title: 'Il sito che prende gli appuntamenti al posto tuo.',
    lead: 'Il sito lo costruiamo noi. L\u2019assistente che ci mettiamo sopra risponde ai clienti e riempie la tua agenda, a qualsiasi ora.',
    ctaQuote: 'Guarda quanto costa',
    ctaDemo: 'Guardalo fissare un appuntamento',
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
    title: 'Tutti i prezzi, nero su bianco',
    lead: 'Non serve una telefonata per sapere quanto spendi. Questi sono prezzi di lancio: saliranno, e chi firma adesso tiene i suoi.',
    launch: {
      tag: 'Offerta di lancio \u2014 primi tre clienti',
      body: 'Sito completo + Assistente, con l\u2019attivazione dell\u2019assistente azzerata e i primi tre mesi offerti. Dal quarto mese parte il canone del pacchetto. Tre clienti, poi finisce.',
      rows: [
        { label: 'Attivazione', value: '\u20AC620', was: 'invece di \u20AC1.080' },
        { label: 'Primi tre mesi', value: '\u20AC0', was: 'invece di \u20AC88 al mese' },
        { label: 'Dal quarto mese', value: '\u20AC59', was: 'invece di \u20AC88' },
      ],
      savingLabel: 'Risparmi (attivazione + primi tre mesi)',
      saving: '\u20AC724',
      cta: 'Chiedi uno dei tre posti',
      wa: 'Ciao Twinbyte, vorrei l’offerta di lancio (sito completo + assistente). C’è ancora un posto libero?',
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
        points: ['Tutto su una schermata: orari, indirizzo, un tocco per chiamare', 'Scritto nella tua lingua', 'Hosting e piccole modifiche inclusi'],
      },
      {
        name: 'Sito completo',
        setup: '\u20AC890',
        month: '\u20AC29',
        points: ['Fino a cinque pagine', 'Trovabile su Google, in ogni lingua in cui vendi', 'Hosting e piccole modifiche inclusi'],
      },
      {
        name: 'Assistente',
        setup: '\u20AC190',
        month: '\u20AC59',
        points: ['300 conversazioni al mese', 'Fissa gli appuntamenti nell\u2019agenda che usi gi\u00e0', 'Risponde nella lingua del cliente'],
      },
      {
        name: 'Assistente Pro',
        setup: '\u20AC290',
        month: '\u20AC99',
        plus: 'Tutto quello che c’è in Assistente, più:',
        points: ['1.000 conversazioni al mese', 'Anche su WhatsApp, non solo sul sito'],
      },
    ],
    bundle: {
      tag: 'Tutti e due insieme',
      name: 'Sito completo + Assistente',
      setup: '\u20AC750',
      month: '\u20AC59',
      body: 'Trenta per cento in meno sull\u2019attivazione, e il canone del sito lo offriamo noi finch\u00e9 tieni l\u2019assistente. Costruirli insieme per noi \u00e8 davvero meno lavoro, quindi la differenza resta a te.',
    },
    fine: [
      'Conversazioni oltre il piano: \u20AC0,08 l\u2019una. Te lo diciamo prima di superare la soglia, non dopo.',
      'Pagina aggiuntiva su un sito completo: \u20AC120.',
      'Mese per mese, un mese di preavviso. Mai un contratto lungo.',
      'Prezzi in euro, per aziende. L\u2019IVA, dove dovuta, \u00e8 indicata in preventivo.',
    ],
    cta: 'Chiedi il pacchetto',
    planCta: 'Chiedi questo piano',
    planWa: 'Ciao Twinbyte, mi interessa il piano «{plan}». Quando possiamo sentirci?',
  },
  split: {
    title: 'Due servizi, fatti bene entrambi',
    assistant: {
      tag: 'Assistente digitale',
      title: 'Smetti di perdere le chiamate che non senti',
      body: 'Sta sul sito che hai già e gestisce le domande e le prenotazioni che altrimenti prenderesti al telefono: la sera, nel weekend, mentre sei con un cliente.',
      points: [
        'Risponde in pochi secondi, solo con le tue informazioni',
        'Prenota direttamente nella tua agenda',
        'Passa a una persona del tuo team tutto ciò che è delicato',
      ],
      cta: 'Guarda come funziona',
      quote: 'Chiedi un preventivo',
    },
    websites: {
      tag: 'Siti web',
      title: 'Un sito che la gente legge, non che ammira',
      body: 'Per chi ha clienti che lo controllano dal telefono prima di decidere se chiamare. Orari, cosa fai e come contattarti, trovabili in dieci secondi.',
      points: [
        'Veloce dal telefono, anche con poca linea',
        'Nessun CMS da imparare: ce lo dici e aggiorniamo noi',
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
      body: 'Urgente, insolito o fuori da quello che sa: l\u2019assistente si ferma, prende i dati e mette un richiamo nella tua agenda. Chiude il cerchio qualcuno del tuo team.',
    },
  },
  devices: {
    eyebrow: 'Un esempio dal vivo',
    title: 'Fatto per il telefono. Altrettanto chiaro sul portatile.',
    lead: 'Un sito demo che abbiamo fatto per uno studio dentistico immaginario. Continua a scorrere: le sue pagine scorrono con te.',
    points: [
      { title: 'Le tue pagine', body: 'Orari, cosa fai e come contattarti, trovabili in dieci secondi.' },
      { title: 'Funziona sul telefono', body: 'Veloce dal telefono, anche con poca linea: è da lì che i tuoi clienti ti cercano.' },
      { title: 'L\u2019assistente, se lo vuoi', body: 'Aggiunto allo stesso sito, risponde alle domande e prenota gli appuntamenti in chat.' },
    ],
    chips: ['Hosting incluso', 'Prezzo sulla pagina', 'Mese per mese'],
    cta: 'Guarda la demo dal vivo',
    note: 'Lo studio è immaginario. Il sito e l\u2019assistente sono fatti da Twinbyte.',
    alt: 'Il sito dello studio demo immaginario, su un portatile e su un telefono',
  },
  dayStrip: {
    eyebrow: 'Un martedì',
    title: 'Sei aperto 8 ore su 24',
    caption: 'Le altre sedici non sono di nessuno. Chi scrive alle 21:40 non è un rompiscatole: è l’ora in cui finalmente si è seduto.',
    legendOpen: 'Aperto — rispondi tu',
    legendShut: 'Chiuso — risponde l’assistente',
  },
  how: {
    title: 'Come funziona',
    lead: 'Tre passaggi, e il lavoro da parte tua è quasi tutto nel primo.',
    steps: [
      {
        title: 'Lo configuriamo con i tuoi dati',
        body: 'Ci mandi orari, servizi e le domande che i clienti fanno più spesso. Costruiamo l’assistente intorno a quelle informazioni, così le risposte sono le tue e non un testo generico.',
      },
      {
        title: 'Lo inseriamo sul tuo sito',
        body: 'Una riga di codice sul sito che hai già. Niente da installare, il resto del sito non cambia. Con Assistente Pro risponde anche su WhatsApp: per attivarlo servono circa due settimane.',
      },
      {
        title: 'I clienti prenotano da soli',
        body: 'L’assistente controlla le disponibilità, chiede nome e numero di telefono e crea l’appuntamento nell’agenda che usi già. Il controllo resta interamente tuo.',
      },
    ],
  },
  benefits: {
    title: 'Cosa ci guadagna la tua attività',
    lead: 'In qualsiasi attività che prende appuntamenti, una chiamata persa è un cliente perso: un salone, un’officina, uno studio dentistico, uno studio professionale, un centro estetico. Per tutti funziona lo stesso assistente.',
    items: [
      {
        title: 'Meno telefonate a cui rispondere',
        body: 'Orari, indirizzo, parcheggio, prezzi, come si svolge il primo appuntamento: le domande di routine trovano risposta senza che nessuno alzi la cornetta.',
      },
      {
        title: 'Prenotazioni fuori orario',
        body: 'Sere, weekend, festivi, e qualsiasi fuso orario in cui si trovino i tuoi clienti. Chi avrebbe chiamato domani — o avrebbe chiamato un concorrente — prenota stasera.',
      },
      {
        title: 'Parla la lingua dei tuoi clienti',
        body: 'Configuriamo l’assistente nella lingua in cui lavori e, se un cliente chiede di essere seguito in un’altra lingua, passa alla sua. Utile ovunque i clienti non siano tutti del posto.',
      },
    ],
  },
  security: {
    title: 'Privacy e sicurezza',
    lead: 'I dati dei tuoi clienti sono tuoi, non nostri. Il nostro criterio è toccarne il meno possibile.',
    items: [
      {
        title: 'Chiediamo il minimo indispensabile',
        body: 'Per fissare un appuntamento all’assistente servono un nome e un numero di telefono. Nessun documento, nessun dato di pagamento e nulla di sensibile che alla tua attività non serva per prendere una prenotazione.',
      },
      {
        title: 'Il cliente sa che non è una persona',
        body: 'L’assistente lo dichiara prima che inizi la conversazione. Non dà consulenze professionali né consigli medici: tutto ciò che richiede un giudizio passa a te.',
      },
      {
        title: 'Un accordo firmato sul trattamento dei dati',
        body: 'Prima di andare online firmiamo con te un accordo sul trattamento dei dati (DPA): cosa viene trattato, perché e per quanto tempo. Il titolare del trattamento resti tu.',
      },
    ],
  },
  websites: {
    title: 'Siti web per piccole attività',
    lead: 'Siti chiari e veloci per piccole attività: i tuoi orari, cosa fai, dove sei e un tocco per chiamare, facili da trovare su qualsiasi telefono.',
    cta: 'Chiedi informazioni su un sito',
    includesTitle: 'Cosa comprende un sito',
    includes: [
      'Pagine scritte insieme a te: parole tue, niente frasi fatte',
      'Impostato bene per Google: titoli, descrizioni, la tua attività sulla mappa',
      'Contatti che la gente usa davvero: WhatsApp, telefono, email',
      'Hosting e piccole modifiche compresi nel canone mensile, nessuna spesa di hosting a parte',
      'Niente cookie e niente tracciamento, quindi nessun banner che copre la pagina',
    ],
    whoTitle: 'Per chi va bene',
    who: 'Negozi, officine, artigiani, studi, centri, chiunque venga cercato dal telefono prima di essere chiamato. Se ti serve un e-commerce con centinaia di prodotti non siamo le persone giuste, e te lo diciamo.',
    quoteNote: 'I prezzi sono nella pagina Prezzi. Nella chiamata gratuita di 15 minuti concordiamo il piano e i tempi: dipende da quante pagine ti servono e se hai già testi e foto.',
    showcase: 'Guarda una pagina fatta per colpire',
  },
  faq: {
    title: 'Domande frequenti',
    lead: 'Se manca qualcosa, scrivicelo su WhatsApp.',
    items: [
      {
        q: 'I miei clienti odiano i chatbot. Perché questo dovrebbe essere diverso?',
        show: ['home', 'assistant'],
        a: 'Perché la maggior parte non risponde: filtra. Menu infiniti per evitare una persona. Questo risponde alla domanda, fissa l’appuntamento e, appena non può aiutare, prende nome e numero e passa la palla a te. Al cliente viene detto dalla prima riga che non è una persona.',
      },
      {
        q: 'Cosa gli impedisce di dire cose sbagliate?',
        show: ['assistant'],
        a: 'Risponde partendo dalle informazioni che ci dai — i tuoi orari, i tuoi servizi, i tuoi prezzi — e da nient’altro. Quando non sa una cosa lo dice, prende i dati e passa la domanda a te invece di inventare una risposta.',
      },
      {
        q: 'Quanto costa?',
        a: 'Il listino completo di siti e assistente è su questa pagina: non teniamo niente nascosto fino alla telefonata. L’assistente costa €190 di attivazione e €59 al mese per 300 conversazioni; i siti partono da €490. Prendendo insieme sito completo e assistente, l’attivazione cala del trenta per cento e il canone del sito lo offriamo noi.',
      },
      {
        q: 'Funziona con il sito che abbiamo già?',
        show: ['assistant'],
        a: 'Sì, se possiamo aggiungerci una riga di codice. È possibile su quasi tutti i siti — WordPress, Wix, Squarespace, Shopify o sviluppati su misura. Per il resto il tuo sito resta esattamente com’è.',
      },
      {
        q: 'Dobbiamo cambiare agenda o gestionale?',
        show: ['assistant'],
        a: 'No. Configuriamo l’assistente sull’agenda con cui lavori già: con Google Calendar è pronto, per altri gestionali valutiamo insieme l’integrazione prima di partire. Gli appuntamenti compaiono come eventi normali e puoi spostarli o cancellarli come sempre.',
      },
      {
        q: 'E se volessimo smettere?',
        show: ['assistant'],
        a: 'Ce lo dici e togliamo l’assistente dal sito. L’abbonamento è mese per mese, con un mese di preavviso.',
      },
      {
        q: 'Non sono pratico di computer. È un problema?',
        show: ['home'],
        a: 'No. Non devi imparare niente: nessun pannello da gestire. I testi li scriviamo insieme, e quando cambia qualcosa (un orario, un prezzo, una foto) ce lo scrivi su WhatsApp e lo aggiorniamo noi. Le piccole modifiche sono comprese nel canone.',
      },
      {
        q: 'Ho già un sito. Me ne serve uno nuovo?',
        show: ['home'],
        a: 'Per l’assistente no: si aggiunge al sito che hai già con una riga di codice, e il resto non cambia. Se il tuo sito è lento o si legge male dal telefono, te ne facciamo uno nuovo: i prezzi sono nella pagina Prezzi.',
      },
      {
        q: 'L’assistente risponde al telefono?',
        show: ['home', 'assistant'],
        a: 'No. Risponde in chat sul tuo sito (con Assistente Pro anche su WhatsApp), solo con le tue informazioni, e fissa gli appuntamenti nella tua agenda. Quello che non sa gestire passa a te, con nome e numero del cliente.',
      },
    ],
  },
  contact: {
    title: 'Parliamone',
    email: 'Scrivici un’email',
    emailSubject: 'Domanda per Twinbyte',
    note: 'Ti risponde sempre direttamente il team Twinbyte: dietro non c’è nessun call center.',
    regions: 'Lavoriamo da remoto con attività in qualsiasi parte del mondo. Ovunque tu sia, l’assistente risponde nella lingua dei tuoi clienti.',
  },
  footer: {
    tagline: 'Siti web veloci, assistente digitale e pubblicità online per attività locali.',
    colophon: 'Composto in Bricolage Grotesque, Inter e Instrument Serif. Fatto nei Paesi Bassi. Questo sito non usa cookie, non fa analytics e non carica pixel di tracciamento.',
    privacy: 'Informativa privacy',
    rights: 'Tutti i diritti riservati.',
  },
  privacyPage: {
    title: 'Informativa privacy',
    updated: 'Ultimo aggiornamento',
    intro:
      'Questa informativa spiega cosa succede ai dati personali su questo sito e quando ci contatti. È volutamente breve: il sito non usa cookie e non traccia nulla. Riceviamo solo quello che scrivi tu in un modulo (per prenotare una chiamata o inviare una richiesta) o nella chat della pagina Assistente digitale.',
    sections: [
      {
        title: 'Chi siamo',
        body: [
          'Twinbyte.',
          'Titolare del trattamento: TODO_LEGAL_NAME',
          'Indirizzo: TODO_ADDRESS',
          'Partita IVA / numero di registrazione: TODO_VAT_NUMBER',
          'Email: info@twinbyteservices.com',
        ],
      },
      {
        title: 'Questo sito',
        body: [
          'Questo sito non usa cookie. Non viene salvato nulla per statistiche, pubblicità o profilazione, ed è per questo che non trovi un banner cookie da chiudere.',
          'Non usiamo analytics né strumenti di tracciamento, e i font sono serviti da questo dominio.',
          'Il sito è ospitato su Cloudflare Pages. Come qualsiasi server web, il fornitore di hosting tratta dati tecnici della richiesta, come indirizzo IP e tipo di browser, per mostrare le pagine e proteggere il servizio da abusi.',
        ],
      },
      {
        title: 'L’assistente nella pagina Assistente digitale',
        body: [
          'La finestra di chat compare solo nella pagina Assistente digitale; le altre pagine non la caricano. È il nostro assistente. Lo script arriva da un server che gestiamo su Vercel e le risposte da un server su Railway. Poiché è il tuo browser a richiederli direttamente, quei due fornitori vedono il tuo indirizzo IP e il tipo di browser.',
          'Se apri la chat, quello che scrivi viene inviato a quel server per ricevere una risposta, insieme alla lingua della pagina. Non scriverci nulla che non ci manderesti anche per e-mail — per un appuntamento o un preventivo scrivici su WhatsApp o a info@twinbyteservices.com.',
        ],
      },
      {
        title: 'Quando ci contatti',
        body: [
          'Se ci scrivi su WhatsApp o via email trattiamo quello che ci mandi: il tuo nome, i tuoi recapiti e il contenuto del messaggio. Li usiamo per risponderti e, se la conversazione prosegue, per preparare una proposta.',
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
        title: 'I tuoi diritti',
        body: [
          'Puoi chiederci l’accesso ai tuoi dati, la rettifica, la cancellazione o la limitazione, una copia in formato portabile, e puoi opporti al trattamento. Scrivi a info@twinbyteservices.com e ce ne occupiamo.',
          'Se ritieni che non trattiamo correttamente i tuoi dati, puoi presentare reclamo all’autorità di controllo del tuo Paese.',
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
    siteLabel: 'il-tuo-sito.it',
    messages: [
      { from: 'patient', text: 'Buonasera, posso prenotare un appuntamento la prossima settimana?' },
      { from: 'bot', text: 'Certo. Giovedì 18 alle 10:30 oppure venerdì 19 alle 16:00?' },
      { from: 'patient', text: 'Giovedì va bene.' },
      { from: 'bot', text: 'Mi lascia il suo nome e un numero di telefono?' },
      { from: 'patient', text: 'Laura Bianchi, 340 1234567' },
      { from: 'bot', text: 'Fissato: giovedì 18 alle 10:30. È già in agenda.' },
    ],
    typing: 'sta scrivendo',
    calendarTitle: 'La tua agenda',
    eventTitle: 'Appuntamento — Laura Bianchi',
    eventTime: 'giovedì · 10:00 – 10:30',
    eventBadge: 'Creato dall’assistente',
    callback: 'Da richiamare — richiesta urgente',
    tryHere: 'La bolla di chat in basso a destra è l’assistente vero. Provalo.',
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
    generic: 'Ciao Twinbyte, ho una domanda sull’assistente digitale.',
    assistantQuote:
      'Ciao Twinbyte, ho letto dell’assistente digitale e lo vorrei per la mia attività. Quando possiamo sentirci?',
    websitesQuote: 'Ciao Twinbyte, vorrei un sito per la mia attività. Quando possiamo sentirci?',
  },
}
