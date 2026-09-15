import { ArrowUpRight, Check, MessageCircle } from 'lucide-react'
import { ChatMockup } from './ChatMockup'
import { SITE, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

export function Hero({ t }: { t: Translation }) {
  const { lang } = useRoute()

  return (
    <section className="on-dark relative overflow-hidden bg-night text-white">
      {/* Depth: aurora blobs, perspective floor, grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] animate-drift rounded-full bg-accent/35 blur-[110px]" />
        <div
          className="absolute -right-32 top-10 h-[26rem] w-[26rem] animate-drift rounded-full bg-accent-bright/20 blur-[120px]"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] animate-drift rounded-full bg-indigo-500/10 blur-[120px]"
          style={{ animationDelay: '-12s' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[42%] [perspective:600px]">
          <div className="grid-floor h-full w-full origin-bottom [transform:rotateX(72deg)_scale(1.6)]" />
        </div>
      </div>

      <div className="container-page relative grid items-center gap-16 pb-28 pt-14 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-36 lg:pt-24">
        <div>
          <span className="eyebrow border-white/15 text-white/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-bright" />
            </span>
            {t.hero.eyebrow}
          </span>

          <h1 className="mt-6 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[46px] lg:text-[58px]">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/65 sm:text-lg">
            {t.hero.lead}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href={waLink(t.wa.trial)} rel="noopener">
              <MessageCircle size={18} aria-hidden="true" />
              {t.hero.ctaTrial}
            </a>
            <a
              className="btn-ghost-dark"
              href={SITE.demo[lang]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.hero.ctaDemo}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 text-sm text-white/45">{t.hero.note}</p>

          <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
            {t.hero.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-white/70">
                <Check size={17} className="mt-0.5 shrink-0 text-accent-bright" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="stage">
          {/* Fixed 3D angle: the mock does not move, only the conversation plays. */}
          <div className="tilt tilt-hero relative">
            <ChatMockup t={t} />
          </div>
        </div>
      </div>

      {/* Blend into the light sections below */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  )
}
