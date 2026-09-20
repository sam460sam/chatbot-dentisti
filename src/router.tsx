import { createContext, useContext, useEffect, useState } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { LANGS, type Lang } from './i18n'

export type Page = 'home' | 'privacy'

export interface Route {
  lang: Lang
  page: Page
}

function parse(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean)
  let lang: Lang = 'en'
  if (parts.length > 0 && (LANGS as string[]).includes(parts[0])) {
    lang = parts.shift() as Lang
  }
  const page: Page = parts[0] === 'privacy' ? 'privacy' : 'home'
  return { lang, page }
}

/** Builds an internal path: English lives at the root, the others under /nl and /it. */
export function pathFor(lang: Lang, page: Page): string {
  const prefix = lang === 'en' ? '' : `/${lang}`
  const suffix = page === 'privacy' ? '/privacy' : ''
  return prefix + suffix || '/'
}

const LANG_KEY = 'twinbyte-lang'

/** The visitor picked a language by hand: keep it, and stop guessing. */
export function rememberLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // private mode, blocked storage: the guess below runs again next time
  }
}

/**
 * On the root path, with no choice remembered, go to the browser's language
 * if it is one of ours. Only the root: a shared link to /nl or /it is a
 * choice already made, and English stays English.
 */
export function followBrowserLanguage(): void {
  if (window.location.pathname !== '/') return
  try {
    if (localStorage.getItem(LANG_KEY)) return
  } catch {
    // fall through
  }
  const wanted = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
  for (const tag of wanted) {
    const code = (tag || '').slice(0, 2).toLowerCase()
    if (code === 'en') return
    if (code === 'nl' || code === 'it') {
      window.history.replaceState({}, '', `/${code}`)
      return
    }
  }
}

const RouteContext = createContext<Route>({ lang: 'en', page: 'home' })

export function useRoute(): Route {
  return useContext(RouteContext)
}

export function navigate(path: string): void {
  try {
    window.history.pushState({}, '', path)
  } catch {
    // Some sandboxed preview environments block pushState; keep navigating anyway.
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parse(window.location.pathname))

  useEffect(() => {
    const onPop = () => setRoute(parse(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return <RouteContext.Provider value={route}>{children}</RouteContext.Provider>
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

/** Internal link. Handles both plain paths and "path#section" anchors. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.button !== 0) return
        event.preventDefault()
        const [path, hash] = to.split('#')
        if (path && path !== window.location.pathname) navigate(path)
        if (hash) {
          requestAnimationFrame(() => {
            const target = document.getElementById(hash)
            if (!target) return
            target.scrollIntoView({ block: 'start' })
            /* preventDefault threw away the focus move that native fragment
               navigation would have done, so a keyboard user landed on the
               section visually while their focus stayed on the header link.
               Move it by hand; -1 keeps the section out of the tab order. */
            target.setAttribute('tabindex', '-1')
            target.focus({ preventScroll: true })
          })
        } else {
          window.scrollTo(0, 0)
        }
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
