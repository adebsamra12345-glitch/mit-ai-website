import mascot from '../assets/mascot.jpg'

export default function Assistant() {
  return (
    <section id="assistant" className="assistant">
      <div className="container">
        <div className="assistant-copy">
          <span className="eyebrow">أول من يقابل زوار موقعك</span>
          <h2>مساعدك الرقمي بشخصية Mit</h2>
          <p>
            شخصية Mit الروبوتية هي الوجه الرقمي لعلامتك — مدرّبة على نموذج
            Qwen 2.5 لترد على استفسارات زوار موقعك بالشات والمكالمات الصوتية،
            وتكون أول منتج يتعرف عليه العميل عند دخوله للموقع.
          </p>
          <ul className="assistant-list">
            <li><span className="dot" />يرحب بالزوار ويجيب فورًا على أسئلتهم</li>
            <li><span className="dot" />يدعم المحادثة الصوتية والنصية معًا</li>
            <li><span className="dot" />يتحدث بلغة عملائك ويعرف تفاصيل عملك</li>
          </ul>
        </div>

        <div className="assistant-card">
          <img src={mascot} alt="شخصية Mit المساعدة" />
          <div className="assistant-bubble">
            <div className="name">Mit</div>
            <div className="msg">أهلاً بك! كيف أقدر أساعدك اليوم؟ 👋</div>
          </div>
        </div>
      </div>
    </section>
  )
}
