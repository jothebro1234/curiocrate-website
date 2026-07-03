import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

function AnimatedAmount({ target = 1000, duration = 1800, onComplete }) {
  const [value, setValue] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    let start = null
    let raf
    const step = (ts) => {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setPulse(true)
        onComplete?.()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return (
    <motion.span
      animate={pulse ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'inline-block' }}
    >
      ${value.toLocaleString()}
    </motion.span>
  )
}

const DETAILS = [
  { label: 'WHO', value: '2 to 3 high school students' },
  { label: 'DATE', value: 'TBD' },
  { label: 'DELIVERABLE', value: 'Pitch deck and presentation' },
  { label: 'TARGET IMPACT', value: 'Underserved students and classrooms in Los Angeles and Orange Counties' },
]

const TABS = [
  { num: '01', label: 'Kit Development' },
  { num: '02', label: 'More Coming Soon' },
]

export default function KitDevelopment() {
  const [activeTab, setActiveTab] = useState(0)
  const [countDone, setCountDone] = useState(false)

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 48px 60px',
      }}>
        <div style={{ maxWidth: 900, width: '100%', margin: '0 auto' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--muted)', opacity: 0.45, marginBottom: 20,
            }}
          >
            Initiatives
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(168,212,240,0.18)' }}>
              {TABS.map((tab, i) => {
                const isActive = activeTab === i
                return (
                  <button
                    key={tab.num}
                    onClick={() => setActiveTab(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '13px 24px',
                      background: isActive ? 'rgba(168,212,240,0.1)' : 'rgba(168,212,240,0.03)',
                      border: '1px solid rgba(168,212,240,0.18)',
                      borderBottom: isActive ? '1px solid transparent' : '1px solid rgba(168,212,240,0.18)',
                      borderRadius: i === 0 ? '8px 0 0 0' : '0 8px 0 0',
                      cursor: 'pointer',
                      transition: 'background 0.2s, color 0.2s',
                      marginBottom: isActive ? '-1px' : 0,
                    }}
                  >
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, fontWeight: 700,
                      color: isActive ? 'var(--pastel1)' : 'rgba(168,212,240,0.3)',
                    }}>{tab.num}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                      color: isActive ? 'var(--cream)' : 'var(--muted)',
                    }}>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Boxed content */}
            <div style={{
              border: '1px solid rgba(168,212,240,0.18)',
              borderTop: 'none',
              borderRadius: '0 8px 8px 8px',
              background: 'rgba(10,18,45,0.6)',
              backdropFilter: 'blur(8px)',
              overflow: 'hidden',
              minHeight: 420,
            }}>
              <AnimatePresence mode="wait">
                {activeTab === 0 ? (
                  <motion.div
                    key="kit"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '40px 44px 44px' }}
                  >
                    {/* Big $1,000 */}
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(88px, 14vw, 160px)',
                      fontWeight: 300,
                      color: 'var(--pastel1)',
                      lineHeight: 0.85,
                      letterSpacing: '-0.05em',
                      textShadow: '0 0 100px rgba(168,212,240,0.6), 0 0 40px rgba(168,212,240,0.3)',
                      marginBottom: 16,
                    }}>
                      <AnimatedAmount target={1000} duration={1600} onComplete={() => setCountDone(true)} />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={countDone ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }}
                    >
                      {/* Headline */}
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(17px, 2.2vw, 26px)',
                        fontWeight: 300, color: 'var(--cream)',
                        lineHeight: 1.3, margin: '0 0 14px',
                      }}>
                        Pitch your kit idea and get up to $1,000 to develop and distribute your science kit.
                      </p>

                      {/* Description */}
                      <p style={{
                        fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
                        maxWidth: 520, margin: '0 0 30px', opacity: 0.8,
                      }}>
                        Apply to design a hands-on experiment kit. Selected teams receive up to $1,000 and CurioCrate handles production and distribution to 30 to 100 underserved students and classrooms.
                      </p>

                      {/* 2x2 details grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px 64px',
                        marginBottom: 34,
                      }}>
                        {DETAILS.map(d => (
                          <div key={d.label} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 14 }}>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                              color: 'var(--pastel1)', opacity: 0.6, marginBottom: 4,
                            }}>
                              {d.label}
                            </div>
                            <div style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: 15, fontWeight: 600, color: 'var(--cream)',
                            }}>
                              {d.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                              background: 'var(--pastel1)', color: 'var(--dark)',
                              borderRadius: 6, padding: '12px 32px',
                              fontWeight: 700, textDecoration: 'none',
                              display: 'inline-flex', alignItems: 'center', gap: 8,
                              opacity: 0.4,
                            }}
                          >
                            Apply Now
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M7 17L17 7M17 7H7M17 7v10"/>
                            </svg>
                          </span>
                          {/* Overlay: blocks the CTA and shows a "not allowed" cursor */}
                          <div
                            title="Applications are closed at the moment"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: 6,
                              cursor: 'not-allowed',
                            }}
                          />
                        </div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10, letterSpacing: '1px',
                          color: '#f87171', opacity: 0.85,
                        }}>
                          Applications are closed at the moment.
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="soon"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '80px 44px',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'flex-start', justifyContent: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(36px, 5vw, 64px)',
                      fontWeight: 300, color: 'rgba(168,212,240,0.2)',
                      letterSpacing: '-0.02em', lineHeight: 1.1,
                      marginBottom: 16,
                    }}>
                      Coming soon.
                    </div>
                    <p style={{
                      fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
                      maxWidth: 400, margin: 0, opacity: 0.5,
                    }}>
                      New opportunities are on the way. Check back soon.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  )
}
