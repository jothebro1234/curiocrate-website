import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const CATALOG = [
  { icon: '🧪', name: 'Chemistry Discovery Kit', color: '#a8d4f0', glow: 'rgba(168,212,240,0.5)' },
  { icon: '🤖', name: 'Robotics Explorer Kit',    color: '#c5b4f8', glow: 'rgba(197,180,248,0.5)' },
  { icon: '⚙️', name: 'Physics Lab Kit',          color: '#fda4af', glow: 'rgba(253,164,175,0.5)' },
  { icon: '🌱', name: 'Biology Field Kit',         color: '#a8e8c8', glow: 'rgba(168,232,200,0.5)' },
  { icon: '🔭', name: 'Astronomy Starter Kit',     color: '#e8c96e', glow: 'rgba(232,201,110,0.5)' },
  { icon: '🛠️', name: 'Engineering Build Kit',     color: '#f0a8d0', glow: 'rgba(240,168,208,0.5)' },
]

function KitCard({ kit, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.08, 0.4), ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '40px 28px 32px', borderRadius: 20,
        background: 'rgba(6,12,32,0.6)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168,212,240,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = `${kit.color}40` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.1)' }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 200, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${kit.glow.replace('0.5', '0.18')} 0%, transparent 70%)`,
      }} />

      {/* Icon disc */}
      <div style={{
        position: 'relative', width: 84, height: 84, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `radial-gradient(circle, ${kit.glow.replace('0.5', '0.16')} 0%, rgba(6,12,32,0.4) 70%)`,
        border: `1px solid ${kit.color}30`, marginBottom: 22,
        fontSize: 36,
      }}>
        {kit.icon}
      </div>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 400,
        fontSize: 22, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 12,
      }}>{kit.name}</h3>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
        letterSpacing: '2.5px', textTransform: 'uppercase',
        color: kit.color, background: `${kit.color}14`,
        border: `1px solid ${kit.color}35`, borderRadius: 20,
        padding: '6px 16px', marginBottom: 14,
      }}>Coming Soon</div>

      <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7, opacity: 0.65, maxWidth: 220 }}>
        Full details, pricing, and photos coming soon.
      </p>
    </motion.div>
  )
}

export default function Kits() {
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ padding: '160px 40px 80px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="label" style={{ marginBottom: 16 }}>The Lab</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(44px, 7vw, 92px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 20,
            }}>
              Our <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>Kits.</em>
            </h1>
            <p style={{
              fontSize: 16, color: 'var(--muted)', lineHeight: 1.8,
              maxWidth: 520, margin: '0 auto', opacity: 0.8,
            }}>
              Hands-on science kits designed for classrooms and independent explorers alike. The full catalog is in development — here's a first look at what's coming.
            </p>
          </motion.div>
        </section>

        {/* ── CATALOG GRID ── */}
        <section style={{ padding: '0 40px 100px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}>
              {CATALOG.map((kit, i) => (
                <KitCard key={kit.name} kit={kit} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ padding: '0 40px 140px' }}
        >
          <div style={{
            maxWidth: 720, margin: '0 auto', textAlign: 'center',
            padding: '64px 40px', borderRadius: 20,
            border: '1px solid rgba(168,212,240,0.09)',
            background: 'rgba(8,16,40,0.5)', backdropFilter: 'blur(20px)',
          }}>
            <img src="/images/mascot1.png" alt=""
              style={{ height: 64, marginBottom: 22, filter: 'drop-shadow(0 0 20px rgba(168,212,240,0.4))', animation: 'drift 5s ease-in-out infinite' }}
            />
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 32,
              fontWeight: 300, color: 'var(--cream)', marginBottom: 14,
            }}>
              Want to help design the first kit?
            </h3>
            <p style={{
              color: 'var(--muted)', fontSize: 14.5,
              maxWidth: 420, margin: '0 auto 30px', lineHeight: 1.7,
            }}>
              We're looking for students and volunteers to help build our first official kits from the ground up.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/initiatives/kits" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
                padding: '14px 30px', borderRadius: 4,
                border: '1px solid rgba(168,212,240,0.4)',
                color: 'var(--cream)', background: 'rgba(168,212,240,0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.18)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(168,212,240,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
              >See Opportunities →</Link>
              <Link to="/newsletter" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
                padding: '14px 30px', borderRadius: 4,
                border: '1px solid rgba(168,212,240,0.22)',
                color: 'rgba(197,227,247,0.7)', background: 'transparent',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >Get Updates →</Link>
            </div>
          </div>
        </motion.section>

      </div>
    </PageTransition>
  )
}
