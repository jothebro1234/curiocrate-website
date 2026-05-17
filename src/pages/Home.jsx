import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const PHASES = [
  { delay: 0,    text: null },
  { delay: 800,  text: null },
  { delay: 1600, text: null },
  { delay: 2800, text: 'Est. 2023 · STEM for Every Child' },
  { delay: 3800, text: null },
]

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
  const [phase, setPhase] = useState(0)
  const [logoReady, setLogoReady] = useState(false)
  const [textReady, setTextReady] = useState(false)
  const [mascotReady, setMascotReady] = useState(false)
  const [scrollReady, setScrollReady] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] })
  const heroY    = useTransform(scrollYProgress, [0,1], ['0%',  '30%'])
  const heroO    = useTransform(scrollYProgress, [0,0.6], [1, 0])
  const headlineTyped = useTypewriter('Igniting Curiosity,\nOne Kit at a Time.', 38, textReady)

  useEffect(() => {
    const timers = [
      setTimeout(() => setLogoReady(true),   900),
      setTimeout(() => setTextReady(true),   2200),
      setTimeout(() => setMascotReady(true), 3000),
      setTimeout(() => setScrollReady(true), 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <PageTransition>
      {/* ─── HERO CINEMATIC OPEN ─── */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroO, position:'relative', zIndex:1 }}
      >
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 24px',
        }}>
          {/* Ambient vignette */}
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(ellipse 70% 70% at 50% 40%, rgba(10,30,80,0.4) 0%, rgba(3,5,15,0.85) 100%)',
            zIndex:0,
          }}/>

          {/* Scanline effect */}
          <div style={{
            position:'absolute', inset:0, zIndex:1, pointerEvents:'none', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', left:0, right:0, height:'1px',
              background:'linear-gradient(90deg, transparent, rgba(168,212,240,0.06), transparent)',
              animation:'scanline 8s linear infinite',
            }}/>
          </div>

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity:0, scale:0.85, filter:'blur(20px)' }}
            animate={logoReady
              ? { opacity:1, scale:1, filter:'blur(0px)' }
              : { opacity:0 }}
            transition={{ duration:1.4, ease:[0.4,0,0.2,1] }}
            style={{ position:'relative', zIndex:2, marginBottom:32, textAlign:'center' }}
          >
            <div style={{ position:'relative', display:'inline-block' }}>
              {/* Glow ring */}
              <div style={{
                position:'absolute', inset:-20,
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(168,212,240,0.15) 0%, transparent 70%)',
                animation:'breathe 4s ease-in-out infinite',
              }}/>
              <img
                src="/images/cclogo.png"
                alt="CurioCrate"
                style={{
                  height:120,
                  objectFit:'contain',
                  filter:'drop-shadow(0 0 30px rgba(168,212,240,0.6)) drop-shadow(0 0 60px rgba(168,212,240,0.25))',
                  animation:'drift 6s ease-in-out infinite',
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
            style={{ zIndex:2, marginBottom:20 }}
          >
            Est. 2023 · STEM for Every Child
          </motion.div>

          {/* Headline — typewriter */}
          <motion.h1
            initial={{ opacity:0 }}
            animate={textReady ? { opacity:1 } : {}}
            transition={{ duration:0.5 }}
            style={{
              position:'relative', zIndex:2,
              fontSize:'clamp(42px, 8vw, 96px)',
              fontWeight:300,
              fontFamily:"'Cormorant Garamond', serif",
              textAlign:'center',
              lineHeight:1.1,
              letterSpacing:'-0.02em',
              color:'var(--cream)',
              textShadow:'0 0 60px rgba(168,212,240,0.25)',
              whiteSpace:'pre-line',
              marginBottom:48,
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
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:12,
              letterSpacing:'3px',
              textTransform:'uppercase',
              textDecoration:'none',
              padding:'14px 32px',
              border:'1px solid rgba(168,212,240,0.35)',
              borderRadius:3,
              color:'var(--cream)',
              background:'rgba(168,212,240,0.06)',
              backdropFilter:'blur(10px)',
              transition:'all 0.4s ease',
              position:'relative',
              overflow:'hidden',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background='rgba(168,212,240,0.14)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.6)'
              e.currentTarget.style.boxShadow='0 0 30px rgba(168,212,240,0.2)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background='rgba(168,212,240,0.06)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.35)'
              e.currentTarget.style.boxShadow='none'
            }}
            >
              Explore Kits
            </Link>
            <Link to="/mission" style={{
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:12,
              letterSpacing:'3px',
              textTransform:'uppercase',
              textDecoration:'none',
              padding:'14px 32px',
              border:'1px solid rgba(168,212,240,0.12)',
              borderRadius:3,
              color:'var(--muted)',
              transition:'all 0.4s ease',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.color='var(--pastel2)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.3)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.color='var(--muted)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.12)'
            }}
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
              position:'absolute',
              right:'6%', bottom:'8%',
              height:'clamp(140px, 18vw, 260px)',
              objectFit:'contain',
              filter:'drop-shadow(0 0 24px rgba(168,212,240,0.4))',
              zIndex:2,
              animation:'drift 5s ease-in-out infinite',
              animationDelay:'0.5s',
            }}
          />

          {/* Motto */}
          <motion.div
            initial={{ opacity:0 }}
            animate={scrollReady ? { opacity:0.45 } : {}}
            transition={{ duration:1.5 }}
            style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:'italic', fontSize:'clamp(13px,1.5vw,17px)',
              color:'var(--pastel2)', letterSpacing:'0.08em',
              textAlign:'center', zIndex:2, marginBottom:32,
            }}
          >
            "Create Change in our Community through Curiosity."
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity:0 }}
            animate={scrollReady ? { opacity:1 } : {}}
            transition={{ duration:1 }}
            style={{
              position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
              display:'flex', flexDirection:'column', alignItems:'center', gap:10, zIndex:2,
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

      {/* ─── SECTION 2: REAL PHOTOS CINEMATIC STRIP ─── */}
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

          {/* Cinematic photo strip */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr', gridTemplateRows:'300px 220px', gap:12 }}>
            {[
              { src:'/images/IMG_3920.jpg',         style:{ gridRow:'1/3', gridColumn:'1/2' } },
              { src:'/images/volunteeringimage.jpg', style:{ gridRow:'1/2', gridColumn:'2/3' } },
              { src:'/images/IMG_9240.jpg',          style:{ gridRow:'1/2', gridColumn:'3/4' } },
              { src:'/images/P1080258.JPG',          style:{ gridRow:'2/3', gridColumn:'2/3' } },
              { src:'/images/P1080212.JPG',          style:{ gridRow:'2/3', gridColumn:'3/4' } },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, scale:0.96 }}
                whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }}
                transition={{ duration:0.8, delay:i*0.1, ease:[0.4,0,0.2,1] }}
                whileHover={{ scale:1.02, zIndex:10 }}
                style={{
                  ...img.style,
                  borderRadius:6,
                  overflow:'hidden',
                  position:'relative',
                  border:'1px solid rgba(168,212,240,0.08)',
                  cursor:'pointer',
                }}
              >
                <img
                  src={img.src}
                  alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s ease' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.08)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}
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
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:11, letterSpacing:'3px', textTransform:'uppercase',
              color:'var(--pastel1)', textDecoration:'none',
              padding:'12px 28px',
              border:'1px solid rgba(168,212,240,0.2)',
              borderRadius:3,
              transition:'all 0.3s ease',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background='rgba(168,212,240,0.06)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.4)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background='transparent'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.2)'
            }}
            >
              View Full Gallery →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 3: STATS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 40px' }}>
        <div style={{
          maxWidth:900, margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1,
          border:'1px solid rgba(168,212,240,0.08)',
          borderRadius:8, overflow:'hidden',
        }}>
          {[
            { v:'500+',   l:'Kits Delivered'     },
            { v:'20+',    l:'Events Hosted'       },
            { v:'15+',    l:'Communities'         },
            { v:'100%',   l:'Free for Recipients' },
          ].map((s,i) => (
            <motion.div
              key={s.l}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.1, duration:0.7 }}
              style={{
                padding:'48px 24px',
                textAlign:'center',
                background:'rgba(15,32,68,0.3)',
                backdropFilter:'blur(10px)',
                borderRight: i<3 ? '1px solid rgba(168,212,240,0.06)' : 'none',
              }}
            >
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:52, fontWeight:300,
                color:'var(--pastel1)',
                textShadow:'0 0 30px rgba(168,212,240,0.4)',
                lineHeight:1, marginBottom:10,
              }}>
                {s.v}
              </div>
              <div className="label" style={{ fontSize:9 }}>{s.l}</div>
            </motion.div>
          ))}
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
              Choose your experiment.
            </h2>
            <p style={{ color:'var(--muted)', fontSize:16, maxWidth:440, margin:'0 auto' }}>
              Each kit is a portal into a different world of discovery.
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
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:12, letterSpacing:'3px', textTransform:'uppercase',
              textDecoration:'none',
              padding:'16px 40px',
              background:'linear-gradient(135deg, rgba(168,212,240,0.12) 0%, rgba(168,212,240,0.04) 100%)',
              border:'1px solid rgba(168,212,240,0.3)',
              borderRadius:4,
              color:'var(--cream)',
              transition:'all 0.4s ease',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background='rgba(168,212,240,0.18)'
              e.currentTarget.style.boxShadow='0 0 40px rgba(168,212,240,0.15), inset 0 0 20px rgba(168,212,240,0.05)'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.5)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background='linear-gradient(135deg, rgba(168,212,240,0.12) 0%, rgba(168,212,240,0.04) 100%)'
              e.currentTarget.style.boxShadow='none'
              e.currentTarget.style.borderColor='rgba(168,212,240,0.3)'
            }}
            >
              Enter the Lab →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: PARTNERS ─── */}
      <section style={{ position:'relative', zIndex:1, padding:'80px 40px 100px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center', marginBottom:52 }}
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

          {/* Partner cards — replace with real logos/names */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
            gap:16,
          }}>
            {[
              { name:'Partner Organization', type:'Education Nonprofit', initial:'P' },
              { name:'Partner School',        type:'K–12 Institution',   initial:'S' },
              { name:'Community Foundation',  type:'Funding Partner',    initial:'C' },
              { name:'University Lab',         type:'Research Partner',   initial:'U' },
              { name:'Local Library System',  type:'Distribution Hub',   initial:'L' },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.7, delay:i*0.08 }}
                whileHover={{ y:-4, borderColor:'rgba(168,212,240,0.25)' }}
                style={{
                  padding:'28px 24px',
                  border:'1px solid rgba(168,212,240,0.08)',
                  borderRadius:14,
                  background:'rgba(8,16,40,0.45)',
                  backdropFilter:'blur(16px)',
                  textAlign:'center',
                  transition:'border-color 0.3s',
                  cursor:'default',
                }}
              >
                {/* Logo placeholder — replace with <img src="/images/partner-x.png"> */}
                <div style={{
                  width:56, height:56, borderRadius:14,
                  background:'linear-gradient(135deg, rgba(168,212,240,0.12) 0%, rgba(168,212,240,0.04) 100%)',
                  border:'1px solid rgba(168,212,240,0.12)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 16px',
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:24, color:'var(--pastel1)',
                }}>
                  {p.initial}
                </div>
                <div style={{
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:600, fontSize:14,
                  color:'var(--cream)', marginBottom:6,
                }}>
                  {p.name}
                </div>
                <div className="label" style={{ fontSize:9, opacity:0.5 }}>{p.type}</div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.4, duration:0.8 }}
            style={{
              textAlign:'center', marginTop:36,
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:11, letterSpacing:'2px', color:'var(--muted)', opacity:0.5,
            }}
          >
            Want to partner with us? ·{' '}
            <a href="mailto:hello@curiocrate.org" style={{ color:'var(--pastel1)', textDecoration:'none' }}>
              hello@curiocrate.org
            </a>
          </motion.p>
        </div>
      </section>

      {/* Mascot cameo bottom */}
      <div style={{
        position:'relative', zIndex:1,
        display:'flex', justifyContent:'flex-end',
        padding:'0 48px 80px',
        opacity:0.5,
      }}>
        <img
          src="/images/mascot1.png"
          alt=""
          style={{ height:80, filter:'drop-shadow(0 0 16px rgba(168,212,240,0.3))', animation:'drift 7s ease-in-out infinite' }}
        />
      </div>
    </PageTransition>
  )
}
