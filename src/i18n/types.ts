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
    faq: string
    contact: string
    openMenu: string
    closeMenu: string
    language: string
    skip: string
  }
  hero: {
    eyebrow: string
    title: string
    lead: string
    ctaTrial: string
    ctaDemo: string
    note: string
    bullets: string[]
  }
  how: { title: string; lead: string; steps: TitledItem[] }
  benefits: { title: string; lead: string; items: TitledItem[] }
  security: { title: string; lead: string; items: TitledItem[] }
  websites: { title: string; lead: string; items: string[]; tags: string[]; cta: string }
  trial: { title: string; lead: string; steps: string[]; cta: string; note: string }
  faq: { title: string; lead: string; items: { q: string; a: string }[] }
  contact: {
    title: string
    lead: string
    whatsapp: string
    email: string
    emailSubject: string
    note: string
  }
  footer: { tagline: string; privacy: string; rights: string }
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
    assistant: string
    online: string
    calendarTitle: string
    eventTitle: string
    eventTime: string
    eventBadge: string
    callback: string
    tryHere: string
  }
  wa: { generic: string; trial: string; websites: string }
}
