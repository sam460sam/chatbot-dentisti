import type { Lang } from './types'

/*
 * Copy that only the new layout needs: the hero line above the title, the
 * online-ads card, and the footer headings. Everything else on the home page
 * reuses the booking copy (src/i18n/booking.ts), so no promise is written
 * twice. The ads card names no price on purpose: it is agreed in the call.
 */
export interface HomeCopy {
  hero: { eyebrow: string; video: string }
  ads: { tag: string; title: string; body: string; cta: string }
  footer: { pages: string; contact: string; services: string; adsLink: string; film: string }
  menu: string
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
      cta: 'Ask about it in the call',
    },
    footer: { pages: 'Pages', contact: 'Contact', services: 'What we do', adsLink: 'Online ads', film: 'The Twinbyte mark, turning slowly.' },
    menu: 'Menu',
  },
  nl: {
    hero: {
      eyebrow: 'Websites · Digitale assistent · Online advertenties',
      video: 'Een buurtbakkerij ’s avonds, gesloten, met een telefoon die oplicht op de toonbank.',
    },
    ads: {
      tag: 'Online advertenties',
      title: 'Gezien door de mensen om u heen',
      body: 'Wij maken en beheren advertenties op Instagram en Facebook voor uw bedrijf, gericht op mensen in uw omgeving. De kosten hangen af van de campagne: die spreken we met u af in het gesprek.',
      cta: 'Vraag ernaar in het gesprek',
    },
    footer: { pages: 'Pagina’s', contact: 'Contact', services: 'Wat we doen', adsLink: 'Online advertenties', film: 'Het Twinbyte-logo, dat langzaam draait.' },
    menu: 'Menu',
  },
  it: {
    hero: {
      eyebrow: 'Siti web · Assistente digitale · Annunci online',
      video: 'Un forno di quartiere di sera, chiuso, con un telefono che si illumina sul bancone.',
    },
    ads: {
      tag: 'Annunci online',
      title: 'Visti da chi vive intorno a te',
      body: 'Creiamo e gestiamo annunci su Instagram e Facebook per la tua attività, rivolti alle persone della tua zona. Il costo dipende dalla campagna: lo concordiamo con te durante la chiamata.',
      cta: 'Chiedicelo nella chiamata',
    },
    footer: { pages: 'Pagine', contact: 'Contatti', services: 'Cosa facciamo', adsLink: 'Annunci online', film: 'Il logo Twinbyte che ruota lentamente.' },
    menu: 'Menu',
  },
}
