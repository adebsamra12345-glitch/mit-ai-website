import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/mit-logo.webp'
import { services, servicePath } from '../data/services.js'
import { useConsultation } from '../context/Consultation.jsx'

const NAV = [
  { to: '/#services', label: 'الخدمات' },
  { to: '/blog', label: 'المدونة' },
  { to: '/#assistant', label: 'المساعد الرقمي' },
  { to: '/#about', label: 'من نحن' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { open: openConsultation } = useConsultation()

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll while the mobile drawer is open; close on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.body.classList.add('no-scroll')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Mit AI Technology — الصفحة الرئيسية">
          <img src={logo} alt="" className="brand-logo" width="40" height="35" />
          <span className="brand-name">Mit <span>AI Technology</span></span>
        </Link>

        <nav className="nav-desktop" aria-label="القائمة الرئيسية">
          <div className="nav-item has-menu">
            <Link to="/#services" className="nav-link">الخدمات <span className="caret" aria-hidden="true" /></Link>
            <ul className="nav-menu">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={servicePath(s)} dir="ltr"><span aria-hidden="true">{s.icon}</span> {s.nav}</Link>
                </li>
              ))}
            </ul>
          </div>
          {NAV.filter((n) => n.label !== 'الخدمات').map((n) => (
            <NavLink key={n.to} to={n.to} className="nav-link">{n.label}</NavLink>
          ))}
        </nav>

        <button type="button" className="btn btn-primary header-cta" onClick={openConsultation}>
          احجز استشارة مجانية
        </button>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
        >
          <span /><span /><span />
        </button>
      </div>

      <div id="mobile-drawer" className={`drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="drawer-nav" aria-label="قائمة الجوال">
          {NAV.map((n, i) => (
            <Link key={n.to} to={n.to} style={{ '--i': i }} tabIndex={menuOpen ? 0 : -1}>{n.label}</Link>
          ))}
          <div className="drawer-group" style={{ '--i': NAV.length }}>
            <span className="drawer-title">خدماتنا</span>
            {services.map((s) => (
              <Link key={s.slug} to={servicePath(s)} dir="ltr" tabIndex={menuOpen ? 0 : -1}>{s.icon} {s.nav}</Link>
            ))}
          </div>
        </nav>
        <button
          type="button"
          className="btn btn-primary drawer-cta"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => { setMenuOpen(false); openConsultation() }}
        >
          احجز استشارة مجانية
        </button>
      </div>
    </header>
  )
}
