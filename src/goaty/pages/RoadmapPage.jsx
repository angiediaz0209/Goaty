import { useState } from 'react'
import { Link } from 'react-router-dom'
import RoadmapNode from '../components/RoadmapNode.jsx'
import { useGoatyStore } from '../store.js'

export default function RoadmapPage() {
  const { state, completeNode, uncompleteNode } = useGoatyStore()
  const roadmap = state.roadmaps[0]
  const [selected, setSelected] = useState(null)

  const nodes = roadmap?.nodes || []
  const currentIdx = nodes.findIndex(n => n.status === 'available')

  const targetFor = (node) => {
    if (node.kind === 'lesson') return `/app/lesson/${node.id}`
    if (node.kind === 'quiz') return `/app/quiz/${node.id}`
    if (node.kind === 'project') return `/app/project/${node.id}`
    return '/app'
  }

  return (
    <div className="g-col" style={{ gap: 20 }}>
      <div className="g-card g-card-lg">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800 }}>{roadmap?.title}</div>
        <div style={{ color: 'var(--muted)', marginTop: 4 }}>
          {roadmap?.subject} taught through {roadmap?.lens} · {Math.round((roadmap?.progress || 0) * 100)}% complete
        </div>
        <div className="g-progress" style={{ marginTop: 12 }}>
          <span style={{ width: `${(roadmap?.progress || 0) * 100}%` }} />
        </div>
      </div>

      <div className="g-card" style={{ position: 'relative', padding: '32px 12px' }}>
        {/* Winding path svg */}
        <svg width="100%" height={nodes.length * 120 + 40} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <path
            d={buildPath(nodes.length)}
            stroke="rgba(139, 124, 255, 0.35)"
            strokeWidth="4"
            strokeDasharray="8 10"
            fill="none"
          />
        </svg>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {nodes.map((n, i) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                padding: '4px 40px',
                marginBottom: 40,
              }}
            >
              <div style={{ textAlign: 'center', maxWidth: 220 }} className="g-fade-up">
                <RoadmapNode node={n} isCurrent={i === currentIdx} onClick={() => setSelected(n)} />
                <div style={{ marginTop: 8, fontWeight: 700 }}>{n.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'capitalize' }}>
                  {n.kind} · +{n.xp} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <div className="g-scrim" onClick={() => setSelected(null)} />
          <aside className="g-drawer">
            <button className="g-btn ghost small" onClick={() => setSelected(null)} style={{ marginBottom: 16 }}>← Close</button>
            <div className="g-pill" style={{ textTransform: 'capitalize' }}>{selected.kind}</div>
            <h2 style={{ marginTop: 10 }}>{selected.title}</h2>
            <p style={{ color: 'var(--muted)' }}>
              A hands-on {selected.kind} to help you master this concept — taught through {state.roadmaps[0]?.lens}.
            </p>
            <div className="g-card" style={{ background: 'rgba(255, 205, 91, 0.15)', border: 'none' }}>
              <div style={{ fontWeight: 800 }}>Reward</div>
              <div>+{selected.xp} XP · unlocks the next node</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {selected.status !== 'locked' && (
                <Link className="g-btn primary" to={targetFor(selected)}>Open {selected.kind} →</Link>
              )}
              {selected.status !== 'complete' && selected.status !== 'locked' && (
                <button className="g-btn ghost" onClick={() => { completeNode(selected.id); setSelected(null) }}>Mark complete</button>
              )}
              {selected.status === 'complete' && (
                <button className="g-btn ghost" onClick={() => { uncompleteNode(selected.id); setSelected(null) }}>Uncomplete</button>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

function buildPath(count) {
  // Simple winding path: alternating S-curves
  let d = ''
  const step = 120
  let x = 100, y = 40
  d += `M ${x} ${y} `
  for (let i = 0; i < count; i++) {
    const dir = i % 2 === 0 ? 1 : -1
    const tx = x + dir * 300
    const ty = y + step
    d += `Q ${x + dir * 200} ${y + 60} ${tx} ${ty} `
    x = tx
    y = ty
  }
  return d
}
