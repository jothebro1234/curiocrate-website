import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const members = [
  {
    id: 'director',
    name: 'Your Name',
    role: 'Executive Director',
    title: 'Founder',
    bio: 'Founded CurioCrate with one conviction: the zip code a child grows up in should never determine their access to great science.',
    photo: null,
    emoji: '👩‍🔬',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.5)',
    dark: '#0a1830',
    number: '01',
    email: 'director@curiocrate.org',
  },
  {
    id: 'ops',
    name: 'Board Member',
    role: 'Operations',
    title: 'Director',
    bio: 'The engine behind the mission. Orchestrates kit production, logistics, and partnerships — ensuring precision and care at every step.',
    photo: null,
    emoji: '⚙️',
    color: '#b8c8f8',
    glow: 'rgba(184,200,248,0.5)',
    dark: '#0c1235',
    number: '02',
    email: 'ops@curiocrate.org',
  },
  {
    id: 'curriculum',
    name: 'Board Member',
    role: 'Curriculum',
    title: 'Lead',
    bio: 'Designs every experiment — tested by real kids, refined by educators, built to spark lasting scientific curiosity.',
    photo: null,
    emoji: '📚',
    color: '#d0b8f0',
    glow: 'rgba(208,184,240,0.5)',
    dark: '#100a30',
    number: '03',
    email: 'curriculum@curiocrate.org',
  },
  {
    id: 'outreach',
    name: 'Board Member',
    role: 'Outreach',
    title: 'Director',
    bio: 'Builds the human bridges between CurioCrate and the communities that need it most — one school, one library at a time.',
    photo: null,
    emoji: '🤝',
    color: '#a8e8d0',
    glow: 'rgba(168,232,208,0.5)',
    dark: '#061a10',
    number: '04',
    email: 'outreach@curiocrate.org',
  },
]

