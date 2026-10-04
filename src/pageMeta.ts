import meta from './i18n/meta.json'
import type { Lang } from './i18n'
import type { Page } from './router'

type Entry = Record<string, string>

/** Title and description of a page. The same file feeds the prerender, so
    the tags in the HTML and the ones set after hydration never disagree. */
export function pageMeta(lang: Lang, page: Page): { title: string; description: string } {
  const m = (meta as Record<Lang, Entry>)[lang]
  const key = page === 'home' ? '' : page
  return {
    title: m[key ? `${key}Title` : 'title'],
    description: m[key ? `${key}Description` : 'description'],
  }
}
