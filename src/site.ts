export const SITE = {
  name: 'Twinbyte',
  email: 'info@twinbyteservices.com',
  /** International format without "+" or spaces, as wa.me requires. */
  whatsappNumber: '31645745163',
  whatsappDisplay: '+31 6 45745163',
  /** The one place the site's address is written down. The build reads it from
      here to stamp the canonical tags, robots.txt and the sitemap, so there is
      nothing to forget when it changes. */
  baseUrl: 'https://twinbyteservices.com',
  lastUpdated: '2026-10-05',
  /** Live assistant widget on this site. Set enabled: false to take it off. */
  widget: {
    enabled: true,
    src: 'https://chatbot-dentisti.vercel.app/widget.js',
    api: 'https://chatbot-dentisti-production.up.railway.app',
    studio: 'twinbyte',
    name: 'Twinbyte',
    /* If src or api change, so does the widget on every client site — and
       the privacy statement names these origins. The colour is this site's
       own embed only (clients set theirs): petrol, the assistant's ink.
       The widget sets white text on it (5.5:1), and the launcher on the
       navy page head clears 3.5:1 where the old teal had 2.2:1. */
    color: '#356F8E',
  },
  /**
   * Live demo practice, served from this site (public/demo), one page per language.
   */
  demo: {
    en: '/demo/',
    nl: '/demo/nl/',
    it: '/demo/it/',
  },
  /**
   * How the home page takes contact. Off, it shows the contact panel
   * (WhatsApp and email, src/components/Contact.tsx) and the booking code is
   * never downloaded: CalendarCard is a lazy chunk.
   */
  booking: {
    /** true brings back the Google Calendar card (needs the Google setup in BOOKING.md) */
    calendar: false as boolean,
  },
} as const

export function waLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

/** A mailto link with a subject and, if given, a body. Line breaks in the
    body go out as CRLF, which is what mail clients expect in a mailto body. */
export function mailLink(subject: string, body?: string): string {
  const link = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`
  if (body === undefined) return link
  return `${link}&body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`
}
