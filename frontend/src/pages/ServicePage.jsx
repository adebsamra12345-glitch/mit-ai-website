import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import SpotlightCard from '../components/SpotlightCard.jsx'
import NeuralBg from '../components/NeuralBg.jsx'
import NotFound from './NotFound.jsx'
import { useConsultation } from '../context/Consultation.jsx'
import { getService, servicePath } from '../data/services.js'
import { breadcrumbSchema, faqSchema, softwareSchema } from '../lib/schema.js'
import { renderInline } from '../lib/inline.jsx'

/** Generic landing page driven by data/services.js (English, LTR). */
export default function ServicePage() {
  const { slug } = useParams()
  const { open } = useConsultation()
  const service = getService(slug)
  if (!service) return <NotFound />

  const path = servicePath(service)
  const schemas = [
    breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Services', url: '/#services' }, { name: service.nav, url: path }]),
    service.schema === 'software'
      ? softwareSchema({ name: `Mit AI ${service.nav}`, description: service.description, url: path, category: 'DeveloperApplication' })
      : null,
    service.faqs?.length ? faqSchema(service.faqs) : null,
  ].filter(Boolean)

  return (
    <Layout mainClass="service-page">
      <Seo title={service.title} description={service.description} path={path} lang="en" schemas={schemas} />

      <div dir="ltr" lang="en">
        <section className="page-hero service-hero">
          <NeuralBg />
          <div className="container">
            <span className="eyebrow anim-rise"><span aria-hidden="true">{service.icon}</span> {service.nav}</span>
            <h1 className="anim-rise" style={{ '--d': '100ms' }}>{service.h1}</h1>
            <p className="anim-rise" style={{ '--d': '200ms' }}>{service.lead}</p>
            <div className="hero-actions anim-rise" style={{ '--d': '300ms' }}>
              <button type="button" className="btn btn-primary btn-shine" onClick={open}>{service.primaryCta}</button>
              <Link to={service.secondaryCta.to} className="btn btn-ghost">{service.secondaryCta.label}</Link>
            </div>
          </div>
        </section>

        {service.problem && (
          <section>
            <div className="container narrow-head">
              <Reveal as="h2" className="section-title">{service.problem.title}</Reveal>
              <Reveal as="p" className="section-sub" delay={80}>{service.problem.text}</Reveal>
              <div className="why-grid">
                {service.problem.items.map((it, i) => (
                  <Reveal key={it.title} delay={i * 100}>
                    <SpotlightCard className="why-card"><h3>{it.title}</h3><p>{it.text}</p></SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="services">
          <div className="container narrow-head">
            <Reveal as="h2" className="section-title">{service.featuresTitle}</Reveal>
            {service.featuresText && <Reveal as="p" className="section-sub" delay={80}>{service.featuresText}</Reveal>}
            <div className="why-grid">
              {service.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <SpotlightCard className="why-card">
                    {service.steps && <div className="step-no">{i + 1}</div>}
                    <h3>{f.title}</h3>
                    <p>{renderInline(f.text)}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {service.developer && (
          <section className="dev-section">
            <div className="container narrow-head">
              <Reveal as="h2" className="section-title light">{service.developer.title}</Reveal>
              <Reveal as="p" className="section-sub light" delay={80}>{service.developer.text}</Reveal>
              <Reveal delay={150}>
                <figure className="code-block"><figcaption><span>javascript</span></figcaption><pre><code>{service.developer.code}</code></pre></figure>
              </Reveal>
            </div>
          </section>
        )}

        <section>
          <div className="container narrow">
            <Reveal as="h2" className="section-title">Frequently Asked Questions</Reveal>
            <div className="post-faq">
              {service.faqs.map((f) => (
                <Reveal key={f.question}>
                  <details><summary>{f.question}</summary><p>{f.answer}</p></details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <Reveal effect="zoom" className="container cta-inner">
            <h2>Ready to talk to an AI engineer?</h2>
            <p>Book a free consultation and we will recommend the most cost-effective architecture for your use case.</p>
            <button type="button" className="btn btn-light btn-shine" onClick={open}>{service.primaryCta}</button>
          </Reveal>
        </section>
      </div>
    </Layout>
  )
}
