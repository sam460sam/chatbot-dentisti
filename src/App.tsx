import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BookingPage } from './components/BookingPage'
import { AssistantPage, PricesPage, WebsitesPage } from './components/Pages'
import { PrivacyPage } from './components/PrivacyPage'
import { NotFound } from './components/NotFound'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { Intro } from './components/Intro'
import { useRoute, type Route } from './router'
import { useSeo } from './seo'
import { pageMeta } from './pageMeta'
import { useAssistantWidget } from './widget'
import { translations } from './i18n'

/* Title, description, canonical and hreflang of a real page. The
   not-found page has no canonical or hreflang, so it keeps its own head. */
function Seo({ lang, page }: Route) {
  const meta = pageMeta(lang, page)
  useSeo(lang, page, meta.title, meta.description)
  return null
}

export function App() {
  const { lang, page } = useRoute()
  const t = translations[lang]

  /* The live assistant is the product demo, so it lives on the assistant
     page. Everywhere else the one floating button is WhatsApp: two floating
     buttons in the same corner fight each other. */
  useAssistantWidget(lang, t.widgetHello, page === 'assistant')

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {page !== 'notfound' && <Seo lang={lang} page={page} />}
      {page === 'home' && <Intro />}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:bg-ink focus:px-2 focus:py-1 focus:font-semibold focus:text-paper"
      >
        {t.nav.skip}
      </a>
      <Header t={t} />
      <div className="flex-1">
        {page === 'privacy' ? (
          <PrivacyPage t={t} />
        ) : page === 'assistant' ? (
          <AssistantPage t={t} />
        ) : page === 'websites' ? (
          <WebsitesPage t={t} />
        ) : page === 'prices' ? (
          <PricesPage t={t} />
        ) : page === 'notfound' ? (
          <NotFound t={t} />
        ) : (
          <BookingPage />
        )}
      </div>
      <Footer t={t} />
      {page !== 'assistant' && <WhatsAppFloat />}
    </div>
  )
}
