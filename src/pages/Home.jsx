import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { stats } from '../data/stats'
import { chapters as staticChapters } from '../data/chapters'

function resolveLogoUrl(url) {
  if (!url) return ''
  // Plain filename → serve from project's logos folder
  if (!url.startsWith('http')) return `/logos/chapters/${url}`
  // Full URL → use as-is
  return url
}

// ─── CHAPTER ROW ──────────────────────────────────────────────────────────────
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
      {/* Logo circle */}
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

      {/* Info */}
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

      {/* Row number */}
      <div style={{
        flexShrink:0,
        fontFamily:"'JetBrains Mono', monospace",
        fontSize:9, color:'var(--muted)', opacity:0.2, letterSpacing:2,
      }}>{String(index + 1).padStart(2, '0')}</div>
    </motion.div>
  )
}

function useTypewriter(text, speed = 38, start = false) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!start || !text) return
    setDisplayed('')
    let i = 0
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [text, start, speed])
  return displayed
}

export default function Home() {
  const [logoReady, setLogoReady] = useState(false)
  const [textReady, setTextReady] = useState(false)
  const [mascotReady, setMascotReady] = useState(false)
  const [scrollReady, setScrollReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [chaptersData, setChaptersData] = useState(staticChapters)
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const heroY = useTransform(scrollYProgress, [0,1], ['0%', '30%'])
  const heroO = useTransform(scrollYProgress, [0,0.6], [1, 0])
  const headlineTyped = useTypewriter('Creating Change in our Community\nby Sparking Curiosity', 36, textReady)

  useEffect(() => {
    const timers = [
      setTimeout(() => setLogoReady(true),   900),
      setTimeout(() => setTextReady(true),   2200),
      setTimeout(() => setMascotReady(true), 3000),
      setTimeout(() => setScrollReady(true), 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setChaptersLoading(false); return }
    fetch(`${url}?action=get_chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.chapters) && data.chapters.length > 0)
          setChaptersData(data.chapters)
      })
      .catch(() => {})
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
      {/* ─── HERO ─── */}
      <motion.section ref={heroRef} style={{ y: heroY, opacity: heroO, position:'relative', zIndex:1 }}>
        <div style={{
          minHeight:'100vh',
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          position:'relative', overflow:'hidden', padding:'0 24px',
        }}>
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 70% at 50% 40%, rgba(10,30,80,0.4) 0%, rgba(3,5,15,0.85) 100%)',
            zIndex:0,
          }}/>
          <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden' }}>
            <div style={{
              position:'absolute', left:0, right:0, height:'1px',
              background:'linear-gradient(90deg, transparent, rgba(168,212,240,0.06), transparent)',
              animation:'scanline 8s linear infinite',
            }}/>
          </div>

          {/* ── Logo — grand and effective ── */}
          <motion.div
            initial={{ opacity:0, scale:0.8, filter:'blur(24px)' }}
            animate={logoReady ? { opacity:1, scale:1, filter:'blur(0px)' } : { opacity:0 }}
            transition={{ duration:1.6, ease:[0.4,0,0.2,1] }}
            style={{ position:'relative', zIndex:2, marginBottom:40, textAlign:'center' }}
          >
            <div style={{ position:'relative', display:'inline-block' }}>
              {/* Outer glow ring */}
              <div style={{
                position:'absolute', inset:-48,
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(168,212,240,0.18) 0%, rgba(168,212,240,0.06) 45%, transparent 70%)',
                animation:'breathe 5s ease-in-out infinite',
              }}/>
              {/* Inner glow ring */}
              <div style={{
                position:'absolute', inset:-16,
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(168,212,240,0.12) 0%, transparent 70%)',
                animation:'breathe 3s ease-in-out infinite',
                animationDelay:'0.8s',
              }}/>
              <img
                src="/images/cclogo.png"
                alt="CurioCrate"
                style={{
                  height:'clamp(180px, 22vw, 280px)',
                  objectFit:'contain',
                  filter:'drop-shadow(0 0 40px rgba(168,212,240,0.7)) drop-shadow(0 0 80px rgba(168,212,240,0.35)) drop-shadow(0 0 160px rgba(168,212,240,0.15))',
                  animation:'drift 6s ease-in-out infinite',
                  display:'block',
                }}
              />
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity:0, letterSpacing:'8px' }}
            animate={textReady ? { opacity:0.6, letterSpacing:'4px' } : {}}
            transition={{ duration:1.2 }}
            className="label"
            style={{ zIndex:2, marginBottom:24 }}
          >
            Est. 2023 · STEM for Every Child
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity:0 }}
            animate={textReady ? { opacity:1 } : {}}
            transition={{ duration:0.5 }}
            style={{
              position:'relative', zIndex:2,
              fontSize:'clamp(36px, 6.5vw, 82px)',
              fontWeight:300,
              fontFamily:"'Cormorant Garamond', serif",
              textAlign:'center',
              lineHeight:1.12,
              letterSpacing:'-0.02em',
              color:'var(--cream)',
              textShadow:'0 0 60px rgba(168,212,240,0.25)',
              whiteSpace:'pre-line',
              marginBottom:52,
            }}
          >
            {headlineTyped}
            <span style={{ opacity: textReady ? 1 : 0, animation:'breathe 1s ease-in-out infinite' }}>_</span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={scrollReady ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.8, ease:[0.4,0,0.2,1] }}
            style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', zIndex:2, marginBottom:48 }}
          >
            <Link to="/kits" style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize:12,
              letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
              padding:'14px 32px', border:'1px solid rgba(168,212,240,0.35)', borderRadius:3,
              color:'var(--cream)', background:'rgba(168,212,240,0.06)', backdropFilter:'blur(10px)',
              transition:'all 0.4s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.14)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.6)'; e.currentTarget.style.boxShadow='0 0 30px rgba(168,212,240,0.2)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.06)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.35)'; e.currentTarget.style.boxShadow='none' }}
            >
              Explore Kits
            </Link>
            <Link to="/mission" style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize:12,
              letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
              padding:'14px 32px', border:'1px solid rgba(168,212,240,0.12)', borderRadius:3,
              color:'var(--muted)', transition:'all 0.4s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.color='var(--pastel2)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.3)' }}
            onMouseLeave={e=>{ e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.12)' }}
            >
              Our Mission
            </Link>
          </motion.div>

          {/* Mascot */}
          <motion.img
            src="/images/mascot1.png"
            alt="CurioCrate Mascot"
            initial={{ opacity:0, x:60, y:20 }}
            animate={mascotReady ? { opacity:0.92, x:0, y:0 } : {}}
            transition={{ duration:1.2, ease:[0.4,0,0.2,1] }}
            style={{
              position:'absolute', right:'6%', bottom:'8%',
              height:'clamp(140px, 18vw, 260px)', objectFit:'contain',
              filter:'drop-shadow(0 0 24px rgba(168,212,240,0.4))',
              zIndex:2, animation:'drift 5s ease-in-out infinite', animationDelay:'0.5s',
            }}
          />

          {/* Motto */}
          <motion.div
            initial={{ opacity:0 }}
            animate={scrollReady ? { opacity:0.45 } : {}}
            transition={{ duration:1.5 }}
            style={{
              fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
              fontSize:'clamp(13px,1.5vw,17px)', color:'var(--pastel2)',
              letterSpacing:'0.08em', textAlign:'center', zIndex:2, marginBottom:32,
            }}
          >
            "Create Change in our Community through Curiosity."
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity: scrollReady && !scrolled ? 1 : 0 }}
            transition={{ duration:0.5 }}
            style={{
              position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10, zIndex:2,
              pointerEvents:'none',
            }}
          >
            <span className="label" style={{ fontSize:9 }}>Scroll to explore</span>
            <div style={{
              width:1, height:48,
              background:'linear-gradient(to bottom, rgba(168,212,240,0.6), transparent)',
              animation:'breathe 2s ease-in-out infinite',
            }}/>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── SECTION 2: REAL PHOTOS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'120px 0', overflow:'hidden' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 40px' }}>
          <motion.div
            initial={{ opacity:0, y:40 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.9, ease:[0.4,0,0.2,1] }}
            style={{ marginBottom:64, textAlign:'center' }}
          >
            <div className="label" style={{ marginBottom:16 }}>In the Field</div>
            <h2 style={{ fontSize:'clamp(32px,5vw,64px)', color:'var(--cream)', lineHeight:1.1 }}>
              Science happening,<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>right now.</em>
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr', gridTemplateRows:'300px 220px', gap:12 }}>
            {[
              { src:'/images/IMG_3920.jpg',         style:{ gridRow:'1/3', gridColumn:'1/2' } },
              { src:'/images/volunteeringimage.jpg', style:{ gridRow:'1/2', gridColumn:'2/3' } },
              { src:'/images/IMG_9240.jpg',          style:{ gridRow:'1/2', gridColumn:'3/4' } },
              { src:'/images/P1080258.JPG',          style:{ gridRow:'2/3', gridColumn:'2/3' } },
              { src:'/images/P1080212.JPG',          style:{ gridRow:'2/3', gridColumn:'3/4' } },
            ].map((img, i) => (
              <motion.div key={i}
                initial={{ opacity:0, scale:0.96 }}
                whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }}
                transition={{ duration:0.8, delay:i*0.1, ease:[0.4,0,0.2,1] }}
                whileHover={{ scale:1.02, zIndex:10 }}
                style={{
                  ...img.style, borderRadius:6, overflow:'hidden', position:'relative',
                  border:'1px solid rgba(168,212,240,0.08)', cursor:'pointer',
                }}
              >
                <img src={img.src} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s ease' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.08)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)' }}
                />
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(6,13,31,0.6) 0%, transparent 50%)',
                }}/>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.5, duration:0.8 }}
            style={{ textAlign:'center', marginTop:48 }}
          >
            <Link to="/gallery" style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize:11,
              letterSpacing:'3px', textTransform:'uppercase',
              color:'var(--pastel1)', textDecoration:'none',
              padding:'12px 28px', border:'1px solid rgba(168,212,240,0.2)', borderRadius:3,
              transition:'all 0.3s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.06)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.4)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(168,212,240,0.2)' }}
            >
              View Full Gallery →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── OUR CHAPTERS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 0 110px' }}>
        {/* Dot-grid bg */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'radial-gradient(circle, rgba(168,212,240,0.045) 1px, transparent 1px)',
          backgroundSize:'48px 48px', pointerEvents:'none',
        }} />

        <div style={{ maxWidth:760, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

          {/* Section header */}
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
              {!chaptersLoading && (
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

          {/* Scrollable container */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.7, delay:0.22 }}
            style={{ position:'relative' }}
          >
            <div style={{
              height:580,
              overflowY:'auto',
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
                  }}>No chapters match</div>
                </div>
              ) : filteredChapters.map((chapter, i) => (
                <ChapterCard key={chapter.school + i} chapter={chapter} index={i} />
              ))}
            </div>

            {/* Bottom fade overlay */}
            <div style={{
              position:'absolute', bottom:0, left:0, right:0, height:64,
              background:'linear-gradient(to top, rgba(6,12,32,0.85) 0%, transparent 100%)',
              borderRadius:'0 0 18px 18px',
              pointerEvents:'none',
            }} />
          </motion.div>

          {/* Footer */}
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

      {/* ─── SECTION 3: IMPACT STATS — redesigned for meaning ─── */}
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
            display:'grid',
            gridTemplateColumns:'repeat(2, 1fr)',
            gap:3,
            borderRadius:20, overflow:'hidden',
            boxShadow:'0 40px 120px rgba(0,0,0,0.5)',
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.12, duration:0.9, ease:[0.4,0,0.2,1] }}
                whileHover={{ background:'rgba(12,26,64,0.7)' }}
                style={{
                  padding:'72px 56px',
                  background: i%2===0 ? 'rgba(10,20,50,0.55)' : 'rgba(8,16,40,0.38)',
                  backdropFilter:'blur(16px)',
                  border:'1px solid rgba(168,212,240,0.07)',
                  position:'relative', overflow:'hidden',
                  transition:'background 0.4s',
                }}
              >
                {/* Ghost watermark */}
                <div style={{
                  position:'absolute', bottom:-30, right:-10,
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:'clamp(120px,14vw,200px)', fontWeight:300, lineHeight:1,
                  color:'rgba(168,212,240,0.035)',
                  userSelect:'none', pointerEvents:'none',
                }}>{s.value}</div>

                {/* Top accent rule */}
                <motion.div
                  initial={{ scaleX:0 }}
                  whileInView={{ scaleX:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:i*0.12+0.3, duration:0.8, ease:[0.4,0,0.2,1] }}
                  style={{
                    position:'absolute', top:0, left:56, right:56, height:1,
                    background:'linear-gradient(to right, transparent, rgba(168,212,240,0.25), transparent)',
                    transformOrigin:'left',
                  }}
                />

                {/* Number */}
                <div style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:'clamp(80px, 11vw, 140px)',
                  fontWeight:300, lineHeight:0.9,
                  color:'var(--pastel1)',
                  textShadow:'0 0 80px rgba(168,212,240,0.55), 0 0 160px rgba(168,212,240,0.2)',
                  marginBottom:24, letterSpacing:'-0.04em',
                }}>
                  {s.value}
                </div>

                {/* Label */}
                <div style={{
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:700, fontSize:13,
                  color:'var(--cream)', marginBottom:12,
                  textTransform:'uppercase', letterSpacing:'2.5px',
                }}>
                  {s.label}
                </div>

                {/* Description */}
                <div style={{
                  fontSize:14, color:'var(--muted)', lineHeight:1.75,
                  maxWidth:320, opacity:0.75,
                }}>
                  {s.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: KIT TEASER ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'100px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:64 }}
          >
            <div className="label" style={{ marginBottom:16 }}>The Collection</div>
            <h2 style={{ fontSize:'clamp(30px,5vw,60px)', color:'var(--cream)', lineHeight:1.1, marginBottom:16 }}>
              Kits in development.
            </h2>
            <p style={{ color:'var(--muted)', fontSize:16, maxWidth:480, margin:'0 auto' }}>
              We're crafting hands-on science kits to bring discovery directly to students. Stay tuned.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.2 }}
            style={{ textAlign:'center' }}
          >
            <Link to="/kits" style={{
              display:'inline-flex', alignItems:'center', gap:12,
              fontFamily:"'JetBrains Mono', monospace", fontSize:12,
              letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none',
              padding:'16px 40px',
              background:'linear-gradient(135deg, rgba(168,212,240,0.12) 0%, rgba(168,212,240,0.04) 100%)',
              border:'1px solid rgba(168,212,240,0.3)', borderRadius:4,
              color:'var(--cream)', transition:'all 0.4s ease',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.18)'; e.currentTarget.style.boxShadow='0 0 40px rgba(168,212,240,0.15), inset 0 0 20px rgba(168,212,240,0.05)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.5)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='linear-gradient(135deg, rgba(168,212,240,0.12) 0%, rgba(168,212,240,0.04) 100%)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='rgba(168,212,240,0.3)' }}
            >
              Learn More →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: PARTNERS ─── */}
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
            display:'grid',
            gridTemplateColumns:'repeat(2, 1fr)',
            gap:20, maxWidth:700, margin:'0 auto',
          }}>
            {[
              {
                name: 'Society for Science',
                type: 'Education Partner',
                logo: '/logos/sfslogo.png',
              },
              {
                name: 'Connect Key Foundation',
                type: 'Nonprofit Partner',
                logo: '/logos/ckflogo.png',
              },
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
                  alignItems:'center', justifyContent:'center',
                  marginBottom:20,
                }}>
                  <img
                    src={p.logo} alt={p.name}
                    style={{
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
                }}>
                  {p.name}
                </div>
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

      {/* Mascot cameo */}
      <div style={{
        position:'relative', zIndex:1,
        display:'flex', justifyContent:'flex-end',
        padding:'0 48px 80px', opacity:0.5,
      }}>
        <img src="/images/mascot1.png" alt=""
          style={{ height:80, filter:'drop-shadow(0 0 16px rgba(168,212,240,0.3))', animation:'drift 7s ease-in-out infinite' }}
        />
      </div>
    </PageTransition>
  )
}
