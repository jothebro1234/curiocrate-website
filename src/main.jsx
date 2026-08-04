import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Forces a new content hash on the built JS bundle so a stale/poisoned CDN edge cache
// (which serves an old response for an old hashed filename indefinitely, since
// /assets/* is cached as immutable) gets bypassed by a URL it has never seen before.
// Bump this whenever a deploy needs to guarantee a fresh asset URL. See CLAUDE.md.
window.__CURIOCRATE_BUILD__ = '2026-08-04-01'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
