// عميل الاتصال بمساعد Mit وخادم Django Backend لشركة Mit AI Technology
//
// يوفر دوال الاتصال بنقاط النهاية:
// 1. askAssistant: إرسال واستقبال رسائل المحادثة عبر /api/chat/
// 2. submitContactInquiry: إرسال وحفظ طلبات الاستشارة والتواصل عبر /api/contact/
// 3. checkBackendHealth: فحص حالة الخادم عبر /api/health/

const USE_MOCK = false
const API_URL = import.meta.env.VITE_ASSISTANT_API_URL || '/api/chat/'

function getOrCreateSessionId() {
  try {
    let sid = localStorage.getItem('mit_chat_session_id')
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
      localStorage.setItem('mit_chat_session_id', sid)
    }
    return sid
  } catch {
    return 'session_guest'
  }
}

export async function askAssistant(message, customSessionId) {
  const sessionId = customSessionId || getOrCreateSessionId()

  if (USE_MOCK) {
    return mockReply(message)
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    })

    if (!res.ok) {
      throw new Error(`Assistant API error: ${res.status}`)
    }

    const data = await res.json()
    if (data.sessionId) {
      try {
        localStorage.setItem('mit_chat_session_id', data.sessionId)
      } catch {}
    }
    return data.reply
  } catch (err) {
    console.warn('Backend connection failed, falling back to offline reply:', err)
    return mockReply(message)
  }
}

export async function submitContactInquiry(data) {
  const res = await fetch('/api/contact/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || 'حدث خطأ أثناء إرسال الطلب')
  }

  return json
}

export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health/')
    return await res.json()
  } catch (err) {
    return { status: 'offline', error: err.message }
  }
}

const MOCK_REPLIES = [
  'يسعدني مساعدتك! هل تريد معرفة المزيد عن خدماتنا في المحادثة الذكية أم تحليل البيانات؟',
  'نقدم حلولًا مخصصة حسب طبيعة عملك — أخبرني أكثر عن نشاطك وسأرشدك للحل الأنسب.',
  'يمكنك حجز استشارة مجانية مع فريقنا عبر نموذج الاستشارة في أسفل الصفحة.',
]

function mockReply(userText) {
  const idx = Math.abs(hashCode(userText)) % MOCK_REPLIES.length
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_REPLIES[idx]), 600)
  })
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}
