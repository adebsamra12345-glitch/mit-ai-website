import { useState } from 'react'

export default function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <figure className="code-block" dir="ltr">
      <figcaption>
        <span>{lang}</span>
        <button type="button" onClick={copy} aria-label="نسخ الكود">{copied ? '✓ Copied' : 'Copy'}</button>
      </figcaption>
      <pre tabIndex={0}><code>{code}</code></pre>
    </figure>
  )
}
