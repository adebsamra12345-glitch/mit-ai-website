import { useEffect, useRef, useState } from 'react'
import robot from '../assets/mit-robot-sm.webp'
import { askAssistant } from '../lib/assistantClient.js'
import { renderInline } from '../lib/inline.jsx'

const GREETING = 'أهلاً بك! أنا Mit، مساعدك الرقمي. كيف أقدر أساعدك اليوم؟ 👋'
const SUGGESTIONS = ['ما هي خدماتكم؟', 'كيف أحجز استشارة مجانية؟', 'هل تدربون نماذج على بياناتنا؟']
const MAX_LENGTH = 1000

let nextId = 1
const makeMessage = (role, text) => ({ id: nextId++, role, text })

/** Renders reply text: line breaks, "• " bullets and **bold** (the backend replies in this light markup). */
function MessageText({ text }) {
  return text.split('\n').map((line, i) => (
    <span className="chat-line" key={i}>{renderInline(line)}</span>
  ))
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [messages, setMessages] = useState(() => [makeMessage('bot', GREETING)])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Friendly nudge a few seconds after load, once.
  useEffect(() => {
    const show = setTimeout(() => setTeaser(true), 5000)
    const hide = setTimeout(() => setTeaser(false), 14000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    inputRef.current?.focus({ preventScroll: true })
    // Full-screen sheet on phones: stop the page behind from scrolling.
    const isPhone = window.matchMedia('(max-width: 640px)').matches
    if (isPhone) document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [open])

  async function send(text) {
    const message = text.trim().slice(0, MAX_LENGTH)
    if (!message || loading) return
    setMessages((m) => [...m, makeMessage('user', message)])
    setInput('')
    setLoading(true)
    const reply = await askAssistant(message) // never rejects: falls back to an offline reply
    setMessages((m) => [...m, makeMessage('bot', reply)])
    setLoading(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const toggle = () => {
    setTeaser(false)
    setOpen((o) => !o)
  }

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="محادثة مع مساعد Mit">
          <div className="chat-panel-header">
            <img src={robot} alt="" width="40" height="47" />
            <div>
              <div className="name">مساعد Mit</div>
              <div className="status"><span className="pulse-dot" /> متصل الآن</div>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="إغلاق المحادثة">✕</button>
          </div>

          <div className="chat-messages" ref={listRef} aria-live="polite">
            {messages.map((m) => (
              <div className={`chat-msg ${m.role}`} key={m.id}><MessageText text={m.text} /></div>
            ))}
            {loading && (
              <div className="chat-msg bot typing" aria-label="Mit يكتب">
                <i /><i /><i />
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button type="button" key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              maxLength={MAX_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              aria-label="اكتب رسالتك"
              autoComplete="off"
            />
            <button type="submit" disabled={loading || !input.trim()}>إرسال</button>
          </form>
        </div>
      )}

      {teaser && !open && (
        <button type="button" className="chat-teaser" onClick={toggle}>👋 مرحباً! هل أستطيع مساعدتك؟</button>
      )}

      <button
        type="button"
        className={`chat-fab ${open ? 'is-open' : ''}`}
        onClick={toggle}
        aria-label={open ? 'إغلاق المحادثة' : 'فتح المحادثة مع مساعد Mit'}
        aria-expanded={open}
      >
        <img src={robot} alt="" width="60" height="70" />
      </button>
    </>
  )
}
