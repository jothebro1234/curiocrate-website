// Static fallback — live data comes from the "Updates" Google Sheet tab via AppScript.
// Each item: { date, category, title, body, image }
// Categories: 'Chapters' | 'Events' | 'Milestones' | 'Partnerships'
// Date format: 'YYYY-MM-DD'
// image: direct URL to photo (leave '' for no photo)

export const news = [
  {
    date: '2026-06-10',
    category: 'Chapters',
    title: 'New Chapter Launches at Cerritos High School',
    body: 'CurioCrate is proud to welcome our newest chapter, bringing free hands-on science to students in the greater Los Angeles area.',
    image: '',
    link: '',
  },
  {
    date: '2026-05-18',
    category: 'Events',
    title: 'Spring Workshop Series Wraps Up',
    body: 'Our spring community workshop series concluded with record attendance, reaching students across four schools with kit-based experiments.',
    image: '',
    link: '',
  },
  {
    date: '2026-04-30',
    category: 'Milestones',
    title: 'CurioCrate Surpasses 500 Students Served',
    body: 'We\'ve officially reached over 500 students introduced to hands-on STEM education since our founding in 2023 — a milestone made possible by every volunteer and partner.',
    image: '',
    link: '',
  },
]
