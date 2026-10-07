import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './motion'

/*
 * The footer's turning mark: a six-second Blender loop (tools/logo-3d.py)
 * rendered on the footer's own navy, so it needs no transparency.
 *
 * The still is always there. The film is fetched only when the footer is
 * close to the screen, plays only while it is on screen, and never with
 * reduced motion or Save-Data.
 */
export function MarkFilm({ label }: { label: string }) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [on, setOn] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = box.current
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (!el || prefersReducedMotion() || saveData || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true)
        const v = video.current
        if (!v) return
        if (e.isIntersecting) void v.play().catch(() => {})
        else v.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={box} className="mark-film" role="img" aria-label={label}>
      <img src="/media/mark-3d.webp" alt="" width={600} height={600} loading="lazy" decoding="async" />
      {near && !failed && (
        <video
          ref={video}
          className={on ? 'is-on' : ''}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          onPlaying={() => setOn(true)}
          onError={() => setFailed(true)}
          aria-hidden="true"
        >
          <source src="/media/mark-3d.webm" type="video/webm" />
          <source src="/media/mark-3d.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}
