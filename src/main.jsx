import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from '@studio-freight/lenis'
import './index.css'
import App from './App.jsx'

// Cinematic smooth scroll — 0.08 lerp feels like 24fps film
const lenis = new Lenis({
  lerp: 0.075,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Expose for ScrollTrigger integration
window.__lenis = lenis

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
