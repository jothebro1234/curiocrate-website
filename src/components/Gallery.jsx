// Replace the src values with your real event photos
// You can host images in the /public folder or use an image CDN like Cloudflare Images
const photos = [
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    alt: 'Kids doing science experiments at a community event',
    span: 'col',
  },
  {
    src: 'https://images.unsplash.com/photo-1532094349884-543559fee47e?w=600&q=80',
    alt: 'Student exploring chemistry kit',
    span: 'col',
  },
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    alt: 'Group STEM workshop',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    alt: 'Volunteer helping a student',
    span: 'col',
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    alt: 'Excited kids at science fair',
    span: 'col',
  },
  {
    src: 'https://images.unsplash.com/photo-1565843708714-52ecf69ab81f?w=600&q=80',
    alt: 'Building robots workshop',
    span: 'col',
  },
]

export default function Gallery() {
  return (
    <section
      id="gallery"
      style={{
        padding: '100px 24px',
        background: '#fff',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '2px',
              color: '#10B981',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Event Gallery
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-1px',
              margin: '0 0 16px',
            }}
          >
            Science in action.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 17,
              color: '#6b7280',
              lineHeight: 1.6,
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            A look at the amazing moments from our workshops, events, and kit
            deliveries across our communities.
          </p>
        </div>

        {/* Photo grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: '260px',
            gap: 16,
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                gridColumn: photo.span === 'wide' ? 'span 2' : 'span 1',
                borderRadius: 18,
                overflow: 'hidden',
                position: 'relative',
                background: '#f3f4f6',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'
                e.currentTarget.querySelector('.overlay').style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)'
                e.currentTarget.querySelector('.overlay').style.opacity = '0'
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  display: 'block',
                }}
              />
              <div
                className="overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(17,24,39,0.7) 0%, transparent 60%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '20px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#fff',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {photo.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single column note */}
        <style>{`
          @media (max-width: 640px) {
            #gallery-grid {
              grid-template-columns: 1fr !important;
            }
            #gallery-grid > div {
              grid-column: span 1 !important;
            }
          }
          @media (max-width: 900px) {
            #gallery-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
