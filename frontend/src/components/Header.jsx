import { useState } from 'react'

const links = [
  { href: '#services', label: 'الخدمات' },
  { href: '#why', label: 'لماذا Mit' },
  { href: '#about', label: 'من نحن' },
  { href: '#assistant', label: 'المساعد الرقمي' },
  { href: '#contact', label: 'تواصل معنا' },
]

export default function Header({ onOpenConsultation }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container">
        <a href="#top" className="brand">
          <div className="brand-mark">M</div>
          <span className="brand-name">Mit <span>AI Technology</span></span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
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
