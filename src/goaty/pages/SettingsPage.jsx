import { useState } from 'react'
import InterestChip from '../components/InterestChip.jsx'
import { useGoatyStore, getInterestCatalog } from '../store.js'

export default function SettingsPage() {
  const { state, setProfile, toggleInterest, setGoal, setTheme, resetAll, upgradePlan, downgradePlan } = useGoatyStore()
  const [toggles, setToggles] = useState({ email: true, push: true, streakReminders: true, weeklyRecap: false })
  const [toast, setToast] = useState(null)
  const catalog = getInterestCatalog()

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000) }

  const doReset = () => {
    if (window.confirm('This will erase your Goaty data. Continue?')) {
      resetAll()
      notify('Everything reset. Fresh start!')
    }
  }

  return (
    <div className="g-col" style={{ gap: 20, maxWidth: 780, margin: '0 auto', width: '100%' }}>
      <h1>Settings</h1>

      <section className="g-card">
        <h3>Account</h3>
        <div className="g-col" style={{ gap: 10, marginTop: 10 }}>
          <label>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Name</div>
            <input className="g-input" value={state.profile.name} onChange={e => setProfile({ name: e.target.value })} placeholder="Your name" />
          </label>
          <label>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Email</div>
            <input className="g-input" defaultValue="learner@goaty.app" disabled />
          </label>
        </div>
      </section>

      <section className="g-card">
        <h3>Interests</h3>
        <div className="g-row" style={{ marginTop: 10 }}>
          {catalog.map(i => (
            <InterestChip key={i.id} interest={i} active={state.profile.interests.includes(i.id)} onToggle={toggleInterest} />
          ))}
        </div>
      </section>

      <section className="g-card">
        <h3>Goals</h3>
        <textarea
          className="g-textarea"
          value={state.profile.goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="What are you working toward?"
          style={{ marginTop: 10, minHeight: 80 }}
        />
      </section>

      <section className="g-card">
        <h3>Notifications</h3>
        <div className="g-col" style={{ marginTop: 10, gap: 10 }}>
          {[
            { key: 'email', label: 'Email digest' },
            { key: 'push', label: 'Push notifications' },
            { key: 'streakReminders', label: 'Streak reminders' },
            { key: 'weeklyRecap', label: 'Weekly recap' },
          ].map(t => (
            <div key={t.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span>{t.label}</span>
              <button
                className={`g-toggle ${toggles[t.key] ? 'on' : ''}`}
                onClick={() => setToggles(s => ({ ...s, [t.key]: !s[t.key] }))}
                aria-label={t.label}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="g-card">
        <h3>Appearance</h3>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button className={`g-chip ${state.theme !== 'dark' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light</button>
          <button className={`g-chip ${state.theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
        </div>
      </section>

      <section className="g-card">
        <h3>Subscription</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {state.profile.plan === 'premium' ? '⭐ Premium' : 'Free plan'}
            </div>
            <div style={{ color: 'var(--muted)' }}>
              {state.profile.plan === 'premium' ? 'Unlimited everything.' : '1 active roadmap, 3 daily missions.'}
            </div>
          </div>
          {state.profile.plan === 'premium' ? (
            <button className="g-btn ghost" onClick={() => { downgradePlan(); notify('Downgraded to Free.') }}>Downgrade</button>
          ) : (
            <button className="g-btn primary" onClick={() => { upgradePlan(); notify('Welcome to Premium! ⭐') }}>Upgrade to Premium</button>
          )}
        </div>
      </section>

      <section className="g-card" style={{ borderColor: 'var(--coral)', borderStyle: 'dashed', borderWidth: 2 }}>
        <h3>Danger zone</h3>
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>Reset all your Goaty data. This can't be undone.</p>
        <button className="g-btn ghost" style={{ borderColor: 'var(--coral)', color: 'var(--coral-dark)' }} onClick={doReset}>
          Reset everything
        </button>
      </section>

      {toast && <div className="g-toast">{toast}</div>}
    </div>
  )
}
