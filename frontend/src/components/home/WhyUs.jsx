import Reveal from '../Reveal.jsx'
import SpotlightCard from '../SpotlightCard.jsx'

const ITEMS = [
  { icon: '⚙️', title: 'خبرة عملية بأحدث النماذج', text: 'نعمل بأحدث نماذج اللغة مثل Llama وQwen وClaude، ونضبطها على بيانات عملك.' },
  { icon: '🎯', title: 'حلول مصممة خصيصًا لعملك', text: 'لا حلول جاهزة — كل نظام نبنيه يعكس طبيعة نشاطك وجمهورك.' },
  { icon: '🤝', title: 'دعم كامل من التخطيط حتى التشغيل', text: 'نرافقك من الفكرة الأولى إلى الإطلاق والتشغيل والصيانة المستمرة.' },
]

export default function WhyUs() {
  return (
    <section id="why">
      <div className="container">
        <Reveal as="h2" className="section-title">لماذا Mit؟</Reveal>
        <div className="why-grid">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 110}>
              <SpotlightCard className="why-card">
                <div className="icon">{it.icon}</div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
