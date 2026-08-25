import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'

const NAV_LEFT = [
  { path: '/',            labelKey: 'nav.discover'  },
  { path: '/kits',        labelKey: 'nav.kits'      },
  { path: '/newsletter',  labelKey: 'nav.newsletter' },
]

const INITIATIVES_ITEMS = [
  { id: 'handsOnTeaching',       path: '/initiatives/teaching', labelKey: 'nav.handsOnTeaching'           },
  { id: 'stemAdvocacy',          path: '/initiatives/sap',      labelKey: 'nav.stemAdvocacyItem'          },
  { id: 'kitResearchInternship', path: '/initiatives/kits',     labelKey: 'nav.kitResearchInternshipItem' },
]

const ABOUT_ITEMS = [
  { id: 'ourChapters', path: '/chapters', labelKey: 'nav.ourChapters' },
  { id: 'gallery',     path: '/gallery',  labelKey: 'nav.gallery'      },
  { id: 'team',        path: '/team',     labelKey: 'nav.team'         },
  { id: 'contactUs',   path: '/contact',  labelKey: 'nav.contactUs'    },
]

const ALL_NAV = [
  ...NAV_LEFT.map(item => ({ ...item, id: item.path })),
  ...INITIATIVES_ITEMS,
  ...ABOUT_ITEMS,
]

// No live donation flow yet — point Donate at Contact until one exists.
const DONATE_URL = '/contact'

// The Creator Program (Kit Research Internship) page is a dedicated light-mode
// editorial design — the persistent navbar/footer/particle field switch to a
// matching light palette while the visitor is on that route.
const LIGHT_ROUTE_PREFIX = '/initiatives/kits'

const DARK = {
  barBg: 'linear-gradient(to bottom, rgba(6,13,31,0.92) 0%, transparent 100%)',
  barBgMobile: 'linear-gradient(to bottom, rgba(6,13,31,0.92) 0%, rgba(6,13,31,0.55) 65%, rgba(6,13,31,0.2) 100%)',
  text: 'var(--cream)',
  muted: 'var(--muted)',
  hoverText: 'var(--pastel2)',
  accent: 'var(--pastel1)',
  accentText: '#06101f',
  activeBg: 'rgba(168,212,240,0.08)',
  activeBorder: 'rgba(168,212,240,0.15)',
  hoverBg: 'rgba(168,212,240,0.06)',
  dropdownBg: 'rgba(6,13,31,0.95)',
  dropdownBorder: '1px solid rgba(168,212,240,0.12)',
  dropdownShadow: '0 16px 48px rgba(0,0,0,0.4)',
  overlayBg: 'rgba(3,5,15,0.98)',
  hamburgerBorder: '1px solid rgba(168,212,240,0.2)',
  ctaBorder: '1px solid rgba(168,212,240,0.25)',
  ctaHoverBg: 'rgba(168,212,240,0.1)',
  ctaHoverShadow: '0 0 20px rgba(168,212,240,0.15)',
  mobileInactive: 'rgba(197,227,247,0.4)',
  mobileBorder: 'rgba(168,212,240,0.06)',
  logoGlow: 'drop-shadow(0 0 10px rgba(168,212,240,0.5))',
  logoGlowSm: 'drop-shadow(0 0 8px rgba(168,212,240,0.4))',
}

const LIGHT = {
  barBg: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, transparent 100%)',
  barBgMobile: 'linear-gradient(to bottom, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0.3) 100%)',
  text: '#0B1B33',
  muted: 'rgba(11,27,51,0.55)',
  hoverText: '#1B7FE8',
  accent: '#1B7FE8',
  accentText: '#FFFFFF',
  activeBg: 'rgba(27,127,232,0.08)',
  activeBorder: 'rgba(27,127,232,0.18)',
  hoverBg: 'rgba(27,127,232,0.06)',
  dropdownBg: 'rgba(255,255,255,0.98)',
  dropdownBorder: '1px solid rgba(27,127,232,0.15)',
  dropdownShadow: '0 16px 48px rgba(11,27,51,0.12)',
  overlayBg: 'rgba(255,255,255,0.98)',
  hamburgerBorder: '1px solid rgba(27,127,232,0.25)',
  ctaBorder: '1px solid rgba(27,127,232,0.3)',
  ctaHoverBg: 'rgba(27,127,232,0.1)',
  ctaHoverShadow: '0 0 20px rgba(27,127,232,0.15)',
  mobileInactive: 'rgba(11,27,51,0.4)',
  mobileBorder: 'rgba(27,127,232,0.08)',
  logoGlow: 'drop-shadow(0 0 8px rgba(27,127,232,0.25))',
  logoGlowSm: 'drop-shadow(0 0 6px rgba(27,127,232,0.2))',
}

