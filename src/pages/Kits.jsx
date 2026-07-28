import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import Scene from '../components/kitExperience/Scene'
import { useMobile } from '../hooks/useMobile'
import { TOTAL_VH, CAPTIONS, CHAPTER_KEYS, chapterIndexForProgress, CTA_LINKS, COMPONENTS } from '../components/kitExperience/content'

gsap.registerPlugin(ScrollTrigger)

function Caption({ chapterKey, caption }) {
  if (!caption || (!caption.line && !caption.eyebrow)) return null
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chapterKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ textAlign: 'center', maxWidth: 560 }}
      >
        {caption.eyebrow && (
          <div className="label" style={{ marginBottom: 10, opacity: 0.6, letterSpacing: '3px' }}>{caption.eyebrow}</div>
        )}
        {caption.line && (
          <p style={{
            fontFamily: caption.hint ? "'JetBrains Mono', monospace" : "'Cormorant Garamond', serif",
            fontStyle: caption.hint ? 'normal' : 'italic',
            fontSize: caption.hint ? 11 : 'clamp(20px, 2.6vw, 30px)',
            letterSpacing: caption.hint ? '3px' : '0',
            textTransform: caption.hint ? 'uppercase' : 'none',
            color: caption.hint ? 'var(--pastel1)' : 'var(--cream)',
            opacity: caption.hint ? 0.6 : 0.92,
            lineHeight: 1.3,
          }}>{caption.line}</p>
        )}
        {caption.badge && (
          <div style={{
            display: 'inline-block', marginTop: 14, padding: '6px 16px',
            border: '1px solid rgba(240,192,112,0.4)', borderRadius: 20,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            letterSpacing: '2px', color: '#f0c070',
          }}>{caption.badge}</div>
        )}
        {caption.cta && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, pointerEvents: 'auto', flexWrap: 'wrap' }}
          >
            {CTA_LINKS.map((c) => (
              <Link key={c.to} to={c.to} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                padding: '13px 24px', border: '1px solid rgba(168,212,240,0.3)', borderRadius: 4,
                color: 'var(--pastel1)', background: 'rgba(168,212,240,0.05)', transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(168,212,240,0.14)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(168,212,240,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(168,212,240,0.05)'; e.currentTarget.style.boxShadow = 'none' }}
              >{c.label}</Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function KitsExperience({ isMobile }) {
  const spacerRef = useRef(null)
  const pinRef = useRef(null)
  const progressRef = useRef(0)
  const [chapterIdx, setChapterIdx] = useState(0)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: spacerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
        const idx = chapterIndexForProgress(self.progress)
        setChapterIdx((prev) => (prev === idx ? prev : idx))
      },
      onToggle: (self) => setActive(self.isActive),
    })
    return () => st.kill()
  }, [])

  const chapterKey = CHAPTER_KEYS[chapterIdx]
  const caption = CAPTIONS[chapterKey]

  return (
    <div ref={spacerRef} style={{ position: 'relative', height: `${TOTAL_VH}vh` }}>
      {createPortal(
        <div ref={pinRef} style={{
          position: 'fixed', inset: 0, zIndex: 1, overflow: 'hidden', background: '#03050f',
          opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none',
        }}>
          <Canvas
            camera={{ position: [0, 0.5, 15], fov: isMobile ? 50 : 38 }}
            dpr={isMobile ? [1, 1.5] : [1, 1.8]}
            gl={{ antialias: true }}
          >
            <Scene progressRef={progressRef} quality={isMobile ? 'low' : 'high'} />
          </Canvas>

          {/* chapter rail */}
          <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 5, zIndex: 5 }}>
            {CHAPTER_KEYS.map((k, i) => (
              <div key={k} style={{
                width: i === chapterIdx ? 16 : 8, height: 2,
                background: i === chapterIdx ? 'var(--pastel1)' : 'rgba(168,212,240,0.25)',
                boxShadow: i === chapterIdx ? '0 0 8px rgba(168,212,240,0.8)' : 'none',
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>

          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', alignItems: 'center', padding: '0 24px 90px',
            pointerEvents: 'none', zIndex: 4,
          }}>
            <Caption chapterKey={chapterKey} caption={caption} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function KitsFallback() {
  const progressRef = useRef(0.30)
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, background: '#03050f' }}>
      <div style={{ height: '62vh', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0.35, 6.2], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
          <Scene progressRef={progressRef} quality="low" />
        </Canvas>
      </div>

      <div style={{ padding: '32px 24px 110px', maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 12, opacity: 0.5 }}>◈&nbsp; THE LAB &nbsp;◈</div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 'clamp(36px, 8vw, 54px)', color: 'var(--cream)', marginBottom: 12,
        }}>Example Kit</h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
          fontSize: 17, color: 'var(--pastel1)', opacity: 0.8, marginBottom: 48,
        }}>Designed for creators.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left', marginBottom: 40 }}>
          {COMPONENTS.map((c) => (
            <div key={c.key} style={{
              padding: '18px 20px', border: '1px solid rgba(168,212,240,0.12)',
              borderRadius: 12, background: 'rgba(8,16,40,0.4)',
            }}>
              <div className="label" style={{ opacity: 0.55, marginBottom: 6 }}>{c.name}</div>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7 }}>
                {c.callouts.map((cc) => cc.desc).join(' ')}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CTA_LINKS.map((c) => (
            <Link key={c.to} to={c.to} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
              padding: '13px 24px', border: '1px solid rgba(168,212,240,0.3)', borderRadius: 4,
              color: 'var(--pastel1)', background: 'rgba(168,212,240,0.05)',
            }}>{c.label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Kits() {
  const isMobile = useMobile()
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  return (
    <PageTransition>
      {reducedMotion ? <KitsFallback /> : <KitsExperience isMobile={isMobile} />}
    </PageTransition>
  )
}
