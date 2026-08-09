import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

export default function CinematicFooter() {
  const { t } = useLanguage()
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
              {t('footer.tagline')}
            </p>
          </div>
          {/* Nav */}
          {[
            { labelKey:'footer.explore', links:[{lKey:'nav.kits',p:'/kits'},{lKey:'nav.ourChapters',p:'/chapters'},{lKey:'footer.mission',p:'/#what-is-curiocrate'},{lKey:'nav.gallery',p:'/gallery'},{lKey:'nav.team',p:'/team'}] },
            { labelKey:'footer.connect', links:[{lKey:'nav.contactUs',p:'/contact'},{l:'contact@curiocrate.org',p:'mailto:contact@curiocrate.org'}] },
            { labelKey:'footer.program', links:[{lKey:'footer.volunteeringOpportunities',p:'https://portal.curiocrate.org'},{lKey:'footer.startAChapter',p:'https://forms.gle/nEBfc84qHXxcmT4k8'},{lKey:'footer.partnerWithUs',p:'mailto:contact@curiocrate.org'},{lKey:'footer.donate',p:'/contact'}] },
          ].map(col => (
            <div key={col.labelKey}>
              <div className="label" style={{ marginBottom:20, fontSize:9 }}>{t(col.labelKey)}</div>
              {col.links.map(link => {
                const label = link.lKey ? t(link.lKey) : link.l
                return link.p.startsWith('http') || link.p.startsWith('mailto')
                  ? <a key={label} href={link.p} target={link.p.startsWith('http')?'_blank':undefined}
                      rel="noopener noreferrer"
                      style={{ display:'block', fontSize:13, color:'var(--muted)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='var(--pastel2)'}}
                      onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}
                    >{label}</a>
                  : <Link key={label} to={link.p}
                      style={{ display:'block', fontSize:13, color:'var(--muted)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='var(--pastel2)'}}
                      onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}
                    >{label}</Link>
              })}
            </div>
          ))}
        </div>

        <div style={{
          borderTop:'1px solid rgba(168,212,240,0.05)',
          paddingTop:24,
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12,
        }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:'rgba(168,212,240,0.25)', letterSpacing:'2px' }}>
            © {new Date().getFullYear()} CURIOCRATE · {t('footer.copyright')}
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
