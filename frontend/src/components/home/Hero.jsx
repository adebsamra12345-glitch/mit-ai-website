import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Robot from '../Robot.jsx'
import NeuralBg from '../NeuralBg.jsx'
import { useConsultation } from '../../context/Consultation.jsx'

const WORDS = ['أعمالك', 'عملائك', 'فريقك', 'نموّك']
const FACTS = [
  { value: 'RAG + LoRA', label: 'نماذج مدربة على بياناتك' },
  { value: 'عربي / EN', label: 'مساعد رقمي بلغة عملائك' },
  { value: '24/7', label: 'دعم عملاء آلي' },
]

export default function Hero() {
  const { open } = useConsultation()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="top">
      <NeuralBg />
      <div className="hero-blob blob-1" aria-hidden="true" />
      <div className="hero-blob blob-2" aria-hidden="true" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow anim-rise" style={{ '--d': '0ms' }}>
            <span className="pulse-dot" /> حلول ذكاء اصطناعي مخصصة لأعمالك
          </span>
          <h1 className="anim-rise" style={{ '--d': '120ms' }}>
            ذكاء اصطناعي يعمل لصالح{' '}
            <span className="rotator" aria-live="polite">
              <span key={wordIndex} className="rotator-word">{WORDS[wordIndex]}</span>
            </span>
          </h1>
          <p className="anim-rise" style={{ '--d': '240ms' }}>
            نبني لك حلول ذكاء اصطناعي مخصصة تفهم عملاءك، تحلل بياناتك، وتساعدك تتخذ قرارات أسرع.
          </p>
          <div className="hero-actions anim-rise" style={{ '--d': '360ms' }}>
            <button type="button" onClick={open} className="btn btn-primary btn-shine">احجز استشارة مجانية</button>
            <Link to="/blog" className="btn btn-ghost">اقرأ المدونة</Link>
          </div>
          <dl className="hero-facts anim-rise" style={{ '--d': '480ms' }}>
            {FACTS.map((f) => (
              <div key={f.value}>
                <dt><bdi dir="ltr">{f.value}</bdi></dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-visual anim-zoom" style={{ '--d': '200ms' }}>
          <Robot />
          <div className="hero-status">
            <span className="pulse-dot" />
            <span>متصل الآن — اسأل مساعد Mit</span>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true"><span /></div>
    </section>
  )
}
