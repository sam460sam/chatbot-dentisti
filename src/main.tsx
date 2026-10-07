import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { RouterProvider, followBrowserLanguage } from './router'
import './index.css'
import './site.css'

followBrowserLanguage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
