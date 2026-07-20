import { Link } from 'react-router-dom'

export default function CinematicFooter() {
  return (
    <footer style={{
      position:'relative', zIndex:1,
      borderTop:'1px solid rgba(168,212,240,0.06)',
      padding:'56px 40px 40px',
      background:'rgba(3,5,15,0.6)',
      backdropFilter:'blur(20px)',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr',
          gap:40, marginBottom:48,
        }}>
          {/* Brand */}
          <div>
            <img
              src="/images/cclogosmall.png"
              alt="CurioCrate"
              style={{ height:40, marginBottom:16, filter:'drop-shadow(0 0 10px rgba(168,212,240,0.3))' }}
            />
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, maxWidth:200 }}>
              Hands-on science kits for underserved communities.
            </p>
          </div>
          {/* Nav */}
          {[
            { label:'Explore', links:[{l:'Kits',p:'/kits'},{l:'Our Chapters',p:'/chapters'},{l:'Mission',p:'/#what-is-curiocrate'},{l:'Gallery',p:'/gallery'},{l:'Team',p:'/team'}] },
            { label:'Connect', links:[{l:'Contact Us',p:'/contact'},{l:'ckf.curiocrate@curiocrate.org',p:'mailto:ckf.curiocrate@curiocrate.org'}] },
            { label:'Program', links:[{l:'Volunteering Opportunities',p:'https://portal.curiocrate.org'},{l:'Start a Chapter',p:'https://forms.gle/nEBfc84qHXxcmT4k8'},{l:'Partner With Us',p:'mailto:ckf.curiocrate@curiocrate.org'}] },
          ].map(col => (
            <div key={col.label}>
              <div className="label" style={{ marginBottom:20, fontSize:9 }}>{col.label}</div>
              {col.links.map(link => (
                link.p.startsWith('http') || link.p.startsWith('mailto')
                  ? <a key={link.l} href={link.p} target={link.p.startsWith('http')?'_blank':undefined}
                      rel="noopener noreferrer"
                      style={{ display:'block', fontSize:13, color:'var(--muted)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='var(--pastel2)'}}
                      onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}
                    >{link.l}</a>
                  : <Link key={link.l} to={link.p}
                      style={{ display:'block', fontSize:13, color:'var(--muted)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='var(--pastel2)'}}
                      onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}
                    >{link.l}</Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop:'1px solid rgba(168,212,240,0.05)',
          paddingTop:24,
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12,
        }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:'rgba(168,212,240,0.25)', letterSpacing:'2px' }}>
            © {new Date().getFullYear()} CURIOCRATE · 501(c)(3) NONPROFIT
          </div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:'rgba(168,212,240,0.2)', letterSpacing:'1px' }}>
            curiocrate.org
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          footer > div > div:first-child { grid-template-columns:1fr 1fr !important; }
          footer { padding: 44px 24px 32px !important; }
        }
        @media(max-width:480px){
          footer > div > div:first-child { grid-template-columns:1fr !important; }
        }
      `}</style>
    </footer>
  )
}
