import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { SITE, waLink } from '../site'
import { Arrow, Bubble } from './marks'
import {
  AssemblySection, BenefitsSection, DayStripSection, HowSection, PricesAndFaq,
  SecuritySection, WebsitesSection,
} from './Sections'
import type { Translation } from '../i18n'

/*
 * The pages behind the booking page. They are the old home page, taken apart
 * by subject, and each one ends the same way: back to the call.
 */

function PageTitle({ title, lead, ink, children }: { title: string; lead: string; ink: 'teal' | 'verm' | 'ink'; children?: React.ReactNode }) {
  const rule = ink === 'teal' ? 'border-teal' : ink === 'verm' ? 'border-verm' : 'border-ink'
  return (
    <section className="band-paper pb-6 pt-8 sm:pb-6 sm:pt-10 lg:pb-6">
      <div className="container-page">
        <div className={`border-t-2 pt-2 ${rule}`}>
          <h1 className="t-display max-w-[18ch]">{title}</h1>
        </div>
        <p className="t-lead mt-3 max-w-lead">{lead}</p>
        {children}
      </div>
    </section>
  )
}

/* Every page ends on the call: a plate on paper, so it does not melt into
   the footer, with WhatsApp next to it as on the home page. */
function BookBand() {
  const { lang } = useRoute()
  const c = booking[lang]
  return (
    <section className="band-paper">
      <div className="container-page">
        <div className="on-ink border border-ink bg-ink p-3 plate-teal sm:p-5">
          <h2 className="max-w-[22ch] font-display text-h3 font-extrabold text-paper sm:text-h2">{c.page.book}</h2>
          <p className="mt-2 max-w-lead text-body text-paper-dim">{c.page.bookLead}</p>
          <div className="mt-4 flex flex-col gap-1 sm:flex-row">
            <Link className="btn-teal-bright" to={`${pathFor(lang, 'home')}#book`}>
              {c.nav.book}
              <Arrow />
            </Link>
            <a className="btn-line-flood" href={waLink(c.hero.waText)} rel="noopener">
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
  return (
    <main id="main">
      <PageTitle title={t.split.assistant.title} lead={t.split.assistant.body} ink="teal">
        {/* the one page that loads the live assistant says so */}
        {SITE.widget.enabled && (
          <p className="mt-3 flex items-center gap-1 text-body font-semibold text-teal">
            <Bubble size={16} />
            {t.demo.tryHere}
          </p>
        )}
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
  return (
    <main id="main">
      <PageTitle title={t.websites.title} lead={t.websites.lead} ink="verm" />
      <WebsitesSection t={t} bare />
      <AssemblySection t={t} />
      <OtherHalf t={t} />
      <BookBand />
    </main>
  )
}

export function PricesPage({ t }: { t: Translation }) {
  return (
    <main id="main">
      <PageTitle title={t.pricing.title} lead={t.pricing.lead} ink="ink" />
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
        <Link to={pathFor(lang, 'assistant')} className="group block border-t-2 border-teal bg-paper p-3 transition-colors hover:bg-white sm:p-4">
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
        </Link>
      </div>
    </section>
  )
}
