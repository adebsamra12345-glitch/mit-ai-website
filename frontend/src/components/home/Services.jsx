import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import SpotlightCard from '../SpotlightCard.jsx'
import { servicePath, services } from '../../data/services.js'

const CARDS = [
  { slug: 'llm-fine-tuning', title: 'مساعد ذكي يرد على عملائك', text: 'رد فوري وذكي على استفسارات عملائك عبر الشات أو المكالمات الصوتية على مدار الساعة، بنموذج مدرب ليتحدث بلغة عملائك ويفهم احتياجاتهم.', icon: '🤖', cta: 'تعرف على LLM Fine-Tuning' },
  { slug: 'enterprise-rag-solutions', title: 'تقارير وتحليلات تلقائية', text: 'بدل ساعات من تحليل البيانات يدويًا، نبني نظامًا يحلل بياناتك ويجيب عن أسئلتك بالاعتماد على مستنداتك، بدقة وسرعة.', icon: '📊', cta: 'تعرف على Enterprise RAG' },
  { slug: 'ai-search-api', title: 'بحث وتوصيات أذكى لموقعك', text: 'نحسّن تجربة البحث والتوصيات في موقعك ليصل المستخدمون لما يبحثون عنه أسرع، فيرتفع رضا العملاء والمبيعات.', icon: '🔍', cta: 'تعرف على AI Search API' },
]

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <Reveal as="h2" className="section-title">خدماتنا</Reveal>
        <Reveal as="p" className="section-sub" delay={80}>ثلاث ركائز تحوّل أعمالك بالذكاء الاصطناعي</Reveal>
        <div className="services-grid">
          {CARDS.map((c, i) => {
            const service = services.find((s) => s.slug === c.slug)
            return (
              <Reveal key={c.slug} delay={i * 120}>
                <SpotlightCard as="article" className="service-card">
                  <div className={`banner banner-${i + 1}`}>
                    <span className="banner-icon" aria-hidden="true">{c.icon}</span>
                  </div>
                  <div className="body">
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <Link to={servicePath(service)} className="link">{c.cta} <span aria-hidden="true">←</span></Link>
                  </div>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
