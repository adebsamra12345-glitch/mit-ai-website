import Header from './Header.jsx'
import Footer from './Footer.jsx'

/** Shared page chrome: header, animated main area, footer. */
export default function Layout({ children, mainClass = '' }) {
  return (
    <>
      <a className="skip-link" href="#main">تخطَّ إلى المحتوى</a>
      <Header />
      <main id="main" className={`page ${mainClass}`.trim()}>{children}</main>
      <Footer />
    </>
  )
}
