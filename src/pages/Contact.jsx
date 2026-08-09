import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useLanguage } from '../i18n/useLanguage'

const CONTACT_EMAIL = 'contact@curiocrate.org'

const topics = [
  { key: 'schools', img: '/images/curieschool.png' },
  { key: 'students', img: '/images/curiequestion.png' },
  { key: 'sponsors', img: '/images/curielove.png' },
]

export default function Contact() {
  const { t } = useLanguage()
  return (
    <PageTransition>
      <section className="contact-section" style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '140px 40px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 72 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>{t('contact.eyebrow')}</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px,6vw,80px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20,
            }}>{t('contact.title')}</h1>
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              {t('contact.intro')}
            </p>
          </motion.div>

          <motion.div
            className="contact-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              padding: '48px 48px 40px',
              border: '1px solid rgba(168,212,240,0.12)',
              borderRadius: 20,
              background: 'rgba(8,16,42,0.5)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {topics.map(c => (
                <div key={c.key} className="contact-topic" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <img
                    src={c.img}
                    alt={t(`contact.${c.key}.title`)}
                    style={{
                      width: 56, height: 56, objectFit: 'contain',
                      flexShrink: 0,
                      filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))',
                    }}
                  />
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22, fontWeight: 400,
                      color: 'var(--cream)', marginBottom: 6,
                    }}>{t(`contact.${c.key}.title`)}</div>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                      {t(`contact.${c.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(168,212,240,0.12)', marginTop: 36, paddingTop: 28, textAlign: 'center' }}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 15, letterSpacing: '1px',
                color: 'var(--pastel1)', textDecoration: 'none',
                borderBottom: '1px solid rgba(168,212,240,0.3)',
                paddingBottom: 2, transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,212,240,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,212,240,0.3)' }}
              >{CONTACT_EMAIL}</a>
            </div>
          </motion.div>

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
            {t('contact.responseTime')}
          </motion.p>
        </div>
      </section>
      <style>{`
        @media(max-width:768px){
          .contact-section { padding: 100px 20px 72px !important; }
          .contact-card { padding: 32px 24px !important; }
          .contact-topic { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>
    </PageTransition>
  )
}
