import { useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import XPBar from '../components/XPBar.jsx'
import StreakFlame from '../components/StreakFlame.jsx'
import MissionCard from '../components/MissionCard.jsx'
import RoadmapNode from '../components/RoadmapNode.jsx'
import Section from '../components/Section.jsx'
import Confetti from '../components/Confetti.jsx'
import { useGoatyStore } from '../store.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const RECS = [
  { id: 'r-guitar', title: 'Master Guitar through Anime', author: 'Kento', remixes: 128, lens: 'anime' },
  { id: 'r-python', title: 'Python via K-pop lyrics', author: 'Sun-hee', remixes: 342, lens: 'music' },
]

export default function Dashboard() {
  const { state, completeMission } = useGoatyStore()
  const { profile, missions, weekly, roadmaps } = state
  const [burst, setBurst] = useState(0)
  const roadmap = roadmaps[0]
  const nextFive = roadmap?.nodes.slice(0, 5) || []
  const currentIdx = nextFive.findIndex(n => n.status === 'available')
  const maxMin = Math.max(...weekly.minutes, 1)

  const onMission = (m) => (e) => {
    if (m.done) return
    // Complete via link click — but we should also let the mission be marked done from dashboard "quick complete"
    // Here we treat click as start-and-complete for the demo state.
    if (e && e.metaKey) return
  }

  const quickComplete = (m) => {
    if (m.done) return
    completeMission(m.id)
    setBurst(b => b + 1)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="g-col" style={{ gap: 24 }}>
      <Confetti trigger={burst} />

      {/* Greeting */}
      <div className="g-card g-card-lg" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'center' }}>
        <div><Mascot size="md" /></div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>
            {greeting()}{profile.name ? `, ${profile.name}` : ''} 👋
          </div>
          <div style={{ color: 'var(--muted)', marginTop: 4 }}>
            {profile.goal ? `Let's keep pushing on ${profile.goal}. ` : 'Ready to graze on some knowledge? '}
            Your next mission is one tap away.
          </div>
        </div>
        <Link to="/app/chat" className="g-btn primary">Ask Goaty</Link>
      </div>

      {/* Stats row */}
      <div className="g-grid-3">
        <div className="g-card"><XPBar xp={profile.xp} level={profile.level} /></div>
        <div className="g-card"><StreakFlame count={profile.streak} /></div>
        <div className="g-card">
          <div style={{ color: 'var(--muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.08em' }}>This week</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginTop: 4 }}>
            {weekly.minutes.reduce((a, b) => a + b, 0)} min
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>learned so far</div>
        </div>
      </div>

      {/* Missions */}
      <Section title="Today's missions" subtitle="3 quick quests. Full XP if you finish them all.">
        <div className="g-grid-3">
          {missions.map(m => (
            <div key={m.id} style={{ position: 'relative' }}>
              <MissionCard mission={m} onClick={onMission(m)} />
              {!m.done && (
                <button
                  className="g-btn small ghost"
                  onClick={(e) => { e.preventDefault(); quickComplete(m) }}
                  style={{ position: 'absolute', top: 12, right: 12 }}
                  title="Mark complete"
                >✓</button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Roadmap strip */}
      <Section title="Active roadmap" subtitle={roadmap?.title} right={<Link to="/app/roadmap" className="g-btn small ghost">View all →</Link>}>
        <div className="g-card" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center', padding: '8px 4px', minWidth: 'min-content' }}>
            {nextFive.map((n, i) => (
              <div key={n.id} style={{ textAlign: 'center', flexShrink: 0 }}>
                <RoadmapNode node={n} isCurrent={i === currentIdx} />
                <div style={{ marginTop: 8, maxWidth: 120, fontSize: 12, color: 'var(--muted)' }}>{n.title}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Weekly analytics */}
      <Section title="Weekly analytics">
        <div className="g-grid-3">
          <div className="g-card">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Minutes learned</div>
            <div className="g-bar-chart">
              {weekly.minutes.map((m, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="bar" style={{ height: `${(m / maxMin) * 100}%` }} title={`${m} min`}></div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{DAYS[i]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="g-card">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Topics mastered</div>
            <div className="g-row">
              {weekly.topicsMastered.map(t => <span key={t} className="g-pill mint">✓ {t}</span>)}
              {weekly.topicsMastered.length === 0 && <span style={{ color: 'var(--muted)' }}>Nothing yet — go crush a lesson!</span>}
            </div>
          </div>
          <div className="g-card">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Streak history</div>
            <div className="g-sparkline">
              {weekly.streakHistory.map((v, i) => (
                <div key={i} className="dot" style={{ height: v ? 22 + i * 2 : 6, opacity: v ? 1 : 0.35 }} />
              ))}
            </div>
            <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 13 }}>Longest: {profile.longestStreak} days</div>
          </div>
        </div>
      </Section>

      {/* Recommendations */}
      <Section title="Recommended for you">
        <div className="g-grid-2">
          {RECS.map(r => (
            <Link key={r.id} to={`/app/community/${r.id}`} className="g-card" style={{ textDecoration: 'none' }}>
              <div className="g-pill grape" style={{ marginBottom: 10 }}>Community · {r.lens}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{r.title}</div>
              <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>
                by {r.author} · {r.remixes} remixes
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
