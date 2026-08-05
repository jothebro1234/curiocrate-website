import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'

// Auto-discovers every translation file under translations/pages/ at build time (each must
// export `en` and `es` objects — see translations/pages/common.js for the pattern) and
// merges them into two flat dictionaries. This means adding a new page's translations is
// just "add a new file here", never an edit to a shared import list — safe for multiple
// people/agents to add page translations in parallel without touching the same file.
const modules = import.meta.glob('./translations/pages/*.js', { eager: true })

function mergeDictionaries() {
  const en = {}
  const es = {}
  for (const mod of Object.values(modules)) {
    if (mod.en) Object.assign(en, mod.en)
    if (mod.es) Object.assign(es, mod.es)
  }
  return { en, es }
}

const { en: EN, es: ES } = mergeDictionaries()
const DICTIONARIES = { en: EN, es: ES }
const STORAGE_KEY = 'curiocrate_lang'

// Spanish-speaking country/locale codes (ISO 639-1 "es", any region variant) — used to
// auto-default the site to Spanish for visitors whose browser is set to one of these,
// since that's the standard, privacy-respecting proxy for "based in a Spanish-speaking
// country" available client-side (no IP-geolocation API/key involved).
function detectLanguage() {
  if (typeof navigator === 'undefined') return 'en'
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
  const hasSpanish = langs.some(l => l && l.toLowerCase().startsWith('es'))
  return hasSpanish ? 'es' : 'en'
}

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored
  return detectLanguage()
}

/* Resolves a dot-path key (e.g. "home.hero.title") against the active dictionary, falling
   back to the English dictionary, then to the raw key itself, so a missing translation
   never crashes or renders blank — worst case it silently shows English or the key. */
function resolve(dict, fallbackDict, path) {
  const parts = path.split('.')
  let node = dict
  for (const p of parts) { node = node?.[p]; if (node === undefined) break }
  if (typeof node === 'string') return node
  let fallbackNode = fallbackDict
  for (const p of parts) { fallbackNode = fallbackNode?.[p]; if (fallbackNode === undefined) break }
  if (typeof fallbackNode === 'string') return fallbackNode
  return path
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLanguage)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next) => setLangState(next === 'es' ? 'es' : 'en')

  const t = useMemo(() => {
    const dict = DICTIONARIES[lang] || EN
    return (path) => resolve(dict, EN, path)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
