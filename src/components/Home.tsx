import type { ReactNode } from 'react'
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Check,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  Languages,
  Mail,
  MessageCircle,
  PhoneCall,
  Settings2,
  ShieldCheck,
  Siren,
} from 'lucide-react'
import { SITE, mailLink, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

function Section({
  id,
  title,
  lead,
  children,
  tone = 'white',
}: {
  id: string
  title: string
  lead?: string
  children: ReactNode
  tone?: 'white' | 'grey'
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 py-16 sm:py-20 ${tone === 'grey' ? 'bg-ink/[0.03]' : 'bg-white'}`}
    >
      <div className="container-page">
        <h2 id={`${id}-title`} className="section-title">
          {title}
        </h2>
        {lead && <p className="section-lead">{lead}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

const HOW_ICONS = [Settings2, Code2, CalendarCheck]
const BENEFIT_ICONS = [PhoneCall, Clock, Languages, Siren]
const SECURITY_ICONS = [ShieldCheck, Bot, FileText]

export function Home({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const demoUrl = SITE.demo[lang]

  return (
    <main id="main">
      {/* Hero */}
      <section className="border-b border-ink/10 bg-gradient-to-b from-accent-light/60 to-white">
        <div className="container-page py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-dark">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{t.hero.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href={waLink(t.wa.trial)} rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              {t.hero.ctaTrial}
            </a>
            <a className="btn-secondary" href={demoUrl} target="_blank" rel="noopener noreferrer">
              {t.hero.ctaDemo}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-4 text-sm text-ink-muted">{t.hero.note}</p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {t.hero.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <Section id="how" title={t.how.title} lead={t.how.lead}>
        <ol className="grid gap-6 md:grid-cols-3">
          {t.how.steps.map((step, i) => {
            const Icon = HOW_ICONS[i]
            return (
              <li key={step.title} className="card">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-light text-accent-dark">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-ink-muted">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            )
          })}
        </ol>
      </Section>

      {/* Benefits */}
      <Section id="benefits" title={t.benefits.title} lead={t.benefits.lead} tone="grey">
        <ul className="grid gap-6 sm:grid-cols-2">
          {t.benefits.items.map((item, i) => {
            const Icon = BENEFIT_ICONS[i]
            return (
              <li key={item.title} className="card">
                <Icon size={22} className="text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Privacy & safety */}
      <Section id="security" title={t.security.title} lead={t.security.lead}>
        <ul className="grid gap-6 md:grid-cols-3">
          {t.security.items.map((item, i) => {
            const Icon = SECURITY_ICONS[i]
            return (
              <li key={item.title} className="card">
                <Icon size={22} className="text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Websites for small businesses */}
      <Section id="websites" title={t.websites.title} lead={t.websites.lead} tone="grey">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.websites.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a className="btn-primary self-start" href={waLink(t.wa.websites)} rel="noopener">
            {t.websites.cta}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </Section>

      {/* Free trial */}
      <Section id="trial" title={t.trial.title} lead={t.trial.lead}>
        <ol className="space-y-4">
          {t.trial.steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-white"
              >
                {i + 1}
              </span>
              <p className="pt-1 text-base leading-relaxed text-ink-soft">{step}</p>
            </li>
          ))}
        </ol>

        {/* PRICE_TODO: insert the monthly subscription price here once it is decided. */}
        <p className="mt-8 max-w-2xl text-sm text-ink-muted">{t.trial.note}</p>

        <a className="btn-primary mt-6" href={waLink(t.wa.trial)} rel="noopener">
          <MessageCircle size={18} aria-hidden="true" />
          {t.trial.cta}
        </a>
      </Section>

      {/* FAQ */}
      <Section id="faq" title={t.faq.title} lead={t.faq.lead} tone="grey">
        <div className="max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-semibold text-ink marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent transition-transform group-open:rotate-90"
                  >
                    <ArrowRight size={18} />
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title={t.contact.title} lead={t.contact.lead}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href={waLink(t.wa.generic)} rel="noopener">
            <MessageCircle size={18} aria-hidden="true" />
            {t.contact.whatsapp}
          </a>
          <a className="btn-secondary" href={mailLink(t.contact.emailSubject)}>
            <Mail size={18} aria-hidden="true" />
            {t.contact.email}
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-muted">{t.contact.note}</p>
        <p className="mt-2 text-sm text-ink-muted">
          {SITE.email} · WhatsApp {SITE.whatsappDisplay}
        </p>
      </Section>
    </main>
  )
}
