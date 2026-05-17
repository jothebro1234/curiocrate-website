import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// When you have real cutout PNGs (no background, cropped to lower body):
// set photo: '/images/member-yourname.png'
const members = [
  {
    id: 'director',
    name: 'Your Name',
    role: 'Executive Director & Founder',
    bio: 'Founded CurioCrate with one conviction: the zip code a child grows up in should never determine their access to great science. Leads vision, strategy, and every partnership that brings kits to new communities.',
    photo: null,
    emoji: '👩‍🔬',
    color: '#a8d4f0',
    glow: 'rgba(168,212,240,0.35)',
    accent: 'rgba(168,212,240,0.08)',
    email: 'director@curiocrate.org',
    linkedin: '#',
    number: '01',
  },
  {
    id: 'ops',
    name: 'Board Member',
    role: 'Director of Operations',
    bio: 'The engine behind the mission. Orchestrates kit production, supply chains, and community logistics — ensuring every kit reaches its destination with precision and care.',
    photo: null,
    emoji: '⚙️',
    color: '#b8c8f8',
    glow: 'rgba(184,200,248,0.35)',
    accent: 'rgba(184,200,248,0.08)',
    email: 'ops@curiocrate.org',
    linkedin: '#',
    number: '02',
  },
  {
    id: 'curriculum',
    name: 'Board Member',
    role: 'Curriculum Lead',
    bio: 'Designs every experiment guide from the ground up — tested by real kids, refined with real educators, built to ignite genuine scientific curiosity and lasting discovery.',
    photo: null,
    emoji: '📚',
    color: '#d0b8f0',
    glow: 'rgba(208,184,240,0.35)',
    accent: 'rgba(208,184,240,0.08)',
    email: 'curriculum@curiocrate.org',
    linkedin: '#',
    number: '03',
  },
  {
    id: 'outreach',
    name: 'Board Member',
    role: 'Outreach Director',
    bio: 'Builds the human bridges between CurioCrate and the communities that need it most. One school, one library, one relationship at a time — expanding the reach of curiosity.',
    photo: null,
    emoji: '🤝',
    color: '#a8e8d0',
    glow: 'rgba(168,232,208,0.35)',
    accent: 'rgba(168,232,208,0.08)',
    email: 'outreach@curiocrate.org',
    linkedin: '#',
    number: '04',
  },
]

