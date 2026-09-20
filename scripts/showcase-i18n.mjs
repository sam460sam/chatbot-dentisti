/*
 * Writes the Dutch and Italian showcase pages after the build.
 *
 * public/showcase/index.html is the English source and the only copy anyone
 * edits. This takes the built file, swaps every visible string for its
 * translation, points the relative asset paths one level up, and writes
 * dist/showcase/nl/index.html and dist/showcase/it/index.html. A string in
 * the source that has no translation is reported, so a new sentence in the
 * English page cannot ship untranslated by accident.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const SRC = 'dist/showcase/index.html'

const T = {
  nl: {
    'Twinbyte — two sequences': 'Twinbyte — drie sequenties',
    'back to the site': 'terug naar de site',
    'Opening hours': 'Openingstijden',
    'Read off the page, not typed twice': 'Van de pagina gelezen, niet twee keer getypt',
    'What it costs': 'Wat het kost',
    'The same answer every time': 'Elke keer hetzelfde antwoord',
    'Where you are': 'Waar u zit',
    'And when you are open': 'En wanneer u open bent',
    'The booking': 'De afspraak',
    'Name, number, a slot': 'Naam, nummer, een tijdstip',
    'Two inks. One conversation.': 'Twee inkten. Eén gesprek.',
    'We build the website a small business is judged on, and the assistant that answers on it when nobody is in the shop.':
      'Wij bouwen de website waarop een klein bedrijf wordt beoordeeld, en de assistent die erop antwoordt als er niemand in de zaak is.',
    'The teal one': 'De blauwgroene',
    'It answers at 23:47.': 'Hij antwoordt om 23:47.',
    'Your hours, your prices, your services. It offers two slots, takes a name and a number, and puts the appointment in your calendar.':
      'Uw tijden, uw prijzen, uw diensten. Hij biedt twee tijdstippen aan, vraagt een naam en een nummer en zet de afspraak in uw agenda.',
    'Still the teal one': 'Nog steeds de blauwgroene',
    'And it books the appointment.': 'En hij plant de afspraak in.',
    'Two slots, a name, a number. It goes in your calendar while you are on a roof, and you read it when you come down.':
      'Twee tijdstippen, een naam, een nummer. Het staat in uw agenda terwijl u op een dak staat, en u leest het als u beneden bent.',
    'The terracotta one': 'De terracotta',
    'And this is what they see first.': 'En dit is wat ze als eerste zien.',
    'Opening hours, where you are, one tap to call — on the first screen, on an old phone, on a bad connection. Built with the assistant, the pair costs about a third less.':
      'Openingstijden, waar u zit, één tik om te bellen — op het eerste scherm, op een oude telefoon, op een slechte verbinding. Samen met de assistent gebouwd kost het paar ongeveer een derde minder.',
    'scroll': 'scrol',
    'Your name': 'Uw naam',
    'Not a template with your logo dropped in': 'Geen sjabloon met uw logo erin geplakt',
    'Hours and address': 'Tijden en adres',
    'Above the fold, on any phone': 'Boven de vouw, op elke telefoon',
    'press it — it is a real link': 'druk erop — het is een echte link',
    'The other ink': 'De andere inkt',
    'One bubble. One page.': 'Eén ballon. Eén pagina.',
    'The same shape the assistant speaks in is the shape the page is built from. Two services, one object.':
      'De vorm waarin de assistent spreekt is de vorm waaruit de pagina is opgebouwd. Twee diensten, één object.',
    'What goes on it': 'Wat erop komt',
    'Your name, your hours, your address.': 'Uw naam, uw tijden, uw adres.',
    "Not a slideshow, not a stock photo of someone else's shop. The four things a customer opens your page to find, in the order they look for them.":
      'Geen diavoorstelling, geen stockfoto van andermans zaak. De vier dingen waarvoor een klant uw pagina opent, in de volgorde waarin hij ze zoekt.',
    'And the last thing': 'En het laatste',
    'One tap to call.': 'Eén tik om te bellen.',
    'The button below is not a picture of a button. The camera never moves in this sequence, so we know the exact rectangle it lands on — and a real link sits on it.':
      'De knop hieronder is geen plaatje van een knop. De camera beweegt in deze sequentie nooit, dus we weten precies in welke rechthoek hij landt — en daar zit een echte link op.',
    'For a restaurant': 'Voor een restaurant',
    'What is in it, layer by layer.': 'Wat erin zit, laag voor laag.',
    'Every ingredient on its own, before it becomes the thing on the menu. Two photographs: this one, and the finished burger.':
      'Elk ingrediënt apart, voordat het het gerecht op de kaart wordt. Twee foto’s: deze, en de afgewerkte burger.',
    'Put together': 'In elkaar gezet',
    'In the order it goes together.': 'In de volgorde waarin het in elkaar gaat.',
    'Bun, lettuce, tomato, cheese, the patty, the onion rings, the sauce. The film between the two photographs was generated, then cut into 84 frames the scrollbar plays.':
      'Broodje, sla, tomaat, kaas, de burger, de uienringen, de saus. De film tussen de twee foto’s is gegenereerd en daarna in 84 beelden geknipt die de scrolbalk afspeelt.',
    'Served': 'Geserveerd',
    'And this is the photo on the menu.': 'En dit is de foto op de kaart.',
    'No 3D model this time: two photographs of the product and a generated film between them. If you sell something you can photograph, we can do this for your page.':
      'Geen 3D-model deze keer: twee foto’s van het product en een gegenereerde film ertussen. Verkoopt u iets wat u kunt fotograferen, dan kunnen wij dit voor uw pagina maken.',
    'What this page is': 'Wat deze pagina is',
    'A demonstration, and it is our own product on the stand.': 'Een demonstratie, met ons eigen product op de stand.',
    'The big product launches all use the same trick: a 3D object rendered to a sequence of still frames, played on a canvas by the scrollbar instead of by a clock. It looks like a live 3D engine. It is a flipbook — which is exactly why it stays smooth on a phone.':
      'De grote productlanceringen gebruiken allemaal dezelfde truc: een 3D-object gerenderd tot een reeks stilstaande beelden, op een canvas afgespeeld door de scrolbalk in plaats van door een klok. Het lijkt een live 3D-engine. Het is een flipboek — en precies daarom blijft het vloeiend op een telefoon.',
    'We built both objects in Blender from code, lit them in a measured studio, and wired them to the scroll. The second sequence goes one further: the camera never moves, so we know the exact rectangle the call button lands on, and there is a real link sitting on it. The button you can see is the button you can press.':
      'We bouwden beide objecten in Blender vanuit code, belichtten ze in een opgemeten studio en koppelden ze aan de scrol. De tweede sequentie gaat een stap verder: de camera beweegt nooit, dus we weten precies in welke rechthoek de belknop landt, en daar zit een echte link op. De knop die u ziet is de knop die u kunt indrukken.',
    'The third one needs no 3D model: two photographs of a burger — one pulled apart, one finished — and a film generated between them, cut into frames and played by the scrollbar like the other two. If you sell something you can photograph, we can do this for your page.':
      'De derde heeft geen 3D-model nodig: twee foto’s van een burger — één uit elkaar gehaald, één afgewerkt — en een film die ertussen is gegenereerd, in beelden geknipt en door de scrolbalk afgespeeld zoals de andere twee. Verkoopt u iets wat u kunt fotograferen, dan kunnen wij dit voor uw pagina maken.',
    'What we build': 'Wat we bouwen',
    'The two halves of the same job.': 'De twee helften van dezelfde klus.',
    'The assistant': 'De assistent',
    'Answers when you cannot': 'Antwoordt als u het niet kunt',
    'It sits on the website you already have and handles the questions and bookings you would otherwise take by phone.':
      'Hij zit op de website die u al hebt en handelt de vragen en afspraken af die u anders per telefoon zou aannemen.',
    'Answers from your information only': 'Antwoordt alleen vanuit uw informatie',
    'Books into the calendar you already use': 'Plant in de agenda die u al gebruikt',
    'Stops and hands over anything it is unsure about': 'Stopt en geeft door wat hij niet zeker weet',
    'English, Dutch and Italian': 'Engels, Nederlands en Italiaans',
    'The website': 'De website',
    'The page they judge you on': 'De pagina waarop ze u beoordelen',
    'For businesses whose customers check them on a phone before deciding to call.':
      'Voor bedrijven waarvan de klanten ze op een telefoon bekijken voordat ze besluiten te bellen.',
    'Hours and address on the first screen': 'Tijden en adres op het eerste scherm',
    'One tap to call or to book': 'Eén tik om te bellen of te boeken',
    'No cookie wall, no tracking scripts': 'Geen cookiemuur, geen trackingscripts',
    'Fast on an old phone and a bad connection': 'Snel op een oude telefoon en een slechte verbinding',
    'How this page was made': 'Hoe deze pagina is gemaakt',
    'No 3D engine runs in your browser.': 'Er draait geen 3D-engine in uw browser.',
    'Object': 'Object',
    'Modelled in Blender from code, lit with a measured studio': 'Gemodelleerd in Blender vanuit code, belicht met een opgemeten studio',
    'Render': 'Render',
    'Cycles on CPU, 234 frames across two sequences': 'Cycles op CPU, 234 beelden in twee sequenties',
    'Delivery': 'Levering',
    'WebP with transparency, two sizes': 'WebP met transparantie, twee formaten',
    'Playback': 'Afspelen',
    'One canvas, one drawImage per scroll frame': 'Eén canvas, één drawImage per scrolbeeld',
    'Libraries': 'Bibliotheken',
    'None': 'Geen',
    'Sequence weight': 'Gewicht per sequentie',
    'Under 5 MB at 960px · under 1.5 MB at 560px': 'Onder 5 MB op 960px · onder 1,5 MB op 560px',
    'The whole thing is one HTML file, one canvas and a folder of images. No framework, no scroll library, nothing to keep updated. That is the point: it has to still work in two years, when nobody is maintaining it.':
      'Het geheel is één HTML-bestand, één canvas en een map met afbeeldingen. Geen framework, geen scrolbibliotheek, niets om bij te houden. Dat is het punt: het moet over twee jaar nog werken, als niemand het onderhoudt.',
    'Talk to us': 'Praat met ons',
    'Tell us what you sell. We will tell you what it takes.': 'Vertel ons wat u verkoopt. Wij vertellen u wat ervoor nodig is.',
    'A page like this is worth it when you have something to show. If what you need is to be found and phoned, we will say so and build you the small fast one instead.':
      'Een pagina als deze is het waard als u iets te laten zien hebt. Als u vooral gevonden en gebeld moet worden, zeggen we dat, en bouwen we de kleine snelle versie.',
    'See what we normally build →': 'Bekijk wat we normaal bouwen →',
    'Twinbyte — websites and assistants for small businesses in the Netherlands, the UK and Italy.':
      'Twinbyte — websites en assistenten voor kleine bedrijven in Nederland, het VK en Italië.',
  },
  it: {
    'Twinbyte — two sequences': 'Twinbyte — tre sequenze',
    'back to the site': 'torna al sito',
    'Opening hours': 'Orari di apertura',
    'Read off the page, not typed twice': 'Letti dalla pagina, non scritti due volte',
    'What it costs': 'Quanto costa',
    'The same answer every time': 'La stessa risposta ogni volta',
    'Where you are': 'Dove siete',
    'And when you are open': 'E quando siete aperti',
    'The booking': 'La prenotazione',
    'Name, number, a slot': 'Nome, numero, un orario',
    'Two inks. One conversation.': 'Due inchiostri. Una conversazione.',
    'We build the website a small business is judged on, and the assistant that answers on it when nobody is in the shop.':
      'Costruiamo il sito su cui una piccola attività viene giudicata, e l’assistente che ci risponde sopra quando in negozio non c’è nessuno.',
    'The teal one': 'Quello verde-blu',
    'It answers at 23:47.': 'Risponde alle 23:47.',
    'Your hours, your prices, your services. It offers two slots, takes a name and a number, and puts the appointment in your calendar.':
      'I vostri orari, i vostri prezzi, i vostri servizi. Propone due orari, prende nome e numero e mette l’appuntamento nella vostra agenda.',
    'Still the teal one': 'Sempre quello verde-blu',
    'And it books the appointment.': 'E fissa l’appuntamento.',
    'Two slots, a name, a number. It goes in your calendar while you are on a roof, and you read it when you come down.':
      'Due orari, un nome, un numero. Finisce in agenda mentre siete su un tetto, e lo leggete quando scendete.',
    'The terracotta one': 'Quello terracotta',
    'And this is what they see first.': 'E questo è ciò che vedono per primo.',
    'Opening hours, where you are, one tap to call — on the first screen, on an old phone, on a bad connection. Built with the assistant, the pair costs about a third less.':
      'Orari, dove siete, un tocco per chiamare — nella prima schermata, su un telefono vecchio, con una connessione scarsa. Costruiti insieme all’assistente, i due costano circa un terzo in meno.',
    'scroll': 'scorri',
    'Your name': 'Il vostro nome',
    'Not a template with your logo dropped in': 'Non un template con il vostro logo incollato sopra',
    'Hours and address': 'Orari e indirizzo',
    'Above the fold, on any phone': 'Nella prima schermata, su qualsiasi telefono',
    'press it — it is a real link': 'premetelo — è un link vero',
    'The other ink': 'L’altro inchiostro',
    'One bubble. One page.': 'Un fumetto. Una pagina.',
    'The same shape the assistant speaks in is the shape the page is built from. Two services, one object.':
      'La forma con cui parla l’assistente è la forma da cui è costruita la pagina. Due servizi, un oggetto.',
    'What goes on it': 'Cosa ci va sopra',
    'Your name, your hours, your address.': 'Il vostro nome, i vostri orari, il vostro indirizzo.',
    "Not a slideshow, not a stock photo of someone else's shop. The four things a customer opens your page to find, in the order they look for them.":
      'Niente slideshow, niente foto stock del negozio di qualcun altro. Le quattro cose per cui un cliente apre la vostra pagina, nell’ordine in cui le cerca.',
    'And the last thing': 'E l’ultima cosa',
    'One tap to call.': 'Un tocco per chiamare.',
    'The button below is not a picture of a button. The camera never moves in this sequence, so we know the exact rectangle it lands on — and a real link sits on it.':
      'Il bottone qui sotto non è l’immagine di un bottone. In questa sequenza la camera non si muove mai, quindi sappiamo esattamente in quale rettangolo atterra — e lì sopra c’è un link vero.',
    'For a restaurant': 'Per un ristorante',
    'What is in it, layer by layer.': 'Cosa c’è dentro, strato per strato.',
    'Every ingredient on its own, before it becomes the thing on the menu. Two photographs: this one, and the finished burger.':
      'Ogni ingrediente da solo, prima di diventare il piatto del menu. Due fotografie: questa, e l’hamburger finito.',
    'Put together': 'Montato',
    'In the order it goes together.': 'Nell’ordine in cui si monta.',
    'Bun, lettuce, tomato, cheese, the patty, the onion rings, the sauce. The film between the two photographs was generated, then cut into 84 frames the scrollbar plays.':
      'Pane, lattuga, pomodoro, formaggio, la carne, gli anelli di cipolla, la salsa. Il film tra le due fotografie è stato generato, poi tagliato in 84 fotogrammi che la barra di scorrimento riproduce.',
    'Served': 'Servito',
    'And this is the photo on the menu.': 'E questa è la foto sul menu.',
    'No 3D model this time: two photographs of the product and a generated film between them. If you sell something you can photograph, we can do this for your page.':
      'Stavolta nessun modello 3D: due fotografie del prodotto e un film generato tra le due. Se vendete qualcosa che si può fotografare, possiamo farlo per la vostra pagina.',
    'What this page is': 'Cos’è questa pagina',
    'A demonstration, and it is our own product on the stand.': 'Una dimostrazione, con il nostro prodotto sul banco.',
    'The big product launches all use the same trick: a 3D object rendered to a sequence of still frames, played on a canvas by the scrollbar instead of by a clock. It looks like a live 3D engine. It is a flipbook — which is exactly why it stays smooth on a phone.':
      'I grandi lanci di prodotto usano tutti lo stesso trucco: un oggetto 3D renderizzato in una sequenza di fotogrammi fissi, riprodotti su un canvas dalla barra di scorrimento invece che da un orologio. Sembra un motore 3D dal vivo. È un flipbook — ed è esattamente per questo che resta fluido su un telefono.',
    'We built both objects in Blender from code, lit them in a measured studio, and wired them to the scroll. The second sequence goes one further: the camera never moves, so we know the exact rectangle the call button lands on, and there is a real link sitting on it. The button you can see is the button you can press.':
      'Abbiamo costruito entrambi gli oggetti in Blender da codice, li abbiamo illuminati in uno studio misurato e collegati allo scorrimento. La seconda sequenza fa un passo in più: la camera non si muove mai, quindi sappiamo esattamente in quale rettangolo atterra il bottone di chiamata, e lì sopra c’è un link vero. Il bottone che vedete è il bottone che potete premere.',
    'The third one needs no 3D model: two photographs of a burger — one pulled apart, one finished — and a film generated between them, cut into frames and played by the scrollbar like the other two. If you sell something you can photograph, we can do this for your page.':
      'La terza non ha bisogno di un modello 3D: due fotografie di un hamburger — uno smontato, uno finito — e un film generato tra le due, tagliato in fotogrammi e riprodotto dalla barra di scorrimento come le altre due. Se vendete qualcosa che si può fotografare, possiamo farlo per la vostra pagina.',
    'What we build': 'Cosa costruiamo',
    'The two halves of the same job.': 'Le due metà dello stesso lavoro.',
    'The assistant': 'L’assistente',
    'Answers when you cannot': 'Risponde quando voi non potete',
    'It sits on the website you already have and handles the questions and bookings you would otherwise take by phone.':
      'Sta sul sito che avete già e gestisce le domande e le prenotazioni che altrimenti prendereste al telefono.',
    'Answers from your information only': 'Risponde solo con le vostre informazioni',
    'Books into the calendar you already use': 'Prenota nell’agenda che usate già',
    'Stops and hands over anything it is unsure about': 'Si ferma e passa a voi tutto ciò di cui non è sicuro',
    'English, Dutch and Italian': 'Inglese, olandese e italiano',
    'The website': 'Il sito',
    'The page they judge you on': 'La pagina su cui vi giudicano',
    'For businesses whose customers check them on a phone before deciding to call.':
      'Per le attività che i clienti guardano sul telefono prima di decidere se chiamare.',
    'Hours and address on the first screen': 'Orari e indirizzo nella prima schermata',
    'One tap to call or to book': 'Un tocco per chiamare o prenotare',
    'No cookie wall, no tracking scripts': 'Niente banner dei cookie, niente script di tracciamento',
    'Fast on an old phone and a bad connection': 'Veloce su un telefono vecchio e con una connessione scarsa',
    'How this page was made': 'Come è stata fatta questa pagina',
    'No 3D engine runs in your browser.': 'Nel vostro browser non gira nessun motore 3D.',
    'Object': 'Oggetto',
    'Modelled in Blender from code, lit with a measured studio': 'Modellato in Blender da codice, illuminato con uno studio misurato',
    'Render': 'Render',
    'Cycles on CPU, 234 frames across two sequences': 'Cycles su CPU, 234 fotogrammi in due sequenze',
    'Delivery': 'Consegna',
    'WebP with transparency, two sizes': 'WebP con trasparenza, due dimensioni',
    'Playback': 'Riproduzione',
    'One canvas, one drawImage per scroll frame': 'Un canvas, un drawImage per ogni fotogramma di scorrimento',
    'Libraries': 'Librerie',
    'None': 'Nessuna',
    'Sequence weight': 'Peso per sequenza',
    'Under 5 MB at 960px · under 1.5 MB at 560px': 'Sotto i 5 MB a 960px · sotto 1,5 MB a 560px',
    'The whole thing is one HTML file, one canvas and a folder of images. No framework, no scroll library, nothing to keep updated. That is the point: it has to still work in two years, when nobody is maintaining it.':
      'Il tutto è un file HTML, un canvas e una cartella di immagini. Nessun framework, nessuna libreria di scorrimento, niente da tenere aggiornato. È questo il punto: deve funzionare ancora tra due anni, quando nessuno lo manterrà.',
    'Talk to us': 'Parlate con noi',
    'Tell us what you sell. We will tell you what it takes.': 'Diteci cosa vendete. Vi diremo cosa serve.',
    'A page like this is worth it when you have something to show. If what you need is to be found and phoned, we will say so and build you the small fast one instead.':
      'Una pagina così vale la pena quando avete qualcosa da mostrare. Se quello che vi serve è essere trovati e chiamati, ve lo diremo e vi costruiremo quella piccola e veloce.',
    'See what we normally build →': 'Guardate cosa costruiamo di solito →',
    'Twinbyte — websites and assistants for small businesses in the Netherlands, the UK and Italy.':
      'Twinbyte — siti web e assistenti per piccole attività nei Paesi Bassi, nel Regno Unito e in Italia.',
  },
}

const DESCRIPTION = {
  nl: 'Een productpagina die door de scrolbalk wordt aangedreven, gebouwd zoals de grote productlanceringen de hunne bouwen: 3D-sequenties gerenderd tot stilstaande beelden en op een canvas afgespeeld door de scrolbalk. Gemaakt door Twinbyte.',
  it: 'Una pagina prodotto guidata dalla barra di scorrimento, costruita come i grandi lanci costruiscono le loro: sequenze 3D renderizzate in fotogrammi fissi e riprodotte su un canvas dallo scorrimento. Fatta da Twinbyte.',
}

let html = await readFile(SRC, 'utf8')
/* entities in the source become characters, so one dictionary matches both */
html = html.replaceAll('&mdash;', '—').replaceAll('&middot;', '·')

