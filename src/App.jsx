import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import WhyUs from './components/WhyUs.jsx'
import Services from './components/Services.jsx'
import Assistant from './components/Assistant.jsx'
import About from './components/About.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="intro">
          <div className="container intro-inner">
            <p>
              في <strong>Mit AI Technology</strong>، نحوّل التقنيات المعقدة إلى حلول عملية
              وسهلة الاستخدام. لا تحتاج أن تكون خبيرًا تقنيًا لتستفيد من قوة الذكاء
              الاصطناعي — نحن نتولى الجانب التقني، وأنت تحصل على النتائج.
            </p>
          </div>
        </section>
        <WhyUs />
        <Services />
        <Assistant />
        <About />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
