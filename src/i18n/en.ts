import metaJson from './meta.json'
import type { Translation } from './types'

export const en: Translation = {
  htmlLang: 'en',
  meta: metaJson.en,
  nav: {
    how: 'How it works',
    benefits: 'For your practice',
    security: 'Privacy & safety',
    websites: 'Websites',
    faq: 'FAQ',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    skip: 'Skip to content',
  },
  hero: {
    eyebrow: 'Twinbyte — Anna & Samuele',
    title: 'Your practice answers patients 24/7, even when the phone is busy',
    lead: 'We put a digital assistant on your practice website, answering patients 24/7. It handles the questions you get every day — opening hours, treatments, what to bring to a first visit — and books appointments straight into the calendar your practice already uses.',
    ctaTrial: 'Start the 14-day free trial',
    ctaDemo: 'See the live demo',
    note: 'No commitment. If it turns out not to help your practice, we remove it for free.',
    bullets: [
      'Books into the calendar your practice already uses',
      'Answers patients in their own language',
      'Urgent requests are handed to your staff, not answered by the assistant',
    ],
  },
  how: {
    title: 'How it works',
    lead: 'Three steps, and the work on your side is mostly the first one.',
    steps: [
      {
        title: 'We set it up with your details',
        body: 'You send us your opening hours, the treatments you offer and the questions patients ask most often. We configure the assistant around them, so the answers are yours and not generic filler.',
      },
      {
        title: 'We put it on your website',
        body: 'One line of code on the site you already have. Nothing to install, nothing else changes. A WhatsApp version is on the way.',
      },
      {
        title: 'Patients book themselves',
        body: 'The assistant checks your availability, asks for a name and a phone number and creates the appointment in the calendar your practice already uses. You keep full control of your calendar.',
      },
    ],
  },
  benefits: {
    title: 'What your practice gets out of it',
    lead: 'Nothing revolutionary — just the repetitive part of the front desk handled.',
    items: [
      {
        title: 'Fewer calls at the desk',
        body: 'Hours, address, parking, what a first visit involves: the routine questions are answered without anyone picking up the phone.',
      },
      {
        title: 'Bookings outside opening hours',
        body: 'Evenings, weekends, holidays. A patient who would otherwise have called tomorrow — or called someone else — books tonight.',
      },
      {
        title: 'It speaks your patients\u2019 language',
        body: 'We set the assistant up in your practice\u2019s main language, and when a patient asks to be helped in another one it switches over. Useful in any practice with international patients.',
      },
      {
        title: 'Urgencies reach a human',
        body: 'The assistant does not improvise on urgent cases or changes. It takes the name and number and creates a "call back" event in your calendar, so a person follows up.',
      },
    ],
  },
  security: {
    title: 'Privacy and safety',
    lead: 'A dental practice handles sensitive data. Our approach is to touch as little of it as possible.',
    items: [
      {
        title: 'We ask for the minimum',
        body: 'To make a booking the assistant needs a name and a phone number. No medical history, no documents, no payment details.',
      },
      {
        title: 'Patients know it is not a person',
        body: 'The assistant makes that clear before the conversation starts. It gives no diagnosis and no medical advice — clinical questions are passed to the practice.',
      },
      {
        title: 'A signed data processing agreement',
        body: 'Before going live we sign a data processing agreement with the practice: what is processed, why, and for how long. The practice stays the controller of the data.',
      },
    ],
  },
  websites: {
    title: 'Websites for small businesses',
    lead: 'Besides the dental assistant we build websites — the kind a small business actually needs, not a showcase for us.',
    items: [
      'Fast on a phone first, because that is where your customers are',
      'A clear structure: what you do, where you are, how to reach you',
      'The assistant can be added later, on the same site',
      'No CMS to learn: you tell us what changed, we update it',
    ],
    tags: ['Mobile-first', 'Fast by default', 'Assistant-ready'],
    cta: 'Ask about a website',
  },
  trial: {
    title: 'The 14-day free trial',
    lead: 'Two weeks on your own website, at no cost and with nothing to sign up front.',
    steps: [
      'We configure the assistant with your hours, treatments and FAQ and place it on your site.',
      'It runs for 14 days. You see the real conversations and the real bookings, not a demo.',
      'We go through the results together and you decide whether it is worth keeping.',
      'If you keep it, it becomes a monthly subscription. If not, we remove it the same day, free of charge.',
    ],
    cta: 'Start the free trial on WhatsApp',
    note: 'We talk about the monthly price after the trial, once we both know what your practice actually uses.',
  },
  faq: {
    title: 'Frequently asked questions',
    lead: 'If something is missing, just ask us on WhatsApp.',
    items: [
      {
        q: 'Does the assistant give medical advice?',
        a: 'No. It answers organisational questions and books appointments. Anything clinical is passed to the practice, and the patient is told that someone from the practice will get back to them.',
      },
      {
        q: 'What happens with urgencies?',
        a: 'The assistant does not try to triage. It takes the name and phone number and creates a "call back" event in your calendar so your staff can react quickly. The same happens when a patient wants to move or cancel an appointment.',
      },
      {
        q: 'Does it work with our current website?',
        a: 'Yes, as long as we can add one line of code to it. That is the case for almost every site — WordPress, Wix, Squarespace or a custom build.',
      },
      {
        q: 'Do we have to change our calendar or software?',
        a: 'No. We set the assistant up around the calendar you already work with: with Google Calendar it is ready to go, and for other practice software we look at the integration together before the trial starts. Appointments appear as ordinary events and you can move or cancel them as always.',
      },
      {
        q: 'What if we want to stop?',
        a: 'You tell us and we remove the assistant from your site. During the trial there is nothing to cancel; afterwards the subscription runs month by month.',
      },
      {
        q: 'Which languages does it speak?',
        a: 'We configure the assistant in the language your practice works in, and a patient who asks to continue in another language gets answered in that one. We work mainly with practices in the United Kingdom, Italy and the Netherlands, but the assistant is not limited to those languages.',
      },
      {
        q: 'Who is behind Twinbyte?',
        a: 'Anna and Samuele. Two people, which means you always talk to the person who set up your assistant — no ticket system in between.',
      },
    ],
  },
  contact: {
    title: 'Talk to us',
    lead: 'WhatsApp is the fastest way to reach us. Email works just as well if you prefer it in writing.',
    whatsapp: 'Message us on WhatsApp',
    email: 'Send an email',
    emailSubject: 'Question about the Twinbyte assistant',
    note: 'You will always get a reply from Anna or Samuele — there is no call centre behind this.',
    regions: 'We work with practices in the United Kingdom, Italy and the Netherlands, and we work remotely.',
  },
  footer: {
    tagline: 'Digital assistant for dental practices and websites for small businesses.',
    privacy: 'Privacy statement',
    rights: 'All rights reserved.',
  },
  privacyPage: {
    title: 'Privacy statement',
    updated: 'Last updated',
    intro:
      'This statement explains what happens to personal data on this website and when you get in touch with us. It is deliberately short, because this website collects almost nothing.',
    sections: [
      {
        title: 'Who we are',
        body: [
          'Twinbyte — Anna and Samuele.',
          'Controller: TODO_LEGAL_NAME',
          'Address: TODO_ADDRESS',
          'VAT / company number: TODO_VAT_NUMBER',
          'Email: twinbyteai@gmail.com',
        ],
      },
      {
        title: 'This website',
        body: [
          'This website uses no cookies. Nothing is stored for analytics, advertising or profiling, which is why there is no cookie banner to click away.',
          'We use no analytics or tracking tools, and no fonts or scripts are loaded from third-party servers.',
          'The site is hosted on Cloudflare Pages. Like any web server, the hosting provider processes technical request data such as IP address and browser type in order to deliver the pages and protect the service against abuse.',
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
          'The assistant described on this page runs on the websites of our clients — the practices themselves. For those conversations the practice is the controller and Twinbyte acts as processor under a signed data processing agreement.',
          'This statement therefore covers only this website. Patients chatting with an assistant on a practice website should read that practice’s privacy statement.',
        ],
      },
      {
        title: 'Your rights',
        body: [
          'You can ask us for access to your data, for correction, deletion or restriction, for a copy in a portable format, and you can object to processing. Write to twinbyteai@gmail.com and we will take care of it.',
          'If you believe we handle your data incorrectly, you can lodge a complaint with your national data protection authority. TODO_SUPERVISORY_AUTHORITY',
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
    siteLabel: 'your-practice.com',
    messages: [
      { from: 'patient', text: 'Hi, can I come in for a check-up next week?' },
      { from: 'bot', text: 'Of course. Thursday the 18th at 10:30, or Friday the 19th at 16:00?' },
      { from: 'patient', text: 'Thursday works.' },
      { from: 'bot', text: 'Could you give me your name and a phone number?' },
      { from: 'patient', text: 'Laura Bakker, 06 12345678' },
      { from: 'bot', text: 'Booked: Thursday the 18th at 10:30. It is in the practice calendar now.' },
    ],
    typing: 'typing',
    assistant: 'Digital assistant',
    online: 'always on',
    calendarTitle: 'Practice calendar',
    eventTitle: 'Check-up — Laura Bakker',
    eventTime: 'Thu 18 Sept · 10:30 – 11:00',
    eventBadge: 'Created by the assistant',
    callback: 'Call back — urgent request',
    tryHere: 'The chat bubble in the bottom right is the real assistant. Try it.',
  },
  wa: {
    generic: 'Hello Twinbyte, I have a question about your digital assistant.',
    trial:
      'Hello Twinbyte, I would like to start the 14-day free trial of the digital assistant for my dental practice.',
    websites: 'Hello Twinbyte, I would like to know more about a website for my business.',
  },
}
