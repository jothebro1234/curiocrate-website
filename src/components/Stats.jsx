const stats = [
  { value: '500+', label: 'Kits Delivered', emoji: '📦' },
  { value: '20+', label: 'Events Hosted', emoji: '🎉' },
  { value: '15+', label: 'Communities Reached', emoji: '🌍' },
  { value: '100%', label: 'Free for Recipients', emoji: '❤️' },
]

export default function Stats() {
  return (
    <section
      style={{
        background: '#fff',
        borderBottom: '1px solid #f3f4f6',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              textAlign: 'center',
              padding: '24px 16px',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: 42,
                color: '#6366F1',
                letterSpacing: '-1px',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                color: '#6b7280',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
