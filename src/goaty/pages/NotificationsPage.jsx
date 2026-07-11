import { Link } from 'react-router-dom'
import { useGoatyStore } from '../store.js'

const ICONS = {
  mission: '🎯',
  streak: '🔥',
  roadmap: '🗺️',
  community: '🧑‍🤝‍🧑',
}

function formatWhen(ts) {
  const diff = (Date.now() - ts) / 1000
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`
  return `${Math.round(diff / 86400)} d ago`
}

export default function NotificationsPage() {
  const { state, markAllNotificationsRead } = useGoatyStore()
  const groups = state.notifications.reduce((acc, n) => {
    (acc[n.group] = acc[n.group] || []).push(n); return acc
  }, {})
  return (
    <div className="g-col" style={{ gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Notifications</h1>
          <p style={{ color: 'var(--muted)' }}>Your recent updates from Goaty.</p>
        </div>
        <button className="g-btn ghost small" onClick={markAllNotificationsRead}>Mark all read</button>
      </div>

      {['today', 'earlier'].map(group => (
        groups[group] && groups[group].length > 0 && (
          <section key={group}>
            <h3 style={{ textTransform: 'capitalize', color: 'var(--muted)', fontSize: 13, letterSpacing: '.08em' }}>{group}</h3>
            <div className="g-col" style={{ gap: 10 }}>
              {groups[group].map(n => (
                <Link key={n.id} to={n.target || '/app'} className="g-card" style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 14, alignItems: 'center', opacity: n.read ? 0.65 : 1 }}>
                  <div style={{ fontSize: 26 }}>{ICONS[n.kind] || '🔔'}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{n.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>{n.body}</div>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{formatWhen(n.when)}</div>
                </Link>
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  )
}
