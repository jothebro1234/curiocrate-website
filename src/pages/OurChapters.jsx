import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { chapters as staticChapters } from '../data/chapters'

function resolveLogoUrl(url) {
  if (!url) return ''
  if (!url.startsWith('http')) return `/logos/chapters/${url}`
  return url
}

function resolvePhotoUrl(url) {
  if (!url) return ''
  if (!url.startsWith('http')) return `/photos/chapters/${url}`
  return url
}

function resolveInstagramUrl(value) {
  if (!value) return ''
  if (value.startsWith('http')) return value
  return `https://instagram.com/${value.replace(/^@/, '').trim()}`
}

function InstagramIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ChapterModal({ chapter, onClose }) {
  const [imgError, setImgError] = useState(false)
  const [presidentImgError, setPresidentImgError] = useState(false)
  const initials = chapter.school
    .split(' ').filter(w => w.length > 2).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')
  const logoSrc = resolveLogoUrl(chapter.logo)
  const presidentPhotoSrc = resolvePhotoUrl(chapter.presidentPhoto)
  const instagramUrl = resolveInstagramUrl(chapter.instagram)
  const directorsList = (chapter.authorizedDirectors || '')
    .split(',').map(d => d.trim()).filter(Boolean)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  const CABINET_ROLES = [
    { title: 'Vice President', name: chapter.vicePresident },
    { title: 'Treasurer', name: chapter.treasurer },
    { title: 'Secretary', name: chapter.secretary },
    { title: 'Social Media Manager', name: chapter.socialMedia },
  ].filter(r => r.name)

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 700,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(6,12,32,0.98)',
          border: '1px solid rgba(168,212,240,0.15)',
          borderRadius: 24,
          overflow: 'hidden',
          maxWidth: 600,
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header — school context */}
        <div style={{ padding: '28px 36px 20px', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'none', border: '1px solid rgba(168,212,240,0.2)',
            borderRadius: 8, color: 'var(--muted)', fontSize: 11, cursor: 'pointer',
            padding: '7px 14px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px',
          }}>ESC · CLOSE</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: (logoSrc && !imgError) ? 'rgba(255,255,255,0.96)' : 'rgba(168,212,240,0.08)',
              border: '1.5px solid rgba(168,212,240,0.2)',
              overflow: 'hidden',
            }}>
              {logoSrc && !imgError ? (
                <img src={logoSrc} alt={chapter.school}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }}
                  onError={() => setImgError(true)} />
              ) : (
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300, color: 'var(--pastel1)' }}>{initials || '?'}</span>
              )}
            </div>

            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: 'var(--cream)', lineHeight: 1.2 }}>
                {chapter.school}
              </div>
              {[chapter.city, chapter.state].filter(Boolean).length > 0 && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.5, marginTop: 2 }}>
                  {[chapter.city, chapter.state].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>

          {instagramUrl && (
            <a
              href={instagramUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 16,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none',
                padding: '7px 14px', borderRadius: 20,
                border: '1px solid transparent',
                background: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 40%, #6228d7 100%)',
                color: '#fff', opacity: 0.92,
                boxShadow: '0 4px 16px rgba(238,42,123,0.35)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.boxShadow = '0 6px 22px rgba(238,42,123,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.92; e.currentTarget.style.boxShadow = '0 4px 16px rgba(238,42,123,0.35)' }}
            ><InstagramIcon /> Instagram</a>
          )}
        </div>

        {/* President Spotlight */}
        {chapter.president && (
          <div style={{
            padding: '20px 36px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            {/* Aura glow behind photo */}
            <div style={{
              position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
              width: 280, height: 280, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,212,240,0.22) 0%, rgba(168,212,240,0.06) 45%, transparent 72%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              width: 132, height: 132, borderRadius: '50%', margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: (presidentPhotoSrc && !presidentImgError) ? 'rgba(255,255,255,0.96)' : 'rgba(168,212,240,0.08)',
              border: '2px solid rgba(168,212,240,0.35)',
              boxShadow: '0 0 40px rgba(168,212,240,0.35), 0 0 80px rgba(168,212,240,0.15)',
              overflow: 'hidden', position: 'relative',
            }}>
              {presidentPhotoSrc && !presidentImgError ? (
                <img src={presidentPhotoSrc} alt={chapter.president}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setPresidentImgError(true)} />
              ) : (
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'var(--pastel1)' }}>
                  {chapter.president?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
              color: 'var(--pastel1)', opacity: 0.7, marginTop: 20, position: 'relative',
            }}>President</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400,
              color: 'var(--cream)', lineHeight: 1.2, marginTop: 6, position: 'relative',
            }}>{chapter.president}</div>

            {chapter.presidentMessage && (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16,
                color: 'var(--muted)', opacity: 0.8, lineHeight: 1.65, maxWidth: 420,
                margin: '16px auto 0', position: 'relative',
              }}>“{chapter.presidentMessage}”</div>
            )}
          </div>
        )}

        {/* Leadership Cabinet */}
        <div style={{ padding: '0 36px 40px', borderTop: '1px solid rgba(168,212,240,0.08)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.45, margin: '28px 0 24px' }}>
            Leadership Cabinet
          </div>

          {CABINET_ROLES.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--muted)', opacity: 0.5, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>More cabinet details coming soon.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CABINET_ROLES.map(role => (
                <div key={role.title} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 18px',
                  background: 'rgba(168,212,240,0.02)',
                  border: '1px solid rgba(168,212,240,0.05)',
                  borderRadius: 12,
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(168,212,240,0.08)',
                    border: '1px solid rgba(168,212,240,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: 'var(--pastel1)', opacity: 0.7 }}>
                      {role.name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--cream)', marginBottom: 3 }}>
                      {role.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.55 }}>
                      {role.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {directorsList.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(168,212,240,0.07)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.4, marginBottom: 8 }}>
                Directors
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', opacity: 0.6, lineHeight: 1.7 }}>
                {directorsList.join(', ')}
              </div>
            </div>
          )}

          {chapter.email && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(168,212,240,0.07)' }}>
              <a href={`mailto:${chapter.email}`} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: 'var(--pastel1)', textDecoration: 'none', letterSpacing: '0.5px', opacity: 0.7,
              }}>{chapter.email}</a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

