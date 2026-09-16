import type { Translation } from '../i18n'

/*
 * What a site we build looks like, drawn at two widths side by side with the
 * dimensions labelled. This replaces a set of grey shimmering rectangles that
 * read as a skeleton loader — an "unfinished page" graphic in the one section
 * whose job is to prove the opposite.
 *
 * It is still a drawing rather than a screenshot, because the only real site
 * we own is the demo practice, and that is linked directly instead.
 */
function Bar({ w, tone = 'soft' }: { w: string; tone?: 'soft' | 'strong' | 'verm' }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-0.5 ${
        tone === 'verm' ? 'bg-verm' : tone === 'strong' ? 'bg-ink' : 'bg-ink/25'
      }`}
      style={{ width: w }}
    />
  )
}

export function SiteWireframe({ t }: { t: Translation }) {
  return (
    <div className="flex items-end gap-2">
      {/* Desktop */}
      <div className="min-w-0 flex-1">
        <div className="plate-verm border border-ink bg-paper">
          <div className="flex items-center gap-0.5 border-b border-paper-edge px-1 py-0.5">
            <span aria-hidden="true" className="h-0.5 w-0.5 rounded-sm bg-ink/30" />
            <span aria-hidden="true" className="h-0.5 w-0.5 rounded-sm bg-ink/30" />
            <span className="ml-1 truncate text-micro text-ink-mute">{t.demo.siteLabel}</span>
          </div>

          <div className="space-y-1 p-2">
            <div className="flex items-center gap-1">
              <span aria-hidden="true" className="h-2 w-2 bg-verm" />
              <Bar w="34%" tone="strong" />
              <span className="ml-auto flex gap-0.5">
                <Bar w="18px" />
                <Bar w="18px" />
                <Bar w="18px" />
              </span>
            </div>
            <div className="pt-1">
              <Bar w="78%" tone="strong" />
              <span className="mt-0.5 block">
                <Bar w="52%" tone="strong" />
              </span>
            </div>
            <Bar w="64%" />
            <div className="flex gap-1 pt-0.5">
              <span aria-hidden="true" className="mark-out h-3 w-8 bg-verm" />
              <span aria-hidden="true" className="h-3 w-7 border border-ink" />
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              <span aria-hidden="true" className="h-5 border border-paper-edge bg-paper-deep" />
              <span aria-hidden="true" className="h-5 border border-paper-edge bg-paper-deep" />
              <span aria-hidden="true" className="h-5 border border-paper-edge bg-paper-deep" />
            </div>
          </div>
        </div>
        <p className="mt-0.5 text-micro tabular-nums text-ink-mute">1440</p>
      </div>

      {/* Phone — the width that actually matters */}
      <div className="w-8 shrink-0 sm:w-9">
        <div className="mark-in border border-ink bg-paper p-1">
          <div className="flex items-center gap-0.5">
            <span aria-hidden="true" className="h-1 w-1 bg-verm" />
            <Bar w="60%" tone="strong" />
          </div>
          <div className="mt-1 space-y-0.5">
            <Bar w="92%" tone="strong" />
            <Bar w="70%" tone="strong" />
          </div>
          <span aria-hidden="true" className="mark-out mt-1 block h-2 w-full bg-verm" />
          <div className="mt-1 space-y-0.5">
            <span aria-hidden="true" className="block h-4 border border-paper-edge bg-paper-deep" />
            <span aria-hidden="true" className="block h-4 border border-paper-edge bg-paper-deep" />
          </div>
        </div>
        <p className="mt-0.5 text-micro tabular-nums text-ink-mute">390</p>
      </div>
    </div>
  )
}
