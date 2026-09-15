export const SITE = {
  name: 'Twinbyte',
  email: 'twinbyteai@gmail.com',
  /** International format without "+" or spaces, as wa.me requires. */
  whatsappNumber: '31645745163',
  whatsappDisplay: '+31 6 45745163',
  /** TODO: replace with the final Cloudflare Pages domain (or a custom domain). */
  baseUrl: 'https://twinbyte.pages.dev',
  lastUpdated: '2026-09-15',
  demo: {
    en: 'https://chatbot-dentisti.vercel.app/demo-en.html',
    nl: 'https://chatbot-dentisti.vercel.app/demo-nl.html',
    it: 'https://chatbot-dentisti.vercel.app/demo-it.html',
  },
} as const

export function waLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function mailLink(subject: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`
}
