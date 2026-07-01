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
              color: 'var(--muted)', opacity: 0.45, marginBottom: 20,
            }}
          >
            Initiatives / Kit Development
          </motion.div>

          {/* Big dollar amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.04 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(72px, 12vw, 140px)',
              fontWeight: 300,
              color: 'var(--pastel1)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textShadow: '0 0 80px rgba(168,212,240,0.45)',
              marginBottom: 12,
            }}
          >
            $1,000
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(22px, 3vw, 38px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.2, letterSpacing: '-0.01em',
              margin: '0 0 18px',
            }}
          >
            Get funded to impact your community<br/>
            <em style={{ color: 'var(--pastel1)' }}>with kit distribution.</em>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
              maxWidth: 520, margin: '0 0 36px', opacity: 0.8,
            }}
          >
            Apply to design a hands-on science kit. Selected teams receive up to $1,000 in production funding and CurioCrate distributes 30 to 100 kits directly to underserved students.
          </motion.p>

          {/* 2x2 details grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px 72px',
              marginBottom: 40,
            }}
          >
            {DETAILS.map(d => (
              <div key={d.label} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 16 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                  color: 'var(--pastel1)', opacity: 0.6, marginBottom: 5,
                }}>
                  {d.label}
                </div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 15, fontWeight: 600,
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
            transition={{ duration: 0.6, delay: 0.26 }}
          >
            <a
              href="https://forms.gle/Mh64grXfaoAsBzfR9"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                background: 'var(--pastel1)', color: 'var(--dark)',
                border: 'none', borderRadius: 6,
                padding: '13px 34px',
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
          </motion.div>

        </div>
      </div>
    </PageTransition>
  )
}
