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
    ctaDemo: 'Zie hem een afspraak maken',
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
    lead: 'Geen telefoontje nodig om te weten wat u betaalt. Dit zijn introductieprijzen \u2014 ze gaan omhoog zodra we een portfolio hebben, en wie nu tekent houdt de zijne.',
    launch: {
      tag: 'Introductieaanbod \u2014 eerste drie klanten',
      body: 'Volledige site + Assistent, met de installatiekosten van de assistent eraf en de eerste drie maanden van ons. Vanaf maand vier geldt het normale bundelbedrag. Drie klanten, daarna is het weg.',
      rows: [
        { label: 'Eenmalig', value: '\u20AC690', was: 'in plaats van \u20AC1.230' },
        { label: 'Eerste drie maanden', value: '\u20AC0', was: 'in plaats van \u20AC138 per maand' },
        { label: 'Vanaf maand vier', value: '\u20AC109', was: 'in plaats van \u20AC138' },
      ],
      savingLabel: 'Bespaard in de eerste drie maanden',
      saving: '\u20AC954',
    },
    bar: {
      text: 'Eerste drie klanten: de assistent krijgt u gratis bij een website.',
      cta: 'Bekijk de tarieven',
    },
    setupLabel: 'Eenmalig',
    monthLabel: 'Per maand',
    plans: [
      {
        name: 'E\u00e9npagina-site',
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
        month: '\u20AC109',
        points: ['300 gesprekken per maand', 'Plant in de agenda die u al gebruikt', '\u00c9\u00e9n taal'],
      },
      {
        name: 'Assistent Pro',
        setup: '\u20AC340',
        month: '\u20AC169',
        plus: 'Alles uit Assistent, plus:',
        points: ['1.000 gesprekken per maand', 'Ook via WhatsApp, niet alleen de website', 'Elke taal waarin uw klanten schrijven'],
      },
    ],
    bundle: {
      tag: 'Allebei samen',
      name: 'Volledige site + Assistent',
      setup: '\u20AC860',
      month: '\u20AC109',
      body: 'Dertig procent van de eenmalige kosten eraf, en het maandbedrag van de site is van ons zolang u de assistent houdt. Ze samen bouwen is voor ons echt minder werk, dus het verschil is voor u.',
    },
    fine: [
      'Gesprekken boven uw pakket: \u20AC0,08 per stuk. We zeggen het voordat u eroverheen gaat, niet erna.',
      'Extra pagina op een volledige site: \u20AC140.',
      'Maand per maand, \u00e9\u00e9n maand opzegtermijn. Nooit een lang contract.',
      'Prijzen in euro, zakelijk. Btw wordt, waar van toepassing, op de offerte vermeld.',
    ],
    cta: 'Vraag een offerte',
  },
  split: {
    title: 'Twee diensten, allebei goed gedaan',
    assistant: {
      tag: 'Digitale assistent',
      title: 'Verlies niet langer de oproepen die u nooit hoort',
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
  assembly: {
    title: 'Hoe we het bouwen',
    beats: [
      {
        kick: 'Hoe we werken',
        title: 'Elk onderdeel op maat.',
        body: 'Een site is een stapel kleine beslissingen: de woorden, de openingstijden, de knop, dat wat antwoordt. Elke beslissing nemen we bewust.',
      },
      {
        kick: 'In elkaar gezet',
        title: 'Niets van de plank.',
        body: 'Geen sjabloon met uw logo erin geplakt. De onderdelen zijn gesneden voor uw bedrijf en met de hand gemonteerd, in de volgorde waarin ze horen.',
      },
      {
        kick: 'Opgeleverd',
        title: 'Dicht, getest, van u.',
        body: 'Eén afgewerkt geheel dat werkt op een telefoon, voor een prijs die op de pagina staat, per maand opzegbaar.',
      },
    ],
    pins: ['Uw pagina\u2019s', 'De assistent', 'Hosting inbegrepen', 'Werkt op een telefoon', 'Prijs op de pagina', 'Per maand opzegbaar'],
  },
  dayStrip: {
    eyebrow: 'Een dinsdag',
    title: 'U bent acht van deze vierentwintig uren open',
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
        body: 'Eén regel code op de site die u al heeft. Niets te installeren, verder verandert er niets. Een WhatsApp-versie volgt binnenkort.',
      },
      {
        title: 'Klanten plannen zelf',
        body: 'De assistent kijkt wanneer u beschikbaar bent, vraagt om een naam en een telefoonnummer en zet de afspraak in de agenda die u al gebruikt. U houdt die volledig in eigen hand.',
      },
    ],
  },
  benefits: {
    title: 'Wat uw bedrijf eraan heeft',
    lead: 'Het begon bij tandartspraktijken, waar een gemiste oproep een verloren patiënt is. Datzelfde probleem heeft elk bedrijf dat op afspraak werkt: een salon, een garage, een praktijk, een studio, een adviesbureau.',
    items: [
      {
        title: 'Minder telefoontjes om op te nemen',
        body: 'Openingstijden, adres, parkeren, prijzen, hoe een eerste afspraak verloopt: die vragen worden beantwoord zonder dat iemand de telefoon opneemt.',
      },
      {
        title: 'Afspraken buiten openingstijden',
        body: 'Avonden, weekenden, feestdagen en elke tijdzone waarin uw klanten zitten. Wie anders morgen zou bellen — of een concurrent zou bellen — plant vanavond.',
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
        title: 'Een ondertekende verwerkersovereenkomst',
        body: 'Voor de livegang tekenen we een verwerkersovereenkomst met u: wat er verwerkt wordt, waarom en hoe lang. U blijft verwerkingsverantwoordelijke.',
      },
    ],
  },
  websites: {
    title: 'Websites voor kleine bedrijven',
    lead: 'Naast de assistent bouwen we websites — het soort site dat een klein bedrijf echt nodig heeft, geen etalage voor onszelf.',
    cta: 'Vraag naar een website',
    includesTitle: 'Wat een site omvat',
    includes: [
      'Pagina\u2019s samen met u geschreven — uw woorden, geen opvultekst',
      'Goed ingesteld voor Google: titels, omschrijvingen, uw bedrijf op de kaart',
      'Contactwegen die echt gebruikt worden: WhatsApp, telefoon, e-mail',
      'Hosting op een gratis plan, dus geen maandelijkse hostingrekening',
      'Geen cookies en geen tracking, dus geen banner voor de neus van uw klant',
    ],
    whoTitle: 'Voor wie het past',
    who: 'Winkels, garages, vakmensen, praktijken, studio\u2019s: iedereen die op een telefoon wordt opgezocht voordat er gebeld wordt. Heeft u een webshop met honderden producten nodig, dan zijn wij niet de juiste partij en zeggen we dat.',
    quoteNote: 'Prijs en planning na een telefoontje van tien minuten: het hangt af van hoeveel pagina\u2019s u nodig heeft en of u al teksten en foto\u2019s heeft.',
    showcase: 'Bekijk een pagina die indruk maakt',
  },
  faq: {
    title: 'Veelgestelde vragen',
    lead: 'Staat uw vraag er niet bij? Stel hem gerust via WhatsApp.',
    items: [
      {
        q: 'Mijn klanten hebben een hekel aan chatbots. Waarom zou dit anders zijn?',
        a: 'Omdat de meeste geen antwoord geven maar afhouden: eindeloze menu’s om een mens te vermijden. Deze beantwoordt de vraag, plant de afspraak en geeft, zodra hij niet kan helpen, naam en nummer door aan u. De klant krijgt vanaf de eerste regel te horen dat het geen persoon is.',
      },
      {
        q: 'Wat voorkomt dat hij iets verkeerds zegt?',
        a: 'Hij antwoordt op basis van de informatie die u ons geeft — uw tijden, uw diensten, uw prijzen — en niets anders. Weet hij iets niet, dan zegt hij dat, noteert de gegevens en legt de vraag bij u neer in plaats van een antwoord te verzinnen.',
      },
      {
        q: 'Wat kost het?',
        a: 'De hele prijslijst staat op deze pagina — er wordt niets achtergehouden tot een telefoongesprek. De assistent kost €240 eenmalig en €109 per maand voor 300 gesprekken; sites beginnen bij €590. Neemt u allebei, dan gaat er dertig procent van de eenmalige kosten af en is het maandbedrag van de site van ons.',
      },
      {
        q: 'Werkt het met onze huidige website?',
        a: 'Ja, zolang we er één regel code aan kunnen toevoegen. Dat kan bij vrijwel elke site — WordPress, Wix, Squarespace, Shopify of maatwerk. Verder blijft uw site precies zoals hij is.',
      },
      {
        q: 'Moeten we onze agenda of software aanpassen?',
        a: 'Nee. We stellen de assistent in op de agenda waarmee u al werkt: met Google Agenda is het meteen klaar, en voor andere boekingssoftware bekijken we de koppeling samen voordat we beginnen. Afspraken verschijnen als gewone items die u kunt verzetten of annuleren zoals altijd.',
      },
      {
        q: 'En als we willen stoppen?',
        a: 'U geeft het aan en wij halen de assistent van uw site. Het abonnement loopt per maand, met een maand opzegtermijn.',
      },
    ],
  },
  contact: {
    title: 'Neem contact op',
    email: 'Stuur een e-mail',
    emailSubject: 'Vraag over de Twinbyte-assistent',
    note: 'U krijgt altijd antwoord van Anna of Samuele — er zit geen callcenter achter.',
    regions: 'We werken op afstand met bedrijven waar ook ter wereld. Waar u ook zit, de assistent antwoordt in de taal van uw klanten.',
  },
  footer: {
    tagline: 'Digitale assistent voor kleine bedrijven en websites die snel laden.',
    colophon: 'Gezet uit Bricolage Grotesque en Inter. Gemaakt in Nederland. Deze site plaatst geen cookies, gebruikt geen analytics en laadt geen trackingpixels.',
    privacy: 'Privacyverklaring',
    rights: 'Alle rechten voorbehouden.',
  },
  privacyPage: {
    title: 'Privacyverklaring',
    updated: 'Laatst bijgewerkt',
    intro:
      'Deze verklaring legt uit wat er met persoonsgegevens gebeurt op deze website en wanneer u contact met ons opneemt. Hij is bewust kort, want deze website verzamelt vrijwel niets.',
    sections: [
      {
        title: 'Wie wij zijn',
        body: [
          'Twinbyte — Anna en Samuele.',
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
        title: 'De assistent op deze pagina',
        body: [
          'De chatbubbel rechtsonder is onze eigen assistent, en het enige op deze pagina dat uw browser ergens anders vandaan haalt. Het script komt van een server die wij bij Vercel draaien en de antwoorden van een server bij Railway. Omdat uw browser die rechtstreeks opvraagt, zien die twee partijen uw IP-adres en browsertype.',
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
    eventTime: 'do 18 sep · 10:30 – 11:00',
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
      'Hallo Twinbyte, ik wil graag een prijs voor de digitale assistent voor mijn bedrijf.',
    websitesQuote: 'Hallo Twinbyte, ik wil graag een offerte voor een website voor mijn bedrijf.',
  },
}
