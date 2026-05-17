import { Heart, Target, Users } from 'lucide-react'

const pillars = [
  {
    icon: <Heart size={24} color="#EF4444" />,
    bg: '#FEF2F2',
    title: 'Equity in STEM',
    desc: 'We believe every child deserves access to quality science education, regardless of zip code or income level.',
  },
  {
    icon: <Target size={24} color="#6366F1" />,
    bg: '#EEF2FF',
    title: 'Hands-On Learning',
    desc: 'Our kits are designed with educators to ensure every experiment builds real scientific thinking and curiosity.',
  },
  {
    icon: <Users size={24} color="#10B981" />,
    bg: '#ECFDF5',
    title: 'Community Driven',
    desc: 'We partner with schools, libraries, and community centers to reach kids where they already are.',
  },
]

export default function Mission() {
  return (
    <section
      id="mission"
      style={{
        padding: '100px 24px',
        background: '#FAFAF9',
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
              color: '#6366F1',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Our Mission
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-1px',
              margin: '0 0 20px',
            }}
          >
            Science belongs to{' '}
            <span style={{ color: '#6366F1' }}>everyone</span>.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              color: '#6b7280',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            CurioCrate is a nonprofit organization that builds and distributes
            STEM exploration kits to underserved youth, turning curiosity into
            a lifelong love of learning.
          </p>
        </div>

        {/* Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 64,
          }}
        >
          {pillars.map((p) => (
            <div
              key={p.title}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 32,
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: p.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#111827',
                  margin: '0 0 12px',
                }}
              >
                {p.title}
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
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote callout */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #8B5CF6 100%)',
            borderRadius: 24,
            padding: '48px 40px',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 20 }}>✨</div>
          <blockquote
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 32px)',
              lineHeight: 1.3,
              margin: '0 0 20px',
              color: '#fff',
              letterSpacing: '-0.5px',
            }}
          >
            "A child who asks 'why' is a scientist in the making."
          </blockquote>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
            }}
          >
            — The CurioCrate Team
          </p>
        </div>
      </div>
    </section>
  )
}
