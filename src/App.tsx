import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BookingPage } from './components/BookingPage'
import { AssistantPage, PricesPage, WebsitesPage } from './components/Pages'
import { PrivacyPage } from './components/PrivacyPage'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { useRoute } from './router'
import { useSeo } from './seo'
import { pageMeta } from './pageMeta'
import { useAssistantWidget } from './widget'
import { translations } from './i18n'

export function App() {
  const { lang, page } = useRoute()
  const t = translations[lang]
  const meta = pageMeta(lang, page)

  useSeo(lang, page, meta.title, meta.description)
  /* The live assistant is the product demo, so it lives on the assistant
     page. Everywhere else the one floating button is WhatsApp: two floating
     buttons in the same corner fight each other. */
  useAssistantWidget(lang, t.widgetHello, page === 'assistant')

  return (
    <div className="flex min-h-screen flex-col">
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
        ) : (
          <BookingPage t={t} />
        )}
      </div>
      <Footer t={t} />
      {page !== 'assistant' && <WhatsAppFloat />}
    </div>
  )
}
