import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const members = [
  {
    name:'Your Name',
    role:'Executive Director',
    bio:'Founded CurioCrate with a belief that access to great science education should never be determined by a zip code.',
    emoji:'👩‍🔬',
    color:'#a8d4f0',
    linkedin:'#',
    email:'director@curiocrate.org',
  },
  {
    name:'Board Member',
    role:'Director of Operations',
    bio:'Orchestrates kit production, logistics, and community partnerships to ensure every program runs with precision.',
    emoji:'⚙️',
    color:'#b8c8f8',
    linkedin:'#',
    email:'ops@curiocrate.org',
  },
  {
    name:'Board Member',
    role:'Curriculum Lead',
    bio:'Designs every experiment guide — tested by real kids, refined by educators, built to spark genuine discovery.',
    emoji:'📚',
    color:'#d0b8f0',
    linkedin:'#',
    email:'curriculum@curiocrate.org',
  },
  {
    name:'Board Member',
    role:'Outreach Director',
    bio:'Builds the bridges between CurioCrate and the communities that need it most — one relationship at a time.',
    emoji:'🤝',
    color:'#a8e8d0',
    linkedin:'#',
    email:'outreach@curiocrate.org',
  },
]

function MemberCard({ member, index }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity:0, y:50 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.8, delay:index*0.12, ease:[0.4,0,0.2,1] }}
      style={{ perspective:1000, height:360, cursor:'pointer' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration:0.7, ease:[0.4,0,0.2,1] }}
        style={{ width:'100%', height:'100%', position:'relative', transformStyle:'preserve-3d' }}
      >
        {/* Front */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          background:'rgba(10,20,50,0.7)',
          border:`1px solid ${member.color}22`,
          borderRadius:10,
          padding:'40px 32px',
          backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', textAlign:'center',
          boxShadow:`0 8px 40px rgba(0,0,0,0.3)`,
          transition:'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={e=>{
          e.currentTarget.style.borderColor=`${member.color}44`
          e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${member.color}22`
        }}
        onMouseLeave={e=>{
          e.currentTarget.style.borderColor=`${member.color}22`
          e.currentTarget.style.boxShadow='0 8px 40px rgba(0,0,0,0.3)'
        }}
        >
          {/* Avatar */}
          <div style={{
            width:88, height:88, borderRadius:'50%',
            border:`1px solid ${member.color}44`,
            background:`radial-gradient(circle, ${member.color}15 0%, rgba(10,20,50,0.5) 100%)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:40, marginBottom:24,
            boxShadow:`0 0 30px ${member.color}22`,
          }}>
            {member.emoji}
          </div>

          <div className="label" style={{ marginBottom:8, color:member.color, opacity:0.8, fontSize:9 }}>
            {member.role}
          </div>
          <h3 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:26, fontWeight:300,
            color:'var(--cream)', marginBottom:12,
          }}>
            {member.name}
          </h3>
          <div style={{
            fontFamily:"'JetBrains Mono', monospace",
            fontSize:10, color:'var(--muted)', letterSpacing:'2px',
          }}>
            Tap to learn more
          </div>
        </div>

        {/* Back */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          background:`linear-gradient(135deg, rgba(10,20,50,0.95) 0%, rgba(15,32,68,0.9) 100%)`,
          border:`1px solid ${member.color}33`,
          borderRadius:10,
          padding:'36px 32px',
          backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', justifyContent:'space-between',
          boxShadow:`0 8px 40px rgba(0,0,0,0.4), 0 0 40px ${member.color}18`,
        }}>
          <div>
            <div className="label" style={{ marginBottom:12, color:member.color, opacity:0.8, fontSize:9 }}>
              {member.role}
            </div>
            <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.8, marginBottom:24 }}>
              {member.bio}
            </p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <a href={`mailto:${member.email}`} style={{
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:10, letterSpacing:'2px', textTransform:'uppercase',
              textDecoration:'none', padding:'10px 16px',
              border:`1px solid ${member.color}33`,
              borderRadius:3, color:member.color,
              transition:'all 0.3s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${member.color}11`}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}
            >
              Email
            </a>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{
              fontFamily:"'JetBrains Mono', monospace",
              fontSize:10, letterSpacing:'2px', textTransform:'uppercase',
              textDecoration:'none', padding:'10px 16px',
              border:'1px solid rgba(168,212,240,0.15)',
              borderRadius:3, color:'var(--muted)',
              transition:'all 0.3s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.color='var(--pastel2)'}}
            onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Team() {
  return (
    <PageTransition>
      <div style={{ minHeight:'100vh', padding:'120px 40px 80px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9 }}
            style={{ textAlign:'center', marginBottom:80 }}
          >
            <div className="label" style={{ marginBottom:16 }}>The People</div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(48px,7vw,88px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:16,
            }}>
              Meet the<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>minds behind it.</em>
            </h1>
            <p style={{ color:'var(--muted)', fontSize:15, maxWidth:400, margin:'0 auto', lineHeight:1.7 }}>
              A team of educators, engineers, and advocates united by one belief:
              science belongs to every child.
            </p>
          </motion.div>

          {/* Member cards */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',
            gap:24, marginBottom:80,
          }}>
            {members.map((m,i) => <MemberCard key={m.name+i} member={m} index={i} />)}
          </div>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.8 }}
            style={{ textAlign:'center' }}
          >
            <div style={{
              padding:'56px 40px',
              border:'1px solid rgba(168,212,240,0.1)',
              borderRadius:10,
              background:'rgba(10,20,50,0.4)',
              backdropFilter:'blur(16px)',
              maxWidth:600, margin:'0 auto',
            }}>
              <img
                src="/images/mascot1.png"
                alt=""
                style={{
                  height:80, marginBottom:24,
                  filter:'drop-shadow(0 0 20px rgba(168,212,240,0.4))',
                  animation:'drift 5s ease-in-out infinite',
                }}
              />
              <h2 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:36, fontWeight:300,
                color:'var(--cream)', marginBottom:12,
              }}>
                Want to get involved?
              </h2>
              <p style={{ fontSize:14, color:'var(--muted)', marginBottom:28, lineHeight:1.7 }}>
                We're always looking for passionate volunteers, educators, and partners.
              </p>
              <a href="mailto:hello@curiocrate.org" style={{
                fontFamily:"'JetBrains Mono', monospace",
                fontSize:11, letterSpacing:'3px', textTransform:'uppercase',
                textDecoration:'none',
                padding:'13px 32px',
                border:'1px solid rgba(168,212,240,0.3)',
                borderRadius:3,
                color:'var(--pastel1)',
                transition:'all 0.3s ease',
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.background='rgba(168,212,240,0.08)'
                e.currentTarget.style.boxShadow='0 0 24px rgba(168,212,240,0.15)'
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background='transparent'
                e.currentTarget.style.boxShadow='none'
              }}
              >
                Get in Touch →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
