import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import AutoplayVideo from '../components/AutoplayVideo'
import { useLanguage } from '../i18n/useLanguage'

function AnimatedAmount({ target = 1000, duration = 2800, holdDelay = 600, onComplete }) {
  const [value, setValue] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    let start = null
    let raf
    const step = (ts) => {
      if (start === null) start = ts
      const elapsed = ts - start - holdDelay
      if (elapsed < 0) {
        raf = requestAnimationFrame(step)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress <= 0 ? 0
        : progress >= 1 ? 1
        : progress < 0.5 ? Math.pow(2, 20 * progress - 10) / 2
        : (2 - Math.pow(2, -20 * progress + 10)) / 2
      setValue(Math.round(eased * target))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setValue(target)
        setPulse(true)
        onComplete?.()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, holdDelay])

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

const STEM_DEADLINE = new Date('2026-09-09T23:59:00-08:00')

function useCountdown(target) {
  const [msLeft, setMsLeft] = useState(() => target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setMsLeft(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  return Math.max(msLeft, 0)
}

function StemCountdown() {
  const { t } = useLanguage()
  const msLeft = useCountdown(STEM_DEADLINE)
  const closed = msLeft <= 0

  const days = Math.floor(msLeft / 86400000)
  const hours = Math.floor((msLeft % 86400000) / 3600000)
  const minutes = Math.floor((msLeft % 3600000) / 60000)
  const seconds = Math.floor((msLeft % 60000) / 1000)
  const pad = n => String(n).padStart(2, '0')

  const units = [
    [days, t('kitDevelopment.stem.countdownDays', 'Days')],
    [hours, t('kitDevelopment.stem.countdownHours', 'Hrs')],
    [minutes, t('kitDevelopment.stem.countdownMinutes', 'Min')],
    [seconds, t('kitDevelopment.stem.countdownSeconds', 'Sec')],
  ]

  return (
    <div className="kd-countdown" style={{
      display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap',
      padding: '16px 22px',
      border: '1px solid rgba(168,212,240,0.25)',
      borderRadius: 10,
      background: 'rgba(168,212,240,0.05)',
      marginBottom: 32,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
        color: 'var(--pastel1)', opacity: 0.65,
      }}>
        {closed ? t('kitDevelopment.stem.countdownClosed', 'Applications are closed') : t('kitDevelopment.stem.countdownLabel', 'Applications Close In')}
      </div>
      {!closed && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          {units.map(([value, label], i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline' }}>
              <div style={{ textAlign: 'center', minWidth: 40 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 24, fontWeight: 700, lineHeight: 1,
                  color: 'var(--pastel1)',
                  textShadow: '0 0 18px rgba(168,212,240,0.5)',
                }}>{pad(value)}</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'var(--muted)', opacity: 0.6, marginTop: 3,
                }}>{label}</div>
              </div>
              {i < units.length - 1 && (
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 22, fontWeight: 700, color: 'var(--pastel1)',
                  opacity: 0.35, alignSelf: 'flex-start', margin: '0 6px',
                }}>:</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const DETAILS = [
  { key: 'who', label: 'WHO', value: '2 to 3 high school students' },
  { key: 'date', label: 'DATE', value: 'TBD' },
  { key: 'deliverable', label: 'DELIVERABLE', value: 'Pitch deck and presentation' },
  { key: 'targetImpact', label: 'TARGET IMPACT', value: 'Underserved students and classrooms in Los Angeles and Orange Counties' },
]

const TABS = [
  { num: '01', key: 'stemAdvocacy', label: 'STEM Advocacy Project (Competition)', path: '/initiatives/sap' },
  { num: '02', key: 'kitDevelopment', label: 'Kit Development', path: '/initiatives/kits' },
]

const STEM_DETAILS = [
  { key: 'who', label: 'WHO', value: '2 to 3 high school students' },
  { key: 'startDate', label: 'START DATE', value: 'August 8, 2026' },
  { key: 'endDate', label: 'END DATE', value: 'September 9, 2026, 11:59 PM PST' },
  { key: 'format', label: 'FORMAT', value: 'Video pitch + one-pager' },
]

export default function KitDevelopment() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname === TABS[0].path ? 0 : 1
  const [countDone, setCountDone] = useState(false)

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 48px 60px',
      }} className="kd-page">
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
            {t('kitDevelopment.eyebrow')}
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
                    className="kd-tab"
                    onClick={() => navigate(tab.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, flex: 1,
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
                    <span className="kd-tab-label" style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                      color: isActive ? 'var(--cream)' : 'var(--muted)',
                    }}>{t(`kitDevelopment.tabs.${tab.key}`, tab.label)}</span>
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
                    key="stem"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="kd-panel" style={{ padding: '40px 44px 44px' }}
                  >
                    {/* CTA — moved to top for visibility */}
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScgkA-yNs8sUiGrDJvxm_Nwju_3LPJ1cU-loZodL4-Rvm_MNA/viewform?usp=preview"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                          background: 'var(--pastel1)', color: 'var(--dark)',
                          borderRadius: 6, padding: '12px 32px',
                          fontWeight: 700, textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        {t('kitDevelopment.applyNow')}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M7 17L17 7M17 7H7M17 7v10"/>
                        </svg>
                      </a>
                    </div>

                    {/* Big $500+ prize */}
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(64px, 10vw, 112px)',
                      fontWeight: 300,
                      color: 'var(--pastel1)',
                      lineHeight: 1,
                      letterSpacing: '-0.05em',
                      textShadow: '0 0 60px rgba(168,212,240,0.5), 0 0 24px rgba(168,212,240,0.3)',
                      marginBottom: 18,
                    }}>
                      <AnimatedAmount target={500} duration={2000} holdDelay={500} onComplete={() => setCountDone(true)} />+
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase',
                      color: 'var(--pastel1)', opacity: 0.55, marginBottom: 24,
                    }}>
                      {t('kitDevelopment.stem.prizeMoneyLabel')}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={countDone ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7 }}
                    >
                      {/* Partnership eyebrow */}
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                        color: 'var(--pastel1)', opacity: 0.65, marginBottom: 14,
                      }}>
                        {t('kitDevelopment.stem.partnership')}
                      </div>

                      {/* Headline */}
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(20px, 2.6vw, 30px)',
                        fontWeight: 400, color: 'var(--cream)',
                        lineHeight: 1.35, margin: '0 0 18px',
                      }}>
                        {t('kitDevelopment.stem.headline')}
                      </p>

                      {/* Description — short, no em dashes, bigger and legible */}
                      <p style={{
                        fontSize: 17, color: 'var(--cream)', lineHeight: 1.75,
                        maxWidth: 600, margin: '0 0 32px', opacity: 0.88,
                      }}>
                        {t('kitDevelopment.stem.description')}
                      </p>

                      {/* Live countdown to application deadline */}
                      <StemCountdown />

                      {/* Partnership video */}
                      <AutoplayVideo
                        src="https://pub-e7374d03fa9c42bfb531206a5e81830b.r2.dev/ccycttvideo.mp4"
                        style={{ maxWidth: 720, marginBottom: 36 }}
                      />

                      {/* 2x2 details grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '18px 64px',
                        marginBottom: 36,
                      }}>
                        {STEM_DETAILS.map(d => (
                          <div key={d.key} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 14 }}>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                              color: 'var(--pastel1)', opacity: 0.6, marginBottom: 5,
                            }}>
                              {t(`kitDevelopment.stem.details.${d.key}.label`, d.label)}
                            </div>
                            <div style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: 16, fontWeight: 600, color: 'var(--cream)',
                            }}>
                              {t(`kitDevelopment.stem.details.${d.key}.value`, d.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="kit"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="kd-panel" style={{ padding: '40px 44px 44px' }}
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
                      <AnimatedAmount target={1000} duration={2800} holdDelay={600} onComplete={() => setCountDone(true)} />
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
                        {t('kitDevelopment.kit.headline')}
                      </p>

                      {/* Description */}
                      <p style={{
                        fontSize: 14, color: 'var(--muted)', lineHeight: 1.75,
                        maxWidth: 520, margin: '0 0 30px', opacity: 0.8,
                      }}>
                        {t('kitDevelopment.kit.description')}
                      </p>

                      {/* 2x2 details grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px 64px',
                        marginBottom: 34,
                      }}>
                        {DETAILS.map(d => (
                          <div key={d.key} style={{ borderLeft: '3px solid rgba(168,212,240,0.3)', paddingLeft: 14 }}>
                            <div style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
                              color: 'var(--pastel1)', opacity: 0.6, marginBottom: 4,
                            }}>
                              {t(`kitDevelopment.kit.details.${d.key}.label`, d.label)}
                            </div>
                            <div style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: 15, fontWeight: 600, color: 'var(--cream)',
                            }}>
                              {t(`kitDevelopment.kit.details.${d.key}.value`, d.value)}
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
                            {t('kitDevelopment.applyNow')}
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M7 17L17 7M17 7H7M17 7v10"/>
                            </svg>
                          </span>
                          {/* Overlay: blocks the CTA and shows a "not allowed" cursor */}
                          <div
                            title={t('kitDevelopment.kit.applicationsClosed')}
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
                          {t('kitDevelopment.kit.applicationsClosed')}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media(max-width:640px){
          .kd-page { padding: 96px 16px 48px !important; }
          .kd-tab { flex-direction: column !important; gap: 4px !important; padding: 10px 8px !important; text-align: center; }
          .kd-tab-label { font-size: 8.5px !important; letter-spacing: 1px !important; white-space: normal !important; line-height: 1.3 !important; }
          .kd-panel { padding: 28px 22px 32px !important; }
          .kd-countdown { padding: 12px 16px !important; gap: 12px !important; }
        }
      `}</style>
    </PageTransition>
  )
}
