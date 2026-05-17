import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

// ─── DATA ─────────────────────────────────────────────────────────────────────
const featured = [
  { src:'/images/IMG_3920.jpg', caption:'Kit distribution — sparking curiosity one child at a time', wide:true },
  { src:'/images/volunteeringimage.jpg', caption:'Volunteers making science accessible' },
  { src:'/images/P1080258.JPG', caption:'Science is for every curious mind' },
]

const chronicle = [
  {
    year:2025, era:'Present Day',
    color:'#a8d4f0', glow:'rgba(168,212,240,0.5)',
    cover:'/images/IMG_3920.jpg',
    photos:[
      { src:'/images/IMG_3920.jpg', caption:'Kit distribution event' },
      { src:'/images/volunteeringimage.jpg', caption:'Volunteer workshop' },
    ],
  },
  {
    year:2024, era:'The Mission Grows',
    color:'#c5b4f8', glow:'rgba(197,180,248,0.5)',
    cover:'/images/P1080258.JPG',
    photos:[
      { src:'/images/IMG_9240.jpg', caption:'Community outreach' },
      { src:'/images/P1080258.JPG', caption:'Science fair' },
      { src:'/images/P1080212.JPG', caption:'Workshop day' },
    ],
  },
  {
    year:2023, era:'The Beginning',
    color:'#a8e8c8', glow:'rgba(168,232,200,0.5)',
    cover:null, photos:[],
  },
]

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const photo = photos[idx]

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => (i+1) % photos.length)
      if (e.key === 'ArrowLeft') setIdx(i => (i-1+photos.length) % photos.length)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [photos.length, onClose])

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:.3}}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:700,
        background:'rgba(0,0,0,0.92)', backdropFilter:'blur(16px)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}
    >
      <button onClick={onClose} style={{
        position:'absolute',top:28,right:32,background:'none',
        border:'1px solid rgba(168,212,240,0.2)',borderRadius:8,color:'var(--muted)',
        fontSize:13,cursor:'pointer',padding:'8px 16px',
        fontFamily:"'JetBrains Mono',monospace",letterSpacing:'2px',zIndex:10,
      }}>ESC · CLOSE</button>

      {photos.length > 1 && <>
        <button onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+photos.length)%photos.length)}}
          style={{position:'absolute',left:40,zIndex:10,background:'rgba(168,212,240,0.06)',border:'1px solid rgba(168,212,240,0.15)',borderRadius:'50%',width:52,height:52,color:'var(--pastel1)',cursor:'pointer',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(168,212,240,0.14)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(168,212,240,0.06)'}
        >‹</button>
        <button onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%photos.length)}}
          style={{position:'absolute',right:40,zIndex:10,background:'rgba(168,212,240,0.06)',border:'1px solid rgba(168,212,240,0.15)',borderRadius:'50%',width:52,height:52,color:'var(--pastel1)',cursor:'pointer',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(168,212,240,0.14)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(168,212,240,0.06)'}
        >›</button>
      </>}

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{opacity:0,scale:.95,filter:'blur(8px)'}}
          animate={{opacity:1,scale:1,filter:'blur(0px)'}}
          exit={{opacity:0,scale:1.03}}
          transition={{duration:.35}}
          onClick={e=>e.stopPropagation()}
          style={{display:'flex',flexDirection:'column',alignItems:'center'}}
        >
          <img src={photo.src} alt={photo.caption}
            style={{maxWidth:'80vw',maxHeight:'70vh',objectFit:'contain',borderRadius:8,boxShadow:'0 40px 120px rgba(0,0,0,0.8)'}}
          />
          <motion.p initial={{opacity:0,y:10}} animate={{opacity:.6,y:0}} transition={{delay:.2}}
            style={{marginTop:16,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:16,color:'var(--cream)',textAlign:'center'}}>
            {photo.caption}
          </motion.p>
          <div style={{marginTop:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'2px',color:'var(--muted)',opacity:.4}}>
            {idx+1} / {photos.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ─── YEAR MODAL ───────────────────────────────────────────────────────────────
function YearModal({ data, onClose, onOpenPhoto }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:.4}}
      style={{position:'fixed',inset:0,zIndex:600,background:'rgba(2,6,18,0.97)',backdropFilter:'blur(24px)',overflowY:'auto'}}
    >
      {/* Watermark year */}
      <div style={{
        position:'fixed',bottom:-60,left:-20,
        fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(180px,20vw,280px)',
        fontWeight:300,color:data.color,opacity:.05,
        lineHeight:1,userSelect:'none',pointerEvents:'none',zIndex:0,
      }}>{data.year}</div>

      {/* Sticky top bar */}
      <div style={{position:'sticky',top:0,zIndex:10,padding:'28px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(2,6,18,0.85)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${data.color}15`}}>
        <div>
          <div className="label" style={{color:data.color,fontSize:9,marginBottom:6}}>{data.era}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:300,color:'var(--cream)',lineHeight:1}}>{data.year}</div>
        </div>
        <button onClick={onClose} style={{
          background:'none',border:`1px solid ${data.color}33`,borderRadius:8,
          color:'var(--muted)',fontSize:13,cursor:'pointer',padding:'8px 16px',
          fontFamily:"'JetBrains Mono',monospace",letterSpacing:'2px',transition:'all .2s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=data.color;e.currentTarget.style.color=data.color}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=data.color+'33';e.currentTarget.style.color='var(--muted)'}}
        >ESC · CLOSE</button>
      </div>

      {/* Photo grid */}
      <motion.div
        initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:.15,duration:.55,ease:[.4,0,.2,1]}}
        style={{position:'relative',zIndex:1,padding:'48px 48px 80px'}}
      >
        {data.photos.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 0'}}>
            <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.3}}
              style={{fontFamily:"'Cormorant Garamond',serif",fontSize:72,color:data.color,opacity:.3,marginBottom:24}}>◎</motion.div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:22,color:'var(--muted)'}}>Archive forthcoming.</p>
            <p style={{fontSize:13,color:'var(--muted)',opacity:.5,marginTop:8}}>Photos from this chapter will be added soon.</p>
          </div>
        ) : (
          <div style={{columns:3,columnGap:12}}>
            {data.photos.map((photo, i) => (
              <motion.div key={photo.src}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2+i*.1,duration:.5}}
                onClick={() => onOpenPhoto(i)}
                style={{breakInside:'avoid',marginBottom:12,borderRadius:10,overflow:'hidden',cursor:'pointer',position:'relative',border:`1px solid ${data.color}15`}}
                whileHover={{scale:1.02}}
              >
                <img src={photo.src} alt={photo.caption} style={{width:'100%',display:'block',objectFit:'cover'}}/>
                <motion.div
                  initial={{opacity:0}} whileHover={{opacity:1}}
                  style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 50%)',display:'flex',alignItems:'flex-end',padding:16}}
                >
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:14,color:'var(--cream)'}}>{photo.caption}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ─── YEAR PILLAR ─────────────────────────────────────────────────────────────
function YearPillar({ data, index, onClick }) {
  const [hov, setHov] = useState(false)
  const hasPhotos = data.photos.length > 0

  return (
    <motion.div
      initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      transition={{duration:.8,delay:index*.15,ease:[.4,0,.2,1]}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      onClick={()=>onClick(data)}
      style={{
        position:'relative',width:200,height:460,borderRadius:16,overflow:'hidden',
        cursor: hasPhotos ? 'pointer' : 'default',
        border:`1px solid ${hov && hasPhotos ? data.color+'55' : data.color+'1a'}`,
        background:'#070d1e', flexShrink:0,
        transition:'border-color .4s, box-shadow .4s',
        boxShadow: hov && hasPhotos ? `0 0 40px ${data.glow.replace('.5','.15')}, 0 20px 60px rgba(0,0,0,0.5)` : '0 8px 40px rgba(0,0,0,0.4)',
      }}
    >
      {data.cover && (
        <motion.img src={data.cover} alt=""
          animate={{opacity: hov ? .3 : .12, scale: hov ? 1.07 : 1}} transition={{duration:.6}}
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}
        />
      )}
      <div style={{position:'absolute',inset:0,background:`linear-gradient(to top,${data.color}2a 0%,transparent 50%,${data.color}0d 100%)`}}/>

      {/* Top accent line on hover */}
      <motion.div animate={{scaleX: hov && hasPhotos ? 1 : 0, opacity: hov && hasPhotos ? 1 : 0}}
        transition={{duration:.4}}
        style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${data.color},transparent)`,transformOrigin:'center',zIndex:4}}
      />

      <div style={{position:'absolute',top:28,left:0,right:0,textAlign:'center',zIndex:2}}>
        <div className="label" style={{color:data.color,fontSize:9,opacity: hov ? .9 : .5,transition:'opacity .3s'}}>{data.era}</div>
      </div>

      {/* Large year watermark */}
      <div style={{
        position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        fontFamily:"'Cormorant Garamond',serif",fontSize:110,fontWeight:300,
        color:data.color,opacity: hov ? .2 : .1,lineHeight:1,
        userSelect:'none',zIndex:1,transition:'opacity .4s',
      }}>{data.year}</div>

      {/* Bottom */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:3,padding:'50px 24px 28px',background:`linear-gradient(to top,${data.color}1e 0%,transparent 100%)`}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:58,fontWeight:300,color:data.color,lineHeight:1,marginBottom:8}}>{data.year}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'2px',color:'var(--muted)',opacity:.7}}>
          {hasPhotos ? `${data.photos.length} photos` : 'Archive pending'}
        </div>
        <AnimatePresence>
          {hov && hasPhotos && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}} transition={{duration:.25}}
              style={{marginTop:14,display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:16,height:1,background:data.color}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'2px',color:data.color,textTransform:'uppercase'}}>View Archive →</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── MAIN GALLERY ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const [featuredLightbox, setFeaturedLightbox] = useState(null)
  const [activeYear, setActiveYear] = useState(null)
  const [yearLightbox, setYearLightbox] = useState(null)

  return (
    <PageTransition>
      <div style={{position:'relative',zIndex:1,minHeight:'100vh'}}>

        {/* ── PAGE HEADER ── */}
        <div style={{padding:'120px 56px 56px',textAlign:'center'}}>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
            <div className="label" style={{marginBottom:14}}>The Gallery</div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(44px,6vw,80px)',fontWeight:300,color:'var(--cream)',lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:14}}>
              Science, in the wild.<br/>
              <em style={{color:'var(--pastel1)',fontStyle:'italic'}}>Moments that matter.</em>
            </h1>
          </motion.div>
        </div>

        {/* ── FEATURED HERO GRID ── */}
        <motion.div
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.2}}
          style={{
            margin:'0 40px 80px',
            display:'grid', gridTemplateColumns:'2fr 1fr',
            gridTemplateRows:'1fr 1fr', gap:10,
            height:'62vh', minHeight:400,
            borderRadius:20, overflow:'hidden',
          }}
        >
          {featured.map((photo, i) => (
            <motion.div key={photo.src} onClick={() => setFeaturedLightbox(i)}
              style={{
                position:'relative', cursor:'pointer', overflow:'hidden',
                gridRow: i===0 ? '1 / 3' : 'auto',
                borderRadius: i===0 ? '16px 0 0 16px' : i===1 ? '0 16px 0 0' : '0 0 16px 0',
              }}
              whileHover={{zIndex:2}}
            >
              <motion.img src={photo.src} alt={photo.caption}
                whileHover={{scale:1.06}} transition={{duration:.6,ease:[.4,0,.2,1]}}
                style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
              />
              <motion.div initial={{opacity:0}} whileHover={{opacity:1}} transition={{duration:.3}}
                style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)',display:'flex',alignItems:'flex-end',padding:24}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:16,color:'var(--cream)'}}>{photo.caption}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CHRONICLE SECTION ── */}
        <div style={{padding:'0 40px 120px'}}>
          <motion.div
            initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            transition={{duration:.8}}
            style={{marginBottom:56,display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24}}
          >
            <div>
              <div className="label" style={{marginBottom:12}}>Our Journey</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(36px,4vw,56px)',fontWeight:300,color:'var(--cream)',letterSpacing:'-0.02em',lineHeight:1.05}}>
                The Chronicle
              </h2>
            </div>
            <p style={{fontSize:14,color:'var(--muted)',maxWidth:280,textAlign:'right',lineHeight:1.7,opacity:.7}}>
              Click a year to explore its archive and relive the moments that built CurioCrate.
            </p>
          </motion.div>

          {/* Pillars */}
          <div style={{position:'relative'}}>
            <div style={{
              position:'absolute',top:'50%',left:100,right:100,height:1,
              background:'linear-gradient(to right,transparent,rgba(168,212,240,0.1),rgba(168,212,240,0.15),rgba(168,212,240,0.1),transparent)',
              pointerEvents:'none',zIndex:0,
            }}/>
            <div style={{display:'flex',gap:24,justifyContent:'center',position:'relative',zIndex:1,flexWrap:'wrap'}}>
              {chronicle.map((data, i) => (
                <YearPillar key={data.year} data={data} index={i} onClick={setActiveYear}/>
              ))}
            </div>
          </div>
        </div>

        {/* ── FEATURED LIGHTBOX ── */}
        <AnimatePresence>
          {featuredLightbox !== null && (
            <Lightbox photos={featured} startIndex={featuredLightbox} onClose={()=>setFeaturedLightbox(null)}/>
          )}
        </AnimatePresence>

        {/* ── YEAR MODAL ── */}
        <AnimatePresence>
          {activeYear && (
            <YearModal
              data={activeYear}
              onClose={()=>{ setActiveYear(null); setYearLightbox(null) }}
              onOpenPhoto={i=>setYearLightbox(i)}
            />
          )}
        </AnimatePresence>

        {/* ── YEAR LIGHTBOX (above year modal) ── */}
        <AnimatePresence>
          {activeYear && yearLightbox !== null && (
            <Lightbox photos={activeYear.photos} startIndex={yearLightbox} onClose={()=>setYearLightbox(null)}/>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
