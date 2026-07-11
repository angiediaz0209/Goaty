import { Link } from 'react-router-dom'

const ICONS = {
  lesson: '📖',
  quiz: '🎯',
  chat: '💬',
}

export default function MissionCard({ mission, onClick }) {
  const Wrapper = mission.target ? Link : 'div'
  const props = mission.target ? { to: mission.target } : {}
  return (
    <Wrapper
      {...props}
      onClick={onClick}
      className="g-card"
      style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        opacity: mission.done ? 0.6 : 1,
        borderColor: mission.done ? 'var(--meadow)' : 'var(--border)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className={`mission-icon ${ICONS[mission.kind] ? mission.kind : 'default'}`} aria-hidden>
          {ICONS[mission.kind] || '⭐'}
        </span>
        <span className="g-pill reward">+{mission.xp} XP</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 17 }}>{mission.title}</div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontSize: 13, textTransform: 'capitalize' }}>{mission.kind}</span>
        {mission.done ? (
          <span className="g-pill mint">✓ Done</span>
        ) : (
          <span className="g-btn small primary" style={{ pointerEvents: 'none' }}>Start</span>
        )}
      </div>
    </Wrapper>
  )
}
