import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Seo from '../components/Seo.jsx'
import Robot from '../components/Robot.jsx'

export default function NotFound() {
  return (
    <Layout mainClass="not-found">
      <Seo title="الصفحة غير موجودة | Mit AI" description="الصفحة التي تبحث عنها غير موجودة." path="/404" noindex />
      <div className="container not-found-inner">
        <Robot chips={false} size="sm" alt="" />
        <h1>404</h1>
        <p>يبدو أن هذه الصفحة ضلّت طريقها. جرّب الرجوع إلى الرئيسية أو تصفح المدونة.</p>
        <div className="hero-actions">
          <Link to="/" className="btn btn-primary">الصفحة الرئيسية</Link>
          <Link to="/blog" className="btn btn-outline-dark">المدونة</Link>
        </div>
      </div>
    </Layout>
  )
}
