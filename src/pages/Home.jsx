import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PageTransition from '../components/PageTransition'
import AutoplayVideo from '../components/AutoplayVideo'
import { stats } from '../data/stats'
import { news } from '../data/news'
import { chapters as staticChapters } from '../data/chapters'
import { chapterLocations } from '../data/chapterLocations'

const MESSAGE_FROM_PRES_URL = 'https://pub-e7374d03fa9c42bfb531206a5e81830b.r2.dev/messagefrompres.mp4'

const HERO_PHOTOS = [
  '/images/IMG_3920.jpg',
  '/images/volunteeringimage.jpg',
  '/images/IMG_9240.jpg',
  '/images/P1080258.JPG',
  '/images/P1080212.JPG',
]

const PARTNERS = [
  { name: 'Society for Science',    logo: '/logos/sfslogo.png' },
  { name: 'Connect Key Foundation', logo: '/logos/ckflogo.png' },
  { name: 'YMCA',                   logo: '/logos/ymcamainpng.png' },
]

const GET_INVOLVED_STEPS = [
  {
    n: '01',
    title: 'Apply as a Volunteer',
    body: 'Join our volunteer network and connect with a team passionate about science education.',
    href: 'https://portal.curiocrate.org',
    ctaLabel: 'Apply Now →',
    img: '/images/curiecomputer.png',
  },
  {
    n: '02',
    title: 'Teach or Create a Lesson',
    body: 'Design hands-on science lessons or lead your first kit session with real students.',
    img: '/images/curieteacher.png',
  },
  {
    n: '03',
    title: 'Become a Kit Developer',
    body: 'Work directly on developing official CurioCrate research kit products distributed to communities.',
    href: '/initiatives/kits',
    internal: true,
    ctaLabel: 'Explore Kit Development →',
    img: '/images/curiekits.png',
  },
  {
    n: '04',
    title: 'Start a Chapter',
    body: 'Lead the program to bring immersive, hands-on science education directly to students at your school and community.',
    href: 'https://forms.gle/nEBfc84qHXxcmT4k8',
    ctaLabel: 'Get Started →',
    img: '/images/curielead.png',
  },
]

function driveUrl(url) {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([^/?]+)/)
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  return url
}

const NEWS_COLORS = {
  Chapters:     '#a8d4f0',
  Events:       '#a8e8c8',
  Milestones:   '#e8c96e',
  Partnerships: '#c5b4f8',
}
function newsColor(cat) { return NEWS_COLORS[cat] || '#a8d4f0' }
function formatNewsDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatModal({ stat, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(6,12,32,0.98)',
          border: '1px solid rgba(168,212,240,0.15)',
          borderRadius: 24,
          overflow: 'hidden',
          maxWidth: 580,
          width: '100%',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <img src={stat.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) saturate(0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(6,12,32,0.97) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 28, left: 36 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(60px,10vw,96px)', fontWeight: 300, lineHeight: 0.9,
              color: 'var(--pastel1)',
              textShadow: '0 0 60px rgba(168,212,240,0.5)',
              letterSpacing: '-0.04em',
            }}>{stat.value}</div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: 11,
              color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '2.5px',
              marginTop: 10,
            }}>{stat.label}</div>
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(168,212,240,0.2)',
            borderRadius: 8, color: 'var(--muted)', fontSize: 11, cursor: 'pointer',
            padding: '7px 14px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px',
          }}>ESC · CLOSE</button>
        </div>
        <div style={{ padding: '24px 36px 36px' }}>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 16 }}>
            {stat.description}
          </p>
          {stat.detail && (
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, opacity: 0.7, borderTop: '1px solid rgba(168,212,240,0.07)', paddingTop: 16 }}>
              {stat.detail}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// Concentric rings that fade outward — no hard border
const GRADIENT_LAYERS = [
  { pct: 1.00, opacity: 0.03 },
  { pct: 0.65, opacity: 0.05 },
  { pct: 0.35, opacity: 0.08 },
  { pct: 0.12, opacity: 0.12 },
]

function ImpactArea({ center, radiusKm, color }) {
  const radiusM = radiusKm * 1000
  return GRADIENT_LAYERS.map(({ pct, opacity }) => (
    <Circle
      key={pct}
      center={center}
      radius={radiusM * pct}
      pathOptions={{ color: 'transparent', fillColor: color, fillOpacity: opacity, weight: 0 }}
    />
  ))
}

