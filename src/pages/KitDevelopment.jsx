import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const DETAILS = [
  { label: 'WHO', value: '2 to 3 high school students' },
  { label: 'DATE', value: 'July 31 (first batch)' },
  { label: 'DELIVERABLE', value: 'Pitch deck and presentation' },
  { label: 'TARGET IMPACT', value: 'Underserved students and classrooms' },
]

export default function KitDevelopment() {
  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 48px 60px',
      }}>
        <div style={{ maxWidth: 900, width: '100%', margin: '0 auto' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--muted)', opacity: 0.45, marginBottom: 20,
            }}
          >
            Initiatives
          </motion.div>

          {/* Tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(168,212,240,0.18)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 24px',
                background: 'rgba(168,212,240,0.1)',
                border: '1px solid rgba(168,212,240,0.2)',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, fontWeight: 700, color: 'var(--pastel1)',
                }}>01</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'var(--cream)',
                }}>Kit Development</span>
              </div>
            </div>

            {/* Boxed content */}
            <div style={{
              border: '1px solid rgba(168,212,240,0.18)',
              borderTop: 'none',
              borderRadius: '0 8px 8px 8px',
              padding: '40px 44px 44px',
              background: 'rgba(10,18,45,0.6)',
              backdropFilter: 'blur(8px)',
            }}>

              {/* Highlighted headline block */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(168,212,240,0.13)',
                border: '1px solid rgba(168,212,240,0.28)',
                borderRadius: 6,
                padding: '10px 20px 14px',
                marginBottom: 22,
              }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(26px, 4vw, 52px)',
                  fontWeight: 500, color: 'var(--pastel1)',
                  lineHeight: 1.1, letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  Get up to $1,000 in funding
                </h1>
              </div>

              {/* Sub headline */}
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(16px, 2vw, 22px)',
                fontWeight: 300, color: 'var(--cream)',
                lineHeight: 1.3, margin: '0 0 16px',
              }}>
                to develop and distribute your science kit.
              </p>

              {/* Description */}
              <p style={{
                fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
                maxWidth: 520, margin: '0 0 32px', opacity: 0.8,
              }}>
                Apply to design a hands-on experiment kit. Selected teams receive up to $1,000 and CurioCrate handles production and distribution to 30 to 100 underserved students and classrooms.
              </p>

              {/* 2x2 details grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '18px 64px',
                marginBottom: 36,
              }}>
                {DETAILS.map(d => (
                  <div key={d.label} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 14 }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                      color: 'var(--pastel1)', opacity: 0.6, marginBottom: 4,
                    }}>
                      {d.label}
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 15, fontWeight: 600, color: 'var(--cream)',
                    }}>
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://forms.gle/Mh64grXfaoAsBzfR9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                  background: 'var(--pastel1)', color: 'var(--dark)',
                  border: 'none', borderRadius: 6,
                  padding: '12px 32px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Apply Now
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </a>

            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  )
}
