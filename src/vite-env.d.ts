/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Turnstile site key (public). Unset = no Turnstile widget. */
  readonly VITE_TURNSTILE_SITE_KEY?: string
}
