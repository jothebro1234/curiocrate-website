import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import FadingText from '../components/FadingText'
import NewsArticleModal from '../components/NewsArticleModal'
import { news as fallback } from '../data/news'
import { driveUrl, filterForNewsletter, primaryCategory } from '../utils/updates'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const CATEGORY_COLORS = {
  Chapters:     '#a8d4f0',
  Events:       '#a8e8c8',
  Milestones:   '#e8c96e',
  Partnerships: '#c5b4f8',
}
function categoryColor(cat) { return CATEGORY_COLORS[cat] || '#a8d4f0' }

export default function Newsletter() {
  const [items, setItems] = useState(null)
  const [selected, setSelected] = useState(null)

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
      <section className="nl-section" style={{ position: 'relative', zIndex: 1, padding: '140px 40px 120px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {items.map((item, i) => (
                <motion.article
                  key={i}
                  className="nl-card"
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
                      <div style={{ marginBottom: 20, maxWidth: 520 }}>
                        <FadingText
                          text={item.body}
                          maxLines={4}
                          fadeColor="rgba(9,16,39,0.97)"
                          onReadMore={() => setSelected(item)}
                          style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, opacity: 0.8 }}
                        />
                      </div>
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
                        View Source
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

        <AnimatePresence>
          {selected && (
            <NewsArticleModal item={selected} accentColor={categoryColor(selected.category)} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </section>

      <style>{`
        @media(max-width:640px){
          .nl-section { padding: 110px 20px 72px !important; }
          .nl-card { grid-template-columns: 1fr !important; }
          .nl-card > div:last-child { height: 200px !important; border-left: none !important; border-top: 1px solid rgba(168,212,240,0.08); }
        }
      `}</style>
    </PageTransition>
  )
}
