import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const DETAILS = [
  { label: 'WHO', value: 'High school students' },
  { label: 'DISTRIBUTION', value: '30 to 100 kits' },
  { label: 'DELIVERABLE', value: 'Kit design and lesson guide' },
  { label: 'IMPACT', value: 'Underserved students' },
]

export default function KitDevelopment() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 60px 60px',
      }}>
        <div style={{ maxWidth: 860, width: '100%', margin: '0 auto' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--muted)', opacity: 0.45, marginBottom: 18,
            }}
          >
            Initiatives / Kit Development
          </motion.div>

          {/* Highlighted headline block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{ marginBottom: 24 }}
          >
            <div style={{
              display: 'inline-block',
              background: 'rgba(168,212,240,0.13)',
              border: '1px solid rgba(168,212,240,0.28)',
              borderRadius: 8,
              padding: '10px 20px 14px',
            }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(28px,4vw,54px)',
                fontWeight: 400, color: 'var(--pastel1)',
                lineHeight: 1.1, letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Get funded to build a science kit.
              </h1>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              fontSize: 15, color: 'var(--muted)', lineHeight: 1.75,
              maxWidth: 560, marginBottom: 40, opacity: 0.8, margin: '0 0 40px',
            }}
          >
            Apply to design a hands-on experiment kit. Selected applicants receive production funding and CurioCrate distributes 30 to 100 kits to underserved students.
          </motion.p>

          {/* 2x2 details grid */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px 72px',
              marginBottom: 44,
            }}
          >
            {DETAILS.map(d => (
              <div key={d.label} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 16 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                  color: 'var(--pastel1)', opacity: 0.6, marginBottom: 6,
                }}>
                  {d.label}
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16, fontWeight: 600,
                  color: 'var(--cream)',
                }}>
                  {d.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <button
              onClick={() => navigate('/contact')}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                background: 'var(--pastel1)', color: 'var(--dark)',
                border: 'none', borderRadius: 6,
                padding: '13px 34px', cursor: 'pointer',
                fontWeight: 700,
                transition: 'opacity 0.2s, transform 0.2s',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Apply Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </button>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  )
}
