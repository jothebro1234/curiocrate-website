import { useEffect, useRef, useState } from 'react'

export default function AutoplayVideo({ src, style }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            video.muted = true
            setMuted(true)
            video.play()
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      border: '1px solid rgba(168,212,240,0.12)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      position: 'relative',
      ...style,
    }}>
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        style={{ width: '100%', display: 'block', background: '#000', pointerEvents: 'none' }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        onClick={() => setMuted(m => !m)}
        style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(6,12,32,0.72)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(168,212,240,0.2)',
          borderRadius: 8, padding: '7px 12px',
          color: 'var(--pastel1)', cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, letterSpacing: '1.5px',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,12,32,0.72)' }}
      >
        {muted ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  )
}