function NavItem({ path, label, end, theme }) {
  return (
    <NavLink
      to={path}
      end={end}
      style={({ isActive }) => ({
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
        textDecoration: 'none', padding: '8px 14px', borderRadius: 4,
        color: isActive ? theme.text : theme.muted,
        background: isActive ? theme.activeBg : 'transparent',
        border: isActive ? `1px solid ${theme.activeBorder}` : '1px solid transparent',
        transition: 'all 0.3s ease',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.style.background.includes('0.08'))
          e.currentTarget.style.color = theme.hoverText
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.style.background.includes('0.08'))
          e.currentTarget.style.color = theme.muted
      }}
    >{label}</NavLink>
  )
}

export default function CinematicNavbar() {
  const { t } = useLanguage()
  const [visible,          setVisible]          = useState(true)
  const [lastY,            setLastY]            = useState(0)
  const [atTop,            setAtTop]            = useState(true)
  const [aboutOpen,        setAboutOpen]        = useState(false)
  const [initiativesOpen,  setInitiativesOpen]  = useState(false)
  const [menuOpen,         setMenuOpen]         = useState(false)
  const aboutTimer       = useRef(null)
  const initiativesTimer = useRef(null)
  const location         = useLocation()

  const isLight = location.pathname.startsWith(LIGHT_ROUTE_PREFIX)
  const theme = isLight ? LIGHT : DARK

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

  useEffect(() => { setVisible(true); setMenuOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const openAbout  = () => { clearTimeout(aboutTimer.current); setAboutOpen(true) }
  const closeAbout = () => { aboutTimer.current = setTimeout(() => setAboutOpen(false), 120) }
  const isAboutActive = ABOUT_ITEMS.some(i => location.pathname === i.path)

  const openInitiatives  = () => { clearTimeout(initiativesTimer.current); setInitiativesOpen(true) }
  const closeInitiatives = () => { initiativesTimer.current = setTimeout(() => setInitiativesOpen(false), 120) }
  const isInitiativesActive = location.pathname.startsWith('/initiatives')

  return (
    <>
      <nav className="cn-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 36px',
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        // The Creator Program page opens on a dark ink hero block, so a fully
        // transparent "atTop" nav (tuned for the site's dark cosmic background)
        // would leave light-theme text unreadable there — always keep the light
        // gradient backdrop on this route instead of only after scrolling.
        background: (atTop && !isLight) ? 'transparent' : theme.barBg,
        backdropFilter: (atTop && !isLight) ? 'none' : 'blur(18px)',
      }}>

        {/* Brand */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/images/cclogofull5.png" alt="CurioCrate"
            style={{ height: 58, objectFit: 'contain', filter: theme.logoGlow }}
          />
        </NavLink>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

          {NAV_LEFT.map(r => <NavItem key={r.path} path={r.path} label={t(r.labelKey)} end={r.path === '/'} theme={theme} />)}

          {/* Initiatives dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={openInitiatives} onMouseLeave={closeInitiatives}>
            <button style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              background: isInitiativesActive ? theme.activeBg : 'transparent',
              border: isInitiativesActive ? `1px solid ${theme.activeBorder}` : '1px solid transparent',
              borderRadius: 4, padding: '8px 14px',
              color: isInitiativesActive || initiativesOpen ? theme.text : theme.muted,
              cursor: 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t('nav.initiatives')}
              <span style={{
                fontSize: 8, opacity: 0.6,
                transform: initiativesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease', display: 'inline-block',
              }}>▾</span>
            </button>

            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
              background: theme.dropdownBg, backdropFilter: 'blur(24px)',
              border: theme.dropdownBorder, borderRadius: 12,
              padding: '8px', minWidth: 180,
              opacity: initiativesOpen ? 1 : 0,
              pointerEvents: initiativesOpen ? 'auto' : 'none',
              transform: initiativesOpen
                ? 'translateX(-50%) translateY(0)'
                : 'translateX(-50%) translateY(-8px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              boxShadow: theme.dropdownShadow,
            }}>
              {INITIATIVES_ITEMS.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'block', padding: '10px 16px', borderRadius: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? theme.text : theme.muted,
                    background: isActive ? theme.activeBg : 'transparent',
                    transition: 'all 0.2s ease',
                  })}
                  onMouseEnter={e => { e.currentTarget.style.background = theme.hoverBg; e.currentTarget.style.color = theme.hoverText }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.muted }}
                >{t(item.labelKey)}</NavLink>
              ))}
            </div>
          </div>

          {/* About dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={openAbout} onMouseLeave={closeAbout}>
            <button style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              background: isAboutActive ? theme.activeBg : 'transparent',
              border: isAboutActive ? `1px solid ${theme.activeBorder}` : '1px solid transparent',
              borderRadius: 4, padding: '8px 14px',
              color: isAboutActive || aboutOpen ? theme.text : theme.muted,
              cursor: 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t('nav.aboutUs')}
              <span style={{
                fontSize: 8, opacity: 0.6,
                transform: aboutOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease', display: 'inline-block',
              }}>▾</span>
            </button>

            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
              background: theme.dropdownBg, backdropFilter: 'blur(24px)',
              border: theme.dropdownBorder, borderRadius: 12,
              padding: '8px', minWidth: 160,
              opacity: aboutOpen ? 1 : 0,
              pointerEvents: aboutOpen ? 'auto' : 'none',
              transform: aboutOpen
                ? 'translateX(-50%) translateY(0)'
                : 'translateX(-50%) translateY(-8px)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              boxShadow: theme.dropdownShadow,
            }}>
              {ABOUT_ITEMS.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'block', padding: '10px 16px', borderRadius: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? theme.text : theme.muted,
                    background: isActive ? theme.activeBg : 'transparent',
                    transition: 'all 0.2s ease',
                  })}
                  onMouseEnter={e => { e.currentTarget.style.background = theme.hoverBg; e.currentTarget.style.color = theme.hoverText }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.muted }}
                >{t(item.labelKey)}</NavLink>
              ))}
            </div>
          </div>

          <LanguageSwitcher size="sm" />

          {/* Get Involved (external CTA) */}
          <a
            href="https://portal.curiocrate.org"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', padding: '8px 14px', borderRadius: 4,
              color: theme.accent, border: theme.ctaBorder,
              transition: 'all 0.3s ease', marginLeft: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.ctaHoverBg; e.currentTarget.style.boxShadow = theme.ctaHoverShadow }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
          >{t('nav.becomeAMember')}</a>

          {/* Donate */}
          <NavLink
            to={DONATE_URL}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', padding: '8px 16px', borderRadius: 4,
              color: theme.accentText, background: theme.accent,
              border: `1px solid ${theme.accent}`,
              transition: 'all 0.3s ease', marginLeft: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.boxShadow = theme.ctaHoverShadow }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >{t('nav.donate')}</NavLink>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          style={{
            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5,
            background: 'none', border: theme.hamburgerBorder,
            borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
          }}
        >
          <span style={{ display: 'block', width: 20, height: 1.5, background: theme.accent, borderRadius: 1 }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: theme.accent, borderRadius: 1 }} />
          <span style={{ display: 'block', width: 20, height: 1.5, background: theme.accent, borderRadius: 1 }} />
        </button>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: theme.overlayBg, backdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 28px',
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? 'auto' : 'none',
        transition: 'opacity 0.25s ease',
        overflowY: 'auto',
      }}>
        {/* Overlay header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/images/cclogosmall.png" alt="CurioCrate" style={{ height: 30, objectFit: 'contain', filter: theme.logoGlowSm }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: isLight ? theme.accent : 'var(--pastel2)', fontWeight: 300 }}>CurioCrate</span>
          </NavLink>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'none', border: theme.hamburgerBorder,
              borderRadius: 8, color: theme.muted, fontSize: 11,
              cursor: 'pointer', padding: '8px 14px',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px',
            }}
          >{t('nav.esc')}</button>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {ALL_NAV.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 38, fontWeight: 300,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                color: isActive ? theme.text : theme.mobileInactive,
                padding: '12px 0',
                borderBottom: `1px solid ${theme.mobileBorder}`,
                transition: 'color 0.2s',
                display: 'block',
              })}
            >{t(item.labelKey)}</NavLink>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div style={{ paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <LanguageSwitcher />
          <a
            href="https://portal.curiocrate.org"
            target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', padding: '16px 24px', borderRadius: 6,
              color: theme.accent, border: theme.ctaBorder,
            }}
          >{t('nav.becomeAMember')} →</a>
          <NavLink
            to={DONATE_URL}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', padding: '16px 24px', borderRadius: 6,
              color: theme.accentText, background: theme.accent,
            }}
          >{t('nav.donate')} →</NavLink>
        </div>
      </div>

      <style>{`
        .nav-hamburger { display: none; }
        .nav-desktop   { display: flex; }
        @media(max-width:768px){
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
          nav { padding: 14px 20px !important; }
          /* On mobile the hero heading sits close enough to the top that a fully transparent
             "atTop" nav lets it visually collide with the logo/hamburger — always keep a
             legible backdrop here regardless of scroll position. */
          .cn-nav { background: ${theme.barBgMobile} !important; backdrop-filter: blur(14px) !important; }
        }
      `}</style>
    </>
  )
}
