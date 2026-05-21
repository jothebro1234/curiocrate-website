import { Mail, Globe, MessageCircle, Play } from 'lucide-react'

const footerLinks = {
  Organization: [
    { label: 'About Us', href: '#mission' },
    { label: 'Our Team', href: '#team' },
    { label: 'Gallery', href: '#gallery' },
  ],
  Programs: [
    { label: 'Shop Kits', href: '#shop' },
    { label: 'Donate a Kit', href: 'https://buy.stripe.com/YOUR_DONATION_LINK' },
    { label: 'Volunteer Portal', href: 'https://portal.curiocrate.org' },
  ],
  Contact: [
    { label: 'ckf.curiocrate@curiocrate.org', href: 'mailto:ckf.curiocrate@curiocrate.org' },
    { label: 'Instagram', href: '#' },
    { label: 'Twitter / X', href: '#' },
  ],
}

const socials = [
  { icon: <Globe size={18} />, href: '#', label: 'Instagram' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'Twitter' },
  { icon: <Play size={18} />, href: '#', label: 'YouTube' },
  { icon: <Mail size={18} />, href: 'mailto:ckf.curiocrate@curiocrate.org', label: 'Email' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: '#111827',
        color: '#fff',
        padding: '72px 24px 32px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 48,
            marginBottom: 56,
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🔬
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#fff',
                  letterSpacing: '-0.3px',
                }}
              >
                CurioCrate
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: '#9ca3af',
                lineHeight: 1.65,
                margin: '0 0 24px',
                maxWidth: 220,
              }}
            >
              Delivering hands-on science kits to underserved communities and
              sparking a love of STEM.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)',
                    color: '#9ca3af',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6366F1'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '1.5px',
                  color: '#fff',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}
              >
                {group}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14,
                        color: '#9ca3af',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 28 }} />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#6b7280',
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} CurioCrate. All rights reserved. A 501(c)(3) nonprofit.
          </p>
          <a
            href="https://portal.curiocrate.org"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#6366F1' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280' }}
          >
            Volunteer Portal →
          </a>
        </div>
      </div>
    </footer>
  )
}
