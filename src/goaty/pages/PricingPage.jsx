import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from '../components/Confetti.jsx'
import { useGoatyStore } from '../store.js'

const FEATURES = [
  { label: '1 active roadmap', free: true, premium: '∞ roadmaps' },
  { label: '3 daily missions', free: true, premium: 'Unlimited missions' },
  { label: 'Basic chat memory', free: true, premium: 'Unlimited memory' },
  { label: 'Community access', free: true, premium: true },
  { label: 'Exclusive badges', free: false, premium: true },
  { label: 'Offline lessons', free: false, premium: true },
  { label: 'Priority Goaty support', free: false, premium: true },
]

function Check({ ok, text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0' }}>
      <span style={{ color: ok ? 'var(--meadow)' : 'rgba(27,30,59,0.25)', fontSize: 18 }}>{ok ? '✓' : '—'}</span>
      <span style={{ color: ok ? 'var(--ink)' : 'var(--muted)' }}>{text}</span>
    </div>
  )
}

export default function PricingPage() {
  const { state, upgradePlan, downgradePlan } = useGoatyStore()
  const [annual, setAnnual] = useState(true)
  const [burst, setBurst] = useState(0)
  const [toast, setToast] = useState(null)

  const monthly = 9
  const annualMonth = 9 * 0.8 // 20% off

  const doUpgrade = () => {
    upgradePlan()
    setBurst(b => b + 1)
    setToast('Welcome to Premium! ⭐')
    setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="goaty-app">
      <Confetti trigger={burst} />
      <header className="g-nav">
        <Link to="/" className="brand"><span>🐐</span> Goaty</Link>
        <div className="nav-spacer" />
        <Link to="/app" className="g-btn ghost small">Open app</Link>
      </header>

      <div className="g-container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="g-pill grape" style={{ marginBottom: 12 }}>Pricing</div>
          <h1>Simple, cheerful plans.</h1>
          <p style={{ color: 'var(--muted)', fontSize: 18 }}>Start free. Upgrade when you're hooked.</p>
          <div style={{ display: 'inline-flex', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 999, padding: 4, marginTop: 20 }}>
            <button className={`g-chip ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)} style={{ border: 'none' }}>Monthly</button>
            <button className={`g-chip ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)} style={{ border: 'none' }}>Annual · save 20%</button>
          </div>
        </div>

        <div className="g-grid-2" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="g-card g-card-lg">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Free</div>
            <div style={{ color: 'var(--muted)', marginTop: 4 }}>Start your journey.</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, marginTop: 20 }}>
              $0<span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}> / forever</span>
            </div>
            <div style={{ marginTop: 20 }}>
              {FEATURES.map(f => <Check key={f.label} ok={!!f.free} text={f.label} />)}
            </div>
            <div style={{ marginTop: 20 }}>
              {state.profile.plan === 'premium' ? (
                <button className="g-btn ghost wide" onClick={downgradePlan}>Downgrade to Free</button>
              ) : (
                <button className="g-btn ghost wide" disabled>You're on Free</button>
              )}
            </div>
          </div>

          <div className="g-card g-card-lg" style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(255,138,107,0.08), var(--card))',
            border: '2px solid var(--coral)',
          }}>
            <div style={{ position: 'absolute', top: -14, left: 24 }}>
              <span className="g-pill" style={{ background: 'var(--coral)', color: 'white' }}>⭐ Most popular</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Premium</div>
            <div style={{ color: 'var(--muted)', marginTop: 4 }}>The full Goaty experience.</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, marginTop: 20 }}>
              ${annual ? annualMonth.toFixed(2) : monthly}
              <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}>
                {' '}/ month{annual ? ', billed annually' : ''}
              </span>
            </div>
            <div style={{ marginTop: 20 }}>
              {FEATURES.map(f => <Check key={f.label} ok={!!f.premium} text={typeof f.premium === 'string' ? f.premium : f.label} />)}
            </div>
            <div style={{ marginTop: 20 }}>
              {state.profile.plan === 'premium' ? (
                <button className="g-btn primary wide" disabled>You're Premium ⭐</button>
              ) : (
                <button className="g-btn primary wide" onClick={doUpgrade}>Upgrade — start free trial</button>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--muted)' }}>
          Cancel anytime. Fake Stripe. All prices in mock USD.
        </div>
      </div>
      {toast && <div className="g-toast">{toast}</div>}
    </div>
  )
}
