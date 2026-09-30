import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-mark">M</div>
              <span className="brand-name">Mit AI Technology</span>
            </div>
            <p>شركة التحول الذكي للأنظمة — نحوّل التقنيات المعقدة إلى حلول عملية لأعمالك.</p>
          </div>

          {/* Quick Links (homepage anchors) */}
          <div className="footer-col">
            <span className="title">روابط سريعة</span>
            <a href="/#services">الخدمات</a>
            <a href="/#about">من نحن</a>
            <a href="/#assistant">المساعد الرقمي</a>
          </div>

          {/* Services Column — key for internal linking */}
          <div className="footer-col">
            <span className="title">Services</span>
            <Link to="/services/enterprise-rag-solutions">Enterprise RAG Solutions</Link>
            <Link to="/services/llm-fine-tuning">LLM Fine-Tuning</Link>
            <Link to="/services/ai-search-api">AI Search API</Link>
          </div>

          {/* Blog Column — drives PageRank to informational content */}
          <div className="footer-col">
            <span className="title">Blog</span>
            <Link to="/blog/improve-website-search-with-ai">Improve Search with AI</Link>
            <Link to="/blog/rag-vs-fine-tuning-for-enterprise">RAG vs Fine-Tuning</Link>
          </div>

          {/* Contact Column */}
          <div className="footer-col">
            <span className="title">تواصل معنا</span>
            <a href="mailto:mmitaitechnoloy@gmail.com">mmitaitechnoloy@gmail.com</a>
            <a href="tel:0993448083">0993448083</a>
          </div>

        </div>

        <div className="footer-bottom">© 2026 Mit AI Technology. جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  )
}
