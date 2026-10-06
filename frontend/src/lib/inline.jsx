import { Link } from 'react-router-dom'

// Inline markup used inside post text: **bold**, *italic*, `code`, [label](/internal-or-https-link)
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g

export function renderInline(text) {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    if (part.startsWith('[')) {
      const [, label, href] = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
      return href.startsWith('/')
        ? <Link key={i} to={href} {...(label.startsWith('/') && { dir: 'ltr', style: { display: 'inline-block' } })}>{label}</Link>
        : <a key={i} href={href} rel="noopener noreferrer" target="_blank">{label}</a>
    }
    if (part.startsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

/** Plain-text version (for meta descriptions, TOC ids). */
export const stripInline = (text) => text.replace(/\*\*|`|\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
