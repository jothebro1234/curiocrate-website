import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// ─── DATA ────────────────────────────────────────────────────────────────────
const kits = [
  {
    id: 'chemistry',
    name: 'Chemistry\nExplorer',
    shortName: 'Chemistry',
    tier: 'STANDARD',
    tagline: 'Transform the invisible.',
    description: 'Unlock the secret language of matter. From acid-base reactions that change color before your eyes to crystallization that feels like magic — this kit turns your home into a real laboratory.',
    price: 24.99,
    image: '/images/kit-chemistry.png',
    color: '#7ecfff',
    colorDim: 'rgba(126,207,255,0.12)',
    glow: 'rgba(126,207,255,0.55)',
    glowSoft: 'rgba(126,207,255,0.15)',
    dark: '#030d18',
    particleColor: '#7ecfff',
    includes: ['pH strips', '10 experiment cards', 'Safety goggles', 'Lab journal'],
    stats: [
      { label: 'Experiments', value: '10', bar: 0.5 },
      { label: 'Difficulty', value: 'Beginner', bar: 0.3 },
      { label: 'Age Range', value: '8 – 14', bar: null },
      { label: 'Duration', value: '45 min', bar: null },
    ],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: 'bubbles',
  },
  {
    id: 'robotics',
    name: 'Robotics\nStarter',
    shortName: 'Robotics',
    tier: 'ADVANCED',
    tagline: 'Build something alive.',
    description: 'From a pile of parts to a moving, sensing machine — this kit teaches you to think like an engineer. Build your first robot chassis, wire the sensors, write the first lines of code that make it breathe.',
    price: 34.99,
    image: '/images/kit-robotics.png',
    color: '#c084fc',
    colorDim: 'rgba(192,132,252,0.12)',
    glow: 'rgba(192,132,252,0.55)',
    glowSoft: 'rgba(192,132,252,0.15)',
    dark: '#0d0318',
    particleColor: '#c084fc',
    includes: ['Robot chassis', '2 motors', 'Proximity sensor', 'Coding guide'],
    stats: [
      { label: 'Components', value: '24 pcs', bar: 0.8 },
      { label: 'Difficulty', value: 'Moderate', bar: 0.65 },
      { label: 'Age Range', value: '10 – 16', bar: null },
      { label: 'Duration', value: '90 min', bar: null },
    ],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: 'sparks',
  },
  {
    id: 'space',
    name: 'Space\nScience',
    shortName: 'Space',
    tier: 'EXPLORER',
    tagline: 'Hold the cosmos.',
    description: 'The universe is 13.8 billion years old. Tonight, you map it. Build a refracting telescope, chart constellations, model planetary orbits, and realize just how vast — and beautiful — the dark really is.',
    price: 29.99,
    image: '/images/kit-space.png',
    color: '#fbbf24',
    colorDim: 'rgba(251,191,36,0.12)',
    glow: 'rgba(251,191,36,0.55)',
    glowSoft: 'rgba(251,191,36,0.15)',
    dark: '#100c00',
    particleColor: '#fbbf24',
    includes: ['Mini telescope', 'Star chart', 'Planet model kit', 'Observation log'],
    stats: [
      { label: 'Activities', value: '8', bar: 0.4 },
      { label: 'Difficulty', value: 'Beginner', bar: 0.3 },
      { label: 'Age Range', value: '8 – 15', bar: null },
      { label: 'Duration', value: '60 min', bar: null },
    ],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: 'stars',
  },
]

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────
function KitParticles({ type, color, active }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    let raf, particles = []

    const spawn = () => {
      if (type === 'bubbles') return {
        x: Math.random() * canvas.width, y: canvas.height + 10,
        r: 3 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 0.6, vy: -0.5 - Math.random() * 1.2,
        a: 0.3 + Math.random() * 0.4, life: 1,
      }
      if (type === 'sparks') return {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2.5, vy: (Math.random() - 0.5) * 2.5,
        r: 1 + Math.random() * 2, a: 0.8, life: 0.6 + Math.random() * 0.4,
      }
      return { // stars
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5, a: Math.random(), life: 1,
        twinkle: Math.random() * Math.PI * 2, speed: 0.02 + Math.random() * 0.04,
      }
    }

    for (let i = 0; i < 60; i++) particles.push(spawn())

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const hex = color

      particles.forEach((p, i) => {
        if (type === 'bubbles') {
          p.x += p.vx; p.y += p.vy; p.a -= 0.003
          if (p.y < -20 || p.a <= 0) particles[i] = spawn()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.strokeStyle = `${hex}${Math.floor(p.a * 200).toString(16).padStart(2,'0')}`
          ctx.lineWidth = 1
          ctx.stroke()
        } else if (type === 'sparks') {
          p.x += p.vx; p.y += p.vy; p.a -= 0.012; p.vx *= 0.97; p.vy *= 0.97
          if (p.a <= 0) particles[i] = spawn()
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `${hex}${Math.floor(p.a * 255).toString(16).padStart(2,'0')}`
          ctx.fill()
        } else {
          p.twinkle += p.speed
          const alpha = 0.2 + Math.abs(Math.sin(p.twinkle)) * 0.7
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `${hex}${Math.floor(alpha * 255).toString(16).padStart(2,'0')}`
          ctx.fill()
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [active, type, color])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}

// ─── 3D TILT IMAGE ───────────────────────────────────────────────────────────
function TiltImage({ src, color, glow, size = 320 }) {
  const ref = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const rotX = useTransform(rx, v => `${v}deg`)
  const rotY = useTransform(ry, v => `${v}deg`)

  return (
    <motion.div
      ref={ref}
      style={{ perspective: 900, width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect()
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
        animate(ry, dx * 18, { duration: 0.25, ease: 'easeOut' })
        animate(rx, -dy * 12, { duration: 0.25, ease: 'easeOut' })
      }}
      onMouseLeave={() => {
        animate(rx, 0, { duration: 0.7, ease: 'easeOut' })
        animate(ry, 0, { duration: 0.7, ease: 'easeOut' })
      }}
    >
      <motion.img
        src={src}
        alt=""
        draggable={false}
        style={{
          rotateX: rotX, rotateY: rotY,
          width: '88%', height: '88%',
          objectFit: 'contain',
          filter: `drop-shadow(0 0 40px ${glow}) drop-shadow(0 0 80px ${glow.replace('0.55','0.2')}) drop-shadow(0 30px 50px rgba(0,0,0,0.6))`,
          animation: 'drift 5s ease-in-out infinite',
          userSelect: 'none',
        }}
      />
    </motion.div>
  )
}

// ─── QUANTITY CONTROL ────────────────────────────────────────────────────────
function QuantityControl({ qty, setQty, color, glow }) {
  const [bump, setBump] = useState(null)
  const change = (dir) => {
    const next = Math.max(1, Math.min(99, qty + dir))
    if (next === qty) return
    setQty(next)
    setBump(dir)
    setTimeout(() => setBump(null), 300)
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button onClick={() => change(-1)} style={{
        width: 44, height: 44, borderRadius: '8px 0 0 8px',
        border: `1px solid ${color}33`, borderRight: 'none',
        background: `${color}08`, color, fontSize: 20,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}18` }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}08` }}
      >−</button>

      <div style={{
        width: 64, height: 44,
        border: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}05`, overflow: 'hidden', position: 'relative',
      }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={qty}
            initial={{ y: bump === 1 ? 20 : bump === -1 ? -20 : 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: bump === 1 ? -20 : 20, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4,0,0.2,1] }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18, fontWeight: 400,
              color, display: 'block',
              textShadow: `0 0 12px ${glow}`,
            }}
          >
            {String(qty).padStart(2,'0')}
          </motion.span>
        </AnimatePresence>
      </div>

      <button onClick={() => change(1)} style={{
        width: 44, height: 44, borderRadius: '0 8px 8px 0',
        border: `1px solid ${color}33`, borderLeft: 'none',
        background: `${color}08`, color, fontSize: 20,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}18` }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}08` }}
      >+</button>
    </div>
  )
}

// ─── ACQUIRE BUTTON ──────────────────────────────────────────────────────────
function AcquireButton({ kit, qty, onClick }) {
  const [state, setState] = useState('idle') // idle | loading | done
  const total = (kit.price * qty).toFixed(2)

  const handleClick = () => {
    if (state !== 'idle') return
    setState('loading')
    setTimeout(() => { setState('done'); onClick() }, 900)
    setTimeout(() => setState('idle'), 3200)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      style={{
        width: '100%', padding: '18px 0',
        borderRadius: 10, border: 'none', cursor: state === 'done' ? 'default' : 'pointer',
        background: state === 'done'
          ? `linear-gradient(135deg, #22c55e, #16a34a)`
          : `linear-gradient(135deg, ${kit.color}dd 0%, ${kit.color}88 100%)`,
        color: '#000', fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800, fontSize: 15, letterSpacing: '0.5px',
        boxShadow: state === 'done'
          ? '0 0 40px rgba(34,197,94,0.5)'
          : `0 0 30px ${kit.glow}, 0 0 60px ${kit.glow.replace('0.55','0.2')}`,
        transition: 'background 0.4s, box-shadow 0.4s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Shimmer sweep */}
      {state === 'idle' && (
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span key="idle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            Acquire · ${total}
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8}}
          >
            <motion.span animate={{rotate:360}} transition={{duration:0.7, repeat:Infinity, ease:'linear'}} style={{display:'inline-block'}}>◌</motion.span>
            Processing…
          </motion.span>
        )}
        {state === 'done' && (
          <motion.span key="done"
            initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} exit={{opacity:0}}
            style={{color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}
          >
            ✓ Kit Acquired
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── PEDESTAL CARD ───────────────────────────────────────────────────────────
function PedestalCard({ kit, index, onSelect }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity:0, y:80 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.9, delay: index * 0.15, ease:[0.4,0,0.2,1] }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => onSelect(kit)}
      style={{
        position: 'relative', cursor: 'pointer',
        borderRadius: 20,
        border: `1px solid ${hov ? kit.color + '44' : 'rgba(255,255,255,0.06)'}`,
        background: `linear-gradient(160deg, ${kit.dark} 0%, #060d1f 100%)`,
        backdropFilter: 'blur(20px)',
        padding: '48px 32px 36px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: hov
          ? `0 40px 80px rgba(0,0,0,0.6), 0 0 80px ${kit.glowSoft}, inset 0 1px 0 ${kit.color}22`
          : '0 20px 60px rgba(0,0,0,0.4)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        overflow: 'hidden',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Particle BG */}
      <KitParticles type={kit.particles} color={kit.particleColor} active={hov} />

      {/* Top glow */}
      <div style={{
        position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)',
        width:200, height:200, borderRadius:'50%',
        background:`radial-gradient(circle, ${kit.glowSoft} 0%, transparent 70%)`,
        opacity: hov ? 1 : 0.3, transition: 'opacity 0.5s', pointerEvents:'none', zIndex:0,
      }}/>

      {/* Tier */}
      <div className="label" style={{ fontSize:9, color:kit.color, opacity:0.8, marginBottom:24, zIndex:2 }}>{kit.tier}</div>

      {/* Image */}
      <motion.img
        src={kit.image}
        alt={kit.shortName}
        animate={{ y: hov ? -8 : 0, filter: hov
          ? `drop-shadow(0 0 30px ${kit.glow}) drop-shadow(0 10px 30px rgba(0,0,0,0.5))`
          : `drop-shadow(0 0 10px ${kit.glowSoft}) drop-shadow(0 6px 20px rgba(0,0,0,0.4))` }}
        transition={{ duration: 0.4 }}
        style={{ height:160, objectFit:'contain', marginBottom:28, zIndex:2, animation:'drift 6s ease-in-out infinite' }}
        draggable={false}
      />

      {/* Name */}
      <h3 style={{
        fontFamily:"'Cormorant Garamond', serif",
        fontSize:28, fontWeight:300,
        color:'var(--cream)', textAlign:'center',
        lineHeight:1.1, marginBottom:10, zIndex:2,
        textShadow: hov ? `0 0 30px ${kit.glow}` : 'none',
        transition:'text-shadow 0.4s',
      }}>
        {kit.shortName}
      </h3>

      <p style={{
        fontFamily:"'JetBrains Mono', monospace",
        fontSize:10, letterSpacing:'1.5px',
        color:kit.color, opacity:0.7, textAlign:'center',
        marginBottom:28, zIndex:2,
      }}>
        {kit.tagline}
      </p>

      {/* Price */}
      <div style={{
        fontFamily:"'Cormorant Garamond', serif",
        fontSize:36, fontWeight:300,
        color:kit.color, zIndex:2,
        textShadow:`0 0 20px ${kit.glow}`,
      }}>
        ${kit.price}
      </div>

      {/* Enter prompt */}
      <motion.div
        animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        style={{
          marginTop:20,
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:9, letterSpacing:'3px', textTransform:'uppercase',
          color:kit.color, zIndex:2,
        }}
      >
        Enter Experience →
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position:'absolute', bottom:0, left:'10%', right:'10%', height:1,
          background:`linear-gradient(to right, transparent, ${kit.color}, transparent)`,
          transformOrigin:'center', zIndex:3,
        }}
      />
    </motion.div>
  )
}

