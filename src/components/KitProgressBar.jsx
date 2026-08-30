import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/useLanguage'

function formatAmount(n) {
  return '$' + Math.round(n || 0).toLocaleString('en-US')
}

// Animates a number from 0 -> target once `trigger` flips true, easing out over `duration`ms.
// Drives the big headline dollar figure so it counts up in sync with the bar filling in —
// a moving number reads as "alive"/earned in a way a number that just appears doesn't.
function useCountUp(target, trigger, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let raf
    const start = performance.now()
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [trigger, target, duration])
  return value
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.7L13 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Funding progress bar for the Kits page, driven by the KitStatus sheet's "ProgressBar" row
// (goal/current) and any number of "Checkpoint" rows (see the KITSTATUS SHEET doc comment in
// apps-script/Code.gs). Deliberately renders nothing when there's no goal set, so an empty
// sheet never shows a misleading 0% bar. Design leans on real behavioral-psychology levers —
// goal-gradient framing (motivation increases as you near a target), a single highlighted
// "next milestone" anchor, a count-up number for momentum, and a direct CTA — all driven by
// real data. No fabricated donor counts/urgency: only genuine sheet-driven numbers are shown.
export default function KitProgressBar({ goal = 0, current = 0, checkpoints = [] }) {
  const { t } = useLanguage()
  // Animates in on mount (this section sits right below the navbar now, with no hero above
  // it, so it's essentially always in view on load anyway) rather than gating on scrolling
  // into view. Previously used framer-motion's useInView, tied to an IntersectionObserver —
  // confirmed live that when that observer doesn't fire (seen in a backgrounded/throttled
  // browser tab; not something this codebase controls), EVERY animated value below (card
  // opacity, bar fill, count-up, checkpoint fade-ins) stayed permanently stuck at its initial
  // state with no fallback, i.e. the entire section rendered invisible forever. A plain
  // mount-triggered flag has no such single point of failure.
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  const pct = goal > 0 ? Math.max(0, Math.min(100, (current / goal) * 100)) : 0
  const displayedCurrent = useCountUp(current, ready)
  const funded = pct >= 100

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) => a.amount - b.amount),
    [checkpoints]
  )
  // The single next unreached milestone — the one moment worth calling out. Showing every
  // future milestone as equally distant dilutes motivation; anchoring on just the next one
  // (goal-gradient hypothesis: effort rises as a target gets closer) gives visitors one clear,
  // reachable target instead of an abstract wall of numbers.
  const nextCheckpoint = sortedCheckpoints.find(cp => current < cp.amount)

  const stage = funded ? 'funded' : pct >= 75 ? 'almost' : pct >= 25 ? 'building' : 'start'
  const stageCopy = {
    start:    t('kits.progress.stage.start', 'Every gift right now helps us build momentum from day one.'),
    building: t('kits.progress.stage.building', "We're building momentum — thank you for being part of it."),
    almost:   t('kits.progress.stage.almost', "So close! Help us cross the finish line."),
    funded:   t('kits.progress.stage.funded', 'Fully funded — thank you to everyone who made this possible!'),
  }[stage]

  if (!goal || goal <= 0) return null

  return (
    <section className="kpb-section">
      <div className="kpb-grid" />
      <motion.div
        className="kpb-halo"
        animate={{ opacity: ready ? 0.6 : 0 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="kpb-card"
        initial={{ opacity: 0, y: 28 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="kpb-trust-row">
          <span className="kpb-trust-pill">{t('kits.progress.trust.nonprofit', '501(c)(3) Nonprofit')}</span>
          <span className="kpb-trust-pill">{t('kits.progress.trust.deductible', '100% Tax-Deductible')}</span>
          <span className="kpb-trust-pill">{t('kits.progress.trust.direct', 'Goes Directly to Kits')}</span>
        </div>

        <div className="kpb-header">
          <div className="kpb-eyebrow">{t('kits.progress.eyebrow', 'Funding Progress')}</div>
          <h2 className="kpb-title">{t('kits.progress.title', 'Help Us Ship Our First Kit')}</h2>
          <p className="kpb-stage-copy">{stageCopy}</p>
        </div>

        <div className="kpb-stat-row">
          <div className="kpb-stat-main">
            <span className="kpb-current">{formatAmount(displayedCurrent)}</span>
            <span className="kpb-pct-badge">{Math.round(pct)}%</span>
          </div>
          <div className="kpb-stat-sub">
            {t('kits.progress.of', 'of')} <strong>{formatAmount(goal)}</strong> {t('kits.progress.goalSuffix', 'goal')}
            {!funded && <span className="kpb-stat-remaining"> · {formatAmount(goal - current)} {t('kits.progress.toGo', 'to go')}</span>}
          </div>
        </div>

        <div className="kpb-track-wrap">
          <div className="kpb-track">
            <motion.div
              className="kpb-fill"
              initial={{ width: 0 }}
              animate={{ width: ready ? `${pct}%` : 0 }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="kpb-fill-comet" />
            </motion.div>
            {sortedCheckpoints.map((cp, i) => {
              const cpPct = Math.max(0, Math.min(100, (cp.amount / goal) * 100))
              const reached = current >= cp.amount
              return (
                <div
                  key={i}
                  className={`kpb-marker ${reached ? 'reached' : ''}`}
                  style={{ left: `${cpPct}%` }}
                  title={cp.label ? `${cp.label} (${formatAmount(cp.amount)})` : formatAmount(cp.amount)}
                />
              )
            })}
          </div>
        </div>

        {sortedCheckpoints.length > 0 && (
          <div className="kpb-roadmap">
            {sortedCheckpoints.map((cp, i) => {
              const reached = current >= cp.amount
              const isNext = !reached && cp === nextCheckpoint
              const remaining = cp.amount - current
              return (
                <motion.div
                  key={i}
                  className={`kpb-cp-card ${reached ? 'reached' : ''} ${isNext ? 'next' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={ready ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.09 }}
                >
                  {isNext && <span className="kpb-cp-pulse" />}
                  <div className="kpb-cp-icon">
                    {reached ? <CheckIcon /> : <span className="kpb-cp-num">{i + 1}</span>}
                  </div>
                  <div className="kpb-cp-label">{cp.label || formatAmount(cp.amount)}</div>
                  <div className="kpb-cp-amount">{formatAmount(cp.amount)}</div>
                  {isNext && (
                    <div className="kpb-cp-remaining">{formatAmount(remaining)} {t('kits.progress.away', 'away')}</div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="kpb-cta-row">
          <Link to="/contact" className="kpb-donate-btn">
            {t('kits.progress.cta', 'Donate Now')}
            <span className="kpb-donate-arrow">→</span>
          </Link>
          <span className="kpb-cta-sub">{t('kits.progress.ctaSub', 'Secure and tax-deductible — every dollar goes toward building this kit.')}</span>
        </div>
      </motion.div>

      <style>{`
        .kpb-section {
          position: relative; overflow: hidden;
          background: radial-gradient(ellipse at 50% 0%, #0b1220 0%, #050810 55%, #020306 100%);
          padding: 88px 20px 100px;
        }
        .kpb-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(148,197,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,197,255,0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%);
          mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 75%);
        }
        .kpb-halo {
          position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
          width: min(90vw, 1100px); height: min(90vw, 1100px);
          border-radius: 50%; pointer-events: none;
          background: conic-gradient(from 0deg, rgba(96,165,250,0.28), transparent 25%, rgba(129,140,248,0.22) 55%, transparent 85%);
          filter: blur(100px);
          animation: kpbHaloSpin 60s linear infinite;
        }
        @keyframes kpbHaloSpin { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }

        .kpb-card {
          position: relative; z-index: 1; max-width: 780px; margin: 0 auto;
          padding: clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px);
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(147,197,253,0.06), rgba(147,197,253,0.02));
          border: 1px solid rgba(147,197,253,0.16);
          box-shadow: 0 30px 90px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(18px);
        }

        .kpb-trust-row {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 28px;
        }
        .kpb-trust-pill {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(197,227,247,0.6);
          border: 1px solid rgba(147,197,253,0.2); border-radius: 999px;
          padding: 6px 12px;
        }

        .kpb-header { text-align: center; margin-bottom: 36px; }
        .kpb-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(147,197,253,0.65); margin-bottom: 14px;
        }
        .kpb-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(26px, 4.2vw, 42px); color: rgba(242,248,255,0.95);
          margin: 0 0 16px; text-shadow: 0 0 30px rgba(96,165,250,0.4);
        }
        .kpb-stage-copy {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(13px, 1.6vw, 15px);
          color: rgba(197,227,247,0.6); margin: 0; max-width: 480px; margin: 0 auto;
        }

        .kpb-stat-row { text-align: center; margin-bottom: 30px; }
        .kpb-stat-main {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          font-family: 'JetBrains Mono', monospace;
        }
        .kpb-current {
          font-size: clamp(36px, 7vw, 56px); font-weight: 700; color: #f2f8ff;
          text-shadow: 0 0 26px rgba(147,197,253,0.85); letter-spacing: -0.5px;
          font-variant-numeric: tabular-nums;
        }
        .kpb-pct-badge {
          font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
          color: #052014; background: linear-gradient(135deg, #93c5fd, #bfdbfe);
          padding: 5px 11px; border-radius: 999px;
          box-shadow: 0 0 16px 2px rgba(147,197,253,0.5);
        }
        .kpb-stat-sub {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px;
          color: rgba(197,227,247,0.55); margin-top: 8px;
        }
        .kpb-stat-sub strong { color: rgba(242,248,255,0.85); font-weight: 600; }
        .kpb-stat-remaining { color: rgba(147,197,253,0.6); }

        .kpb-track-wrap { padding: 0 4px; }
        .kpb-track {
          position: relative; height: 14px; border-radius: 999px;
          background: rgba(147,197,253,0.1);
          border: 1px solid rgba(147,197,253,0.18);
          overflow: visible;
        }
        .kpb-fill {
          position: absolute; inset: 0; border-radius: 999px; max-width: 100%;
          background: linear-gradient(90deg, #3b82f6, #93c5fd);
          box-shadow: 0 0 20px 3px rgba(96,165,250,0.6);
          overflow: visible;
        }
        .kpb-fill::after {
          content: ''; position: absolute; inset: 0; border-radius: 999px;
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.55) 47%, rgba(255,255,255,0.55) 53%, transparent 70%);
          background-size: 220% 100%;
          animation: kpbShimmer 3.2s ease-in-out infinite;
          mix-blend-mode: overlay;
        }
        @keyframes kpbShimmer { 0% { background-position: 220% 0; } 100% { background-position: -220% 0; } }
        .kpb-fill-comet {
          position: absolute; right: -3px; top: 50%; transform: translateY(-50%);
          width: 9px; height: 9px; border-radius: 50%;
          background: #fff; box-shadow: 0 0 12px 4px rgba(255,255,255,0.85), 0 0 22px 8px rgba(147,197,253,0.7);
          animation: kpbCometPulse 1.4s ease-in-out infinite;
        }
        @keyframes kpbCometPulse { 0%, 100% { opacity: 0.7; transform: translateY(-50%) scale(0.9); } 50% { opacity: 1; transform: translateY(-50%) scale(1.15); } }

        .kpb-marker {
          position: absolute; top: 50%; width: 15px; height: 15px; border-radius: 50%;
          transform: translate(-50%, -50%);
          background: #050810; border: 2px solid rgba(147,197,253,0.5);
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
        }
        .kpb-marker.reached {
          background: #93c5fd; border-color: #bfdbfe;
          box-shadow: 0 0 14px 3px rgba(147,197,253,0.8);
        }

        .kpb-roadmap {
          display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
          margin-top: 30px;
        }
        .kpb-cp-card {
          position: relative;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          width: 128px; padding: 16px 10px;
          border-radius: 16px;
          background: rgba(147,197,253,0.04); border: 1px solid rgba(147,197,253,0.14);
          text-align: center;
        }
        .kpb-cp-card.reached {
          background: rgba(147,197,253,0.1); border-color: rgba(147,197,253,0.35);
        }
        .kpb-cp-card.next {
          border-color: rgba(147,197,253,0.55);
          box-shadow: 0 0 24px rgba(96,165,250,0.25);
        }
        .kpb-cp-pulse {
          position: absolute; inset: -1px; border-radius: 16px;
          border: 1px solid rgba(147,197,253,0.6);
          animation: kpbCpPulse 2s ease-out infinite;
          pointer-events: none;
        }
        @keyframes kpbCpPulse { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.08); } }
        .kpb-cp-icon {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(147,197,253,0.1); border: 1px solid rgba(147,197,253,0.3);
          color: #93c5fd;
        }
        .kpb-cp-card.reached .kpb-cp-icon {
          background: linear-gradient(135deg, #3b82f6, #93c5fd); border-color: transparent; color: #051022;
        }
        .kpb-cp-num {
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: rgba(197,227,247,0.55);
        }
        .kpb-cp-label {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600;
          color: rgba(242,248,255,0.85); line-height: 1.3;
        }
        .kpb-cp-amount {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(197,227,247,0.5);
        }
        .kpb-cp-remaining {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.5px;
          color: #93c5fd; margin-top: 2px;
        }

        .kpb-cta-row {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          margin-top: 40px;
        }
        .kpb-donate-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase; text-decoration: none;
          color: var(--void, #03050f); background: var(--pastel1, #a8d4f0);
          padding: 16px 34px; border-radius: 999px;
          box-shadow: 0 0 0 0 rgba(168,212,240,0.6), 0 12px 32px rgba(96,165,250,0.3);
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }
        .kpb-donate-btn:hover {
          transform: translateY(-2px) scale(1.03);
          filter: brightness(1.08);
          box-shadow: 0 0 0 6px rgba(168,212,240,0.12), 0 16px 40px rgba(96,165,250,0.4);
        }
        .kpb-donate-arrow { transition: transform 0.25s ease; }
        .kpb-donate-btn:hover .kpb-donate-arrow { transform: translateX(3px); }
        .kpb-cta-sub {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px;
          color: rgba(197,227,247,0.45); text-align: center; max-width: 340px;
        }

        @media(max-width:640px){
          .kpb-section { padding: 64px 14px 84px; }
          .kpb-card { border-radius: 20px; }
          .kpb-cp-card { width: 100px; padding: 13px 8px; }
        }
      `}</style>
    </section>
  )
}
