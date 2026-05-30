import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import PageTransition from '../components/PageTransition'
import { stats } from '../data/stats'
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
]

const GET_INVOLVED_STEPS = [
  {
    n: '01',
    title: 'Apply as a Volunteer',
    body: 'Join our volunteer network and connect with a team that\'s passionate about science education.',
    href: 'https://portal.curiocrate.org',
  },
  {
    n: '02',
    title: 'Teach or Create a Lesson',
    body: 'Design hands-on science lessons or lead your first kit session with real students.',
  },
  {
    n: '03',
    title: 'Become a Kit Developer',
    body: 'Work directly on developing official CurioCrate research kit products distributed to communities.',
  },
]

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function WorldMap({ chaptersData }) {
  const [tooltip, setTooltip] = useState(null)

  const markers = chaptersData
    .filter(c => chapterLocations[c.school])
    .map(c => ({ ...c, coordinates: chapterLocations[c.school] }))

  // Include hardcoded locations not yet in API data
  const hardcodedMarkers = Object.entries(chapterLocations)
    .filter(([school]) => !chaptersData.some(c => c.school === school))
    .map(([school, coordinates]) => ({ school, coordinates }))

  const allMarkers = [...markers, ...hardcodedMarkers]

  return (
    <div style={{ position: 'relative' }}>
      <ComposableMap
        projectionConfig={{ scale: 147, center: [0, 10] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: 'rgba(15,32,68,0.85)', stroke: 'rgba(168,212,240,0.1)', strokeWidth: 0.5, outline: 'none' },
                  hover:   { fill: 'rgba(22,42,92,0.9)',  stroke: 'rgba(168,212,240,0.2)', strokeWidth: 0.5, outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {allMarkers.map((m, i) => (
          <Marker
            key={i}
            coordinates={m.coordinates}
            onMouseEnter={() => setTooltip(m)}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle r={7} fill="rgba(168,212,240,0.15)" stroke="rgba(168,212,240,0.5)" strokeWidth={1.5} style={{ cursor: 'pointer' }} />
            <circle r={3.5} fill="var(--pastel1)" style={{ cursor: 'pointer' }} />
          </Marker>
        ))}
      </ComposableMap>

      {tooltip && (
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(168,212,240,0.2)', borderRadius: 8,
          padding: '8px 18px', pointerEvents: 'none', whiteSpace: 'nowrap',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: 'var(--cream)', letterSpacing: '0.5px',
        }}>
          {tooltip.school}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [ctaReady,     setCtaReady]     = useState(false)
  const [activePhoto,  setActivePhoto]  = useState(0)
  const [chaptersData, setChaptersData] = useState([])

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

          {/* Mission statement + buttons */}
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
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(13px, 1.6vw, 17px)',
                color: 'rgba(197,227,247,0.75)',
                letterSpacing: '0.02em', lineHeight: 1.6,
                textShadow: '0 1px 12px rgba(3,5,15,0.7)',
              }}>
                Free, hands-on science kits for underserved students — everywhere.
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
            style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: 7 }}
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
              borderTop: '1px solid rgba(168,212,240,0.08)',
              background: 'linear-gradient(to top, rgba(3,5,15,0.7) 0%, transparent 100%)',
              padding: '16px 40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40,
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '3px', textTransform: 'uppercase',
              color: 'rgba(168,212,240,0.35)',
            }}>Supported by</span>
            {PARTNERS.map(p => (
              <img key={p.name} src={p.logo} alt={p.name} style={{
                height: 28, objectFit: 'contain',
                filter: 'brightness(0) invert(1) opacity(0.5)',
              }}/>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 20 }}>
                CurioCrate is a 501(c)(3) nonprofit founded on one belief: every student deserves hands-on science education, regardless of their zip code.
              </p>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85 }}>
                We design and distribute free science kits to underserved schools and communities, and build a national network of student-led chapters that make science tangible, exciting, and accessible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {[
                { icon: '🧪', label: 'Free Science Kits',        desc: 'Hands-on kits designed by students, for students — distributed at zero cost.' },
                { icon: '🌍', label: 'Community Chapters',        desc: 'Student-led chapters that bring science to life in their own schools.' },
                { icon: '🎓', label: 'Volunteer-Powered',         desc: 'Run entirely by passionate students and educators who believe in the mission.' },
              ].map((item, i) => (
                <div key={item.label} style={{
                  display: 'flex', gap: 20, alignItems: 'flex-start',
                  padding: '20px 24px',
                  border: '1px solid rgba(168,212,240,0.09)',
                  borderRadius: 14, background: 'rgba(8,16,42,0.4)',
                  backdropFilter: 'blur(16px)',
                }}>
                  <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--cream)', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
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
            }}>
              Get Involved
            </h2>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {GET_INVOLVED_STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                {/* Step card */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  style={{ flex: 1, textAlign: 'center', padding: '0 24px' }}
                >
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 64, fontWeight: 300, lineHeight: 1,
                    color: 'var(--pastel1)', opacity: 0.25, marginBottom: 20,
                  }}>{step.n}</div>

                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
                    border: '1px solid rgba(168,212,240,0.25)',
                    background: 'rgba(168,212,240,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, color: 'var(--pastel1)',
                  }}>
                    {i === 0 ? '✦' : i === 1 ? '◈' : '◉'}
                  </div>

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

                {/* Arrow between steps */}
                {i < GET_INVOLVED_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                    style={{
                      flexShrink: 0, paddingTop: 96,
                      color: 'rgba(168,212,240,0.3)',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 22,
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
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="label" style={{ marginBottom: 16 }}>Expand the Network</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px,5vw,68px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20,
            }}>
              Start a Chapter<br/>
              <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>at your school.</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px' }}>
              Bring free science kits and hands-on learning to your community. Starting a chapter is free, student-led, and open to any school.
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

          {/* World map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              background: 'rgba(6,13,31,0.7)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168,212,240,0.1)', borderRadius: 20,
              overflow: 'hidden', marginBottom: 24,
            }}
          >
            <WorldMap chaptersData={chaptersData} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '2px', color: 'var(--muted)', opacity: 0.3, marginBottom: 64 }}
          >
            Hover a marker to see the chapter · More chapters being added
          </motion.p>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                style={{ padding: '72px 56px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(168,212,240,0.07)' }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageTransition>
  )
}
