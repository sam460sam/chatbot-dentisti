import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { RouterProvider, followBrowserLanguage } from './router'
import './index.css'
import './site.css'
import './contact.css'

followBrowserLanguage()

/* The shell carries a plain fallback (scripts/prerender-meta.mjs) for
   readers that run no script. The app starts from an empty root rather
   than diffing its own markup against it. */
const root = document.getElementById('root')!
root.textContent = ''

createRoot(root).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
