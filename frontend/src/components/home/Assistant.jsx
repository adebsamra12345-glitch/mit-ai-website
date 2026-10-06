import Reveal from '../Reveal.jsx'
import Robot from '../Robot.jsx'
import NeuralBg from '../NeuralBg.jsx'

const POINTS = [
  'يرحب بالزوار ويجيب فورًا على أسئلتهم',
  'يدعم المحادثة الصوتية والنصية معًا',
  'يتحدث بلغة عملائك ويعرف تفاصيل عملك',
]

export default function Assistant() {
  return (
    <section id="assistant" className="assistant">
      <NeuralBg />
      <div className="container assistant-grid">
        <Reveal effect="right" className="assistant-copy">
          <span className="eyebrow">أول من يقابل زوار موقعك</span>
          <h2>مساعدك الرقمي بشخصية Mit</h2>
          <p>
            شخصية Mit الروبوتية هي الوجه الرقمي لعلامتك — مدرّبة لتجيب عن استفسارات زوار موقعك بالشات والمكالمات
            الصوتية، وتكون أول منتج يتعرف عليه العميل عند دخوله للموقع. جرّبها الآن من زر المحادثة أسفل الصفحة.
          </p>
          <ul className="assistant-list">
            {POINTS.map((p, i) => (
              <li key={p} style={{ '--i': i }}><span className="dot" />{p}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal effect="left" className="assistant-stage">
          <Robot chips={false} size="md" />
          <div className="assistant-bubble">
            <div className="name">Mit</div>
            <div className="msg">أهلاً بك! كيف أقدر أساعدك اليوم؟ 👋</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
