import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

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
            loop
            playsInline
            style={{
              position:'absolute', inset:0,
              width:'100%', height:'100%',
              objectFit:'cover',
              zIndex:0,
            }}
          >
            <source src="/missionvid.mp4" type="video/mp4" />
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
            className="mission-hero-text"
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

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity:0, y:40 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-60px' }}
          transition={{ duration:0.9, ease:[0.4,0,0.2,1] }}
          className="mission-body"
          style={{ padding:'80px 40px 120px', maxWidth:900, margin:'0 auto' }}
        >
          <div className="label" style={{ marginBottom:24, opacity:0.6 }}>Our Mission</div>
          <p style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontStyle:'italic',
            fontSize:'clamp(22px, 3vw, 34px)',
            color:'var(--cream)',
            lineHeight:1.7,
            letterSpacing:'-0.01em',
            opacity:0.9,
          }}>
            Curio Crate's mission is to empower every child by eliminating barriers to STEM education and providing free, hands-on and immersive learning experiences that spark curiosity.
          </p>
        </motion.div>


      </div>
      <style>{`
        @media(max-width:768px){
          .mission-hero-text { left: 20px !important; bottom: 48px !important; right: 20px !important; }
          .mission-body { padding: 56px 20px 80px !important; }
        }
      `}</style>
    </PageTransition>
  )
}
