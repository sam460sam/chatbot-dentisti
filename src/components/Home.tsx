import type { ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  Clock,
  Code2,
  FileText,
  Languages,
  Mail,
  MessageCircle,
  Minus,
  PhoneCall,
  Plus,
  Settings2,
  ShieldCheck,
  Siren,
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
        ? 'bg-[#f6f8f9]'
        : 'bg-white'

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

const HOW_ICONS = [Settings2, Code2, CalendarCheck]
const BENEFIT_ICONS = [PhoneCall, Clock, Languages, Siren]
const SECURITY_ICONS = [ShieldCheck, Bot, FileText]

export function Home({ t }: { t: Translation }) {
  return (
    <main id="main">
      <Hero t={t} />

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
                    className="pointer-events-none absolute -right-3 -top-7 text-[120px] font-extrabold leading-none text-ink/[0.06] transition-colors group-hover:text-accent/15"
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

      {/* Benefits */}
      <Section id="benefits" kicker="02" title={t.benefits.title} lead={t.benefits.lead} tone="tint">
        <ul className="grid gap-6 sm:grid-cols-2">
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
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ul className="grid gap-4 sm:grid-cols-2">
              {t.websites.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-4 text-[15px] text-ink-soft"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <SiteMockup t={t} />
              <a className="btn-primary w-full sm:w-auto" href={waLink(t.wa.websites)} rel="noopener">
                {t.websites.cta}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Free trial */}
      <Section id="trial" kicker="05" title={t.trial.title} lead={t.trial.lead} tone="tint">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <ol className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-accent before:via-accent/40 before:to-transparent">
            {t.trial.steps.map((step, index) => (
              <Reveal key={step} delay={index * 90}>
                <li className="relative flex gap-5">
                  <span
                    aria-hidden="true"
                    className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-bold text-white ring-4 ring-[#f6f8f9]"
                  >
                    {index + 1}
                  </span>
                  <p className="pt-1 text-[16px] leading-relaxed text-ink-soft">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={160}>
            <div className="on-dark relative overflow-hidden rounded-2xl bg-night p-8 text-white shadow-float">
              <div className="relative">
                <span className="icon-badge-dark">
                  <MessageCircle size={21} aria-hidden="true" />
                </span>
                {/* PRICE_TODO: insert the monthly subscription price here once it is decided. */}
                <p className="mt-6 text-[15px] leading-relaxed text-white/70">{t.trial.note}</p>
                <a className="btn-primary mt-8 w-full" href={waLink(t.wa.trial)} rel="noopener">
                  {t.trial.cta}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <p className="mt-4 text-center text-[13px] text-white/40">{t.hero.note}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" kicker="06" title={t.faq.title} lead={t.faq.lead}>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            {t.faq.items.map((item, index) => (
            <Reveal key={item.q} delay={index * 60}>
              <details className="group border-b border-ink/10 py-5 first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-semibold tracking-tight transition-colors hover:text-accent-dark marker:content-none">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/15 text-accent transition-colors group-open:border-accent group-open:bg-accent group-open:text-white"
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

          <Reveal delay={120}>
            <aside className="card sticky top-28" onMouseMove={spotlight}>
              <span className="icon-badge">
                <MessageCircle size={21} aria-hidden="true" />
              </span>
              <p className="relative mt-6 text-[15px] leading-relaxed text-ink-soft">{t.faq.lead}</p>
              <a
                className="btn-primary relative mt-6 w-full"
                href={waLink(t.wa.generic)}
                rel="noopener"
              >
                {t.contact.whatsapp}
              </a>
            </aside>
          </Reveal>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" kicker="07" title={t.contact.title} lead={t.contact.lead} tone="tint">
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