function MemberCard({ member, index }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: isEven ? '420px 1fr' : '1fr 420px',
        minHeight: 520,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(168,212,240,0.08)',
        background: 'rgba(8,16,40,0.55)',
        backdropFilter: 'blur(24px)',
        boxShadow: `0 4px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,212,240,0.04)`,
        marginBottom: 32,
        position: 'relative',
      }}
    >
      {/* Ambient corner glow */}
      <div style={{
        position: 'absolute',
        top: isEven ? -60 : 'auto',
        bottom: isEven ? 'auto' : -60,
        left: isEven ? -60 : 'auto',
        right: isEven ? 'auto' : -60,
        width: 240, height: 240, borderRadius: '50%',
        background: `radial-gradient(circle, ${member.glow} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }}/>

      {/* Photo panel */}
      <div
        style={{
          order: isEven ? 0 : 1,
          position: 'relative',
          background: `linear-gradient(135deg, ${member.accent} 0%, rgba(6,13,31,0.6) 100%)`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          minHeight: 520,
          overflow: 'hidden',
        }}
      >
        {/* Number watermark */}
        <div style={{
          position: 'absolute',
          top: 24, left: isEven ? 24 : 'auto', right: isEven ? 'auto' : 24,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 96, fontWeight: 300,
          color: member.color,
          opacity: 0.07,
          lineHeight: 1,
          userSelect: 'none',
          zIndex: 0,
        }}>
          {member.number}
        </div>

        {/* Grid lines decoration */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${member.color}08 1px, transparent 1px), linear-gradient(90deg, ${member.color}08 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}/>

        {/* Photo or emoji */}
        {member.photo ? (
          <motion.img
            src={member.photo}
            alt={member.name}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '85%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              position: 'relative', zIndex: 1,
              filter: `drop-shadow(0 -20px 40px ${member.glow})`,
            }}
          />
        ) : (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 16,
            }}
          >
            {/* Glowing orb placeholder */}
            <div style={{
              width: 160, height: 160, borderRadius: '50%',
              background: `radial-gradient(circle, ${member.glow.replace('0.35','0.3')} 0%, ${member.accent} 50%, transparent 70%)`,
              border: `1px solid ${member.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 72,
              boxShadow: `0 0 60px ${member.glow}, 0 0 120px ${member.glow.replace('0.35','0.1')}`,
            }}>
              {member.emoji}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase',
              color: member.color, opacity: 0.4,
            }}>
              Photo coming soon
            </div>
          </motion.div>
        )}

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to top, rgba(8,16,40,0.9) 0%, transparent 100%)',
          zIndex: 2,
        }}/>
      </div>

      {/* Info panel */}
      <div style={{
        order: isEven ? 1 : 0,
        padding: '56px 52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {/* Role label */}
        <div className="label" style={{
          marginBottom: 20,
          color: member.color,
          opacity: 1,
          fontSize: 10,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 24, height: 1, background: member.color, opacity: 0.5 }}/>
          {member.role}
        </div>

        {/* Name */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(36px, 3.5vw, 56px)',
          fontWeight: 300,
          color: 'var(--cream)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: 28,
          textShadow: `0 0 40px ${member.glow.replace('0.35','0.2')}`,
        }}>
          {member.name}
        </h2>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right, ${member.color}60, transparent)`, marginBottom: 28 }}/>

        {/* Bio */}
        <p style={{
          fontSize: 16,
          color: 'var(--muted)',
          lineHeight: 1.85,
          marginBottom: 40,
          maxWidth: 460,
        }}>
          {member.bio}
        </p>

        {/* Contact links */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={`mailto:${member.email}`}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '12px 22px',
              border: `1px solid ${member.color}44`,
              borderRadius: 4,
              color: member.color,
              background: member.accent,
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = member.color
              e.currentTarget.style.boxShadow = `0 0 24px ${member.glow}`
              e.currentTarget.style.background = member.glow.replace('0.35', '0.12')
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = member.color + '44'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = member.accent
            }}
          >
            ✉ Email
          </a>
          <a
            href={member.linkedin}
            target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
              textDecoration: 'none',
              padding: '12px 22px',
              border: '1px solid rgba(168,212,240,0.15)',
              borderRadius: 4,
              color: 'var(--muted)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(168,212,240,0.4)'
              e.currentTarget.style.color = 'var(--pastel2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(168,212,240,0.15)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            LinkedIn →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .member-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}

export default function Team() {
  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, padding: '120px 40px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            style={{ textAlign: 'center', marginBottom: 80 }}
          >
            <div className="label" style={{ marginBottom: 16 }}>The People</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(48px,7vw,88px)',
              fontWeight: 300, color: 'var(--cream)',
              lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Meet the<br/>
              <em style={{ color: 'var(--pastel1)', fontStyle: 'italic' }}>minds behind it.</em>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
              A team united by one motto:
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontSize: 20,
              color: 'var(--pastel1)', marginTop: 10,
              textShadow: '0 0 30px rgba(168,212,240,0.25)',
            }}>
              "Create Change in our Community through Curiosity."
            </p>
          </motion.div>

          {/* Member cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {members.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              marginTop: 80,
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
              style={{ height: 80, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(168,212,240,0.4))', animation: 'drift 5s ease-in-out infinite' }}
            />
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>
              Want to join the team?
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>
              We're always looking for passionate volunteers, educators, and community partners who believe science belongs to everyone.
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
      </div>
    </PageTransition>
  )
}
