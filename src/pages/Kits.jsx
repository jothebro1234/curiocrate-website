import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import KitCountdown from '../components/KitCountdown'

export default function Kits() {
  const [launchAtRaw, setLaunchAtRaw] = useState(null)
  const [introText, setIntroText] = useState(null)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) return
    fetch(`${url}?action=get_kit_status`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok || !data.status) return
        if (data.status.LaunchAt) setLaunchAtRaw(data.status.LaunchAt)
        if (data.status.LaunchAtText) setIntroText(data.status.LaunchAtText)
      })
      .catch(() => {})
  }, [])

  return (
    <PageTransition>
      <KitCountdown launchAtRaw={launchAtRaw} introText={introText} />
    </PageTransition>
  )
}
