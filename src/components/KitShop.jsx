import { ShoppingCart, Star } from 'lucide-react'

// Replace STRIPE_LINK values with your real Stripe payment links
const kits = [
  {
    name: 'Chemistry Explorer Kit',
    emoji: '⚗️',
    description:
      'Mix, react, and discover! This kit includes safe household chemicals, pH strips, and 10 guided experiments exploring acid-base reactions.',
    price: '$24.99',
    tag: 'Best Seller',
    tagColor: '#F59E0B',
    tagBg: '#FFFBEB',
    gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    accentColor: '#D97706',
    stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE',
    includes: ['pH strips', '10 experiment cards', 'Safety goggles', 'Lab journal'],
  },
  {
    name: 'Robotics Starter Kit',
    emoji: '🤖',
    description:
      'Build your first robot! Includes pre-cut chassis parts, motors, sensors, and a beginner-friendly coding guide.',
    price: '$34.99',
    tag: 'Popular',
    tagColor: '#6366F1',
    tagBg: '#EEF2FF',
    gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    accentColor: '#6366F1',
    stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE',
    includes: ['Robot chassis', '2 motors + sensors', 'Coding guide', 'Instruction booklet'],
  },
  {
    name: 'Space Science Kit',
    emoji: '🪐',
    description:
      'Explore the cosmos! Model the solar system, track constellations, and build a mini telescope with this astronomy kit.',
    price: '$29.99',
    tag: 'New',
    tagColor: '#8B5CF6',
    tagBg: '#F5F3FF',
    gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    accentColor: '#7C3AED',
    stripeLink: 'https://buy.stripe.com/YOUR_LINK_HERE',
    includes: ['Mini telescope', 'Star chart', 'Planet model kit', 'Activity booklet'],
  },
]

function StarRating({ n = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
      ))}
    </div>
  )
}

export default function KitShop() {
  return (
    <section
      id="shop"
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #FAFAF9 0%, #f0f0fe 100%)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '2px',
              color: '#6366F1',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Shop Kits
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-1px',
              margin: '0 0 16px',
            }}
          >
            Find the perfect kit.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 17,
              color: '#6b7280',
              lineHeight: 1.6,
              maxWidth: 500,
              margin: '0 auto',
            }}
          >
            Every kit is designed by educators, tested by kids, and packed with
            everything needed for a great experiment.
          </p>
        </div>

        {/* Kit cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
          }}
        >
          {kits.map((kit) => (
            <div
              key={kit.name}
              style={{
                background: '#fff',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
                boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.13)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'
              }}
            >
              {/* Card hero */}
              <div
                style={{
                  background: kit.gradient,
                  padding: '36px 32px',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Tag */}
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.5px',
                    color: kit.tagColor,
                    background: kit.tagBg,
                    padding: '4px 10px',
                    borderRadius: 100,
                    border: `1px solid ${kit.tagColor}33`,
                  }}
                >
                  {kit.tag}
                </span>
                <div style={{ fontSize: 64, lineHeight: 1 }}>{kit.emoji}</div>
              </div>

              {/* Card body */}
              <div style={{ padding: '28px 28px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <StarRating />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: '#9ca3af',
                    }}
                  >
                    (48 reviews)
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#111827',
                    margin: '8px 0 10px',
                  }}
                >
                  {kit.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.6,
                    margin: '0 0 20px',
                    flex: 1,
                  }}
                >
                  {kit.description}
                </p>

                {/* Includes */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                      color: '#9ca3af',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}
                  >
                    Includes
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {kit.includes.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: kit.accentColor,
                          background: `${kit.accentColor}12`,
                          padding: '4px 10px',
                          borderRadius: 100,
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800,
                        fontSize: 28,
                        color: '#111827',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {kit.price}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: '#9ca3af',
                      }}
                    >
                      + free shipping
                    </div>
                  </div>
                  <a
                    href={kit.stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '12px 22px',
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${kit.accentColor} 0%, ${kit.accentColor}cc 100%)`,
                      boxShadow: `0 6px 20px ${kit.accentColor}40`,
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <ShoppingCart size={16} />
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donate callout */}
        <div
          style={{
            marginTop: 48,
            background: '#fff',
            borderRadius: 20,
            padding: '32px 36px',
            border: '1px solid #E0E7FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#111827',
                marginBottom: 6,
              }}
            >
              🎁 Want to donate a kit to a child in need?
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: '#6b7280',
                margin: 0,
              }}
            >
              100% of donations go directly toward kits for underserved communities.
            </p>
          </div>
          <a
            href="https://buy.stripe.com/YOUR_DONATION_LINK"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: '#6366F1',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: 12,
              border: '2px solid #6366F1',
              transition: 'background 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6366F1'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#6366F1'
            }}
          >
            Donate a Kit
          </a>
        </div>
      </div>
    </section>
  )
}
