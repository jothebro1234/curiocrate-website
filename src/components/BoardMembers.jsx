import { Link2, Mail } from 'lucide-react'

// Replace with your real board member info and photos
const members = [
  {
    name: 'Your Name',
    title: 'Executive Director & Founder',
    bio: 'Passionate about making STEM education accessible to all. Founded CurioCrate after seeing the opportunity gap in STEM resources firsthand.',
    emoji: '👩‍🔬',
    gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    linkedin: '#',
    email: 'director@curiocrate.org',
  },
  {
    name: 'Board Member Name',
    title: 'Director of Operations',
    bio: 'Oversees kit design, logistics, and community partnerships to ensure every program runs smoothly and at scale.',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    linkedin: '#',
    email: 'ops@curiocrate.org',
  },
  {
    name: 'Board Member Name',
    title: 'Curriculum Lead',
    bio: 'Designs and tests every experiment guide to ensure age-appropriate, engaging, and educationally rigorous content.',
    emoji: '📚',
    gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)',
    linkedin: '#',
    email: 'curriculum@curiocrate.org',
  },
  {
    name: 'Board Member Name',
    title: 'Community Outreach Director',
    bio: 'Builds relationships with schools, nonprofits, and local organizations to bring CurioCrate to the kids who need it most.',
    emoji: '🤝',
    gradient: 'linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 100%)',
    linkedin: '#',
    email: 'outreach@curiocrate.org',
  },
]

export default function BoardMembers() {
  return (
    <section
      id="team"
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
              color: '#8B5CF6',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Our Team
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
            Meet the board.
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
            A team of educators, engineers, and community advocates united by a
            single mission: more science, for more kids.
          </p>
        </div>

        {/* Board cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {members.map((m) => (
            <div
              key={m.name}
              style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 16px 50px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)'
              }}
            >
              {/* Avatar area */}
              <div
                style={{
                  background: m.gradient,
                  padding: '32px 24px 24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: 42,
                    border: '3px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  {m.emoji}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '20px 24px 28px' }}>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#111827',
                    margin: '0 0 4px',
                  }}
                >
                  {m.name}
                </h3>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#6366F1',
                    marginBottom: 12,
                  }}
                >
                  {m.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.6,
                    margin: '0 0 20px',
                  }}
                >
                  {m.bio}
                </p>

                {/* Social links */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#EEF2FF',
                      color: '#6366F1',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#6366F1'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.querySelector('svg').style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#EEF2FF'
                      e.currentTarget.querySelector('svg').style.color = '#6366F1'
                    }}
                  >
                    <Link2 size={16} color="#6366F1" />
                  </a>
                  <a
                    href={`mailto:${m.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#F0FDF4',
                      color: '#10B981',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#10B981'
                      e.currentTarget.querySelector('svg').style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F0FDF4'
                      e.currentTarget.querySelector('svg').style.color = '#10B981'
                    }}
                  >
                    <Mail size={16} color="#10B981" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join the team CTA */}
        <div
          style={{
            marginTop: 56,
            textAlign: 'center',
            background: '#fff',
            borderRadius: 20,
            padding: '40px 32px',
            border: '1px solid #f3f4f6',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>🙋</div>
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: '#111827',
              margin: '0 0 10px',
            }}
          >
            Want to get involved?
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: '#6b7280',
              margin: '0 auto 24px',
              maxWidth: 440,
              lineHeight: 1.6,
            }}
          >
            We're always looking for passionate volunteers, educators, and community partners.
          </p>
          <a
            href="mailto:hello@curiocrate.org"
            style={{
              display: 'inline-block',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: '#fff',
              textDecoration: 'none',
              padding: '13px 30px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
            }}
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  )
}
