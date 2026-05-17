import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const routes = [
  { path: '/',        label: 'Discover' },
  { path: '/kits',    label: 'Kits'     },
  { path: '/gallery', label: 'Gallery'  },
  { path: '/mission', label: 'Mission'  },
  { path: '/team',    label: 'Team'     },
]

export default function CinematicNavbar() {
  const [visible, setVisible] = useState(true)
  const [lastY,  setLastY]    = useState(0)
  const [atTop,  setAtTop]    = useState(true)
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

  // Always show on route change
  useEffect(() => { setVisible(true) }, [location])

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      background: atTop
        ? 'transparent'
        : 'linear-gradient(to bottom, rgba(6,13,31,0.9) 0%, transparent 100%)',
      backdropFilter: atTop ? 'none' : 'blur(16px)',
    }}>
      {/* Logo */}
      <NavLink to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
        <img
          src="/images/cclogo.png"
          alt="CurioCrate"
          style={{ height:38, objectFit:'contain', filter:'drop-shadow(0 0 12px rgba(168,212,240,0.5))' }}
        />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: 20,
          letterSpacing: '0.12em',
          color: 'var(--pastel2)',
          textShadow: '0 0 20px rgba(168,212,240,0.4)',
        }}>
          CurioCrate
        </span>
      </NavLink>

      {/* Nav items */}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {routes.map(r => (
          <NavLink
            key={r.path}
            to={r.path}
            end={r.path === '/'}
            style={({ isActive }) => ({
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 4,
              color: isActive ? 'var(--cream)' : 'var(--muted)',
              background: isActive ? 'rgba(168,212,240,0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(168,212,240,0.15)' : '1px solid transparent',
              transition: 'all 0.3s ease',
              position: 'relative',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('0.08')) {
                e.currentTarget.style.color = 'var(--pastel2)'
                e.currentTarget.style.borderColor = 'rgba(168,212,240,0.1)'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.borderColor = 'transparent'
              }
            }}
          >
            {r.label}
          </NavLink>
        ))}

        <a
          href="https://portal.curiocrate.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            color: 'var(--pastel1)',
            border: '1px solid rgba(168,212,240,0.25)',
            transition: 'all 0.3s ease',
            marginLeft: 8,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(168,212,240,0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(168,212,240,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Portal
        </a>
      </div>

      <style>{`
        @media(max-width:768px){
          nav { padding:16px 20px !important; }
          nav > div:last-child { gap:2px !important; }
          nav span { display:none !important; }
          nav a[style*="3px"] { padding:6px 10px !important; font-size:9px !important; letter-spacing:2px !important; }
        }
      `}</style>
    </nav>
  )
}
