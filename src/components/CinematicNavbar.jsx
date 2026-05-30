import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_LEFT = [
  { path: '/',        label: 'Discover' },
  { path: '/kits',    label: 'Kits'     },
]

const ABOUT_ITEMS = [
  { path: '/mission', label: 'Mission' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/team',    label: 'Team'    },
]

const NAV_RIGHT = [
  { path: '/chapters', label: 'Our Chapters' },
  { path: '/contact',  label: 'Contact Us'   },
]

function NavItem({ path, label, end }) {
  return (
    <NavLink
      to={path}
      end={end}
      style={({ isActive }) => ({
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
        textDecoration: 'none', padding: '8px 14px', borderRadius: 4,
        color: isActive ? 'var(--cream)' : 'var(--muted)',
        background: isActive ? 'rgba(168,212,240,0.08)' : 'transparent',
        border: isActive ? '1px solid rgba(168,212,240,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.style.background.includes('0.08'))
          e.currentTarget.style.color = 'var(--pastel2)'
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.style.background.includes('0.08'))
          e.currentTarget.style.color = 'var(--muted)'
      }}
    >{label}</NavLink>
  )
}

export default function CinematicNavbar() {
  const [visible,    setVisible]    = useState(true)
  const [lastY,      setLastY]      = useState(0)
  const [atTop,      setAtTop]      = useState(true)
  const [aboutOpen,  setAboutOpen]  = useState(false)
  const aboutTimer = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setAtTop(y < 40)
      setVisible(y < lastY || y < 40)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  useEffect(() => { setVisible(true) }, [location])

  const openAbout  = () => { clearTimeout(aboutTimer.current); setAboutOpen(true) }
  const closeAbout = () => { aboutTimer.current = setTimeout(() => setAboutOpen(false), 120) }

  const isAboutActive = ABOUT_ITEMS.some(i => location.pathname === i.path)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 36px',
      transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      background: atTop
        ? 'transparent'
        : 'linear-gradient(to bottom, rgba(6,13,31,0.92) 0%, transparent 100%)',
      backdropFilter: atTop ? 'none' : 'blur(18px)',
    }}>

      {/* Brand */}
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img
          src="/images/cclogo.png" alt="CurioCrate"
          style={{ height: 34, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(168,212,240,0.5))' }}
        />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
          fontSize: 19, letterSpacing: '0.12em',
          color: 'var(--pastel2)', textShadow: '0 0 20px rgba(168,212,240,0.35)',
        }}>CurioCrate</span>
      </NavLink>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

        {/* Left links */}
        {NAV_LEFT.map(r => <NavItem key={r.path} path={r.path} label={r.label} end={r.path === '/'} />)}

        {/* About Us dropdown */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={openAbout}
          onMouseLeave={closeAbout}
        >
          <button style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
            background: isAboutActive ? 'rgba(168,212,240,0.08)' : 'transparent',
            border: isAboutActive ? '1px solid rgba(168,212,240,0.15)' : '1px solid transparent',
            borderRadius: 4, padding: '8px 14px',
            color: isAboutActive || aboutOpen ? 'var(--cream)' : 'var(--muted)',
            cursor: 'pointer', transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            About Us
            <span style={{
              fontSize: 8, opacity: 0.6,
              transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
              display: 'inline-block',
            }}>▾</span>
          </button>

          {/* Dropdown */}
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(6,13,31,0.95)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(168,212,240,0.12)', borderRadius: 12,
            padding: '8px', minWidth: 160,
            opacity: aboutOpen ? 1 : 0,
            pointerEvents: aboutOpen ? 'auto' : 'none',
            transform: aboutOpen
              ? 'translateX(-50%) translateY(0)'
              : 'translateX(-50%) translateY(-8px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          }}>
            {ABOUT_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'block', padding: '10px 16px', borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: isActive ? 'var(--cream)' : 'var(--muted)',
                  background: isActive ? 'rgba(168,212,240,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.06)'; e.currentTarget.style.color = 'var(--pastel2)' }}
                onMouseLeave={e => {
                  if (!location.pathname === item.path) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--muted)'
                  }
                }}
              >{item.label}</NavLink>
            ))}
          </div>
        </div>

        {/* Right links */}
        {NAV_RIGHT.map(r => <NavItem key={r.path} path={r.path} label={r.label} />)}

        {/* Volunteering Opportunities (external) */}
        <a
          href="https://portal.curiocrate.org"
          target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
            textDecoration: 'none', padding: '8px 14px', borderRadius: 4,
            color: 'var(--pastel1)', border: '1px solid rgba(168,212,240,0.25)',
            transition: 'all 0.3s ease', marginLeft: 4,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(168,212,240,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
        >
          Volunteering
        </a>
      </div>

      <style>{`
        @media(max-width:900px){
          nav { padding:14px 16px !important; }
          nav > div:last-child { gap:1px !important; }
          nav span:not([style*="rotate"]) { display:none !important; }
          nav a, nav button { padding:6px 8px !important; font-size:9px !important; letter-spacing:1.5px !important; }
        }
      `}</style>
    </nav>
  )
}
