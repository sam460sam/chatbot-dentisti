import { Link, pathFor, useRoute } from '../router'
import { booking } from '../i18n/booking'
import { Arrow } from './marks'
import {
  AssemblySection, BenefitsSection, DayStripSection, HowSection, PricesAndFaq,
  SecuritySection, ServicesSplit, WebsitesSection,
} from './Sections'
import type { Translation } from '../i18n'

/*
 * The pages behind the booking page. They are the old home page, taken apart
 * by subject, and each one ends the same way: back to the call.
 */

function PageTitle({ title, lead, ink }: { title: string; lead: string; ink: 'teal' | 'verm' | 'ink' }) {
  const rule = ink === 'teal' ? 'border-teal' : ink === 'verm' ? 'border-verm' : 'border-ink'
  return (
    <section className="band-paper pb-6 pt-10 sm:pt-11">
      <div className="container-page">
        <div className={`border-t-2 pt-2 ${rule}`}>
          <h1 className="t-display max-w-[18ch]">{title}</h1>
        </div>
        <p className="t-lead mt-3 max-w-lead">{lead}</p>
      </div>
    </section>
  )
}

function BookBand() {
  const { lang } = useRoute()
  const c = booking[lang]
  return (
    <section className="band-ink">
      <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-h3 font-extrabold text-paper sm:text-h2">{c.page.book}</h2>
          <p className="mt-2 max-w-lead text-body text-paper-dim">{c.page.bookLead}</p>
        </div>
        <Link className="btn-teal-bright shrink-0" to={`${pathFor(lang, 'home')}#book`}>
          {c.nav.book}
          <Arrow />
        </Link>
      </div>
    </section>
  )
}

export function AssistantPage({ t }: { t: Translation }) {
  return (
    <main id="main">
      <PageTitle title={t.split.assistant.title} lead={t.split.assistant.body} ink="teal" />
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
      <AssemblySection t={t} />
      <WebsitesSection t={t} />
      <ServicesSplit t={t} />
      <BookBand />
    </main>
  )
}

export function PricesPage({ t }: { t: Translation }) {
  return (
    <main id="main">
      <div className="pt-7" />
      <PricesAndFaq t={t} />
      <BookBand />
    </main>
  )
}
