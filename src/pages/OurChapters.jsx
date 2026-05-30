import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { chapters as staticChapters } from '../data/chapters'

function resolveLogoUrl(url) {
  if (!url) return ''
  if (!url.startsWith('http')) return `/logos/chapters/${url}`
  return url
}

function ChapterCard({ chapter, index }) {
  const [imgError, setImgError] = useState(false)
  const initials = chapter.school
    .split(' ').filter(w => w.length > 2).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')
  const logoSrc = resolveLogoUrl(chapter.logo)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.35) }}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 20px',
        borderBottom: '1px solid rgba(168,212,240,0.055)',
        transition: 'background 0.2s', cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,212,240,0.035)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: (logoSrc && !imgError) ? 'rgba(255,255,255,0.93)' : 'rgba(168,212,240,0.07)',
        border: '1px solid rgba(168,212,240,0.12)', overflow: 'hidden',
      }}>
        {logoSrc && !imgError ? (
          <img src={logoSrc} alt={chapter.school}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }}
            onError={() => setImgError(true)} />
        ) : (
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300, color: 'var(--pastel1)' }}>
            {initials || '?'}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400,
          color: 'var(--cream)', lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{chapter.school}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--pastel2)', opacity: 0.75 }}>
            {chapter.president}
          </span>
          {chapter.state && <>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(168,212,240,0.3)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--muted)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: 1 }}>
              {chapter.state}
            </span>
          </>}
        </div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--muted)', opacity: 0.2, letterSpacing: 2 }}>
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  )
}

const HOW_TO_STEPS = [
  { n: '01', title: 'Fill Out the Application' },
  { n: '02', title: 'Meet with one of our Chapter Development Officers' },
  { n: '03', title: 'Build Your Leadership Structure' },
  { n: '04', title: 'Host Your First Workshop' },
]

export default function OurChapters() {
  const [chaptersData, setChaptersData] = useState([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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

  const q = searchQuery.trim().toLowerCase()
  const filteredChapters = q
    ? chaptersData.filter(c =>
        c.school?.toLowerCase().includes(q) ||
        c.president?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q))
    : chaptersData

  return (
    <PageTransition>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '160px 40px 100px',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="label" style={{ marginBottom: 16 }}>The Network</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(44px,7vw,96px)',
            fontWeight: 300, color: 'var(--cream)',
            lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 24,
          }}>
            Our Chapters
          </h1>
          <p style={{
            fontSize: 16, color: 'var(--muted)', lineHeight: 1.75,
            maxWidth: 520, margin: '0 auto 40px',
          }}>
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
          >
            Start a Chapter →
          </a>
        </motion.div>
      </section>

      {/* ─── CHAPTER LIST ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 40px 100px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 12 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px',
              background: 'rgba(8,16,42,0.6)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(168,212,240,0.14)', borderRadius: 12,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="rgba(168,212,240,0.35)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search by school, president, or state…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: 'var(--cream)', letterSpacing: 0.3,
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: 18, lineHeight: 1, opacity: 0.5, padding: 0,
                }}>×</button>
              )}
              {!chaptersLoading && chaptersData.length > 0 && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, letterSpacing: 2, color: 'var(--muted)', opacity: 0.35,
                }}>{filteredChapters.length} / {chaptersData.length}</span>
              )}
            </div>
          </motion.div>

          {/* List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              height: 520, overflowY: 'auto',
              background: 'rgba(6,12,32,0.55)', backdropFilter: 'blur(28px)',
              border: '1px solid rgba(168,212,240,0.11)', borderRadius: 18,
            }}>
              {chaptersLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(168,212,240,0.2)', borderTopColor: 'rgba(168,212,240,0.7)', animation: 'spin 0.9s linear infinite' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--muted)', opacity: 0.4 }}>Loading chapters…</span>
                </div>
              ) : filteredChapters.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, color: 'var(--pastel1)', opacity: 0.18 }}>◎</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', opacity: 0.4, letterSpacing: 2 }}>
                    {searchQuery ? 'No chapters match' : 'Chapters launching soon'}
                  </div>
                </div>
              ) : filteredChapters.map((chapter, i) => (
                <ChapterCard key={chapter.school + i} chapter={chapter} index={i} />
              ))}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
              background: 'linear-gradient(to top, rgba(6,12,32,0.85) 0%, transparent 100%)',
              borderRadius: '0 0 18px 18px', pointerEvents: 'none',
            }} />
          </motion.div>

        </div>
      </section>

      {/* ─── HOW TO START A CHAPTER ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(168,212,240,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Step by Step</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px,4vw,56px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05,
            }}>
              How to Start a Chapter
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {HOW_TO_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  display: 'flex', gap: 32, alignItems: 'flex-start',
                  padding: '32px 0',
                  borderBottom: i < HOW_TO_STEPS.length - 1 ? '1px solid rgba(168,212,240,0.07)' : 'none',
                }}
              >
                {/* Number */}
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 48, fontWeight: 300, lineHeight: 1,
                  color: 'var(--pastel1)', opacity: 0.35,
                  flexShrink: 0, width: 64,
                }}>{step.n}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 24, fontWeight: 400,
                    color: 'var(--cream)', lineHeight: 1.2,
                  }}>{step.title}</div>
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>Watch</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1,
            }}>
              See what chapters are all about
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(168,212,240,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            <video
              ref={videoRef}
              controls
              playsInline
              style={{ width: '100%', display: 'block', background: '#000' }}
            >
              <source src="/missionvideo.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

    </PageTransition>
  )
}
