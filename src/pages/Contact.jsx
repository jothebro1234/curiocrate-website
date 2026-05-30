import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const contacts = [
  {
    audience: 'Schools & Organizations',
    description: 'Interested in bringing CurioCrate kits to your school, district, or community program?',
    email: 'ckf.curiocrate@curiocrate.org',
    img: '/images/curieschool.png',
  },
  {
    audience: 'Students & Volunteers',
    description: 'Do you have any questions about starting a chapter, or want to learn more about our programs?',
    email: 'ckf.curiocrate@curiocrate.org',
    img: '/images/curiequestion.png',
  },
]

export default function Contact() {
  return (
    <PageTransition>
      <section style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '140px 40px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Get in Touch</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px,6vw,80px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20,
            }}>Contact Us</h1>
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              We'd love to hear from you. Reach out and we'll get back to you as soon as we can.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {contacts.map((c, i) => (
              <motion.div
                key={c.audience}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                style={{
                  padding: '40px 48px',
                  border: '1px solid rgba(168,212,240,0.12)',
                  borderRadius: 20,
                  background: 'rgba(8,16,42,0.5)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                  <img
                    src={c.img}
                    alt={c.audience}
                    style={{
                      width: 80, height: 80, objectFit: 'contain',
                      flexShrink: 0,
                      filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))',
                    }}
                  />
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 24, fontWeight: 400,
                      color: 'var(--cream)', marginBottom: 8,
                    }}>{c.audience}</div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                      {c.description}
                    </p>
                    <a href={`mailto:${c.email}`} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13, letterSpacing: '1px',
                      color: 'var(--pastel1)', textDecoration: 'none',
                      borderBottom: '1px solid rgba(168,212,240,0.3)',
                      paddingBottom: 2, transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,212,240,0.7)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,212,240,0.3)' }}
                    >{c.email}</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              textAlign: 'center', marginTop: 48,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '2px', color: 'var(--muted)', opacity: 0.4,
            }}
          >
            We typically respond within 2–3 business days.
          </motion.p>
        </div>
      </section>
    </PageTransition>
  )
}
