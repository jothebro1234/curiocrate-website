import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const DETAILS = [
  {
    label: 'WHO',
    value: 'High School Students',
    desc: 'Open to any high schooler passionate about science and community impact.',
  },
  {
    label: 'DISTRIBUTION',
    value: '30–100 Kits',
    desc: 'CurioCrate handles full production and distribution of your approved kit design.',
  },
  {
    label: 'DELIVERABLE',
    value: 'Kit Design + Lesson Guide',
    desc: 'Submit a complete experiment kit concept with an accompanying lesson curriculum.',
  },
  {
    label: 'IMPACT',
    value: 'Underserved Students',
    desc: 'Your kit reaches children in communities with limited access to hands-on science education.',
  },
]

export default function KitDevelopment() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <section style={{ position: 'relative', zIndex: 1, padding: '160px 40px 140px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--muted)', opacity: 0.5, marginBottom: 28,
            }}
          >
            Initiatives / Kit Development
          </motion.div>

          {/* Headline with highlight badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            style={{ marginBottom: 40 }}
          >
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(38px,6vw,80px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.03em',
              margin: 0,
            }}>
              Get funded to build<br/>
              <span style={{
                display: 'inline-block',
                background: 'rgba(168,212,240,0.12)',
                border: '1px solid rgba(168,212,240,0.25)',
                borderRadius: 6,
                padding: '2px 18px 6px',
                color: 'var(--pastel1)',
                fontStyle: 'italic',
              }}>
                a science kit.
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            style={{
              fontSize: 16, color: 'var(--muted)', lineHeight: 1.85,
              maxWidth: 620, marginBottom: 72, opacity: 0.85,
            }}
          >
            Apply to design and develop an original hands-on science experiment kit. Selected applicants receive production funding — CurioCrate then distributes 30 to 100 kits directly to underserved students, putting your work in the hands of children who need it most.
          </motion.p>

          {/* Details 2×2 grid */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2px',
              marginBottom: 72,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(168,212,240,0.1)',
            }}
          >
            {DETAILS.map((d, i) => (
              <div
                key={d.label}
                style={{
                  padding: '44px 40px',
                  background: i % 2 === 0
                    ? 'rgba(10,18,45,0.7)'
                    : 'rgba(7,13,35,0.7)',
                  borderLeft: '3px solid rgba(168,212,240,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                  color: 'var(--pastel1)', opacity: 0.7, marginBottom: 10,
                }}>
                  {d.label}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(22px,2.8vw,32px)',
                  fontWeight: 400, color: 'var(--cream)',
                  letterSpacing: '-0.01em', marginBottom: 12, lineHeight: 1.2,
                }}>
                  {d.value}
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, opacity: 0.75,
                }}>
                  {d.desc}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button
              onClick={() => navigate('/contact')}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
                background: 'var(--pastel1)', color: 'var(--dark)',
                border: 'none', borderRadius: 8,
                padding: '18px 48px', cursor: 'pointer',
                fontWeight: 700,
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Apply Now
            </button>
          </motion.div>

        </div>
      </section>
    </PageTransition>
  )
}
