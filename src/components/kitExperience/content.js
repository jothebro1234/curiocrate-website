// Scroll-timeline data for the "Example Kit" cinematic unboxing experience.
// Every value is a fraction (0..1) of the total pinned scroll distance —
// the whole scene is a pure function of one progress number so it scrubs
// perfectly in both directions.

export const TOTAL_VH = 750

export const CH = {
  arrival1:  [0.000, 0.035],
  arrival2:  [0.035, 0.075],
  orbit:     [0.075, 0.26],
  spotlight: [0.26,  0.38],
  packaging: [0.38,  0.545],
  opening:   [0.545, 0.625],
  comp1:     [0.625, 0.715],
  comp2:     [0.715, 0.805],
  comp3:     [0.805, 0.89],
  ending:    [0.89,  1.000],
}

export const CHAPTER_KEYS = Object.keys(CH)

// The single "best" resting frame within each chapter — where the camera/box/
// component composition reads cleanest. One scroll nudge snaps to the nearest
// (directionally next) of these, so scrolling feels like advancing slides.
export const BEST_P = {
  arrival1:  0.02,
  arrival2:  0.055,
  orbit:     0.17,
  spotlight: 0.36,
  packaging: 0.47,
  opening:   0.615,
  comp1:     0.67,
  comp2:     0.76,
  comp3:     0.8475,
  ending:    1,
}

export const SNAP_POINTS = CHAPTER_KEYS.map((k) => BEST_P[k])

export function chapterIndexForProgress(p) {
  for (let i = 0; i < CHAPTER_KEYS.length; i++) {
    const [, end] = CH[CHAPTER_KEYS[i]]
    if (p < end || i === CHAPTER_KEYS.length - 1) return i
  }
  return CHAPTER_KEYS.length - 1
}

export const CAPTIONS = {
  arrival1:  { eyebrow: '◈  THE LAB  ◈', line: 'Designed for creators.' },
  arrival2:  { line: 'Scroll to unpack.', hint: true },
  orbit:     { eyebrow: 'Chapter 01 — Reveal', line: 'Every surface, considered.' },
  spotlight: { eyebrow: 'Crafted by CurioCrate', line: 'Every kit starts as an idea — built by students, for students.', badge: 'LIMITED FIRST RUN' },
  packaging: { eyebrow: 'Chapter 02 — Details', line: "The details that don't show up in photos." },
  opening:   { eyebrow: 'Chapter 03 — Opening', line: '' },
  comp1:     { eyebrow: 'Component 01', line: 'Sensor Module' },
  comp2:     { eyebrow: 'Component 02', line: 'Build Plate' },
  comp3:     { eyebrow: 'Component 03', line: 'Activity Cards' },
  ending:    { line: 'Ready to Create.', cta: true },
}

// World-space anchors for the packaging HUD callouts (chapter: packaging)
export const PACKAGING_CALLOUTS = [
  { key: 'matte', title: 'Premium Matte Finish',   desc: 'Soft-touch coating that resists fingerprints and wear.', position: [-1.55, 0.55, 0.95],  t: [0.395, 0.46] },
  { key: 'logo',  title: 'Embossed Logo',          desc: 'Precision-debossed mark — no ink, no fading.',           position: [0.05, 0.95, 1.2],     t: [0.435, 0.495] },
  { key: 'seal',  title: 'Magnetic Closure',       desc: 'A quiet click keeps everything sealed in transit.',      position: [1.65, 0.05, 0.55],    t: [0.47, 0.525] },
  { key: 'eco',   title: 'Recyclable Materials',   desc: 'Fully recyclable packaging, kind to the planet.',       position: [-1.35, -0.55, -0.85], t: [0.5, 0.545] },
]

// The three components that rise out of the kit, in order.
export const COMPONENTS = [
  {
    key: 'sensor',
    name: 'Sensor Module',
    chapter: 'comp1',
    color: '#a8d4f0',
    callouts: [
      { title: 'Sensor Module', desc: 'Ultra-precise calibration for maximum accuracy.', side: 'left',  t: [0.66, 0.70] },
      { title: 'Custom Connector', desc: 'Designed exclusively for this kit.',            side: 'right', t: [0.685, 0.71] },
    ],
  },
  {
    key: 'plate',
    name: 'Build Plate',
    chapter: 'comp2',
    color: '#dfe7ee',
    callouts: [
      { title: 'Laser Cut', desc: 'Precision manufactured for a perfect fit.',        side: 'left',  t: [0.75, 0.79] },
      { title: 'Anodized Finish', desc: 'Scratch-resistant coating, built to last.',   side: 'right', t: [0.775, 0.80] },
    ],
  },
  {
    key: 'cards',
    name: 'Activity Cards',
    chapter: 'comp3',
    color: '#f0c070',
    callouts: [
      { title: 'Guided Activities', desc: 'Step-by-step cards that turn curiosity into discovery.', side: 'left',  t: [0.835, 0.875] },
      { title: 'Foil-Stamped Edges', desc: 'Collector-grade print finish.',                          side: 'right', t: [0.86, 0.885] },
    ],
  },
]

export const ORBIT_LABELS = [
  { label: 'Aluminum shell.',    t: [0.09, 0.14] },
  { label: 'Soft-touch finish.', t: [0.15, 0.20] },
  { label: 'Precision seams.',   t: [0.21, 0.25] },
]

export const CTA_LINKS = [
  { label: 'Explore the Collection', to: '/gallery' },
  { label: 'Customize Your Kit',     to: '/initiatives/kits' },
  { label: 'Order Yours',            to: '/contact' },
]
