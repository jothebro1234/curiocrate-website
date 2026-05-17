import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const kits = [
  {
    id: 'chemistry',
    name: 'Chemistry Explorer',
    tier: 'STANDARD',
    emoji: '⚗️',
    tagline: 'Reactions. Discovery. Transformation.',
    description: 'Mix, react, and uncover the invisible forces that govern our world. 10 guided experiments from pH reactions to crystal formation.',
    price: '$24.99',
    rarity: 'common',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.4)',
    includes: ['pH strips', '10 experiment cards', 'Safety goggles', 'Lab journal'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: ['⚗️','🧪','💧','🌊','⚡'],
  },
  {
    id: 'robotics',
    name: 'Robotics Starter',
    tier: 'ADVANCED',
    emoji: '🤖',
    tagline: 'Build. Code. Bring it to life.',
    description: 'Construct your first robot from real components. Chassis, motors, sensors, and a beginner coding guide included.',
    price: '$34.99',
    rarity: 'rare',
    color: '#b8a0f0',
    glow: 'rgba(184,160,240,0.4)',
    includes: ['Robot chassis', '2 motors', 'Proximity sensor', 'Coding guide'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: ['🤖','⚙️','🔧','💡','🔌'],
  },
  {
    id: 'space',
    name: 'Space Science',
    tier: 'EXPLORER',
    emoji: '🪐',
    tagline: 'The cosmos, in your hands.',
    description: 'Map constellations, model planetary orbits, and build a refracting telescope. The universe starts here.',
    price: '$29.99',
    rarity: 'epic',
    color: '#f0d0a8',
    glow: 'rgba(240,208,168,0.4)',
    includes: ['Mini telescope', 'Star chart', 'Planet model kit', 'Observation log'],
    stripeLink: 'https://buy.stripe.com/YOUR_LINK',
    particles: ['🪐','⭐','🌙','☄️','🔭'],
  },
]

const rarityBadge = { common:'Standard', rare:'Advanced', epic:'Explorer' }

function FloatingParticle({ emoji, index }) {
  return (
    <motion.span
      style={{ position:'absolute', fontSize: 18 + Math.random()*10, pointerEvents:'none', zIndex:5 }}
      initial={{ opacity:0, scale:0, x: Math.random()*100-50, y: Math.random()*100-50 }}
      animate={{
        opacity:[0,1,0],
        scale:[0,1.2,0],
        x: (Math.random()-0.5)*200,
        y: -80 - Math.random()*120,
      }}
      transition={{ duration:1.2, delay:index*0.08, ease:'easeOut' }}
    >
      {emoji}
    </motion.span>
  )
}

function KitCard({ kit, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const [burst, setBurst] = useState(false)

  const handleSelect = () => {
    onSelect(kit.id)
    setBurst(true)
    setTimeout(() => setBurst(false), 1500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:60 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.7, ease:[0.4,0,0.2,1] }}
      whileHover={{ y:-8 }}
      style={{ position:'relative', cursor:'pointer' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleSelect}
    >
      {/* Burst particles on select */}
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', zIndex:5 }}>
        <AnimatePresence>
          {burst && kit.particles.map((p, i) => <FloatingParticle key={i} emoji={p} index={i} />)}
        </AnimatePresence>
      </div>

      {/* Card */}
      <div style={{
        position:'relative',
        background: isSelected
          ? `linear-gradient(135deg, rgba(15,32,68,0.9) 0%, rgba(20,40,80,0.95) 100%)`
          : 'rgba(10,20,50,0.7)',
        border: isSelected
          ? `1px solid ${kit.color}`
          : hovered
            ? '1px solid rgba(168,212,240,0.25)'
            : '1px solid rgba(168,212,240,0.08)',
        borderRadius:10,
        padding:'40px 32px',
        backdropFilter:'blur(20px)',
        transition:'all 0.4s ease',
        boxShadow: isSelected
          ? `0 0 60px ${kit.glow}, 0 0 120px ${kit.glow.replace('0.4','0.15')}, inset 0 0 40px ${kit.glow.replace('0.4','0.06')}`
          : hovered
            ? `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${kit.glow.replace('0.4','0.15')}`
            : '0 8px 32px rgba(0,0,0,0.3)',
        minHeight:480,
        display:'flex', flexDirection:'column',
      }}>
        {/* Tier badge */}
        <div style={{
          position:'absolute', top:20, right:20,
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:9, letterSpacing:'3px', textTransform:'uppercase',
          color: kit.color,
          border:`1px solid ${kit.color}44`,
          borderRadius:2, padding:'4px 10px',
          background:`${kit.color}11`,
        }}>
          {kit.tier}
        </div>

        {/* Emoji orb */}
        <div style={{
          width:80, height:80, borderRadius:'50%',
          background:`radial-gradient(circle, ${kit.glow} 0%, transparent 70%)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:40, marginBottom:28,
          border:`1px solid ${kit.color}30`,
          animation: hovered ? 'breathe 1.5s ease-in-out infinite' : 'none',
          transition:'all 0.3s',
          boxShadow: isSelected ? `0 0 30px ${kit.glow}` : 'none',
        }}>
          {kit.emoji}
        </div>

        {/* Kit name */}
        <div className="label" style={{ marginBottom:8, color: kit.color, opacity:1 }}>
          {rarityBadge[kit.rarity]} Kit
        </div>
        <h3 style={{
          fontFamily:"'Cormorant Garamond', serif",
          fontSize:32, fontWeight:300,
          color:'var(--cream)',
          marginBottom:12, lineHeight:1.1,
          textShadow: isSelected ? `0 0 20px ${kit.glow}` : 'none',
        }}>
          {kit.name}
        </h3>
        <p style={{
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:11, letterSpacing:'1px',
          color: kit.color, opacity:0.8,
          marginBottom:20,
        }}>
          {kit.tagline}
        </p>
        <p style={{
          fontSize:14, color:'var(--muted)', lineHeight:1.7,
          marginBottom:28, flex:1,
        }}>
          {kit.description}
        </p>

        {/* Includes list */}
        <div style={{ marginBottom:28 }}>
          {kit.includes.map(item => (
            <div key={item} style={{
              display:'flex', alignItems:'center', gap:10,
              marginBottom:8,
            }}>
              <div style={{
                width:4, height:4, borderRadius:'50%',
                background: kit.color,
                boxShadow:`0 0 6px ${kit.glow}`,
              }}/>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
          <div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:36, fontWeight:300,
              color: kit.color,
              textShadow:`0 0 20px ${kit.glow}`,
            }}>
              {kit.price}
            </div>
            <div style={{ fontSize:11, color:'var(--muted)', fontFamily:"'JetBrains Mono', monospace" }}>
              + free shipping
            </div>
          </div>

          <a
            href={kit.stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:11, letterSpacing:'2px', textTransform:'uppercase',
              textDecoration:'none',
              padding:'12px 22px',
              border:`1px solid ${kit.color}`,
              borderRadius:3,
              color: kit.color,
              background:`${kit.color}11`,
              transition:'all 0.3s ease',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background = `${kit.color}22`
              e.currentTarget.style.boxShadow = `0 0 20px ${kit.glow}`
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background = `${kit.color}11`
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Acquire
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Kits() {
  const [selected, setSelected] = useState(null)

  return (
    <PageTransition>
      <div style={{
        minHeight:'100vh',
        padding:'120px 40px 80px',
        position:'relative', zIndex:1,
      }}>
        {/* Background glow for selected kit */}
        <AnimatePresence>
          {selected && (() => {
            const kit = kits.find(k=>k.id===selected)
            return (
              <motion.div
                key={selected}
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                style={{
                  position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
                  background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${kit.glow.replace('0.4','0.08')} 0%, transparent 70%)`,
                }}
              />
            )
          })()}
        </AnimatePresence>

        <div style={{ maxWidth:1200, margin:'0 auto' }}>
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
              fontSize:'clamp(48px,7vw,88px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.1, letterSpacing:'-0.02em',
              marginBottom:16,
            }}>
              Choose your<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>experiment.</em>
            </h1>
            <p style={{ color:'var(--muted)', fontSize:15, maxWidth:420, margin:'0 auto', lineHeight:1.7 }}>
              Each kit is a precisely designed portal into a different domain of science.
              Select wisely.
            </p>
          </motion.div>

          {/* Kit grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:24,
            marginBottom:64,
          }}>
            {kits.map(kit => (
              <KitCard
                key={kit.id}
                kit={kit}
                isSelected={selected === kit.id}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Donation bar */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{
              padding:'32px 40px',
              border:'1px solid rgba(168,212,240,0.1)',
              borderRadius:8,
              background:'rgba(10,20,50,0.5)',
              backdropFilter:'blur(16px)',
              display:'flex', alignItems:'center',
              justifyContent:'space-between', flexWrap:'wrap', gap:20,
            }}
          >
            <div>
              <div style={{ fontSize:18, color:'var(--cream)', marginBottom:6, fontFamily:"'Cormorant Garamond', serif" }}>
                Donate a kit to a child in need.
              </div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>
                100% goes directly to underserved communities.
              </div>
            </div>
            <a
              href="https://buy.stripe.com/YOUR_DONATION_LINK"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:"'JetBrains Mono', monospace",
                fontSize:11, letterSpacing:'3px', textTransform:'uppercase',
                textDecoration:'none',
                padding:'13px 28px',
                border:'1px solid rgba(168,212,240,0.3)',
                borderRadius:3,
                color:'var(--pastel1)',
                transition:'all 0.3s ease',
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.background='rgba(168,212,240,0.08)'
                e.currentTarget.style.boxShadow='0 0 20px rgba(168,212,240,0.12)'
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background='transparent'
                e.currentTarget.style.boxShadow='none'
              }}
            >
              Donate →
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