export default function Team() {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)

  const focus = hovered ?? active

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ padding: '120px 56px 56px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="label" style={{ marginBottom: 14 }}>The People</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(44px, 6vw, 80px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 14,
            }}>
              Meet the minds<br/>
              <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>behind CurioCrate.</em>
            </h1>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontSize: 18,
              color: 'var(--pastel1)', opacity: 0.7,
              textShadow: '0 0 30px rgba(168,212,240,0.2)',
            }}>
              "Create Change in our Community through Curiosity."
            </p>
          </motion.div>
        </div>

        {/* ── CINEMATIC PANEL STAGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            display: 'flex',
            height: 640,
            margin: '0 40px',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(168,212,240,0.07)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
          }}
        >
          {members.map((m, i) => {
            const isActive = focus === i

            return (
              <motion.div
                key={m.id}
                animate={{ flex: isActive ? 3.2 : 1 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: m.dark,
                  flexShrink: 0,
                  borderRight: i < members.length - 1 ? '1px solid rgba(168,212,240,0.06)' : 'none',
                }}
              >
                {/* Grid texture */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 0,
                  backgroundImage: `linear-gradient(${m.color}07 1px, transparent 1px), linear-gradient(90deg, ${m.color}07 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                  opacity: isActive ? 1 : 0.4,
                  transition: 'opacity 0.5s',
                }}/>

                {/* Glow center */}
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1.2 : 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: -60, left: '50%', transform: 'translateX(-50%)',
                    width: 300, height: 300, borderRadius: '50%',
                    background: `radial-gradient(circle, ${m.glow.replace('0.5','0.25')} 0%, transparent 70%)`,
                    pointerEvents: 'none', zIndex: 0,
                  }}
                />

                {/* Big number watermark */}
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 120, fontWeight: 300, lineHeight: 1,
                  color: m.color, opacity: isActive ? 0.08 : 0.04,
                  transition: 'opacity 0.5s',
                  userSelect: 'none', zIndex: 0,
                }}>
                  {m.number}
                </div>

                {/* EMOJI / PHOTO — floats in center */}
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -58%)',
                  zIndex: 1,
                  transition: 'transform 0.5s ease',
                }}>
                  {m.photo ? (
                    <motion.img
                      src={m.photo}
                      alt={m.name}
                      animate={{ scale: isActive ? 1.05 : 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: isActive ? 340 : 180,
                        transition: 'height 0.55s cubic-bezier(0.4,0,0.2,1)',
                        objectFit: 'cover', objectPosition: 'top',
                        filter: `drop-shadow(0 0 30px ${m.glow})`,
                        display: 'block',
                      }}
                    />
                  ) : (
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: isActive ? 180 : 100,
                        height: isActive ? 180 : 100,
                        transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1)',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${m.glow.replace('0.5','0.35')} 0%, ${m.dark} 70%)`,
                        border: `1px solid ${m.color}33`,
                        boxShadow: `0 0 60px ${m.glow}, 0 0 120px ${m.glow.replace('0.5','0.15')}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isActive ? 72 : 40,
                        transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      {m.emoji}
                    </motion.div>
                  )}
                </div>

                {/* Bottom overlay — always visible: name + role */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
                  background: `linear-gradient(to top, ${m.dark}f0 0%, ${m.dark}88 50%, transparent 100%)`,
                  padding: '60px 28px 28px',
                }}>
                  {/* Collapsed state: vertical text */}
                  <AnimatePresence mode="wait">
                    {!isActive ? (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ textAlign: 'center' }}
                      >
                        <div className="label" style={{ color: m.color, fontSize: 8, marginBottom: 6, opacity: 0.7 }}>
                          {m.number}
                        </div>
                        <div style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15, fontWeight: 300,
                          color: 'var(--cream)', opacity: 0.7,
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          transform: 'rotate(180deg)',
                          margin: '0 auto',
                          letterSpacing: '0.05em',
                        }}>
                          {m.role}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                      >
                        {/* Role */}
                        <div className="label" style={{ color: m.color, fontSize: 10, marginBottom: 8, opacity: 1, display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width: 20, height: 1, background: m.color }}/>
                          {m.role} · {m.title}
                        </div>
                        {/* Name */}
                        <h2 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 'clamp(24px, 2.5vw, 38px)',
                          fontWeight: 300, color: 'var(--cream)',
                          lineHeight: 1.05, marginBottom: 12,
                          textShadow: `0 0 30px ${m.glow}`,
                        }}>
                          {m.name}
                        </h2>
                        {/* Bio */}
                        <p style={{
                          fontSize: 13, color: 'var(--muted)',
                          lineHeight: 1.7, marginBottom: 20,
                          maxWidth: 360,
                        }}>
                          {m.bio}
                        </p>
                        {/* Email */}
                        <a
                          href={`mailto:${m.email}`}
                          onClick={e => e.stopPropagation()}
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                            textDecoration: 'none',
                            padding: '10px 20px',
                            border: `1px solid ${m.color}44`,
                            borderRadius: 3,
                            color: m.color,
                            background: `${m.color}11`,
                            display: 'inline-block',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 20px ${m.glow}`; e.currentTarget.style.borderColor = m.color }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${m.color}44` }}
                        >
                          ✉ Get in Touch
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Top accent line */}
                <motion.div
                  animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(to right, transparent, ${m.color}, transparent)`,
                    transformOrigin: 'center',
                    zIndex: 4,
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── HINT TEXT ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{ textAlign: 'center', marginTop: 24, marginBottom: 80 }}
        >
          <span className="label" style={{ fontSize: 9, opacity: 0.35 }}>
            Hover to reveal · Click to lock
          </span>
        </motion.div>

        {/* ── JOIN CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            margin: '0 40px 100px',
            textAlign: 'center',
            padding: '64px 40px',
            border: '1px solid rgba(168,212,240,0.09)',
            borderRadius: 20,
            background: 'rgba(8,16,40,0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <img
            src="/images/mascot1.png" alt=""
            style={{ height: 72, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(168,212,240,0.4))', animation: 'drift 5s ease-in-out infinite' }}
          />
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>
            Want to join the team?
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>
            We're looking for passionate volunteers, educators, and community partners.
          </p>
          <a href="mailto:hello@curiocrate.org" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
            textDecoration: 'none', padding: '14px 34px',
            border: '1px solid rgba(168,212,240,0.28)', borderRadius: 4,
            color: 'var(--pastel1)', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.07)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(168,212,240,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Get in Touch →
          </a>
        </motion.div>
      </div>
    </PageTransition>
  )
}
