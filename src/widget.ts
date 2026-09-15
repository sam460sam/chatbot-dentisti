import { useEffect } from 'react'
import { SITE } from './site'
import { pathFor } from './router'
import type { Lang } from './i18n'

/**
 * Loads the Twinbyte assistant on this site, after the page is done loading so
 * it never competes with the first render. The widget mounts itself in a shadow
 * root and is injected only once per page load.
 */
export function useAssistantWidget(lang: Lang) {
  useEffect(() => {
    if (!SITE.widget.enabled) return
    if (document.querySelector('script[data-twinbyte-widget]')) return

    let timer = 0
    const inject = () => {
      const script = document.createElement('script')
      script.src = SITE.widget.src
      script.defer = true
      script.dataset.twinbyteWidget = 'true'
      script.dataset.studio = SITE.widget.studio
      script.dataset.api = SITE.widget.api
      script.dataset.name = SITE.widget.name
      script.dataset.lang = lang
      script.dataset.color = SITE.widget.color
      script.dataset.privacy = window.location.origin + pathFor(lang, 'privacy')
      document.body.appendChild(script)
    }

    const start = () => {
      timer = window.setTimeout(inject, 1200)
    }

    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', start)
    }
    // The widget reads its language once, at injection time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
