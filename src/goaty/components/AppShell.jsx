import { NavLink, Outlet, Link } from 'react-router-dom'
import { useGoatyStore } from '../store.js'
import logoUrl from '../images/logo.png'

const Icon = ({ name }) => {
  const s = { width: 20, height: 20, stroke: 'currentColor', strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    map: <><path d="M9 4l-6 3v13l6-3 6 3 6-3V4l-6 3-6-3z" /><path d="M9 4v13M15 7v13" /></>,
    chat: <><path d="M4 5h16v10H8l-4 4V5z" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2" /><path d="M15 20c0-2 2-4 4-4s3 1 3 3" /></>,
    badge: <><path d="M12 2l2.5 4.5L20 8l-4 4 1 6-5-3-5 3 1-6L4 8l5.5-1.5L12 2z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
    bell: <><path d="M6 8a6 6 0 1112 0v5l2 3H4l2-3V8z" /><path d="M10 20a2 2 0 004 0" /></>,
    game: <><rect x="2" y="7" width="20" height="12" rx="4" /><path d="M8 13h4M10 11v4" /><circle cx="16" cy="12" r="1" /><circle cx="18" cy="15" r="1" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" style={s} aria-hidden>
      {paths[name] || null}
    </svg>
  )
}

const LINKS = [
  { to: '/app', end: true, label: 'Dashboard', icon: 'home' },
  { to: '/app/roadmap', label: 'Roadmap', icon: 'map' },
  { to: '/app/games', label: 'Games', icon: 'game' },
  { to: '/app/chat', label: 'Chat', icon: 'chat' },
  { to: '/app/community', label: 'Community', icon: 'users' },
  { to: '/app/badges', label: 'Badges', icon: 'badge' },
  { to: '/app/profile', label: 'Profile', icon: 'user' },
]

export default function AppShell() {
  const { state } = useGoatyStore()
  const { profile } = state
  return (
    <div className="goaty-app g-page-pad">
      <nav className="g-nav">
        <Link to="/" className="brand">
          <img src={logoUrl} alt="Goaty" className="brand-logo" />
        </Link>
        <div className="nav-links" style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-spacer" />
        <Link to="/app/notifications" className="g-badge" title="Notifications" style={{ padding: '8px 10px' }} aria-label="Notifications">
          <Icon name="bell" />
        </Link>
        <span className="g-xp-pill" title={`Level ${profile.level}`}>
          <span className="lv">{profile.level}</span>
          <span>{profile.xp} XP</span>
        </span>
        <span className="g-badge" style={{ background: 'rgba(255, 138, 107, 0.14)', color: 'var(--coral-dark)' }}>
          🔥 {profile.streak}
        </span>
      </nav>

      <main className="g-container">
        <Outlet />
      </main>

      <Link to="/app/chat" className="g-ask-fab" aria-label="Ask Goaty">
        <span aria-hidden>💬</span>
        <span>Ask Goaty</span>
      </Link>

      <nav className="g-tabbar" aria-label="Primary">
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <Icon name={l.icon} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
