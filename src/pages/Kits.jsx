import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const kits = [
  {
    id: 'chemistry',
    name: 'Chemistry Explorer',
    codename: 'PROJECT ELEMENT',
    tagline: 'Transform the invisible.',
    description: 'Unlock the secret language of matter. Acid-base reactions that shift color before your eyes. Crystallization that feels like conjuring. Ten experiments that make the invisible visible.',
    price: 24.99,
    image: '/images/kit-chemistry.png',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.7)',
    glowDim: 'rgba(56,189,248,0.18)',
    atmoFrom: '#000d1a',
    atmoTo: '#001f3f',
    particleColor: '#38bdf8',
    particleType: 'bubbles',
    includes: ['pH strips', '10 experiment cards', 'Safety goggles', 'Lab journal'],
    stats: [{ l:'Experiments', v:'10', b:0.5 },{ l:'Difficulty', v:'Beginner', b:0.3 },{ l:'Age Range', v:'8–14', b:null },{ l:'Duration', v:'45 min', b:null }],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    // Void position: percentage of screen
    vx: 50, vy: 28,
    driftDuration: 7,
  },
  {
    id: 'robotics',
    name: 'Robotics Starter',
    codename: 'PROJECT NEXUS',
    tagline: 'Build something alive.',
    description: 'From a heap of parts to a moving, sensing machine. Wire the motors. Write the first lines of code. Watch it breathe. This is what it feels like to create life from logic.',
    price: 34.99,
    image: '/images/kit-robotics.png',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.7)',
    glowDim: 'rgba(167,139,250,0.18)',
    atmoFrom: '#0d0018',
    atmoTo: '#1a0040',
    particleColor: '#a78bfa',
    particleType: 'sparks',
    includes: ['Robot chassis', '2 motors', 'Proximity sensor', 'Coding guide'],
    stats: [{ l:'Components', v:'24 pcs', b:0.8 },{ l:'Difficulty', v:'Moderate', b:0.65 },{ l:'Age Range', v:'10–16', b:null },{ l:'Duration', v:'90 min', b:null }],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    vx: 22, vy: 68,
    driftDuration: 9,
  },
  {
    id: 'space',
    name: 'Space Science',
    codename: 'PROJECT HORIZON',
    tagline: 'The cosmos, in your hands.',
    description: 'The universe is 13.8 billion years old. Tonight, you chart it. Build a refracting telescope. Map constellations. Model planetary orbits. Realize how vast — and beautiful — the dark truly is.',
    price: 29.99,
    image: '/images/kit-space.png',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.7)',
    glowDim: 'rgba(251,191,36,0.18)',
    atmoFrom: '#0a0800',
    atmoTo: '#1a1200',
    particleColor: '#fbbf24',
    particleType: 'stars',
    includes: ['Mini telescope', 'Star chart', 'Planet model kit', 'Observation log'],
    stats: [{ l:'Activities', v:'8', b:0.4 },{ l:'Difficulty', v:'Beginner', b:0.3 },{ l:'Age Range', v:'8–15', b:null },{ l:'Duration', v:'60 min', b:null }],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    vx: 78, vy: 68,
    driftDuration: 11,
  },
]

