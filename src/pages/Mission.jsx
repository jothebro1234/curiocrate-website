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

        {/* Hero */}
        <div style={{
          minHeight:'60vh',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'160px 40px 80px',
          textAlign:'center', position:'relative',
        }}>
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(10,30,80,0.5) 0%, transparent 70%)',
          }}/>
          <div style={{ position:'relative', zIndex:1 }}>
            <InViewFade>
              <div className="label" style={{ marginBottom:16 }}>Our Purpose</div>
            </InViewFade>
            <InViewFade delay={0.1}>
              <h1 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:'clamp(48px,8vw,96px)',
                fontWeight:300, color:'var(--cream)',
                lineHeight:1.05, letterSpacing:'-0.02em',
                marginBottom:24,
              }}>
                Science belongs<br/>
                <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>to everyone.</em>
              </h1>
            </InViewFade>
            <InViewFade delay={0.2}>
              <p style={{ fontSize:18, color:'var(--muted)', maxWidth:520, margin:'0 auto', lineHeight:1.8 }}>
                We exist to close the gap between curiosity and opportunity —
                one kit, one child, one community at a time.
              </p>
            </InViewFade>
          </div>
        </div>

        {/* Chapter scroll */}
        <div style={{ padding:'80px 40px', maxWidth:900, margin:'0 auto' }}>
          {chapters.map((ch, i) => (
            <InViewFade key={ch.n} delay={i*0.1}>
              <div style={{
                display:'grid', gridTemplateColumns:'80px 1fr',
                gap:32, marginBottom:80,
                paddingBottom:80,
                borderBottom: i < chapters.length-1
                  ? '1px solid rgba(168,212,240,0.06)'
                  : 'none',
              }}>
                {/* Number */}
                <div style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:64, fontWeight:300,
                  color:'rgba(168,212,240,0.15)',
                  lineHeight:1, paddingTop:8,
                }}>
                  {ch.n}
                </div>
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

        {/* Stats */}
        <div style={{ padding:'60px 40px 120px', maxWidth:1000, margin:'0 auto' }}>
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(2,1fr)',
            gap:1, border:'1px solid rgba(168,212,240,0.08)',
            borderRadius:8, overflow:'hidden',
          }}>
            {[
              { v:'500+', l:'Kits in Hands' },
              { v:'15+',  l:'Communities Reached' },
              { v:'20+',  l:'Events Hosted' },
              { v:'100%', l:'Free for Recipients' },
            ].map((s,i) => (
              <InViewFade key={s.l} delay={i*0.1}>
                <div style={{
                  padding:'48px 40px',
                  background:'rgba(15,32,68,0.3)',
                  backdropFilter:'blur(10px)',
                  borderRight: i%2===0 ? '1px solid rgba(168,212,240,0.06)' : 'none',
                  borderBottom: i<2 ? '1px solid rgba(168,212,240,0.06)' : 'none',
                  textAlign:'center',
                }}>
                  <div style={{
                    fontFamily:"'Cormorant Garamond', serif",
                    fontSize:56, fontWeight:300,
                    color:'var(--pastel1)',
                    textShadow:'0 0 30px rgba(168,212,240,0.35)',
                    lineHeight:1, marginBottom:10,
                  }}>
                    {s.v}
                  </div>
                  <div className="label" style={{ fontSize:9 }}>{s.l}</div>
                </div>
              </InViewFade>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
