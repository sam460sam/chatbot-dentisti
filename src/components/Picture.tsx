/*
 * The section photographs: one WebP in three widths (public/media/NAME-W.webp),
 * all 3:2 at 1600 x 1063. Decorative: the text next to each one says what it
 * is about, so they carry an empty alt.
 */
export type PictureName = 'assistant' | 'websites' | 'call' | 'ads' | 'prices' | 'workshop'

export function Picture({
  name, sizes, className, eager = false,
}: { name: PictureName; sizes: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={`/media/${name}-960.webp`}
      srcSet={`/media/${name}-640.webp 640w, /media/${name}-960.webp 960w, /media/${name}-1600.webp 1600w`}
      sizes={sizes}
      alt=""
      width={1600}
      height={1063}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
