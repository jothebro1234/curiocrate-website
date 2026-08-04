import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function getRemaining(target, now) {
  const diff = Math.max(0, target.getTime() - now)
  const totalSeconds = Math.floor(diff / 1000)
  return {
    diff,
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

// Deterministic pseudo-random in [0,1) — used instead of Math.random() so particle layout
// stays a pure function of the seed (React's purity rules disallow Math.random() in render).
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// A short-lived glow ring + tiny outward-emitting particles, mounted fresh (via `key`) each
// time a digit changes, so it plays once and unmounts.
function DigitBurst({ seed = 0 }) {
  const particles = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 + pseudoRandom(seed + i) * 0.6
    const dist = 26 + pseudoRandom(seed + i + 0.5) * 22
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }), [seed])

  return (
    <>
      <motion.span
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', inset: -16, borderRadius: 16, pointerEvents: 'none',
          boxShadow: '0 0 48px 9px rgba(147,197,253,0.9)',
        }}
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%',
            background: 'rgba(191,219,254,0.95)', pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

function FlipDigit({ char, fontSize }) {
  const [burstKey, setBurstKey] = useState(0)
  const prev = useRef(char)

  useEffect(() => {
    if (prev.current !== char) {
      prev.current = char
      setBurstKey(k => k + 1)
    }
  }, [char])

  return (
    <span style={{
      position: 'relative', display: 'inline-block',
      fontSize, width: '0.62em', height: '1em',
      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
    }}>
      <span style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={char}
            initial={{ y: '55%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-55%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#f2f8ff', textShadow: '0 0 22px rgba(147,197,253,0.85), 0 0 60px rgba(96,165,250,0.4)',
            }}
          >{char}</motion.span>
        </AnimatePresence>
      </span>
      {burstKey > 0 && <DigitBurst key={burstKey} seed={burstKey} />}
    </span>
  )
}

