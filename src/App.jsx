import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CinematicNavbar from './components/CinematicNavbar'
import CinematicFooter from './components/CinematicFooter'
import ParticleField from './components/ParticleField'
import Home from './pages/Home'
import Kits from './pages/Kits'
import Gallery from './pages/Gallery'
import Mission from './pages/Mission'
import KitDevelopment from './pages/KitDevelopment'
import Team from './pages/Team'
import OurChapters from './pages/OurChapters'
import Contact from './pages/Contact'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<Home />} />
        <Route path="/kits"     element={<Kits />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/mission"               element={<Mission />} />
        <Route path="/initiatives/kits"     element={<KitDevelopment />} />
        <Route path="/initiatives/teaching" element={<Mission />} />
        <Route path="/team"     element={<Team />} />
        <Route path="/chapters" element={<OurChapters />} />
        <Route path="/contact"  element={<Contact />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ParticleField />
      <CinematicNavbar />
      <AnimatedRoutes />
      <CinematicFooter />
    </BrowserRouter>
  )
}
