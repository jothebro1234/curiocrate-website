import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const ps = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2, sp: 0.008 + Math.random() * 0.025,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ps.forEach(p => {
        p.tw += p.sp
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168,212,240,${0.1 + Math.abs(Math.sin(p.tw)) * 0.55})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} />
}

const MILESTONES = [
  { label: 'Research & Concept',       done: true  },
  { label: 'Material Sourcing',         done: true  },
  { label: 'Initial Prototyping',       done: true  },
  { label: 'Finalizing Prototypes',     done: false, active: true },
  { label: 'Testing & Validation',      done: false },
  { label: 'Production & Distribution', done: false },
]

export default function Kits() {
  return (
    <PageTransition>
      <div style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        background: '#000810',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: '80px 40px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(168,212,240,0.06) 0%, rgba(0,8,16,0.98) 65%, #000 100%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(168,212,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,212,240,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}/>
        <ParticleCanvas />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 680, textAlign: 'center' }}>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="label" style={{ marginBottom: 40, letterSpacing: '6px', opacity: 0.4 }}>
              ◈ &nbsp; THE LAB &nbsp; ◈
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(42px, 7vw, 82px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 16,
              textShadow: '0 0 60px rgba(168,212,240,0.25)',
            }}
          >
            Research Kits<br/>
            <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>in Development.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontSize: 'clamp(15px, 1.8vw, 19px)',
              color: 'var(--muted)', lineHeight: 1.75, marginBottom: 56, opacity: 0.8,
            }}
          >
            Our science kits are being designed, tested, and refined to deliver
            the best hands-on discovery experience to students everywhere.
          </motion.p>

          {/* Progress block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            style={{
              padding: '40px 48px',
              border: '1px solid rgba(168,212,240,0.15)',
              borderRadius: 20,
              background: 'rgba(6,16,44,0.6)',
              backdropFilter: 'blur(24px)',
              textAlign: 'left',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div className="label" style={{ opacity: 0.55, letterSpacing: '3px' }}>Development Progress</div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 44, fontWeight: 300, lineHeight: 1,
                color: 'var(--pastel1)',
                textShadow: '0 0 40px rgba(168,212,240,0.5)',
              }}>82%</div>
            </div>

            {/* Progress bar track */}
            <div style={{
              height: 6, background: 'rgba(168,212,240,0.08)',
              borderRadius: 3, overflow: 'hidden', marginBottom: 8,
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                transition={{ duration: 1.8, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: '100%', borderRadius: 3,
                  background: 'linear-gradient(to right, rgba(168,212,240,0.5), rgba(168,212,240,1))',
                  boxShadow: '0 0 12px rgba(168,212,240,0.6)',
                }}
              />
            </div>

            {/* Status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'rgba(168,212,240,0.9)',
                boxShadow: '0 0 8px rgba(168,212,240,0.8)',
                animation: 'breathe 1.8s ease-in-out infinite',
              }}/>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--pastel1)', opacity: 0.8,
              }}>Finalizing Prototypes, In Progress</span>
            </div>

            {/* Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.07, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: m.done
                      ? '2px solid rgba(168,212,240,0.7)'
                      : m.active
                        ? '2px solid rgba(168,212,240,0.9)'
                        : '1px solid rgba(168,212,240,0.18)',
                    background: m.done
                      ? 'rgba(168,212,240,0.2)'
                      : m.active
                        ? 'rgba(168,212,240,0.1)'
                        : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: m.active ? '0 0 10px rgba(168,212,240,0.3)' : 'none',
                  }}>
                    {m.done && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="rgba(168,212,240,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {m.active && (
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(168,212,240,0.9)', animation: 'breathe 1.8s ease-in-out infinite' }}/>
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    color: m.done ? 'var(--pastel2)' : m.active ? 'var(--cream)' : 'var(--muted)',
                    opacity: m.done ? 0.65 : m.active ? 1 : 0.35,
                    fontWeight: m.active ? 600 : 400,
                  }}>{m.label}</span>

                  {m.active && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                      color: 'var(--pastel1)', opacity: 0.7,
                      padding: '2px 7px',
                      border: '1px solid rgba(168,212,240,0.25)',
                      borderRadius: 20,
                    }}>current</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ marginTop: 32 }}
          >
            <div style={{
              padding: '32px 40px',
              border: '1px solid rgba(168,212,240,0.1)',
              borderRadius: 16, background: 'rgba(8,20,50,0.4)',
              backdropFilter: 'blur(20px)',
            }}>
              <div className="label" style={{ marginBottom: 12, opacity: 0.45 }}>Interested in developing a kit?</div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24,
              }}>
                We welcome educators, scientists, and makers who want to help design
                hands-on STEM kits for our community. Reach out and let's build something together.
              </p>
              <a href="mailto:ckf.curiocrate@curiocrate.org" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
                textDecoration: 'none', padding: '12px 28px',
                border: '1px solid rgba(168,212,240,0.3)', borderRadius: 4,
                color: 'var(--pastel1)', background: 'rgba(168,212,240,0.05)',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.12)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.5)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(168,212,240,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.05)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.3)'; e.currentTarget.style.boxShadow = 'none' }}
              >ckf.curiocrate@curiocrate.org</a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
