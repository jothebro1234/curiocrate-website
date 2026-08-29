import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import KitCountdown from '../components/KitCountdown'
import KitProgressBar from '../components/KitProgressBar'
import { useLanguage } from '../i18n/useLanguage'

function InternshipBanner() {
  const { t } = useLanguage()
  return (
    <div className="kits-internship-banner" style={{
      position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)',
      zIndex: 40, display: 'flex', alignItems: 'center', gap: 18,
      padding: '14px 22px', borderRadius: 14, maxWidth: 'calc(100vw - 32px)',
      background: 'rgba(6,13,31,0.82)', backdropFilter: 'blur(18px)',
      border: '1px solid rgba(168,212,240,0.2)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px 2px rgba(74,222,128,0.8)', flexShrink: 0 }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#86efac', fontWeight: 700,
          }}>
            {t('kits.internshipBanner.badge')}
          </span>
        </div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'var(--cream)',
          opacity: 0.85, lineHeight: 1.4,
        }}>
          {t('kits.internshipBanner.text')}
        </span>
      </div>
      <Link
        to="/initiatives/kits"
        style={{
          flexShrink: 0,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '2px',
          textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700,
          color: 'var(--void)', background: 'var(--pastel1)',
          padding: '11px 20px', borderRadius: 8, whiteSpace: 'nowrap',
        }}
      >
        {t('kits.internshipBanner.cta')}
      </Link>
      <style>{`
        @media(max-width:640px){
          .kits-internship-banner { flex-direction: column !important; align-items: stretch !important; text-align: center; bottom: 16px !important; padding: 16px 18px !important; }
          .kits-internship-banner a { text-align: center; }
        }
      `}</style>
    </div>
  )
}

export default function Kits() {
  const [launchAtRaw, setLaunchAtRaw] = useState(null)
  const [introText, setIntroText] = useState(null)
  const [progress, setProgress] = useState({ goal: 0, current: 0 })
  const [checkpoints, setCheckpoints] = useState([])
  // Distinct from launchAtRaw being null "no date set yet" — this tracks whether the fetch
  // has resolved at all, so the page can show a loading state instead of briefly flashing
  // the frozen 00:00:00:00 placeholder before the real value (or lack of one) is known.
  // Google Apps Script backends are inherently slow to respond (cold-start latency on
  // Google's side, not something fixable here) — measured 20-45s cold, ~2-3s warm against
  // this spreadsheet, so this window can be substantial, not just "a second or two".
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setLoading(false); return }
    const controller = new AbortController()
    // Apps Script cold-starts against this spreadsheet are genuinely slow — measured 20-45s
    // for a cold hit, ~2-3s once warm — not "a second or two". The fetch itself has no
    // built-in timeout, so a slow-enough or genuinely stalled response used to leave the page
    // stuck on the loading orb forever, with the progress bar (which depends on the same
    // request) never appearing either. Bail out after 40s — long enough to cover a realistic
    // cold start — so both fall back to their "no data yet" states instead of hanging forever.
    const timeoutId = setTimeout(() => controller.abort(), 40000)
    fetch(`${url}?action=get_kit_status`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (!data.ok) return
        if (data.status) {
          if (data.status.LaunchAt) setLaunchAtRaw(data.status.LaunchAt)
          if (data.status.LaunchAtText) setIntroText(data.status.LaunchAtText)
          if (data.status.progressBarGoal) {
            setProgress({ goal: data.status.progressBarGoal, current: data.status.progressBarCurrent || 0 })
          }
        }
        if (Array.isArray(data.checkpoints)) setCheckpoints(data.checkpoints)
      })
      .catch(() => {})
      .finally(() => { clearTimeout(timeoutId); setLoading(false) })
    return () => { clearTimeout(timeoutId); controller.abort() }
  }, [])

  return (
    <PageTransition>
      <KitCountdown launchAtRaw={launchAtRaw} introText={introText} loading={loading} />
      <KitProgressBar goal={progress.goal} current={progress.current} checkpoints={checkpoints} />
      {!loading && <InternshipBanner />}
    </PageTransition>
  )
}