function PulseRings() {
  return (
    <>
      {[0, 0.45, 0.9].map(delay => (
        <motion.div
          key={delay}
          initial={{ scale: 0.4, opacity: 0.55 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay, ease: 'easeOut' }}
          style={{
            position: 'absolute', width: 420, height: 420, borderRadius: '50%',
            border: '2px solid rgba(147,197,253,0.75)', pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

function CountdownParticles({ intense }) {
  const canvasRef = useRef(null)
  const speedRef = useRef(1)

  useEffect(() => { speedRef.current = intense ? 3 : 1 }, [intense])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.09,
      vy: (Math.random() - 0.5) * 0.09,
      r: Math.random() * 1.3 + 0.4,
      a: Math.random() * 0.35 + 0.08,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx * speedRef.current
        p.y += p.vy * speedRef.current
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(148,197,255,${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
}

const GROUP_LABELS = ['DAYS', 'HRS', 'MIN', 'SEC']

// Parses whatever the KitStatus sheet's LaunchAt value comes through as — either a real ISO
// datetime string (Date cells serialize to ISO via JSON.stringify on the Apps Script side) or
// a plain "YYYY-MM-DD HH:MM:SS"-style string typed directly into the cell, which the Date
// constructor doesn't reliably parse without a "T" separator across browsers.
function parseLaunchAt(raw) {
  if (!raw) return null
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(raw) ? raw.replace(' ', 'T') : raw
  const d = new Date(normalized)
  return isNaN(d) ? null : d
}

export default function KitCountdown({ launchAtRaw, introText }) {
  const launchAt = useMemo(() => parseLaunchAt(launchAtRaw), [launchAtRaw])
  const hasTarget = !!launchAt

  const [now, setNow] = useState(() => Date.now())
  const [phase, setPhase] = useState('counting') // counting | flash | reveal
  const zeroTriggered = useRef(false)
  const reducedMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  , [])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = useMemo(() => hasTarget ? getRemaining(launchAt, now) : null, [launchAt, now, hasTarget])
  const diff = remaining ? remaining.diff : Infinity
  const isFinal10 = hasTarget && diff <= 10000 && diff > 3000 && !reducedMotion
  const isFinal3  = hasTarget && diff <= 3000 && diff > 0 && !reducedMotion
  const isIntense = isFinal10 || isFinal3

  useEffect(() => {
    if (hasTarget && diff <= 0 && !zeroTriggered.current) {
      zeroTriggered.current = true
      setPhase('flash')
      const t = setTimeout(() => setPhase('reveal'), 700)
      return () => clearTimeout(t)
    }
  }, [diff, hasTarget])

  const d = remaining || { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const groups = [d.days, d.hours, d.minutes, d.seconds]

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 40%, #0b1220 0%, #050810 55%, #020306 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Animated grid */}
      <div className="kc-grid" />

      {/* Drifting particles */}
      <CountdownParticles intense={isIntense} />

      {/* Rotating halo */}
      <motion.div
        className="kc-halo"
        animate={{ opacity: isIntense ? 0.95 : 0.6, scale: isIntense ? 1.12 : 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />

      {/* Ambient brighten overlay for the final stretch */}
      <motion.div
        animate={{ opacity: isIntense ? 0.5 : 0 }}
        transition={{ duration: 2.5 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 45%, rgba(96,165,250,0.35) 0%, transparent 60%)',
        }}
      />

      {isFinal3 && <PulseRings />}

      <AnimatePresence mode="wait">
        {phase !== 'reveal' ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: isIntense ? 1.04 : 1,
              x: isFinal3 ? [0, -2, 2, -1, 1, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 3, ease: 'easeInOut' },
              x: { duration: 0.5, repeat: isFinal3 ? Infinity : 0 },
            }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 'clamp(20px, 3vw, 32px)', color: 'rgba(197,227,247,0.75)',
              letterSpacing: '0.02em', marginBottom: 48,
              textShadow: '0 0 30px rgba(96,165,250,0.4)',
            }}>
              {introText || 'Our first kit is launching in'}
            </div>

            {isFinal3 && (
              <div className="kc-flicker" style={{
                height: 1, width: '100%', maxWidth: 640, margin: '0 auto 22px',
                background: 'linear-gradient(to right, transparent, rgba(147,197,253,0.9), transparent)',
              }} />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(10px, 2.6vw, 32px)' }}>
              {groups.map((val, gi) => (
                <div key={GROUP_LABELS[gi]} style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(10px, 2.6vw, 32px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {String(val).padStart(2, '0').split('').map((c, ci) => (
                        <FlipDigit key={ci} char={c} fontSize="clamp(72px, 17vw, 220px)" />
                      ))}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(11px, 1.6vw, 16px)',
                      letterSpacing: '4px', color: 'rgba(147,197,253,0.55)', marginTop: 18,
                    }}>{GROUP_LABELS[gi]}</div>
                  </div>
                  {gi < groups.length - 1 && (
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(48px, 11vw, 140px)',
                      color: 'rgba(147,197,253,0.35)', paddingBottom: 'clamp(26px, 4vw, 52px)',
                    }}>:</div>
                  )}
                </div>
              ))}
            </div>

            {isFinal3 && (
              <div className="kc-flicker" style={{
                height: 1, width: '100%', maxWidth: 640, margin: '22px auto 0',
                background: 'linear-gradient(to right, transparent, rgba(147,197,253,0.9), transparent)',
              }} />
            )}

            {!hasTarget && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'rgba(197,227,247,0.4)', marginTop: 44,
              }}>
                Launch date coming soon
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}
          >
            <img
              src="/images/cclogofull.png"
              alt="CurioCrate"
              style={{
                height: 'clamp(110px, 20vw, 220px)', margin: '0 auto 34px',
                filter: 'drop-shadow(0 0 50px rgba(96,165,250,0.6)) drop-shadow(0 0 110px rgba(96,165,250,0.3))',
              }}
            />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 'clamp(22px, 3.4vw, 34px)', color: 'rgba(197,227,247,0.85)',
            }}>
              The first kit has arrived.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zero-hour white flash */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, times: [0, 0.35, 1] }}
            style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 50, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .kc-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(148,197,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,197,255,0.05) 1px, transparent 1px);
          background-size: 54px 54px;
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
          animation: kcGridDrift 26s linear infinite;
        }
        @keyframes kcGridDrift { from { background-position: 0 0, 0 0; } to { background-position: 54px 54px, 54px 54px; } }

        .kc-halo {
          position: absolute;
          width: min(92vw, 1300px); height: min(92vw, 1300px);
          border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(96,165,250,0.35), transparent 25%, rgba(129,140,248,0.28) 55%, transparent 85%);
          filter: blur(90px);
          pointer-events: none;
          animation: kcHaloSpin 50s linear infinite, kcHaloPulse 4s ease-in-out infinite;
        }
        @keyframes kcHaloSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes kcHaloPulse { 0%, 100% { filter: blur(90px) brightness(1); } 50% { filter: blur(94px) brightness(1.12); } }

        .kc-flicker { animation: kcFlicker 0.5s ease-in-out infinite alternate; }
        @keyframes kcFlicker { from { opacity: 0.35; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}
