/*
 * Writes the Dutch and Italian showcase pages after the build.
 *
 * public/showcase/index.html is the English source and the only copy anyone
 * edits. This takes the built file, swaps every visible string for its
 * translation, points the links to the main site at the same language, and
 * writes dist/showcase/nl/index.html and dist/showcase/it/index.html.
 *
 * It cannot ship English by accident. Matching is whitespace-tolerant (a
 * paragraph wrapped over several source lines, or with a space before it,
 * still matches its one-line key), and afterwards every text node and every
 * readable attribute of the English source is looked for in the output: if
 * one is still there, untranslated, the build fails and names it.
 *
 * Italian speaks to the visitor as "tu" and Dutch as "u", as on the main site,
 * and the shared strings (navigation, footer) are the main site's own.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const SRC = 'dist/showcase/index.html'
const LANGS = ['nl', 'it']

/* Keys are the English text exactly as it reads on the page, with any inline
   <em> left in. A value equal to its key is a deliberate "same in this
   language" ('Film', 'Websites'). */
const T = {
  nl: {
    'What we can build — Twinbyte': 'Wat we kunnen bouwen — Twinbyte',
    'A scroll-driven page by Twinbyte: three sequences of still frames played on a canvas by the scrollbar, the way the big product launches do it.':
      'Een pagina van Twinbyte die meebeweegt met het scrollen: drie reeksen stilstaande beelden, op een canvas afgespeeld door de scrolbalk, zoals de grote productlanceringen het doen.',
    'Language': 'Taal',
    'Write to us': 'Neem contact op',

    'A case turns, opens, and three facts fan out of it; a card runs across them and a second card follows':
      'Een doosje draait, gaat open en drie gegevens waaieren eruit; een kaart schuift erlangs en een tweede kaart volgt',
    'Opening hours': 'Openingstijden',
    'Read off the page, not typed twice': 'Van de pagina gelezen, niet twee keer getypt',
    'What it costs': 'Wat het kost',
    'The same answer every time': 'Elke keer hetzelfde antwoord',
    'Where you are': 'Waar u zit',
    'And when you are open': 'En wanneer u open bent',
    'The booking': 'De afspraak',
    'Name, number, a slot': 'Naam, nummer, een tijdstip',
    'Two services. <em>One conversation.</em>': 'Twee diensten. <em>Eén gesprek.</em>',
    'We build the website a small business is judged on, and the assistant that answers on it when nobody is in the shop.':
      'Wij bouwen de website waarop een klein bedrijf wordt beoordeeld, en de assistent die erop antwoordt als er niemand in de zaak is.',
    'The assistant': 'De assistent',
    'It answers at 23:47.': 'Hij antwoordt om 23:47.',
    'Your hours, your prices, your services: it answers from your information only, at any hour of the day.':
      'Uw tijden, uw prijzen, uw diensten: hij antwoordt alleen vanuit uw informatie, op elk uur van de dag.',
    'Still the assistant': 'Nog steeds de assistent',
    'And it books the appointment.': 'En hij plant de afspraak in.',
    'Two slots, a name, a number. It goes in your calendar while you are on a roof, and you read it when you come down.':
      'Twee tijdstippen, een naam, een nummer. Het staat in uw agenda terwijl u op een dak staat, en u leest het als u beneden bent.',
    'The website': 'De website',
    'And this is what they see first.': 'En dit is wat ze als eerste zien.',
    'Opening hours, where you are, one tap to call — on the first screen, on an old phone, on a bad connection.':
      'Openingstijden, waar u zit, één tik om te bellen — op het eerste scherm, op een oude telefoon, op een slechte verbinding.',
    'scroll': 'scrol',

    'A mint tile opens into a small business page: a header, two lines of copy, opening hours, an address, and a call button that the tile itself becomes':
      'Een mintgroen tegeltje vouwt open tot de pagina van een klein bedrijf: een kop, twee regels tekst, openingstijden, een adres en een belknop die het tegeltje zelf wordt',
    'Your name': 'Uw naam',
    'Not a template with your logo dropped in': 'Geen sjabloon met uw logo erin geplakt',
    'Hours and address': 'Tijden en adres',
    'Above the fold, on any phone': 'Bovenaan de pagina, op elke telefoon',
    'Message Twinbyte on WhatsApp.': 'Stuur Twinbyte een WhatsApp.',
    'press it — it is a real link': 'druk erop — het is een echte link',
    'The other half': 'De andere helft',
    'A message becomes a page.': 'Een bericht wordt een pagina.',
    'The tile the assistant speaks in opens into the page your customers land on. Two services, one shape.':
      'Het tegeltje waarin de assistent spreekt, vouwt open tot de pagina waarop uw klanten landen. Twee diensten, één vorm.',
    'What goes on it': 'Wat erop komt',
    'Your name, your hours, your address.': 'Uw naam, uw tijden, uw adres.',
    'Not a slideshow, not a stock photo of someone else’s shop. The four things a customer opens your page to find, in the order they look for them.':
      'Geen diavoorstelling, geen stockfoto van andermans zaak. De vier dingen waarvoor een klant uw pagina opent, in de volgorde waarin hij ze zoekt.',
    'And the last thing': 'En als laatste',
    'One tap to call.': 'Eén tik om te bellen.',
    'The button above is not a picture of a button. The camera never moves in this sequence, so we know the exact rectangle it lands on — and a real link sits on it.':
      'De knop hierboven is geen plaatje van een knop. De camera beweegt in deze sequentie nooit, dus we weten precies op welke rechthoek hij landt — en daar zit een echte link op.',

    'A cheeseburger pulled apart into its ingredients floats on a dark ground; as the page scrolls the ingredients settle onto each other until the burger is assembled':
      'Een cheeseburger, uit elkaar gehaald in losse ingrediënten, zweeft tegen een donkere achtergrond; terwijl u scrolt, vallen de ingrediënten op elkaar tot de burger compleet is',
    'For a restaurant': 'Voor een restaurant',
    'What is in it, layer by layer.': 'Wat erin zit, laag voor laag.',
    'Every ingredient on its own, before it becomes the thing on the menu.':
      'Elk ingrediënt apart, voordat het het gerecht op de kaart wordt.',
    'Put together': 'In elkaar gezet',
    'In the order it goes together.': 'In de volgorde waarin het in elkaar gaat.',
    'Bun, lettuce, tomato, cheese, the patty, the onion rings, the sauce. The film between the two pictures was generated, then cut into 84 frames the scrollbar plays.':
      'Broodje, sla, tomaat, kaas, de burger, de uienringen, de saus. De film tussen de twee afbeeldingen is gegenereerd en daarna in 84 beelden geknipt die de scrolbalk afspeelt.',
    'Served': 'Geserveerd',
    'And this is the photo on the menu.': 'En dit is de foto op de kaart.',
    'No 3D model this time: two pictures of the product and a film generated between them. If you sell something you can photograph, we can do this for your page.':
      'Geen 3D-model deze keer: twee afbeeldingen van het product en een film die ertussen is gegenereerd. Verkoopt u iets wat zich laat fotograferen, dan kunnen wij dit voor uw pagina maken.',

    'What this page is': 'Wat deze pagina is',
    'A demonstration, with our own work <em>on the stand.</em>': 'Een demonstratie, met ons eigen werk <em>op de stand.</em>',
    'The big product launches all use the same trick: an object rendered to a sequence of still frames, played on a canvas by the scrollbar instead of by a clock. It looks like a live 3D engine. It is a flipbook — which is exactly why it stays smooth on a phone.':
      'De grote productlanceringen gebruiken allemaal dezelfde truc: een object gerenderd tot een reeks stilstaande beelden, op een canvas afgespeeld door de scrolbalk in plaats van door een klok. Het lijkt een live 3D-engine. Het is een flipboek — en precies daarom blijft het vloeiend op een telefoon.',
    'We modelled the case and the page in Blender from code, lit them in a measured studio, and wired them to the scroll. The second sequence goes one further: the camera never moves, so we know the exact rectangle the button lands on, and there is a real link sitting on it. The button you can see is the button you can press.':
      'We hebben het doosje en de pagina in Blender vanuit code gemodelleerd, ze belicht in een opgemeten studio en gekoppeld aan het scrollen. De tweede sequentie gaat een stap verder: de camera beweegt nooit, dus we weten precies op welke rechthoek de knop landt, en daar zit een echte link op. De knop die u ziet, is de knop die u kunt indrukken.',
    'The third one needs no 3D model: two pictures of a burger — one pulled apart, one finished — and a film generated between them, cut into frames and played by the scrollbar like the other two.':
      'De derde heeft geen 3D-model nodig: twee afbeeldingen van een burger — één uit elkaar gehaald, één af — en een film die ertussen is gegenereerd, in beelden geknipt en door de scrolbalk afgespeeld, net als de andere twee.',

    'What we build': 'Wat we bouwen',
    'The two halves of <em>the same job.</em>': 'De twee helften van <em>dezelfde klus.</em>',
    'Answers when you cannot': 'Antwoordt als u het niet kunt',
    'It sits on the website you already have and handles the questions and bookings you would otherwise take by phone.':
      'Hij zit op de website die u al heeft en handelt de vragen en afspraken af die u anders telefonisch zou aannemen.',
    'Answers from your information only': 'Antwoordt alleen vanuit uw informatie',
    'Books into the calendar you already use': 'Plant in de agenda die u al gebruikt',
    'Stops and hands over anything it is unsure about': 'Stopt en geeft door wat hij niet zeker weet',
    'Your language — with Pro, every language your customers write in': 'Uw taal — met Pro elke taal waarin uw klanten schrijven',
    'See how it works': 'Bekijk hoe het werkt',
    'The page they judge you on': 'De pagina waarop ze u beoordelen',
    'For businesses whose customers check them on a phone before deciding to call.':
      'Voor bedrijven waarvan de klanten ze op een telefoon bekijken voordat ze besluiten te bellen.',
    'Hours and address on the first screen': 'Tijden en adres op het eerste scherm',
    'One tap to call or to book': 'Eén tik om te bellen of te boeken',
    'No cookie wall, no tracking scripts': 'Geen cookiemuur, geen trackingscripts',
    'Fast on an old phone and a bad connection': 'Snel op een oude telefoon en een slechte verbinding',
    'See what we build': 'Bekijk wat we bouwen',
    'Full site + Assistant:': 'Volledige site + Assistent:',
    'thirty per cent off the setup, and the site’s monthly fee is on us for as long as you keep the assistant.':
      'dertig procent van de eenmalige kosten eraf, en het maandbedrag van de site is van ons zolang u de assistent houdt.',
    'See the prices': 'Bekijk de tarieven',

    'How this page was made': 'Hoe deze pagina is gemaakt',
    'No 3D engine runs <em>in your browser.</em>': 'Er draait geen 3D-engine <em>in uw browser.</em>',
    'The whole thing is one HTML file, a canvas per sequence and a folder of images. No framework, no scroll library, nothing to keep updated. That is the point: it has to keep working for years without anyone touching it.':
      'Het geheel is één HTML-bestand, een canvas per sequentie en een map met afbeeldingen. Geen framework, geen scrolbibliotheek, niets om bij te houden. Daar gaat het om: het moet jarenlang blijven werken zonder dat iemand eraan hoeft te komen.',
    'Objects': 'Objecten',
    'Two modelled in Blender from code, lit in a measured studio': 'Twee gemodelleerd in Blender vanuit code, belicht in een opgemeten studio',
    'Film': 'Film',
    'One generated between two pictures, cut into frames': 'Eén gegenereerd tussen twee afbeeldingen, in beelden geknipt',
    'Frames': 'Beelden',
    '318, in three sequences': '318, in drie sequenties',
    'Delivery': 'Levering',
    'WebP with transparency: every frame on a wide screen, every second one on a phone': 'WebP met transparantie: elk beeld op een breed scherm, om het andere op een telefoon',
    'Playback': 'Afspelen',
    'One canvas per sequence, one drawImage per scroll frame': 'Eén canvas per sequentie, één drawImage per scrolbeeld',
    'Loading': 'Laden',
    'The first frame of each sequence at once, the rest as you get close': 'Het eerste beeld van elke sequentie meteen, de rest pas als u in de buurt komt',
    'Libraries': 'Bibliotheken',
    'None': 'Geen',
    'Weight': 'Gewicht',
    '2.5 MB on a phone, 6.6 MB on a wide screen, frames and fonts included. The first screen needs about 230 kB of it.':
      '2,5 MB op een telefoon, 6,6 MB op een breed scherm, beelden en lettertypen inbegrepen. Het eerste scherm heeft daar ongeveer 230 kB van nodig.',

    'Talk to us': 'Neem contact op',
    'Tell us what you sell. <em>We will tell you what it takes.</em>': 'Vertel ons wat u verkoopt. <em>Wij vertellen u wat ervoor nodig is.</em>',
    'A page like this is worth it when you have something to show. If what you need is to be found and phoned, we will say so and build you the small, fast one instead.':
      'Een pagina als deze is het waard als u iets te laten zien heeft. Moet u vooral gevonden en gebeld worden, dan zeggen we dat en bouwen we de kleine, snelle versie.',
    'Message us on WhatsApp': 'Stuur ons een WhatsApp',
    'See what we normally build': 'Bekijk wat we normaal bouwen',

    'Fast websites, a digital assistant and online ads for local businesses.':
      'Snelle websites, een digitale assistent en online advertenties voor lokale bedrijven.',
    'Pages': 'Pagina’s',
    'Digital assistant': 'Digitale assistent',
    'Websites': 'Websites',
    'Online ads': 'Online advertenties',
    'Prices': 'Tarieven',
    'Contact': 'Contact',
    'Privacy statement': 'Privacyverklaring',
    'Set in Bricolage Grotesque, Inter and Instrument Serif. Built in the Netherlands. This site sets no cookies, runs no analytics and loads no tracking pixels.':
      'Gezet in Bricolage Grotesque, Inter en Instrument Serif. Gemaakt in Nederland. Deze site plaatst geen cookies, gebruikt geen analytics en laadt geen trackingpixels.',
    'Twinbyte. All rights reserved.': 'Twinbyte. Alle rechten voorbehouden.',
  },
  it: {
    'What we can build — Twinbyte': 'Cosa possiamo costruire — Twinbyte',
    'A scroll-driven page by Twinbyte: three sequences of still frames played on a canvas by the scrollbar, the way the big product launches do it.':
      'Una pagina di Twinbyte che si muove con lo scroll: tre sequenze di fotogrammi fissi riprodotte su un canvas dallo scorrimento, come fanno i grandi lanci di prodotto.',
    'Language': 'Lingua',
    'Write to us': 'Scrivici',

    'A case turns, opens, and three facts fan out of it; a card runs across them and a second card follows':
      'Una custodia ruota, si apre e ne escono a ventaglio tre informazioni; una scheda ci scorre sopra e ne segue una seconda',
    'Opening hours': 'Orari di apertura',
    'Read off the page, not typed twice': 'Letti dalla pagina, non scritti due volte',
    'What it costs': 'Quanto costa',
    'The same answer every time': 'La stessa risposta ogni volta',
    'Where you are': 'Dove sei',
    'And when you are open': 'E quando sei aperto',
    'The booking': 'La prenotazione',
    'Name, number, a slot': 'Nome, numero, un orario',
    'Two services. <em>One conversation.</em>': 'Due servizi. <em>Una conversazione.</em>',
    'We build the website a small business is judged on, and the assistant that answers on it when nobody is in the shop.':
      'Costruiamo il sito su cui una piccola attività viene giudicata, e l’assistente che ci risponde sopra quando in negozio non c’è nessuno.',
    'The assistant': 'L’assistente',
    'It answers at 23:47.': 'Risponde alle 23:47.',
    'Your hours, your prices, your services: it answers from your information only, at any hour of the day.':
      'I tuoi orari, i tuoi prezzi, i tuoi servizi: risponde solo con le tue informazioni, a qualsiasi ora del giorno.',
    'Still the assistant': 'Sempre l’assistente',
    'And it books the appointment.': 'E fissa l’appuntamento.',
    'Two slots, a name, a number. It goes in your calendar while you are on a roof, and you read it when you come down.':
      'Due orari, un nome, un numero. Finisce nella tua agenda mentre sei su un tetto, e lo leggi quando scendi.',
    'The website': 'Il sito',
    'And this is what they see first.': 'E questo è ciò che vedono per primo.',
    'Opening hours, where you are, one tap to call — on the first screen, on an old phone, on a bad connection.':
      'Orari, dove sei, un tocco per chiamare — nella prima schermata, su un telefono vecchio, con poca linea.',
    'scroll': 'scorri',

    'A mint tile opens into a small business page: a header, two lines of copy, opening hours, an address, and a call button that the tile itself becomes':
      'Una tessera color menta si apre e diventa la pagina di una piccola attività: un’intestazione, due righe di testo, gli orari, un indirizzo e il pulsante di chiamata in cui si trasforma la tessera stessa',
    'Your name': 'Il tuo nome',
    'Not a template with your logo dropped in': 'Non un template con il tuo logo incollato sopra',
    'Hours and address': 'Orari e indirizzo',
    'Above the fold, on any phone': 'Nella prima schermata, su qualsiasi telefono',
    'Message Twinbyte on WhatsApp.': 'Scrivi a Twinbyte su WhatsApp.',
    'press it — it is a real link': 'premilo — è un link vero',
    'The other half': 'L’altra metà',
    'A message becomes a page.': 'Un messaggio diventa una pagina.',
    'The tile the assistant speaks in opens into the page your customers land on. Two services, one shape.':
      'La tessera in cui parla l’assistente si apre nella pagina su cui arrivano i tuoi clienti. Due servizi, una forma sola.',
    'What goes on it': 'Cosa ci va sopra',
    'Your name, your hours, your address.': 'Il tuo nome, i tuoi orari, il tuo indirizzo.',
    'Not a slideshow, not a stock photo of someone else’s shop. The four things a customer opens your page to find, in the order they look for them.':
      'Niente slideshow, niente foto stock del negozio di qualcun altro. Le quattro cose per cui un cliente apre la tua pagina, nell’ordine in cui le cerca.',
    'And the last thing': 'E l’ultima cosa',
    'One tap to call.': 'Un tocco per chiamare.',
    'The button above is not a picture of a button. The camera never moves in this sequence, so we know the exact rectangle it lands on — and a real link sits on it.':
      'Il pulsante qui sopra non è l’immagine di un pulsante. In questa sequenza la camera non si muove mai, quindi sappiamo esattamente in quale rettangolo atterra — e lì sopra c’è un link vero.',

    'A cheeseburger pulled apart into its ingredients floats on a dark ground; as the page scrolls the ingredients settle onto each other until the burger is assembled':
      'Un cheeseburger scomposto nei suoi ingredienti fluttua su un fondo scuro; scorrendo la pagina gli ingredienti si posano uno sull’altro finché l’hamburger è completo',
    'For a restaurant': 'Per un ristorante',
    'What is in it, layer by layer.': 'Cosa c’è dentro, strato per strato.',
    'Every ingredient on its own, before it becomes the thing on the menu.':
      'Ogni ingrediente da solo, prima di diventare il piatto del menu.',
    'Put together': 'Montato',
    'In the order it goes together.': 'Nell’ordine in cui si monta.',
    'Bun, lettuce, tomato, cheese, the patty, the onion rings, the sauce. The film between the two pictures was generated, then cut into 84 frames the scrollbar plays.':
      'Pane, lattuga, pomodoro, formaggio, la carne, gli anelli di cipolla, la salsa. Il video tra le due immagini è stato generato, poi tagliato in 84 fotogrammi che lo scorrimento riproduce.',
    'Served': 'Servito',
    'And this is the photo on the menu.': 'E questa è la foto sul menu.',
    'No 3D model this time: two pictures of the product and a film generated between them. If you sell something you can photograph, we can do this for your page.':
      'Stavolta nessun modello 3D: due immagini del prodotto e un video generato tra le due. Se vendi qualcosa che si può fotografare, possiamo farlo per la tua pagina.',

    'What this page is': 'Cos’è questa pagina',
    'A demonstration, with our own work <em>on the stand.</em>': 'Una dimostrazione, con il nostro lavoro <em>in vetrina.</em>',
    'The big product launches all use the same trick: an object rendered to a sequence of still frames, played on a canvas by the scrollbar instead of by a clock. It looks like a live 3D engine. It is a flipbook — which is exactly why it stays smooth on a phone.':
      'I grandi lanci di prodotto usano tutti lo stesso trucco: un oggetto renderizzato in una sequenza di fotogrammi fissi, riprodotti su un canvas dallo scorrimento della pagina invece che da un orologio. Sembra un motore 3D in tempo reale. È un flipbook — ed è proprio per questo che resta fluido anche sul telefono.',
    'We modelled the case and the page in Blender from code, lit them in a measured studio, and wired them to the scroll. The second sequence goes one further: the camera never moves, so we know the exact rectangle the button lands on, and there is a real link sitting on it. The button you can see is the button you can press.':
      'Abbiamo modellato la custodia e la pagina in Blender partendo dal codice, le abbiamo illuminate in uno studio misurato e collegate allo scorrimento. La seconda sequenza fa un passo in più: la camera non si muove mai, quindi sappiamo esattamente in quale rettangolo atterra il pulsante, e lì sopra c’è un link vero. Il pulsante che vedi è il pulsante che puoi premere.',
    'The third one needs no 3D model: two pictures of a burger — one pulled apart, one finished — and a film generated between them, cut into frames and played by the scrollbar like the other two.':
      'La terza non ha bisogno di un modello 3D: due immagini di un hamburger — una con gli ingredienti separati, una a piatto finito — e un video generato tra le due, tagliato in fotogrammi e riprodotto dallo scorrimento come le altre due.',

    'What we build': 'Cosa costruiamo',
    'The two halves of <em>the same job.</em>': 'Le due metà <em>dello stesso lavoro.</em>',
    'Answers when you cannot': 'Risponde quando tu non puoi',
    'It sits on the website you already have and handles the questions and bookings you would otherwise take by phone.':
      'Sta sul sito che hai già e gestisce le domande e le prenotazioni che altrimenti prenderesti al telefono.',
    'Answers from your information only': 'Risponde solo con le tue informazioni',
    'Books into the calendar you already use': 'Fissa gli appuntamenti nell’agenda che usi già',
    'Stops and hands over anything it is unsure about': 'Si ferma e passa a te tutto ciò di cui non è sicuro',
    'Your language — with Pro, every language your customers write in': 'La tua lingua — con Pro, tutte le lingue in cui ti scrivono',
    'See how it works': 'Guarda come funziona',
    'The page they judge you on': 'La pagina su cui ti giudicano',
    'For businesses whose customers check them on a phone before deciding to call.':
      'Per le attività che i clienti guardano sul telefono prima di decidere se chiamare.',
    'Hours and address on the first screen': 'Orari e indirizzo nella prima schermata',
    'One tap to call or to book': 'Un tocco per chiamare o prenotare',
    'No cookie wall, no tracking scripts': 'Niente banner dei cookie, niente script di tracciamento',
    'Fast on an old phone and a bad connection': 'Veloce su un telefono vecchio e con poca linea',
    'See what we build': 'Guarda cosa realizziamo',
    'Full site + Assistant:': 'Sito completo + Assistente:',
    'thirty per cent off the setup, and the site’s monthly fee is on us for as long as you keep the assistant.':
      'trenta per cento in meno sull’attivazione, e il canone del sito lo offriamo noi finché tieni l’assistente.',
    'See the prices': 'Vedi i prezzi',

    'How this page was made': 'Come è fatta questa pagina',
    'No 3D engine runs <em>in your browser.</em>': 'Nessun motore 3D gira <em>nel tuo browser.</em>',
    'The whole thing is one HTML file, a canvas per sequence and a folder of images. No framework, no scroll library, nothing to keep updated. That is the point: it has to keep working for years without anyone touching it.':
      'Tutto è un solo file HTML, un canvas per sequenza e una cartella di immagini. Nessun framework, nessuna libreria per lo scorrimento, niente da tenere aggiornato. È proprio questo il punto: deve funzionare per anni senza che nessuno ci metta mano.',
    'Objects': 'Oggetti',
    'Two modelled in Blender from code, lit in a measured studio': 'Due modellati in Blender partendo dal codice, illuminati in uno studio misurato',
    'Film': 'Video',
    'One generated between two pictures, cut into frames': 'Uno generato tra due immagini, tagliato in fotogrammi',
    'Frames': 'Fotogrammi',
    '318, in three sequences': '318, in tre sequenze',
    'Delivery': 'Formato',
    'WebP with transparency: every frame on a wide screen, every second one on a phone': 'WebP con trasparenza: tutti i fotogrammi su uno schermo largo, uno ogni due sul telefono',
    'Playback': 'Riproduzione',
    'One canvas per sequence, one drawImage per scroll frame': 'Un canvas per sequenza, un drawImage per ogni fotogramma di scorrimento',
    'Loading': 'Caricamento',
    'The first frame of each sequence at once, the rest as you get close': 'Il primo fotogramma di ogni sequenza subito, il resto solo quando ti avvicini',
    'Libraries': 'Librerie',
    'None': 'Nessuna',
    'Weight': 'Peso',
    '2.5 MB on a phone, 6.6 MB on a wide screen, frames and fonts included. The first screen needs about 230 kB of it.':
      '2,5 MB sul telefono, 6,6 MB su uno schermo largo, fotogrammi e font compresi. Alla prima schermata ne servono circa 230 kB.',

    'Talk to us': 'Parliamone',
    'Tell us what you sell. <em>We will tell you what it takes.</em>': 'Dicci cosa vendi. <em>Ti diciamo cosa serve.</em>',
    'A page like this is worth it when you have something to show. If what you need is to be found and phoned, we will say so and build you the small, fast one instead.':
      'Una pagina così vale la pena quando hai qualcosa da mostrare. Se ti serve soprattutto essere trovato e chiamato, te lo diciamo e ti costruiamo quella piccola e veloce.',
    'Message us on WhatsApp': 'Scrivici su WhatsApp',
    'See what we normally build': 'Guarda cosa costruiamo di solito',

    'Fast websites, a digital assistant and online ads for local businesses.':
      'Siti web veloci, assistente digitale e pubblicità online per attività locali.',
    'Pages': 'Pagine',
    'Digital assistant': 'Assistente digitale',
    'Websites': 'Siti web',
    'Online ads': 'Pubblicità online',
    'Prices': 'Prezzi',
    'Contact': 'Contatti',
    'Privacy statement': 'Informativa privacy',
    'Set in Bricolage Grotesque, Inter and Instrument Serif. Built in the Netherlands. This site sets no cookies, runs no analytics and loads no tracking pixels.':
      'Composto in Bricolage Grotesque, Inter e Instrument Serif. Fatto nei Paesi Bassi. Questo sito non usa cookie, non fa analytics e non carica pixel di tracciamento.',
    'Twinbyte. All rights reserved.': 'Twinbyte. Tutti i diritti riservati.',
  },
}

