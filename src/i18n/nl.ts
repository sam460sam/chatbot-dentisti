import metaJson from './meta.json'
import type { Translation } from './types'

export const nl: Translation = {
  htmlLang: 'nl',
  meta: metaJson.nl,
  nav: {
    how: 'Hoe het werkt',
    benefits: 'Voor uw praktijk',
    security: 'Privacy & veiligheid',
    websites: 'Websites',
    faq: 'Veelgestelde vragen',
    contact: 'Contact',
    openMenu: 'Menu openen',
    closeMenu: 'Menu sluiten',
    language: 'Taal',
    skip: 'Naar de inhoud',
  },
  hero: {
    eyebrow: 'Twinbyte — Anna & Samuele',
    title: 'Uw praktijk geeft 24/7 antwoord, ook als de telefoon bezet is',
    lead: 'Wij zetten een AI-assistent op uw praktijkwebsite. Die beantwoordt de vragen die u dagelijks krijgt — openingstijden, behandelingen, wat u meeneemt naar een eerste afspraak — en plant afspraken rechtstreeks in uw Google Agenda.',
    ctaTrial: 'Start 14 dagen gratis',
    ctaDemo: 'Bekijk de demo',
    note: 'Vrijblijvend. Blijkt het niets voor uw praktijk, dan halen we het kosteloos weer weg.',
    bullets: [
      'Plant in de Google Agenda die u al gebruikt',
      'Antwoordt in het Nederlands, Engels en Italiaans',
      'Spoedgevallen gaan naar uw medewerkers, niet naar de AI',
    ],
  },
  how: {
    title: 'Hoe het werkt',
    lead: 'Drie stappen, en het werk aan uw kant zit vooral in de eerste.',
    steps: [
      {
        title: 'Wij richten het in met uw gegevens',
        body: 'U stuurt ons uw openingstijden, de behandelingen die u doet en de vragen die patiënten het vaakst stellen. Daar bouwen wij de assistent omheen, zodat de antwoorden van uw praktijk zijn en niet uit een standaardtekst komen.',
      },
      {
        title: 'Wij plaatsen het op uw website',
        body: 'Eén regel code op de site die u al heeft. Niets te installeren, verder verandert er niets. Een WhatsApp-versie volgt binnenkort.',
      },
      {
        title: 'Patiënten plannen zelf',
        body: 'De assistent kijkt wanneer u beschikbaar bent, vraagt om een naam en een telefoonnummer en zet de afspraak in uw Google Agenda. U houdt de agenda volledig in eigen hand.',
      },
    ],
  },
  benefits: {
    title: 'Wat uw praktijk eraan heeft',
    lead: 'Niets spectaculairs — gewoon het repeterende werk aan de balie uit handen genomen.',
    items: [
      {
        title: 'Minder telefoontjes aan de balie',
        body: 'Openingstijden, adres, parkeren, wat er bij een eerste afspraak gebeurt: die vragen worden beantwoord zonder dat iemand de telefoon opneemt.',
      },
      {
        title: 'Afspraken buiten openingstijden',
        body: 'Avonden, weekenden, feestdagen. Een patiënt die anders morgen zou bellen — of een andere praktijk zou bellen — plant vanavond.',
      },
      {
        title: 'Drie talen, één assistent',
        body: 'Patiënten schrijven in het Nederlands, Engels of Italiaans en krijgen antwoord in dezelfde taal. Handig in praktijken met internationale patiënten.',
      },
      {
        title: 'Spoed komt bij een mens terecht',
        body: 'Bij spoed of wijzigingen gaat de assistent niet zelf aan de slag. Hij noteert naam en nummer en maakt een "terugbellen"-afspraak in uw agenda, zodat een medewerker het oppakt.',
      },
    ],
  },
  security: {
    title: 'Privacy en veiligheid',
    lead: 'Een tandartspraktijk werkt met gevoelige gegevens. Ons uitgangspunt: er zo min mogelijk van aanraken.',
    items: [
      {
        title: 'Wij vragen het minimum',
        body: 'Voor een afspraak heeft de assistent een naam en een telefoonnummer nodig. Geen medische voorgeschiedenis, geen documenten, geen betaalgegevens.',
      },
      {
        title: 'De patiënt weet dat het een AI is',
        body: 'De assistent zegt dat voordat het gesprek begint. Hij stelt geen diagnose en geeft geen medisch advies — klinische vragen gaan naar de praktijk.',
      },
      {
        title: 'Een ondertekende verwerkersovereenkomst',
        body: 'Voor de livegang tekenen we een verwerkersovereenkomst met de praktijk: wat er verwerkt wordt, waarom en hoe lang. De praktijk blijft verwerkingsverantwoordelijke.',
      },
    ],
  },
  websites: {
    title: 'Websites voor kleine bedrijven',
    lead: 'Naast de assistent voor tandartsen bouwen we websites — het soort site dat een klein bedrijf echt nodig heeft, geen etalage voor onszelf.',
    items: [
      'Snel op de telefoon in de eerste plaats, want daar zitten uw klanten',
      'Een heldere opbouw: wat u doet, waar u zit, hoe men u bereikt',
      'De AI-assistent kan er later op dezelfde site bij',
      'Geen CMS om te leren: u zegt wat er verandert, wij passen het aan',
    ],
    cta: 'Vraag naar een website',
  },
  trial: {
    title: 'De gratis proefperiode van 14 dagen',
    lead: 'Twee weken op uw eigen website, kosteloos en zonder dat u vooraf iets tekent.',
    steps: [
      'Wij richten de assistent in met uw openingstijden, behandelingen en veelgestelde vragen en plaatsen hem op uw site.',
      'Hij draait 14 dagen. U ziet echte gesprekken en echte afspraken, geen demo.',
      'We nemen de resultaten samen door en u beslist of het de moeite waard is.',
      'Houdt u het, dan wordt het een maandabonnement. Zo niet, dan halen we het dezelfde dag kosteloos weg.',
    ],
    cta: 'Start de proefperiode via WhatsApp',
    note: 'Over de maandprijs praten we na de proefperiode, als we allebei weten wat uw praktijk er werkelijk mee doet.',
  },
  faq: {
    title: 'Veelgestelde vragen',
    lead: 'Staat uw vraag er niet bij? Stel hem gerust via WhatsApp.',
    items: [
      {
        q: 'Geeft de assistent medisch advies?',
        a: 'Nee. Hij beantwoordt organisatorische vragen en plant afspraken. Alles wat klinisch is gaat naar de praktijk, en de patiënt krijgt te horen dat iemand van de praktijk terugkomt op de vraag.',
      },
      {
        q: 'Wat gebeurt er bij spoed?',
        a: 'De assistent doet niet aan triage. Hij noteert naam en telefoonnummer en maakt een "terugbellen"-afspraak in uw agenda, zodat uw medewerkers snel kunnen reageren. Hetzelfde gebeurt als een patiënt een afspraak wil verzetten of annuleren.',
      },
      {
        q: 'Werkt het met onze huidige website?',
        a: 'Ja, zolang we er één regel code aan kunnen toevoegen. Dat kan bij vrijwel elke site — WordPress, Wix, Squarespace of maatwerk.',
      },
      {
        q: 'Moeten we onze agenda of software aanpassen?',
        a: 'Nee. We werken met de Google Agenda die de praktijk al gebruikt. Afspraken verschijnen als gewone items en u kunt ze verzetten of annuleren zoals altijd.',
      },
      {
        q: 'En als we willen stoppen?',
        a: 'U geeft het aan en wij halen de assistent van uw site. Tijdens de proefperiode valt er niets op te zeggen; daarna loopt het abonnement per maand.',
      },
      {
        q: 'Wie zit er achter Twinbyte?',
        a: 'Anna en Samuele. Met z’n tweeën, dus u spreekt altijd degene die uw assistent heeft ingericht — geen ticketsysteem ertussen.',
      },
    ],
  },
  contact: {
    title: 'Neem contact op',
    lead: 'Via WhatsApp bereikt u ons het snelst. Liever op papier? Dan kan het net zo goed per e-mail.',
    whatsapp: 'Stuur een WhatsApp',
    email: 'Stuur een e-mail',
    emailSubject: 'Vraag over de Twinbyte-assistent',
    note: 'U krijgt altijd antwoord van Anna of Samuele — er zit geen callcenter achter.',
  },
  footer: {
    tagline: 'AI-assistent voor tandartspraktijken en websites voor kleine bedrijven.',
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
          'E-mail: twinbyteai@gmail.com',
        ],
      },
      {
        title: 'Deze website',
        body: [
          'Deze website gebruikt geen cookies. Er wordt niets opgeslagen voor statistieken, advertenties of profilering, en daarom is er ook geen cookiebanner om weg te klikken.',
          'We gebruiken geen analytics- of trackingtools, en er worden geen lettertypen of scripts van servers van derden geladen.',
          'De site draait op Cloudflare Pages. Zoals elke webserver verwerkt de hostingpartij technische gegevens van het verzoek, zoals IP-adres en browsertype, om de pagina’s te kunnen tonen en de dienst tegen misbruik te beschermen.',
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
          'De AI-assistent die op deze pagina beschreven wordt, draait op de websites van onze klanten — de praktijken zelf. Voor die gesprekken is de praktijk verwerkingsverantwoordelijke en treedt Twinbyte op als verwerker, op basis van een ondertekende verwerkersovereenkomst.',
          'Deze verklaring gaat dus alleen over deze website. Patiënten die met een assistent op een praktijkwebsite chatten, lezen de privacyverklaring van die praktijk.',
        ],
      },
      {
        title: 'Uw rechten',
        body: [
          'U kunt ons vragen om inzage in uw gegevens, om correctie, verwijdering of beperking, om een kopie in een overdraagbaar formaat, en u kunt bezwaar maken tegen de verwerking. Stuur een bericht naar twinbyteai@gmail.com en we regelen het.',
          'Vindt u dat wij niet zorgvuldig met uw gegevens omgaan, dan kunt u een klacht indienen bij de toezichthouder in uw land. TODO_SUPERVISORY_AUTHORITY',
        ],
      },
      {
        title: 'Wijzigingen',
        body: ['Verandert deze verklaring, dan passen we de datum bovenaan de pagina aan.'],
      },
    ],
    back: 'Terug naar de homepage',
  },
  wa: {
    generic: 'Hallo Twinbyte, ik heb een vraag over jullie AI-assistent.',
    trial:
      'Hallo Twinbyte, ik wil graag de gratis proefperiode van 14 dagen starten voor de AI-assistent van mijn tandartspraktijk.',
    websites: 'Hallo Twinbyte, ik wil graag meer weten over een website voor mijn bedrijf.',
  },
}
