import { useNavigate, useParams, Link } from 'react-router-dom'
import { useGoatyStore } from '../store.js'

const CATALOG = {
  'r-guitar': { title: 'Master Guitar through Anime', author: 'Kento', bio: 'Session musician turned learning nerd.', subject: 'Guitar', lens: 'anime' },
  'r-python': { title: 'Python via K-pop lyrics', author: 'Sun-hee', bio: 'Data scientist by day, dancer by night.', subject: 'Python', lens: 'music' },
  'r-calc': { title: 'Calculus in the kitchen', author: 'Rafa', bio: 'Pastry chef obsessed with math.', subject: 'Calculus', lens: 'cooking' },
  'r-french': { title: 'French through Ghibli films', author: 'Emma', bio: 'Language coach & anime fan.', subject: 'French', lens: 'tv' },
  'r-chess': { title: 'Chess like a JRPG', author: 'Priya', bio: 'FIDE candidate master.', subject: 'Chess', lens: 'gaming' },
  'r-photo': { title: 'Photography through travel journals', author: 'Miles', bio: 'Backpacker turned filmmaker.', subject: 'Photography', lens: 'travel' },
}

const SAMPLE_NODES = [
  { kind: 'lesson', title: 'The basics — no jargon' },
  { kind: 'lesson', title: 'A metaphor that makes it click' },
  { kind: 'quiz', title: 'Quick pulse check' },
  { kind: 'project', title: 'Build a tiny thing' },
  { kind: 'lesson', title: 'Level up — advanced idea' },
  { kind: 'milestone', title: 'First arc complete' },
]

const ICON = { lesson: '📘', quiz: '🎯', project: '🛠️', milestone: '🏆' }

export default function CommunityRoadmapDetail() {
  const { id } = useParams()
  const { addRoadmap } = useGoatyStore()
  const nav = useNavigate()
  const roadmap = CATALOG[id] || { title: 'Community roadmap', author: 'Anon', bio: '', subject: 'Unknown', lens: 'anime' }

  const remix = () => {
    const clone = {
      id: 'r-remix-' + Date.now(),
      title: `${roadmap.title} (remix)`,
      subject: roadmap.subject,
      lens: roadmap.lens,
      progress: 0,
      nodes: SAMPLE_NODES.map((n, i) => ({
        id: `rx-${i}`,
        kind: n.kind,
        title: n.title,
        xp: n.kind === 'project' ? 60 : n.kind === 'quiz' ? 20 : 25,
        status: i === 0 ? 'available' : 'locked',
      })),
    }
    addRoadmap(clone)
    nav('/app/roadmap')
  }

  return (
    <div className="g-col" style={{ gap: 20 }}>
      <Link to="/app/community" className="g-btn ghost small" style={{ alignSelf: 'flex-start' }}>← Back to community</Link>

      <div className="g-card g-card-lg" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'flex-start' }}>
        <div>
          <div className="g-pill grape">{roadmap.subject} · via {roadmap.lens}</div>
          <h1 style={{ marginTop: 10 }}>{roadmap.title}</h1>
          <div style={{ color: 'var(--muted)' }}>Shared by {roadmap.author}</div>
        </div>
        <button className="g-btn primary" onClick={remix}>Remix into my journey</button>
      </div>

      <div className="g-grid-2">
        <div className="g-card">
          <h3>What you'll build</h3>
          <div className="g-col" style={{ gap: 8, marginTop: 10 }}>
            {SAMPLE_NODES.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, border: '1px solid var(--border)', borderRadius: 12 }}>
                <span style={{ fontSize: 22 }}>{ICON[n.kind]}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'capitalize' }}>{n.kind}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="g-card">
          <h3>About the creator</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
            <div className="g-avatar" style={{ width: 56, height: 56, fontSize: 24 }}>👤</div>
            <div>
              <div style={{ fontWeight: 800 }}>{roadmap.author}</div>
              <div style={{ color: 'var(--muted)' }}>{roadmap.bio}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="g-btn ghost small">Follow</button>
          </div>
        </div>
      </div>
    </div>
  )
}
