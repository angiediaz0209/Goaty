import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const OBJECTIVES = [
  'Design a small character card component',
  'Wire it up with an array of characters',
  'Add a favorite button that updates state',
]

const CHECKLIST = [
  'Sketch the layout',
  'Set up your data',
  'Render the list',
  'Style the cards',
  'Add interactivity',
]

export default function ProjectPage() {
  const { id } = useParams()
  const [checks, setChecks] = useState({})
  const [submission, setSubmission] = useState('')
  const [toast, setToast] = useState(null)

  const toggle = (i) => setChecks(c => ({ ...c, [i]: !c[i] }))

  const share = () => {
    setToast('Shared to community! 🎉')
    setTimeout(() => setToast(null), 2200)
  }

  const done = Object.values(checks).filter(Boolean).length
  return (
    <div className="g-col" style={{ maxWidth: 780, margin: '0 auto', width: '100%', gap: 20 }}>
      <div className="g-lens-banner">🛠️ Project · {id}</div>
      <h1>Build a Character Roster App</h1>

      <div className="g-card">
        <h3>Objectives</h3>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: 'var(--muted)' }}>
          {OBJECTIVES.map(o => <li key={o}>{o}</li>)}
        </ul>
      </div>

      <div className="g-card">
        <h3>Materials</h3>
        <div className="g-row">
          <span className="g-pill">Code editor</span>
          <span className="g-pill">30 minutes</span>
          <span className="g-pill">Browser</span>
        </div>
      </div>

      <div className="g-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Checklist</h3>
          <div className="g-pill mint">{done} / {CHECKLIST.length} done</div>
        </div>
        <div className="g-col" style={{ gap: 8 }}>
          {CHECKLIST.map((c, i) => (
            <label key={c} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', padding: 8, borderRadius: 8, background: checks[i] ? 'rgba(126,214,122,0.14)' : 'transparent' }}>
              <input type="checkbox" checked={!!checks[i]} onChange={() => toggle(i)} />
              <span style={{ textDecoration: checks[i] ? 'line-through' : 'none' }}>{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="g-card">
        <h3>Submit your work</h3>
        <textarea
          className="g-textarea"
          placeholder="Paste a link, share your GitHub repo, or describe what you built..."
          value={submission}
          onChange={e => setSubmission(e.target.value)}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label className="g-btn ghost" style={{ cursor: 'pointer' }}>
            📎 Attach file
            <input type="file" style={{ display: 'none' }} onChange={() => setToast('File attached (mock).')} />
          </label>
          <button className="g-btn primary" onClick={share} disabled={!submission.trim()}>Share to community</button>
          <Link to="/app" className="g-btn ghost">Save & exit</Link>
        </div>
      </div>

      {toast && <div className="g-toast">{toast}</div>}
    </div>
  )
}
