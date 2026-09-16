import type { ReactNode } from 'react'
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  Code2,
  Clock,
  FileText,
  Languages,
  Mail,
  MessageCircle,
  Minus,
  PhoneCall,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Hero } from './Hero'
import { SiteMockup } from './SiteMockup'
import { Reveal, spotlight } from './motion'
import { SITE, mailLink, waLink } from '../site'
import type { Translation } from '../i18n'

function Section({
  id,
  kicker,
  title,
  lead,
  children,
  tone = 'light',
}: {
  id: string
  kicker: string
  title: string
  lead?: string
  children: ReactNode
  tone?: 'light' | 'tint' | 'dark'
}) {
  const skin =
    tone === 'dark'
      ? 'on-dark dark-ground text-white'
      : tone === 'tint'
        ? 'bg-surface-sunken'
        : 'bg-surface'

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section relative ${skin}`}>
      <div className="container-page relative">
        <Reveal>
          <p className={`section-kicker ${tone === 'dark' ? 'text-accent-bright' : ''}`}>{kicker}</p>
          <h2 id={`${id}-title`} className="section-title">
            {title}
          </h2>
          {lead && (
            <p className={`section-lead ${tone === 'dark' ? 'text-white/60' : ''}`}>{lead}</p>
          )}
        </Reveal>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  )
}


/** A full-width illustration with the headline set over it. */
function Scene({
  image,
  content,
  align = 'left',
}: {
  image: string
  content: Translation['scenes']['calendar']
  align?: 'left' | 'right'
}) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-sunken">
      <img
        src={image}
        alt=""
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          align === 'right'
            ? 'bg-gradient-to-l from-surface-sunken/95 via-surface-sunken/70 to-transparent'
            : 'bg-gradient-to-r from-surface-sunken/95 via-surface-sunken/70 to-transparent'
        }`}
      />

      <div className="container-page relative py-24 sm:py-32 lg:py-40">
        <div className={`max-w-xl ${align === 'right' ? 'ml-auto text-right' : ''}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-bright">
            {content.eyebrow}
          </p>
          <h2 className="mt-5 text-[30px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[42px] lg:text-[52px]">
            {content.lead}{' '}
            <span className="serif text-accent-bright">{content.accent}</span>
            {content.tail ? ` ${content.tail}` : ''}
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
            {content.body}
          </p>
        </div>
      </div>
    </section>
  )
}

const HOW_ICONS = [Settings2, Code2, CalendarCheck]
const BENEFIT_ICONS = [PhoneCall, Clock, Languages]
const SECURITY_ICONS = [ShieldCheck, Bot, FileText]

export function Home({ t }: { t: Translation }) {
  return (
    <main id="main">
      <Hero t={t} />

      {/* Two services, two routes */}
      <section id="services" aria-labelledby="services-title" className="section bg-surface">
        <div className="container-page">
          <p className="section-kicker">Twinbyte</p>
          <h2 id="services-title" className="section-title">
            {t.split.title}
          </h2>
          <p className="section-lead">{t.split.lead}</p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { ...t.split.assistant, id: 'how', icon: MessageCircle, wa: t.wa.assistantQuote },
              { ...t.split.websites, id: 'websites', icon: Sparkles, wa: t.wa.websitesQuote },
            ].map((service) => (
              <div key={service.tag} className="card flex h-full flex-col" onMouseMove={spotlight}>
                <div className="relative flex items-center gap-3">
                  <span className="icon-badge">
                    <service.icon size={21} aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-bright">
                    {service.tag}
                  </span>
                </div>

                <h3 className="relative mt-6 text-2xl font-bold tracking-tight">{service.title}</h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {service.body}
                </p>

                <ul className="relative mt-6 grid gap-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-accent-bright"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <a className="btn-primary" href={waLink(service.wa)} rel="noopener">
                    {service.quote}
                  </a>
                  <a className="btn-ghost" href={`#${service.id}`}>
                    {service.cta}
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* How it works */}
      <Section id="how" kicker="01" title={t.how.title} lead={t.how.lead}>
        <ol className="grid gap-6 md:grid-cols-3">
          {t.how.steps.map((step, index) => {
            const Icon = HOW_ICONS[index]
            return (
              <Reveal key={step.title} delay={index * 110}>
                <li className="card group h-full" onMouseMove={spotlight}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -top-7 text-[120px] font-extrabold leading-none text-white/[0.06] transition-colors group-hover:text-accent-bright/15"
                  >
                    {index + 1}
                  </span>
                  <span className="icon-badge">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-6 text-lg font-bold tracking-tight">{step.title}</h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </Section>

      <Scene image="/scene-calendar.jpg" content={t.scenes.calendar} align="right" />

      {/* Benefits */}
      <Section id="benefits" kicker="02" title={t.benefits.title} lead={t.benefits.lead}>
        <ul className="grid gap-6 md:grid-cols-3">
          {t.benefits.items.map((item, index) => {
            const Icon = BENEFIT_ICONS[index]
            return (
              <Reveal key={item.title} delay={index * 90}>
                <li className="card h-full" onMouseMove={spotlight}>
                  <span className="icon-badge">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </Section>

      <Scene image="/scene-handover.jpg" content={t.scenes.handover} />

      {/* Privacy & safety — dark band */}
      <Section id="security" kicker="03" title={t.security.title} lead={t.security.lead} tone="dark">
        <ul className="grid gap-6 md:grid-cols-3">
          {t.security.items.map((item, index) => {
            const Icon = SECURITY_ICONS[index]
            return (
              <Reveal key={item.title} delay={index * 110}>
                <li className="card-dark h-full">
                  <span className="icon-badge-dark">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/60">{item.body}</p>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </Section>

      {/* Websites for small businesses */}
      <Section id="websites" kicker="04" title={t.websites.title} lead={t.websites.lead}>
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{t.websites.includesTitle}</h3>
            <ul className="mt-5 grid gap-3">
              {t.websites.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-white/10 pb-3 text-[15px] text-ink-soft last:border-0"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-accent-bright" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-lg font-bold tracking-tight">{t.websites.whoTitle}</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">{t.websites.who}</p>
          </div>

          <div className="space-y-6">
            <SiteMockup t={t} />
            <div className="card" onMouseMove={spotlight}>
              <p className="relative text-[15px] leading-relaxed text-ink-soft">
                {t.websites.quoteNote}
              </p>
              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <a className="btn-primary" href={waLink(t.wa.websitesQuote)} rel="noopener">
                  {t.websites.cta}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="btn-ghost" href={mailLink(t.contact.emailSubject)}>
                  <Mail size={17} aria-hidden="true" />
                  {t.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" kicker="05" title={t.faq.title} lead={t.faq.lead} tone="tint">
        <div className="max-w-3xl">
          <div>
            {t.faq.items.map((item, index) => (
            <Reveal key={item.q} delay={index * 60}>
              <details className="group border-b border-white/10 py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-semibold tracking-tight transition-colors hover:text-accent-bright marker:content-none">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/20 text-accent-bright transition-colors group-open:border-accent group-open:bg-accent group-open:text-white"
                  >
                    <Plus size={14} className="group-open:hidden" />
                    <Minus size={14} className="hidden group-open:block" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            </Reveal>
            ))}
          </div>

        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" kicker="06" title={t.contact.title} lead={t.contact.lead}>
        <Reveal>
          <div className="on-dark relative overflow-hidden rounded-3xl bg-night p-8 text-white shadow-float sm:p-12">

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="max-w-lg text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                  {t.contact.note}
                </p>
                <p className="mt-4 text-[15px] text-white/50">{t.demo.tryHere}</p>
                <p className="mt-6 text-[15px] text-white/55">{t.contact.regions}</p>
                <p className="mt-3 text-sm text-white/40">
                  {SITE.email} · WhatsApp {SITE.whatsappDisplay}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a className="btn-primary" href={waLink(t.wa.generic)} rel="noopener">
                  <MessageCircle size={18} aria-hidden="true" />
                  {t.contact.whatsapp}
                </a>
                <a className="btn-ghost-dark" href={mailLink(t.contact.emailSubject)}>
                  <Mail size={18} aria-hidden="true" />
                  {t.contact.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

      </Section>
    </main>
  )
}
