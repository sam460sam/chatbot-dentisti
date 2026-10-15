import type { Lang } from './types'

/*
 * Copy that only the new layout needs: the hero line above the title, the
 * online-ads card, the link to the live demo on the assistant page, the
 * demo link in the phone menu and the footer headings. Everything else on the home page
 * reuses the booking copy (src/i18n/booking.ts), so no promise is written
 * twice. The ads card names no price on purpose: it is agreed in the call.
 */
export interface HomeCopy {
  hero: { eyebrow: string; video: string }
  ads: { tag: string; title: string; body: string; cta: string }
  /** The demo practice (public/demo) books into a test diary only: the note says so. */
  demo: { cta: string; note: string }
  footer: { pages: string; more: string; showcase: string; contact: string; services: string; adsLink: string; film: string }
  menu: string
  /** The fifth link in the phone menu: the demo practice (SITE.demo). */
  menuDemo: string
}

export const home: Record<Lang, HomeCopy> = {
  en: {
    hero: {
      eyebrow: 'Websites · Digital assistant · Online ads',
      video: 'A neighbourhood bakery at night, closed, with a phone lighting up on the counter.',
    },
    ads: {
      tag: 'Online ads',
      title: 'Seen by the people around you',
      body: 'We create and run ads on Instagram and Facebook for your business, aimed at people in your area. The cost depends on the campaign: we agree it with you in the call.',
      cta: 'Ask about ads',
    },
    demo: {
      cta: 'Try the live demo',
      note: 'The website of a fictional dental practice, with the assistant built in. Ask it anything or book a test appointment: nothing real is booked.',
    },
    footer: { pages: 'Pages', more: 'More', showcase: 'Showcase', contact: 'Contact', services: 'What we do', adsLink: 'Online ads', film: 'The Twinbyte mark, turning slowly.' },
    menu: 'Menu',
    menuDemo: 'Live demo',
  },
  nl: {
    hero: {
      eyebrow: 'Websites · Digitale assistent · Online advertenties',
      video: 'Een buurtbakkerij ’s avonds, gesloten, met een telefoon die oplicht op de toonbank.',
    },
    ads: {
      tag: 'Online advertenties',
      title: 'Gezien worden in uw eigen buurt',
      body: 'Wij maken en beheren advertenties op Instagram en Facebook voor uw bedrijf, gericht op mensen in uw omgeving. De kosten hangen af van de campagne: die spreken we met u af in het gesprek.',
      cta: 'Vraag naar advertenties',
    },
    demo: {
      cta: 'Probeer de live demo',
      note: 'De website van een fictieve tandartspraktijk, met de assistent erin. Stel uw vraag of boek een testafspraak: er wordt niets echt ingepland.',
    },
    footer: { pages: 'Pagina’s', more: 'Meer', showcase: 'Showcase', contact: 'Contact', services: 'Wat we doen', adsLink: 'Online advertenties', film: 'Het Twinbyte-logo, dat langzaam draait.' },
    menu: 'Menu',
    menuDemo: 'Live demo',
  },
  it: {
    hero: {
      eyebrow: 'Siti web · Assistente digitale · Pubblicità online',
      video: 'Un forno di quartiere di sera, chiuso, con un telefono che si illumina sul bancone.',
    },
    ads: {
      tag: 'Pubblicità online',
      title: 'Fatti vedere da chi abita in zona',
      body: 'Creiamo e gestiamo annunci su Instagram e Facebook per la tua attività, rivolti alle persone della tua zona. Il costo dipende dalla campagna: lo concordiamo con te durante la chiamata.',
      cta: 'Chiedici della pubblicità',
    },
    demo: {
      cta: 'Prova la demo dal vivo',
      note: 'Il sito di uno studio dentistico immaginario, con l’assistente già dentro. Fagli una domanda o prenota un appuntamento di prova: non viene fissato niente di reale.',
    },
    footer: { pages: 'Pagine', more: 'Altro', showcase: 'Showcase', contact: 'Contatti', services: 'Cosa facciamo', adsLink: 'Pubblicità online', film: 'Il logo Twinbyte che ruota lentamente.' },
    menu: 'Menu',
    menuDemo: 'Demo dal vivo',
  },
}