function ChapterCard({ chapter, index, onClick }) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const initials = chapter.school
    .split(' ').filter(w => w.length > 2).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')
  const logoSrc = resolveLogoUrl(chapter.logo)
  const location = [chapter.city, chapter.state].filter(Boolean).join(', ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        padding: '36px 32px',
        background: hovered ? 'rgba(12,24,60,0.75)' : 'rgba(6,12,32,0.6)',
        backdropFilter: 'blur(24px)',
        border: hovered
          ? '1px solid rgba(168,212,240,0.28)'
          : '1px solid rgba(168,212,240,0.1)',
        borderRadius: 20,
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(168,212,240,0.1), inset 0 1px 0 rgba(168,212,240,0.08)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 32, right: 32, height: 1,
        background: hovered
          ? 'linear-gradient(to right, transparent, rgba(168,212,240,0.4), transparent)'
          : 'linear-gradient(to right, transparent, rgba(168,212,240,0.1), transparent)',
        transition: 'background 0.3s',
      }}/>

      {/* Chapter number */}
      <div style={{
        position: 'absolute', top: 20, right: 24,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, color: 'var(--muted)', opacity: 0.2, letterSpacing: 2,
      }}>{String(index + 1).padStart(2, '0')}</div>

      {/* Logo circle */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: (logoSrc && !imgError) ? 'rgba(255,255,255,0.96)' : 'rgba(168,212,240,0.08)',
        border: '2px solid rgba(168,212,240,0.15)',
        overflow: 'hidden', marginBottom: 20,
        boxShadow: hovered ? '0 0 24px rgba(168,212,240,0.2)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        {logoSrc && !imgError ? (
          <img src={logoSrc} alt={chapter.school}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
            onError={() => setImgError(true)} />
        ) : (
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28, fontWeight: 300, color: 'var(--pastel1)',
          }}>{initials || '?'}</span>
        )}
      </div>

      {/* School name */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 24, fontWeight: 400,
        color: 'var(--cream)', lineHeight: 1.2, marginBottom: 10,
      }}>{chapter.school}</div>

      {/* President */}
      {chapter.president && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: 'var(--pastel2)', opacity: 0.8,
          marginBottom: 6, letterSpacing: '0.5px',
        }}>{chapter.president}</div>
      )}

      {/* Location */}
      {location && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 4,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: 'var(--muted)', opacity: 0.55,
          textTransform: 'uppercase', letterSpacing: '1.5px',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </div>
      )}

      {/* Tap hint */}
      <div style={{
        position: 'absolute', bottom: 14, right: 18,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 8, color: 'rgba(168,212,240,0.3)',
        letterSpacing: '1.5px', textTransform: 'uppercase',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>view cabinet →</div>
    </motion.div>
  )
}

const HOW_TO_STEPS = [
  { n: '01', title: 'Fill Out the Application', action: true },
  { n: '02', title: 'Meet with one of our Chapter Development Officers' },
  { n: '03', title: 'Build Your Leadership Structure' },
  { n: '04', title: 'Host Your First Workshop' },
]

