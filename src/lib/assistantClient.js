// عميل الاتصال بمساعد Mit (مدعوم بنموذج Qwen 2.5 المدرّب خصيصًا للشركة).
//
// هذا الملف يمثل نقطة التكامل بين واجهة الموقع وخادم النموذج اللغوي.
// حاليًا يعمل بوضع تجريبي (mock) يرد بردود ثابتة، لتتمكن من معاينة الموقع
// فورًا بدون خادم. عند جهوزية خادم النموذج، فعّل وضع API الحقيقي كما هو موضح
// أدناه.
//
// خطوات الربط بخادم حقيقي:
// 1) شغّل خدمة (RAG / fine-tuned Qwen 2.5) تعرض endpoint مثل:
//      POST /api/chat   Body: { message: string, sessionId?: string }
//      Response: { reply: string }
// 2) أنشئ ملف .env في جذر المشروع وأضف:
//      VITE_ASSISTANT_API_URL=https://your-api-domain.com/api/chat
// 3) بدّل USE_MOCK إلى false بالأسفل.

const USE_MOCK = true
const API_URL = import.meta.env.VITE_ASSISTANT_API_URL || '/api/chat'

const MOCK_REPLIES = [
  'يسعدني مساعدتك! هل تريد معرفة المزيد عن خدماتنا في المحادثة الذكية أم تحليل البيانات؟',
  'نقدم حلولًا مخصصة حسب طبيعة عملك — أخبرني أكثر عن نشاطك وسأرشدك للحل الأنسب.',
  'يمكنك حجز استشارة مجانية مع فريقنا عبر قسم "تواصل معنا" في أسفل الصفحة.',
]

function mockReply(userText) {
  const idx = Math.abs(hashCode(userText)) % MOCK_REPLIES.length
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_REPLIES[idx]), 700)
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

export async function askAssistant(message, sessionId) {
  if (USE_MOCK) {
    return mockReply(message)
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  })

  if (!res.ok) {
    throw new Error(`Assistant API error: ${res.status}`)
  }

  const data = await res.json()
  return data.reply
}
