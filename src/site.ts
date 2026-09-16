export const SITE = {
  name: 'Twinbyte',
  email: 'info@twinbyteservices.com',
  /** International format without "+" or spaces, as wa.me requires. */
  whatsappNumber: '31645745163',
  whatsappDisplay: '+31 6 45745163',
  baseUrl: 'https://twinbyte.online',
  lastUpdated: '2026-09-15',
  /** Live assistant widget on this site. Set enabled: false to take it off. */
  widget: {
    enabled: true,
    src: 'https://chatbot-dentisti.vercel.app/widget.js',
    api: 'https://chatbot-dentisti-production.up.railway.app',
    studio: 'twinbyte',
    name: 'Twinbyte',
    color: '#1f6f8b',
  },
  /**
   * Live demo practice, served from this site (public/demo).
   * TODO: Dutch and Italian versions of the demo page — both point at the
   * English one for now.
   */
  demo: {
    en: '/demo/',
    nl: '/demo/',
    it: '/demo/',
  },
} as const

export function waLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function mailLink(subject: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`
}
