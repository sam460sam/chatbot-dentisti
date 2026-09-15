import metaJson from './meta.json'
import type { Translation } from './types'

export const it: Translation = {
  htmlLang: 'it',
  meta: metaJson.it,
  nav: {
    how: 'Come funziona',
    benefits: 'Per lo studio',
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
    title: 'Lo studio risponde ai pazienti 24 ore su 24, anche quando il telefono è occupato',
    lead: 'Mettiamo un assistente AI sul sito del vostro studio. Risponde alle domande di ogni giorno — orari, trattamenti, cosa portare alla prima visita — e fissa gli appuntamenti direttamente nel vostro Google Calendar.',
    ctaTrial: 'Prova gratis 14 giorni',
    ctaDemo: 'Guarda la demo',
    note: 'Senza impegno. Se non è utile allo studio lo rimuoviamo gratuitamente.',
    bullets: [
      'Scrive nel Google Calendar che usate già',
      'Risponde in italiano, inglese e olandese',
      'Le urgenze passano allo staff, non le gestisce l’AI',
    ],
  },
  how: {
    title: 'Come funziona',
    lead: 'Tre passaggi, e il lavoro da parte vostra è quasi tutto nel primo.',
    steps: [
      {
        title: 'Lo configuriamo con i vostri dati',
        body: 'Ci mandate orari, trattamenti e le domande che i pazienti fanno più spesso. Costruiamo l’assistente intorno a quelle informazioni, così le risposte sono quelle dello studio e non un testo generico.',
      },
      {
        title: 'Lo inseriamo sul vostro sito',
        body: 'Una riga di codice sul sito che avete già. Niente da installare, il resto del sito non cambia. La versione WhatsApp è in arrivo.',
      },
      {
        title: 'I pazienti prenotano da soli',
        body: 'L’assistente controlla le disponibilità, chiede nome e numero di telefono e crea l’appuntamento nel vostro Google Calendar. L’agenda resta interamente sotto il vostro controllo.',
      },
    ],
  },
  benefits: {
    title: 'Cosa ci guadagna lo studio',
    lead: 'Niente di rivoluzionario: semplicemente la parte ripetitiva della reception gestita da sola.',
    items: [
      {
        title: 'Meno telefonate alla reception',
        body: 'Orari, indirizzo, parcheggio, come si svolge la prima visita: le domande di routine trovano risposta senza che nessuno alzi la cornetta.',
      },
      {
        title: 'Prenotazioni fuori orario',
        body: 'Sere, weekend, festivi. Il paziente che avrebbe chiamato domani — o avrebbe chiamato un altro studio — prenota stasera.',
      },
      {
        title: 'Tre lingue, un assistente',
        body: 'I pazienti scrivono in italiano, inglese o olandese e ricevono la risposta nella stessa lingua. Utile negli studi con pazienti stranieri.',
      },
      {
        title: 'Le urgenze arrivano a una persona',
        body: 'Sulle urgenze e sulle modifiche l’assistente non improvvisa: prende nome e numero e crea un evento "da richiamare" nel vostro calendario, così se ne occupa qualcuno dello staff.',
      },
    ],
  },
  security: {
    title: 'Privacy e sicurezza',
    lead: 'Uno studio dentistico lavora con dati sensibili. Il nostro criterio è toccarne il meno possibile.',
    items: [
      {
        title: 'Chiediamo il minimo indispensabile',
        body: 'Per fissare un appuntamento all’assistente servono un nome e un numero di telefono. Nessuna anamnesi, nessun documento, nessun dato di pagamento.',
      },
      {
        title: 'Il paziente sa che è un’AI',
        body: 'L’assistente lo dichiara prima che inizi la conversazione. Non fa diagnosi e non dà consigli medici: le domande cliniche passano allo studio.',
      },
      {
        title: 'Accordo sul trattamento dei dati firmato',
        body: 'Prima di andare online firmiamo con lo studio un accordo sul trattamento dei dati (DPA): cosa viene trattato, perché e per quanto tempo. Lo studio resta titolare del trattamento.',
      },
    ],
  },
  websites: {
    title: 'Siti web per piccole aziende',
    lead: 'Oltre all’assistente per i dentisti realizziamo siti web: quelli che servono davvero a una piccola azienda, non una vetrina per noi.',
    items: [
      'Veloci prima di tutto sul telefono, perché è lì che sono i vostri clienti',
      'Una struttura chiara: cosa fate, dove siete, come vi si contatta',
      'L’assistente AI si può aggiungere in un secondo momento, sullo stesso sito',
      'Nessun CMS da imparare: ci dite cosa cambia e lo aggiorniamo noi',
    ],
    cta: 'Chiedi informazioni su un sito',
  },
  trial: {
    title: 'La prova gratuita di 14 giorni',
    lead: 'Due settimane sul vostro sito, a costo zero e senza firmare nulla in anticipo.',
    steps: [
      'Configuriamo l’assistente con i vostri orari, i trattamenti e le domande frequenti e lo mettiamo online sul vostro sito.',
      'Resta attivo 14 giorni. Vedete conversazioni vere e prenotazioni vere, non una demo.',
      'Guardiamo insieme i risultati e decidete se vale la pena tenerlo.',
      'Se lo tenete diventa un abbonamento mensile. Altrimenti lo rimuoviamo lo stesso giorno, gratuitamente.',
    ],
    cta: 'Inizia la prova su WhatsApp',
    note: 'Del prezzo mensile parliamo dopo la prova, quando sappiamo entrambi quanto lo studio lo usa davvero.',
  },
  faq: {
    title: 'Domande frequenti',
    lead: 'Se manca qualcosa, scrivetecelo su WhatsApp.',
    items: [
      {
        q: 'L’assistente dà consigli medici?',
        a: 'No. Risponde a domande organizzative e fissa appuntamenti. Tutto ciò che è clinico passa allo studio, e al paziente viene detto che qualcuno dello studio lo ricontatterà.',
      },
      {
        q: 'Cosa succede con le urgenze?',
        a: 'L’assistente non fa triage. Prende nome e numero di telefono e crea un evento "da richiamare" nel vostro calendario, così lo staff può intervenire in fretta. Lo stesso vale quando un paziente vuole spostare o disdire un appuntamento.',
      },
      {
        q: 'Funziona con il sito che abbiamo già?',
        a: 'Sì, se possiamo aggiungerci una riga di codice. È possibile su quasi tutti i siti — WordPress, Wix, Squarespace o sviluppati su misura.',
      },
      {
        q: 'Dobbiamo cambiare calendario o gestionale?',
        a: 'No. Lavoriamo con il Google Calendar che lo studio usa già. Gli appuntamenti compaiono come eventi normali e potete spostarli o cancellarli come sempre.',
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
  },
  footer: {
    tagline: 'Assistente AI per studi dentistici e siti web per piccole aziende.',
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
          'L’assistente AI descritto in questa pagina funziona sui siti dei nostri clienti, cioè degli studi stessi. Per quelle conversazioni il titolare del trattamento è lo studio e Twinbyte agisce come responsabile, sulla base di un accordo sul trattamento dei dati firmato.',
          'Questa informativa riguarda quindi solo questo sito. I pazienti che parlano con un assistente sul sito di uno studio devono fare riferimento all’informativa di quello studio.',
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
  wa: {
    generic: 'Ciao Twinbyte, ho una domanda sul vostro assistente AI.',
    trial:
      'Ciao Twinbyte, vorrei iniziare la prova gratuita di 14 giorni dell’assistente AI per il mio studio dentistico.',
    websites: 'Ciao Twinbyte, vorrei sapere di più su un sito web per la mia azienda.',
  },
}
