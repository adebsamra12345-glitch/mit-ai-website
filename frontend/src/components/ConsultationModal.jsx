import { useState, useEffect } from 'react'
import { submitContactInquiry } from '../lib/assistantClient.js'

export default function ConsultationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'general_consultation',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await submitContactInquiry(formData)
      setSuccess(res.message || 'تم إرسال طلبك بنجاح!')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: 'general_consultation',
        message: '',
      })
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>احجز استشارة مجانية مع فريق Mit AI</h3>
            <p className="modal-subtitle">دعنا نساعدك في تصميم الحل الذكي الأنسب لأعمالك</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="إغلاق النافذة">
            ✕
          </button>
        </div>

        {success ? (
          <div className="modal-success-box">
            <div className="success-icon">✓</div>
            <h4>شكرًا لتواصلك معنا!</h4>
            <p>{success}</p>
            <button className="btn btn-primary" onClick={onClose}>
              إغلاق النافذة
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            {error && <div className="form-alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد العلي"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>رقم الهاتف / واتساب *</label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0993448083"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="مثال: name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>اسم الشركة أو النشاط</label>
                <input
                  type="text"
                  placeholder="مثال: شركة النور للتجارة"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>الخدمة التي تهمك</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="general_consultation">استشارة عامة في التحول الذكي</option>
                <option value="conversational_ai">حلول المحادثة الذكية والمساعدين الرقميين</option>
                <option value="data_analytics">تحليل البيانات والأنظمة التنبؤية</option>
                <option value="custom_ai">حلول الذكاء الاصطناعي المخصصة وأتمتة مسارات العمل</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div className="form-group">
              <label>تفاصيل المشروع أو الاستفسار</label>
              <textarea
                rows="3"
                placeholder="أخبرنا باختصار عن التحدي أو الفكرة التي تريد تحقيقها..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'جارٍ الإرسال...' : 'تأكيد حجز الاستشارة'}
              </button>
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
