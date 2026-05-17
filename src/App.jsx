import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Mission from './components/Mission'
import HowItWorks from './components/HowItWorks'
import KitShop from './components/KitShop'
import Gallery from './components/Gallery'
import BoardMembers from './components/BoardMembers'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#FAFAF9' }}>
      <Navbar />
      <Hero />
      <Stats />
      <Mission />
      <HowItWorks />
      <KitShop />
      <Gallery />
      <BoardMembers />
      <Footer />
    </div>
  )
}
