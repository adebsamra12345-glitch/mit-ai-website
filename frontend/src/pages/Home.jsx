import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import Hero from '../components/home/Hero.jsx'
import Marquee from '../components/home/Marquee.jsx'
import Intro from '../components/home/Intro.jsx'
import WhyUs from '../components/home/WhyUs.jsx'
import Services from '../components/home/Services.jsx'
import Assistant from '../components/home/Assistant.jsx'
import LatestPosts from '../components/home/LatestPosts.jsx'
import About from '../components/home/About.jsx'
import CTA from '../components/home/CTA.jsx'
import { organizationSchema, websiteSchema } from '../lib/schema.js'

export default function Home() {
  return (
    <Layout>
      <Seo
        title="Mit AI Technology | حلول الذكاء الاصطناعي: RAG وتدريب النماذج وبحث ذكي"
        description="Mit AI Technology: حلول RAG للشركات، تدريب وضبط نماذج LLM، مساعدات رقمية بالعربية، ومدونة عملية عن ربط Claude API و OpenAI API وتشغيل النماذج محليًا."
        path="/"
        schemas={[organizationSchema, websiteSchema]}
      />
      <Hero />
      <Marquee />
      <Intro />
      <WhyUs />
      <Services />
      <Assistant />
      <LatestPosts />
      <About />
      <CTA />
    </Layout>
  )
}
