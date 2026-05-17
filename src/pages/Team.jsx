import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// Board members — replace photo with a real cutout PNG (no background, lower-body crop)
// Set photo to null to use emoji fallback until you have the real image
const members = [
  {
    id: 'director',
    name: 'Your Name',
    role: 'Executive Director',
    bio: 'Founded CurioCrate with a belief that access to great science education should never be determined by a zip code. Leads vision, strategy, and partnerships.',
    photo: null,         // → set to '/images/member-director.png' when available
    emoji: '👩‍🔬',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.4)',
    // Constellation position (% of container)
    cx: 50, cy: 28,
  },
  {
    id: 'ops',
    name: 'Board Member',
    role: 'Director of Operations',
    bio: 'Orchestrates kit production, logistics, and community partnerships to ensure every program runs with precision and care.',
    photo: null,
    emoji: '⚙️',
    color: '#b8c8f8',
    glow: 'rgba(184,200,248,0.4)',
    cx: 22, cy: 62,
  },
  {
    id: 'curriculum',
    name: 'Board Member',
    role: 'Curriculum Lead',
    bio: 'Designs every experiment guide — tested by real kids, refined by educators, built to spark genuine discovery and scientific thinking.',
    photo: null,
    emoji: '📚',
    color: '#d0b8f0',
    glow: 'rgba(208,184,240,0.4)',
    cx: 78, cy: 62,
  },
  {
    id: 'outreach',
    name: 'Board Member',
    role: 'Outreach Director',
    bio: 'Builds the bridges between CurioCrate and the communities that need it most — one relationship, one school, one library at a time.',
    photo: null,
    emoji: '🤝',
    color: '#a8e8d0',
    glow: 'rgba(168,232,208,0.4)',
    cx: 50, cy: 85,
  },
]

// Constellation edges
const edges = [
  [0, 1], [0, 2], [0, 3], [1, 3], [2, 3],
]

function ConstellationSVG({ active, containerSize }) {
  const { w, h } = containerSize
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox={`0 0 100 100`}
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="0.4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => {
        const ma = members[a], mb = members[b]
        const isActive = active === a || active === b
        return (
          <motion.line
            key={i}
            x1={ma.cx} y1={ma.cy} x2={mb.cx} y2={mb.cy}
            stroke={isActive ? members[active].color : 'rgba(168,212,240,0.12)'}
            strokeWidth={isActive ? '0.4' : '0.15'}
            filter={isActive ? 'url(#glow-line)' : ''}
            initial={false}
            animate={{
              stroke: isActive ? members[active].color : 'rgba(168,212,240,0.12)',
              strokeWidth: isActive ? 0.4 : 0.15,
              opacity: isActive ? 0.7 : 0.3,
            }}
            transition={{ duration: 0.5 }}
          />
        )
      })}
      {/* Star dots at each node */}
      {members.map((m, i) => (
        <motion.circle
          key={m.id}
          cx={m.cx} cy={m.cy} r={active === i ? 1.2 : 0.6}
          fill={active === i ? m.color : 'rgba(168,212,240,0.3)'}
          animate={{ r: active === i ? 1.2 : 0.6, opacity: active === i ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
          style={{ filter: active === i ? `drop-shadow(0 0 3px ${m.color})` : 'none' }}
        />
      ))}
    </svg>
  )
}

