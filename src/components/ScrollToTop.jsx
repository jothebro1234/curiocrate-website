import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])
  return null
}