/* The WhatsApp messages are inside an href, URL-encoded, so they are not text
   the dictionary sees. The first is the booking page's own. */
const WA = {
  en: ['Hi Twinbyte, I would like to talk about my business.', 'Hi Twinbyte, I pressed the button on your showcase page.'],
  nl: ['Hallo Twinbyte, ik wil graag over mijn bedrijf praten.', 'Hallo Twinbyte, ik heb op de knop op de showcasepagina gedrukt.'],
  it: ['Ciao Twinbyte, vorrei parlare della mia attività.', 'Ciao Twinbyte, ho premuto il pulsante nella pagina showcase.'],
}

/* The same in every language: names, addresses, the language switch itself. */
const NEUTRAL = new Set([
  'Twinbyte', 'EN', 'NL', 'IT', '(English)', '(Nederlands)', '(Italiano)',
  'info@twinbyteservices.com', 'WhatsApp +31 6 45745163', 'noindex',
])

const SITE = 'https://twinbyteservices.com'
const norm = (s) => s.replace(/\s+/g, ' ').trim()
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/* a key, with every run of spaces in it allowed to be any run of whitespace */
const loose = (key) => escapeRe(key).replace(/ +/g, '\\s+')
const enc = (s) => encodeURIComponent(s)

/* What a reader can see or hear: every text node outside <script> and
   <style>, and the attributes that are read out or shown. */
