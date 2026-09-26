export default function CTA({ onOpenConsultation }) {
  return (
    <section className="cta">
      <div className="container">
        <h2>جاهز تبدأ رحلتك مع الذكاء الاصطناعي؟</h2>
        <p>احجز استشارة مجانية مع فريقنا ودعنا نصمم لك الحل الأنسب لعملك.</p>
        <button
          type="button"
          onClick={onOpenConsultation}
          className="btn"
        >
          احجز استشارتك الآن
        </button>
      </div>
    </section>
  )
}
