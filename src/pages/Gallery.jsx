import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { featured, chronicle } from '../data/gallery'

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const photo = photos[idx]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [photos.length, onClose])

  return createPortal(
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:.3 }}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:700,
        background:'rgba(0,0,0,0.95)', backdropFilter:'blur(20px)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}
    >
      <button onClick={onClose} style={{
        position:'absolute', top:28, right:32, background:'none',
        border:'1px solid rgba(168,212,240,0.2)', borderRadius:8, color:'var(--muted)',
        fontSize:13, cursor:'pointer', padding:'8px 16px',
        fontFamily:"'JetBrains Mono',monospace", letterSpacing:'2px', zIndex:10,
      }}>ESC · CLOSE</button>

      {photos.length > 1 && <>
        <button
          onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length) }}
          style={{ position:'absolute', left:40, zIndex:10, background:'rgba(168,212,240,0.06)', border:'1px solid rgba(168,212,240,0.15)', borderRadius:'50%', width:52, height:52, color:'var(--pastel1)', cursor:'pointer', fontSize:24, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,212,240,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,212,240,0.06)'}
        >‹</button>
        <button
          onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length) }}
          style={{ position:'absolute', right:40, zIndex:10, background:'rgba(168,212,240,0.06)', border:'1px solid rgba(168,212,240,0.15)', borderRadius:'50%', width:52, height:52, color:'var(--pastel1)', cursor:'pointer', fontSize:24, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,212,240,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,212,240,0.06)'}
        >›</button>
      </>}

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity:0, scale:.95, filter:'blur(8px)' }}
          animate={{ opacity:1, scale:1, filter:'blur(0px)' }}
          exit={{ opacity:0, scale:1.03 }}
          transition={{ duration:.35 }}
          onClick={e => e.stopPropagation()}
          style={{ display:'flex', flexDirection:'column', alignItems:'center' }}
        >
          <img src={photo.src} alt={photo.caption}
            style={{ maxWidth:'80vw', maxHeight:'75vh', objectFit:'contain', borderRadius:8, boxShadow:'0 40px 120px rgba(0,0,0,0.8)' }}
          />
          <motion.p
            initial={{ opacity:0, y:10 }} animate={{ opacity:.6, y:0 }} transition={{ delay:.2 }}
            style={{ marginTop:16, fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:16, color:'var(--cream)', textAlign:'center' }}
          >{photo.caption}</motion.p>
          <div style={{ marginTop:8, fontFamily:"'JetBrains Mono',monospace", fontSize:9, letterSpacing:'2px', color:'var(--muted)', opacity:.4 }}>
            {idx + 1} / {photos.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>,
    document.body
  )
}

