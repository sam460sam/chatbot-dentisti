import { DayStrip } from './DayStrip'
import { Diary } from './Diary'
import { Pricing } from './Pricing'
import { Handover } from './Handover'
import { SiteWireframe } from './SiteWireframe'
import { Mark, Arrow, ArrowOut, Mail } from './marks'
import { mailLink, waLink } from '../site'
import { useRoute } from '../router'
import { booking } from '../i18n/booking'
import type { Translation } from '../i18n'

/*
 * TWO INKS.
 *
 * Teal is the assistant, terracotta is the websites, and there is no third
 * accent. A visitor who came for one half of the business follows its ink down
 * the page. That is the whole navigation system, and it is why the fork below
 * is two grounds touching edge to edge rather than two matching cards.
 *
 * No folio numbers: the old one-page sequence they counted is now split over pages.
 * FAQ and contact are not steps in a process, so they are not numbered.
 */

function Band({
  id,
  tone,
  folio,
  ink,
  title,
  lead,
  children,
}: {
  id: string
  tone: 'paper' | 'deep' | 'ink'
  folio?: string
  ink?: 'teal' | 'verm'
  title: string
  lead?: string
  children: React.ReactNode
}) {
  const ground = tone === 'ink' ? 'band-ink' : tone === 'deep' ? 'band-deep' : 'band-paper'
  const rule = ink === 'verm' ? 'border-verm' : ink === 'teal' ? 'border-teal' : 'border-ink'

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={ground}>
      <div className="container-page">
        <div className={`flex items-baseline gap-2 border-t-2 pt-2 ${rule}`}>
          {folio && <span className="t-folio tabular-nums">{folio}</span>}
          <h2 id={`${id}-title`} className="t-h2">
            {title}
          </h2>
        </div>
        {lead && <p className="t-lead mt-2">{lead}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </section>
  )
}


export function DayStripSection({ t }: { t: Translation }) {
  return (
    <>
      {/* The signature object: the hours this business is not there to answer,
          and the appointment that landed while nobody was in the shop. */}
      <section className="band-deep" aria-labelledby="daystrip-title">
        <div className="container-page">
          <p className="t-label">{t.dayStrip.eyebrow}</p>
          <h2 id="daystrip-title" className="t-h2 mt-2 max-w-none break-words">
            {t.dayStrip.title}
          </h2>

          <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-6">
            <div>
              <DayStrip t={t} />
              <p className="t-body mt-3 max-w-lead">{t.dayStrip.caption}</p>
            </div>

            <Diary t={t} />
          </div>
        </div>
      </section>
    </>
  )
}

export function HowSection({ t }: { t: Translation }) {
  return (
    <>
      {/* ------------------------------------------------ 01 how it works */}
      <Band id="how" tone="paper" ink="teal" title={t.how.title} lead={t.how.lead}>
        <ol role="list" className="grid gap-3 md:grid-cols-3">
          {t.how.steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-teal pt-2">
              <span className="t-folio tabular-nums text-teal">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="t-h3 mt-1">{step.title}</h3>
              <p className="t-body mt-1 text-small">{step.body}</p>
            </li>
          ))}
        </ol>
      </Band>
    </>
  )
}

