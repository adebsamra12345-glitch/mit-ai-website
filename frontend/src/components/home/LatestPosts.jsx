import { Link } from 'react-router-dom'
import Reveal from '../Reveal.jsx'
import PostCard from '../blog/PostCard.jsx'
import { posts } from '../../data/posts/index.js'

export default function LatestPosts() {
  return (
    <section className="latest">
      <div className="container">
        <Reveal as="h2" className="section-title">من مدونة الذكاء الاصطناعي</Reveal>
        <Reveal as="p" className="section-sub" delay={80}>
          تقارير عملية عن تدريب النماذج المحلية وربط Claude و OpenAI وبناء أنظمة RAG
        </Reveal>
        <div className="posts-grid">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 110}><PostCard post={p} /></Reveal>
          ))}
        </div>
        <Reveal className="center" delay={150}>
          <Link to="/blog" className="btn btn-outline-dark">عرض كل المقالات</Link>
        </Reveal>
      </div>
    </section>
  )
}
