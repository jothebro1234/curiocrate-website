import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PageTransition from '../components/PageTransition'
import { stats } from '../data/stats'
import { news } from '../data/news'
import { chapters as staticChapters } from '../data/chapters'
import { chapterLocations } from '../data/chapterLocations'

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
    img: '/images/curiekits.png',
  },
]

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

// Custom glowing marker for Leaflet
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

function LeafletMap({ chaptersData }) {
  const markers = chaptersData
    .filter(c => chapterLocations[c.school])
    .map(c => ({ ...c, coordinates: chapterLocations[c.school] }))

  const hardcoded = Object.entries(chapterLocations)
    .filter(([school]) => !chaptersData.some(c => c.school === school))
    .map(([school, coordinates]) => ({ school, coordinates }))

  const allMarkers = [...markers, ...hardcoded]

  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
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
      {allMarkers.map((m, i) => (
        <Marker key={i} position={[m.coordinates[1], m.coordinates[0]]} icon={chapterIcon}>
          <Popup>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 180 }}>
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
      ))}
    </MapContainer>
  )
}

export default function Home() {
  const [ctaReady,      setCtaReady]      = useState(false)
  const [activePhoto,   setActivePhoto]   = useState(0)
  const [chaptersData,  setChaptersData]  = useState([])
  const [selectedStat,  setSelectedStat]  = useState(null)

  const heroRef = useRef(null)
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
              {[
                { to: '/kits',    label: 'Explore Kits', primary: true  },
                { to: '/mission', label: 'Our Mission',  primary: false },
                { to: '/gallery', label: 'View Gallery', primary: false },
              ].map(btn => (
                <Link key={btn.to} to={btn.to} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
                  padding: '13px 28px', borderRadius: 3,
                  border: btn.primary ? '1px solid rgba(168,212,240,0.5)' : '1px solid rgba(168,212,240,0.22)',
                  color: btn.primary ? 'var(--cream)' : 'rgba(197,227,247,0.7)',
                  background: btn.primary ? 'rgba(168,212,240,0.12)' : 'transparent',
                  backdropFilter: 'blur(12px)', transition: 'all 0.35s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(168,212,240,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(168,212,240,0.65)'
                  e.currentTarget.style.color = 'var(--cream)'
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(168,212,240,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = btn.primary ? 'rgba(168,212,240,0.12)' : 'transparent'
                  e.currentTarget.style.borderColor = btn.primary ? 'rgba(168,212,240,0.5)' : 'rgba(168,212,240,0.22)'
                  e.currentTarget.style.color = btn.primary ? 'var(--cream)' : 'rgba(197,227,247,0.7)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >{btn.label}</Link>
              ))}
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 52 }}>
              {PARTNERS.map((p) => (
                <div key={p.name} style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* ─── RECENT NEWS ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: 52 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Updates</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px,4vw,52px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05,
            }}>Recent News</h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {news.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                style={{
                  padding: '32px 28px',
                  background: 'rgba(6,12,32,0.6)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(168,212,240,0.09)',
                  borderRadius: 16,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Color accent line at top */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(to right, transparent, ${newsColor(item.category)}90, transparent)`,
                }}/>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                    color: newsColor(item.category),
                    background: `${newsColor(item.category)}18`,
                    border: `1px solid ${newsColor(item.category)}35`,
                    borderRadius: 4, padding: '4px 9px',
                    flexShrink: 0,
                  }}>{item.category}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, letterSpacing: '1px',
                    color: 'var(--muted)', opacity: 0.4,
                  }}>{formatNewsDate(item.date)}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22, fontWeight: 400,
                  color: 'var(--cream)', lineHeight: 1.25, marginBottom: 12,
                }}>{item.title}</h3>
                <p style={{
                  fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, opacity: 0.75,
                }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT IS CURIOCRATE ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
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

            {/* Photo instead of cards */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <div style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1px solid rgba(168,212,240,0.1)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
              }}>
                <img
                  src="/images/whatiscuriocrate.jpg"
                  alt="What is CurioCrate"
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── GET INVOLVED ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
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
            }}>Get Involved</h2>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
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
                    >Apply Now →</a>
                  )}
                </motion.div>

                {/* Arrow */}
                {i < GET_INVOLVED_STEPS.length - 1 && (
                  <motion.div
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
        </div>
      </section>

      {/* ─── START A CHAPTER ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(32px,5vw,68px)',
                fontWeight: 300, color: 'var(--cream)',
                lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20,
              }}>
                Start a Chapter<br/>
                <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>at your school.</em>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
                Lead the program to bring immersive, hands-on science education directly to students at your school and community.
              </p>
              <a
                href="https://forms.gle/nEBfc84qHXxcmT4k8"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
                  padding: '16px 40px', borderRadius: 3,
                  border: '1px solid rgba(168,212,240,0.45)',
                  color: 'var(--cream)', background: 'rgba(168,212,240,0.1)',
                  backdropFilter: 'blur(12px)', transition: 'all 0.35s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.2)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(168,212,240,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                Get Started →
              </a>
            </motion.div>

            {/* curielead image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <img
                src="/images/curielead.png"
                alt="Start a chapter"
                style={{
                  height: 340,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.45))',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT: MAP + STATS ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
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

          {/* Leaflet map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              borderRadius: 20, overflow: 'hidden',
              border: '1px solid rgba(168,212,240,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
              marginBottom: 64,
            }}
          >
            <LeafletMap chaptersData={chaptersData} />
          </motion.div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => setSelectedStat(s)}
                style={{ padding: '72px 56px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(168,212,240,0.07)', cursor: 'pointer' }}
                onMouseEnter={e => {
                  const img = e.currentTarget.querySelector('img.stat-bg')
                  if (img) { img.style.transform = 'scale(1.07)'; img.style.filter = 'brightness(0.32) saturate(0.55)' }
                }}
                onMouseLeave={e => {
                  const img = e.currentTarget.querySelector('img.stat-bg')
                  if (img) { img.style.transform = 'scale(1)'; img.style.filter = 'brightness(0.22) saturate(0.45)' }
                }}
              >
                <img className="stat-bg" src={s.photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.22) saturate(0.45)', transition: 'transform 0.7s ease, filter 0.7s ease', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 0, background: i % 2 === 0 ? 'linear-gradient(135deg, rgba(10,20,55,0.82) 0%, rgba(6,14,38,0.75) 100%)' : 'linear-gradient(135deg, rgba(6,14,38,0.78) 0%, rgba(10,20,55,0.70) 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -30, right: -10, fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(120px,14vw,200px)', fontWeight: 300, lineHeight: 1, color: 'rgba(168,212,240,0.045)', userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}>{s.value}</div>
                <div style={{ position: 'relative', zIndex: 2, fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(80px,11vw,140px)', fontWeight: 300, lineHeight: 0.9, color: 'var(--pastel1)', textShadow: '0 0 80px rgba(168,212,240,0.7)', marginBottom: 24, letterSpacing: '-0.04em' }}>{s.value}</div>
                <div style={{ position: 'relative', zIndex: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--cream)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '2.5px' }}>{s.label}</div>
                <div style={{ position: 'relative', zIndex: 2, fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 320, opacity: 0.8 }}>{s.description}</div>
                <div style={{ position: 'absolute', bottom: 20, right: 24, zIndex: 2, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '2px', color: 'rgba(168,212,240,0.3)', textTransform: 'uppercase' }}>tap for details</div>
              </motion.div>
            ))}
          </div>

          {/* Stat detail modal */}
          <AnimatePresence>
            {selectedStat && (
              <StatModal stat={selectedStat} onClose={() => setSelectedStat(null)} />
            )}
          </AnimatePresence>
        </div>
      </section>

    </PageTransition>
  )
}
