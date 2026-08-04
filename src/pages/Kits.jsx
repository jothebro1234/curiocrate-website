import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import KitCountdown from '../components/KitCountdown'

export default function Kits() {
  const [launchAtRaw, setLaunchAtRaw] = useState(null)

  useEffect(() => {
    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) return
    fetch(`${url}?action=get_kit_status`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.status && data.status.LaunchAt) setLaunchAtRaw(data.status.LaunchAt)
      })
      .catch(() => {})
  }, [])

  return (
    <PageTransition>
      <KitCountdown launchAtRaw={launchAtRaw} />
    </PageTransition>
  )
}
