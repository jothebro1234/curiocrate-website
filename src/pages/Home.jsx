import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { stats } from '../data/stats'

const HERO_PHOTOS = [
  '/images/IMG_3920.jpg',
  '/images/volunteeringimage.jpg',
  '/images/IMG_9240.jpg',
  '/images/P1080258.JPG',
  '/images/P1080212.JPG',
]

// ─── CHAPTER ROW ──────────────────────────────────────────────────────────────
function resolveLogoUrl(url) {
  if (!url) return ''
  if (!url.startsWith('http')) return `/logos/chapters/${url}`
  return url
}

function ChapterCard({ chapter, index }) {
  const [imgError, setImgError] = useState(false)
  const initials = chapter.school
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
  const logoSrc = resolveLogoUrl(chapter.logo)

  return (
    <motion.div
      initial={{ opacity:0, x:-10 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.3, delay:Math.min(index * 0.025, 0.35) }}
      style={{
        display:'flex', alignItems:'center', gap:16,
        padding:'14px 20px',
        borderBottom:'1px solid rgba(168,212,240,0.055)',
        transition:'background 0.2s',
        cursor:'default',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,212,240,0.035)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        flexShrink:0, width:48, height:48, borderRadius:'50%',
        display:'flex', alignItems:'center', justifyContent:'center',
        background: (logoSrc && !imgError) ? 'rgba(255,255,255,0.93)' : 'rgba(168,212,240,0.07)',
        border:'1px solid rgba(168,212,240,0.12)',
        overflow:'hidden',
      }}>
        {logoSrc && !imgError ? (
          <img src={logoSrc} alt={chapter.school}
            style={{ width:'100%', height:'100%', objectFit:'contain', padding:5 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:16, fontWeight:300, color:'var(--pastel1)',
          }}>{initials || '?'}</span>
        )}
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:"'Cormorant Garamond', serif",
          fontSize:17, fontWeight:400,
          color:'var(--cream)', lineHeight:1.2,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>{chapter.school}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:3, flexWrap:'wrap' }}>
          <span style={{
            fontFamily:"'JetBrains Mono', monospace",
            fontSize:10, color:'var(--pastel2)', opacity:0.75,
          }}>{chapter.president}</span>
          {chapter.state && <>
            <span style={{ width:2, height:2, borderRadius:'50%', background:'rgba(168,212,240,0.3)', flexShrink:0 }} />
            <span style={{
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:9, color:'var(--muted)', opacity:0.45,
              textTransform:'uppercase', letterSpacing:1,
            }}>{chapter.state}</span>
          </>}
        </div>
      </div>

      <div style={{
        flexShrink:0,
        fontFamily:"'JetBrains Mono', monospace",
        fontSize:9, color:'var(--muted)', opacity:0.2, letterSpacing:2,
      }}>{String(index + 1).padStart(2, '0')}</div>
    </motion.div>
  )
}