function MemberNode({ member, index, isActive, onClick, containerSize }) {
  const { w, h } = containerSize
  const left = `${member.cx}%`
  const top  = `${member.cy}%`

  return (
    <motion.div
      onClick={() => onClick(index)}
      style={{
        position: 'absolute',
        left, top,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: isActive ? 10 : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pulse ring */}
      {isActive && (
        <motion.div
          style={{
            position: 'absolute',
            width: 120, height: 120,
            borderRadius: '50%',
            border: `1px solid ${member.color}`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) translateY(-40px)',
            pointerEvents: 'none',
          }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Photo / avatar */}
      <motion.div
        animate={{
          boxShadow: isActive ? `0 0 40px ${member.glow}, 0 0 80px ${member.glow.replace('0.4','0.15')}` : '0 4px 20px rgba(0,0,0,0.4)',
          borderColor: isActive ? member.color : 'rgba(168,212,240,0.15)',
        }}
        transition={{ duration: 0.5 }}
        style={{
          width: isActive ? 110 : 80,
          height: isActive ? 140 : 100,
          borderRadius: 12,
          border: `1px solid`,
          overflow: 'hidden',
          background: `radial-gradient(circle at 50% 30%, ${member.glow.replace('0.4','0.2')} 0%, rgba(8,16,40,0.8) 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          position: 'relative',
          transition: 'width 0.4s ease, height 0.4s ease',
        }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        ) : (
          <span style={{ fontSize: isActive ? 44 : 32, paddingBottom: 8, transition: 'font-size 0.4s' }}>
            {member.emoji}
          </span>
        )}
        {/* Bottom fade for cutout effect */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '35%',
          background: 'linear-gradient(to top, rgba(3,5,15,0.95) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}/>
      </motion.div>

      {/* Name + role */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.5 }}
        style={{ textAlign: 'center', maxWidth: 120 }}
      >
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isActive ? 13 : 11,
          fontWeight: 600,
          color: isActive ? 'var(--cream)' : 'var(--muted)',
          transition: 'font-size 0.4s',
          whiteSpace: 'nowrap',
        }}>{member.name}</div>
        <div className="label" style={{ fontSize: 8, color: member.color, marginTop: 3, opacity: isActive ? 0.9 : 0.5 }}>
          {member.role}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Team() {
  const [active, setActive] = useState(0)
  const constellationRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ w: 800, h: 560 })

  useEffect(() => {
    const update = () => {
      if (constellationRef.current) {
        const r = constellationRef.current.getBoundingClientRect()
        setContainerSize({ w: r.width, h: r.height })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const member = members[active]

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '120px 40px 80px' }}>

        {/* Ambient glow */}
        <AnimatePresence>
          <motion.div
            key={member.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse 50% 50% at 50% 40%, ${member.glow.replace('0.4','0.06')} 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>The Constellation</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(42px,6vw,78px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 12,
            }}>
              Meet the<br/>
              <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>minds behind it.</em>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
              Click any node to learn their story.
            </p>
          </motion.div>

          {/* Constellation map */}
          <div
            ref={constellationRef}
            style={{
              position: 'relative',
              width: '100%',
              height: 560,
              marginBottom: 48,
            }}
          >
            <ConstellationSVG active={active} containerSize={containerSize} />
            {members.map((m, i) => (
              <MemberNode
                key={m.id}
                member={m}
                index={i}
                isActive={active === i}
                onClick={setActive}
                containerSize={containerSize}
              />
            ))}
          </div>

          {/* Bio card — animates in for selected member */}
          <AnimatePresence mode="wait">
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: 'rgba(8,16,40,0.7)',
                border: `1px solid ${member.color}22`,
                borderRadius: 14,
                padding: '36px 40px',
                backdropFilter: 'blur(24px)',
                boxShadow: `0 0 60px ${member.glow.replace('0.4','0.08')}`,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 32,
                alignItems: 'start',
                maxWidth: 760,
                margin: '0 auto',
              }}
            >
              <div>
                <div className="label" style={{ marginBottom: 10, color: member.color, opacity: 1 }}>
                  {member.role}
                </div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32, fontWeight: 300,
                  color: 'var(--cream)', marginBottom: 14,
                }}>
                  {member.name}
                </h2>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>
                  {member.bio}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={`mailto:${member.id}@curiocrate.org`} style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                    textDecoration: 'none', padding: '10px 18px',
                    border: `1px solid ${member.color}33`, borderRadius: 3,
                    color: member.color, transition: 'all 0.3s',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${member.color}11` }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent' }}
                  >
                    Email →
                  </a>
                </div>
              </div>
              {/* Mini portrait in card */}
              <div style={{
                width: 80, height: 110,
                borderRadius: 10,
                border: `1px solid ${member.color}33`,
                overflow: 'hidden',
                background: `radial-gradient(circle at 50% 20%, ${member.glow.replace('0.4','0.25')} 0%, rgba(8,16,40,0.8) 100%)`,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
              }}>
                {member.photo
                  ? <img src={member.photo} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}/>
                  : <span style={{ fontSize: 38, paddingBottom: 8 }}>{member.emoji}</span>
                }
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                  background: 'linear-gradient(to top, rgba(3,5,15,0.95) 0%, transparent 100%)',
                }}/>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Motto */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ textAlign: 'center', marginTop: 72, padding: '48px 0' }}
          >
            <div style={{ width: 40, height: 1, background: 'rgba(168,212,240,0.2)', margin: '0 auto 24px' }}/>
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(18px,3vw,30px)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'var(--pastel1)',
              lineHeight: 1.5,
              textShadow: '0 0 40px rgba(168,212,240,0.2)',
            }}>
              "Create Change in our Community through Curiosity."
            </blockquote>
            <div style={{ width: 40, height: 1, background: 'rgba(168,212,240,0.2)', margin: '24px auto 0' }}/>
          </motion.div>

          {/* Volunteer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ textAlign: 'center', marginTop: 56 }}
          >
            <img
              src="/images/mascot1.png" alt=""
              style={{ height: 72, marginBottom: 20, filter: 'drop-shadow(0 0 16px rgba(168,212,240,0.4))', animation: 'drift 5s ease-in-out infinite' }}
            />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', marginBottom: 10 }}>
              Want to join the constellation?
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
              We're looking for volunteers, educators, and community partners.
            </p>
            <a href="mailto:hello@curiocrate.org" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
              textDecoration: 'none', padding: '13px 30px',
              border: '1px solid rgba(168,212,240,0.25)', borderRadius: 3,
              color: 'var(--pastel1)', transition: 'all 0.3s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background='rgba(168,212,240,0.07)'; e.currentTarget.style.boxShadow='0 0 24px rgba(168,212,240,0.12)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.boxShadow='none' }}
            >
              Get in Touch →
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
