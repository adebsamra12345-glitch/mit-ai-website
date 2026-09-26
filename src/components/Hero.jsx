import mascot from '../assets/mascot.jpg'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-copy">
          <span className="eyebrow">حلول ذكاء اصطناعي مخصصة لأعمالك</span>
          <h1>ذكاء اصطناعي يعمل لصالح أعمالك</h1>
          <p>
            نبني لك حلول ذكاء اصطناعي مخصصة تفهم عملاءك، تحلل بياناتك، وتساعدك
            تتخذ قرارات أسرع.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">احجز استشارة مجانية</a>
            <a href="#services" className="btn btn-outline">استكشف الخدمات</a>
          </div>
          <div className="hero-stats">
            <div>
              <div>Llama 3.1</div>
              <div>نماذج مدربة خصيصًا</div>
            </div>
            <div>
              <div>Qwen 2.5</div>
              <div>مساعد رقمي بشخصية العلامة</div>
            </div>
            <div>
              <div>24/7</div>
              <div>دعم عملاء آلي</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-frame">
            <img src={mascot} alt="المساعد الرقمي لشركة Mit AI Technology" />
          </div>
          <div className="hero-status">
            <span className="dot" />
            <span>متصل الآن — اسأل مساعد Mit</span>
          </div>
        </div>
      </div>
    </section>
  )
}
