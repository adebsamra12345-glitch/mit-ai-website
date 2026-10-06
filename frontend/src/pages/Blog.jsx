import { useMemo, useState } from 'react'
import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import PostCard from '../components/blog/PostCard.jsx'
import { categories, posts } from '../data/posts/index.js'
import { blogSchema, breadcrumbSchema } from '../lib/schema.js'

const ALL = 'الكل'

export default function Blog() {
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      if (category !== ALL && p.category !== category) return false
      if (!q) return true
      return [p.title, p.description, ...p.tags].join(' ').toLowerCase().includes(q)
    })
  }, [category, query])

  const [featured, ...rest] = visible

  return (
    <Layout mainClass="blog-page">
      <Seo
        title="مدونة الذكاء الاصطناعي | تدريب LLM وربط Claude و OpenAI API — Mit AI"
        description="تقارير وأدلة عملية عن تدريب نماذج LLM محليًا، ضبط QLoRA، تشغيل Ollama و vLLM، وربط Claude API و OpenAI API وبناء أنظمة RAG للشركات."
        path="/blog"
        schemas={[blogSchema(posts), breadcrumbSchema([{ name: 'الرئيسية', url: '/' }, { name: 'المدونة', url: '/blog' }])]}
      />

      <section className="page-hero">
        <div className="container">
          <Reveal as="span" className="eyebrow">مدونة Mit AI</Reveal>
          <Reveal as="h1" delay={80}>مدونة الذكاء الاصطناعي العملية</Reveal>
          <Reveal as="p" delay={160}>
            أدلة وتقارير من الميدان: تدريب النماذج محليًا، ربط الـ APIs، بناء RAG، ونشر حلول ذكاء اصطناعي حقيقية.
          </Reveal>
          <Reveal className="blog-tools" delay={240}>
            <label className="search">
              <span className="sr-only">ابحث في المقالات</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث: QLoRA، Claude، RAG…" />
            </label>
            <div className="filters" role="group" aria-label="تصفية حسب التصنيف">
              {[ALL, ...categories].map((c) => (
                <button key={c} type="button" className={c === category ? 'is-active' : ''} aria-pressed={c === category} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="blog-list">
        <div className="container">
          {visible.length === 0 ? (
            <p className="empty">لا توجد مقالات مطابقة لبحثك.</p>
          ) : (
            <>
              <Reveal><PostCard post={featured} featured /></Reveal>
              <div className="posts-grid">
                {rest.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 100}><PostCard post={p} /></Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
