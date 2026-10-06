// Client for the Mit assistant and the Django backend.
//
//   askAssistant          POST /api/chat/     chat messages
//   submitContactInquiry  POST /api/contact/  consultation requests
//   checkBackendHealth    GET  /api/health/   server status

const CHAT_URL = import.meta.env.VITE_ASSISTANT_API_URL || '/api/chat/'
const SESSION_KEY = 'mit_chat_session_id'
const REQUEST_TIMEOUT_MS = 30000

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' }

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function writeSession(id) {
  try {
    localStorage.setItem(SESSION_KEY, id)
  } catch {
    /* storage unavailable (private mode) — the session simply isn't persisted */
  }
}

async function postJson(url, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Sends a chat message. Resolves with the reply text; falls back to a canned
 * reply when the backend is unreachable so the widget never dead-ends.
 */
export async function askAssistant(message) {
  try {
    const data = await postJson(CHAT_URL, { message, sessionId: readSession() || '' })
    if (data.sessionId) writeSession(data.sessionId)
    return data.reply
  } catch (err) {
    console.warn('Assistant backend unavailable, using offline reply:', err)
    return OFFLINE_REPLY
  }
}

export function submitContactInquiry(data) {
  return postJson('/api/contact/', data)
}

export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health/')
    return await res.json()
  } catch (err) {
    return { status: 'offline', error: err.message }
  }
}

const OFFLINE_REPLY =
  'يبدو أن الاتصال بالخادم غير متاح حالياً. يمكنك حجز استشارة مجانية من الموقع أو مراسلتنا على mmitaitechnoloy@gmail.com وسنرد عليك سريعاً.'