/* A long paragraph is wrapped over several source lines; the dictionary holds
   it as one. Collapse the whitespace of every text node in the markup — not
   in the script at the end, whose `>` and `<` are operators. */
const cut = html.lastIndexOf('<script>')
html =
  html.slice(0, cut).replace(/>([^<]*\S[^<]*)</g, (m, text) => `>${text.replace(/\s+/g, ' ').trim()}<`) +
  html.slice(cut)

/* Longest first, so a short string never eats part of a long one. */
const keys = Object.keys(T.nl).sort((a, b) => b.length - a.length)
for (const key of keys) {
  if (!html.includes(`>${key}<`) && !html.includes(key)) console.warn(`showcase-i18n: not on the page any more: "${key.slice(0, 50)}"`)
}

let missing = 0
for (const lang of ['nl', 'it']) {
  let out = html
  for (const key of keys) {
    const value = T[lang][key]
    if (value === undefined) {
      console.error(`showcase-i18n: no ${lang} for "${key.slice(0, 50)}"`)
      missing++
      continue
    }
    /* Only text nodes and attribute values: bounded by > < or quotes. */
    out = out.split(`>${key}<`).join(`>${value}<`)
    out = out.split(`"${key}"`).join(`"${value}"`)
  }
  out = out
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${DESCRIPTION[lang]}">`)
    .replaceAll("url('./fonts/", "url('../fonts/")
    .replaceAll("dir: './", "dir: '../")
    .replaceAll("cfg.dir + '/anchors.json'", "cfg.dir + '/anchors.json'")
    .replaceAll('href="/">', `href="/${lang}">`)
    .replace('<link rel="icon" href="/icon-32.png">', `<link rel="icon" href="/icon-32.png"><link rel="alternate" hreflang="en" href="https://www.twinbyteservices.com/showcase/"><link rel="alternate" hreflang="nl" href="https://www.twinbyteservices.com/showcase/nl/"><link rel="alternate" hreflang="it" href="https://www.twinbyteservices.com/showcase/it/">`)
  await mkdir(`dist/showcase/${lang}`, { recursive: true })
  await writeFile(`dist/showcase/${lang}/index.html`, out)
  console.log(`showcase: /showcase/${lang}/`)
}
if (missing) process.exit(1)
