import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { driveUrl } from '../utils/updates'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  return isNaN(d) ? str : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function NewsArticleModal({ item, accentColor = '#a8d4f0', onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [onClose])

  if (!item) return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(6,12,32,0.98)',
          border: '1px solid rgba(168,212,240,0.15)',
          borderRadius: 20, overflow: 'hidden',
          maxWidth: 620, width: '100%', maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        {item.image && (
          <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
            <img src={driveUrl(item.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,32,1) 0%, rgba(6,12,32,0.1) 60%, transparent 100%)' }} />
          </div>
        )}

        <div style={{ padding: '32px 36px 40px', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'none', border: '1px solid rgba(168,212,240,0.2)',
            borderRadius: 8, color: 'var(--muted)', fontSize: 11, cursor: 'pointer',
            padding: '7px 14px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px',
          }}>ESC · CLOSE</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, marginTop: item.image ? 0 : 8 }}>
            {item.category && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase',
                color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}40`,
                borderRadius: 4, padding: '5px 12px',
              }}>{item.category}</span>
            )}
            {item.date && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '1.5px', color: 'var(--muted)', opacity: 0.5 }}>
                {formatDate(item.date)}
              </span>
            )}
          </div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,38px)',
            fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 20,
          }}>{item.title}</h2>

          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, opacity: 0.9, whiteSpace: 'pre-wrap' }}>
            {item.body}
          </p>

          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 26,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
              color: accentColor, textDecoration: 'none',
              border: `1px solid ${accentColor}40`, borderRadius: 4, padding: '9px 18px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}14` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              View Source
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}
