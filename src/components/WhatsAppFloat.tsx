import { useEffect, useRef, useState } from 'react'
import { useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Bubble } from './marks'

/*
 * One floating button, bottom right, always the same: write to us. It is
 * on every page but the assistant's (App.tsx), the phone home page too, and
 * keeps its label on a phone: a bare bubble did not say what it was.
 */
export function WhatsAppFloat() {
  const { lang, page } = useRoute()
  const c = booking[lang]
  const link = useRef<HTMLAnchorElement>(null)
  /* While a field has focus the keyboard is up and the form fills the screen;
     the button would sit on the inputs, so it steps aside until typing stops. */
  const [typing, setTyping] = useState(false)
  useEffect(() => {
    const field = (t: EventTarget | null) => t instanceof HTMLElement && t.matches('input, textarea, select')
    const on = (e: FocusEvent) => {
      if (field(e.target)) setTyping(true)
    }
    const off = (e: FocusEvent) => {
      if (field(e.target) && !field(e.relatedTarget)) setTyping(false)
    }
    document.addEventListener('focusin', on)
    document.addEventListener('focusout', off)
    return () => {
      document.removeEventListener('focusin', on)
      document.removeEventListener('focusout', off)
    }
  }, [])

  /*
   * Where the page already shows the big WhatsApp button (the contact panel,
   * #contact, and the closing band), this one would only sit on top of it:
   * while either is at least 30% on screen (30% of it, or of the screen
   * for a panel taller than the screen) it steps away (.is-away in
   * site.css). Without the class it is visible, so nothing waits for a
   * script. The targets are looked up again on every route change, after
   * the new page has drawn.
   */
  useEffect(() => {
    if (typing || !('IntersectionObserver' in window)) return
    const seen = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const screen = e.rootBounds?.height || window.innerHeight
          seen.set(e.target, e.isIntersecting && (e.intersectionRatio >= 0.3 || e.intersectionRect.height >= 0.3 * screen))
        }
        link.current?.classList.toggle('is-away', [...seen.values()].some(Boolean))
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    const frame = requestAnimationFrame(() => {
      const targets = [document.getElementById('contact'), document.getElementById('closing-title')?.closest('section')]
      for (const el of targets) if (el) io.observe(el)
    })
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      link.current?.classList.remove('is-away')
    }
  }, [page, lang, typing])

  if (typing) return null
  return (
    <a ref={link} href={waLink(c.hero.waText)} rel="noopener" aria-label={c.hero.whatsapp} className="wa-float inline-flex">
      <Bubble size={18} />
      <span>{c.float}</span>
    </a>
  )
}
