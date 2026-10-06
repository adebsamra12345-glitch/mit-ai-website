import Reveal from '../Reveal.jsx'
import { useConsultation } from '../../context/Consultation.jsx'

export default function CTA() {
  const { open } = useConsultation()
  return (
    <section className="cta">
      <Reveal effect="zoom" className="container cta-inner">
        <h2>جاهز تبدأ رحلتك مع الذكاء الاصطناعي؟</h2>
        <p>احجز استشارة مجانية مع فريقنا ودعنا نصمم لك الحل الأنسب لعملك.</p>
        <button type="button" onClick={open} className="btn btn-light btn-shine">احجز استشارتك الآن</button>
      </Reveal>
    </section>
  )
}
