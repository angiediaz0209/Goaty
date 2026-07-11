import { useState } from 'react'
import { Link } from 'react-router-dom'

const FEED = [
  { id: 'r-guitar', title: 'Master Guitar through Anime', author: 'Kento', avatar: '🎸', lens: 'anime', subject: 'Guitar', remixes: 128, likes: 842 },
  { id: 'r-python', title: 'Python via K-pop lyrics', author: 'Sun-hee', avatar: '🎤', lens: 'music', subject: 'Python', remixes: 342, likes: 2100 },
  { id: 'r-calc', title: 'Calculus in the kitchen', author: 'Rafa', avatar: '👨‍🍳', lens: 'cooking', subject: 'Calculus', remixes: 91, likes: 512 },
  { id: 'r-french', title: 'French through Ghibli films', author: 'Emma', avatar: '🎬', lens: 'tv', subject: 'French', remixes: 210, likes: 1340 },
  { id: 'r-chess', title: 'Chess like a JRPG', author: 'Priya', avatar: '♟️', lens: 'gaming', subject: 'Chess', remixes: 178, likes: 920 },
  { id: 'r-photo', title: 'Photography through travel journals', author: 'Miles', avatar: '📷', lens: 'travel', subject: 'Photography', remixes: 66, likes: 388 },
]

const TABS = ['Trending', 'New', 'Following']

export default function CommunityPage() {
  const [tab, setTab] = useState('Trending')

  return (
    <div className="g-col" style={{ gap: 20 }}>
      <div>
        <h1>Community</h1>
        <p style={{ color: 'var(--muted)' }}>Explore roadmaps shared by curious minds around the world.</p>
      </div>

      <div className="g-row" role="tablist">
        {TABS.map(t => (
          <button
            key={t}
            role="tab"
            className={`g-chip ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </div>

      <div className="g-grid-3">
        {FEED.map(r => (
          <Link key={r.id} to={`/app/community/${r.id}`} className="g-card" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div className="g-avatar" style={{ width: 36, height: 36, fontSize: 20 }}>{r.avatar}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.author}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{r.title}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span className="g-pill grape">{r.subject}</span>
              <span className="g-pill mint">via {r.lens}</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 13 }}>
              <span>🔁 {r.remixes}</span>
              <span>❤️ {r.likes}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
