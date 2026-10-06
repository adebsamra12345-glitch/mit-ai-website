import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './styles/index.css'

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

const root = document.getElementById('root')
// Production pages are prerendered (see scripts/prerender.mjs) and hydrate; the dev server renders from scratch.
if (root.firstElementChild) hydrateRoot(root, tree)
else createRoot(root).render(tree)
