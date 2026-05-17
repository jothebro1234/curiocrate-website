import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a3e 0%, #312e81 40%, #4338ca 70%, #6366F1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 24px 80px',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Floating emoji decorations */}
      {[
        { emoji: '⚗️', top: '15%', left: '8%', size: 32, delay: '0s' },
        { emoji: '🔭', top: '20%', right: '10%', size: 36, delay: '0.5s' },
        { emoji: '🧬', bottom: '25%', left: '6%', size: 28, delay: '1s' },
        { emoji: '💡', bottom: '20%', right: '8%', size: 30, delay: '0.7s' },
        { emoji: '🪐', top: '55%', right: '4%', size: 26, delay: '1.2s' },
        { emoji: '⚡', top: '40%', left: '4%', size: 24, delay: '0.3s' },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            opacity: 0.6,
            animation: `float 3s ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Content */}
      <div
        style={{
          maxWidth: 800,
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 100,
            padding: '8px 18px',
            marginBottom: 32,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Sparkles size={14} color="#F59E0B" />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.5px',
            }}
          >
            STEM Education for Every Kid
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 7vw, 76px)',
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            margin: '0 0 24px',
          }}
        >
          Igniting{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #F59E0B, #FB923C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Curiosity
          </span>
          ,<br />
          One Kit at a Time.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7,
            margin: '0 auto 48px',
            maxWidth: 560,
          }}
        >
          CurioCrate delivers hands-on science kits to underserved communities,
          sparking a love for STEM in the next generation of innovators.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#1a1a3e',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
              boxShadow: '0 8px 30px rgba(245,158,11,0.45)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(245,158,11,0.55)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.45)'
            }}
          >
            Shop Kits
            <ArrowRight size={18} />
          </a>
          <a
            href="#mission"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            }}
          >
            Our Mission
          </a>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            marginTop: 72,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: 0.5,
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, transparent, #fff)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  )
}
