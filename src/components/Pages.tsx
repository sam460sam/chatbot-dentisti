import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { SITE, waLink } from '../site'
import { keepTogether } from './BookingPage'
import { Arrow, Bubble } from './marks'
import {
  BenefitsSection, DayStripSection, HowSection, PricesAndFaq,
  SecuritySection, WebsitesSection,
} from './Sections'
import { Picture, type PictureName } from './Picture'
import { DeviceScroll } from './DeviceScroll'
import type { Translation } from '../i18n'

/*
 * The pages behind the booking page. They are the old home page, taken apart
 * by subject, and each one ends the same way: back to the call.
 */

function PageTitle({ title, lead, pic, eyebrow, children }: {
  title: string; lead: string; pic?: PictureName; eyebrow?: string; children?: React.ReactNode
}) {
  return (
    <section className={`page-head on-ink ${pic ? 'parallax' : 'page-head-plain'}`}>
      {pic && (
        <div className="hero-media" aria-hidden="true">
          <Picture name={pic} sizes="100vw" eager className="hero-img" />
          <div className="hero-shade" />
        </div>
      )}
      <div className="hero-copy container-page">
        {eyebrow && <p className="hero-eyebrow"><span aria-hidden="true" className="hero-dot" />{eyebrow}</p>}
        <h1 className="hero-title">{title}</h1>
        <p className="hero-lead">{lead}</p>
        {children}
      </div>
    </section>
  )
}

/* Every page ends on the call: a navy plate with the petrol ribbon behind
   it, WhatsApp next to it as on the home page. */
function BookBand() {
  const { lang } = useRoute()
  const c = booking[lang]
  return (
    <section className="band-paper">
      <div className="container-page">
        <div className="book-card book-card-dark p-3 sm:p-6" data-rise>
          <h2 className="max-w-[22ch] font-display text-h3 font-bold text-paper sm:text-h2">{keepTogether(c.page.book)}</h2>
          <p className="mt-2 max-w-lead text-body text-paper-dim">{c.page.bookLead}</p>
          <div className="mt-4 flex flex-col gap-1 sm:flex-row">
            <Link className="btn-mint" to={`${pathFor(lang, 'home')}#book`}>
              {c.nav.book}
              <Arrow />
            </Link>
            <a className="btn-ghost" href={waLink(c.hero.waText)} rel="noopener">
              <Bubble size={16} />
              {c.hero.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AssistantPage({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const demo = home[lang].demo
  return (
    <main id="main">
      <PageTitle title={t.split.assistant.title} lead={t.split.assistant.body} pic="assistant" eyebrow={booking[lang].nav.assistant}>
        {/* one child, so it rises in fourth with the head */}
        <div className="mt-4">
          {/* the demo practice: the assistant as a customer meets it, on a
              client's website (public/demo), in this tab */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <a className="btn-mint shrink-0" href={SITE.demo[lang]}>
              {demo.cta}
              <Arrow />
            </a>
            <p className="max-w-[46ch] text-small text-paper-dim">{demo.note}</p>
          </div>
          {/* the one page that loads the live assistant says so */}
          {SITE.widget.enabled && (
            <p className="mt-3 flex items-start gap-1 text-body font-semibold text-teal-bright">
              <Bubble size={16} className="mt-[5px] shrink-0" />
              {t.demo.tryHere}
            </p>
          )}
        </div>
      </PageTitle>
      <DayStripSection t={t} />
      <HowSection t={t} />
      <SecuritySection t={t} />
      <BenefitsSection t={t} />
      <BookBand />
    </main>
  )
}

export function WebsitesPage({ t }: { t: Translation }) {
  const { lang } = useRoute()
  return (
    <main id="main">
      <PageTitle title={t.websites.title} lead={t.websites.lead} pic="websites" eyebrow={booking[lang].nav.websites} />
      <WebsitesSection t={t} bare />
      <DeviceScroll t={t} />
      <OtherHalf t={t} />
      <BookBand />
    </main>
  )
}

export function PricesPage({ t }: { t: Translation }) {
  const { lang } = useRoute()
  return (
    <main id="main">
      <PageTitle title={t.pricing.title} lead={t.pricing.lead} eyebrow={booking[lang].nav.prices} />
      <PricesAndFaq t={t} head={false} />
      <BookBand />
    </main>
  )
}

/* The websites page points at the other half of the business, once. */
function OtherHalf({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const a = t.split.assistant
  return (
    <section className="band-deep">
      <div className="container-page">
        <Link to={pathFor(lang, 'assistant')} className="cut-line cut-lg group grid gap-3 p-3 [--cut-fill:#F4EFE6] [--cut-ink:#CBC1AE] hover:[--cut-fill:#FFFFFF] sm:p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center" data-rise>
          <div className="service-media">
            <Picture name="assistant" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
          <div>
          <p className="t-label flex items-center gap-1 text-teal">
            <Bubble size={16} />
            {a.tag}
          </p>
          <h2 className="mt-2 max-w-[24ch] font-display text-h3 font-bold text-ink">{a.title}</h2>
          <p className="mt-1 max-w-lead text-small text-ink-soft">{a.body}</p>
          <span className="mt-3 inline-flex items-center gap-0.5 text-small font-semibold text-ink group-hover:underline">
            {a.cta}
            <Arrow />
          </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
