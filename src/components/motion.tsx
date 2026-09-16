/**
 * The site has no scroll-triggered reveals and no IntersectionObserver.
 *
 * It had both once. On a real phone the observer sometimes fired late or not at
 * all, and a visitor sat in front of blank sections waiting for content that had
 * already downloaded — reported twice. The rule that replaced it: motion may add
 * to something already visible, it may never decide whether it is visible.
 *
 * If you are reading this because you want to add a scroll reveal: that is why
 * there are none.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
