// Shared helpers for "Updates" sheet rows, used by both the Home dispatch
// feed and the Newsletter page.
//
// Column B ("Category") can hold multiple comma-separated tags, e.g.
// "Chapters, Newsletter". The "newsletter" tag (case-insensitive) controls
// whether an update appears on the Newsletter page; any other tag controls
// whether/how it appears on the Discover dispatch feed. An update tagged
// only "Newsletter" is excluded from the dispatch feed entirely.

export function parseTags(raw) {
  return (raw || '').split(',').map(t => t.trim()).filter(Boolean)
}

function isNewsletterTag(tag) {
  return tag.toLowerCase() === 'newsletter'
}

export function filterForNewsletter(updates) {
  return updates.filter(u => parseTags(u.category).some(isNewsletterTag))
}

export function filterForDispatch(updates) {
  return updates.filter(u => parseTags(u.category).some(t => !isNewsletterTag(t)))
}

// The tag used for the category badge/color — first non-"newsletter" tag,
// falling back to whatever's there so untagged rows still render sensibly.
export function primaryCategory(raw) {
  const tags = parseTags(raw)
  return tags.find(t => !isNewsletterTag(t)) || tags[0] || ''
}

// Google Drive "share" links (.../file/d/<id>/view) don't render as <img src>
// directly — this rewrites them to a directly-embeddable URL. Non-Drive URLs
// pass through unchanged.
export function driveUrl(url) {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([^/?]+)/)
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  return url
}
