import { useLanguage } from '../i18n/useLanguage'

// Clips long body text to a fixed number of lines, fading it to transparent at the bottom
// instead of an abrupt cutoff, with a "Read more" trigger to view the full text elsewhere
// (e.g. a modal). Renders the text in full, untouched, if it's short enough to fit.
export default function FadingText({ text, maxLines = 4, style = {}, fadeColor, onReadMore, moreLabel, moreStyle = {}, suffix = null }) {
  const { t } = useLanguage()
  if (!text) return null
  const resolvedMoreLabel = moreLabel ?? t('common.readMore')

  const fontSize = typeof style.fontSize === 'number' ? style.fontSize : 14
  const lineHeight = typeof style.lineHeight === 'number' ? style.lineHeight : 1.6
  const isLong = text.length > maxLines * 68

  return (
    <div>
      <div style={{
        position: 'relative',
        maxHeight: isLong ? `${fontSize * lineHeight * maxLines}px` : 'none',
        overflow: isLong ? 'hidden' : 'visible',
      }}>
        <p style={style}>{text}{!isLong && suffix}</p>
        {isLong && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: fontSize * lineHeight * 1.8,
            background: `linear-gradient(to bottom, transparent, ${fadeColor})`,
            pointerEvents: 'none',
          }} />
        )}
      </div>
      {isLong && (
        <button
          onClick={onReadMore}
          style={{
            marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--pastel1)', opacity: 0.85,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'opacity 0.2s',
            ...moreStyle,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.85' }}
        >{resolvedMoreLabel} →</button>
      )}
    </div>
  )
}
