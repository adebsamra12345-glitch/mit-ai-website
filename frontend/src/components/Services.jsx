import { Link } from 'react-router-dom'
import mascot from '../assets/mascot.jpg'

const services = [
  {
    visual: 'image',
    title: 'مساعد ذكي يرد على عملائك',
    text: 'رد فوري وذكي على استفسارات عملائك عبر الشات أو المكالمات الصوتية، على مدار الساعة. نموذج مدرب خصيصًا ليتحدث بلغة عملائك ويفهم احتياجاتهم.',
    gradient: 'linear-gradient(135deg,#5b7c99,#2c3e4f)',
    link: '/services/llm-fine-tuning',
    linkLabel: 'Learn about LLM Fine-Tuning →',
  },
  {
    visual: '📊',
    title: 'تقارير وتحليلات تلقائية',
    text: 'بدل ما تقضي ساعات بتحليل البيانات يدويًا، نبني لك نظامًا يحلل بياناتك وينشئ تقارير جاهزة، بدقة وسرعة تختصر عليك الوقت والجهد.',
    gradient: 'linear-gradient(135deg,#6f93ad,#3d5a72)',
    link: '/services/enterprise-rag-solutions',
    linkLabel: 'Learn about Enterprise RAG →',
  },
  {
    visual: '🔍',
    title: 'بحث وتوصيات أذكى لموقعك',
    text: 'نحسّن تجربة البحث والتوصيات في موقعك أو نظامك، لمساعدة المستخدمين على الوصول لما يبحثون عنه أسرع — وينعكس ذلك على رضا العملاء والمبيعات.',
    gradient: 'linear-gradient(135deg,#8aa6ba,#4a6b85)',
    link: '/services/ai-search-api',
    linkLabel: 'Learn about AI Search API →',
  },
]

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">خدماتنا</h2>
        <p className="section-sub">ثلاث ركائز تحوّل أعمالك بالذكاء الاصطناعي</p>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="banner" style={{ background: s.gradient }}>
                {s.visual === 'image' ? <img src={mascot} alt="" /> : s.visual}
              </div>
              <div className="body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <Link to={s.link} className="link">{s.linkLabel}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
