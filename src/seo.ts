import { useEffect } from 'react'
import { SITE } from './site'
import { LANGS, type Lang } from './i18n'
import { pathFor, type Page } from './router'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

/** Keeps title, description, OG tags, canonical and hreflang in sync with the current route. */
export function useSeo(lang: Lang, page: Page, title: string, description: string) {
  useEffect(() => {
    document.title = title
    document.documentElement.lang = lang
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', ({ en: 'en_GB', nl: 'nl_NL', it: 'it_IT' } as const)[lang])
    setMeta('meta[property="og:url"]', 'property', 'og:url', SITE.baseUrl + pathFor(lang, page))
    setLink('canonical', SITE.baseUrl + pathFor(lang, page))
    for (const alt of LANGS) {
      setLink('alternate', SITE.baseUrl + pathFor(alt, page), alt)
    }
    setLink('alternate', SITE.baseUrl + pathFor('en', page), 'x-default')
  }, [lang, page, title, description])
}