// ─── FULL-SCREEN KIT MODAL ────────────────────────────────────────────────────
function KitModal({ kit, onClose }) {
  const [qty, setQty] = useState(1)
  const [burst, setBurst] = useState(false)

  const handleAcquire = () => {
    setBurst(true)
    setTimeout(() => setBurst(false), 800)
    // Open Stripe link
    window.open(kit.stripeLink, '_blank')
  }

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.4 }}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:200,
        background:'rgba(2,4,12,0.92)',
        backdropFilter:'blur(24px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px',
      }}
    >
      {/* Flash burst on acquire */}
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity:0.7 }} animate={{ opacity:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.6 }}
            style={{
              position:'fixed', inset:0, zIndex:300, pointerEvents:'none',
              background:kit.color, mixBlendMode:'screen',
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal card */}
      <motion.div
        initial={{ scale:0.88, opacity:0, y:40, filter:'blur(16px)' }}
        animate={{ scale:1, opacity:1, y:0, filter:'blur(0px)' }}
        exit={{ scale:0.92, opacity:0, y:20, filter:'blur(8px)' }}
        transition={{ duration:0.55, ease:[0.4,0,0.2,1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:1080,
          background:`linear-gradient(135deg, ${kit.dark} 0%, #06111f 55%, #030810 100%)`,
          border:`1px solid ${kit.color}28`,
          borderRadius:24,
          boxShadow:`0 0 0 1px ${kit.color}10, 0 40px 120px rgba(0,0,0,0.8), 0 0 100px ${kit.glowSoft}`,
          overflow:'hidden',
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          minHeight:600,
          position:'relative',
        }}
      >
        {/* Particles fill left panel */}
        <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'100%', overflow:'hidden', zIndex:0 }}>
          <KitParticles type={kit.particles} color={kit.particleColor} active={true} />
        </div>

        {/* ── LEFT: Visual panel ── */}
        <div style={{
          position:'relative', zIndex:1,
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          padding:'56px 40px',
          borderRight:`1px solid ${kit.color}14`,
        }}>
          {/* Spotlight beam */}
          <div style={{
            position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
            width:200, height:'55%',
            background:`linear-gradient(to bottom, ${kit.glow.replace('0.55','0.12')}, transparent)`,
            clipPath:'polygon(35% 0%, 65% 0%, 80% 100%, 20% 100%)',
            pointerEvents:'none', zIndex:0,
          }}/>

          {/* Big watermark number */}
          <div style={{
            position:'absolute', bottom:-10, right:10,
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:180, fontWeight:300, lineHeight:1,
            color:kit.color, opacity:0.04,
            userSelect:'none', pointerEvents:'none',
          }}>
            {kits.findIndex(k=>k.id===kit.id)+1}
          </div>

          {/* Tier badge */}
          <div className="label" style={{ marginBottom:24, color:kit.color, opacity:0.9, fontSize:10, zIndex:2 }}>
            ✦ {kit.tier} ✦
          </div>

          {/* 3D tilt kit image */}
          <div style={{ zIndex:2 }}>
            <TiltImage src={kit.image} color={kit.color} glow={kit.glow} size={300} />
          </div>

          {/* Kit name large */}
          <h2 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:'clamp(32px,4vw,52px)',
            fontWeight:300, color:'var(--cream)',
            lineHeight:1, textAlign:'center',
            marginTop:24, zIndex:2,
            textShadow:`0 0 40px ${kit.glow}`,
            whiteSpace:'pre-line',
          }}>
            {kit.name}
          </h2>
        </div>

        {/* ── RIGHT: Info panel ── */}
        <div style={{
          padding:'52px 44px',
          display:'flex', flexDirection:'column',
          justifyContent:'space-between',
          position:'relative', zIndex:1,
        }}>
          {/* Close */}
          <button onClick={onClose} style={{
            position:'absolute', top:20, right:20,
            background:'none', border:'none', cursor:'pointer',
            color:'var(--muted)', fontSize:20,
            width:36, height:36, borderRadius:8,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.2s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='var(--cream)' }}
          onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--muted)' }}
          >✕</button>

          <div>
            {/* Tagline */}
            <p style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:22, fontStyle:'italic',
              color:kit.color, marginBottom:20,
              textShadow:`0 0 20px ${kit.glow}`,
            }}>
              "{kit.tagline}"
            </p>

            {/* Description */}
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.85, marginBottom:32 }}>
              {kit.description}
            </p>

            {/* Stats — RPG style */}
            <div style={{ marginBottom:28 }}>
              <div className="label" style={{ marginBottom:14, fontSize:9 }}>Kit Intel</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {kit.stats.map(s => (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:90, fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:'var(--muted)', letterSpacing:'1px', flexShrink:0 }}>
                      {s.label}
                    </div>
                    {s.bar !== null ? (
                      <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                        <motion.div
                          initial={{ width:0 }}
                          animate={{ width:`${s.bar*100}%` }}
                          transition={{ duration:0.8, delay:0.3, ease:[0.4,0,0.2,1] }}
                          style={{ height:'100%', borderRadius:2, background:`linear-gradient(to right, ${kit.color}88, ${kit.color})` }}
                        />
                      </div>
                    ) : (
                      <div style={{ flex:1, height:3 }}/>
                    )}
                    <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:kit.color, flexShrink:0 }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes */}
            <div style={{ marginBottom:28 }}>
              <div className="label" style={{ marginBottom:12, fontSize:9 }}>What's Inside</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px' }}>
                {kit.includes.map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:kit.color, boxShadow:`0 0 6px ${kit.glow}`, flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:'var(--muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PURCHASE BLOCK ── */}
          <div style={{
            padding:'24px',
            background:`${kit.color}06`,
            border:`1px solid ${kit.color}18`,
            borderRadius:14,
          }}>
            {/* Price + quantity row */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div className="label" style={{ fontSize:8, marginBottom:4 }}>Price per kit</div>
                <div style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:44, fontWeight:300,
                  color:kit.color, lineHeight:1,
                  textShadow:`0 0 24px ${kit.glow}`,
                }}>
                  ${kit.price}
                </div>
              </div>

              <div style={{ textAlign:'right' }}>
                <div className="label" style={{ fontSize:8, marginBottom:8 }}>Quantity</div>
                <QuantityControl qty={qty} setQty={setQty} color={kit.color} glow={kit.glow} />
              </div>
            </div>

            {/* Total */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              marginBottom:16, paddingBottom:16,
              borderBottom:`1px solid ${kit.color}14`,
            }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:'var(--muted)', letterSpacing:'2px' }}>
                TOTAL
              </span>
              <motion.span
                key={qty}
                initial={{ opacity:0, y:-10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.25 }}
                style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:28, color:'var(--cream)',
                  textShadow:`0 0 16px ${kit.glow}`,
                }}
              >
                ${(kit.price * qty).toFixed(2)}
              </motion.span>
            </div>

            <AcquireButton kit={kit} qty={qty} onClick={handleAcquire} />

            <div style={{
              textAlign:'center', marginTop:12,
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:9, letterSpacing:'1.5px', color:'var(--muted)', opacity:0.5,
            }}>
              Secure checkout · Free shipping · Ships in 3–5 days
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Kits() {
  const [selected, setSelected] = useState(null)

  return (
    <PageTransition>
      <div style={{ minHeight:'100vh', position:'relative', zIndex:1, padding:'120px 40px 100px' }}>

        {/* Kit modal */}
        <AnimatePresence>
          {selected && <KitModal kit={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
          style={{ textAlign:'center', marginBottom:80 }}
        >
          <div className="label" style={{ marginBottom:16 }}>The Lab</div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:'clamp(44px,7vw,84px)',
            fontWeight:300, color:'var(--cream)',
            lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:16,
          }}>
            Choose your<br/>
            <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>experiment.</em>
          </h1>
          <p style={{ color:'var(--muted)', fontSize:14, fontFamily:"'JetBrains Mono', monospace", letterSpacing:'2px' }}>
            Select a kit to enter its world.
          </p>
        </motion.div>

        {/* Pedestal row */}
        <div style={{
          display:'flex',
          gap:20,
          maxWidth:1100, margin:'0 auto 80px',
          alignItems:'stretch',
        }}>
          {kits.map((kit, i) => (
            <PedestalCard key={kit.id} kit={kit} index={i} onSelect={setSelected} />
          ))}
        </div>

        {/* Donate */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.8 }}
          style={{
            maxWidth:880, margin:'0 auto',
            padding:'32px 40px',
            border:'1px solid rgba(168,212,240,0.09)',
            borderRadius:14, background:'rgba(8,16,40,0.5)',
            backdropFilter:'blur(16px)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:20,
          }}
        >
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:'var(--cream)', marginBottom:4 }}>
              Donate a kit to a child in need.
            </div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>100% goes directly to underserved communities.</div>
          </div>
          <a href="https://buy.stripe.com/YOUR_DONATION" target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'2px', textTransform:'uppercase',
              textDecoration:'none', padding:'12px 24px',
              border:'1px solid rgba(168,212,240,0.2)', borderRadius:4,
              color:'var(--pastel1)', transition:'all 0.3s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.07)'; e.currentTarget.style.borderColor='rgba(168,212,240,0.4)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(168,212,240,0.2)' }}
          >
            Donate a Kit →
          </a>
        </motion.div>
      </div>
    </PageTransition>
  )
}