// ─── ATMOSPHERE CANVAS ────────────────────────────────────────────────────────
function AtmosphereCanvas({ kit }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    const W = canvas.width  = window.innerWidth
    const H = canvas.height = window.innerHeight
    let ps = []
    const hex = kit.particleColor

    for (let i = 0; i < 80; i++) {
      ps.push(kit.particleType === 'stars'
        ? { x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+0.3, tw:Math.random()*Math.PI*2, sp:0.01+Math.random()*0.03 }
        : kit.particleType === 'bubbles'
          ? { x:Math.random()*W, y:H+10, r:3+Math.random()*7, vx:(Math.random()-.5)*.5, vy:-.4-Math.random(), a:.4+Math.random()*.4 }
          : { x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*1.8, vy:(Math.random()-.5)*1.8, r:1+Math.random()*2, a:.7, life:1 })
    }

    const draw = () => {
      ctx.clearRect(0,0,W,H)
      ps.forEach((p,i) => {
        if (kit.particleType === 'stars') {
          p.tw += p.sp
          const a = 0.15 + Math.abs(Math.sin(p.tw)) * 0.7
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
          ctx.fillStyle = hex + Math.floor(a*255).toString(16).padStart(2,'0')
          ctx.fill()
        } else if (kit.particleType === 'bubbles') {
          p.x+=p.vx; p.y+=p.vy; p.a-=.002
          if (p.y<-20||p.a<=0) ps[i]={ x:Math.random()*W, y:H+10, r:3+Math.random()*7, vx:(Math.random()-.5)*.5, vy:-.4-Math.random(), a:.4+Math.random()*.4 }
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
          ctx.strokeStyle = hex + Math.floor(p.a*180).toString(16).padStart(2,'0')
          ctx.lineWidth=1; ctx.stroke()
        } else {
          p.x+=p.vx; p.y+=p.vy; p.a-=.01; p.vx*=.97; p.vy*=.97
          if (p.a<=0) ps[i]={ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*1.8, vy:(Math.random()-.5)*1.8, r:1+Math.random()*2, a:.7, life:1 }
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
          ctx.fillStyle = hex + Math.floor(p.a*255).toString(16).padStart(2,'0')
          ctx.fill()
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [kit])

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, opacity:.6 }} />
}

// ─── 3D TILT KIT IMAGE ────────────────────────────────────────────────────────
function TiltKitImage({ kit, size = 340 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)

  return (
    <motion.div ref={ref} style={{ perspective:1000, width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
      onMouseMove={e=>{
        const r=ref.current.getBoundingClientRect()
        animate(ry,(e.clientX-r.left-r.width/2)/(r.width/2)*20,{duration:.2,ease:'easeOut'})
        animate(rx,-(e.clientY-r.top-r.height/2)/(r.height/2)*14,{duration:.2,ease:'easeOut'})
      }}
      onMouseLeave={()=>{animate(rx,0,{duration:.8,ease:'easeOut'});animate(ry,0,{duration:.8,ease:'easeOut'})}}
    >
      <motion.img src={kit.image} alt={kit.name} draggable={false}
        style={{
          rotateX:useTransform(rx,v=>`${v}deg`), rotateY:useTransform(ry,v=>`${v}deg`),
          width:'90%', height:'90%', objectFit:'contain',
          filter:`drop-shadow(0 0 50px ${kit.glow}) drop-shadow(0 0 100px ${kit.glowDim}) drop-shadow(0 40px 60px rgba(0,0,0,0.8))`,
          animation:'drift 6s ease-in-out infinite',
          userSelect:'none',
        }}
      />
    </motion.div>
  )
}

// ─── QUANTITY CONTROL ─────────────────────────────────────────────────────────
function QtyControl({ qty, set, color, glow }) {
  const [dir, setDir] = useState(0)
  const bump = (d) => { const n=Math.max(1,Math.min(99,qty+d)); if(n===qty)return; setDir(d); set(n); setTimeout(()=>setDir(0),250) }
  const btn = (label,d) => (
    <button onClick={()=>bump(d)} style={{
      width:44,height:44, border:`1px solid ${color}33`,
      background:`${color}08`, color, fontSize:22, cursor:'pointer',
      display:'flex',alignItems:'center',justifyContent:'center',
      borderRadius: d<0?'8px 0 0 8px':'0 8px 8px 0',
      borderRight:d<0?'none':'1px solid '+color+'33',
      borderLeft:d>0?'none':'1px solid '+color+'33',
      transition:'background .2s', fontFamily:'inherit',
    }} onMouseEnter={e=>e.currentTarget.style.background=`${color}18`}
       onMouseLeave={e=>e.currentTarget.style.background=`${color}08`}>
      {label}
    </button>
  )
  return (
    <div style={{display:'flex',alignItems:'center'}}>
      {btn('−',-1)}
      <div style={{width:60,height:44,border:`1px solid ${color}22`,background:`${color}05`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <AnimatePresence mode="popLayout">
          <motion.span key={qty}
            initial={{y:dir>0?18:dir<0?-18:0,opacity:0}}
            animate={{y:0,opacity:1}} exit={{y:dir>0?-18:18,opacity:0}}
            transition={{duration:.18,ease:[.4,0,.2,1]}}
            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color,textShadow:`0 0 12px ${glow}`,display:'block'}}
          >{String(qty).padStart(2,'0')}</motion.span>
        </AnimatePresence>
      </div>
      {btn('+',1)}
    </div>
  )
}

// ─── ACQUIRE BUTTON ───────────────────────────────────────────────────────────
function AcquireButton({ kit, qty }) {
  const [phase, setPhase] = useState('idle')
  const total = (kit.price*qty).toFixed(2)
  const click = () => {
    if(phase!=='idle') return
    setPhase('charging')
    setTimeout(()=>setPhase('done'),1100)
    setTimeout(()=>{ window.open(kit.stripeLink,'_blank'); setPhase('idle') },3000)
  }
  return (
    <motion.button onClick={click} whileTap={{scale:.97}}
      style={{
        width:'100%', padding:'18px 0', borderRadius:10, border:'none', cursor:phase==='done'?'default':'pointer',
        background: phase==='done' ? 'linear-gradient(135deg,#22c55e,#15803d)'
          : `linear-gradient(135deg, ${kit.color} 0%, ${kit.color}99 100%)`,
        color:'#000', fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontWeight:800, fontSize:15, letterSpacing:'.5px', position:'relative', overflow:'hidden',
        boxShadow: phase==='done' ? '0 0 50px rgba(34,197,94,.6)' : `0 0 40px ${kit.glow}, 0 0 80px ${kit.glowDim}`,
        transition:'background .5s, box-shadow .5s',
      }}
    >
      {phase==='idle' && <>
        <motion.div animate={{x:['-100%','220%']}} transition={{duration:2.2,repeat:Infinity,ease:'easeInOut',repeatDelay:.8}}
          style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)',pointerEvents:'none'}}/>
        Acquire · ${total}
      </>}
      {phase==='charging' && (
        <motion.div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          <motion.span animate={{rotate:360}} transition={{duration:.7,repeat:Infinity,ease:'linear'}}>◌</motion.span>
          Initiating…
        </motion.div>
      )}
      {phase==='done' && (
        <motion.span initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}} style={{color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          ✓ Kit Acquired — Check your email
        </motion.span>
      )}
    </motion.button>
  )
}

// ─── FULL-SCREEN KIT WORLD ────────────────────────────────────────────────────
function KitWorld({ kit, onClose }) {
  const [qty, setQty] = useState(1)
  const [burst, setBurst] = useState(false)

  useEffect(()=>{
    const fn = e => { if(e.key==='Escape') onClose() }
    window.addEventListener('keydown',fn)
    return ()=>window.removeEventListener('keydown',fn)
  },[onClose])

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:.5}}
      style={{position:'fixed',inset:0,zIndex:500}}
    >
      {/* Flash burst */}
      <AnimatePresence>
        {burst && <motion.div initial={{opacity:.8}} animate={{opacity:0}} exit={{opacity:0}} transition={{duration:.5}}
          style={{position:'fixed',inset:0,zIndex:600,background:kit.color,mixBlendMode:'screen',pointerEvents:'none'}}/>}
      </AnimatePresence>

      {/* Atmosphere fill */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        transition={{duration:.8}}
        style={{
          position:'absolute',inset:0,zIndex:0,
          background:`radial-gradient(ellipse 80% 80% at 40% 50%, ${kit.atmoTo} 0%, ${kit.atmoFrom} 60%, #000 100%)`,
        }}
      />

      {/* Particle atmosphere */}
      <AtmosphereCanvas kit={kit}/>

      {/* Spotlight beam */}
      <div style={{
        position:'absolute', top:0, left:'32%',
        width:400, height:'70%', zIndex:1, pointerEvents:'none',
        background:`linear-gradient(to bottom, ${kit.glow.replace('.7','.08')}, transparent)`,
        clipPath:'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
      }}/>

      {/* Horizontal grid lines — Dune/Interstellar feel */}
      <div style={{
        position:'absolute',inset:0,zIndex:1,pointerEvents:'none',
        backgroundImage:`linear-gradient(${kit.color}06 1px, transparent 1px)`,
        backgroundSize:'100% 60px',
      }}/>

      {/* Close */}
      <motion.button
        initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:.6}}
        onClick={onClose}
        style={{
          position:'absolute',top:28,right:32,zIndex:10,
          background:'none',border:`1px solid ${kit.color}33`,borderRadius:8,
          color:'var(--muted)',fontSize:13,cursor:'pointer',
          padding:'8px 16px',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'2px',
          transition:'all .2s',
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=kit.color;e.currentTarget.style.color=kit.color}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=kit.color+'33';e.currentTarget.style.color='var(--muted)'}}
      >
        ESC · EXIT
      </motion.button>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position:'relative',zIndex:5,
        display:'grid', gridTemplateColumns:'1fr 1fr',
        height:'100vh', overflow:'hidden',
      }}>

        {/* LEFT — Visual stage */}
        <div style={{
          display:'flex',flexDirection:'column',
          alignItems:'center',justifyContent:'center',
          padding:'80px 40px',
          borderRight:`1px solid ${kit.color}14`,
          position:'relative',overflow:'hidden',
        }}>
          {/* Codename top-left */}
          <motion.div
            initial={{opacity:0,x:-20}} animate={{opacity:.4,x:0}} transition={{delay:.3,duration:.8}}
            style={{
              position:'absolute',top:40,left:40,
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:9,letterSpacing:'4px',color:kit.color,textTransform:'uppercase',
            }}
          >
            ◈ {kit.codename}
          </motion.div>

          {/* Big watermark */}
          <div style={{
            position:'absolute',bottom:-40,right:-20,
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:220,fontWeight:300,lineHeight:1,
            color:kit.color,opacity:.04,userSelect:'none',pointerEvents:'none',
          }}>
            {String(kits.findIndex(k=>k.id===kit.id)+1).padStart(2,'0')}
          </div>

          {/* Kit image — cinematic entrance */}
          <motion.div
            initial={{scale:.5,opacity:0,filter:'blur(30px)'}}
            animate={{scale:1,opacity:1,filter:'blur(0px)'}}
            transition={{duration:.9,ease:[.4,0,.2,1],delay:.1}}
          >
            <TiltKitImage kit={kit} size={360}/>
          </motion.div>

          {/* Kit name — subtitle style */}
          <motion.div
            initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
            transition={{delay:.5,duration:.8,ease:[.4,0,.2,1]}}
            style={{textAlign:'center',marginTop:16}}
          >
            <h2 style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:'clamp(36px,4vw,58px)',
              fontWeight:300,color:'var(--cream)',
              lineHeight:1,letterSpacing:'-0.02em',
              textShadow:`0 0 60px ${kit.glow},0 0 120px ${kit.glowDim}`,
              marginBottom:10,
            }}>
              {kit.name}
            </h2>
            <motion.p
              initial={{opacity:0}} animate={{opacity:.6}} transition={{delay:.8,duration:.8}}
              style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontStyle:'italic',fontSize:18,
                color:kit.color,letterSpacing:'.05em',
              }}
            >
              {kit.tagline}
            </motion.p>
          </motion.div>
        </div>

        {/* RIGHT — Mission brief */}
        <motion.div
          initial={{opacity:0,x:40}} animate={{opacity:1,x:0}}
          transition={{delay:.3,duration:.8,ease:[.4,0,.2,1]}}
          style={{
            padding:'80px 56px 40px',
            display:'flex',flexDirection:'column',
            justifyContent:'space-between',
            overflowY:'auto',
          }}
        >
          <div>
            {/* Mission brief header */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}
              style={{display:'flex',alignItems:'center',gap:16,marginBottom:32}}
            >
              <div style={{width:28,height:1,background:`linear-gradient(to right,${kit.color},transparent)`}}/>
              <span className="label" style={{color:kit.color,opacity:.9,fontSize:9}}>MISSION BRIEF</span>
              <div style={{width:28,height:1,background:`linear-gradient(to left,${kit.color},transparent)`}}/>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.55,duration:.7}}
              style={{fontSize:15,color:'var(--muted)',lineHeight:1.95,marginBottom:36}}
            >
              {kit.description}
            </motion.p>

            {/* Stats — Interstellar mission style */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.65}}>
              <div className="label" style={{marginBottom:14,fontSize:9}}>Kit Intel</div>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
                {kit.stats.map((s,i)=>(
                  <motion.div key={s.l} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:.7+i*.08}}
                    style={{display:'flex',alignItems:'center',gap:12}}
                  >
                    <div style={{width:88,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--muted)',letterSpacing:'1px',flexShrink:0}}>{s.l}</div>
                    {s.b!==null
                      ? <div style={{flex:1,height:2,background:'rgba(255,255,255,0.05)',borderRadius:2,overflow:'hidden'}}>
                          <motion.div initial={{width:0}} animate={{width:`${s.b*100}%`}} transition={{delay:.9+i*.1,duration:.9,ease:[.4,0,.2,1]}}
                            style={{height:'100%',borderRadius:2,background:`linear-gradient(to right,${kit.color}66,${kit.color})`}}/>
                        </div>
                      : <div style={{flex:1}}/>}
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:kit.color,flexShrink:0}}>{s.v}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.8}}>
              <div className="label" style={{marginBottom:12,fontSize:9}}>Contents</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 16px',marginBottom:36}}>
                {kit.includes.map((item,i)=>(
                  <motion.div key={item} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.85+i*.06}}
                    style={{display:'flex',alignItems:'center',gap:8}}
                  >
                    <div style={{width:5,height:5,borderRadius:'50%',background:kit.color,boxShadow:`0 0 6px ${kit.glow}`,flexShrink:0}}/>
                    <span style={{fontSize:12,color:'var(--muted)'}}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── ACQUIRE BLOCK ── */}
          <motion.div
            initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
            transition={{delay:.9,duration:.7,ease:[.4,0,.2,1]}}
            style={{
              padding:'28px',
              background:`${kit.color}07`,
              border:`1px solid ${kit.color}18`,
              borderRadius:14,
              flexShrink:0,
            }}
          >
            <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:20}}>
              <div>
                <div className="label" style={{fontSize:8,marginBottom:6}}>Price per kit</div>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:52,fontWeight:300,
                  color:kit.color,lineHeight:1,
                  textShadow:`0 0 30px ${kit.glow}`,
                }}>
                  ${kit.price}
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="label" style={{fontSize:8,marginBottom:8}}>Quantity</div>
                <QtyControl qty={qty} set={setQty} color={kit.color} glow={kit.glow}/>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display:'flex',alignItems:'center',justifyContent:'space-between',
              marginBottom:16,paddingBottom:16,
              borderBottom:`1px solid ${kit.color}14`,
            }}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--muted)',letterSpacing:'2px'}}>TOTAL</span>
              <motion.span key={qty} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:.2}}
                style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:'var(--cream)',textShadow:`0 0 16px ${kit.glow}`}}
              >
                ${(kit.price*qty).toFixed(2)}
              </motion.span>
            </div>

            <AcquireButton kit={kit} qty={qty}/>

            <div style={{textAlign:'center',marginTop:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'1.5px',color:'var(--muted)',opacity:.4}}>
              Secure checkout · Free shipping · Ships 3–5 days
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── FLOATING VOID OBJECT ─────────────────────────────────────────────────────
function FloatingKit({ kit, index, onSelect, anyHovered, setAnyHovered }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity:0, scale:.6, filter:'blur(20px)' }}
      animate={{ opacity:1, scale:1, filter:'blur(0px)' }}
      transition={{ duration:1.4, delay:.3+index*.25, ease:[.4,0,.2,1] }}
      style={{
        position:'absolute',
        left:`${kit.vx}%`, top:`${kit.vy}%`,
        transform:'translate(-50%, -50%)',
        cursor:'pointer', zIndex: hov ? 10 : 2,
      }}
      onClick={()=>onSelect(kit)}
      onHoverStart={()=>{ setHov(true); setAnyHovered(true) }}
      onHoverEnd={()=>{ setHov(false); setAnyHovered(false) }}
    >
      {/* Outer pulse ring */}
      <AnimatePresence>
        {hov && (
          <motion.div key="ring"
            initial={{scale:.8,opacity:0}} animate={{scale:1.6,opacity:0}}
            exit={{opacity:0}} transition={{duration:1.2,repeat:Infinity,repeatType:'loop'}}
            style={{
              position:'absolute',inset:-20,borderRadius:'50%',
              border:`1px solid ${kit.color}`,pointerEvents:'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Ground glow */}
      <motion.div
        animate={{ opacity: hov ? 1 : .35, scale: hov ? 1.3 : 1 }}
        transition={{ duration:.4 }}
        style={{
          position:'absolute',
          bottom:-30, left:'50%', transform:'translateX(-50%)',
          width:120, height:30, borderRadius:'50%',
          background:`radial-gradient(ellipse, ${kit.glow.replace('.7','.25')} 0%, transparent 70%)`,
          filter:'blur(8px)', pointerEvents:'none',
        }}
      />

      {/* Kit image */}
      <motion.img
        src={kit.image}
        alt={kit.name}
        draggable={false}
        animate={{
          y: [0,-14,0],
          filter: hov
            ? `drop-shadow(0 0 40px ${kit.glow}) drop-shadow(0 0 80px ${kit.glowDim})`
            : `drop-shadow(0 0 14px ${kit.glowDim})`,
          scale: hov ? 1.1 : anyHovered && !hov ? .88 : 1,
          opacity: anyHovered && !hov ? .35 : 1,
        }}
        transition={{
          y:{ duration: kit.driftDuration, repeat:Infinity, ease:'easeInOut', delay: index*.5 },
          filter:{ duration:.4 },
          scale:{ duration:.5, ease:[.4,0,.2,1] },
          opacity:{ duration:.4 },
        }}
        style={{
          height:'clamp(120px,14vw,200px)',
          objectFit:'contain',
          display:'block',
          userSelect:'none',
        }}
      />

      {/* Kit name — appears on hover */}
      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
            transition={{duration:.3}}
            style={{
              position:'absolute',
              top:'calc(100% + 14px)', left:'50%', transform:'translateX(-50%)',
              textAlign:'center', pointerEvents:'none', whiteSpace:'nowrap',
            }}
          >
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:18,fontWeight:300,
              color:'var(--cream)',letterSpacing:'.06em',
              textShadow:`0 0 20px ${kit.glow}`,
              marginBottom:4,
            }}>
              {kit.name}
            </div>
            <div style={{
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:9,letterSpacing:'3px',textTransform:'uppercase',
              color:kit.color,opacity:.8,
            }}>
              {kit.price} · Select to enter →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Kits() {
  const [selected, setSelected]     = useState(null)
  const [anyHovered, setAnyHovered] = useState(false)
  const [showHint, setShowHint]     = useState(true)

  useEffect(()=>{
    const t = setTimeout(()=>setShowHint(false), 5000)
    return ()=>clearTimeout(t)
  },[])

  return (
    <PageTransition>
      <div style={{
        position:'relative', zIndex:1,
        width:'100%', height:'100vh',
        overflow:'hidden',
        background:'#000008',
      }}>
        {/* Void background vignette */}
        <div style={{
          position:'absolute',inset:0,zIndex:0,
          background:'radial-gradient(ellipse 80% 60% at 50% 50%, #03070f 0%, #000 100%)',
          pointerEvents:'none',
        }}/>

        {/* Page title — very subtle, top */}
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.8,duration:1}}
          style={{
            position:'absolute',top:100,left:0,right:0,
            textAlign:'center',zIndex:3,pointerEvents:'none',
          }}
        >
          <div className="label" style={{fontSize:9,opacity:.3,letterSpacing:'5px'}}>
            ◈ &nbsp; THE LAB &nbsp; ◈
          </div>
        </motion.div>

        {/* Floating kit objects */}
        {kits.map((kit,i)=>(
          <FloatingKit
            key={kit.id} kit={kit} index={i}
            onSelect={setSelected}
            anyHovered={anyHovered}
            setAnyHovered={setAnyHovered}
          />
        ))}

        {/* Hover hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{opacity:0,y:10}} animate={{opacity:.35,y:0}} exit={{opacity:0}}
              transition={{delay:1.8,duration:1}}
              style={{
                position:'absolute',bottom:48,left:0,right:0,
                textAlign:'center',zIndex:3,pointerEvents:'none',
              }}
            >
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'3px',color:'var(--pastel2)',textTransform:'uppercase'}}>
                Hover a kit to reveal · Click to enter its world
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KIT WORLD MODAL ── */}
        <AnimatePresence>
          {selected && <KitWorld kit={selected} onClose={()=>setSelected(null)} />}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
