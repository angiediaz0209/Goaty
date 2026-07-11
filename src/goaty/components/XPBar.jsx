export default function XPBar({ xp = 0, level = 1, size = 96 }) {
  const inLevel = xp % 100
  const pct = inLevel / 100
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  const dash = c * pct
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(27,30,59,0.08)" strokeWidth="10" fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="url(#xpgrad)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <defs>
            <linearGradient id="xpgrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#FF8A6B" />
              <stop offset="1" stopColor="#FFCD5B" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
          }}
        >
          <div style={{ fontSize: size * 0.32, lineHeight: 1 }}>{level}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em' }}>LEVEL</div>
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 22 }}>{xp} XP</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{100 - inLevel} XP to level {level + 1}</div>
      </div>
    </div>
  )
}
