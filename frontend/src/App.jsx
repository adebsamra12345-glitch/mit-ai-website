import { Route, Routes } from 'react-router-dom'
import { ConsultationProvider } from './context/Consultation.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import ServicePage from './pages/ServicePage.jsx'
import NotFound from './pages/NotFound.jsx'

/** Router-agnostic app shell: main.jsx wraps it in BrowserRouter, the prerenderer in StaticRouter. */
export default function App() {
  return (
    <ConsultationProvider>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
    </ConsultationProvider>
  )
}
