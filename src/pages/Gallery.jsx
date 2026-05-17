import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'

const photos = [
  { src:'/images/IMG_3920.jpg',         caption:'Community STEM event',    span:2 },
  { src:'/images/volunteeringimage.jpg', caption:'Volunteers in action',    span:1 },
  { src:'/images/P1080258.JPG',         caption:'Hands-on exploration',    span:1 },
  { src:'/images/P1080212.JPG',         caption:'Kit delivery day',        span:1 },
  { src:'/images/IMG_9240.jpg',         caption:'Science fair showcase',   span:2 },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <PageTransition>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.4 }}
            onClick={() => setLightbox(null)}
            style={{
              position:'fixed', inset:0, zIndex:200,
              background:'rgba(3,5,15,0.95)',
              backdropFilter:'blur(20px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer',
            }}
          >
            <motion.div
              initial={{ scale:0.88, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.88, opacity:0 }}
              transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
              onClick={e => e.stopPropagation()}
              style={{ position:'relative', maxWidth:'88vw', maxHeight:'85vh' }}
            >
              <img
                src={photos[lightbox].src}
                alt=""
                style={{
                  maxWidth:'88vw', maxHeight:'82vh',
                  objectFit:'contain', borderRadius:6,
                  border:'1px solid rgba(168,212,240,0.12)',
                  boxShadow:'0 0 80px rgba(168,212,240,0.1)',
                }}
              />
              <div style={{
                position:'absolute', bottom:-40, left:'50%', transform:'translateX(-50%)',
                fontFamily:"'JetBrains Mono', monospace",
                fontSize:11, letterSpacing:'3px', textTransform:'uppercase',
                color:'var(--muted)',
              }}>
                {photos[lightbox].caption}
              </div>
              {/* Nav arrows */}
              {lightbox > 0 && (
                <button onClick={e=>{e.stopPropagation();setLightbox(lightbox-1)}}
                  style={{
                    position:'absolute', left:-60, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'1px solid rgba(168,212,240,0.2)',
                    borderRadius:3, color:'var(--pastel1)',
                    padding:'12px 16px', cursor:'pointer', fontSize:18,
                  }}>←</button>
              )}
              {lightbox < photos.length-1 && (
                <button onClick={e=>{e.stopPropagation();setLightbox(lightbox+1)}}
                  style={{
                    position:'absolute', right:-60, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'1px solid rgba(168,212,240,0.2)',
                    borderRadius:3, color:'var(--pastel1)',
                    padding:'12px 16px', cursor:'pointer', fontSize:18,
                  }}>→</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ minHeight:'100vh', padding:'120px 40px 80px', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9 }}
            style={{ marginBottom:72, textAlign:'center' }}
          >
            <div className="label" style={{ marginBottom:16 }}>The Archive</div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:'clamp(48px,7vw,88px)',
              fontWeight:300, color:'var(--cream)',
              lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:16,
            }}>
              Moments from<br/>
              <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>the field.</em>
            </h1>
            <p style={{ color:'var(--muted)', fontSize:15, maxWidth:400, margin:'0 auto' }}>
              Every photograph is a memory of a child discovering something for the first time.
            </p>
          </motion.div>

          {/* Masonry grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(3, 1fr)',
            gridAutoRows:'280px',
            gap:10,
          }}>
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:30 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-50px' }}
                transition={{ duration:0.8, delay:i*0.1, ease:[0.4,0,0.2,1] }}
                whileHover={{ scale:1.015, zIndex:10 }}
                onClick={() => setLightbox(i)}
                style={{
                  gridColumn: photo.span > 1 ? `span ${photo.span}` : 'span 1',
                  position:'relative', borderRadius:6,
                  overflow:'hidden', cursor:'pointer',
                  border:'1px solid rgba(168,212,240,0.06)',
                  background:'rgba(10,20,50,0.3)',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  style={{
                    width:'100%', height:'100%',
                    objectFit:'cover',
                    transition:'transform 0.7s ease, filter 0.5s ease',
                    filter:'brightness(0.88) saturate(0.9)',
                  }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.transform='scale(1.06)'
                    e.currentTarget.style.filter='brightness(1) saturate(1.1)'
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.transform='scale(1)'
                    e.currentTarget.style.filter='brightness(0.88) saturate(0.9)'
                  }}
                />
                {/* Overlay */}
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(to top, rgba(6,13,31,0.75) 0%, transparent 55%)',
                  opacity:0, transition:'opacity 0.4s ease',
                  display:'flex', alignItems:'flex-end', padding:20,
                }}
                onMouseEnter={e=>{e.currentTarget.style.opacity=1}}
                onMouseLeave={e=>{e.currentTarget.style.opacity=0}}
                >
                  <div>
                    <div style={{
                      fontFamily:"'JetBrains Mono', monospace",
                      fontSize:11, letterSpacing:'2px', textTransform:'uppercase',
                      color:'var(--pastel2)',
                    }}>
                      {photo.caption}
                    </div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>
                      Click to expand
                    </div>
                  </div>
                </div>

                {/* Index number */}
                <div style={{
                  position:'absolute', top:16, left:16,
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:10, letterSpacing:'2px',
                  color:'rgba(168,212,240,0.4)',
                }}>
                  {String(i+1).padStart(2,'0')}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Film strip decoration */}
          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.4, duration:1 }}
            style={{ marginTop:64, textAlign:'center' }}
          >
            <div style={{
              display:'inline-flex', alignItems:'center', gap:16,
              color:'var(--muted)',
              fontFamily:"'JetBrains Mono', monospace", fontSize:10, letterSpacing:'3px',
            }}>
              <div style={{ width:48, height:1, background:'rgba(168,212,240,0.2)' }}/>
              {photos.length} frames · {photos.length} stories
              <div style={{ width:48, height:1, background:'rgba(168,212,240,0.2)' }}/>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
