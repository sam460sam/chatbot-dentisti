import { useEffect, useRef, useState } from 'react'
import { useRoute } from '../router'
import { booking } from '../i18n/booking'
import { home } from '../i18n/home'
import { waLink } from '../site'
import { Arrow, Bubble } from './marks'
import { prefersReducedMotion } from './motion'
import { introRuns } from './Intro'

/*
 * The first screen: a neighbourhood shop at night, closed, while the phone on
 * its counter lights up. The still is the page's largest image and loads
 * first; on a wide screen the five-second loop (rain on the street, the
 * phone glowing) arrives only after the page has finished loading, never on
 * Save-Data or reduced motion, and pauses when scrolled away. If it never
 * comes, the still is the hero.
 */
const STILL = {
  wide: { src: '/media/hero-1280.webp', srcSet: '/media/hero-800.webp 800w, /media/hero-1280.webp 1280w, /media/hero-1920.webp 1920w' },
  tall: '/media/hero-portrait-640.webp 640w, /media/hero-portrait-960.webp 960w, /media/hero-portrait-1280.webp 1280w',
}
/* Wide screens only. On a phone the still is the hero and drifts slowly
   (CSS): no video download on a mobile connection. */
const LOOP = { webm: '/media/hero-loop.webm', mp4: '/media/hero-loop.mp4' }
const TALL = '(max-aspect-ratio: 4/5)'

function wantsMotion(): boolean {
  if (prefersReducedMotion()) return false
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !c?.saveData
}

export function HomeHero() {
  const { lang } = useRoute()
  const b = booking[lang]
  const h = home[lang]
  const [loop, setLoop] = useState<null | typeof LOOP>(null)
  const [playing, setPlaying] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const section = useRef<HTMLElement>(null)
  const [late] = useState(introRuns)

  useEffect(() => {
    if (!wantsMotion() || matchMedia(TALL).matches) return
    let timer = 0
    const start = () => {
      timer = window.setTimeout(() => setLoop(LOOP), 400)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      clearTimeout(timer)
    }
  }, [])

  /* no decoding frames nobody is looking at */
  useEffect(() => {
    const v = video.current
    const s = section.current
    if (!loop || !v || !s || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void v.play().catch(() => {})
      else v.pause()
    })
    io.observe(s)
    return () => io.disconnect()
  }, [loop])

  return (
    <section ref={section} aria-labelledby="hero-title" className="hero on-ink">
      <div className="hero-media" aria-hidden="true">
        <picture>
          <source media={TALL} srcSet={STILL.tall} sizes="100vw" />
          <img
            src={STILL.wide.src}
            srcSet={STILL.wide.srcSet}
            sizes="100vw"
            alt=""
            width={1912}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="hero-img"
          />
        </picture>
        {loop && (
          <video
            ref={video}
            className={`hero-img hero-video ${playing ? 'is-on' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            onPlaying={() => setPlaying(true)}
            onError={() => setLoop(null)}
          >
            <source src={loop.webm} type="video/webm" />
            <source src={loop.mp4} type="video/mp4" />
          </video>
        )}
        <div className="hero-shade" />
      </div>
      <p className="sr-only">{h.hero.video}</p>

      <div className={`hero-copy container-page ${late ? 'after-intro' : ''}`}>
        <p className="hero-eyebrow">
          <span aria-hidden="true" className="hero-dot" />
          {h.hero.eyebrow}
        </p>
        <h1 id="hero-title" className="hero-title">{b.hero.title}</h1>
        <p className="hero-lead">{b.hero.lead}</p>
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center">
          <a className="btn-mint" href="#book">
            {b.nav.book}
            <Arrow />
          </a>
          <a className="btn-ghost" href={waLink(b.hero.waText)} rel="noopener">
            <Bubble size={16} />
            {b.hero.whatsapp}
          </a>
        </div>
      </div>
      <a href="#book" className="hero-cue" aria-hidden="true" tabIndex={-1}>
        <span />
      </a>
    </section>
  )
}