export function SecuritySection({ t }: { t: Translation }) {
  return (
    <>
      {/* ------------------------------------- where it stops — the ink plate */}
      <section id="security" aria-labelledby="security-title" className="band-ink">
        <div className="container-page">
          <Handover t={t} />

          <div className="mt-8 rule-ink pt-4">
            <h3 className="t-h2">{t.security.title}</h3>
            <p className="t-lead mt-2">{t.security.lead}</p>

            <ul role="list" className="mt-4 grid gap-0 sm:grid-cols-3 sm:gap-3">
              {t.security.items.map((item) => (
                <li key={item.title} className="border-t border-ink-edge py-2 sm:py-0 sm:pt-2">
                  <h4 className="font-display text-h4 font-bold text-paper">{item.title}</h4>
                  <p className="mt-1 text-small text-paper-dim">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export function BenefitsSection({ t }: { t: Translation }) {
  return (
    <>
      {/* ---------------------------------------------- 03 what you get */}
      <Band
        id="benefits"
        tone="deep"
        ink="teal"
        title={t.benefits.title}
        lead={t.benefits.lead}
      >
        <ul role="list" className="grid gap-3 md:grid-cols-3">
          {t.benefits.items.map((item) => (
            <li key={item.title} className="border-t border-paper-edge-deep pt-2">
              <h3 className="t-h3">{item.title}</h3>
              <p className="t-body mt-1 text-small">{item.body}</p>
            </li>
          ))}
        </ul>
      </Band>
    </>
  )
}

/* `bare`: on the websites page the page title already says the title and
   lead, so only the substance is shown. */
export function WebsitesSection({ t, bare }: { t: Translation; bare?: boolean }) {
  const { lang } = useRoute()
  /* bare, on /websites, it follows the page's h1 directly: its headings move
     up a level so none is skipped */
  const H = bare ? 'h2' : 'h3'
  const body = (
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6">
          <div>
            <H className="t-h3">{t.websites.includesTitle}</H>
            <ul role="list" className="mt-2">
              {t.websites.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1 border-b border-paper-edge py-1 text-small text-ink-soft last:border-0"
                >
                  <Mark tone="verm" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <H className="t-h3 mt-4">{t.websites.whoTitle}</H>
            <p className="t-body mt-1 text-small">{t.websites.who}</p>
          </div>

          {/* The websites column sits 48px lower, so the spread reads as typeset
              rather than as two matched columns. */}
          <div className="lg:pt-6">
            {/* On /websites (bare) the next section shows the demo site on a
                laptop and a phone, so a drawn wireframe here would only
                repeat it less well. */}
            {!bare && <SiteWireframe t={t} />}

            <p className={`t-body text-small ${bare ? '' : 'mt-3'}`}>{t.websites.quoteNote}</p>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap">
              <a className="btn-verm" href={waLink(t.wa.websitesQuote)} rel="noopener">
                {t.websites.cta}
                <Arrow />
              </a>
              <a className="btn-line" href={lang === 'en' ? '/showcase/' : `/showcase/${lang}/`}>
                {t.websites.showcase}
                <ArrowOut />
              </a>
              <a className="btn-line" href={mailLink(booking[lang].mail.websitesSubject)}>
                <Mail />
                {t.contact.email}
              </a>
            </div>
          </div>
        </div>
  )
  if (bare)
    return (
      <section id="websites" aria-label={t.websites.title} className="band-paper">
        <div className="container-page">{body}</div>
      </section>
    )
  return (
    <Band id="websites" tone="paper" ink="verm" title={t.websites.title} lead={t.websites.lead}>
      {body}
    </Band>
  )
}

export function PricesAndFaq({ t, head = true }: { t: Translation; head?: boolean }) {
  return (
    <>
      <Pricing t={t} head={head} />
      <FaqSection t={t} />
    </>
  )
}

/* The word "WhatsApp" in the FAQ lead becomes the link it talks about. The
   copy is split on the word rather than marked up, so a translation that
   drops it simply renders as plain text. */
function FaqLead({ t }: { t: Translation }) {
  const [before, ...after] = t.faq.lead.split('WhatsApp')
  if (!after.length) return <p className="t-lead mt-2">{t.faq.lead}</p>
  return (
    <p className="t-lead mt-2">
      {before}
      <a
        className="font-semibold text-ink underline decoration-ink-mute underline-offset-4 hover:decoration-ink"
        href={waLink(t.wa.generic)}
        rel="noopener"
      >
        WhatsApp
      </a>
      {after.join('WhatsApp')}
    </p>
  )
}

/* The FAQ. On /prices it lists every item; `only` repeats the short set
   tagged for the home page or /assistant (`show` in the copy), in the same
   order, so each page answers its own visitor's worries without a second list
   to keep in step. */
export function FaqSection({ t, only }: { t: Translation; only?: 'home' | 'assistant' }) {
  const items = only ? t.faq.items.filter((item) => item.show?.includes(only)) : t.faq.items
  return (
    <section id="faq" aria-labelledby="faq-title" className="band-deep">
      <div className="container-page">
        <div className="border-t-2 border-ink pt-2">
          <h2 id="faq-title" className="t-h2">
            {t.faq.title}
          </h2>
        </div>
        <FaqLead t={t} />

        <div className="mt-5 max-w-measure">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-paper-edge-deep first:border-t">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-2 py-2 font-display text-h4 font-bold text-ink marker:content-none">
                {item.q}
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-h4 font-normal text-ink-mute transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="t-body pb-2 text-small">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
