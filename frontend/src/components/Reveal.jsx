import { useReveal } from '../hooks/useReveal.js'

/**
 * Scroll-reveal wrapper.
 * @param {'up'|'down'|'left'|'right'|'zoom'|'fade'} effect
 * @param {number} delay  stagger delay in ms
 */
export default function Reveal({ as: Tag = 'div', effect = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${effect} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
