import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { faqSchema, breadcrumbSchema, toJsonLd } from '../lib/schema';

const faqs = [
  {
    question: 'What is RAG in AI?',
    answer: 'Retrieval-Augmented Generation (RAG) is a technique that improves the accuracy of LLMs by fetching relevant information from an external, secure database before generating an answer. Unlike fine-tuning, RAG does not require retraining the model when your data changes.',
  },
  {
    question: 'Is enterprise RAG secure for B2B SaaS?',
    answer: 'Yes. Our enterprise RAG solutions are designed with tenant isolation and strict data governance, ensuring Client A cannot access Client B\'s vector embeddings. Your data never trains public models.',
  },
  {
    question: 'RAG vs Fine-Tuning: Which is better for enterprise?',
    answer: 'RAG is best for injecting factual, frequently updating knowledge into AI (like search). Fine-tuning is better for teaching the model a specific tone or behavior. For most B2B SaaS search use cases, RAG is the recommended approach.',
  },
  {
    question: 'How long does it take to implement an enterprise RAG solution?',
    answer: 'Our enterprise RAG solutions can be integrated in as little as a few days using our API. Full custom implementations with dedicated vector databases and role-based access controls typically take 2-4 weeks.',
  },
]

export default function EnterpriseRAG() {
  return (
    <>
      <Helmet>
        <title>Enterprise RAG Solutions | Secure AI Search for B2B SaaS</title>
        <meta
          name="description"
          content="Upgrade your SaaS with our enterprise RAG solutions. Deliver highly relevant, secure, and hallucination-free AI search experiences to your B2B customers."
        />
        <link rel="canonical" href="https://mit-ai-technology.com/services/enterprise-rag-solutions" />
        <script type="application/ld+json">{toJsonLd(faqSchema(faqs))}</script>
        <script type="application/ld+json">{toJsonLd(breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services/enterprise-rag-solutions' },
          { name: 'Enterprise RAG Solutions', url: '/services/enterprise-rag-solutions' },
        ]))}</script>
      </Helmet>

      <Header onOpenConsultation={() => {}} />
      
      <main className="rag-landing-page">
        {/* Hero Section */}
        <section className="hero" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f9fafb' }}>
          <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#111827' }}>Secure Enterprise RAG Solutions for B2B SaaS</h1>
            <h2 style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '2rem' }}>
              Stop losing users to bad search. Implement Retrieval-Augmented Generation that understands context, respects data privacy, and integrates in days, not months.
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Book a Technical Demo</button>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>Read the API Docs</button>
            </div>
          </div>
        </section>

        {/* Agitation Section */}
        <section className="problem" style={{ padding: '4rem 2rem' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1.5rem', textAlign: 'center' }}>Why Your Current Search is Costing You Revenue</h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '2rem', textAlign: 'center' }}>
              Traditional lexical search relies on exact keyword matching. When your B2B customers search for "export financial report," but your UI says "download revenue ledger," they get zero results. This friction leads to churn.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#fff', padding: '1rem 2rem', borderLeft: '4px solid #ef4444', width: '100%', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <strong>0-Result Dead Ends:</strong> Frustrating user experiences that lower retention.
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1rem 2rem', borderLeft: '4px solid #f59e0b', width: '100%', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <strong>Irrelevant Matches:</strong> Wasting users' time sorting through bad data.
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1rem 2rem', borderLeft: '4px solid #3b82f6', width: '100%', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <strong>Lack of Context:</strong> Standard search cannot understand intent or complex queries.
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="solution" style={{ padding: '4rem 2rem', backgroundColor: '#eff6ff' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1.5rem', textAlign: 'center' }}>Next-Generation Semantic Search Powered by RAG</h2>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
              Our Enterprise RAG (Retrieval-Augmented Generation) solutions transform how users interact with your platform. By connecting large language models (LLMs) directly to your secure proprietary data, we deliver intelligent, context-aware answers instantly.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>100% Data Privacy & Security</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Built for the enterprise. Your data never trains public models. We enforce strict role-based access controls (RBAC) at the vector level.</p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>Zero Hallucinations</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>By strictly grounding the AI in your B2B SaaS database, we ensure every answer provided is accurate and verifiable with citations.</p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>Ultra-Low Latency</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>B2B software demands speed. Our optimized vector infrastructure delivers search results and generated answers in milliseconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq" style={{ padding: '4rem 2rem', backgroundColor: '#fff' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
            
            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>What is RAG in AI?</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Retrieval-Augmented Generation (RAG) is a technique that improves the accuracy of LLMs by fetching relevant information from an external, secure database before generating an answer.</p>
            </div>
            
            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>Is it secure for B2B SaaS?</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Yes. Our enterprise RAG solutions are designed with tenant isolation and strict data governance, ensuring Client A cannot access Client B's vector embeddings.</p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>RAG vs Fine-Tuning: Which is better?</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>RAG is best for injecting factual, frequently updating knowledge into AI (like search). Fine-tuning is better for teaching the model a specific tone or behavior. We offer both depending on your needs.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
