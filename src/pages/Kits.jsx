import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import KitCountdown from '../components/KitCountdown'

export default function Kits() {
  const [launchAtRaw, setLaunchAtRaw] = useState(null)
  const [introText, setIntroText] = useState(null)
  // Distinct from launchAtRaw being null "no date set yet" — this tracks whether the fetch
  // has resolved at all, so the page can show a loading state instead of briefly flashing
  // the frozen 00:00:00:00 placeholder before the real value (or lack of one) is known.
  // Google Apps Script backends are inherently slow to respond (cold-start latency on
  // Google's side, not something fixable here), so this window can be a full second or two.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) { setLoading(false); return }
    fetch(`${url}?action=get_kit_status`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok || !data.status) return
        if (data.status.LaunchAt) setLaunchAtRaw(data.status.LaunchAt)
        if (data.status.LaunchAtText) setIntroText(data.status.LaunchAtText)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <KitCountdown launchAtRaw={launchAtRaw} introText={introText} loading={loading} />
    </PageTransition>
  )
}
