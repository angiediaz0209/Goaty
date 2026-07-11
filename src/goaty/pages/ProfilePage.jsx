import Mascot from '../components/Mascot.jsx'
import { useGoatyStore } from '../store.js'

const ACTIVITY = [
  { icon: '📘', text: 'Completed lesson "Variables & the Hero\'s Backstory"', when: '2h ago' },
  { icon: '🎯', text: 'Nailed a quiz (3/3)', when: 'Yesterday' },
  { icon: '🔥', text: 'Started a 3-day streak', when: '3 days ago' },
  { icon: '🐐', text: 'Chatted with Goaty about recursion', when: '4 days ago' },
]

export default function ProfilePage() {
  const { state } = useGoatyStore()
  const { profile } = state
  const joined = new Date(profile.joinDate || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="g-col" style={{ gap: 20 }}>
      {/* Banner */}
      <div className="g-card g-card-lg" style={{
        background: 'linear-gradient(135deg, rgba(198,240,226,0.6), rgba(255,205,91,0.4))',
        border: 'none',
        display: 'grid',
        gridTemplateColumns: '160px 1fr auto',
        gap: 24,
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          <Mascot size="lg" />
          <div style={{ position: 'absolute', bottom: -4, right: -4, background: 'var(--card)', border: '2px solid var(--coral)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {profile.level}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800 }}>
            {profile.name || 'A curious learner'}
          </div>
          <div style={{ color: 'var(--muted)', marginTop: 4 }}>Joined {joined}</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className={`g-pill ${profile.plan === 'premium' ? 'sun' : 'grape'}`}>
              {profile.plan === 'premium' ? '⭐ Premium' : 'Free plan'}
            </span>
            <span className="g-pill">🔥 {profile.streak} day streak</span>
          </div>
        </div>
        <button className="g-btn ghost">Edit profile</button>
      </div>

      {/* Stats grid */}
      <div className="g-grid-4">
        {[
          { label: 'Total XP', value: profile.xp },
          { label: 'Minutes learned', value: profile.minutesLearned || 0 },
          { label: 'Roadmaps completed', value: profile.roadmapsCompleted || 0 },
          { label: 'Longest streak', value: `${profile.longestStreak || 0} d` },
        ].map(s => (
          <div key={s.label} className="g-card">
            <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Badge case */}
      <div className="g-card">
        <h3>Badge case</h3>
        <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
          {profile.badges.length === 0 && <span style={{ color: 'var(--muted)' }}>No badges yet — keep going!</span>}
          {profile.badges.slice(0, 6).map(b => (
            <div key={b} className="g-hex rare" style={{ fontSize: 26 }}>🏅</div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="g-card">
        <h3>Recent activity</h3>
        <div className="g-col" style={{ marginTop: 10, gap: 8 }}>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 10, borderRadius: 12, background: 'rgba(27,30,59,0.04)' }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>{a.text}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>{a.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
