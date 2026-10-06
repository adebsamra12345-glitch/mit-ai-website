import { useEffect, useRef } from 'react'

/**
 * Adds `is-in` to the element once it scrolls into view.
 * Class changes happen on the DOM node (not React state) so server-rendered
 * markup hydrates without a mismatch, and without JS the content stays visible
 * (the hidden state is only applied under `html.js`).
 */
export function useReveal(options = { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      })
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}

/** Counts from 0 to `target` when the element becomes visible. */
export function useCountUp(target, duration = 1400) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) return undefined

    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return ref
}