function units(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  const out = []
  for (const m of body.matchAll(/>([^<]+)</g)) out.push(norm(m[1]))
  for (const m of body.matchAll(/\s(?:aria-label|alt|title|placeholder)="([^"]*)"/g)) out.push(norm(m[1]))
  for (const m of body.matchAll(/<meta (?:name="description"|property="og:(?:title|description)") content="([^"]*)"/g)) out.push(norm(m[1]))
  return out.filter((u) => u && /\p{L}/u.test(u) && !NEUTRAL.has(u))
}

let html = await readFile(SRC, 'utf8')
/* entities in the source become characters, so one dictionary matches both */
html = html.replaceAll('&mdash;', '—').replaceAll('&middot;', '·').replaceAll('&rsquo;', '’')

const errors = []
const keys = [...new Set(LANGS.flatMap((l) => Object.keys(T[l])))].sort((a, b) => b.length - a.length)
for (const lang of LANGS) {
  for (const key of keys) if (T[lang][key] === undefined) errors.push(`no ${lang} for "${key.slice(0, 60)}"`)
}
for (const key of keys) {
  if (!new RegExp(`>\\s*${loose(key)}\\s*<|="\\s*${loose(key)}\\s*"`).test(html))
    console.warn(`showcase-i18n: not on the page any more: "${key.slice(0, 60)}"`)
}
const english = units(html)

