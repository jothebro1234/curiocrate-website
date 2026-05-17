import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'About', href: '#mission' },
  { label: 'Kits', href: '#shop' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Team', href: '#team' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
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
              color: scrolled ? '#1a1a2e' : '#fff',
              letterSpacing: '-0.3px',
            }}
          >
            CurioCrate
          </span>
        </a>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          className="nav-desktop"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = scrolled ? '#6366F1' : '#fff'
                e.target.style.background = scrolled
                  ? 'rgba(99,102,241,0.08)'
                  : 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = scrolled ? '#374151' : 'rgba(255,255,255,0.85)'
                e.target.style.background = 'transparent'
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#shop"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-block',
              marginLeft: 8,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.4)'
            }}
          >
            Shop Kits
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: scrolled ? '#1a1a2e' : '#fff',
            padding: 8,
          }}
          className="nav-mobile-btn"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            padding: '16px 24px 24px',
          }}
          className="nav-mobile-menu"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#shop"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              marginTop: 16,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: '#fff',
              textDecoration: 'none',
              padding: '14px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              textAlign: 'center',
            }}
          >
            Shop Kits
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  )
}
