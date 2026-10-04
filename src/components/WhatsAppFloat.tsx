import { useEffect, useState } from 'react'
import { useRoute } from '../router'
import { booking } from '../i18n/booking'
import { waLink } from '../site'
import { Bubble } from './marks'

/* One floating button, bottom right, always the same: write to us. */
export function WhatsAppFloat() {
  const { lang } = useRoute()
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
  return (
    <a
      href={waLink(c.hero.waText)}
      rel="noopener"
      aria-label={`${c.hero.whatsapp}`}
      className="mark-out fixed bottom-2 right-2 z-40 inline-flex h-6 w-6 items-center justify-center gap-1 border border-ink-edge bg-ink text-small font-semibold text-paper shadow-[3px_3px_0_#0E5266] transition-colors hover:bg-teal sm:bottom-3 sm:right-3 sm:h-auto sm:w-auto sm:px-2 sm:py-1.5"
    >
      <Bubble size={18} />
      {/* on a phone the label goes: the button would sit on the form */}
      <span className="hidden sm:inline">{c.float}</span>
    </a>
  )
}
