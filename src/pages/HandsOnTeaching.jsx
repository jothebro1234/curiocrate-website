import { motion } from 'framer-motion'
import { featured } from '../data/gallery'
import PageTransition from '../components/PageTransition'
import AutoplayVideo from '../components/AutoplayVideo'

const MESSAGE_FROM_PRES_URL = 'https://pub-e7374d03fa9c42bfb531206a5e81830b.r2.dev/messagefrompres.mp4'

const PARTS = [
  {
    num: '01',
    title: 'In-Person Teaching',
    tag: 'On Location',
    desc: 'We travel to schools, community centers, libraries, and other organizations to lead immersive science workshops. Students work through real experiments with materials we bring, guided by trained CurioCrate volunteers.',
  },
  {
    num: '02',
    title: 'Curriculum Development',
    tag: 'Remote / Anywhere',
    desc: 'Help design the lesson guides and experiment curricula that power every CurioCrate session. This role is fully remote and open to anyone passionate about making science accessible and engaging.',
  },
]

export default function HandsOnTeaching() {
  return (
    <PageTransition>

      {/* Header */}
      <section style={{ padding: '140px 48px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="hands-on-header-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase',
                  color: 'var(--muted)', opacity: 0.45, marginBottom: 18,
                }}
              >
                Initiatives
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(40px, 6vw, 80px)',
                  fontWeight: 300, color: 'var(--cream)',
                  lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 20px',
                }}
              >
                Hands-On<br/>
                <em style={{ color: 'var(--pastel1)' }}>Teaching.</em>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                style={{
                  fontSize: 16, color: 'var(--muted)', lineHeight: 1.8,
                  maxWidth: 560, margin: 0, opacity: 0.85,
                }}
              >
                We bring science directly to communities. From school classrooms to community centers, CurioCrate volunteers run immersive, experiment-based sessions that make learning real and memorable.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <AutoplayVideo src={MESSAGE_FROM_PRES_URL} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* In Focus photo grid */}
      <section style={{ padding: '0 48px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: 40, textAlign: 'center' }}
          >
            <div className="label" style={{ marginBottom: 12 }}>In Focus</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, margin: 0,
            }}>
              Science, in the wild.<br/>
              <em style={{ color: 'var(--pastel1)' }}>Moments that matter.</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 10,
              height: '56vh', minHeight: 360,
              borderRadius: 20, overflow: 'hidden',
            }}
          >
            {featured.map((photo, i) => (
              <motion.div
                key={photo.src}
                style={{
                  position: 'relative', overflow: 'hidden',
                  gridRow: i === 0 ? '1 / 3' : 'auto',
                  borderRadius: i === 0 ? '16px 0 0 16px' : i === 1 ? '0 16px 0 0' : '0 0 16px 0',
                }}
                whileHover={{ zIndex: 2 }}
              >
                <motion.img
                  src={photo.src} alt={photo.caption}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <motion.div
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)',
                    display: 'flex', alignItems: 'flex-end', padding: 24,
                  }}
                >
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic', fontSize: 15, color: 'var(--cream)', margin: 0,
                  }}>{photo.caption}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Two parts */}
      <section style={{ padding: '0 48px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 40 }}
          >
            <div className="label" style={{ marginBottom: 12 }}>How to Get Involved</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px, 3.5vw, 46px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, margin: 0,
            }}>
              Two ways to make<br/>
              <em style={{ color: 'var(--pastel1)' }}>an impact.</em>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
            {PARTS.map((part, i) => (
              <motion.div
                key={part.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{
                  border: '1px solid rgba(168,212,240,0.18)',
                  borderRadius: 12,
                  padding: '32px 28px',
                  background: 'rgba(10,18,45,0.55)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 700, color: 'var(--pastel1)',
                  }}>{part.num}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase',
                    color: 'var(--muted)', opacity: 0.6,
                    background: 'rgba(168,212,240,0.08)',
                    border: '1px solid rgba(168,212,240,0.15)',
                    borderRadius: 4, padding: '3px 8px',
                  }}>{part.tag}</span>
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(22px, 2.5vw, 30px)',
                  fontWeight: 300, color: 'var(--cream)',
                  lineHeight: 1.2, margin: '0 0 14px',
                }}>
                  {part.title}
                </h3>
                <p style={{
                  fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, margin: 0, opacity: 0.8,
                }}>
                  {part.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="https://portal.curiocrate.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                background: 'var(--pastel1)', color: 'var(--dark)',
                borderRadius: 6, padding: '13px 34px',
                fontWeight: 700, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Join via Portal
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          </motion.div>

        </div>
      </section>

    </PageTransition>
  )
}
