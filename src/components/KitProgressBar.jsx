import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/useLanguage'

function formatAmount(n) {
  return '$' + Math.round(n || 0).toLocaleString('en-US')
}

// Animates a number from 0 -> target once `trigger` flips true, easing out over `duration`ms.
// Drives the big headline dollar figure so it counts up in sync with the water filling in —
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

// A tiled, looping SVG ripple used three times (different tile widths/speeds/opacity/blur/
// direction) so the water's surface reads as irregular, layered chop rather than one uniform
// repeating scallop pattern. Gentle, wide curves (not tight semicircles) so it reads as liquid
// motion, not a decorative border.
const WAVE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='20' viewBox='0 0 140 20'%3E%3Cpath d='M0 10 C 17.5 6, 52.5 6, 70 10 C 87.5 14, 122.5 14, 140 10 V20 H0 Z' fill='white'/%3E%3C/svg%3E"

// Full-bleed funding progress bar for the Kits page, driven by the KitStatus sheet's
// "ProgressBar" row (goal/current) and any number of "Checkpoint" rows (see the KITSTATUS
// SHEET doc comment in apps-script/Code.gs). Deliberately renders nothing when there's no goal
// set, so an empty sheet never shows a misleading 0% bar. Styled as a thick 3D glass tube of
// water rather than a boxed card — no contained/bordered card, no CTA/trust chrome, just the
// number and the bar itself as the whole screen's centerpiece.
export default function KitProgressBar({ goal = 0, current = 0, checkpoints = [] }) {
  const { t } = useLanguage()
  // Animates in on mount rather than gating on scrolling into view — see CLAUDE.md for why:
  // the previous IntersectionObserver-based useInView could leave this permanently invisible
  // (confirmed live) if that observer's callback never fired. A plain mount-triggered flag has
  // no such single point of failure, and this section is always in view on load anyway.
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  const pct = goal > 0 ? Math.max(0, Math.min(100, (current / goal) * 100)) : 0
  const displayedCurrent = useCountUp(current, ready)

  const sortedCheckpoints = useMemo(
    () => [...checkpoints].sort((a, b) => a.amount - b.amount),
    [checkpoints]
  )
  const nextCheckpoint = sortedCheckpoints.find(cp => current < cp.amount)
  // The badge next to the dollar figure shows progress toward the NEXT checkpoint, not the
  // overall goal — a nearer target reads as a bigger, more encouraging percentage (goal-
  // gradient framing), and gives visitors a number that visibly moves faster. Falls back to
  // overall goal progress once every checkpoint is reached (or if none exist).
  const pctToNext = nextCheckpoint
    ? Math.max(0, Math.min(100, (current / nextCheckpoint.amount) * 100))
    : pct
  const funded = pct >= 100

  if (!goal || goal <= 0) return null

  return (
    <section className="kpb-section">
      <div className="kpb-grid" />
      <motion.div
        className="kpb-halo"
        animate={{ opacity: ready ? 0.55 : 0 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="kpb-stat-row"
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="kpb-eyebrow">{t('kits.progress.eyebrow', 'Funding Progress')}</div>
        <div className="kpb-stat-main">
          <span className="kpb-current">{formatAmount(displayedCurrent)}</span>
          <span className="kpb-pct-badge">{Math.round(pctToNext)}%</span>
        </div>
        <div className="kpb-stat-sub">
          {t('kits.progress.of', 'of')} <strong>{formatAmount(goal)}</strong> {t('kits.progress.goalSuffix', 'goal')}
          {!funded && <span className="kpb-stat-remaining"> · {formatAmount(goal - current)} {t('kits.progress.toGo', 'to go')}</span>}
        </div>
      </motion.div>

      <div className="kpb-tube-wrap">
        <div className="kpb-tube">
          <motion.div
            className="kpb-tube-fill"
            initial={{ width: 0 }}
            animate={{ width: ready ? `${pct}%` : 0 }}
            // A spring instead of a plain easing curve — the fill overshoots its target width by
            // a few percent and settles back, like water surging in and sloshing to rest, rather
            // than gliding straight to a stop.
            transition={{ type: 'spring', stiffness: 55, damping: 11, mass: 1.1 }}
          >
            <div className="kpb-water-wave">
              <span className="kpb-wave w1" />
              <span className="kpb-wave w2" />
              <span className="kpb-wave w3" />
            </div>
            <span className="kpb-tube-glint" />
          </motion.div>
        </div>

        <div className="kpb-timeline">
          {sortedCheckpoints.map((cp, i) => {
            const cpPct = Math.max(0, Math.min(100, (cp.amount / goal) * 100))
            const reached = current >= cp.amount
            const above = i % 2 === 0
            // Label horizontal alignment: centered by default, but a checkpoint within ~6% of
            // either edge switches to edge-anchored (left-/right-aligned instead of centered) —
            // a pure `transform` choice (translateX relative to the label's OWN width). Dot and
            // label below are independent siblings positioned directly against `.kpb-timeline`
            // (a real-sized box matching the tube) rather than nested under one shared "marker"
            // wrapper — confirmed live that a shared absolutely-positioned wrapper with only
            // absolutely-positioned children collapses to a 0×0 box, so any percentage `left`/
            // `top`/`bottom` on a child of it silently resolves against that zero size and does
            // nothing: an earlier version had both the horizontal edge-clamp AND the "float
            // above/below the tube with a gap" vertical spacing quietly no-op this way (checkpoints
            // rendered centered on the true, unclamped edge — clipped off-screen — and the tick
            // connecting a label to its dot visually ran a good ways into the tube's body instead
            // of stopping cleanly above/below it).
            const align = cpPct <= 6 ? 'start' : cpPct >= 94 ? 'end' : 'center'
            // A checkpoint exactly at (or within a hair of) 0% or 100% would otherwise clip half
            // its dot off-screen against the tube's own literal edge — nudged in by at most 1.5%,
            // imperceptible anywhere but the extreme ends.
            const markerPct = Math.max(1.5, Math.min(98.5, cpPct))
            return (
              <div key={i}>
                <div className={`kpb-tl-line ${reached ? 'reached' : ''}`} style={{ left: `${markerPct}%` }} />
                <motion.div
                  className={`kpb-tl-label kpb-tl-align-${align} ${above ? 'kpb-tl-label-above' : 'kpb-tl-label-below'}`}
                  style={{ left: `${markerPct}%` }}
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.08 }}
                >
                  {above ? (
                    <>
                      <span className="kpb-tl-name">{cp.label || formatAmount(cp.amount)}</span>
                      <span className="kpb-tl-amt">{formatAmount(cp.amount)}</span>
                      <span className="kpb-tl-tick" />
                    </>
                  ) : (
                    <>
                      <span className="kpb-tl-tick" />
                      <span className="kpb-tl-name">{cp.label || formatAmount(cp.amount)}</span>
                      <span className="kpb-tl-amt">{formatAmount(cp.amount)}</span>
                    </>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .kpb-section {
          position: relative; overflow: hidden;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at 50% 0%, #0b1220 0%, #050810 55%, #020306 100%);
          padding: 60px 0;
        }
        .kpb-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(148,197,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,197,255,0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
          mask-image: radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%);
        }
        .kpb-halo {
          position: absolute; top: 10%; left: 50%; transform: translateX(-50%);
          width: min(95vw, 1300px); height: min(95vw, 1300px);
          border-radius: 50%; pointer-events: none;
          background: conic-gradient(from 0deg, rgba(96,165,250,0.26), transparent 25%, rgba(129,140,248,0.2) 55%, transparent 85%);
          filter: blur(110px);
          animation: kpbHaloSpin 60s linear infinite;
        }
        @keyframes kpbHaloSpin { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }

        .kpb-stat-row { position: relative; z-index: 1; text-align: center; padding: 0 20px; margin-bottom: clamp(56px, 9vw, 110px); }
        .kpb-eyebrow {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 4px;
          text-transform: uppercase; color: rgba(147,197,253,0.6); margin-bottom: 14px;
        }
        .kpb-stat-main {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          font-family: 'JetBrains Mono', monospace;
        }
        .kpb-current {
          font-size: clamp(44px, 9vw, 84px); font-weight: 700; color: #f2f8ff;
          text-shadow: 0 0 30px rgba(147,197,253,0.85); letter-spacing: -1px;
          font-variant-numeric: tabular-nums;
        }
        .kpb-pct-badge {
          font-size: clamp(13px, 1.6vw, 16px); font-weight: 700; letter-spacing: 0.5px;
          color: #052014; background: linear-gradient(135deg, #93c5fd, #bfdbfe);
          padding: 6px 14px; border-radius: 999px;
          box-shadow: 0 0 18px 3px rgba(147,197,253,0.5);
        }
        .kpb-stat-sub {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(13px, 1.6vw, 15px);
          color: rgba(197,227,247,0.55); margin-top: 12px;
        }
        .kpb-stat-sub strong { color: rgba(242,248,255,0.85); font-weight: 600; }
        .kpb-stat-remaining { color: rgba(147,197,253,0.6); }

        .kpb-tube-wrap { position: relative; z-index: 1; width: 100%; }
        .kpb-tube {
          position: relative; width: 100%;
          height: clamp(64px, 9vw, 132px);
          border-radius: clamp(32px, 4.5vw, 66px);
          background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 45%, rgba(0,0,0,0.28) 100%);
          box-shadow:
            inset 0 3px 10px rgba(255,255,255,0.10),
            inset 0 -12px 28px rgba(0,0,0,0.5),
            0 30px 90px rgba(0,0,0,0.55);
          border-top: 1px solid rgba(255,255,255,0.16);
          overflow: hidden;
        }
        .kpb-tube-fill {
          position: absolute; inset: 0; right: auto; height: 100%; max-width: 100%;
          background: linear-gradient(180deg, #cfe7ff 0%, #7cb2fb 16%, #3b82f6 55%, #1a45c9 100%);
          box-shadow: inset 0 8px 18px rgba(255,255,255,0.4), inset 0 -14px 26px rgba(0,10,40,0.4);
          overflow: hidden;
        }
        /* Diagonal glass shine sweeping through periodically — same technique as the earlier
           flat-bar design's shimmer, brought back here since the water-tube redesign lost it. */
        .kpb-tube-fill::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.5) 47%, rgba(255,255,255,0.5) 53%, transparent 70%);
          background-size: 240% 100%;
          animation: kpbShimmer 3.4s ease-in-out infinite;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        @keyframes kpbShimmer { 0% { background-position: 240% 0; } 100% { background-position: -240% 0; } }

        /* Water surface: an outer wrapper gently rocks (rotate+scale) while three independently
           looping ripple layers (different tile width/speed/blur/blend) scroll and bob inside it
           — layered, uneven motion reads as restless liquid chop rather than one repeating
           scalloped border. */
        .kpb-water-wave {
          position: absolute; top: -10px; left: 0; width: 240%; height: 22px;
          transform-origin: 50% 100%;
          animation: kpbSurfaceRock 4.5s ease-in-out infinite;
        }
        @keyframes kpbSurfaceRock {
          0%, 100% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(0.5deg) scaleY(1.05); }
        }
        .kpb-wave {
          position: absolute; inset: 0; width: 100%; height: 100%;
          background-image: url("${WAVE_SVG}");
          background-repeat: repeat-x;
          mix-blend-mode: soft-light;
        }
        .kpb-wave.w1 { background-size: 140px 22px; opacity: 0.3; filter: blur(0.5px); animation: kpbWave1 2.8s linear infinite; }
        .kpb-wave.w2 { background-size: 210px 22px; top: 5px; opacity: 0.16; filter: blur(0.8px); animation: kpbWave2 4.3s linear infinite; }
        .kpb-wave.w3 { background-size: 95px 22px; top: 2px; opacity: 0.12; filter: blur(1px); animation: kpbWave3 1.9s linear infinite; }
        @keyframes kpbWave1 {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-35px, -2.5px); }
          50%  { transform: translate(-70px, 0); }
          75%  { transform: translate(-105px, 2.5px); }
          100% { transform: translate(-140px, 0); }
        }
        @keyframes kpbWave2 {
          0%   { transform: translate(0, 0); }
          30%  { transform: translate(70px, 2px); }
          60%  { transform: translate(140px, -1.5px); }
          100% { transform: translate(210px, 0); }
        }
        @keyframes kpbWave3 {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(-47.5px, -1.5px); }
          100% { transform: translate(-95px, 0); }
        }
        .kpb-tube-glint {
          position: absolute; right: 0; top: 6%; bottom: 6%; width: 3px;
          background: rgba(255,255,255,0.85);
          box-shadow: 0 0 16px 4px rgba(255,255,255,0.7), 0 0 30px 10px rgba(147,197,253,0.6);
          animation: kpbGlintPulse 1.6s ease-in-out infinite;
        }
        @keyframes kpbGlintPulse { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }

        .kpb-timeline { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
        .kpb-tl-line {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 3px; height: 70%; border-radius: 3px;
          background: rgba(255,255,255,0.4);
          box-shadow: 0 0 0 0 transparent;
          transition: background 0.4s, box-shadow 0.4s;
        }
        .kpb-tl-line.reached {
          background: linear-gradient(180deg, #ffffff, #bfdbfe);
          box-shadow: 0 0 14px 3px rgba(147,197,253,0.85);
        }
        .kpb-tl-label {
          position: absolute; left: 0;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          white-space: nowrap;
        }
        .kpb-tl-align-center { transform: translateX(-50%); align-items: center; }
        .kpb-tl-align-start { transform: translateX(0); align-items: flex-start; }
        .kpb-tl-align-end { transform: translateX(-100%); align-items: flex-end; }
        .kpb-tl-label-above { bottom: 100%; padding-bottom: clamp(14px, 2vw, 22px); }
        .kpb-tl-label-below { top: 100%; padding-top: clamp(14px, 2vw, 22px); }
        .kpb-tl-tick { width: 1px; height: clamp(10px, 1.6vw, 18px); background: rgba(255,255,255,0.3); }
        .kpb-tl-name {
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
          font-size: clamp(10px, 1.3vw, 13px); color: rgba(242,248,255,0.88);
        }
        .kpb-tl-amt {
          font-family: 'JetBrains Mono', monospace; font-size: clamp(9px, 1vw, 11px);
          color: rgba(197,227,247,0.5);
        }

        @media(max-width:640px){
          .kpb-section { padding: 44px 0; }
          .kpb-tl-name, .kpb-tl-amt { white-space: normal; max-width: 84px; text-align: center; }
          /* Checkpoint names readily wrap to 2 lines at this width, needing more vertical
             clearance above the tube than the desktop gap accounts for — confirmed live this
             was colliding with the "of $X goal" stat line above it without this. */
          .kpb-stat-row { margin-bottom: 128px; }
          .kpb-tl-label-above { padding-bottom: 20px; }
        }
      `}</style>
    </section>
  )
}
