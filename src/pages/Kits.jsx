import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const kits = [
  {
    id: 'chemistry',
    name: 'Chemistry Explorer',
    tier: 'STANDARD',
    tagline: 'Reactions. Discovery. Transformation.',
    description: 'Mix, react, and uncover the invisible forces that govern our world. 10 guided experiments from pH reactions to crystal formation.',
    price: '$24.99',
    image: '/images/kit-chemistry.png',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.5)',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(168,212,240,0.12) 0%, transparent 65%)',
    includes: ['pH strips', '10 experiment cards', 'Safety goggles', 'Lab journal'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
  },
  {
    id: 'robotics',
    name: 'Robotics Starter',
    tier: 'ADVANCED',
    tagline: 'Build. Code. Bring it to life.',
    description: 'Construct your first robot from real components. Chassis, motors, sensors, and a beginner coding guide — no experience needed.',
    price: '$34.99',
    image: '/images/kit-robotics.png',
    color: '#b8a0f0',
    glow: 'rgba(184,160,240,0.5)',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(184,160,240,0.12) 0%, transparent 65%)',
    includes: ['Robot chassis', '2 motors', 'Proximity sensor', 'Coding guide'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
  },
  {
    id: 'space',
    name: 'Space Science',
    tier: 'EXPLORER',
    tagline: 'The cosmos, in your hands.',
    description: 'Map constellations, model planetary orbits, and build a refracting telescope. The universe starts here.',
    price: '$29.99',
    image: '/images/kit-space.png',
    color: '#f0d0a8',
    glow: 'rgba(240,208,168,0.5)',
    bg: 'radial-gradient(ellipse at 60% 40%, rgba(240,208,168,0.12) 0%, transparent 65%)',
    includes: ['Mini telescope', 'Star chart', 'Planet model kit', 'Observation log'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
  },
]

function KitImage({ kit, isCenter }) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const ref = useRef(null)

  const handleMove = (e) => {
    if (!isCenter || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    animate(rotateY, dx * 14, { duration: 0.3, ease: 'easeOut' })
    animate(rotateX, -dy * 10, { duration: 0.3, ease: 'easeOut' })
  }

  const handleLeave = () => {
    animate(rotateX, 0, { duration: 0.6, ease: 'easeOut' })
    animate(rotateY, 0, { duration: 0.6, ease: 'easeOut' })
  }

  const rx = useTransform(rotateX, v => `${v}deg`)
  const ry = useTransform(rotateY, v => `${v}deg`)

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        perspective: 800,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isCenter ? '0 0 24px' : '20px 0',
      }}
    >
      <motion.div
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={kit.image}
          alt={kit.name}
          style={{
            height: isCenter ? 260 : 160,
            objectFit: 'contain',
            filter: isCenter
              ? `drop-shadow(0 0 40px ${kit.glow}) drop-shadow(0 20px 40px rgba(0,0,0,0.5))`
              : 'drop-shadow(0 8px 20px rgba(0,0,0,0.4)) brightness(0.6)',
            transition: 'height 0.6s ease, filter 0.6s ease',
            display: 'block',
            userSelect: 'none',
            animation: isCenter ? 'drift 5s ease-in-out infinite' : 'none',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Kits() {
  const [active, setActive] = useState(1)
  const [direction, setDirection] = useState(0)
  const dragX = useMotionValue(0)
  const containerRef = useRef(null)

  const prev = () => { setDirection(-1); setActive(i => (i - 1 + kits.length) % kits.length) }
  const next = () => { setDirection(1);  setActive(i => (i + 1) % kits.length) }

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll wheel on carousel
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let cooldown = false
    const onWheel = (e) => {
      if (cooldown) return
      e.preventDefault()
      cooldown = true
      if (e.deltaY > 30) next()
      else if (e.deltaY < -30) prev()
      setTimeout(() => { cooldown = false }, 700)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const kit = kits[active]
  const leftKit  = kits[(active - 1 + kits.length) % kits.length]
  const rightKit = kits[(active + 1) % kits.length]

  const slideVariants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, filter: 'blur(8px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
    exit:  (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, filter: 'blur(8px)', transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }),
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

        {/* Full-bleed background glow that shifts with active kit */}
        <AnimatePresence mode="wait">
          <motion.div
            key={kit.id + '-bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse 70% 70% at 55% 45%, ${kit.glow.replace('0.5', '0.07')} 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        <div style={{ padding: '120px 0 80px', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 40px' }}>
            <div className="label" style={{ marginBottom: 14 }}>The Lab</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px,6vw,76px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 12,
            }}>
              Choose your <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>experiment.</em>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}>
              ← scroll or use arrow keys →
            </p>
          </div>

          {/* Carousel */}
          <div ref={containerRef} style={{ position: 'relative', width: '100%', padding: '0 0 40px' }}>

            {/* Three-card stage */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.7fr 1fr',
              alignItems: 'center',
              gap: 0,
              maxWidth: 1400,
              margin: '0 auto',
              padding: '0 20px',
            }}>

              {/* LEFT — ghost card */}
              <motion.div
                onClick={prev}
                whileHover={{ scale: 1.03, opacity: 0.75 }}
                style={{
                  opacity: 0.45,
                  cursor: 'pointer',
                  padding: '32px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  transition: 'opacity 0.4s ease',
                }}
              >
                <KitImage kit={leftKit} isCenter={false} />
                <div style={{ textAlign: 'center' }}>
                  <div className="label" style={{ fontSize: 9, marginBottom: 6 }}>{leftKit.tier}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--cream)', fontWeight: 300 }}>
                    {leftKit.name}
                  </div>
                </div>
              </motion.div>

              {/* CENTER — spotlight */}
              <div style={{ position: 'relative' }}>
                {/* Spotlight beam */}
                <div style={{
                  position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
                  width: 2, height: 80,
                  background: `linear-gradient(to bottom, transparent, ${kit.color}66)`,
                  pointerEvents: 'none',
                }}/>
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 320, height: 320, borderRadius: '50%',
                  background: `radial-gradient(circle, ${kit.glow.replace('0.5','0.12')} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}/>

                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={kit.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      position: 'relative', zIndex: 1,
                      background: 'rgba(8,16,40,0.75)',
                      border: `1px solid ${kit.color}33`,
                      borderRadius: 16,
                      backdropFilter: 'blur(24px)',
                      boxShadow: `0 0 60px ${kit.glow.replace('0.5','0.15')}, 0 40px 80px rgba(0,0,0,0.5), inset 0 0 40px ${kit.glow.replace('0.5','0.04')}`,
                      padding: '40px 36px 36px',
                    }}
                  >
                    {/* Tier */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32,
                    }}>
                      <span className="label" style={{ color: kit.color, opacity: 1, fontSize: 10 }}>{kit.tier}</span>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 28, color: kit.color, fontWeight: 300,
                        textShadow: `0 0 20px ${kit.glow}`,
                      }}>{kit.price}</span>
                    </div>

                    {/* Kit image — 3D interactive */}
                    <KitImage kit={kit} isCenter={true} />

                    {/* Name */}
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(28px,3vw,42px)',
                      fontWeight: 300, color: 'var(--cream)',
                      lineHeight: 1.1, marginBottom: 8,
                      textShadow: `0 0 30px ${kit.glow.replace('0.5','0.3')}`,
                    }}>{kit.name}</h2>

                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, letterSpacing: '1.5px',
                      color: kit.color, opacity: 0.8, marginBottom: 18,
                    }}>{kit.tagline}</p>

                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 28 }}>
                      {kit.description}
                    </p>

                    {/* Includes */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 32,
                    }}>
                      {kit.includes.map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: kit.color, boxShadow: `0 0 6px ${kit.glow}`, flexShrink: 0 }}/>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <a
                      href={kit.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block', textAlign: 'center',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
                        textDecoration: 'none', padding: '15px 28px',
                        border: `1px solid ${kit.color}`,
                        borderRadius: 4, color: kit.color,
                        background: `${kit.color}10`,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${kit.color}22`
                        e.currentTarget.style.boxShadow = `0 0 30px ${kit.glow}`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${kit.color}10`
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      Acquire this Kit →
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT — ghost card */}
              <motion.div
                onClick={next}
                whileHover={{ scale: 1.03, opacity: 0.75 }}
                style={{
                  opacity: 0.45,
                  cursor: 'pointer',
                  padding: '32px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  transition: 'opacity 0.4s ease',
                }}
              >
                <KitImage kit={rightKit} isCenter={false} />
                <div style={{ textAlign: 'center' }}>
                  <div className="label" style={{ fontSize: 9, marginBottom: 6 }}>{rightKit.tier}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--cream)', fontWeight: 300 }}>
                    {rightKit.name}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dot indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 }}>
              {kits.map((k, i) => (
                <motion.button
                  key={k.id}
                  onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
                  animate={{ width: i === active ? 28 : 8, background: i === active ? k.color : 'rgba(168,212,240,0.2)' }}
                  transition={{ duration: 0.4 }}
                  style={{
                    height: 8, borderRadius: 4, border: 'none',
                    cursor: 'pointer', padding: 0,
                    boxShadow: i === active ? `0 0 12px ${k.glow}` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            {[
              { side: 'left', action: prev, icon: '←', x: '3%' },
              { side: 'right', action: next, icon: '→', x: '97%' },
            ].map(btn => (
              <motion.button
                key={btn.side}
                onClick={btn.action}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute', top: '35%',
                  left: btn.side === 'left' ? btn.x : 'auto',
                  right: btn.side === 'right' ? '3%' : 'auto',
                  transform: 'translateY(-50%)',
                  background: 'rgba(168,212,240,0.06)',
                  border: '1px solid rgba(168,212,240,0.2)',
                  borderRadius: '50%', width: 48, height: 48,
                  color: 'var(--pastel1)', fontSize: 18,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.3s, box-shadow 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(168,212,240,0.12)'
                  e.currentTarget.style.boxShadow = `0 0 20px ${kit.glow.replace('0.5','0.2')}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(168,212,240,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {btn.icon}
              </motion.button>
            ))}
          </div>

          {/* Donate bar */}
          <div style={{ padding: '40px 40px 0', maxWidth: 1000, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                padding: '28px 36px',
                border: '1px solid rgba(168,212,240,0.1)',
                borderRadius: 8,
                background: 'rgba(8,16,40,0.5)',
                backdropFilter: 'blur(16px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}
            >
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--cream)', marginBottom: 4 }}>
                  Donate a kit to a child in need.
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>100% goes directly to underserved communities.</div>
              </div>
              <a href="https://buy.stripe.com/YOUR_DONATION" target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '12px 24px',
                  border: '1px solid rgba(168,212,240,0.25)', borderRadius: 3,
                  color: 'var(--pastel1)', transition: 'all 0.3s',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.08)'; e.currentTarget.style.boxShadow='0 0 20px rgba(168,212,240,0.1)' }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.boxShadow='none' }}
              >
                Donate →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
