import { useEffect, useState } from 'react'
import { useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Bubble } from './marks'

/* One floating button, bottom right, always the same: write to us. */
export function WhatsAppFloat() {
  const { lang, page } = useRoute()
  const c = booking[lang]
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
  if (typing) return null
  /* On the phone home page WhatsApp is already under the card and in the
     closing band, and the button would sit on the time slots. */
  const where = page === 'home' ? 'hidden sm:inline-flex' : 'inline-flex'
  return (
    <a
      href={waLink(c.hero.waText)}
      rel="noopener"
      aria-label={`${c.hero.whatsapp}`}
      className={`wa-float ${where}`}
    >
      <Bubble size={18} />
      {/* on a phone the label goes: the button would sit on the form */}
      <span className="hidden sm:inline">{c.float}</span>
    </a>
  )
}
