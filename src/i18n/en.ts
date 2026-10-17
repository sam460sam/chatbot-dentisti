import metaJson from './meta.json'
import type { Translation } from './types'

export const en: Translation = {
  htmlLang: 'en',
  meta: metaJson.en,
  nav: {
    how: 'How it works',
    benefits: 'What you get',
    security: 'Privacy & safety',
    websites: 'Websites',
    prices: 'Prices',
    faq: 'FAQ',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    main: 'Main',
    skip: 'Skip to content',
  },
  hero: {
    title: 'The website that books your appointments.',
    lead: 'We build the site, and the assistant on it answers your customers and fills your calendar at any hour.',
    ctaQuote: 'See what it costs',
    ctaDemo: 'Watch it book one',
  },
  heroSite: {
    url: 'your-business.com',
    name: 'Your business',
    tagline: 'The page your customers land on before they call.',
    hours: 'Open Mon–Fri · 09:00–17:00',
    address: 'Kerkstraat 12, Groningen',
    nav: ['What we do', 'Prices', 'Find us'],
    call: 'Call now',
    book: 'Book online',
    phoneLabel: 'On the phone, 23:47',
    status: 'Replies in seconds',
    input: 'Write a message',
  },
  pricing: {
    eyebrow: 'What it costs',
    title: 'The whole price list, on the page',
    lead: 'No call needed to find out what you would pay. These are launch prices: they will go up, and whoever signs now keeps theirs.',
    launch: {
      tag: 'Launch offer — first three clients',
      body: 'Full site + Assistant, with the assistant\u2019s setup fee taken off and the first three months on us. From month four the normal bundle fee starts. Three clients, then it is gone.',
      rows: [
        { label: 'To set up', value: '\u20AC690', was: 'instead of \u20AC1,230' },
        { label: 'First three months', value: '\u20AC0', was: 'instead of \u20AC108 a month' },
        { label: 'From month four', value: '\u20AC79', was: 'instead of \u20AC108' },
      ],
      savingLabel: 'You save (setup + first three months)',
      saving: '\u20AC864',
      cta: 'Ask for one of the three places',
      wa: 'Hi Twinbyte, I would like the launch offer (full site + assistant). Is a place still free?',
    },
    bar: {
      text: 'First three clients: the assistant comes free with a website.',
      cta: 'See the prices',
    },
    setupLabel: 'To set up',
    monthLabel: 'Per month',
    plans: [
      {
        name: 'One-page site',
        setup: '\u20AC590',
        month: '\u20AC19',
        points: ['Everything on one screen: hours, address, one tap to call', 'Written in your language', 'Hosting and small changes included'],
      },
      {
        name: 'Full site',
        setup: '\u20AC990',
        month: '\u20AC29',
        points: ['Up to five pages', 'Findable on Google, in every language you sell in', 'Hosting and small changes included'],
      },
      {
        name: 'Assistant',
        setup: '\u20AC240',
        month: '\u20AC79',
        points: ['300 conversations a month', 'Books into the calendar you already use', 'Replies in your customer’s language'],
      },
      {
        name: 'Assistant Pro',
        setup: '\u20AC340',
        month: '\u20AC129',
        plus: 'Everything in Assistant, plus:',
        points: ['1,000 conversations a month', 'WhatsApp as well as the website'],
      },
    ],
    bundle: {
      tag: 'Both together',
      name: 'Full site + Assistant',
      setup: '\u20AC860',
      month: '\u20AC79',
      body: 'Thirty per cent off the setup, and the site\u2019s monthly fee is on us for as long as you keep the assistant. Building them together is genuinely less work for us, so you keep the difference.',
    },
    fine: [
      'Online in about a week, once we have your texts and photos.',
      'The monthly fee covers hosting, the security certificate, a standard domain and small changes.',
      'Small changes (hours, prices, texts, photos): send them on WhatsApp, done within a week.',
      'Conversations beyond your plan: \u20AC0.08 each. We tell you before you go over, never after.',
      'Extra page on a full site: \u20AC140.',
      'Month to month, one month\u2019s notice. No long contract, ever.',
      'Prices in euro, for businesses. VAT, where it applies, is shown on the quote.',
    ],
    cta: 'Ask for the bundle',
    planCta: 'Ask for this plan',
    planWa: 'Hi Twinbyte, I am interested in the “{plan}” plan. When could we talk?',
  },
  split: {
    title: 'Two services, both done properly',
    assistant: {
      tag: 'Digital assistant',
      title: 'Stop losing the calls you never hear',
      body: 'It sits on the website you already have and handles the questions and bookings you would otherwise take by phone — evenings, weekends, while you are with a customer.',
      points: [
        'Answers in seconds, from your information only',
        'Books straight into your existing calendar',
        'Hands anything sensitive to a person on your team',
      ],
      cta: 'See how it works',
      quote: 'Ask for a price',
    },
    websites: {
      tag: 'Websites',
      title: 'A site people read, not one they admire',
      body: 'For businesses whose customers check them on a phone before deciding to call. Opening hours, what you do and how to reach you, findable in ten seconds.',
      points: [
        'Fast on a phone, even on a bad connection',
        'No CMS to learn — you tell us, we update it',
        'The assistant can be added to it later',
      ],
      cta: 'See what we build',
      quote: 'Ask for a quote',
    },
  },
  scenes: {
    handover: {
      eyebrow: 'When it matters',
      lead: 'Anything delicate goes to',
      accent: 'a person',
      tail: '',
      body: 'Urgent, unusual, or outside what it knows: the assistant stops, takes the details and puts a call back in your calendar. Someone on your team closes it.',
    },
  },
  devices: {
    eyebrow: 'A live example',
    title: 'Built for the phone. Just as clear on a laptop.',
    lead: 'A demo site we made for a fictional dental practice. Scroll on, and its pages scroll with you.',
    points: [
      { title: 'Your pages', body: 'Opening hours, what you do and how to reach you, findable in ten seconds.' },
      { title: 'Works on a phone', body: 'Fast on a phone, even on a bad connection — that is where your customers look you up.' },
      { title: 'The assistant, if you want it', body: 'Added to the same site, it answers questions and books appointments in the chat.' },
    ],
    chips: ['Hosting included', 'Price on the page', 'Month to month'],
    cta: 'See the live demo',
    note: 'The practice is fictional. The website and the assistant are made by Twinbyte.',
    alt: 'The website of the fictional demo practice, on a laptop and on a phone',
  },
  dayStrip: {
    eyebrow: 'One Tuesday',
    title: 'You are open for eight of these twenty-four hours',
    caption: 'The other sixteen belong to nobody. Someone writing at 21:40 is not being difficult — that is the hour they finally sat down.',
    legendOpen: 'Open — you answer',
    legendShut: 'Closed — the assistant answers',
  },
  how: {
    title: 'How it works',
    lead: 'Three steps, and the work on your side is mostly the first one.',
    steps: [
      {
        title: 'We set it up with your details',
        body: 'You send us your opening hours, what you offer and the questions customers ask most often. We configure the assistant around them, so the answers are yours and not generic filler.',
      },
      {
        title: 'We put it on your website',
        body: 'One line of code on the site you already have. Nothing to install, nothing else changes. With Assistant Pro it also answers on WhatsApp; setting that up takes about two weeks.',
      },
      {
        title: 'Customers book themselves',
        body: 'The assistant checks your availability, asks for a name and a phone number and creates the appointment in the calendar you already use. You keep full control of it.',
      },
    ],
  },
  benefits: {
    title: 'What your business gets out of it',
    lead: 'In any business that takes bookings, a missed call is a lost customer — a salon, a garage, a dental practice, a studio, a clinic, a consultancy. The same assistant works for all of them.',
    items: [
      {
        title: 'Fewer calls to answer',
        body: 'Hours, address, parking, prices, what happens at a first appointment: the routine questions are answered without anyone picking up the phone.',
      },
      {
        title: 'Bookings outside opening hours',
        body: 'Evenings, weekends, holidays, and every timezone your customers are in. Someone who would otherwise have called tomorrow — or called a competitor — books tonight.',
      },
      {
        title: 'It speaks your customers’ language',
        body: 'We set the assistant up in the language you work in, and when a customer asks to be helped in another one it switches over. Useful anywhere your customers are not all local.',
      },
    ],
  },
  security: {
    title: 'Privacy and safety',
    lead: 'Your customers’ details are yours, not ours. Our approach is to touch as little of them as possible.',
    items: [
      {
        title: 'We ask for the minimum',
        body: 'To make a booking the assistant needs a name and a phone number. No documents, no payment details, and nothing sensitive that your business does not need to take a booking.',
      },
      {
        title: 'Customers know it is not a person',
        body: 'The assistant makes that clear before the conversation starts. It gives no professional or medical advice — anything that needs judgement is passed to you.',
      },
      {
        title: 'A signed data processing agreement',
        body: 'Before going live we sign a data processing agreement with you: what is processed, why, and for how long. You stay the controller of the data.',
      },
    ],
  },
  websites: {
    title: 'Websites for small businesses',
    lead: 'Clear, fast websites for small businesses: your hours, what you do, where you are and one tap to call, easy to find on any phone.',
    cta: 'Ask about a website',
    includesTitle: 'What a site includes',
    includes: [
      'Pages written with you — your words, no filler text',
      'Set up properly for Google: titles, descriptions, your business on the map',
      'Contact routes that actually get used: WhatsApp, phone, email',
      'Hosting and small changes are in the monthly fee, no separate hosting bill',
      'No cookies and no tracking, so no banner in your customer\u2019s face',
    ],
    whoTitle: 'Who it suits',
    who: 'Shops, workshops, trades, practices, studios, anyone who is looked up on a phone before being called. If you need a web shop with hundreds of products, we are not the right people and we will say so.',
    quoteNote: 'The prices are on the Prices page. In the free 15-minute call we agree the plan and the timing: that depends on how many pages you need and whether you already have text and photos.',
    showcase: 'See a page built to show off',
  },
  faq: {
    title: 'Frequently asked questions',
    lead: 'If something is missing, just ask us on WhatsApp.',
    items: [
      {
        q: 'My customers hate chatbots. Why would this be different?',
        show: ['home', 'assistant'],
        a: 'Because most of them are not answering, they are deflecting — endless menus to avoid a human. This one answers the question, books the appointment and, the moment it cannot help, takes a name and a number and passes it to you. Customers are told from the first line that it is not a person.',
      },
      {
        q: 'What stops it from saying the wrong thing?',
        show: ['assistant'],
        a: 'It answers from the information you give us — your hours, your services, your prices — and nothing else. When it does not know, it says so, takes the details and hands the question to you instead of inventing an answer.',
      },
      {
        q: 'What does it cost?',
        a: 'The whole price list for websites and the assistant is on this page — nothing is held back until a phone call. The assistant is €240 to set up and €79 a month for 300 conversations; sites start at €590. Take the full site and the assistant together and the setup drops thirty per cent and the site’s monthly fee is on us.',
      },
      {
        q: 'Is the website mine?',
        show: ['home'],
        a: 'Your site runs as a subscription: design, hosting, the security certificate, a standard domain and small changes are all in the monthly fee. You can stop month by month with one month’s notice; when the subscription ends, we take the site offline. A premium domain name is quoted separately.',
      },
      {
        q: 'How long until my site is online?',
        a: 'Online in about a week, once we have your texts and photos. Small changes (hours, prices, texts, photos): send them on WhatsApp, done within a week.',
      },
      {
        q: 'How much do the ads cost?',
        a: 'You pay two things: the ad budget, which goes to Meta, and our fee for creating and running the ads. We agree both in the call, before anything starts.',
      },
      {
        q: 'Does it work with our current website?',
        show: ['assistant'],
        a: 'Yes, as long as we can add one line of code to it. That is the case for almost every site — WordPress, Wix, Squarespace, Shopify or a custom build. Your site otherwise stays exactly as it is.',
      },
      {
        q: 'Do we have to change our calendar or software?',
        show: ['assistant'],
        a: 'No. We set the assistant up around the calendar you already work with: with Google Calendar it is ready to go, and for other booking software we look at the integration together before we start. Appointments appear as ordinary events you can move or cancel as always.',
      },
      {
        q: 'What if we want to stop?',
        show: ['assistant'],
        a: 'You tell us and we remove the assistant from your site. The subscription runs month by month, with one month of notice.',
      },
      {
        q: 'I’m not good with computers. Is that a problem?',
        show: ['home'],
        a: 'No. There is nothing to learn: no CMS, no dashboard. We write the pages with you, and when something changes (hours, a price, a photo) you tell us on WhatsApp and we update it. Small changes are included in the monthly fee.',
      },
      {
        q: 'I already have a website. Do I need a new one?',
        show: ['home'],
        a: 'Not for the assistant: it goes on the site you already have with one line of code, and the rest stays as it is. If your site is slow or hard to read on a phone, we can build you a new one; the prices are on the Prices page.',
      },
      {
        q: 'Does the assistant answer my phone?',
        show: ['home', 'assistant'],
        a: 'No. It answers in a chat on your website (with Assistant Pro, on WhatsApp too), from your information only, and books appointments into your calendar. Anything it cannot handle goes to you with the customer’s name and number.',
      },
    ],
  },
  contact: {
    title: 'Talk to us',
    email: 'Send an email',
    emailSubject: 'Question for Twinbyte',
    note: 'You will always get a reply from the Twinbyte team itself — there is no call centre behind this.',
    regions: 'We work remotely with businesses anywhere in the world. Wherever you are, the assistant answers in your customers’ language.',
  },
  footer: {
    tagline: 'Fast websites, a digital assistant and online ads for local businesses.',
    colophon: 'Set in Bricolage Grotesque, Inter and Instrument Serif. Built in the Netherlands. This site sets no cookies, runs no analytics and loads no tracking pixels.',
    privacy: 'Privacy statement',
    rights: 'All rights reserved.',
  },
  privacyPage: {
    title: 'Privacy statement',
    updated: 'Last updated',
    intro:
      'This statement explains what happens to personal data on this website and when you get in touch with us. It is deliberately short: the website sets no cookies and tracks nothing. We only receive what you type yourself into a form (to book a call or send a request) or into the chat on the Digital assistant page.',
    sections: [
      {
        title: 'Who we are',
        body: [
          'Twinbyte.',
          'Controller: TODO_LEGAL_NAME',
          'Address: TODO_ADDRESS',
          'VAT / company number: TODO_VAT_NUMBER',
          'Email: info@twinbyteservices.com',
        ],
      },
      {
        title: 'This website',
        body: [
          'This website uses no cookies. Nothing is stored for analytics, advertising or profiling, which is why there is no cookie banner to click away.',
          'We use no analytics and no tracking tools, and the fonts are served from this domain.',
          'The site is hosted on Cloudflare Pages. Like any web server, the hosting provider processes technical request data such as IP address and browser type in order to deliver the pages and protect the service against abuse.',
        ],
      },
      {
        title: 'The assistant on the Digital assistant page',
        body: [
          'The chat window opens only on the Digital assistant page; no other page loads it. It is our own assistant. The script comes from a server we run at Vercel, and the answers from a server we run at Railway. Because your browser requests them directly, those two providers see your IP address and browser type.',
          'If you open the chat, what you type is sent to that server to be answered, together with the language of the page. Please do not put anything in it you would not send us by email — for a booking or an offer, write to us on WhatsApp or at info@twinbyteservices.com instead.',
        ],
      },
      {
        title: 'When you contact us',
        body: [
          'If you write to us on WhatsApp or by email, we process what you send: your name, your contact details and the content of your message. We use it to answer you and, if the conversation goes further, to prepare an offer.',
          'We keep that correspondence for as long as the conversation and our legal obligations require, and delete it afterwards.',
          'WhatsApp is provided by Meta and our email by Google. Their own terms apply to messages while they are in transit and stored on their servers.',
        ],
      },
      {
        title: 'The assistant on our clients’ websites',
        body: [
          'The assistant described on this page runs on the websites of our clients. For those conversations the client is the controller and Twinbyte acts as processor under a signed data processing agreement.',
          'This statement therefore covers only this website. Someone chatting with an assistant on a client’s website should read that company’s privacy statement.',
        ],
      },
      {
        title: 'Your rights',
        body: [
          'You can ask us for access to your data, for correction, deletion or restriction, for a copy in a portable format, and you can object to processing. Write to info@twinbyteservices.com and we will take care of it.',
          'If you believe we handle your data incorrectly, you can lodge a complaint with your national data protection authority.',
          'TODO_SUPERVISORY_AUTHORITY',
        ],
      },
      {
        title: 'Changes',
        body: ['If this statement changes, we update the date at the top of the page.'],
      },
    ],
    back: 'Back to the home page',
  },
  demo: {
    tag: 'Example conversation',
    siteLabel: 'your-website.com',
    messages: [
      { from: 'patient', text: 'Hi, can I book an appointment next week?' },
      { from: 'bot', text: 'Of course. Thursday the 18th at 10:30, or Friday the 19th at 16:00?' },
      { from: 'patient', text: 'Thursday works.' },
      { from: 'bot', text: 'Could you give me your name and a phone number?' },
      { from: 'patient', text: 'Laura Bakker, 06 12345678' },
      { from: 'bot', text: 'Booked: Thursday the 18th at 10:30. It is in your calendar now.' },
    ],
    typing: 'typing',
    calendarTitle: 'Your calendar',
    eventTitle: 'Appointment — Laura Bakker',
    eventTime: 'Thursday · 10:00 – 10:30',
    eventBadge: 'Created by the assistant',
    callback: 'Call back — urgent request',
    tryHere: 'The chat bubble in the bottom right is the real assistant. Try it.',
    knows: 'Does it know the answer?',
    yes: 'Yes',
    books: 'It answers, and books the appointment.',
    no: 'No, or it is urgent',
    toAPerson: 'It stops, and takes two things:',
    fieldName: 'Name',
    fieldPhone: 'Phone',
  },
  widgetHello:
    'Hi! I can answer questions about Twinbyte — how the assistant is set up, what it costs, privacy. What would you like to know?',
  wa: {
    generic: 'Hello Twinbyte, I have a question about your digital assistant.',
    assistantQuote:
      'Hi Twinbyte, I read about the digital assistant and would like it for my business. When could we talk?',
    websitesQuote: 'Hi Twinbyte, I would like a website for my business. When could we talk?',
  },
}
