export type Lang = 'en' | 'nl' | 'it'

export const LANGS: Lang[] = ['en', 'nl', 'it']

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  nl: 'Nederlands',
  it: 'Italiano',
}

export interface TitledItem {
  title: string
  body: string
}

export interface Translation {
  htmlLang: string
  meta: {
    title: string
    description: string
    privacyTitle: string
    privacyDescription: string
  }
  nav: {
    how: string
    benefits: string
    security: string
    websites: string
    prices: string
    faq: string
    contact: string
    openMenu: string
    closeMenu: string
    language: string
    /** accessible name for the main navigation landmark */
    main: string
    skip: string
  }
  /** The first screen: two lines, one sentence, two buttons. The picture does
      the rest. */
  hero: {
    title: string
    lead: string
    ctaQuote: string
    ctaDemo: string
  }
  /** The example small-business site drawn inside the hero stage. It is a mock,
      not a real customer: the name is deliberately generic. */
  heroSite: {
    url: string
    name: string
    tagline: string
    hours: string
    address: string
    nav: string[]
    call: string
    book: string
    phoneLabel: string
    /** under the business name in the chat header */
    status: string
    /** placeholder in the message field */
    input: string
  }
  /** The fork right under the hero: assistant on one side, websites on the other. */
  split: {
    title: string
    assistant: { tag: string; title: string; body: string; points: string[]; cta: string; quote: string }
    websites: { tag: string; title: string; body: string; points: string[]; cta: string; quote: string }
  }
  /** Full-width scenes: an illustration with a headline over it. */
  scenes: {
    handover: { eyebrow: string; lead: string; accent: string; tail: string; body: string }
  }
  /** The published price list. Numbers differ by market: the Italian page
      carries Italian prices, the Dutch and English pages carry the NL/UK ones. */
  pricing: {
    eyebrow: string
    title: string
    lead: string
    launch: {
      tag: string
      body: string
      /** what the first three actually pay, next to what it would cost */
      rows: { label: string; value: string; was: string }[]
      savingLabel: string
      saving: string
    }
    /** the one-line version that sits at the top of the first screen */
    bar: { text: string; cta: string }
    setupLabel: string
    monthLabel: string
    /** fixed order: one-page site, full site, assistant, assistant pro */
    plans: { name: string; setup: string; month: string; plus?: string; points: string[] }[]
    bundle: { tag: string; name: string; setup: string; month: string; body: string }
    fine: string[]
    cta: string
  }
  /** The demo practice on a laptop and a phone, its pages scrolling past on
      both screens as the visitor scrolls (src/components/DeviceScroll.tsx).
      Only promises the site already makes. */
  devices: {
    eyebrow: string
    title: string
    lead: string
    points: TitledItem[]
    /** three short chips under the points */
    chips: [string, string, string]
    /** the link to the demo practice (SITE.demo) */
    cta: string
    /** one line next to the link: the practice is made up */
    note: string
    /** the laptop screenshot; the phone repeats it and is left unnamed */
    alt: string
  }
  /** The day strip: the hours a business is not there to answer. */
  dayStrip: {
    eyebrow: string
    title: string
    caption: string
    legendOpen: string
    legendShut: string
  }
  how: { title: string; lead: string; steps: TitledItem[] }
  benefits: { title: string; lead: string; items: TitledItem[] }
  security: { title: string; lead: string; items: TitledItem[] }
  websites: {
    title: string
    lead: string
    cta: string
    includesTitle: string
    includes: string[]
    whoTitle: string
    who: string
    quoteNote: string
    /** link to /showcase, the scroll-driven demonstration page */
    showcase: string
  }
  faq: { title: string; lead: string; items: { q: string; a: string }[] }
  contact: {
    title: string
    email: string
    emailSubject: string
    note: string
    regions: string
  }
  footer: { tagline: string; colophon: string; privacy: string; rights: string }
  privacyPage: {
    title: string
    updated: string
    intro: string
    sections: { title: string; body: string[] }[]
    back: string
  }
  demo: {
    tag: string
    siteLabel: string
    messages: { from: 'patient' | 'bot'; text: string }[]
    typing: string
    calendarTitle: string
    eventTitle: string
    eventTime: string
    eventBadge: string
    callback: string
    tryHere: string
    /** the handover drawing: where the assistant stops */
    knows: string
    yes: string
    books: string
    no: string
    toAPerson: string
    fieldName: string
    fieldPhone: string
  }
  /** primo messaggio della chat sul nostro sito */
  widgetHello: string
  wa: { generic: string; assistantQuote: string; websitesQuote: string }
}
