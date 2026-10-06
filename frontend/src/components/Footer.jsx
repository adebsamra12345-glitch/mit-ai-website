import { Link } from 'react-router-dom'
import logo from '../assets/mit-logo.webp'
import { CONTACT } from '../config.js'
import { services, servicePath } from '../data/services.js'
import { posts, postPath } from '../data/posts/index.js'

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src={logo} alt="" className="brand-logo" width="40" height="35" />
              <span className="brand-name">Mit AI Technology</span>
            </Link>
            <p>شركة التحول الذكي للأنظمة — نحوّل التقنيات المعقدة إلى حلول عملية لأعمالك.</p>
          </div>

          <nav className="footer-col" aria-label="روابط سريعة">
            <span className="title">روابط سريعة</span>
            <Link to="/#services">الخدمات</Link>
            <Link to="/blog">المدونة</Link>
            <Link to="/#about">من نحن</Link>
            <Link to="/#assistant">المساعد الرقمي</Link>
          </nav>

          <nav className="footer-col" aria-label="الخدمات">
            <span className="title">الخدمات</span>
            {services.map((s) => (
              <Link key={s.slug} to={servicePath(s)} dir="ltr">{s.nav}</Link>
            ))}
          </nav>

          <nav className="footer-col" aria-label="أحدث المقالات">
            <span className="title">أحدث المقالات</span>
            {posts.slice(0, 4).map((p) => (
              <Link key={p.slug} to={postPath(p)} dir={p.lang === 'ar' ? 'rtl' : 'ltr'} className="footer-post">{p.title}</Link>
            ))}
          </nav>

          <div className="footer-col">
            <span className="title">تواصل معنا</span>
            <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phone}`} dir="ltr">{CONTACT.phone}</a>
          </div>
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} Mit AI Technology. جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  )
}
