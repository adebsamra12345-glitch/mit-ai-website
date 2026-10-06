/** Card with a cursor-following glow (pure CSS variables, updated on pointer move). */
export default function SpotlightCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Tag className={`spotlight ${className}`} onPointerMove={onMove} {...rest}>
      {children}
    </Tag>
  )
}
