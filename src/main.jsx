import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './index.css'
import App from './App.jsx'

// Vercel Analytics — privacy-friendly, no cookies
inject()

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