// ─── YEAR MODAL ───────────────────────────────────────────────────────────────
function YearModal({ data, onClose, onOpenPhoto }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return createPortal(
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:.4 }}
      style={{ position:'fixed', inset:0, zIndex:600, background:'rgba(2,6,18,0.97)', backdropFilter:'blur(24px)', overflowY:'auto' }}
    >
      <div style={{
        position:'fixed', bottom:-60, left:-20,
        fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(180px,20vw,280px)',
        fontWeight:300, color:data.color, opacity:.05,
        lineHeight:1, userSelect:'none', pointerEvents:'none', zIndex:0,
      }}>{data.year}</div>

      <div style={{ position:'sticky', top:0, zIndex:10, padding:'28px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(2,6,18,0.85)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${data.color}15` }}>
        <div>
          <div className="label" style={{ color:data.color, fontSize:9, marginBottom:6 }}>{data.era}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:300, color:'var(--cream)', lineHeight:1 }}>{data.year}</div>
        </div>
        <button onClick={onClose} style={{
          background:'none', border:`1px solid ${data.color}33`, borderRadius:8,
          color:'var(--muted)', fontSize:13, cursor:'pointer', padding:'8px 16px',
          fontFamily:"'JetBrains Mono',monospace", letterSpacing:'2px', transition:'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = data.color; e.currentTarget.style.color = data.color }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = data.color + '33'; e.currentTarget.style.color = 'var(--muted)' }}
        >ESC · CLOSE</button>
      </div>

      <motion.div
        initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:.15, duration:.55, ease:[.4,0,.2,1] }}
        style={{ position:'relative', zIndex:1, padding:'48px 48px 80px' }}
      >
        {data.photos.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.3 }}
              style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:72, color:data.color, opacity:.3, marginBottom:24 }}>◎</motion.div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:22, color:'var(--muted)' }}>Archive forthcoming.</p>
            <p style={{ fontSize:13, color:'var(--muted)', opacity:.5, marginTop:8 }}>Photos from this chapter will be added soon.</p>
          </div>
        ) : (
          <div style={{ columns:3, columnGap:12 }}>
            {data.photos.map((photo, i) => (
              <motion.div key={photo.src}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:.2 + i * .1, duration:.5 }}
                onClick={() => onOpenPhoto(i)}
                style={{ breakInside:'avoid', marginBottom:12, borderRadius:10, overflow:'hidden', cursor:'pointer', position:'relative', border:`1px solid ${data.color}15` }}
                whileHover={{ scale:1.02 }}
              >
                <img src={photo.src} alt={photo.caption} style={{ width:'100%', display:'block', objectFit:'cover' }} />
                <motion.div
                  initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                  style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 50%)', display:'flex', alignItems:'flex-end', padding:16 }}
                >
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:14, color:'var(--cream)' }}>{photo.caption}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ─── CHRONICLE HERO ───────────────────────────────────────────────────────────
function ChronicleHero({ onOpenYear, onScrollDown }) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const current = chronicle[idx]

  const go = (newIdx) => {
    setDir(newIdx > idx ? 1 : -1)
    setIdx(newIdx)
  }

  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowRight') { setDir(1);  setIdx(i => (i + 1) % chronicle.length) }
      if (e.key === 'ArrowLeft')  { setDir(-1); setIdx(i => (i - 1 + chronicle.length) % chronicle.length) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const slideVariants = {
    enter:  (d) => ({ x: d > 0 ? '6%' : '-6%', opacity:0, filter:'blur(16px)', scale:1.04 }),
    center: { x:'0%', opacity:1, filter:'blur(0px)', scale:1 },
    exit:   (d) => ({ x: d > 0 ? '-6%' : '6%', opacity:0, filter:'blur(8px)', scale:0.97 }),
  }

  return (
    <div style={{ position:'relative', height:'100vh', overflow:'hidden', background:'var(--void)' }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current.year}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration:0.75, ease:[0.4,0,0.2,1] }}
          style={{ position:'absolute', inset:0 }}
        >
          {current.cover && (
            <motion.img
              src={current.cover}
              alt=""
              initial={{ scale: idx % 2 === 0 ? 1.12 : 1.0 }}
              animate={{ scale: idx % 2 === 0 ? 1.0 : 1.12 }}
              transition={{ duration: 20, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
              style={{
                position:'absolute', inset:0,
                width:'100%', height:'100%',
                objectFit:'cover',
                filter:'brightness(0.28) saturate(0.5)',
                transformOrigin: idx % 2 === 0 ? '50% 52%' : '52% 48%',
              }}
            />
          )}

          {/* Color atmosphere */}
          <div style={{
            position:'absolute', inset:0,
            background:`radial-gradient(ellipse 90% 70% at 50% 50%, ${current.color}16 0%, rgba(3,5,15,0.72) 100%)`,
          }} />
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(to bottom, rgba(3,5,15,0.5) 0%, transparent 25%, transparent 72%, rgba(3,5,15,0.7) 100%)',
          }} />

          {/* Ghost year watermark */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%, -52%)',
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:'clamp(300px,42vw,520px)',
            fontWeight:300, lineHeight:0.8,
            color:current.color, opacity:0.03,
            letterSpacing:'-0.06em',
            userSelect:'none', pointerEvents:'none',
          }}>{current.year}</div>

          {/* Center content */}
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', zIndex:2,
            paddingBottom: 148,
          }}>
            <motion.div
              initial={{ opacity:0, y:20 }} animate={{ opacity:0.72, y:0 }}
              transition={{ delay:0.1, duration:0.6 }}
              className="label"
              style={{ color:current.color, marginBottom:20, letterSpacing:7, fontSize:11 }}
            >
              {current.era}
            </motion.div>

            <motion.div
              initial={{ opacity:0, y:28, scale:0.94 }}
              animate={{ opacity:1, y:0, scale:1 }}
              transition={{ delay:0.04, duration:0.85, ease:[0.4,0,0.2,1] }}
              onClick={() => current.photos.length > 0 && onOpenYear(current)}
              style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:'clamp(108px,15vw,196px)',
                fontWeight:300, lineHeight:0.9,
                color:current.color,
                textShadow:`0 0 100px ${current.glow}, 0 0 200px ${current.color}44`,
                letterSpacing:'-0.04em',
                cursor:current.photos.length > 0 ? 'pointer' : 'default',
                userSelect:'none',
              }}
            >
              {current.year}
            </motion.div>

            <motion.div
              initial={{ scaleX:0 }}
              animate={{ scaleX:1 }}
              transition={{ delay:0.28, duration:0.9, ease:[0.4,0,0.2,1] }}
              style={{
                width:72, height:1, margin:'28px 0',
                background:`linear-gradient(to right, transparent, ${current.color}80, transparent)`,
                transformOrigin:'center',
              }}
            />

            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:0.55 }}
              transition={{ delay:0.38, duration:0.6 }}
              style={{
                fontFamily:"'JetBrains Mono', monospace",
                fontSize:10, letterSpacing:4,
                color:'var(--muted)', textTransform:'uppercase',
              }}
            >
              {current.photos.length > 0
                ? `${current.photos.length} photo${current.photos.length !== 1 ? 's' : ''} · click to explore`
                : 'Archive forthcoming'
              }
            </motion.div>

            {current.photos.length > 0 && (
              <motion.div
                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.52, duration:0.6 }}
                style={{ marginTop:28 }}
              >
                <div style={{
                  width:1, height:40,
                  background:`linear-gradient(to bottom, ${current.color}90, transparent)`,
                  margin:'0 auto', animation:'breathe 2.5s ease-in-out infinite',
                }} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left arrow */}
      <button
        onClick={() => { setDir(-1); setIdx(i => (i - 1 + chronicle.length) % chronicle.length) }}
        style={{
          position:'absolute', left:24, top:'50%', transform:'translateY(-50%)',
          zIndex:10, background:'rgba(3,5,15,0.65)',
          border:'1px solid rgba(168,212,240,0.22)',
          borderRadius:48, padding:'16px 20px',
          color:'var(--pastel1)', cursor:'pointer',
          display:'flex', alignItems:'center', gap:12,
          transition:'all 0.3s', backdropFilter:'blur(12px)',
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.12)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.45)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,212,240,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(3,5,15,0.65)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.22)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        <span style={{ fontSize:22, lineHeight:1 }}>←</span>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, letterSpacing:'2.5px', color:'var(--muted)', opacity:0.5, textTransform:'uppercase', marginBottom:3 }}>Prev</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, color:'var(--cream)', lineHeight:1 }}>
            {chronicle[(idx - 1 + chronicle.length) % chronicle.length].year}
          </div>
        </div>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => { setDir(1); setIdx(i => (i + 1) % chronicle.length) }}
        style={{
          position:'absolute', right:24, top:'50%', transform:'translateY(-50%)',
          zIndex:10, background:'rgba(3,5,15,0.65)',
          border:'1px solid rgba(168,212,240,0.22)',
          borderRadius:48, padding:'16px 20px',
          color:'var(--pastel1)', cursor:'pointer',
          display:'flex', alignItems:'center', gap:12,
          transition:'all 0.3s', backdropFilter:'blur(12px)',
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.12)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.45)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,212,240,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(3,5,15,0.65)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.22)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, letterSpacing:'2.5px', color:'var(--muted)', opacity:0.5, textTransform:'uppercase', marginBottom:3 }}>Next</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:300, color:'var(--cream)', lineHeight:1 }}>
            {chronicle[(idx + 1) % chronicle.length].year}
          </div>
        </div>
        <span style={{ fontSize:22, lineHeight:1 }}>→</span>
      </button>

      {/* Timeline */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:10,
        background:'linear-gradient(to top, rgba(3,5,15,0.98) 0%, rgba(3,5,15,0.72) 52%, transparent 100%)',
        padding:'0 80px 30px',
      }}>
        <div style={{ position:'relative' }}>
          {/* Track base */}
          <div style={{
            position:'absolute', top:18, left:28, right:28, height:1,
            background:'rgba(168,212,240,0.1)',
          }} />
          {/* Animated progress fill */}
          <motion.div
            animate={{
              width: chronicle.length > 1
                ? `calc(${(idx / (chronicle.length - 1)) * 100}% - 56px)`
                : '0%',
            }}
            transition={{ duration:0.75, ease:[0.4,0,0.2,1] }}
            style={{
              position:'absolute', top:18, left:28, height:1,
              background:`linear-gradient(to right, ${chronicle[0].color}50, ${current.color}dd)`,
              boxShadow:`0 0 10px ${current.color}60`,
            }}
          />
          {/* Nodes row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
            {chronicle.map((c, i) => {
              const active = i === idx
              return (
                <button key={c.year} onClick={() => go(i)} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:7,
                  background:'none', border:'none', cursor:'pointer', padding:0,
                  minWidth:56,
                }}>
                  {/* Circle + pulse ring */}
                  <div style={{ position:'relative', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {active && (
                      <motion.div
                        animate={{ scale:[1, 2.5], opacity:[0.55, 0] }}
                        transition={{ duration:2.2, repeat:Infinity, ease:'easeOut' }}
                        style={{
                          position:'absolute', width:14, height:14,
                          borderRadius:'50%',
                          border:`1px solid ${c.color}`,
                          pointerEvents:'none',
                        }}
                      />
                    )}
                    <motion.div
                      animate={{
                        width: active ? 14 : 7,
                        height: active ? 14 : 7,
                        background: active ? c.color : 'rgba(168,212,240,0.2)',
                        boxShadow: active ? `0 0 20px ${c.color}90, 0 0 40px ${c.color}40` : 'none',
                      }}
                      transition={{ duration:0.45 }}
                      style={{ borderRadius:'50%' }}
                    />
                  </div>
                  {/* Year */}
                  <div style={{
                    fontFamily:"'JetBrains Mono', monospace",
                    fontSize:11, letterSpacing:'3px',
                    color: active ? c.color : 'rgba(168,212,240,0.28)',
                    transition:'color 0.4s', lineHeight:1,
                  }}>{c.year}</div>
                  {/* Era */}
                  <div style={{
                    fontFamily:"'Plus Jakarta Sans', sans-serif",
                    fontSize:8, letterSpacing:'2px',
                    color: active ? 'rgba(168,212,240,0.52)' : 'rgba(168,212,240,0.15)',
                    textTransform:'uppercase', transition:'color 0.4s',
                    lineHeight:1, textAlign:'center', maxWidth:80,
                  }}>{c.era}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Explore photos button */}
      <motion.button
        initial={{ opacity:0, y:8 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:1.1, duration:0.7 }}
        onClick={onScrollDown}
        style={{
          position:'absolute', bottom:112, left:'50%', transform:'translateX(-50%)',
          zIndex:10,
          background:'rgba(168,212,240,0.07)',
          border:'1px solid rgba(168,212,240,0.28)',
          borderRadius:32, padding:'12px 30px',
          color:'var(--pastel1)', cursor:'pointer',
          display:'flex', alignItems:'center', gap:10,
          fontFamily:"'JetBrains Mono', monospace",
          fontSize:9, letterSpacing:'3px', textTransform:'uppercase',
          backdropFilter:'blur(10px)', transition:'all 0.3s',
          whiteSpace:'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.16)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.55)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(168,212,240,0.18)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,212,240,0.07)'; e.currentTarget.style.borderColor = 'rgba(168,212,240,0.28)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        Explore Photos ↓
      </motion.button>

      {/* Top-right counter */}
      <div style={{
        position:'absolute', top:48, right:48,
        fontFamily:"'JetBrains Mono', monospace",
        fontSize:10, letterSpacing:3,
        color:'var(--muted)', opacity:0.38, zIndex:10,
      }}>
        {String(idx + 1).padStart(2, '0')} / {String(chronicle.length).padStart(2, '0')}
      </div>

    </div>
  )
}

// ─── MAIN GALLERY ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const [featuredLightbox, setFeaturedLightbox] = useState(null)
  const [activeYear, setActiveYear]             = useState(null)
  const [yearLightbox, setYearLightbox]         = useState(null)
  const featuredRef = useRef(null)

  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory'
    return () => { document.documentElement.style.scrollSnapType = '' }
  }, [])

  return (
    <PageTransition>
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>

        {/* ── CHRONICLE HERO — full screen, snaps here ── */}
        <div style={{ scrollSnapAlign:'start', scrollSnapStop:'always' }}>
          <ChronicleHero
            onOpenYear={setActiveYear}
            onScrollDown={() => featuredRef.current?.scrollIntoView({ behavior:'smooth' })}
          />
        </div>

        {/* ── FEATURED PHOTOS — snaps here ── */}
        <div ref={featuredRef} style={{ scrollSnapAlign:'start' }}>
        <section style={{ padding:'100px 40px 120px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.8 }}
              style={{ marginBottom:56, textAlign:'center' }}
            >
              <div className="label" style={{ marginBottom:14 }}>In Focus</div>
              <h2 style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:'clamp(36px,4vw,56px)',
                fontWeight:300, color:'var(--cream)', lineHeight:1.05,
              }}>
                Science, in the wild.<br/>
                <em style={{ color:'var(--pastel1)', fontStyle:'italic' }}>Moments that matter.</em>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:.9, delay:.15 }}
              style={{
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
                    gridRow: i === 0 ? '1 / 3' : 'auto',
                    borderRadius: i === 0 ? '16px 0 0 16px' : i === 1 ? '0 16px 0 0' : '0 0 16px 0',
                  }}
                  whileHover={{ zIndex:2 }}
                >
                  <motion.img src={photo.src} alt={photo.caption}
                    whileHover={{ scale:1.06 }} transition={{ duration:.6, ease:[.4,0,.2,1] }}
                    style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  />
                  <motion.div initial={{ opacity:0 }} whileHover={{ opacity:1 }} transition={{ duration:.3 }}
                    style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%)', display:'flex', alignItems:'flex-end', padding:24 }}>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:16, color:'var(--cream)' }}>{photo.caption}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        </div>

        {/* ── FEATURED LIGHTBOX ── */}
        <AnimatePresence>
          {featuredLightbox !== null && (
            <Lightbox photos={featured} startIndex={featuredLightbox} onClose={() => setFeaturedLightbox(null)} />
          )}
        </AnimatePresence>

        {/* ── YEAR MODAL ── */}
        <AnimatePresence>
          {activeYear && (
            <YearModal
              data={activeYear}
              onClose={() => { setActiveYear(null); setYearLightbox(null) }}
              onOpenPhoto={i => setYearLightbox(i)}
            />
          )}
        </AnimatePresence>

        {/* ── YEAR LIGHTBOX (above year modal) ── */}
        <AnimatePresence>
          {activeYear && yearLightbox !== null && (
            <Lightbox
              photos={activeYear.photos}
              startIndex={yearLightbox}
              onClose={() => setYearLightbox(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  )
}
