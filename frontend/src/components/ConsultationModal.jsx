import { useEffect, useId, useRef, useState } from 'react'
import { submitContactInquiry } from '../lib/assistantClient.js'

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', service: 'general_consultation', message: '' }

const SERVICE_OPTIONS = [
  ['general_consultation', 'استشارة عامة في التحول الذكي'],
  ['conversational_ai', 'حلول المحادثة الذكية والمساعدين الرقميين'],
  ['data_analytics', 'تحليل البيانات والأنظمة التنبؤية'],
  ['custom_ai', 'حلول الذكاء الاصطناعي المخصصة وأتمتة مسارات العمل'],
  ['other', 'أخرى'],
]

function Field({ label, children }) {
  const id = useId()
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </div>
  )
}

export default function ConsultationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const firstField = useRef(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.body.classList.add('no-scroll')
    window.addEventListener('keydown', onKey)
    firstField.current?.focus()
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await submitContactInquiry(form)
      setSuccess(res.message || 'تم إرسال طلبك بنجاح!')
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setSuccess(null)
    setError(null)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-labelledby="consult-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 id="consult-title">احجز استشارة مجانية مع فريق Mit AI</h3>
            <p className="modal-subtitle">دعنا نساعدك في تصميم الحل الذكي الأنسب لأعمالك</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={close} aria-label="إغلاق النافذة">✕</button>
        </div>

        {success ? (
          <div className="modal-success-box">
            <div className="success-icon">✓</div>
            <h4>شكرًا لتواصلك معنا!</h4>
            <p>{success}</p>
            <button type="button" className="btn btn-primary" onClick={close}>إغلاق النافذة</button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            {error && <div className="form-alert-error" role="alert">{error}</div>}

            <div className="form-grid">
              <Field label="الاسم الكامل *">
                {(id) => <input id={id} ref={firstField} type="text" required autoComplete="name" placeholder="مثال: أحمد العلي" value={form.name} onChange={set('name')} />}
              </Field>
              <Field label="رقم الهاتف / واتساب *">
                {(id) => <input id={id} type="tel" required autoComplete="tel" inputMode="tel" placeholder="مثال: 0993448083" value={form.phone} onChange={set('phone')} />}
              </Field>
              <Field label="البريد الإلكتروني">
                {(id) => <input id={id} type="email" autoComplete="email" placeholder="name@company.com" value={form.email} onChange={set('email')} />}
              </Field>
              <Field label="اسم الشركة أو النشاط">
                {(id) => <input id={id} type="text" autoComplete="organization" placeholder="مثال: شركة النور للتجارة" value={form.company} onChange={set('company')} />}
              </Field>
            </div>

            <Field label="الخدمة التي تهمك">
              {(id) => (
                <select id={id} value={form.service} onChange={set('service')}>
                  {SERVICE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              )}
            </Field>

            <Field label="تفاصيل المشروع أو الاستفسار">
              {(id) => <textarea id={id} rows="3" placeholder="أخبرنا باختصار عن التحدي أو الفكرة التي تريد تحقيقها..." value={form.message} onChange={set('message')} />}
            </Field>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'جاري الإرسال…' : 'إرسال الطلب'}</button>
              <button type="button" className="btn btn-cancel" onClick={close}>إلغاء</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
