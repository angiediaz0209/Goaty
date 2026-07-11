import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import InterestChip from '../components/InterestChip.jsx'
import RoadmapNode from '../components/RoadmapNode.jsx'
import { useGoatyStore, getInterestCatalog } from '../store.js'

const SUGGESTED_GOALS = ['JavaScript', 'Spanish', 'Photography', 'Music theory', 'Calculus', 'Cooking Italian', 'Public speaking']

function Progress({ step, total }) {
  return (
    <div className="g-progress" style={{ maxWidth: 320 }}>
      <span style={{ width: `${(step / total) * 100}%` }} />
    </div>
  )
}

function StepName({ store }) {
  const catalog = getInterestCatalog()
  const { state, setProfile, toggleInterest } = store
  return (
    <div className="g-col">
      <h1 style={{ marginBottom: 8 }}>Name your journey</h1>
      <p style={{ color: 'var(--muted)' }}>What should Goaty call you?</p>
      <input
        className="g-input"
        placeholder="Your name"
        value={state.profile.name}
        onChange={e => setProfile({ name: e.target.value })}
        style={{ maxWidth: 400 }}
      />
      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Pick at least 3 things you love</div>
        <div className="g-row">
          {catalog.map(i => (
            <InterestChip key={i.id} interest={i} active={state.profile.interests.includes(i.id)} onToggle={toggleInterest} />
          ))}
        </div>
        <div style={{ color: 'var(--muted)', marginTop: 10, fontSize: 13 }}>
          Selected: {state.profile.interests.length} / min 3
        </div>
      </div>
    </div>
  )
}

function StepGoal({ store }) {
  const { state, setGoal } = store
  return (
    <div className="g-col">
      <h1>What do you want to learn?</h1>
      <p style={{ color: 'var(--muted)' }}>One goal is enough to start. You can add more later.</p>
      <input
        className="g-input"
        placeholder="e.g., Master JavaScript in 90 days"
        value={state.profile.goal}
        onChange={e => setGoal(e.target.value)}
        style={{ maxWidth: 520 }}
      />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Popular right now</div>
        <div className="g-row">
          {SUGGESTED_GOALS.map(s => (
            <button
              key={s}
              type="button"
              className={`g-chip ${state.profile.goal === s ? 'active' : ''}`}
              onClick={() => setGoal(s)}
            >{s}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepStyle({ store }) {
  const { state, setStyle } = store
  const s = state.profile.style
  const rows = [
    { key: 'pace', label: 'Pace', hints: ['Chill', 'Balanced', 'Sprint'] },
    { key: 'depth', label: 'Depth', hints: ['Surface', 'Practical', 'Deep dive'] },
    { key: 'playfulness', label: 'Playfulness', hints: ['Focused', 'Fun', 'Full jokes'] },
  ]
  return (
    <div className="g-col">
      <h1>Your learner style</h1>
      <p style={{ color: 'var(--muted)' }}>Slide the dials — we'll tune Goaty's voice to you.</p>
      {rows.map(r => (
        <div key={r.key} className="g-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{r.label}</div>
            <div className="g-pill">{r.hints[s[r.key] - 1]}</div>
          </div>
          <input
            type="range" min={1} max={3} value={s[r.key]}
            onChange={e => setStyle({ [r.key]: Number(e.target.value) })}
            className="g-slider"
            style={{ marginTop: 14 }}
          />
        </div>
      ))}
    </div>
  )
}

function StepPreview({ store }) {
  const { state } = store
  const nodes = state.roadmaps[0]?.nodes.slice(0, 6) || []
  return (
    <div className="g-col" style={{ alignItems: 'center', textAlign: 'center' }}>
      <Mascot size="lg" />
      <h1 style={{ marginTop: 12 }}>Your roadmap is ready.</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 460 }}>
        Here's a peek. You'll unlock the full skill tree once you start learning.
      </p>
      <div style={{ display: 'flex', gap: 32, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {nodes.map((n, i) => (
          <div key={n.id} className="g-fade-up" style={{ animationDelay: `${i * 0.12}s`, textAlign: 'center' }}>
            <RoadmapNode node={n} isCurrent={i === 1} />
            <div style={{ marginTop: 8, maxWidth: 100, fontSize: 12, color: 'var(--muted)' }}>{n.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Onboarding() {
  const store = useGoatyStore()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const canAdvance = () => {
    if (step === 1) return store.state.profile.name.trim() && store.state.profile.interests.length >= 3
    if (step === 2) return store.state.profile.goal.trim().length > 1
    return true
  }
  const next = () => {
    if (step < 4) setStep(s => s + 1)
    else nav('/app')
  }

  return (
    <div className="goaty-app">
      <div className="g-container-narrow" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>🐐</span> Goaty · Step {step} of 4
          </div>
          <Progress step={step} total={4} />
        </div>

        <div className="g-card g-card-lg g-fade-up" key={step} style={{ minHeight: 340 }}>
          {step === 1 && <StepName store={store} />}
          {step === 2 && <StepGoal store={store} />}
          {step === 3 && <StepStyle store={store} />}
          {step === 4 && <StepPreview store={store} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button className="g-btn ghost" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
            ← Back
          </button>
          <button className="g-btn primary" onClick={next} disabled={!canAdvance()}>
            {step === 4 ? 'Start learning →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}
