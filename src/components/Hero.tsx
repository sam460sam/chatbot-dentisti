import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react'
import { ChatMockup } from './ChatMockup'
import { prefersReducedMotion } from './motion'
import { SITE, waLink } from '../site'
import { useRoute } from '../router'
import type { Translation } from '../i18n'

/**
 * On a wide screen the hero holds still while the page scrolls past it, and the
 * conversation builds one message at a time as it does. On a phone there is no
 * room for that, so the mock plays on a timer instead (see ChatMockup).
 */
function useScrollProgress(enabled: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const section = document.getElementById('hero-runway')
    if (!section) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return setProgress(1)
      setProgress(Math.min(Math.max(-rect.top / travel, 0), 1))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  return progress
}

export function Hero({ t }: { t: Translation }) {
  const { lang } = useRoute()
  const [scrollDriven, setScrollDriven] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const apply = () => setScrollDriven(wide.matches && !prefersReducedMotion())
    apply()
    wide.addEventListener('change', apply)
    return () => wide.removeEventListener('change', apply)
  }, [])

  const progress = useScrollProgress(scrollDriven)

  return (
    <section className="on-dark hero-ground relative text-white">
      <div id="hero-runway" className={scrollDriven ? 'h-[230vh]' : ''}>
        <div
          className={
            scrollDriven
              ? 'sticky top-0 flex h-[100svh] items-center overflow-hidden'
              : ''
          }
        >
          <div className="container-page grid w-full items-center gap-14 pb-24 pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pb-8 lg:pt-24">
            <div>
              <span className="eyebrow border-white/15 text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                {t.hero.eyebrow}
              </span>

              <h1 className="mt-6 text-balance text-[36px] font-extrabold leading-[1.0] tracking-[-0.035em] sm:text-[48px] lg:mt-5 lg:text-[50px] xl:text-[58px] 2xl:text-[64px]">
                {t.hero.title}
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/65 sm:text-lg lg:mt-5">
                {t.hero.lead}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-7">
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

              <ul className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-2 lg:mt-7 lg:pt-5">
                {t.hero.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-accent-bright"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <ChatMockup t={t} progress={scrollDriven ? progress : null} />
            </div>
          </div>
        </div>
      </div>

      {scrollDriven && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-surface"
        />
      )}
    </section>
  )
}
