import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CinematicNavbar from './components/CinematicNavbar'
import CinematicFooter from './components/CinematicFooter'
import ParticleField from './components/ParticleField'
import Home from './pages/Home'
import Kits from './pages/Kits'
import Gallery from './pages/Gallery'
import Mission from './pages/Mission'
import Team from './pages/Team'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/kits" element={<Kits />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/team" element={<Team />} />
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