export default function Home() {
  const [logoReady, setLogoReady]   = useState(false)
  const [ctaReady, setCtaReady]     = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const [chaptersData, setChaptersData]       = useState([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [searchQuery, setSearchQuery]         = useState('')

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const heroY = useTransform(scrollYProgress, [0,1], ['0%', '15%'])
  const heroO = useTransform(scrollYProgress, [0,0.7], [1, 0])

  useEffect(() => {
    const t1 = setTimeout(() => setLogoReady(true), 600)
    const t2 = setTimeout(() => setCtaReady(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Photo slideshow
  useEffect(() => {
    const timer = setInterval(() => setActivePhoto(p => (p + 1) % HERO_PHOTOS.length), 5500)
    return () => clearInterval(timer)
  }, [])

  // Chapters from Google Sheet
  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) {
      setChaptersData(staticChapters)
      setChaptersLoading(false)
      return
    }
    fetch(`${url}?action=get_chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.chapters) && data.chapters.length > 0)
          setChaptersData(data.chapters)
        else
          setChaptersData(staticChapters)
      })
      .catch(() => setChaptersData(staticChapters))
      .finally(() => setChaptersLoading(false))
  }, [])

  const q = searchQuery.trim().toLowerCase()
  const filteredChapters = q
    ? chaptersData.filter(c =>
        c.school?.toLowerCase().includes(q) ||
        c.president?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q)
      )
    : chaptersData

  return (
    <PageTransition>

      {/* ─── HERO: CINEMATIC PHOTO SLIDESHOW ─── */}
      <motion.section ref={heroRef} style={{ y: heroY, opacity: heroO, position:'relative', zIndex:1 }}>
        <div style={{ height:'100vh', position:'relative', overflow:'hidden' }}>

          {/* Cycling photo background with Ken Burns */}
          <div style={{ position:'absolute', inset:0 }}>
            <AnimatePresence>
              <motion.img
                key={HERO_PHOTOS[activePhoto]}
                src={HERO_PHOTOS[activePhoto]}
                alt=""
                initial={{ opacity:0, scale:1.04 }}
                animate={{ opacity:1, scale:1.14 }}
                exit={{ opacity:0 }}
                transition={{
                  opacity: { duration:1.8, ease:'easeInOut' },
                  scale:   { duration:8, ease:'linear' },
                }}
                style={{
                  position:'absolute', inset:0,
                  width:'100%', height:'100%', objectFit:'cover',
                }}
              />
            </AnimatePresence>
          </div>

          {/* Overlay — heavier top/bottom, light in middle so photos breathe */}
          <div style={{
            position:'absolute', inset:0, zIndex:2,
            background:'linear-gradient(to bottom, rgba(3,5,15,0.58) 0%, rgba(3,5,15,0.18) 45%, rgba(3,5,15,0.65) 100%)',
          }}/>

          {/* Content */}
          <div style={{
            position:'absolute', inset:0, zIndex:3,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:'0 24px',
          }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity:0, scale:0.85, filter:'blur(20px)' }}
              animate={logoReady ? { opacity:1, scale:1, filter:'blur(0px)' } : {}}
              transition={{ duration:1.4, ease:[0.4,0,0.2,1] }}
              style={{ marginBottom:52 }}
            >
              <div style={{ position:'relative', display:'inline-block' }}>
                <div style={{
                  position:'absolute', inset:-52, borderRadius:'50%',
                  background:'radial-gradient(circle, rgba(168,212,240,0.22) 0%, rgba(168,212,240,0.06) 45%, transparent 70%)',
                  animation:'breathe 5s ease-in-out infinite',
                }}/>
                <img
                  src="/images/cclogo.png" alt="CurioCrate"
                  style={{
                    height:'clamp(160px, 20vw, 240px)',
                    objectFit:'contain',
                    filter:'drop-shadow(0 0 40px rgba(168,212,240,0.85)) drop-shadow(0 0 100px rgba(168,212,240,0.4))',
                    animation:'drift 6s ease-in-out infinite',
                    display:'block',
                  }}
                />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={ctaReady ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.8, ease:[0.4,0,0.2,1] }}
              style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}
            >
              {[
                { to:'/kits',    label:'Explore Kits', primary:true  },
                { to:'/mission', label:'Our Mission',  primary:false },
                { to:'/gallery', label:'View Gallery', primary:false },
              ].map(btn => (
                <Link key={btn.to} to={btn.to} style={{
                  fontFamily:"'JetBrains Mono', monospace", fontSize:12,
                  letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
                  padding:'14px 32px', borderRadius:3,
                  border: btn.primary ? '1px solid rgba(168,212,240,0.5)' : '1px solid rgba(168,212,240,0.22)',
                  color: btn.primary ? 'var(--cream)' : 'rgba(197,227,247,0.7)',
                  background: btn.primary ? 'rgba(168,212,240,0.12)' : 'transparent',
                  backdropFilter:'blur(12px)',
                  transition:'all 0.35s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(168,212,240,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(168,212,240,0.65)'
                  e.currentTarget.style.color = 'var(--cream)'
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(168,212,240,0.22)'
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

          {/* Dot nav */}
          <motion.div
            initial={{ opacity:0 }}
            animate={ctaReady ? { opacity:1 } : {}}
            transition={{ duration:0.8 }}
            style={{
              position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)',
              zIndex:4, display:'flex', gap:7, alignItems:'center',
            }}
          >
            {HERO_PHOTOS.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} style={{
                width: i === activePhoto ? 22 : 6, height:6,
                borderRadius:3,
                background: i === activePhoto ? 'rgba(168,212,240,0.9)' : 'rgba(255,255,255,0.28)',
                border:'none', cursor:'pointer',
                transition:'all 0.4s ease', padding:0,
              }}/>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ─── OUR CHAPTERS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 0 110px' }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'radial-gradient(circle, rgba(168,212,240,0.045) 1px, transparent 1px)',
          backgroundSize:'48px 48px', pointerEvents:'none',
        }} />

        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

          <motion.div
            initial={{ opacity:0, y:28 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:40 }}
          >
            <div className="label" style={{ marginBottom:12 }}>The Network</div>
            <h2 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(32px,4vw,56px)',
              fontWeight:300, color:'var(--cream)', lineHeight:1.05, letterSpacing:'-0.02em',
            }}>
              Our Chapters<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>across the country.</em>
            </h2>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.6, delay:0.15 }}
            style={{ marginBottom:12 }}
          >
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'12px 16px',
              background:'rgba(8,16,42,0.6)',
              backdropFilter:'blur(24px)',
              border:'1px solid rgba(168,212,240,0.14)',
              borderRadius:12,
              transition:'border-color 0.3s',
            }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,212,240,0.32)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(168,212,240,0.14)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="rgba(168,212,240,0.35)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by school, president, or region…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex:1, background:'none', border:'none', outline:'none',
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:11, color:'var(--cream)', letterSpacing:0.3,
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{
                  background:'none', border:'none', cursor:'pointer',
                  color:'var(--muted)', fontSize:18, lineHeight:1, opacity:0.5,
                  padding:0, display:'flex', alignItems:'center',
                }}>×</button>
              )}
              {!chaptersLoading && chaptersData.length > 0 && (
                <span style={{
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:9, letterSpacing:2, color:'var(--muted)', opacity:0.35,
                  whiteSpace:'nowrap',
                }}>
                  {filteredChapters.length} / {chaptersData.length}
                </span>
              )}
            </div>
          </motion.div>

          {/* Scrollable list */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7, delay:0.22 }}
            style={{ position:'relative' }}
          >
            <div style={{
              height:580, overflowY:'auto',
              background:'rgba(6,12,32,0.55)',
              backdropFilter:'blur(28px)',
              border:'1px solid rgba(168,212,240,0.11)',
              borderRadius:18,
            }}>
              {chaptersLoading ? (
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  height:'100%', flexDirection:'column', gap:14,
                }}>
                  <div style={{
                    width:24, height:24, borderRadius:'50%',
                    border:'1px solid rgba(168,212,240,0.2)',
                    borderTopColor:'rgba(168,212,240,0.7)',
                    animation:'spin 0.9s linear infinite',
                  }} />
                  <span style={{
                    fontFamily:"'JetBrains Mono', monospace",
                    fontSize:10, letterSpacing:3, color:'var(--muted)', opacity:0.4,
                  }}>Loading chapters…</span>
                </div>
              ) : filteredChapters.length === 0 ? (
                <div style={{
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  height:'100%', gap:12,
                }}>
                  <div style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:52, color:'var(--pastel1)', opacity:0.18,
                  }}>◎</div>
                  <div style={{
                    fontFamily:"'JetBrains Mono', monospace",
                    fontSize:10, color:'var(--muted)', opacity:0.4, letterSpacing:2,
                  }}>
                    {searchQuery ? 'No chapters match' : 'Chapters launching soon'}
                  </div>
                </div>
              ) : filteredChapters.map((chapter, i) => (
                <ChapterCard key={chapter.school + i} chapter={chapter} index={i} />
              ))}
            </div>

            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:64,
              background:'linear-gradient(to top, rgba(6,12,32,0.85) 0%, transparent 100%)',
              borderRadius:'0 0 18px 18px',
              pointerEvents:'none',
            }} />
          </motion.div>

          <motion.p
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.3, duration:0.8 }}
            style={{
              textAlign:'center', marginTop:20,
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:10, letterSpacing:'2px', color:'var(--muted)', opacity:0.38,
            }}
          >
            Want to start a chapter? ·{' '}
            <a href="mailto:ckf.curiocrate@curiocrate.org" style={{ color:'var(--pastel1)', textDecoration:'none' }}>
              reach out to us
            </a>
          </motion.p>
        </div>
      </section>

      {/* ─── IMPACT STATS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:72 }}
          >
            <div className="label" style={{ marginBottom:14 }}>Our Impact</div>
            <h2 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(30px,4vw,52px)',
              fontWeight:300, color:'var(--cream)', lineHeight:1.1,
            }}>
              Every number is a child<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>who discovered science.</em>
            </h2>
          </motion.div>

          <div style={{
            display:'grid', gridTemplateColumns:'repeat(2, 1fr)',
            gap:3, borderRadius:20, overflow:'hidden',
            boxShadow:'0 40px 120px rgba(0,0,0,0.5)',
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.12, duration:0.9, ease:[0.4,0,0.2,1] }}
                style={{
                  padding:'72px 56px', position:'relative', overflow:'hidden',
                  border:'1px solid rgba(168,212,240,0.07)',
                }}
                onMouseEnter={e => {
                  const img = e.currentTarget.querySelector('img.stat-bg')
                  if (img) { img.style.transform='scale(1.07)'; img.style.filter='brightness(0.32) saturate(0.55)' }
                  const ov = e.currentTarget.querySelector('.stat-ov')
                  if (ov) ov.style.opacity='0.72'
                }}
                onMouseLeave={e => {
                  const img = e.currentTarget.querySelector('img.stat-bg')
                  if (img) { img.style.transform='scale(1)'; img.style.filter='brightness(0.22) saturate(0.45)' }
                  const ov = e.currentTarget.querySelector('.stat-ov')
                  if (ov) ov.style.opacity='1'
                }}
              >
                <img className="stat-bg" src={s.photo} alt="" style={{
                  position:'absolute', inset:0,
                  width:'100%', height:'100%', objectFit:'cover',
                  filter:'brightness(0.22) saturate(0.45)',
                  transition:'transform 0.7s ease, filter 0.7s ease',
                  pointerEvents:'none', userSelect:'none',
                }} />
                <div className="stat-ov" style={{
                  position:'absolute', inset:0,
                  background: i%2===0
                    ? 'linear-gradient(135deg, rgba(10,20,55,0.82) 0%, rgba(6,14,38,0.75) 100%)'
                    : 'linear-gradient(135deg, rgba(6,14,38,0.78) 0%, rgba(10,20,55,0.70) 100%)',
                  transition:'opacity 0.4s', pointerEvents:'none',
                }} />
                <div style={{
                  position:'absolute', bottom:-30, right:-10,
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:'clamp(120px,14vw,200px)', fontWeight:300, lineHeight:1,
                  color:'rgba(168,212,240,0.045)',
                  userSelect:'none', pointerEvents:'none', zIndex:1,
                }}>{s.value}</div>
                <motion.div
                  initial={{ scaleX:0 }}
                  whileInView={{ scaleX:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.12+0.3, duration:0.8, ease:[0.4,0,0.2,1] }}
                  style={{
                    position:'absolute', top:0, left:56, right:56, height:1,
                    background:'linear-gradient(to right, transparent, rgba(168,212,240,0.3), transparent)',
                    transformOrigin:'left', zIndex:2,
                  }}
                />
                <div style={{
                  position:'relative', zIndex:2,
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:'clamp(80px, 11vw, 140px)',
                  fontWeight:300, lineHeight:0.9,
                  color:'var(--pastel1)',
                  textShadow:'0 0 80px rgba(168,212,240,0.7), 0 0 160px rgba(168,212,240,0.3)',
                  marginBottom:24, letterSpacing:'-0.04em',
                }}>{s.value}</div>
                <div style={{
                  position:'relative', zIndex:2,
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:700, fontSize:13,
                  color:'var(--cream)', marginBottom:12,
                  textTransform:'uppercase', letterSpacing:'2.5px',
                }}>{s.label}</div>
                <div style={{
                  position:'relative', zIndex:2,
                  fontSize:14, color:'var(--muted)', lineHeight:1.75,
                  maxWidth:320, opacity:0.8,
                }}>{s.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 40px 100px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:60 }}
          >
            <div className="label" style={{ marginBottom:14 }}>Our Partners</div>
            <h2 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(28px,4vw,50px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.1, letterSpacing:'-0.02em',
            }}>
              Organizations who believe<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>science belongs to everyone.</em>
            </h2>
          </motion.div>

          <div style={{
            display:'grid', gridTemplateColumns:'repeat(2, 1fr)',
            gap:20, maxWidth:700, margin:'0 auto',
          }}>
            {[
              { name:'Society for Science',    type:'Education Partner',  logo:'/logos/sfslogo.png' },
              { name:'Connect Key Foundation', type:'Nonprofit Partner',  logo:'/logos/ckflogo.png' },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.7, delay:i*0.12 }}
                whileHover={{ y:-6 }}
                style={{
                  padding:'40px 32px',
                  border:'1px solid rgba(168,212,240,0.1)',
                  borderRadius:18,
                  background:'rgba(8,16,40,0.5)',
                  backdropFilter:'blur(20px)',
                  textAlign:'center',
                  transition:'border-color 0.4s, box-shadow 0.4s',
                  cursor:'default',
                  boxShadow:'0 8px 40px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(168,212,240,0.25)'; e.currentTarget.style.boxShadow='0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,212,240,0.08)' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(168,212,240,0.1)'; e.currentTarget.style.boxShadow='0 8px 40px rgba(0,0,0,0.3)' }}
              >
                <div style={{
                  height:80, display:'flex',
                  alignItems:'center', justifyContent:'center', marginBottom:20,
                }}>
                  <img src={p.logo} alt={p.name} style={{
                    maxHeight:72, maxWidth:200, objectFit:'contain',
                    filter:'brightness(0) invert(1) opacity(0.85)',
                    transition:'filter 0.3s',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.filter='brightness(0) invert(1) opacity(1)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.filter='brightness(0) invert(1) opacity(0.85)' }}
                  />
                </div>
                <div style={{
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:600, fontSize:15,
                  color:'var(--cream)', marginBottom:6,
                }}>{p.name}</div>
                <div className="label" style={{ fontSize:9, opacity:0.45 }}>{p.type}</div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.4, duration:0.8 }}
            style={{
              textAlign:'center', marginTop:44,
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:11, letterSpacing:'2px', color:'var(--muted)', opacity:0.5,
            }}
          >
            Want to partner with us? ·{' '}
            <a href="mailto:ckf.curiocrate@curiocrate.org" style={{ color:'var(--pastel1)', textDecoration:'none' }}>
              ckf.curiocrate@curiocrate.org
            </a>
          </motion.p>
        </div>
      </section>

    </PageTransition>
  )
}
