export default function StreakFlame({ count = 0 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', fontSize: 40, animation: 'bob 2.4s ease-in-out infinite' }}>
        <span aria-hidden>🔥</span>
        <span
          className="g-float"
          aria-hidden
          style={{ position: 'absolute', top: -10, left: -6, fontSize: 12, opacity: 0.6, animationDelay: '.4s' }}
        >✨</span>
        <span
          className="g-float"
          aria-hidden
          style={{ position: 'absolute', top: -6, right: -8, fontSize: 10, opacity: 0.5 }}
        >✨</span>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24 }}>{count}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>day streak</div>
      </div>
    </div>
  )
}
