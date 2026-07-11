import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import TypingDots from '../components/TypingDots.jsx'
import { useGoatyStore } from '../store.js'

const QUICK_PROMPTS = [
  { icon: '📖', label: 'Explain a concept', prompt: 'Explain recursion like I\'m five' },
  { icon: '❓', label: 'Quiz me', prompt: 'Quiz me on functions' },
  { icon: '🎯', label: 'Give me a challenge', prompt: 'Give me a small coding challenge' },
  { icon: '🗺️', label: 'Roadmap step', prompt: 'What should I learn next?' },
]

export default function ChatPage() {
  const { state, sendChat } = useGoatyStore()
  const [text, setText] = useState('')
  const scroller = useRef(null)

  const submit = (e) => {
    e?.preventDefault?.()
    if (!text.trim()) return
    sendChat(text)
    setText('')
  }

  const usePrompt = (p) => {
    sendChat(p)
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [state.chat.length])

  const { profile, chat } = state
  const level = profile.level || 1
  const xpForLevel = level * 100
  const xpInLevel = profile.xp % xpForLevel
  const streakDays = profile.streak || 0

  // last mission not done
  const activeMission = state.missions.find(m => !m.done) || state.missions[0]
  const activeRoadmap = state.roadmaps[0]
  const activeNode = activeRoadmap?.nodes.find(n => n.status === 'available') || activeRoadmap?.nodes[0]

  return (
    <div className="chat-home">
      {/* ============= TOP ROW (3 columns) ============= */}
      <div className="chat-top">
        {/* -------- LEFT: level + streak + avatar -------- */}
        <aside className="chat-side">
          <div className="g-card chat-level">
            <div style={{ fontWeight: 800, fontSize: 15 }}>Level {level}</div>
            <div className="chat-progress"><span style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} /></div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{xpInLevel} / {xpForLevel} XP</div>
          </div>

          <div className="g-card">
            <div style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              {streakDays} Day Streak <span style={{ color: 'var(--streak)' }}>🔥</span>
            </div>
            <div className="chat-streak-dots" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <span key={i} className="chat-streak-dot done">✓</span>
              ))}
              <span className="chat-streak-dot">{Math.max(streakDays, 4)}</span>
            </div>
          </div>

          <div className="g-card chat-avatar">
            <img
              src={profile.avatar && profile.avatar.startsWith('http') ? profile.avatar : 'https://i.pravatar.cc/80?img=13'}
              alt="You"
              className="chat-avatar-img"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 800 }}>{profile.name || 'Aaron'}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Explorer</div>
            </div>
            <div style={{ marginLeft: 'auto', color: 'var(--muted)' }}>▾</div>
          </div>
        </aside>

        {/* -------- CENTER: hero mascot + speech bubble -------- */}
        <section className="chat-hero">
          <div className="chat-streak-banner">
            <span style={{ color: 'var(--streak)' }}>🔥</span> {streakDays}-day streak! 🎉 Keep it going!
          </div>

          <div className="chat-hero-stage">
            <div className="chat-hero-bubble">
              <div>Hi there! 🌱</div>
              <div style={{ marginTop: 4 }}>I'm <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--blue)' }}>Goaty</strong></div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Your learning companion 🌿</div>
            </div>

            <div className="chat-hero-mascot">
              <Mascot size="hero" />
              <div className="chat-hero-pad" />
            </div>
          </div>
        </section>

        {/* -------- RIGHT: real chat panel -------- */}
        <section className="chat-panel">
          <div className="chat-panel-icons">
            <Link to="/app/notifications" className="chat-icon-btn" aria-label="Notifications">🔔</Link>
            <Link to="/app/settings" className="chat-icon-btn" aria-label="Settings">⚙️</Link>
          </div>

          <div ref={scroller} className="chat-panel-scroll">
            {chat.slice(-8).map(m => (
              <div key={m.id} className={`chat-msg ${m.role}`}>
                {m.role === 'goaty' && (
                  <img className="chat-msg-avatar" src="/goaty.png" alt="Goaty" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                )}
                <div className={`chat-msg-bubble ${m.role}`}>
                  {m.typing ? <TypingDots /> : m.text}
                  <div className="chat-msg-time">
                    {new Date(m.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    {m.role === 'user' && ' ✓'}
                  </div>
                </div>
                {m.role === 'user' && (
                  <img className="chat-msg-avatar" src="https://i.pravatar.cc/40?img=13" alt="You" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="chat-panel-form">
            <input
              className="g-input"
              placeholder="Ask Goaty anything..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button className="chat-send" aria-label="Send">➤</button>
          </form>

          <div className="chat-quick">
            {QUICK_PROMPTS.map(q => (
              <button key={q.label} className="chat-quick-chip" onClick={() => usePrompt(q.prompt)}>
                <span>{q.icon}</span> {q.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ============= BOTTOM ROW: 3 cards ============= */}
      <div className="chat-bottom">
        <Link to={activeMission?.target || '/app/missions'} className="g-card chat-bottom-card">
          <div className="chat-bottom-head">
            <span>🎯 Today's Mission</span>
            <span style={{ color: 'var(--muted)' }}>›</span>
          </div>
          <div style={{ fontWeight: 800, marginTop: 6 }}>{activeMission?.title || 'Learn about Recursion'}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span className="g-pill" style={{ background: 'rgba(244, 180, 0, 0.22)', color: '#7a5b00' }}>+ {activeMission?.xp || 50} XP</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>1 / 3</span>
          </div>
          <div className="chat-progress"><span style={{ width: '33%', background: 'linear-gradient(90deg, var(--warning), var(--streak))' }} /></div>
        </Link>

        <div className="g-card chat-bottom-card chat-quote">
          <div style={{ fontSize: 18, lineHeight: 1.45, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            <span style={{ color: 'var(--meadow)', marginRight: 4 }}>“</span>
            Small steps today,<br />big wins tomorrow.
          </div>
          <div style={{ color: 'var(--muted)', fontStyle: 'italic', textAlign: 'right' }}>– Goaty</div>
        </div>

        <Link to="/app/roadmap" className="g-card chat-bottom-card">
          <div className="chat-bottom-head">
            <span>📚 Learning Focus</span>
            <span style={{ color: 'var(--muted)' }}>›</span>
          </div>
          <div style={{ fontWeight: 800, marginTop: 6 }}>{activeNode?.title || 'Recursion Basics'}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{Math.round((activeRoadmap?.progress || 0.4) * 100)}%</div>
          <div className="chat-progress"><span style={{ width: `${(activeRoadmap?.progress || 0.4) * 100}%`, background: 'linear-gradient(90deg, var(--chat-blue), var(--message-blue))' }} /></div>
        </Link>
      </div>
    </div>
  )
}
