// ─── GALLERY DATA ──────────────────────────────────────────────────────────────
//
// HOW TO ADD PHOTOS (no code changes needed):
//   1. Create folders:  src/assets/gallery/2026/   src/assets/gallery/2025/  etc.
//   2. Drop your image files (jpg, jpeg, png, webp) into the right year folder
//   3. Commit and push — they appear in the gallery automatically
//
// To pin a specific cover photo for a year, add its filename to YEAR_COVER below.
// Year labels / era names are set in YEAR_META below.
//
// ─── YEAR METADATA ─────────────────────────────────────────────────────────────
const YEAR_META = {
  2026: { era: 'Chapter Expansion', color: '#e8c96e', glow: 'rgba(232,201,110,0.5)' },
  2025: { era: 'Present Day',       color: '#a8d4f0', glow: 'rgba(168,212,240,0.5)' },
  2024: { era: 'The Mission Grows', color: '#c5b4f8', glow: 'rgba(197,180,248,0.5)' },
  2023: { era: 'The Beginning',     color: '#a8e8c8', glow: 'rgba(168,232,200,0.5)' },
}

// ─── COVER OVERRIDES ───────────────────────────────────────────────────────────
// Pin a specific filename as the hero/cover for a year.
const YEAR_COVER = {
  2026: 'DSC06930.JPG',
}

// ─── AUTO-DISCOVERED PHOTOS ────────────────────────────────────────────────────
// Vite scans src/assets/gallery/YEAR/ at build time — no manual listing needed.
const imageModules = import.meta.glob(
  '../assets/gallery/**/*.{jpg,jpeg,png,JPG,JPEG,PNG,webp,WEBP}',
  { eager: true }
)

const autoByYear = {}
for (const [path, mod] of Object.entries(imageModules)) {
  const match = path.match(/\/(\d{4})\//)
  if (!match) continue
  const year = parseInt(match[1])
  if (!autoByYear[year]) autoByYear[year] = []
  const filename = path.split('/').pop()
  autoByYear[year].push({ src: mod.default, caption: '', _filename: filename })
}

// ─── SEED PHOTOS (existing public/images references) ──────────────────────────
// Merged with auto-discovered so the gallery is never empty for these years.
const SEED = {
  2026: [{ src: '/images/volunteeringimage.jpg', caption: 'Chapters expanding across the country' }],
  2025: [{ src: '/images/IMG_3920.jpg', caption: 'Kit distribution event' }, { src: '/images/volunteeringimage.jpg', caption: 'Volunteer workshop' }],
  2023: [], // Keep year visible; add photos to src/assets/gallery/2023/ when ready
}

// ─── BUILD CHRONICLE ──────────────────────────────────────────────────────────
const allYears = new Set([...Object.keys(autoByYear).map(Number), ...Object.keys(SEED).map(Number)])

export const chronicle = [...allYears]
  .sort((a, b) => b - a)
  .map(year => {
    const auto = autoByYear[year] || []
    const seed = SEED[year] || []
    const photos = [...auto, ...seed]
    const coverFile = YEAR_COVER[year]
    const coverPhoto = coverFile ? photos.find(p => p._filename === coverFile) : null
    return {
      year,
      era:    YEAR_META[year]?.era   || String(year),
      color:  YEAR_META[year]?.color || '#a8d4f0',
      glow:   YEAR_META[year]?.glow  || 'rgba(168,212,240,0.5)',
      cover:  coverPhoto?.src || photos[0]?.src || '',
      photos,
    }
  })

// ─── FEATURED (hero grid — manually curated, max 3) ───────────────────────────
export const featured = [
  { src: '/images/IMG_3920.jpg',          caption: 'Kit distribution, sparking curiosity one child at a time', wide: true },
  { src: '/images/volunteeringimage.jpg', caption: 'Volunteers making science accessible' },
  { src: '/images/P1080258.JPG',          caption: 'Science is for every curious mind' },
]
