// ─── GALLERY DATA ─────────────────────────────────────────────────────────────
// HOW TO ADD PHOTOS:
//   1. Drop the image file into public/images/
//   2. Add an entry to the correct year's `photos` array below
//      { src: '/images/YOUR_FILE.jpg', caption: 'Your caption here' }
//   3. To feature a photo in the hero grid, add it to `featured` (max 3)
//   4. To set a year cover image, update `cover` for that year

export const featured = [
  { src: '/images/IMG_3920.jpg', caption: 'Kit distribution, sparking curiosity one child at a time', wide: true },
  { src: '/images/volunteeringimage.jpg', caption: 'Volunteers making science accessible' },
  { src: '/images/P1080258.JPG', caption: 'Science is for every curious mind' },
]

export const chronicle = [
  {
    year: 2026,
    era: 'Chapter Expansion',
    color: '#e8c96e',
    glow: 'rgba(232,201,110,0.5)',
    cover: '/images/volunteeringimage.jpg',
    photos: [
      { src: '/images/volunteeringimage.jpg', caption: 'Chapters expanding across the country' },
    ],
  },
  {
    year: 2025,
    era: 'Present Day',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.5)',
    cover: '/images/IMG_3920.jpg',
    photos: [
      { src: '/images/IMG_3920.jpg', caption: 'Kit distribution event' },
      { src: '/images/volunteeringimage.jpg', caption: 'Volunteer workshop' },
    ],
  },
  {
    year: 2024,
    era: 'The Mission Grows',
    color: '#c5b4f8',
    glow: 'rgba(197,180,248,0.5)',
    cover: '/images/P1080258.JPG',
    photos: [
      { src: '/images/IMG_9240.jpg', caption: 'Community outreach' },
      { src: '/images/P1080258.JPG', caption: 'Science fair' },
      { src: '/images/P1080212.JPG', caption: 'Workshop day' },
    ],
  },
  {
    year: 2023,
    era: 'The Beginning',
    color: '#a8e8c8',
    glow: 'rgba(168,232,200,0.5)',
    cover: '/images/whatiscuriocrate.jpg',
    photos: [
      { src: '/images/whatiscuriocrate.jpg', caption: 'The founding of CurioCrate' },
    ],
  },
]
