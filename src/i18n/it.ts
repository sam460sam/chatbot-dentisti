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
    faq: 'Domande frequenti',
    contact: 'Contatti',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
    language: 'Lingua',
    skip: 'Vai al contenuto',
  },
  hero: {
    eyebrow: 'Twinbyte — Anna e Samuele',
    title: 'Rispondete a ogni cliente, anche quando non potete rispondere',
    lead: 'Una chiamata persa non lascia un messaggio: chiama il prossimo della lista. Mettiamo sul vostro sito un assistente digitale che risponde in pochi secondi a qualsiasi ora, con le vostre informazioni, e fissa l’appuntamento nell’agenda che usate già.',
    ctaTrial: 'Prova gratis 14 giorni',
    ctaDemo: 'Guardalo fissare un appuntamento',
    note: 'Nessuna carta, nessun contratto. Se in due settimane non si guadagna il posto, lo togliamo lo stesso giorno.',
    bullets: [
      'Scrive nell’agenda che usate già: niente di nuovo da imparare',
      'Risponde nella lingua del cliente, chiunque scriva',
      'Urgenze e casi strani passano al vostro team, con nome e numero',
    ],
  },
  split: {
    title: 'Due servizi, fatti bene entrambi',
    lead: 'Di solito si parte da uno e si aggiunge l’altro più avanti. Scegliete quello per cui siete qui.',
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
      quote: 'Inizia la prova gratuita',
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
    afterHours: {
      eyebrow: 'Fuori orario',
      lead: 'Mentre siete chiusi,',
      accent: 'qualcuno',
      tail: 'risponde lo stesso',
      body: 'Le domande che arrivano a mezzanotte sono quelle di cui non venite mai a sapere. Ricevono una risposta, e un appuntamento, prima che riapriate.',
    },
    calendar: {
      eyebrow: 'Nella vostra agenda',
      lead: 'L\u2019appuntamento \u00e8',
      accent: 'gi\u00e0',
      tail: 'in agenda',
      body: 'Nessuna casella da svuotare, nessun foglietto da passare. Lo slot \u00e8 occupato nell\u2019agenda che usate gi\u00e0, con nome e numero sopra.',
    },
    handover: {
      eyebrow: 'Quando conta',
      lead: 'Quello che \u00e8 delicato passa a',
      accent: 'una persona',
      tail: '',
      body: 'Urgente, insolito o fuori da quello che sa: l\u2019assistente si ferma, prende i dati e mette un richiamo nella vostra agenda. Chiude il cerchio qualcuno del vostro team.',
    },
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
      {
        title: 'Le richieste delicate arrivano a una persona',
        body: 'Su ciò che è urgente, insolito o fuori da quello che sa, l’assistente non improvvisa: prende nome e numero e crea un evento "da richiamare" nella vostra agenda, così se ne occupa qualcuno del vostro team.',
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
    items: [
      'Veloci prima di tutto sul telefono, perché è lì che sono i vostri clienti',
      'Una struttura chiara: cosa fate, dove siete, come vi si contatta',
      'L’assistente si può aggiungere in un secondo momento, sullo stesso sito',
      'Nessun CMS da imparare: ci dite cosa cambia e lo aggiorniamo noi',
    ],
    tags: ['Mobile-first', 'Veloce di base', 'Pronto per l’assistente'],
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
  },
  trial: {
    title: 'Due settimane, sul vostro sito, a costo zero',
    lead: 'Siamo nuovi, e preferiamo dimostrarlo sul vostro sito piuttosto che prometterlo a parole.',
    steps: [
      'Ci mandate orari, servizi e le cinque domande che i clienti fanno più spesso. È la vostra parte: venti minuti circa.',
      'Configuriamo l’assistente e lo mettiamo sul vostro sito. Una riga di codice, il resto non cambia.',
      'Resta attivo 14 giorni. Leggete le conversazioni vere e vedete le prenotazioni vere, non una demo.',
      'Guardiamo insieme i risultati. Se lo tenete diventa un abbonamento mensile; altrimenti lo rimuoviamo lo stesso giorno, gratis.',
    ],
    cta: 'Inizia la prova su WhatsApp',
    note: 'Nessuna carta, nessun contratto, niente da disdire. Il prezzo mensile lo concordiamo dopo la prova, quando sappiamo entrambi quanto lo usate davvero.',
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
        a: 'Non pubblichiamo un prezzo, perché non sappiamo ancora quanto la vostra attività lo userà. Due settimane di conversazioni vere lo dicono a entrambi, e poi concordiamo una cifra mensile. Strumenti simili sul mercato stanno indicativamente fra i 30 e i 150 euro al mese; vi diremo con onestà dove vi collocate prima che vi impegniate a qualcosa.',
      },
      {
        q: 'Cosa succede con le richieste urgenti o insolite?',
        a: 'L’assistente non improvvisa. Prende nome e numero di telefono e crea un evento "da richiamare" nella vostra agenda, così il vostro team può intervenire in fretta. Lo stesso vale quando un cliente vuole spostare o disdire un appuntamento.',
      },
      {
        q: 'Funziona con il sito che abbiamo già?',
        a: 'Sì, se possiamo aggiungerci una riga di codice. È possibile su quasi tutti i siti — WordPress, Wix, Squarespace, Shopify o sviluppati su misura. Per il resto il vostro sito resta esattamente com’è.',
      },
      {
        q: 'Dobbiamo cambiare agenda o gestionale?',
        a: 'No. Configuriamo l’assistente sull’agenda con cui lavorate già: con Google Calendar è pronto, per altri gestionali valutiamo insieme l’integrazione prima della prova. Gli appuntamenti compaiono come eventi normali e potete spostarli o cancellarli come sempre.',
      },
      {
        q: 'In quali lingue risponde?',
        a: 'Configuriamo l’assistente nella lingua in cui lavorate, e a un cliente che scrive in un’altra lingua risponde in quella. Non è limitato a un elenco ristretto, il che conta se i vostri clienti arrivano da ovunque.',
      },
      {
        q: 'Per che tipo di attività è pensato?',
        a: 'Per chiunque riceva sempre le stesse domande e prenda appuntamenti: studi dentistici e medici, saloni, officine, studi professionali, personal trainer, consulenti, centri assistenza. Abbiamo iniziato dagli studi dentistici ed è lì che l’assistente è più collaudato; per il resto funziona allo stesso modo.',
      },
      {
        q: 'E se volessimo smettere?',
        a: 'Ce lo dite e togliamo l’assistente dal sito. Durante la prova non c’è nulla da disdire; dopo, l’abbonamento è mese per mese.',
      },
      {
        q: 'Chi c’è dietro Twinbyte?',
        a: 'Anna e Samuele. Siamo in due, quindi parlate sempre con chi ha configurato il vostro assistente: nessun sistema di ticket in mezzo.',
      },
    ],
  },
  contact: {
    title: 'Parliamone',
    lead: 'Su WhatsApp ci raggiungete più in fretta. Se preferite mettere tutto per iscritto, va benissimo anche l’email.',
    whatsapp: 'Scrivici su WhatsApp',
    email: 'Scrivici un’email',
    emailSubject: 'Domanda sull’assistente Twinbyte',
    note: 'Vi risponde sempre Anna o Samuele: dietro non c’è nessun call center.',
    regions: 'Lavoriamo da remoto con attività in qualsiasi parte del mondo. Ovunque siate, l’assistente risponde nella lingua dei vostri clienti.',
  },
  footer: {
    tagline: 'Assistente digitale per piccole attività e siti web che caricano veloci.',
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
          'Email: twinbyteai@gmail.com',
        ],
      },
      {
        title: 'Questo sito',
        body: [
          'Questo sito non usa cookie. Non viene salvato nulla per statistiche, pubblicità o profilazione, ed è per questo che non trovate un banner cookie da chiudere.',
          'Non usiamo strumenti di analisi o tracciamento e non carichiamo font o script da server di terze parti.',
          'Il sito è ospitato su Cloudflare Pages. Come qualsiasi server web, il fornitore di hosting tratta dati tecnici della richiesta, come indirizzo IP e tipo di browser, per mostrare le pagine e proteggere il servizio da abusi.',
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
          'Potete chiederci l’accesso ai vostri dati, la rettifica, la cancellazione o la limitazione, una copia in formato portabile, e potete opporvi al trattamento. Scrivete a twinbyteai@gmail.com e ce ne occupiamo.',
          'Se ritenete che non trattiamo correttamente i vostri dati, potete presentare reclamo all’autorità di controllo del vostro Paese. TODO_SUPERVISORY_AUTHORITY',
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
    assistant: 'Assistente digitale',
    online: 'sempre attivo',
    calendarTitle: 'La vostra agenda',
    eventTitle: 'Appuntamento — Laura Bianchi',
    eventTime: 'gio 18 set · 10:30 – 11:00',
    eventBadge: 'Creato dall’assistente',
    callback: 'Da richiamare — richiesta urgente',
    tryHere: 'La bolla di chat in basso a destra è l’assistente vero. Provatelo.',
  },
  widgetHello:
    'Ciao! Rispondo alle domande su Twinbyte — come si configura l’assistente, la prova di 14 giorni, la privacy. Cosa vuoi sapere?',
  wa: {
    generic: 'Ciao Twinbyte, ho una domanda sul vostro assistente digitale.',
    trial:
      'Ciao Twinbyte, vorrei iniziare la prova gratuita di 14 giorni dell’assistente digitale per la mia attività.',
    websites: 'Ciao Twinbyte, vorrei sapere di più su un sito web per la mia azienda.',
    websitesQuote: 'Ciao Twinbyte, vorrei un preventivo per un sito web per la mia attività.',
  },
}
