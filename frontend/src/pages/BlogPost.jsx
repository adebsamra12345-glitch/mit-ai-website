import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import ArticleBody from '../components/blog/ArticleBody.jsx'
import PostCard from '../components/blog/PostCard.jsx'
import ReadingProgress from '../components/blog/ReadingProgress.jsx'
import NotFound from './NotFound.jsx'
import { useConsultation } from '../context/Consultation.jsx'
import { getPost, posts, postPath } from '../data/posts/index.js'
import { articleSchema, breadcrumbSchema, faqSchema } from '../lib/schema.js'
import { formatDate, readTimeLabel } from '../lib/format.js'

const UI = {
  ar: { home: 'الرئيسية', blog: 'المدونة', updated: 'آخر تحديث', faq: 'أسئلة شائعة', related: 'اقرأ أيضًا', ctaTitle: 'تريد تطبيق ذلك في مشروعك؟', ctaText: 'فريقنا يساعدك من التخطيط حتى التشغيل. احجز استشارة مجانية.', cta: 'احجز استشارة مجانية' },
  en: { home: 'Home', blog: 'Blog', updated: 'Last updated', faq: 'FAQ', related: 'Keep reading', ctaTitle: 'Want this in your product?', ctaText: 'Our team can help from planning to production. Book a free consultation.', cta: 'Book a free consultation' },
}

export default function BlogPost() {
  const { slug } = useParams()
  const { open } = useConsultation()
  const post = getPost(slug)
  if (!post) return <NotFound />

  const ui = UI[post.lang]
  const path = postPath(post)
  const related = posts.filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))).slice(0, 3)
  const schemas = [
    articleSchema({ headline: post.title, description: post.description, url: path, datePublished: post.date, dateModified: post.updated, inLanguage: post.lang, keywords: post.tags }),
    breadcrumbSchema([{ name: ui.home, url: '/' }, { name: ui.blog, url: '/blog' }, { name: post.title, url: path }]),
  ]
  if (post.faqs?.length) schemas.push(faqSchema(post.faqs))

  return (
    <Layout mainClass="post-page">
      <Seo title={`${post.title} | Mit AI`} description={post.description} path={path} type="article" lang={post.lang} schemas={schemas} published={post.date} modified={post.updated} />
      <ReadingProgress />

      <article dir={post.lang === 'ar' ? 'rtl' : 'ltr'} lang={post.lang}>
        <header className="post-hero">
          <div className="container narrow">
            <nav className="breadcrumbs" aria-label="breadcrumb">
              <Link to="/">{ui.home}</Link><span aria-hidden="true">/</span>
              <Link to="/blog">{ui.blog}</Link><span aria-hidden="true">/</span>
              <span>{post.category}</span>
            </nav>
            <h1 className="anim-rise">{post.title}</h1>
            <p className="post-lead anim-rise" style={{ '--d': '120ms' }}>{post.description}</p>
            <div className="post-meta anim-rise" style={{ '--d': '220ms' }}>
              <span className="chip">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date, post.lang)}</time>
              <span aria-hidden="true">·</span>
              <span>{readTimeLabel(post.readMinutes, post.lang)}</span>
              {post.updated !== post.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{ui.updated}: <time dateTime={post.updated}>{formatDate(post.updated, post.lang)}</time></span>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="container narrow post-content">
          <ArticleBody body={post.body} tocLabel={post.lang === 'ar' ? 'محتويات المقال' : 'Contents'} />

          {post.faqs?.length > 0 && (
            <section className="post-faq">
              <h2>{ui.faq}</h2>
              {post.faqs.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </section>
          )}

          <Reveal effect="zoom" className="post-cta">
            <h2>{post.cta?.title || ui.ctaTitle}</h2>
            <p>{post.cta?.text || ui.ctaText}</p>
            <div className="post-cta-actions">
              {post.cta?.links?.map((l) => <Link key={l.to} to={l.to} className="btn btn-light">{l.label}</Link>)}
              <button type="button" className="btn btn-primary btn-shine" onClick={open}>{ui.cta}</button>
            </div>
          </Reveal>
        </div>
      </article>

      {related.length > 0 && (
        <section className="related">
          <div className="container">
            <Reveal as="h2" className="section-title">{ui.related}</Reveal>
            <div className="posts-grid">
              {related.map((p, i) => <Reveal key={p.slug} delay={i * 100}><PostCard post={p} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
