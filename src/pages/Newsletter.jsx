import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { news as fallback } from '../data/news'
import { driveUrl, filterForNewsletter, primaryCategory } from '../utils/updates'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Newsletter() {
  const [items, setItems] = useState(null)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setItems(fallback); return }
    fetch(`${url}?action=get_updates`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.updates)) {
          const newsletterItems = filterForNewsletter(data.updates)
            .map(u => ({ ...u, category: primaryCategory(u.category) }))
          setItems(newsletterItems)
        } else {
          setItems(fallback)
        }
      })
      .catch(() => setItems(fallback))
  }, [])

  return (
    <PageTransition>
      <section style={{ position: 'relative', zIndex: 1, padding: '140px 40px 120px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: 72 }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--muted)', opacity: 0.45, marginBottom: 16,
            }}>Updates</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px,6vw,72px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.0, letterSpacing: '-0.03em', margin: 0,
            }}>
              Newsletter
            </h1>
            <p style={{
              fontSize: 15, color: 'var(--muted)', lineHeight: 1.75,
              maxWidth: 480, marginTop: 18, opacity: 0.7,
            }}>
              Stay up to date with everything happening at CurioCrate, from milestones to new chapters.
            </p>
          </motion.div>

          {/* Cards */}
          {items === null ? (
            <div style={{ color: 'var(--muted)', opacity: 0.4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div style={{ color: 'var(--muted)', opacity: 0.4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
              No updates yet. Check back soon.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: item.image ? '1fr 260px' : '1fr',
                    gap: 0,
                    border: '1px solid rgba(168,212,240,0.1)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(8,15,38,0.6)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Text content */}
                  <div style={{ padding: '36px 40px' }}>
                    {/* Date + Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, letterSpacing: '2px', color: 'var(--muted)', opacity: 0.6,
                      }}>{formatDate(item.date)}</span>
                      {item.category && (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                          background: 'rgba(168,212,240,0.1)',
                          border: '1px solid rgba(168,212,240,0.2)',
                          borderRadius: 4, padding: '3px 8px',
                          color: 'var(--pastel1)',
                        }}>{item.category}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(22px, 2.8vw, 32px)',
                      fontWeight: 400, color: 'var(--cream)',
                      lineHeight: 1.15, letterSpacing: '-0.01em',
                      margin: '0 0 14px',
                    }}>{item.title}</h2>

                    {/* Body */}
                    {item.body && (
                      <p style={{
                        fontSize: 14, color: 'var(--muted)', lineHeight: 1.8,
                        margin: '0 0 20px', opacity: 0.8, maxWidth: 520,
                      }}>{item.body}</p>
                    )}

                    {/* Link */}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase',
                          color: 'var(--pastel1)',
                          border: '1px solid rgba(168,212,240,0.25)',
                          borderRadius: 4, padding: '8px 16px',
                          textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        Read More
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M7 17L17 7M17 7H7M17 7v10"/>
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Image */}
                  {item.image && (
                    <div style={{ overflow: 'hidden', borderLeft: '1px solid rgba(168,212,240,0.08)' }}>
                      <img
                        src={driveUrl(item.image)}
                        alt={item.title}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                        }}
                      />
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
