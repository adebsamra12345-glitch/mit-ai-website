import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { softwareSchema, breadcrumbSchema, toJsonLd } from '../lib/schema';

export default function AISearchAPI() {
  return (
    <>
      <Helmet>
        <title>AI Search API for E-commerce &amp; SaaS | Boost Conversions</title>
        <meta
          name="description"
          content="Integrate our powerful AI Search API into your e-commerce or SaaS platform. Deliver semantic, typo-tolerant search results that increase sales and user retention."
        />
        <link rel="canonical" href="https://mit-ai-technology.com/services/ai-search-api" />
        <script type="application/ld+json">{toJsonLd(softwareSchema({
          name: 'Mit AI Semantic Search API',
          description: 'A semantic AI Search API for B2B SaaS and e-commerce platforms. Delivers typo-tolerant, intent-aware search results using vector embeddings with sub-50ms latency.',
          url: '/services/ai-search-api',
          category: 'DeveloperApplication',
        }))}</script>
        <script type="application/ld+json">{toJsonLd(breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services/ai-search-api' },
          { name: 'AI Search API', url: '/services/ai-search-api' },
        ]))}</script>
      </Helmet>

      <Header onOpenConsultation={() => {}} />
      
      <main className="api-landing-page">
        {/* Hero Section */}
        <section className="hero" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#fdf4ff' }}>
          <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#111827' }}>AI Search API for E-commerce & B2B SaaS</h1>
            <h2 style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '2rem' }}>
              Replace your outdated keyword search in an afternoon. Our Semantic Search API understands user intent, handles typos, and drives massive conversion uplifts.
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#c026d3', color: '#fff', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Get API Keys</button>
              <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#c026d3', border: '1px solid #c026d3', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>Read Documentation</button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features" style={{ padding: '4rem 2rem' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '3rem', textAlign: 'center' }}>Built for Conversion and Speed</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #c026d3' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>Semantic Intent Matching</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>If a user searches for "winter coat," our API knows to show "cold weather jackets." We match meaning, not just letters.</p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #c026d3' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>Typo Tolerance</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Don't lose sales to fat fingers. Our vector embeddings automatically correct and map misspelled queries to the right products.</p>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid #c026d3' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#111827', marginBottom: '1rem' }}>Sub-50ms Latency</h3>
                <p style={{ color: '#4b5563', lineHeight: '1.6' }}>Deployed on edge networks globally. Your search bar will feel instant, keeping shoppers engaged and reducing bounce rates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Experience */}
        <section className="developer" style={{ padding: '4rem 2rem', backgroundColor: '#111827', color: '#fff' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Developer-First Integration</h2>
            <p style={{ fontSize: '1.125rem', color: '#9ca3af', marginBottom: '2rem', textAlign: 'center' }}>
              Swap out your old search in hours. We provide SDKs for React, Node, Python, and straightforward REST endpoints.
            </p>
            <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: '#a78bfa' }}>
              <p>const results = await aiSearch.query(&#123;</p>
              <p>&nbsp;&nbsp;index: 'product_catalog',</p>
              <p>&nbsp;&nbsp;query: 'waterproof running shoes',</p>
              <p>&nbsp;&nbsp;limit: 10</p>
              <p>&#125;);</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
