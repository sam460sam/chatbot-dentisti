import { Check, Smartphone } from 'lucide-react'
import type { Translation } from '../i18n'

/** Abstract wireframe of a small-business site — no fake screenshots, no fake numbers. */
export function SiteMockup({ t }: { t: Translation }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-raised shadow-lift">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 truncate rounded-md bg-black/30 px-3 py-1 text-[11px] text-ink-muted ring-1 ring-white/10">
          {t.demo.siteLabel}
        </span>
      </div>

      <div className="relative space-y-3 p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -skew-x-12 animate-sheen bg-gradient-to-r from-transparent via-accent/[0.07] to-transparent"
        />
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-accent/20" />
          <div className="h-2.5 w-24 rounded bg-white/15" />
          <div className="ml-auto flex gap-2">
            <div className="h-2 w-10 rounded bg-white/10" />
            <div className="h-2 w-10 rounded bg-white/10" />
            <div className="h-2 w-10 rounded bg-white/10" />
          </div>
        </div>

        <div className="h-3.5 w-3/4 rounded bg-white/20" />
        <div className="h-3.5 w-1/2 rounded bg-white/15" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 w-28 rounded-lg bg-accent" />
          <div className="h-8 w-24 rounded-lg bg-white/10" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="h-16 rounded-lg bg-white/[0.07]" />
          <div className="h-16 rounded-lg bg-white/[0.07]" />
          <div className="h-16 rounded-lg bg-white/[0.07]" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-white/[0.03] px-5 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-accent-bright">
          <Smartphone size={12} aria-hidden="true" />
          {t.websites.tags[0]}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-accent-bright">
          <Check size={12} aria-hidden="true" />
          {t.websites.tags[1]}
        </span>
      </div>
    </div>
  )
}
