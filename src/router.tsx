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
            document.getElementById(hash)?.scrollIntoView({ block: 'start' })
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
