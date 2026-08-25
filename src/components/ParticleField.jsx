import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PARTICLE_COUNT = 120
const PARTICLE_COUNT_MOBILE = 40
// The nearby-particle connecting lines are an O(n^2) distance check every frame — cheap
// enough at desktop particle counts, but a real cost on low-power mobile GPUs/CPUs. Skip
// them on mobile rather than just thinning particles, since that loop (not particle count
// alone) is the actual expensive part.
const MOBILE_BREAKPOINT = 768

// Kept in sync with CinematicNavbar.jsx's LIGHT_ROUTE_PREFIX — the Creator Program
// (Kit Research Internship) page is a dedicated light-mode design. The pale-blue
// star/nebula colors below are tuned for the dark background; on white they'd be
// nearly invisible, so swap to a low-alpha CurioCrate-blue tint instead.
const LIGHT_ROUTE_PREFIX = '/initiatives/kits'

function rand(min, max) { return Math.random() * (max - min) + min }

export default function ParticleField() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const particles = useRef([])
  const location = useLocation()
  const isLight = location.pathname.startsWith(LIGHT_ROUTE_PREFIX)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT
    const starColor = isLight ? '11,27,51'  : '197,227,247'
    const nebulaColor = isLight ? '27,127,232' : '168,212,240'
    const lineColor = isLight ? '27,127,232' : '168,212,240'
    let raf

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mouse.current = { x: e.clientX, y: e.clientY } })

    particles.current = Array.from({ length: particleCount }, () => ({
      x:    rand(0, window.innerWidth),
      y:    rand(0, window.innerHeight),
      vx:   rand(-0.15, 0.15),
      vy:   rand(-0.15, 0.15),
      r:    rand(0.5, 2.2),
      a:    rand(0.1, 0.5),
      type: Math.random() > 0.85 ? 'nebula' : 'star',
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y

      particles.current.forEach((p, i) => {
        // Mouse repulsion — gentle drift away
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.3
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
        // Dampen
        p.vx *= 0.995
        p.vy *= 0.995
        p.x += p.vx
        p.y += p.vy

        // Wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        if (p.type === 'nebula') {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 20)
          grad.addColorStop(0, `rgba(${nebulaColor},${p.a * 0.5})`)
          grad.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 20, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${starColor},${p.a})`
          ctx.fill()
        }

        // Connect nearby particles (desktop only — see MOBILE_BREAKPOINT note above)
        if (!isMobile) {
          for (let j = i + 1; j < particles.current.length; j++) {
            const q = particles.current[j]
            const cx = p.x - q.x
            const cy = p.y - q.y
            const d = Math.sqrt(cx*cx + cy*cy)
            if (d < 90) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(${lineColor},${(1 - d/90) * 0.06})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [isLight])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}
    />
  )
}
