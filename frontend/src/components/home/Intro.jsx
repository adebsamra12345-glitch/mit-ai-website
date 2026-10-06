import Reveal from '../Reveal.jsx'
import { useCountUp } from '../../hooks/useReveal.js'
import { posts } from '../../data/posts/index.js'
import { services } from '../../data/services.js'

function Counter({ value, suffix = '', label }) {
  const ref = useCountUp(value)
  return (
    <div className="stat">
      <div className="stat-value"><span ref={ref}>{value}</span>{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Intro() {
  return (
    <section className="intro">
      <div className="container">
        <Reveal as="p" className="intro-text">
          في <strong>Mit AI Technology</strong>، نحوّل التقنيات المعقدة إلى حلول عملية وسهلة الاستخدام. لا تحتاج أن
          تكون خبيرًا تقنيًا لتستفيد من قوة الذكاء الاصطناعي — نحن نتولى الجانب التقني، وأنت تحصل على النتائج.
        </Reveal>
        <Reveal className="stats" delay={120}>
          <Counter value={services.length} label="خدمات أساسية" />
          <Counter value={posts.length} label="مقالات تقنية في المدونة" />
          <div className="stat">
            <div className="stat-value" dir="ltr">24/7</div>
            <div className="stat-label">مساعد رقمي متاح دائمًا</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
