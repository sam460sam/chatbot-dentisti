import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './components/Home'
import { PrivacyPage } from './components/PrivacyPage'
import { useRoute } from './router'
import { useSeo } from './seo'
import { translations } from './i18n'

export function App() {
  const { lang, page } = useRoute()
  const t = translations[lang]

  useSeo(
    lang,
    page,
    page === 'privacy' ? t.meta.privacyTitle : t.meta.title,
    page === 'privacy' ? t.meta.privacyDescription : t.meta.description,
  )

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink focus:shadow"
      >
        {t.nav.skip}
      </a>
      <Header t={t} />
      <div className="flex-1">{page === 'privacy' ? <PrivacyPage t={t} /> : <Home t={t} />}</div>
      <Footer t={t} />
    </div>
  )
}
