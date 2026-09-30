import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const homeLinks = [
  { href: '#services', label: 'الخدمات' },
  { href: '#why', label: 'لماذا Mit' },
  { href: '#about', label: 'من نحن' },
  { href: '#assistant', label: 'المساعد الرقمي' },
  { href: '#contact', label: 'تواصل معنا' },
]

const servicePages = [
  { to: '/services/enterprise-rag-solutions', label: 'Enterprise RAG Solutions' },
  { to: '/services/llm-fine-tuning', label: 'LLM Fine-Tuning' },
  { to: '/services/ai-search-api', label: 'AI Search API' },
]

const blogPages = [
  { to: '/blog/improve-website-search-with-ai', label: 'Improve Website Search with AI' },
  { to: '/blog/rag-vs-fine-tuning-for-enterprise', label: 'RAG vs Fine-Tuning Guide' },
]

export default function Header({ onOpenConsultation }) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [blogOpen, setBlogOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <div className="brand-mark">M</div>
          <span className="brand-name">Mit <span>AI Technology</span></span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {/* Homepage anchor links — only shown on the homepage */}
          {isHome && homeLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}

          {/* Services Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button
              className="nav-dropdown-trigger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', padding: '0.25rem 0.5rem' }}
              onClick={() => setServicesOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <ul
                role="menu"
                style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#1e293b', listStyle: 'none', margin: 0, padding: '0.5rem 0', borderRadius: '0.375rem', minWidth: '220px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 1000 }}
              >
                {servicePages.map((p) => (
                  <li key={p.to} role="menuitem">
                    <Link
                      to={p.to}
                      onClick={() => { setOpen(false); setServicesOpen(false) }}
                      style={{ display: 'block', padding: '0.6rem 1rem', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Blog Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button
              className="nav-dropdown-trigger"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', padding: '0.25rem 0.5rem' }}
              onClick={() => setBlogOpen((b) => !b)}
              aria-haspopup="true"
              aria-expanded={blogOpen}
            >
              Blog ▾
            </button>
            {blogOpen && (
              <ul
                role="menu"
                style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#1e293b', listStyle: 'none', margin: 0, padding: '0.5rem 0', borderRadius: '0.375rem', minWidth: '240px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 1000 }}
              >
                {blogPages.map((p) => (
                  <li key={p.to} role="menuitem">
                    <Link
                      to={p.to}
                      onClick={() => { setOpen(false); setBlogOpen(false) }}
                      style={{ display: 'block', padding: '0.6rem 1rem', color: '#e2e8f0', textDecoration: 'none', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={onOpenConsultation}
          className="btn btn-primary header-cta"
        >
          احجز استشارة مجانية
        </button>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="فتح القائمة">
          ☰
        </button>
      </div>
    </header>
  )
}