/* The script at the end has `>` and `<` as operators: translate the markup
   before it, never the code. */
const cut = html.lastIndexOf('<script>')
const markup = html.slice(0, cut)
const code = html.slice(cut)

for (const lang of LANGS) {
  let out = markup
  for (const key of keys) {
    const value = T[lang][key]
    if (value === undefined) continue
    /* Only whole text nodes and whole attribute values. A function as the
       replacement, so a "$" in a translation is never read as a pattern. */
    out = out.replace(new RegExp(`>\\s*${loose(key)}\\s*<`, 'g'), () => `>${value}<`)
    out = out.replace(new RegExp(`="\\s*${loose(key)}\\s*"`, 'g'), () => `="${value}"`)
  }
  WA.en.forEach((text, i) => {
    out = out.replaceAll(`text=${enc(text)}`, `text=${enc(WA[lang][i])}`)
  })
  const home = `/${lang}`
  out = (out + code)
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(`<link rel="canonical" href="${SITE}/showcase/">`, `<link rel="canonical" href="${SITE}/showcase/${lang}/">`)
    .replace(`<meta property="og:url" content="${SITE}/showcase/">`, `<meta property="og:url" content="${SITE}/showcase/${lang}/">`)
    .replace('<meta property="og:locale" content="en">', `<meta property="og:locale" content="${lang}">`)
    /* the language switches (header and footer): this page is the current one */
    .replaceAll('hreflang="en" lang="en" aria-current="true">', 'hreflang="en" lang="en">')
    .replaceAll(`hreflang="${lang}" lang="${lang}">`, `hreflang="${lang}" lang="${lang}" aria-current="true">`)
    /* every link to the main site goes to the same language */
    .replaceAll('href="/"', `href="${home}"`)
    .replaceAll('href="/#', `href="${home}#`)
    .replace(/href="\/(assistant|websites|prices|privacy)"/g, (m, page) => `href="${home}/${page}"`)

  /* The guard. Everything English a reader could meet on the source page must
     be gone from this one, unless the dictionary says it is the same word. */
  const left = new Set(units(out))
  for (const u of english) {
    if (left.has(u) && T[lang][u] !== u) errors.push(`${lang} still English: "${u.slice(0, 70)}"`)
  }
  for (const text of WA.en) if (out.includes(enc(text))) errors.push(`${lang} still English in a WhatsApp link: "${text}"`)
  if (/href="\/(#|assistant|websites|prices|privacy|")/.test(out)) errors.push(`${lang} still links to the English site`)
  if (!out.includes(`<link rel="canonical" href="${SITE}/showcase/${lang}/">`) || !out.includes(`content="${SITE}/showcase/${lang}/"`) || !out.includes(`og:locale" content="${lang}"`))
    errors.push(`${lang} canonical, og:url or og:locale still points at the English page`)
  const current = [...out.matchAll(/hreflang="(\w+)" lang="\w+" aria-current="true">/g)].map((m) => m[1])
  if (current.length !== 2 || current.some((l) => l !== lang)) errors.push(`${lang} language switch marks ${current.join(',') || 'nothing'} as current`)

  await mkdir(`dist/showcase/${lang}`, { recursive: true })
  await writeFile(`dist/showcase/${lang}/index.html`, out)
  console.log(`showcase: /showcase/${lang}/`)
}

if (errors.length) {
  for (const e of [...new Set(errors)]) console.error(`showcase-i18n: ${e}`)
  process.exit(1)
}
