import { Fragment } from 'react'
import CodeBlock from './CodeBlock.jsx'
import { renderInline, stripInline } from '../../lib/inline.jsx'

const CALLOUT_ICONS = { tip: '💡', info: 'ℹ️', warn: '⚠️' }

export const headingId = (index) => `section-${index}`

/** Headings (h2) with their block index, used for the table of contents. */
export function getOutline(body) {
  return body.flatMap((block, index) => (block.t === 'h2' ? [{ id: headingId(index), text: stripInline(block.c) }] : []))
}

/**
 * Renders a post's `body` blocks:
 *   p, h2, h3, ul, ol, code, callout, table, toc
 */
export default function ArticleBody({ body, tocLabel = 'محتويات المقال' }) {
  const outline = getOutline(body)

  return (
    <div className="prose">
      {body.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <p key={i}>{renderInline(b.c)}</p>
          case 'h2':
            return <h2 key={i} id={headingId(i)}>{renderInline(b.c)}</h2>
          case 'h3':
            return <h3 key={i}>{renderInline(b.c)}</h3>
          case 'ul':
            return <ul key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>
          case 'ol':
            return <ol key={i}>{b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>
          case 'code':
            return <CodeBlock key={i} lang={b.lang} code={b.c} />
          case 'callout':
            return (
              <aside key={i} className={`callout callout-${b.kind}`}>
                <div className="callout-title"><span aria-hidden="true">{CALLOUT_ICONS[b.kind]}</span> {b.title}</div>
                <p>{renderInline(b.c)}</p>
              </aside>
            )
          case 'table':
            return (
              <div key={i} className="table-wrap" tabIndex={0}>
                <table>
                  <thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>{row.map((cell, c) => <td key={c}>{renderInline(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'toc':
            return (
              <nav key={i} className="toc" aria-label={tocLabel}>
                <div className="toc-title">{tocLabel}</div>
                <ol>{outline.map((o) => <li key={o.id}><a href={`#${o.id}`}>{o.text}</a></li>)}</ol>
              </nav>
            )
          default:
            return <Fragment key={i} />
        }
      })}
    </div>
  )
}
