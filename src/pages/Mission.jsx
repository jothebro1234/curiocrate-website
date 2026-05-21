import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const chapters = [
  {
    n:'01', title:'The Problem',
    body:'Millions of children grow up without access to quality STEM education. Not because they lack curiosity — but because quality resources never reached them.',
    icon:'🔍',
  },
  {
    n:'02', title:'Our Answer',
    body:'CurioCrate builds hands-on science kits and delivers them directly into underserved communities — turning curiosity into structured discovery.',
    icon:'📦',
  },
  {
    n:'03', title:'The Impact',
    body:'Every kit reaches a child who might not otherwise have held a real microscope, built a circuit, or mixed a chemical reaction. That moment matters.',
    icon:'⭐',
  },
]

function InViewFade({ children, delay=0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:0.9, delay, ease:[0.4,0,0.2,1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Mission() {
  return (
    <PageTransition>
      <div style={{ minHeight:'100vh', position:'relative', zIndex:1, overflow:'hidden' }}>

        {/* ── VIDEO HERO ── */}
        <div style={{
          position:'relative',
          width:'100%',
          height:'100vh',
          overflow:'hidden',
          flexShrink:0,
        }}>
          {/* Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover',
              zIndex:0,
            }}
          >
            <source src="/missionvideo.mp4" type="video/mp4" />
          </video>

          {/* Top fade — blends with nav */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:160,
            background:'linear-gradient(to bottom, rgba(3,5,15,0.72) 0%, transparent 100%)',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* Bottom fade — blends into next section */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:220,
            background:'linear-gradient(to top, var(--void, #03050f) 0%, transparent 100%)',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* Subtle vignette */}
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(3,5,15,0.45) 100%)',
            zIndex:1, pointerEvents:'none',
          }}/>

          {/* Text overlay — bottom left */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:1.1, delay:0.4, ease:[0.4,0,0.2,1] }}
            style={{
              position:'absolute', bottom:80, left:56,
              zIndex:2, maxWidth:600,
            }}
          >
            <div className="label" style={{ marginBottom:14, opacity:0.7 }}>Our Purpose</div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(40px, 7vw, 88px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.05, letterSpacing:'-0.02em',
              marginBottom:0,
              textShadow:'0 2px 40px rgba(0,0,0,0.6)',
            }}>
              Science belongs<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>to everyone.</em>
            </h1>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:1.2, duration:1 }}
            style={{
              position:'absolute', bottom:32, right:48,
              display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              zIndex:2,
            }}
          >
            <span className="label" style={{ fontSize:9, opacity:0.45 }}>Scroll</span>
            <div style={{
              width:1, height:40,
              background:'linear-gradient(to bottom, rgba(168,212,240,0.5), transparent)',
              animation:'breathe 2s ease-in-out infinite',
            }}/>
          </motion.div>
        </div>

        {/* Chapter scroll */}
        <div style={{ padding:'80px 40px', maxWidth:900, margin:'0 auto' }}>
          {chapters.map((ch, i) => (
            <InViewFade key={ch.n} delay={i*0.1}>
              <div style={{
                marginBottom:80,
                paddingBottom:80,
                borderBottom: i < chapters.length-1
                  ? '1px solid rgba(168,212,240,0.06)'
                  : 'none',
              }}>
                {/* Content */}
                <div>
                  <div style={{
                    fontSize:32, marginBottom:16,
                    filter:'drop-shadow(0 0 12px rgba(168,212,240,0.3))',
                  }}>
                    {ch.icon}
                  </div>
                  <h2 style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:42, fontWeight:300,
                    color:'var(--cream)', marginBottom:16,
                    lineHeight:1.1,
                  }}>
                    {ch.title}
                  </h2>
                  <p style={{ fontSize:17, color:'var(--muted)', lineHeight:1.85, maxWidth:580 }}>
                    {ch.body}
                  </p>
                </div>
              </div>
            </InViewFade>
          ))}
        </div>

        {/* Quote */}
        <InViewFade>
          <div style={{
            padding:'80px 40px',
            textAlign:'center',
            position:'relative',
          }}>
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(to bottom, transparent, rgba(10,30,80,0.2), transparent)',
            }}/>
            <div style={{ position:'relative', maxWidth:700, margin:'0 auto' }}>
              <div style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:14, letterSpacing:'4px',
                color:'var(--pastel1)', opacity:0.6,
                marginBottom:32, textTransform:'uppercase',
              }}>
                ❝
              </div>
              <blockquote style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:'clamp(28px,4vw,48px)',
                fontWeight:300, fontStyle:'italic',
                color:'var(--cream)', lineHeight:1.3,
                marginBottom:24,
              }}>
                A child who asks 'why' is a scientist in the making.
              </blockquote>
              <div className="label" style={{ fontSize:9 }}>— The CurioCrate Team</div>
            </div>
          </div>
        </InViewFade>

      </div>
    </PageTransition>
  )
}
