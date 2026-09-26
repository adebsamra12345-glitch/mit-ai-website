import { useState, useRef, useEffect } from 'react'
import mascot from '../assets/mascot.jpg'
import { askAssistant } from '../lib/assistantClient.js'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'أهلاً بك! أنا Mit، مساعدك الرقمي. كيف أقدر أساعدك اليوم؟ 👋' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const reply = await askAssistant(text)
      setMessages((m) => [...m, { role: 'bot', text: reply }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'عذرًا، حدث خطأ أثناء الاتصال بالمساعد. حاول مرة أخرى.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="محادثة مع مساعد Mit">
          <div className="chat-panel-header">
            <img src={mascot} alt="" />
            <div>
              <div className="name">مساعد Mit</div>
              <div className="status">متصل الآن</div>
            </div>
          </div>
          <div className="chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div className={`chat-msg ${m.role}`} key={i}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-msg bot">يكتب...</div>}
          </div>
          <form className="chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              aria-label="اكتب رسالتك"
            />
            <button type="submit">إرسال</button>
          </form>
        </div>
      )}

      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'إغلاق المحادثة' : 'فتح المحادثة مع مساعد Mit'}
      >
        <img src={mascot} alt="" />
      </button>
    </>
  )
}
