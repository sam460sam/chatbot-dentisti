import metaJson from './meta.json'
import type { Translation } from './types'

export const nl: Translation = {
  htmlLang: 'nl',
  meta: metaJson.nl,
  nav: {
    how: 'Hoe het werkt',
    benefits: 'Wat het oplevert',
    security: 'Privacy & veiligheid',
    websites: 'Websites',
    prices: 'Tarieven',
    faq: 'Veelgestelde vragen',
    contact: 'Contact',
    openMenu: 'Menu openen',
    closeMenu: 'Menu sluiten',
    language: 'Taal',
    main: 'Hoofdnavigatie',
    skip: 'Naar de inhoud',
  },
  hero: {
    title: 'De website die uw afspraken inplant.',
    lead: 'Wij bouwen de site, en de assistent erop beantwoordt uw klanten en vult uw agenda, op elk uur.',
    ctaQuote: 'Bekijk wat het kost',
    ctaDemo: 'Kijk hoe hij een afspraak maakt',
  },
  heroSite: {
    url: 'uw-bedrijf.nl',
    name: 'Uw bedrijf',
    tagline: 'De pagina waar uw klanten landen voordat ze bellen.',
    hours: 'Open ma–vr · 09:00–17:00',
    address: 'Kerkstraat 12, Groningen',
    nav: ['Wat we doen', 'Tarieven', 'Route'],
    call: 'Bel nu',
    book: 'Online afspraak',
    phoneLabel: 'Op de telefoon, 23:47',
    status: 'Antwoordt direct',
    input: 'Schrijf een bericht',
  },
  pricing: {
    eyebrow: 'Wat het kost',
    title: 'De hele prijslijst, gewoon op de pagina',
    lead: 'Geen telefoontje nodig om te weten wat u betaalt. Dit zijn introductieprijzen: ze gaan omhoog, en wie nu tekent houdt de zijne.',
    launch: {
      tag: 'Introductieaanbod \u2014 eerste drie klanten',
      body: 'Volledige site + Assistent, met de installatiekosten van de assistent eraf en de eerste drie maanden van ons. Vanaf maand vier geldt het normale bundelbedrag. Drie klanten, daarna is het weg.',
      rows: [
        { label: 'Eenmalig', value: '\u20AC690', was: 'in plaats van \u20AC1.230' },
        { label: 'Eerste drie maanden', value: '\u20AC0', was: 'in plaats van \u20AC108 per maand' },
        { label: 'Vanaf maand vier', value: '\u20AC79', was: 'in plaats van \u20AC108' },
      ],
      savingLabel: 'U bespaart (eenmalig + eerste drie maanden)',
      saving: '\u20AC864',
      cta: 'Vraag een van de drie plekken aan',
      wa: 'Hallo Twinbyte, ik wil graag het introductieaanbod (volledige site + assistent). Is er nog een plek vrij?',
    },
    bar: {
      text: 'Eerste drie klanten: de assistent krijgt u gratis bij een website.',
      cta: 'Bekijk de tarieven',
    },
    setupLabel: 'Eenmalig',
    monthLabel: 'Per maand',
    plans: [
      {
        name: 'Website van \u00e9\u00e9n pagina',
        setup: '\u20AC590',
        month: '\u20AC19',
        points: ['Alles op \u00e9\u00e9n scherm: openingstijden, adres, \u00e9\u00e9n tik om te bellen', 'Geschreven in uw eigen taal', 'Hosting en kleine wijzigingen inbegrepen'],
      },
      {
        name: 'Volledige site',
        setup: '\u20AC990',
        month: '\u20AC29',
        points: ['Tot vijf pagina\u2019s', 'Vindbaar op Google, in elke taal waarin u verkoopt', 'Hosting en kleine wijzigingen inbegrepen'],
      },
      {
        name: 'Assistent',
        setup: '\u20AC240',
        month: '\u20AC79',
        points: ['300 gesprekken per maand', 'Plant in de agenda die u al gebruikt', 'Antwoordt in de taal van uw klant'],
      },
      {
        name: 'Assistent Pro',
        setup: '\u20AC340',
        month: '\u20AC129',
        plus: 'Alles uit Assistent, plus:',
        points: ['1.000 gesprekken per maand', 'Ook via WhatsApp, niet alleen de website'],
      },
    ],
    bundle: {
      tag: 'Samen in \u00e9\u00e9n pakket',
      name: 'Volledige site + Assistent',
      setup: '\u20AC860',
      month: '\u20AC79',
      body: 'Dertig procent van de eenmalige kosten eraf, en het maandbedrag van de site is van ons zolang u de assistent houdt. Ze samen bouwen is voor ons echt minder werk, dus het verschil is voor u.',
    },
    fine: [
      'Online in ongeveer een week, zodra we uw teksten en foto’s hebben.',
      'Het maandbedrag dekt hosting, het beveiligingscertificaat, een standaard domeinnaam en kleine wijzigingen.',
      'Kleine wijzigingen (openingstijden, prijzen, teksten, foto’s): stuur ze via WhatsApp, binnen een week geregeld.',
      'Gesprekken boven uw pakket: \u20AC0,08 per stuk. We zeggen het voordat u eroverheen gaat, niet erna.',
      'Extra pagina op een volledige site: \u20AC140.',
      'Maand per maand, \u00e9\u00e9n maand opzegtermijn. Nooit een lang contract.',
      'Prijzen in euro, zakelijk. Btw wordt, waar van toepassing, op de offerte vermeld.',
    ],
    cta: 'Vraag het pakket aan',
    planCta: 'Vraag dit pakket aan',
    planWa: 'Hallo Twinbyte, ik heb interesse in het pakket “{plan}”. Wanneer kunnen we even bellen?',
  },
  split: {
    title: 'Twee diensten, allebei goed gedaan',
    assistant: {
      tag: 'Digitale assistent',
      title: 'Verlies geen telefoontjes meer die u nooit hoort',
      body: 'Hij staat op de website die u al heeft en behandelt de vragen en afspraken die u anders telefonisch aanneemt: ’s avonds, in het weekend, terwijl u bij een klant bent.',
      points: [
        'Antwoordt binnen seconden, alleen met uw informatie',
        'Plant rechtstreeks in uw bestaande agenda',
        'Geeft alles wat gevoelig is door aan iemand van uw team',
      ],
      cta: 'Bekijk hoe het werkt',
      quote: 'Vraag een offerte aan',
    },
    websites: {
      tag: 'Websites',
      title: 'Een site die mensen lezen, niet bewonderen',
      body: 'Voor bedrijven waarvan klanten eerst op hun telefoon kijken voordat ze besluiten te bellen. Openingstijden, wat u doet en hoe men u bereikt, binnen tien seconden te vinden.',
      points: [
        'Snel op de telefoon, ook bij slecht bereik',
        'Geen CMS om te leren: u zegt het, wij passen het aan',
        'De assistent kan er later bij',
      ],
      cta: 'Bekijk wat we bouwen',
      quote: 'Vraag een offerte aan',
    },
  },
  scenes: {
    handover: {
      eyebrow: 'Als het ertoe doet',
      lead: 'Alles wat gevoelig is gaat naar',
      accent: 'een mens',
      tail: '',
      body: 'Dringend, ongewoon of buiten zijn kennis: de assistent stopt, noteert de gegevens en zet een terugbelafspraak in uw agenda. Iemand van uw team maakt het af.',
    },
  },
  devices: {
    eyebrow: 'Een live voorbeeld',
    title: 'Gemaakt voor de telefoon. Net zo duidelijk op een laptop.',
    lead: 'Een demosite die we maakten voor een fictieve tandartspraktijk. Scrol verder, en de pagina\u2019s scrollen met u mee.',
    points: [
      { title: 'Uw pagina\u2019s', body: 'Openingstijden, wat u doet en hoe men u bereikt, binnen tien seconden te vinden.' },
      { title: 'Werkt op een telefoon', body: 'Snel op de telefoon, ook bij slecht bereik: daar zoeken uw klanten u op.' },
      { title: 'De assistent, als u wilt', body: 'Toegevoegd aan dezelfde site beantwoordt hij vragen en plant hij afspraken in de chat.' },
    ],
    chips: ['Hosting inbegrepen', 'Prijs op de pagina', 'Per maand opzegbaar'],
    cta: 'Bekijk de live demo',
    note: 'De praktijk is fictief. De website en de assistent zijn gemaakt door Twinbyte.',
    alt: 'De website van de fictieve demopraktijk, op een laptop en op een telefoon',
  },
  dayStrip: {
    eyebrow: 'Een dinsdag',
    title: 'U bent acht van deze vierentwintig uur open',
    caption: 'De andere zestien zijn van niemand. Wie om 21:40 schrijft is niet lastig — dat is het uur waarop hij eindelijk ging zitten.',
    legendOpen: 'Open — u antwoordt',
    legendShut: 'Dicht — de assistent antwoordt',
  },
  how: {
    title: 'Hoe het werkt',
    lead: 'Drie stappen, en het werk aan uw kant zit vooral in de eerste.',
    steps: [
      {
        title: 'Wij richten het in met uw gegevens',
        body: 'U stuurt ons uw openingstijden, wat u aanbiedt en de vragen die klanten het vaakst stellen. Daar bouwen wij de assistent omheen, zodat de antwoorden van u zijn en niet uit een standaardtekst komen.',
      },
      {
        title: 'Wij plaatsen het op uw website',
        body: 'Eén regel code op de site die u al heeft. Niets te installeren, verder verandert er niets. Met Assistent Pro antwoordt hij ook op WhatsApp; dat inrichten duurt ongeveer twee weken.',
      },
      {
        title: 'Klanten plannen zelf een afspraak',
        body: 'De assistent kijkt wanneer u beschikbaar bent, vraagt om een naam en een telefoonnummer en zet de afspraak in de agenda die u al gebruikt. U houdt die volledig in eigen hand.',
      },
    ],
  },
  benefits: {
    title: 'Wat uw bedrijf eraan heeft',
    lead: 'In elk bedrijf dat op afspraak werkt, is een gemist telefoontje een verloren klant: een salon, een garage, een tandartspraktijk, een studio, een adviesbureau. Voor allemaal werkt dezelfde assistent.',
    items: [
      {
        title: 'Minder telefoontjes om op te nemen',
        body: 'Openingstijden, adres, parkeren, prijzen, hoe een eerste afspraak verloopt: die vragen worden beantwoord zonder dat iemand de telefoon opneemt.',
      },
      {
        title: 'Afspraken buiten openingstijden',
        body: 'Avonden, weekenden, feestdagen en elke tijdzone waarin uw klanten zitten. Wie anders morgen zou bellen — of een concurrent zou bellen — plant vanavond een afspraak.',
      },
      {
        title: 'Hij spreekt de taal van uw klant',
        body: 'We stellen de assistent in op de taal waarin u werkt, en als een klant vraagt om verder te gaan in een andere taal, schakelt hij over. Handig overal waar uw klanten niet allemaal van hier zijn.',
      },
    ],
  },
  security: {
    title: 'Privacy en veiligheid',
    lead: 'De gegevens van uw klanten zijn van u, niet van ons. Ons uitgangspunt: er zo min mogelijk van aanraken.',
    items: [
      {
        title: 'Wij vragen het minimum',
        body: 'Voor een afspraak heeft de assistent een naam en een telefoonnummer nodig. Geen documenten, geen betaalgegevens en niets gevoeligs dat uw bedrijf niet nodig heeft om een afspraak in te plannen.',
      },
      {
        title: 'De klant weet dat het geen persoon is',
        body: 'De assistent zegt dat voordat het gesprek begint. Hij geeft geen professioneel of medisch advies — alles waarvoor een oordeel nodig is, gaat naar u.',
      },
      {
        title: 'Een ondertekende verwerkers\u00ADovereenkomst',
        body: 'Voor de livegang tekenen we een verwerkersovereenkomst met u: wat er verwerkt wordt, waarom en hoe lang. U blijft verwerkingsverantwoordelijke.',
      },
    ],
  },
  websites: {
    title: 'Websites voor kleine bedrijven',
    lead: 'Duidelijke, snelle websites voor kleine bedrijven: uw openingstijden, wat u doet, waar u zit en met één tik bellen, makkelijk te vinden op elke telefoon.',
    cta: 'Vraag naar een website',
    includesTitle: 'Wat er bij een website hoort',
    includes: [
      'Pagina\u2019s samen met u geschreven — uw woorden, geen opvultekst',
      'Goed ingesteld voor Google: titels, omschrijvingen, uw bedrijf op de kaart',
      'Contactwegen die echt gebruikt worden: WhatsApp, telefoon, e-mail',
      'Hosting en kleine wijzigingen zitten in het maandbedrag, geen aparte hostingrekening',
      'Geen cookies en geen tracking, dus geen banner voor de neus van uw klant',
    ],
    whoTitle: 'Voor wie het past',
    who: 'Winkels, garages, vakmensen, praktijken, studio\u2019s: iedereen die op een telefoon wordt opgezocht voordat er gebeld wordt. Heeft u een webshop met honderden producten nodig, dan zijn wij niet de juiste partij en zeggen we dat.',
    quoteNote: 'De prijzen staan op de pagina Tarieven. In het gratis gesprek van 15 minuten spreken we het pakket en de planning af: dat hangt af van hoeveel pagina\u2019s u nodig heeft en of u al teksten en foto\u2019s heeft.',
    showcase: 'Bekijk een pagina die indruk maakt',
  },
  faq: {
    title: 'Veelgestelde vragen',
    lead: 'Staat uw vraag er niet bij? Stel hem gerust via WhatsApp.',
    items: [
      {
        q: 'Mijn klanten hebben een hekel aan chatbots. Waarom zou dit anders zijn?',
        show: ['home', 'assistant'],
        a: 'Omdat de meeste geen antwoord geven maar afhouden: eindeloze menu’s om een mens te vermijden. Deze beantwoordt de vraag, plant de afspraak en geeft, zodra hij niet kan helpen, naam en nummer door aan u. De klant krijgt vanaf de eerste regel te horen dat het geen persoon is.',
      },
      {
        q: 'Wat voorkomt dat hij iets verkeerds zegt?',
        show: ['assistant'],
        a: 'Hij antwoordt op basis van de informatie die u ons geeft — uw tijden, uw diensten, uw prijzen — en niets anders. Weet hij iets niet, dan zegt hij dat, noteert de gegevens en legt de vraag bij u neer in plaats van een antwoord te verzinnen.',
      },
      {
        q: 'Wat kost het?',
        a: 'De hele prijslijst voor websites en de assistent staat op deze pagina — er wordt niets achtergehouden tot een telefoongesprek. De assistent kost €240 eenmalig en €79 per maand voor 300 gesprekken; sites beginnen bij €590. Neemt u de volledige site en de assistent samen, dan gaat er dertig procent van de eenmalige kosten af en is het maandbedrag van de site van ons.',
      },
      {
        q: 'Is de website van mij?',
        show: ['home'],
        a: 'Uw site werkt als abonnement: ontwerp, hosting, het beveiligingscertificaat, een standaard domeinnaam en kleine wijzigingen zitten allemaal in het maandbedrag. U kunt per maand stoppen met één maand opzegtermijn; als het abonnement afloopt, halen we de site offline. Een premium domeinnaam rekenen we apart.',
      },
      {
        q: 'Hoe snel staat mijn site online?',
        a: 'Online in ongeveer een week, zodra we uw teksten en foto’s hebben. Kleine wijzigingen (openingstijden, prijzen, teksten, foto’s): stuur ze via WhatsApp, binnen een week geregeld.',
      },
      {
        q: 'Wat kosten de advertenties?',
        a: 'U betaalt twee dingen: het advertentiebudget, dat naar Meta gaat, en ons bedrag voor het maken en beheren van de advertenties. Beide spreken we af in het gesprek, voordat er iets begint.',
      },
      {
        q: 'Werkt het met onze huidige website?',
        show: ['assistant'],
        a: 'Ja, zolang we er één regel code aan kunnen toevoegen. Dat kan bij vrijwel elke site — WordPress, Wix, Squarespace, Shopify of maatwerk. Verder blijft uw site precies zoals hij is.',
      },
      {
        q: 'Moeten we onze agenda of software aanpassen?',
        show: ['assistant'],
        a: 'Nee. We stellen de assistent in op de agenda waarmee u al werkt: met Google Agenda is het meteen klaar, en voor andere boekingssoftware bekijken we de koppeling samen voordat we beginnen. Afspraken verschijnen als gewone items die u kunt verzetten of annuleren zoals altijd.',
      },
      {
        q: 'En als we willen stoppen?',
        show: ['assistant'],
        a: 'U geeft het aan en wij halen de assistent van uw site. Het abonnement loopt per maand, met een maand opzegtermijn.',
      },
      {
        q: 'Ik ben niet handig met computers. Is dat een probleem?',
        show: ['home'],
        a: 'Nee. U hoeft niets te leren: geen CMS, geen beheeromgeving. We schrijven de pagina’s samen met u, en verandert er iets (openingstijden, een prijs, een foto), dan stuurt u ons een WhatsApp en passen wij het aan. Kleine wijzigingen zitten in het maandbedrag.',
      },
      {
        q: 'Ik heb al een website. Heb ik een nieuwe nodig?',
        show: ['home'],
        a: 'Niet voor de assistent: die komt met één regel code op de site die u al heeft, en de rest blijft zoals het is. Is uw site traag of slecht leesbaar op een telefoon, dan bouwen we een nieuwe; de prijzen staan op de pagina Tarieven.',
      },
      {
        q: 'Neemt de assistent mijn telefoon op?',
        show: ['home', 'assistant'],
        a: 'Nee. Hij antwoordt in een chat op uw website (met Assistent Pro ook op WhatsApp), alleen met uw eigen informatie, en zet afspraken in uw agenda. Wat hij niet kan afhandelen, komt bij u terecht met de naam en het nummer van de klant.',
      },
    ],
  },
  contact: {
    title: 'Neem contact op',
    email: 'Stuur een e-mail',
    emailSubject: 'Vraag aan Twinbyte',
    note: 'U krijgt altijd antwoord van het team van Twinbyte zelf — er zit geen callcenter achter.',
    regions: 'We werken op afstand met bedrijven waar ook ter wereld. Waar u ook zit, de assistent antwoordt in de taal van uw klanten.',
  },
  footer: {
    tagline: 'Snelle websites, een digitale assistent en online advertenties voor lokale bedrijven.',
    colophon: 'Gezet in Bricolage Grotesque, Inter en Instrument Serif. Gemaakt in Nederland. Deze site plaatst geen cookies, gebruikt geen analytics en laadt geen trackingpixels.',
    privacy: 'Privacyverklaring',
    rights: 'Alle rechten voorbehouden.',
  },
  privacyPage: {
    title: 'Privacyverklaring',
    updated: 'Laatst bijgewerkt',
    intro:
      'Deze verklaring legt uit wat er met persoonsgegevens gebeurt op deze website en wanneer u contact met ons opneemt. Hij is bewust kort: de website plaatst geen cookies en houdt niets bij. We ontvangen alleen wat u zelf invult in een formulier (om een gesprek te plannen of een aanvraag te doen) of typt in de chat op de pagina Digitale assistent.',
    sections: [
      {
        title: 'Wie wij zijn',
        body: [
          'Twinbyte.',
          'Verwerkingsverantwoordelijke: TODO_LEGAL_NAME',
          'Adres: TODO_ADDRESS',
          'BTW- / KvK-nummer: TODO_VAT_NUMBER',
          'E-mail: info@twinbyteservices.com',
        ],
      },
      {
        title: 'Deze website',
        body: [
          'Deze website gebruikt geen cookies. Er wordt niets opgeslagen voor statistieken, advertenties of profilering, en daarom is er ook geen cookiebanner om weg te klikken.',
          'We gebruiken geen analytics en geen trackingtools, en de lettertypen worden vanaf dit domein geladen.',
          'De site draait op Cloudflare Pages. Zoals elke webserver verwerkt de hostingpartij technische gegevens van het verzoek, zoals IP-adres en browsertype, om de pagina’s te kunnen tonen en de dienst tegen misbruik te beschermen.',
        ],
      },
      {
        title: 'De assistent op de pagina Digitale assistent',
        body: [
          'Het chatvenster verschijnt alleen op de pagina Digitale assistent; geen andere pagina laadt het. Het is onze eigen assistent. Het script komt van een server die wij bij Vercel draaien en de antwoorden van een server bij Railway. Omdat uw browser die rechtstreeks opvraagt, zien die twee partijen uw IP-adres en browsertype.',
          'Opent u de chat, dan gaat wat u typt naar die server om beantwoord te worden, samen met de taal van de pagina. Zet er niets in wat u ons niet ook per e-mail zou sturen — voor een afspraak of een offerte kunt u ons beter via WhatsApp of op info@twinbyteservices.com bereiken.',
        ],
      },
      {
        title: 'Als u contact opneemt',
        body: [
          'Schrijft u ons via WhatsApp of e-mail, dan verwerken wij wat u stuurt: uw naam, uw contactgegevens en de inhoud van uw bericht. Dat gebruiken we om u te antwoorden en, als het gesprek verdergaat, om een voorstel op te stellen.',
          'We bewaren die correspondentie zolang het gesprek en onze wettelijke verplichtingen dat vragen, en verwijderen die daarna.',
          'WhatsApp wordt geleverd door Meta en onze e-mail door Google. Op berichten onderweg en op hun servers zijn hun eigen voorwaarden van toepassing.',
        ],
      },
      {
        title: 'De assistent op websites van klanten',
        body: [
          'De assistent die op deze pagina beschreven wordt, draait op de websites van onze klanten. Voor die gesprekken is de klant verwerkingsverantwoordelijke en treedt Twinbyte op als verwerker, op basis van een ondertekende verwerkersovereenkomst.',
          'Deze verklaring gaat dus alleen over deze website. Wie met een assistent op de site van een klant chat, leest de privacyverklaring van dat bedrijf.',
        ],
      },
      {
        title: 'Uw rechten',
        body: [
          'U kunt ons vragen om inzage in uw gegevens, om correctie, verwijdering of beperking, om een kopie in een overdraagbaar formaat, en u kunt bezwaar maken tegen de verwerking. Stuur een bericht naar info@twinbyteservices.com en we regelen het.',
          'Vindt u dat wij niet zorgvuldig met uw gegevens omgaan, dan kunt u een klacht indienen bij de toezichthouder in uw land.',
          'TODO_SUPERVISORY_AUTHORITY',
        ],
      },
      {
        title: 'Wijzigingen',
        body: ['Verandert deze verklaring, dan passen we de datum bovenaan de pagina aan.'],
      },
    ],
    back: 'Terug naar de homepage',
  },
  demo: {
    tag: 'Voorbeeldgesprek',
    siteLabel: 'uw-website.nl',
    messages: [
      { from: 'patient', text: 'Goedenavond, kan ik volgende week een afspraak maken?' },
      { from: 'bot', text: 'Zeker. Donderdag de 18e om 10:30, of vrijdag de 19e om 16:00?' },
      { from: 'patient', text: 'Donderdag is goed.' },
      { from: 'bot', text: 'Mag ik uw naam en een telefoonnummer?' },
      { from: 'patient', text: 'Laura Bakker, 06 12345678' },
      { from: 'bot', text: 'Genoteerd: donderdag de 18e om 10:30. Het staat nu in uw agenda.' },
    ],
    typing: 'typt',
    calendarTitle: 'Uw agenda',
    eventTitle: 'Afspraak — Laura Bakker',
    eventTime: 'donderdag · 10:00 – 10:30',
    eventBadge: 'Aangemaakt door de assistent',
    callback: 'Terugbellen — spoedvraag',
    tryHere: 'De chatbubbel rechtsonder is de echte assistent. Probeer hem gerust.',
    knows: 'Weet hij het antwoord?',
    yes: 'Ja',
    books: 'Hij antwoordt en zet de afspraak in de agenda.',
    no: 'Nee, of het is dringend',
    toAPerson: 'Hij stopt en noteert twee dingen:',
    fieldName: 'Naam',
    fieldPhone: 'Telefoon',
  },
  widgetHello:
    'Hallo! Ik beantwoord vragen over Twinbyte — hoe de assistent wordt ingesteld, wat het kost, privacy. Wat wilt u weten?',
  wa: {
    generic: 'Hallo Twinbyte, ik heb een vraag over jullie digitale assistent.',
    assistantQuote:
      'Hallo Twinbyte, ik las over de digitale assistent en wil die graag voor mijn bedrijf. Wanneer kunnen we even bellen?',
    websitesQuote: 'Hallo Twinbyte, ik wil graag een website voor mijn bedrijf. Wanneer kunnen we even bellen?',
  },
}
