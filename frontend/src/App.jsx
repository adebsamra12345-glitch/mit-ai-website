import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhyUs from './components/WhyUs.jsx'
import Services from './components/Services.jsx'
import Assistant from './components/Assistant.jsx'
import About from './components/About.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import ConsultationModal from './components/ConsultationModal.jsx'
import EnterpriseRAG from './pages/EnterpriseRAG.jsx'
import LLMFineTuning from './pages/LLMFineTuning.jsx'
import ImproveSearchAI from './pages/ImproveSearchAI.jsx'
import RAGvsFineTuning from './pages/RAGvsFineTuning.jsx'
import AISearchAPI from './pages/AISearchAPI.jsx'
import { organizationSchema, websiteSchema, toJsonLd } from './lib/schema.js'

function Home({ setModalOpen }) {
  return (
    <>
      <Helmet>
        <title>Mit AI Technology | Enterprise RAG, LLM Fine-Tuning & AI Search</title>
        <meta
          name="description"
          content="Mit AI Technology delivers enterprise RAG solutions, custom LLM fine-tuning, and AI-powered search APIs for B2B SaaS companies. Get started with a free consultation."
        />
        <link rel="canonical" href="https://mit-ai-technology.com/" />
        <script type="application/ld+json">{toJsonLd(organizationSchema)}</script>
        <script type="application/ld+json">{toJsonLd(websiteSchema)}</script>
      </Helmet>
      <Header onOpenConsultation={() => setModalOpen(true)} />
      <main>
        <Hero onOpenConsultation={() => setModalOpen(true)} />
        <section className="intro">
          <div className="container intro-inner">
            <p>
              في <strong>Mit AI Technology</strong>، نحوّل التقنيات المعقدة إلى حلول عملية
              وسهلة الاستخدام. لا تحتاج أن تكون خبيرًا تقنيًا لتستفيد من قوة الذكاء
              الاصطناعي — نحن نتولى الجانب التقني، وأنت تحصل على النتائج.
            </p>
          </div>
        </section>
        <WhyUs />
        <Services />
        <Assistant />
        <About />
        <CTA onOpenConsultation={() => setModalOpen(true)} />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home setModalOpen={setModalOpen} />} />
          <Route path="/services/enterprise-rag-solutions" element={<EnterpriseRAG />} />
          <Route path="/services/llm-fine-tuning" element={<LLMFineTuning />} />
          <Route path="/blog/improve-website-search-with-ai" element={<ImproveSearchAI />} />
          <Route path="/blog/rag-vs-fine-tuning-for-enterprise" element={<RAGvsFineTuning />} />
          <Route path="/services/ai-search-api" element={<AISearchAPI />} />
        </Routes>
        <ChatWidget />
        <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </Router>
    </HelmetProvider>
  )
}
