const items = [
  {
    icon: '⚙️',
    title: 'خبرة عملية بأحدث النماذج',
    text: 'نعمل بأحدث نماذج اللغة مثل Llama وQwen، مضبوطة خصيصًا على بيانات عملك.',
  },
  {
    icon: '🎯',
    title: 'حلول مصممة خصيصًا لعملك',
    text: 'لا حلول جاهزة — كل نظام نبنيه يعكس طبيعة نشاطك وجمهورك.',
  },
  {
    icon: '🤝',
    title: 'دعم كامل من التخطيط حتى التشغيل',
    text: 'نرافقك من الفكرة الأولى إلى الإطلاق والتشغيل والصيانة المستمرة.',
  },
]

export default function WhyUs() {
  return (
    <section id="why">
      <div className="container">
        <h2 className="section-title">لماذا Mit؟</h2>
        <div className="why-grid">
          {items.map((it) => (
            <div className="why-card" key={it.title}>
              <div className="icon">{it.icon}</div>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
