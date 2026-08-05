import { useLanguage } from '../i18n/useLanguage'

export default function LanguageSwitcher({ size = 'md' }) {
  const { lang, setLang } = useLanguage()
  const compact = size === 'sm'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      border: '1px solid rgba(168,212,240,0.25)', borderRadius: 20,
      padding: 2, gap: 2,
    }}>
      {['en', 'es'].map(code => {
        const active = lang === code
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={code === 'en' ? 'English' : 'Español'}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: compact ? 10 : 11, letterSpacing: '1.5px',
              padding: compact ? '4px 9px' : '6px 12px', borderRadius: 18,
              border: 'none', cursor: 'pointer',
              background: active ? 'rgba(168,212,240,0.16)' : 'transparent',
              color: active ? 'var(--cream)' : 'var(--muted)',
              transition: 'all 0.2s ease',
            }}
          >{code.toUpperCase()}</button>
        )
      })}
    </div>
  )
}
