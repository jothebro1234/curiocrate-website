import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height
    const COUNT = 60
    const ps = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      tw: Math.random() * Math.PI * 2,
      sp: 0.008 + Math.random() * 0.025,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W(), H())
      ps.forEach(p => {
        p.tw += p.sp
        const a = 0.1 + Math.abs(Math.sin(p.tw)) * 0.55
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168,212,240,${a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return (
    <canvas ref={ref} style={{
      position:'absolute', inset:0, width:'100%', height:'100%',
      zIndex:0, opacity:0.5, pointerEvents:'none',
    }} />
  )
}

// ─── ANIMATED FLASK ICON ─────────────────────────────────────────────────────
function FlaskIcon({ size = 120, color = 'rgba(168,212,240,0.7)' }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 80 80" fill="none"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter:`drop-shadow(0 0 20px ${color}) drop-shadow(0 0 40px ${color.replace('0.7','0.3')})` }}
    >
      {/* Flask body */}
      <path d="M30 8 L30 34 L14 62 Q11 70 20 72 L60 72 Q69 70 66 62 L50 34 L50 8 Z"
        stroke={color} strokeWidth="2" fill={color.replace('0.7','0.06')} strokeLinejoin="round"/>
      {/* Flask neck */}
      <line x1="26" y1="8" x2="54" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Bubbles inside */}
      <motion.circle cx="28" cy="58" r="4" fill={color.replace('0.7','0.4')}
        animate={{ cy:[58,48,38], opacity:[0.6,0.4,0] }} transition={{ duration:2.5, repeat:Infinity, delay:0 }}/>
      <motion.circle cx="40" cy="62" r="3" fill={color.replace('0.7','0.3')}
        animate={{ cy:[62,50,40], opacity:[0.5,0.3,0] }} transition={{ duration:3, repeat:Infinity, delay:0.8 }}/>
      <motion.circle cx="52" cy="55" r="3.5" fill={color.replace('0.7','0.35')}
        animate={{ cy:[55,44,34], opacity:[0.55,0.35,0] }} transition={{ duration:2.8, repeat:Infinity, delay:1.6 }}/>
    </motion.svg>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Kits() {
  return (
    <PageTransition>
      <div style={{
        position:'relative', zIndex:1, minHeight:'100vh',
        background:'#000810',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        overflow:'hidden',
      }}>
        {/* Ambient gradient */}
        <div style={{
          position:'absolute', inset:0,
          background:'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(168,212,240,0.06) 0%, rgba(0,8,16,0.98) 65%, #000 100%)',
          pointerEvents:'none',
        }}/>

        {/* Grid texture */}
        <div style={{
          position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(168,212,240,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(168,212,240,0.035) 1px, transparent 1px)',
          backgroundSize:'48px 48px',
        }}/>

        <ParticleCanvas />

        {/* ── CONTENT ── */}
        <div style={{
          position:'relative', zIndex:2,
          textAlign:'center', padding:'40px 40px',
          maxWidth:680,
        }}>
          {/* Label */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
          >
            <div className="label" style={{ marginBottom:40, letterSpacing:'6px', opacity:0.4 }}>
              ◈ &nbsp; THE LAB &nbsp; ◈
            </div>
          </motion.div>

          {/* Flask */}
          <motion.div
            initial={{ opacity:0, scale:0.6, filter:'blur(20px)' }}
            animate={{ opacity:1, scale:1, filter:'blur(0px)' }}
            transition={{ duration:1.2, ease:[0.4,0,0.2,1], delay:0.2 }}
            style={{ marginBottom:48 }}
          >
            <FlaskIcon size={120} color="rgba(168,212,240,0.7)" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9, delay:0.5, ease:[0.4,0,0.2,1] }}
            style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(42px, 7vw, 82px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.08, letterSpacing:'-0.02em',
              marginBottom:24,
              textShadow:'0 0 60px rgba(168,212,240,0.25)',
            }}
          >
            Kits in<br/>
            <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>Development.</em>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.75 }}
            style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontStyle:'italic', fontSize:'clamp(16px, 2vw, 21px)',
              color:'var(--muted)', lineHeight:1.75,
              marginBottom:56, opacity:0.8,
            }}
          >
            Our science kits are currently being designed, tested, and refined
            to bring the best hands-on discovery experience to students.
            Something extraordinary is coming.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX:0, opacity:0 }}
            animate={{ scaleX:1, opacity:1 }}
            transition={{ duration:0.9, delay:1, ease:[0.4,0,0.2,1] }}
            style={{
              height:1, marginBottom:52,
              background:'linear-gradient(to right, transparent, rgba(168,212,240,0.3), transparent)',
              transformOrigin:'center',
            }}
          />

          {/* Kit development CTA */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:1.1 }}
          >
            <div style={{
              padding:'40px 48px',
              border:'1px solid rgba(168,212,240,0.12)',
              borderRadius:16,
              background:'rgba(8,20,50,0.5)',
              backdropFilter:'blur(20px)',
            }}>
              <div className="label" style={{ marginBottom:16, opacity:0.5 }}>
                Interested in developing a kit?
              </div>
              <p style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:18, color:'var(--muted)',
                lineHeight:1.7, marginBottom:28,
              }}>
                We welcome educators, scientists, and makers who want to help design
                hands-on STEM kits for our community. Reach out and let's build
                something together.
              </p>
              <a
                href="mailto:ckf.curiocrate@curiocrate.org"
                style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:11, letterSpacing:'3px', textTransform:'uppercase',
                  textDecoration:'none', padding:'14px 32px',
                  border:'1px solid rgba(168,212,240,0.3)', borderRadius:4,
                  color:'var(--pastel1)',
                  background:'rgba(168,212,240,0.05)',
                  transition:'all 0.4s ease',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.12)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.5)'; e.currentTarget.style.boxShadow='0 0 30px rgba(168,212,240,0.15)' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.05)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.3)'; e.currentTarget.style.boxShadow='none' }}
              >
                ✉ &nbsp; ckf.curiocrate@curiocrate.org
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
