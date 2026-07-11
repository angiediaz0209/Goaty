import { Link } from 'react-router-dom'
import Mascot from './Mascot.jsx'

export default function NotFoundPage() {
  return (
    <div className="goaty-app">
      <div className="g-container-narrow" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ display: 'inline-block', marginBottom: 24 }}>
          <Mascot size="xl" showNote />
        </div>
        <h1>Uh oh — grass isn't greener here.</h1>
        <p style={{ color: 'var(--muted)', fontSize: 18 }}>
          The page you're looking for wandered off. Let's herd you back home.
        </p>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="g-btn primary">← Back to home</Link>
          <Link to="/app" className="g-btn ghost">Open the app</Link>
        </div>
      </div>
    </div>
  )
}
