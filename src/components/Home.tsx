import { Hero } from './Hero'
import { Assembly } from './Assembly'
import { DayStrip } from './DayStrip'
import { Diary } from './Diary'
import { Pricing } from './Pricing'
import { Handover } from './Handover'
import { SiteWireframe } from './SiteWireframe'
import { Mark, Bubble, Window, Arrow, ArrowOut, Mail, Person } from './marks'
import { SITE, mailLink, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

/*
 * TWO INKS.
 *
 * Teal is the assistant, terracotta is the websites, and there is no third
 * accent. A visitor who came for one half of the business follows its ink down
 * the page. That is the whole navigation system, and it is why the fork below
 * is two grounds touching edge to edge rather than two matching cards.
 *
 * The folio numbers only run over the four sections that are a real sequence.
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

export function Home({ t }: { t: Translation }) {
  const { lang } = useRoute()
  return (
    <main id="main">
      <Hero t={t} />

      {/* The object pulled apart and put together by the scrollbar. */}
      <Assembly t={t} />

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

      {/* ---------------------------------------------------- the fork
          Two grounds touching with no gap and no rule between them. This is the
          one place on the page where a second flood is earned: it says "two
          businesses, equal weight" more plainly than any headline could. */}
      <section id="services" aria-labelledby="services-title" className="grid md:grid-cols-2">
        <h2 id="services-title" className="sr-only">
          {t.split.title}
        </h2>

        {/* The assistant */}
        <div className="on-flood bg-teal px-2 py-8 sm:px-3 lg:px-5">
          <div className="ml-auto max-w-[37rem] md:pr-3">
            <p className="t-label flex items-center gap-1">
              <Bubble size={16} />
              {t.split.assistant.tag}
            </p>
            <h3 className="t-h3 mt-2 max-w-title">{t.split.assistant.title}</h3>
            <p className="t-body mt-2">{t.split.assistant.body}</p>
            <ul role="list" className="mt-3 grid gap-1">
              {t.split.assistant.points.map((point) => (
                <li key={point} className="flex items-start gap-1 text-small text-paper">
                  <Mark tone="paper" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1 sm:flex-row">
              <a className="btn bg-paper text-teal hover:bg-paper-deep" href={waLink(t.wa.assistantQuote)} rel="noopener">
                {t.split.assistant.quote}
              </a>
              <a className="btn-line-flood" href="#how">
                {t.split.assistant.cta}
                <Arrow />
              </a>
            </div>
          </div>
        </div>

        {/* The websites */}
        <div className="on-flood bg-verm px-2 py-8 sm:px-3 lg:px-5">
          <div className="max-w-[37rem] md:pl-3">
            <p className="t-label flex items-center gap-1">
              <Window size={16} />
              {t.split.websites.tag}
            </p>
            <h3 className="t-h3 mt-2 max-w-title">{t.split.websites.title}</h3>
            <p className="t-body mt-2">{t.split.websites.body}</p>
            <ul role="list" className="mt-3 grid gap-1">
              {t.split.websites.points.map((point) => (
                <li key={point} className="flex items-start gap-1 text-small text-paper">
                  <Mark tone="paper" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1 sm:flex-row">
              <a className="btn bg-paper text-verm hover:bg-paper-deep" href={waLink(t.wa.websitesQuote)} rel="noopener">
                {t.split.websites.quote}
              </a>
              <a className="btn-line-flood" href="#websites">
                {t.split.websites.cta}
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 01 how it works */}
      <Band id="how" tone="paper" folio="No. 01" ink="teal" title={t.how.title} lead={t.how.lead}>
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

      {/* ------------------------------------- where it stops — the ink plate */}
      <section id="security" aria-labelledby="security-title" className="band-ink">
        <div className="container-page">
          <Handover t={t} />

          <div className="mt-8 rule-ink pt-4">
            <p className="t-folio">No. 02</p>
            <h3 className="t-h2 mt-1">{t.security.title}</h3>
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

      {/* ---------------------------------------------- 03 what you get */}
      <Band
        id="benefits"
        tone="deep"
        folio="No. 03"
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

      {/* ------------------------------------------------- 04 websites */}
      <Band
        id="websites"
        tone="paper"
        folio="No. 04"
        ink="verm"
        title={t.websites.title}
        lead={t.websites.lead}
      >
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_1fr] lg:gap-6">
          <div>
            <h3 className="t-h3">{t.websites.includesTitle}</h3>
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

            <h3 className="t-h3 mt-4">{t.websites.whoTitle}</h3>
            <p className="t-body mt-1 text-small">{t.websites.who}</p>
          </div>

          {/* The websites column sits 48px lower, so the spread reads as typeset
              rather than as two matched columns. */}
          <div className="lg:pt-6">
            <SiteWireframe t={t} />

            <p className="t-body mt-3 text-small">{t.websites.quoteNote}</p>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap">
              <a className="btn-verm" href={waLink(t.wa.websitesQuote)} rel="noopener">
                {t.websites.cta}
                <Arrow />
              </a>
              <a className="btn-line" href={lang === 'en' ? '/showcase/' : `/showcase/${lang}/`}>
                {t.websites.showcase}
                <ArrowOut />
              </a>
              <a className="btn-line" href={mailLink(t.contact.emailSubject)}>
                <Mail />
                {t.contact.email}
              </a>
            </div>
          </div>
        </div>
      </Band>

      {/* ----------------------------------------------------------- FAQ */}
      <Pricing t={t} />

      <section id="faq" aria-labelledby="faq-title" className="band-deep">
        <div className="container-page">
          <div className="border-t-2 border-ink pt-2">
            <h2 id="faq-title" className="t-h2">
              {t.faq.title}
            </h2>
          </div>
          <p className="t-lead mt-2">{t.faq.lead}</p>

          <div className="mt-5 max-w-measure">
            {t.faq.items.map((item) => (
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

      {/* ----------------------------------------- the two people, and contact */}
      <section id="contact" aria-labelledby="contact-title" className="band-ink">
        <div className="container-page">
          <p className="t-folio flex items-center gap-1">
            <Person size={16} />
            {t.contact.title}
          </p>

          <h2 id="contact-title" className="mt-2 font-display text-h2 font-extrabold text-paper sm:text-h1">
            Anna &amp; Samuele
          </h2>

          <p className="mt-3 max-w-lead text-lead text-paper">{t.contact.note}</p>

          <div className="mt-6 grid gap-4 rule-ink pt-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="max-w-measure text-body text-paper-dim">{t.contact.regions}</p>
              <p className="mt-2 text-small text-paper-dim">{t.demo.tryHere}</p>

              <ul role="list" className="mt-3 grid gap-0.5">
                <li>
                  <a className="text-body text-paper underline underline-offset-4 hover:text-teal-bright" href={mailLink(t.contact.emailSubject)}>
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a className="text-body text-paper underline underline-offset-4 hover:text-teal-bright" href={waLink(t.wa.generic)} rel="noopener">
                    WhatsApp {SITE.whatsappDisplay}
                  </a>
                </li>
              </ul>
            </div>

            {/* One button per half of the business, in its own ink. */}
            <div className="flex flex-col gap-1 sm:flex-row lg:flex-col">
              <a className="btn bg-teal text-paper hover:bg-teal-deep" href={waLink(t.wa.assistantQuote)} rel="noopener">
                <Bubble size={16} />
                {t.split.assistant.quote}
              </a>
              <a className="btn bg-verm text-paper hover:bg-verm-deep" href={waLink(t.wa.websitesQuote)} rel="noopener">
                <Window size={16} />
                {t.split.websites.quote}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