export default function OurChapters() {
  const [chaptersData,    setChaptersData]    = useState([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [searchQuery,     setSearchQuery]     = useState('')
  const [selectedChapter, setSelectedChapter] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setChaptersLoading(false); return }
    fetch(`${url}?action=get_chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.chapters) && data.chapters.length > 0)
          setChaptersData(data.chapters)
        else setChaptersData(staticChapters)
      })
      .catch(() => setChaptersData(staticChapters))
      .finally(() => setChaptersLoading(false))
  }, [])

  const chapterOnly = chaptersData.filter(c => c.type !== 'Impact')
  const q = searchQuery.trim().toLowerCase()
  const filteredChapters = q
    ? chapterOnly.filter(c =>
        c.school?.toLowerCase().includes(q) ||
        c.president?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q))
    : chapterOnly

  return (
    <PageTransition>

      {/* ─── HERO ─── */}
      <section className="chapters-hero" style={{ position: 'relative', zIndex: 1, padding: '160px 40px 100px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <div className="label" style={{ marginBottom: 16 }}>The Network</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(44px,7vw,96px)',
            fontWeight: 300, color: 'var(--cream)',
            lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24,
          }}>Our Chapters</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
            Student-led chapters bringing free science education to communities across the country.
          </p>
          <a
            href="https://forms.gle/nEBfc84qHXxcmT4k8"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
              padding: '14px 32px', borderRadius: 3,
              border: '1px solid rgba(168,212,240,0.4)',
              color: 'var(--cream)', background: 'rgba(168,212,240,0.08)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.16)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(168,212,240,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
          >Start a Chapter →</a>
        </motion.div>
      </section>

      {/* ─── CHAPTER LIST ─── */}
      <section className="chapters-list" style={{ position: 'relative', zIndex: 1, padding: '0 40px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 20px',
              background: 'rgba(8,16,42,0.6)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(168,212,240,0.14)', borderRadius: 14,
              maxWidth: 560,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="rgba(168,212,240,0.4)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by school, president, city, or state…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, color: 'var(--cream)', letterSpacing: 0.3,
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: 20, lineHeight: 1, opacity: 0.5, padding: 0,
                }}>×</button>
              )}
              {!chaptersLoading && chapterOnly.length > 0 && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, letterSpacing: 2, color: 'var(--muted)', opacity: 0.4,
                  whiteSpace: 'nowrap',
                }}>{filteredChapters.length} / {chapterOnly.length}</span>
              )}
            </div>
          </motion.div>

          {/* Grid of cards */}
          {chaptersLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, flexDirection: 'column', gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(168,212,240,0.2)', borderTopColor: 'rgba(168,212,240,0.7)', animation: 'spin 0.9s linear infinite' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--muted)', opacity: 0.4 }}>Loading chapters…</span>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 14 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, color: 'var(--pastel1)', opacity: 0.18 }}>◎</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', opacity: 0.4, letterSpacing: 2 }}>
                {searchQuery ? 'No chapters match' : 'Chapters launching soon'}
              </div>
            </div>
          ) : (
            <div style={filteredChapters.length > 9 ? {
              maxHeight: 760, overflowY: 'auto',
              paddingRight: 4,
            } : {}}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}>
                {filteredChapters.map((chapter, i) => (
                  <ChapterCard key={chapter.school + i} chapter={chapter} index={i} onClick={() => setSelectedChapter(chapter)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW TO START A CHAPTER ─── */}
      <section className="chapters-how" style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(168,212,240,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Step by Step</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05,
            }}>How to Start a Chapter</h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HOW_TO_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  display: 'flex', gap: 32, alignItems: 'center',
                  padding: '28px 0',
                  borderBottom: i < HOW_TO_STEPS.length - 1 ? '1px solid rgba(168,212,240,0.07)' : 'none',
                }}
              >
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 48, fontWeight: 300, lineHeight: 1,
                  color: 'var(--pastel1)', opacity: 0.35,
                  flexShrink: 0, width: 64, textAlign: 'center',
                }}>{step.n}</div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24, fontWeight: 400,
                    color: 'var(--cream)', lineHeight: 1.2,
                  }}>{step.title}</div>

                  {step.action && (
                    <a
                      href="https://forms.gle/nEBfc84qHXxcmT4k8"
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                        letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                        padding: '9px 20px', borderRadius: 3, flexShrink: 0,
                        border: '1px solid rgba(168,212,240,0.35)',
                        color: 'var(--pastel1)', transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.08)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(168,212,240,0.15)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
                    >Apply Now →</a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIDEO ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 40px 120px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Watch</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1,
            }}>See what chapters are all about</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(168,212,240,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            <video ref={videoRef} controls playsInline style={{ width: '100%', display: 'block', background: '#000' }}>
              <source src="/missionvideo.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* Chapter detail modal */}
      <AnimatePresence>
        {selectedChapter && (
          <ChapterModal chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px){
          .chapters-hero { padding: 100px 20px 72px !important; }
          .chapters-list { padding: 0 20px 72px !important; }
          .chapters-how  { padding: 72px 20px !important; }
        }
      `}</style>

    </PageTransition>
  )
}
