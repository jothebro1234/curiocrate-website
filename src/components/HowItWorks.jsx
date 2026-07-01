const steps = [
  {
    step: '01',
    emoji: '🛒',
    title: 'Choose a Kit',
    desc: 'Browse our curated STEM kits from chemistry to robotics and pick the one that sparks your curiosity.',
  },
  {
    step: '02',
    emoji: '📬',
    title: 'We Ship It',
    desc: 'Your kit ships directly to your door, packed with all the materials and a step-by-step activity guide.',
  },
  {
    step: '03',
    emoji: '🚀',
    title: 'Explore & Discover',
    desc: 'Dive in, run experiments, and share your discoveries. Science is best when experienced firsthand.',
  },
]

export default function HowItWorks() {
  return (
    <section
      style={{
        padding: '100px 24px',
        background: '#fff',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '2px',
              color: '#F59E0B',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            How It Works
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
            Simple as 1, 2, 3.
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
            Getting started with CurioCrate is easy. Here's what happens when
            you order a kit.
          </p>
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            position: 'relative',
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.step}
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '40px 32px',
              }}
            >
              {/* Step connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 52,
                    right: '-16px',
                    width: 32,
                    height: 2,
                    background: 'linear-gradient(90deg, #E0E7FF, transparent)',
                    zIndex: 0,
                  }}
                  className="step-connector"
                />
              )}

              {/* Step number badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  border: '3px solid #6366F1',
                  marginBottom: 24,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
              </div>

              {/* Step label */}
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: '2px',
                  color: '#6366F1',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                Step {s.step}
              </div>

              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: '#111827',
                  margin: '0 0 12px',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: '#6b7280',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <a
            href="#shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
              textDecoration: 'none',
              padding: '16px 40px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.35)'
            }}
          >
            Browse All Kits
          </a>
        </div>
      </div>
    </section>
  )
}
