import { useEffect, useRef } from 'react'
import robot from '../assets/mit-robot.webp'

const CHIPS = [
  { label: 'RAG', className: 'chip-a' },
  { label: 'Qwen 2.5', className: 'chip-b' },
  { label: 'Claude API', className: 'chip-c' },
  { label: 'Fine-Tuning', className: 'chip-d' },
]

/**
 * The Mit robot on its own (no banner): floating, glowing, orbited by tech chips,
 * with a light pointer parallax on devices that have a fine pointer.
 */
export default function Robot({ chips = true, size = 'lg', alt = 'روبوت Mit المساعد الذكي' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !canHover || reduced) return undefined

    let frame = 0
    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={`robot robot-${size}`} ref={ref}>
      <div className="robot-aura" aria-hidden="true" />
      <div className="robot-ring ring-1" aria-hidden="true" />
      <div className="robot-ring ring-2" aria-hidden="true" />
      <div className="robot-float">
        <img className="robot-img" src={robot} alt={alt} width="561" height="658" decoding="async" />
      </div>
      <div className="robot-shadow" aria-hidden="true" />
      {chips &&
        CHIPS.map((c) => (
          <span key={c.label} className={`robot-chip ${c.className}`} aria-hidden="true">
            {c.label}
          </span>
        ))}
    </div>
  )
}
