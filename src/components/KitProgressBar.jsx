import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '../i18n/useLanguage'

function formatAmount(n) {
  return '$' + Math.round(n || 0).toLocaleString('en-US')
}

// Funding progress bar for the Kits page, driven by the KitStatus sheet's "ProgressBar" row
// (goal/current) and any number of "Checkpoint" rows (see the KITSTATUS SHEET doc comment in
// apps-script/Code.gs). Deliberately renders nothing when there's no goal set, so an empty
// sheet never shows a misleading 0% bar.
export default function KitProgressBar({ goal = 0, current = 0, checkpoints = [] }) {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  // once:true so the fill animates from 0 -> current each time the page is loaded and this
  // section scrolls into view, but doesn't re-run on every subsequent scroll past it.
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })

  if (!goal || goal <= 0) return null

  const pct = Math.max(0, Math.min(100, (current / goal) * 100))

  return (
    <section ref={sectionRef} className="kpb-section">
      <div className="kpb-inner">
        <div className="kpb-header">
          <div className="kpb-eyebrow">{t('kits.progress.eyebrow', 'Funding Progress')}</div>
          <h2 className="kpb-title">{t('kits.progress.title', 'Help Us Fund Our First Kit')}</h2>
          <div className="kpb-amounts">
            <span className="kpb-current">{formatAmount(current)}</span>
            <span className="kpb-of">{t('kits.progress.of', 'of')}</span>
            <span className="kpb-goal">{formatAmount(goal)} {t('kits.progress.goalSuffix', 'goal')}</span>
          </div>
        </div>

        <div className="kpb-track">
          <motion.div
            className="kpb-fill"
            initial={{ width: 0 }}
            animate={{ width: inView ? `${pct}%` : 0 }}
            transition={{ duration: 1.7, ease: [0.4, 0, 0.2, 1] }}
          />
          {checkpoints.map((cp, i) => {
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

        {checkpoints.length > 0 && (
          <div className="kpb-legend">
            {checkpoints.map((cp, i) => {
              const reached = current >= cp.amount
              return (
                <motion.div
                  key={i}
                  className={`kpb-chip ${reached ? 'reached' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                >
                  <span className="kpb-chip-dot" />
                  <span className="kpb-chip-label">{cp.label || formatAmount(cp.amount)}</span>
                  <span className="kpb-chip-amount">{formatAmount(cp.amount)}</span>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .kpb-section {
          position: relative;
          background: radial-gradient(ellipse at 50% 0%, #0b1220 0%, #050810 55%, #020306 100%);
          padding: 96px 24px 110px;
        }
        .kpb-inner { max-width: 760px; margin: 0 auto; }
        .kpb-header { text-align: center; margin-bottom: 44px; }
        .kpb-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(147,197,253,0.6); margin-bottom: 14px;
        }
        .kpb-title {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(24px, 4vw, 38px); color: rgba(242,248,255,0.92);
          margin: 0 0 20px; text-shadow: 0 0 30px rgba(96,165,250,0.35);
        }
        .kpb-amounts {
          display: flex; align-items: baseline; justify-content: center; gap: 10px; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace;
        }
        .kpb-current {
          font-size: clamp(28px, 5vw, 42px); font-weight: 700; color: #f2f8ff;
          text-shadow: 0 0 22px rgba(147,197,253,0.85);
        }
        .kpb-of {
          font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(197,227,247,0.4);
        }
        .kpb-goal {
          font-size: clamp(16px, 2.4vw, 20px); color: rgba(197,227,247,0.65);
        }

        .kpb-track {
          position: relative; height: 12px; border-radius: 999px;
          background: rgba(147,197,253,0.12);
          border: 1px solid rgba(147,197,253,0.18);
          overflow: visible;
        }
        .kpb-fill {
          position: absolute; inset: 0; border-radius: 999px; max-width: 100%;
          background: linear-gradient(90deg, #3b82f6, #93c5fd);
          box-shadow: 0 0 18px 2px rgba(96,165,250,0.55);
        }
        .kpb-marker {
          position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%;
          transform: translate(-50%, -50%);
          background: #050810; border: 2px solid rgba(147,197,253,0.55);
          cursor: default;
        }
        .kpb-marker.reached {
          background: #93c5fd; border-color: #bfdbfe;
          box-shadow: 0 0 14px 3px rgba(147,197,253,0.8);
        }

        .kpb-legend {
          display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 34px;
        }
        .kpb-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px; border-radius: 999px;
          background: rgba(147,197,253,0.06); border: 1px solid rgba(147,197,253,0.16);
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px;
          color: rgba(197,227,247,0.55);
        }
        .kpb-chip.reached {
          background: rgba(147,197,253,0.14); border-color: rgba(147,197,253,0.4);
          color: rgba(242,248,255,0.9);
        }
        .kpb-chip-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
          background: rgba(147,197,253,0.3);
        }
        .kpb-chip.reached .kpb-chip-dot {
          background: #93c5fd; box-shadow: 0 0 8px 2px rgba(147,197,253,0.8);
        }
        .kpb-chip-amount {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          opacity: 0.7; white-space: nowrap;
        }

        @media(max-width:640px){
          .kpb-section { padding: 72px 18px 88px; }
          .kpb-amounts { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </section>
  )
}
