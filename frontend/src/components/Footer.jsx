export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <div className="brand-mark">M</div>
              <span className="brand-name">Mit AI Technology</span>
            </div>
            <p>شركة التحول الذكي للأنظمة — نحوّل التقنيات المعقدة إلى حلول عملية لأعمالك.</p>
          </div>

          <div className="footer-col">
            <span className="title">تواصل معنا</span>
            <a href="mailto:mmitaitechnoloy@gmail.com">mmitaitechnoloy@gmail.com</a>
            <a href="tel:0993448083">0993448083</a>
          </div>

          <div className="footer-col">
            <span className="title">روابط سريعة</span>
            <a href="#services">الخدمات</a>
            <a href="#about">من نحن</a>
            <a href="#assistant">المساعد الرقمي</a>
          </div>
        </div>

        <div className="footer-bottom">© 2026 Mit AI Technology. جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  )
}