// Blue circle = chapter
const chapterIcon = L.divIcon({
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:rgba(168,212,240,0.9);
    border:3px solid rgba(168,212,240,0.35);
    box-shadow:0 0 16px rgba(168,212,240,0.7), 0 0 32px rgba(168,212,240,0.3);
    cursor:pointer;
  "></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
})

// Amber diamond = teaching location
const teachingIcon = L.divIcon({
  html: `<div style="
    width:11px;height:11px;border-radius:2px;
    background:rgba(251,191,36,0.9);
    border:2px solid rgba(251,191,36,0.4);
    box-shadow:0 0 14px rgba(251,191,36,0.7), 0 0 28px rgba(251,191,36,0.3);
    cursor:pointer;
    transform:rotate(45deg);
  "></div>`,
  className: '',
  iconSize: [11, 11],
  iconAnchor: [5, 5],
  popupAnchor: [0, -10],
})

function LeafletMap({ chaptersData }) {
  // Rows from the sheet whose type is "Chapter" (or blank)
  const chapterRows = chaptersData.filter(c => c.type !== 'Impact')
  // Rows explicitly marked as teaching locations
  const teachingRows = chaptersData.filter(c => c.type === 'Impact')

  // For chapters: prefer lat/lng from sheet; fall back to chapterLocations.js lookup
  const chapterMarkers = chapterRows
    .filter(c => (c.latitude && c.longitude) || chapterLocations[c.school])
    .map(c => {
      const coords = (c.latitude && c.longitude)
        ? [c.latitude, c.longitude]
        : [chapterLocations[c.school][1], chapterLocations[c.school][0]]
      return { ...c, coords }
    })

  // Hardcoded fallback entries (schools in chapterLocations.js not in sheet)
  const hardcoded = Object.entries(chapterLocations)
    .filter(([school]) => !chaptersData.some(c => c.school === school))
    .map(([school, lngLat]) => ({ school, coords: [lngLat[1], lngLat[0]] }))

  // Teaching location markers (must have coordinates in the sheet)
  const teachingMarkers = teachingRows.filter(c => c.latitude && c.longitude)

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[34.05, -118.1]}
        zoom={8}
        minZoom={2}
        maxZoom={18}
        style={{ height: '480px', width: '100%', background: '#060d1f' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {[...chapterMarkers, ...hardcoded].map((m, i) => (
          <>
            <ImpactArea key={`chapter-area-${i}`} center={m.coords} radiusKm={m.radius || 12} color="rgba(168,212,240,1)" />
            <Marker key={`chapter-${i}`} position={m.coords} icon={chapterIcon}>
              <Popup>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 180 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#a8d4f0', marginBottom: 6 }}>Chapter</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.school}</div>
                  {m.president && <div style={{ fontSize: 12, color: '#aaa' }}>{m.president}</div>}
                  {(m.city || m.state) && (
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      {[m.city, m.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        ))}

        {teachingMarkers.map((m, i) => (
          <>
            <ImpactArea key={`impact-area-${i}`} center={[m.latitude, m.longitude]} radiusKm={m.radius || 12} color="rgba(251,191,36,1)" />
            <Marker key={`teaching-${i}`} position={[m.latitude, m.longitude]} icon={teachingIcon}>
              <Popup>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 180 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fbbf24', marginBottom: 6 }}>Impact</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.school}</div>
                  {(m.city || m.state) && (
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      {[m.city, m.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        background: 'rgba(6,12,32,0.88)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(168,212,240,0.12)',
        borderRadius: 10, padding: '10px 14px',
        display: 'flex', flexDirection: 'column', gap: 7,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(168,212,240,0.9)', boxShadow: '0 0 8px rgba(168,212,240,0.7)', flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(168,212,240,0.7)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Chapter</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 9, height: 9, background: 'rgba(251,191,36,0.9)', boxShadow: '0 0 8px rgba(251,191,36,0.7)', flexShrink: 0, transform: 'rotate(45deg)', borderRadius: 2 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(251,191,36,0.7)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Impact</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [ctaReady,      setCtaReady]      = useState(false)
  const [videoMuted,    setVideoMuted]    = useState(false)
  const [activePhoto,   setActivePhoto]   = useState(0)
  const [chaptersData,  setChaptersData]  = useState([])
  const [selectedStat,  setSelectedStat]  = useState(null)
  const [newsData,      setNewsData]      = useState(null)
  const [kitsMenuOpen,  setKitsMenuOpen]  = useState(false)

  const heroRef        = useRef(null)
  const missionVideoRef = useRef(null)
  const newsRef = useRef(null)
  const newsInView = useInView(newsRef, { once: true, amount: 0.25 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const heroO = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setActivePhoto(p => (p + 1) % HERO_PHOTOS.length), 5500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setNewsData(news); return }
    fetch(`${url}?action=get_updates`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.updates) && data.updates.length > 0)
          setNewsData(data.updates)
        else
          setNewsData(news)
      })
      .catch(() => setNewsData(news))
  }, [])

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) return
    fetch(`${url}?action=get_chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.chapters) && data.chapters.length > 0)
          setChaptersData(data.chapters)
        else setChaptersData(staticChapters)
      })
      .catch(() => setChaptersData(staticChapters))
  }, [])

  useEffect(() => {
    const video = missionVideoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.muted = true
            setVideoMuted(true)
            video.play()
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <PageTransition>

      {/* ─── HERO ─── */}
      <motion.section ref={heroRef} style={{ y: heroY, opacity: heroO, position: 'relative', zIndex: 1 }}>
        <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>

          {/* Photo slideshow */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <AnimatePresence>
              <motion.img
                key={HERO_PHOTOS[activePhoto]}
                src={HERO_PHOTOS[activePhoto]}
                alt=""
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1.14 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1.8, ease: 'easeInOut' },
                  scale:   { duration: 8, ease: 'linear' },
                }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>
          </div>

          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: [
              'radial-gradient(ellipse 70% 65% at 50% 48%, rgba(3,5,15,0.72) 0%, rgba(3,5,15,0.1) 75%, transparent 100%)',
              'linear-gradient(to bottom, rgba(3,5,15,0.55) 0%, transparent 35%, transparent 65%, rgba(3,5,15,0.6) 100%)',
            ].join(', '),
          }}/>

          {/* Mission + buttons */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0 24px',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: 'center', marginBottom: 40 }}
            >
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px, 5.5vw, 72px)',
                fontWeight: 300, color: 'var(--cream)',
                lineHeight: 1.1, letterSpacing: '-0.02em',
                textShadow: '0 2px 24px rgba(3,5,15,0.8)',
                marginBottom: 16,
              }}>
                Science for every<br/>
                <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>curious mind.</em>
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.8vw, 22px)',
                fontWeight: 300,
                color: 'rgba(197,227,247,0.78)',
                letterSpacing: '0.01em', lineHeight: 1.5,
                textShadow: '0 1px 16px rgba(3,5,15,0.8)',
              }}>
                Accessible, immersive, hands-on science kits for underserved students.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={ctaReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setKitsMenuOpen(true)}
                onMouseLeave={() => setKitsMenuOpen(false)}
              >
                <button
                  onClick={() => setKitsMenuOpen(true)}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    letterSpacing: '3px', textTransform: 'uppercase',
                    padding: '13px 28px', borderRadius: 3,
                    border: '1px solid rgba(168,212,240,0.5)',
                    color: 'var(--cream)',
                    background: kitsMenuOpen ? 'rgba(168,212,240,0.2)' : 'rgba(168,212,240,0.12)',
                    backdropFilter: 'blur(12px)', transition: 'all 0.35s ease', cursor: 'pointer',
                    boxShadow: kitsMenuOpen ? '0 0 24px rgba(168,212,240,0.2)' : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(168,212,240,0.2)'
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(168,212,240,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = kitsMenuOpen ? 'rgba(168,212,240,0.2)' : 'rgba(168,212,240,0.12)'
                    e.currentTarget.style.boxShadow = kitsMenuOpen ? '0 0 24px rgba(168,212,240,0.2)' : 'none'
                  }}
                >Explore Kits</button>

                <AnimatePresence>
                  {kitsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                        minWidth: 280,
                        background: 'rgba(8,14,32,0.96)',
                        border: '1px solid rgba(168,212,240,0.3)',
                        borderRadius: 6, overflow: 'hidden',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                        zIndex: 20,
                      }}
                    >
                      {[
                        { to: '/kits', label: 'View Kits' },
                        { to: '/initiatives/kits', label: 'Become a High School Kit Builder' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setKitsMenuOpen(false)}
                          style={{
                            display: 'block', padding: '13px 18px',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            textDecoration: 'none', color: 'rgba(197,227,247,0.85)',
                            background: 'transparent', transition: 'background 0.2s, color 0.2s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.15)'; e.currentTarget.style.color = 'var(--cream)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(197,227,247,0.85)' }}
                        >{item.label}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/gallery" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
                padding: '13px 28px', borderRadius: 3,
                border: '1px solid rgba(168,212,240,0.22)',
                color: 'rgba(197,227,247,0.7)',
                background: 'transparent',
                backdropFilter: 'blur(12px)', transition: 'all 0.35s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(168,212,240,0.2)'
                e.currentTarget.style.borderColor = 'rgba(168,212,240,0.65)'
                e.currentTarget.style.color = 'var(--cream)'
                e.currentTarget.style.boxShadow = '0 0 24px rgba(168,212,240,0.2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(168,212,240,0.22)'
                e.currentTarget.style.color = 'rgba(197,227,247,0.7)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >View Gallery</Link>
              <button
                onClick={() => document.getElementById('what-is-curiocrate')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  letterSpacing: '3px', textTransform: 'uppercase',
                  padding: '13px 28px', borderRadius: 3,
                  border: '1px solid rgba(168,212,240,0.22)',
                  color: 'rgba(197,227,247,0.7)',
                  background: 'transparent',
                  backdropFilter: 'blur(12px)', transition: 'all 0.35s ease', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.2)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.65)'; e.currentTarget.style.color = 'var(--cream)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.22)'; e.currentTarget.style.color = 'rgba(197,227,247,0.7)' }}
              >Our Mission</button>
            </motion.div>
          </div>

          {/* Photo dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={ctaReady ? { opacity: 1 } : {}}
            style={{ position: 'absolute', bottom: 148, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 7 }}
          >
            {HERO_PHOTOS.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} style={{
                width: i === activePhoto ? 22 : 6, height: 6, borderRadius: 3,
                background: i === activePhoto ? 'rgba(168,212,240,0.9)' : 'rgba(255,255,255,0.28)',
                border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
              }}/>
            ))}
          </motion.div>

          {/* Partners strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={ctaReady ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
              background: 'linear-gradient(to top, rgba(3,5,15,0.94) 0%, rgba(3,5,15,0.6) 55%, transparent 100%)',
              padding: '28px 48px 22px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: 'rgba(168,212,240,0.5)',
            }}>Supported by</span>

            <div className="home-partners-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 52 }}>
              {PARTNERS.map((p) => (
                <div key={p.name} className="home-partner-logo" style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={p.logo} alt={p.name} style={{
                    maxWidth: '100%', maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1) opacity(0.72)',
                    transition: 'filter 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(1)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(0) invert(1) opacity(0.72)' }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── RECENT NEWS: DISPATCH BOARD ─── */}
      <section ref={newsRef} style={{ position: 'relative', zIndex: 1, padding: '120px 0 140px', overflow: 'hidden' }}>

        {/* Atmospheric orbs */}
        <div style={{ position: 'absolute', top: '-8%', left: '-6%', width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(168,212,240,0.032) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '0%', right: '-5%', width: 580, height: 580, borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(197,180,248,0.038) 0%, transparent 65%)' }} />

        {/* Hexagonal grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.024, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="newsHex" x="0" y="0" width="70" height="60.62" patternUnits="userSpaceOnUse">
              <polygon points="35,2 68,19 68,53 35,70 2,53 2,19" fill="none" stroke="rgba(168,212,240,1)" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#newsHex)" />
        </svg>

        {/* Giant watermark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(160px, 26vw, 380px)',
          fontWeight: 300, color: 'rgba(168,212,240,0.016)',
          letterSpacing: '-0.06em', pointerEvents: 'none', userSelect: 'none',
          whiteSpace: 'nowrap', lineHeight: 1,
        }}>DISPATCH</div>

        {/* ── Scrolling ticker (only when data ready) ── */}
        {newsData && <div style={{
          overflow: 'hidden', marginBottom: 80,
          borderTop: '1px solid rgba(168,212,240,0.07)',
          borderBottom: '1px solid rgba(168,212,240,0.07)',
          background: 'rgba(168,212,240,0.018)',
        }}>
          <motion.div
            animate={{ x: ['0%', '-33.33%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', width: 'max-content' }}
          >
            {[...newsData, ...newsData, ...newsData].map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 0', whiteSpace: 'nowrap' }}>
                <span style={{
                  display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                  background: newsColor(item.category),
                  boxShadow: `0 0 6px ${newsColor(item.category)}90`,
                  margin: '0 16px', flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                  color: newsColor(item.category), opacity: 0.85, marginRight: 10,
                }}>{item.category}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8, letterSpacing: '1.5px',
                  color: 'rgba(168,212,240,0.32)',
                }}>{item.title}</span>
                <span style={{ margin: '0 36px', color: 'rgba(168,212,240,0.1)', fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}>·</span>
              </span>
            ))}
          </motion.div>
        </div>}

        <div className="home-news-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: 52 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
              <span className="news-live-dot" style={{
                display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
                background: '#ef4444', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8, letterSpacing: '3px', textTransform: 'uppercase',
                color: '#ef4444',
              }}>LIVE</span>
              <div style={{ width: 1, height: 12, background: 'rgba(168,212,240,0.15)' }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 8, letterSpacing: '2.5px', textTransform: 'uppercase',
                color: 'rgba(168,212,240,0.35)',
              }}>CURIOCRATE DISPATCH</span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(168,212,240,0.15), transparent)', transformOrigin: 'left' }}
              />
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px,4.5vw,60px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.0, letterSpacing: '-0.03em',
            }}>Recent <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>News</em></h2>
          </motion.div>

          {/* Main grid: featured left, stacked right */}
          {newsData && <div className="home-news-grid" style={{ display: 'grid', gridTemplateColumns: '1.18fr 0.82fr', gap: 20, alignItems: 'start' }}>

            {/* ── FEATURED CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className="news-featured"
                onMouseMove={e => {
                  const r = e.currentTarget.getBoundingClientRect()
                  const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
                  const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
                  e.currentTarget.style.transform = `perspective(1400px) rotateY(${dx * 6}deg) rotateX(${dy * -6}deg) scale(1.008)`
                  e.currentTarget.style.boxShadow = `0 48px 140px rgba(0,0,0,0.7), 0 0 60px ${newsColor(newsData[0].category)}12`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 40px 120px rgba(0,0,0,0.6)'
                }}
                style={{
                  position: 'relative', overflow: 'hidden', borderRadius: 20,
                  minHeight: 500,
                  background: 'linear-gradient(135deg, rgba(4,8,22,0.97) 0%, rgba(7,14,36,0.95) 100%)',
                  border: '1px solid rgba(168,212,240,0.12)',
                  boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
                  transition: 'transform 0.2s ease, box-shadow 0.35s ease',
                  display: 'flex', flexDirection: 'column',
                  cursor: 'default',
                }}
              >
                {/* Photo background */}
                {newsData[0].image && (
                  <>
                    <img src={driveUrl(newsData[0].image)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(0.8)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,8,22,0.05) 0%, rgba(4,8,22,0.15) 35%, rgba(4,8,22,0.88) 62%, rgba(4,8,22,0.97) 100%)', pointerEvents: 'none' }} />
                  </>
                )}

                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: -80, right: -80, width: 300, height: 300,
                  borderRadius: '50%', pointerEvents: 'none',
                  background: `radial-gradient(ellipse, ${newsColor(newsData[0].category)}1C 0%, transparent 65%)`,
                }} />
                {/* Bottom-left glow */}
                <div style={{
                  position: 'absolute', bottom: -60, left: -40, width: 220, height: 220,
                  borderRadius: '50%', pointerEvents: 'none',
                  background: `radial-gradient(ellipse, ${newsColor(newsData[0].category)}0E 0%, transparent 65%)`,
                }} />

                {/* Left signal bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 50, bottom: 50, width: 2, borderRadius: 2,
                  background: `linear-gradient(to bottom, transparent, ${newsColor(newsData[0].category)}, transparent)`,
                }} />

                {/* Scan line (fires once on section scroll-in) */}
                {newsInView && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 1,
                    background: `linear-gradient(to right, transparent 0%, ${newsColor(newsData[0].category)}80 30%, ${newsColor(newsData[0].category)} 50%, ${newsColor(newsData[0].category)}80 70%, transparent 100%)`,
                    animation: 'newsScan 1.6s ease-in-out 0.3s both',
                    pointerEvents: 'none', zIndex: 10,
                  }} />
                )}

                {/* Shimmer stripe (CSS hover) */}
                <div className="news-shimmer" style={{
                  position: 'absolute', top: 0, bottom: 0, width: '38%',
                  background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.032) 50%, transparent 65%)',
                  transform: 'skewX(-10deg)',
                  pointerEvents: 'none', zIndex: 9,
                }} />

                {/* Border pulse (CSS hover) */}
                <div className="news-border-pulse" style={{
                  position: 'absolute', inset: 0, borderRadius: 20,
                  border: `1px solid ${newsColor(newsData[0].category)}60`,
                  opacity: 0, pointerEvents: 'none',
                }} />

                {/* Content */}
                <div style={{ padding: '44px 44px 36px 54px', display: 'flex', flexDirection: 'column', minHeight: 500, justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>

                  {/* Top: category + date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8, letterSpacing: '2.5px', textTransform: 'uppercase',
                      color: newsColor(newsData[0].category),
                      background: `${newsColor(newsData[0].category)}12`,
                      border: `1px solid ${newsColor(newsData[0].category)}35`,
                      borderRadius: 4, padding: '5px 12px',
                      boxShadow: `0 0 16px ${newsColor(newsData[0].category)}18`,
                    }}>{newsData[0].category}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase',
                      color: 'rgba(168,212,240,0.28)',
                    }}>{formatNewsDate(newsData[0].date)}</span>
                  </div>

                  {/* Headline + body */}
                  <div style={{ padding: '0 0 28px' }}>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(26px, 2.8vw, 40px)',
                      fontWeight: 300, color: '#ffffff',
                      lineHeight: 1.18, letterSpacing: '-0.025em', marginBottom: 22,
                      textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                    }}>{newsData[0].title}</h3>
                    <p style={{
                      fontSize: 13.5, color: 'rgba(230,243,255,0.95)',
                      lineHeight: 1.85, maxWidth: 440,
                      textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                    }}>
                      {newsData[0].body}<span className="news-cursor">_</span>
                    </p>
                    {newsData[0].link && (
                      <a href={newsData[0].link} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block', marginTop: 20,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase',
                        color: newsColor(newsData[0].category), textDecoration: 'none',
                        border: `1px solid ${newsColor(newsData[0].category)}40`,
                        borderRadius: 4, padding: '7px 16px',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${newsColor(newsData[0].category)}14` }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >Read More →</a>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid rgba(168,212,240,0.06)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(168,212,240,0.18)' }}>FEATURED DISPATCH</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, letterSpacing: '2px', color: 'rgba(168,212,240,0.18)' }}>01 / {newsData.length.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── STACKED SIDE CARDS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {newsData.slice(1).map((item, i) => (
                <motion.div
                  key={i + 1}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, delay: (i + 1) * 0.14 }}
                >
                  <div
                    onMouseMove={e => {
                      const r = e.currentTarget.getBoundingClientRect()
                      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
                      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
                      e.currentTarget.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${dy * -4}deg) translateY(-4px)`
                      e.currentTarget.style.boxShadow = `0 24px 64px rgba(0,0,0,0.55), 0 0 28px ${newsColor(item.category)}14`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)'
                    }}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      borderRadius: 16, padding: '28px 30px 24px 38px',
                      background: 'linear-gradient(135deg, rgba(4,8,22,0.95) 0%, rgba(6,12,28,0.92) 100%)',
                      border: '1px solid rgba(168,212,240,0.09)',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
                      transition: 'transform 0.22s ease, box-shadow 0.3s ease',
                      clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                      cursor: 'default',
                    }}
                  >
                    {/* Photo background */}
                    {item.image && (
                      <>
                        <img src={driveUrl(item.image)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) saturate(0.65)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,8,22,0.58)', pointerEvents: 'none' }} />
                      </>
                    )}

                    {/* Clipped corner triangle */}
                    <div style={{
                      position: 'absolute', top: 0, right: 0, width: 0, height: 0,
                      borderStyle: 'solid', borderWidth: '26px 26px 0 0',
                      borderColor: `${newsColor(item.category)}30 transparent transparent transparent`,
                    }} />

                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 2, borderRadius: 2,
                      background: `linear-gradient(to bottom, transparent, ${newsColor(item.category)}90, transparent)`,
                    }} />

                    {/* Content (above image via z-index) */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                    {/* Category + date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 15 }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                        background: newsColor(item.category),
                        boxShadow: `0 0 7px ${newsColor(item.category)}`,
                        display: 'inline-block',
                      }} />
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 7.5, letterSpacing: '2px', textTransform: 'uppercase',
                        color: newsColor(item.category), opacity: 0.9,
                      }}>{item.category}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 7.5, letterSpacing: '1px',
                        color: 'rgba(168,212,240,0.22)', marginLeft: 'auto',
                      }}>{formatNewsDate(item.date)}</span>
                    </div>

                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(17px, 1.8vw, 22px)',
                      fontWeight: 400, color: 'var(--cream)',
                      lineHeight: 1.22, marginBottom: 10,
                    }}>{item.title}</h3>

                    <p style={{ fontSize: 12.5, color: 'rgba(210,232,248,0.82)', lineHeight: 1.75 }}>{item.body}</p>

                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 7.5, letterSpacing: '2px', textTransform: 'uppercase',
                          color: newsColor(item.category), textDecoration: 'none',
                          opacity: 0.85, transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.85' }}
                        >Read More →</a>
                      ) : <span />}
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 7.5, letterSpacing: '1.5px',
                        color: 'rgba(168,212,240,0.16)',
                      }}>{(i + 2).toString().padStart(2, '0')} / {newsData.length.toString().padStart(2, '0')}</span>
                    </div>
                    </div>{/* end content z-index wrapper */}
                  </div>
                </motion.div>
              ))}
            </div>

          </div>}
        </div>
      </section>

      {/* ─── WHAT IS CURIOCRATE ─── */}
      <section id="what-is-curiocrate" className="home-section" style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="home-what-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className="label" style={{ marginBottom: 16 }}>Est. 2023</div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px,4.5vw,60px)',
                fontWeight: 300, color: 'var(--cream)',
                lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 28,
              }}>
                What is<br/>
                <em style={{ color: 'var(--pastel1)' }}>CurioCrate?</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 20 }}>
                CurioCrate believes every child, regardless of zip code, income, or background, deserves to experience the wonder of real science.
              </p>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9 }}>
                Our immersive, accessible, hands-on experiment kits, designed by passionate high school volunteers alongside college professors and industry professionals, bring "lab" education to underserved students, paired with live workshops that make learning engaging for early learners.
              </p>
            </motion.div>

            {/* Mission video */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(168,212,240,0.12)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                position: 'relative',
              }}>
                <video
                  ref={missionVideoRef}
                  muted={videoMuted}
                  playsInline
                  style={{ width: '100%', display: 'block', background: '#000', pointerEvents: 'none' }}
                >
                  <source src="https://pub-e7374d03fa9c42bfb531206a5e81830b.r2.dev/finalccmission.mp4" type="video/mp4" />
                </video>
                {/* Unmute toggle */}
                <button
                  onClick={() => setVideoMuted(m => !m)}
                  style={{
                    position: 'absolute', bottom: 14, right: 14,
                    background: 'rgba(6,12,32,0.72)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(168,212,240,0.2)',
                    borderRadius: 8, padding: '7px 12px',
                    color: 'var(--pastel1)', cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, letterSpacing: '1.5px',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,12,32,0.72)' }}
                >
                  {videoMuted ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  )}
                  {videoMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT: MAP + STATS ─── */}
      <section className="home-section" style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Our Reach</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px,4vw,52px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1,
            }}>
              Every dot is a community<br/>
              <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>we've reached.</em>
            </h2>
          </motion.div>

          {/* Map + Stats side by side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 260px',
              height: 480,
              borderRadius: 20, overflow: 'hidden',
              border: '1px solid rgba(168,212,240,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Map */}
            <LeafletMap chaptersData={chaptersData} />

            {/* Vertical stats — scrollable */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              borderLeft: '1px solid rgba(168,212,240,0.1)',
              height: 480, overflowY: 'auto', overflowX: 'hidden',
            }}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  onClick={() => setSelectedStat(s)}
                  style={{
                    flexShrink: 0, minHeight: 120, padding: '18px 20px',
                    position: 'relative', overflow: 'hidden',
                    cursor: 'pointer',
                    borderBottom: i < stats.length - 1 ? '1px solid rgba(168,212,240,0.08)' : 'none',
                    background: 'rgba(6,12,32,0.7)',
                    transition: 'background 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,12,32,0.7)' }}
                >
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(32px,3.5vw,44px)',
                    fontWeight: 300, lineHeight: 0.95,
                    color: 'var(--pastel1)',
                    textShadow: '0 0 40px rgba(168,212,240,0.5)',
                    letterSpacing: '-0.03em',
                    marginBottom: 6,
                  }}>{s.value}</div>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 10,
                    color: 'var(--cream)', textTransform: 'uppercase',
                    letterSpacing: '1.8px', marginBottom: 5,
                  }}>{s.label}</div>
                  <div style={{
                    fontSize: 11, color: 'var(--muted)', lineHeight: 1.55,
                    opacity: 0.65,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{s.description}</div>
                  <div style={{
                    marginTop: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 7, letterSpacing: '1.5px',
                    color: 'rgba(168,212,240,0.25)', textTransform: 'uppercase',
                  }}>tap for details</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stat detail modal */}
          <AnimatePresence>
            {selectedStat && (
              <StatModal stat={selectedStat} onClose={() => setSelectedStat(null)} />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── GET INVOLVED ─── */}
      <section className="home-section" style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(168,212,240,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }}/>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Join Us</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05,
            }}>What Can You Do to Get Involved?</h2>
          </motion.div>

          <div className="home-involved-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {GET_INVOLVED_STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  style={{ flex: 1, textAlign: 'center', padding: '0 20px' }}
                >
                  {/* Character image */}
                  <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={step.img}
                      alt={step.title}
                      style={{
                        height: 220,
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.45))',
                      }}
                    />
                  </div>

                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 52, fontWeight: 300, lineHeight: 1,
                    color: 'var(--pastel1)', opacity: 0.2, marginBottom: 16,
                  }}>{step.n}</div>

                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 400, color: 'var(--cream)',
                    marginBottom: 14, lineHeight: 1.2,
                  }}>{step.title}</div>

                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 240, margin: '0 auto' }}>
                    {step.body}
                  </p>

                  {step.href && (
                    step.internal ? (
                      <Link to={step.href} style={{
                        display: 'inline-block', marginTop: 20,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        letterSpacing: '2.5px', textTransform: 'uppercase', textDecoration: 'none',
                        padding: '10px 22px', borderRadius: 3,
                        border: '1px solid rgba(168,212,240,0.3)', color: 'var(--pastel1)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >{step.ctaLabel || 'Learn More →'}</Link>
                    ) : (
                      <a href={step.href} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-block', marginTop: 20,
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        letterSpacing: '2.5px', textTransform: 'uppercase', textDecoration: 'none',
                        padding: '10px 22px', borderRadius: 3,
                        border: '1px solid rgba(168,212,240,0.3)', color: 'var(--pastel1)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >{step.ctaLabel || 'Learn More →'}</a>
                    )
                  )}
                </motion.div>

                {/* Arrow */}
                {i < GET_INVOLVED_STEPS.length - 1 && (
                  <motion.div
                    className="home-arrow"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                    style={{
                      flexShrink: 0, paddingTop: 80,
                      color: 'rgba(168,212,240,0.3)',
                      fontSize: 22,
                    }}
                  >→</motion.div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: 640, margin: '80px auto 0', textAlign: 'center' }}
          >
            <div className="label" style={{ marginBottom: 14 }}>A Message From Our President</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(24px,3vw,34px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 28,
            }}>
              Why we do this <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>work.</em>
            </h3>
            <AutoplayVideo src={MESSAGE_FROM_PRES_URL} />
          </motion.div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          .home-section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 72px !important; padding-bottom: 72px !important; }
          .home-news-inner { padding: 0 20px !important; }
          .home-news-grid { grid-template-columns: 1fr !important; }
          .home-what-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .home-involved-row { flex-direction: column !important; align-items: center !important; gap: 24px !important; }
          .home-involved-row > div { width: 100% !important; max-width: 360px !important; }
          .home-arrow { display: none !important; }
          .home-stats-grid > div { padding: 44px 24px !important; }
          .home-partners-row { gap: 24px !important; flex-wrap: wrap !important; }
          .home-partner-logo { width: 100px !important; height: 36px !important; }
        }
        @media(max-width:480px){
          .home-stats-grid { grid-template-columns: 1fr !important; }
          .home-stats-grid > div { padding: 36px 20px !important; }
        }
      `}</style>

    </PageTransition>
  )
}
