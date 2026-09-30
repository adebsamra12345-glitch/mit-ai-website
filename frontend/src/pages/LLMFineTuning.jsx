import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { faqSchema, breadcrumbSchema, toJsonLd } from '../lib/schema';

const faqs = [
  {
    question: 'What is LLM fine-tuning?',
    answer: 'LLM fine-tuning is the process of further training a pre-trained large language model on a curated domain-specific dataset. This teaches the model the vocabulary, tone, and reasoning patterns of a specific industry or company, dramatically improving its accuracy and reducing hallucinations.',
  },
  {
    question: 'How is fine-tuning different from RAG?',
    answer: 'Fine-tuning bakes knowledge and behavior into the model\'s weights through additional training. RAG (Retrieval-Augmented Generation) keeps knowledge external and fetches it at query time. Fine-tuning is better for style/behavior, RAG is better for factual accuracy with frequently updated data.',
  },
  {
    question: 'How long does LLM fine-tuning take?',
    answer: 'Depending on dataset size and model complexity, fine-tuning can take anywhere from a few hours to a few days. Our team handles the entire process—data curation, training, evaluation, and deployment—typically delivering a production-ready model within 1-2 weeks.',
  },
  {
    question: 'Is my proprietary data safe during fine-tuning?',
    answer: 'Yes. We perform fine-tuning on isolated, private GPU infrastructure. Your data is never shared with or used to train any public model. We can also sign NDAs and data processing agreements as required.',
  },
]

export default function LLMFineTuning() {
  return (
    <>
      <Helmet>
        <title>LLM Fine-Tuning for B2B SaaS | Custom AI Models</title>
        <meta
          name="description"
          content="Accelerate your AI roadmap with our LLM fine-tuning services. We train custom AI models on your proprietary domain data to eliminate hallucinations and improve accuracy."
        />
        <link rel="canonical" href="https://mit-ai-technology.com/services/llm-fine-tuning" />
        <script type="application/ld+json">{toJsonLd(faqSchema(faqs))}</script>
        <script type="application/ld+json">{toJsonLd(breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services/llm-fine-tuning' },
          { name: 'LLM Fine-Tuning', url: '/services/llm-fine-tuning' },
        ]))}</script>
      </Helmet>

      <Header onOpenConsultation={() => {}} />
      
      <main className="finetuning-landing-page">
        {/* Hero Section */}
        <section className="hero" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f0fdf4' }}>
          <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#111827' }}>Custom LLM Fine-Tuning Services for B2B SaaS</h1>
            <h2 style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '2rem' }}>
              Generic models don't understand your domain. We fine-tune LLMs on your proprietary data to deliver highly accurate, industry-specific AI features without the overhead of an in-house ML team.
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#16a34a', color: '#fff', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Schedule an AI Audit</button>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#16a34a', border: '1px solid #16a34a', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>See Pricing & ROI</button>
            </div>
          </div>
        </section>

        {/* Agitation / The Cost of Generic Models */}
        <section className="problem" style={{ padding: '4rem 2rem' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1.5rem', textAlign: 'center' }}>The Hidden Cost of Using Generic AI Models</h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
              Plugging GPT-4 into your SaaS is easy. Making it sound like your brand, understand your internal jargon, and perform specialized B2B workflows is incredibly hard.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
              <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '2rem', borderTop: '4px solid #ef4444', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Dangerous Hallucinations</h3>
                <p style={{ color: '#4b5563' }}>Off-the-shelf models invent facts when dealing with highly technical or legal domain concepts, ruining trust with your users.</p>
              </div>
              <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '2rem', borderTop: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tone & Formatting Issues</h3>
                <p style={{ color: '#4b5563' }}>Generic LLMs struggle to match the specific JSON schemas, tone of voice, or reporting structures your software requires.</p>
              </div>
              <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '2rem', borderTop: '4px solid #3b82f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>High Inference Costs</h3>
                <p style={{ color: '#4b5563' }}>Relying heavily on prompt engineering with massive context windows drastically increases your API costs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution / Process Section */}
        <section className="solution" style={{ padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>How Our Fine-Tuning Process Works</h2>
            
            <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '1.5rem', marginLeft: '1rem' }}>
              <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.1rem', top: '0', backgroundColor: '#16a34a', color: '#fff', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Data Curation & Formatting</h3>
                <p style={{ color: '#4b5563' }}>We take your raw logs, documents, and interactions, and structure them into high-quality instruction-response datasets.</p>
              </div>
              <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.1rem', top: '0', backgroundColor: '#16a34a', color: '#fff', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Model Selection & Training</h3>
                <p style={{ color: '#4b5563' }}>We select the best open-weight model (Llama 3, Mistral, etc.) and apply parameter-efficient fine-tuning (PEFT/LoRA) on secure GPUs.</p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.1rem', top: '0', backgroundColor: '#16a34a', color: '#fff', width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Evaluation & Deployment</h3>
                <p style={{ color: '#4b5563' }}>We rigorously evaluate the model against your baseline metrics before securely deploying it behind an API endpoint for your SaaS.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ROI / Business Case */}
        <section className="roi" style={{ padding: '4rem 2rem' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1.5rem' }}>The ROI of Custom AI Models</h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
              Hiring a senior ML engineer costs $180k+/year and takes months to yield results. Our fine-tuning service delivers a production-ready model in a fraction of the time, dramatically reducing your time-to-market.
            </p>
            <button style={{ padding: '1rem 2rem', backgroundColor: '#111827', color: '#fff', borderRadius: '0.375rem', fontSize: '1.125rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Talk to an ML Expert</button>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
