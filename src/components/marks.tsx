/**
 * The site's own icons, drawn to one stroke weight and one corner radius.
 * They replace lucide-react: a page this committed cannot wear borrowed shapes,
 * and eight inline paths cost less than the dependency did.
 */
type IconProps = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const Bubble = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5.5h16v11H9.5L5 20v-3.5H4z" />
  </svg>
)

export const Diary = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 6h16v14H4z" />
    <path d="M4 10h16M9 4v4M15 4v4" />
  </svg>
)

export const Person = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
  </svg>
)

export const Window = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 5h18v14H3z" />
    <path d="M3 9h18" />
  </svg>
)

/* The two arrows carry a class of their own, so the link or button around
   them can nudge them on hover and focus (site.css, .i-arrow). */
const withClass = (own: string, extra?: string) => (extra ? `${own} ${extra}` : own)

export const Arrow = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={withClass('i-arrow', className)}>
    <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
  </svg>
)

export const ArrowOut = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={withClass('i-arrow-out', className)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

export const Mail = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18v12H3z" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const Menu = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Close = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

/**
 * The check mark, as a 6px solid square in the ink of whichever half of the
 * business the list belongs to. `tone` is the only thing that varies.
 */
export const Mark = ({ tone = 'teal' }: { tone?: 'teal' | 'verm' | 'paper' }) => (
  <span
    aria-hidden="true"
    className={`mark ${
      tone === 'verm' ? 'bg-verm' : tone === 'paper' ? 'bg-paper' : 'bg-teal'
    }`}
  />
)
