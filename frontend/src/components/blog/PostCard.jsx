import { Link } from 'react-router-dom'
import SpotlightCard from '../SpotlightCard.jsx'
import { postPath } from '../../data/posts/index.js'
import { formatDate, readTimeLabel } from '../../lib/format.js'

const CATEGORY_ICONS = {
  'تدريب النماذج': '🧠',
  'النشر المحلي': '🖥️',
  'ربط الـ APIs': '🔌',
  Architecture: '🏗️',
  'Engineering & UX': '🔎',
}

export default function PostCard({ post, featured = false }) {
  const rtl = post.lang === 'ar'
  return (
    <SpotlightCard as="article" className={`post-card ${featured ? 'is-featured' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
      <Link to={postPath(post)} className="post-card-link">
        <div className={`post-cover cover-${([...post.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 5) + 1}`} aria-hidden="true">
          <span>{CATEGORY_ICONS[post.category] || '✨'}</span>
        </div>
        <div className="post-card-body">
          <span className="chip">{post.category}</span>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <div className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date, post.lang)}</time>
            <span aria-hidden="true">·</span>
            <span>{readTimeLabel(post.readMinutes, post.lang)}</span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  )
}
