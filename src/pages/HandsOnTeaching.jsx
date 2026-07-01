import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function HandsOnTeaching() {
  return (
    <PageTransition>
      <section style={{ position: 'relative', zIndex: 1, padding: '160px 40px 120px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase',
            color: 'var(--muted)', opacity: 0.5, marginBottom: 20,
          }}>Initiatives</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(44px,7vw,96px)',
            fontWeight: 300, color: 'var(--cream)',
            lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24,
          }}>Hands-On Teaching</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto', opacity: 0.7 }}>
            More coming soon.
          </p>
        </motion.div>
      </section>
    </PageTransition>
  )
}
