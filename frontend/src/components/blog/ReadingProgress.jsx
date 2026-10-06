import { useEffect, useRef } from 'react'

/** Thin progress bar showing how far down the page the reader is. */
export default function ReadingProgress() {
  const bar = useRef(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="reading-progress" aria-hidden="true"><div ref={bar} /></div>
}
