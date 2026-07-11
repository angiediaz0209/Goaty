import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot, { goatyImg } from '../components/Mascot.jsx'
import { useGoatyStore, interestLabel, interestEmoji } from '../store.js'

const FALLBACK_PROMPTS = [
  { icon: '📖', label: 'Explain a concept', prompt: 'Explain recursion like I\'m five' },
  { icon: '❓', label: 'Quiz me',           prompt: 'Quiz me on functions' },
  { icon: '🎯', label: 'Give me a challenge', prompt: 'Give me a small coding challenge' },
  { icon: '🗺️', label: 'Roadmap step',      prompt: 'What should I learn next?' },
]

// Extra flavor per interest so chips feel native
const INTEREST_FLAVOR = {
  harry_potter: { verb: 'explain', follow: 'like a spell from Hogwarts' },
  marvel:       { verb: 'explain', follow: 'like an origin story from the MCU' },
  star_wars:    { verb: 'explain', follow: 'like a Jedi training scene' },
  disney:       { verb: 'explain', follow: 'like a Disney adventure' },
  one_piece:    { verb: 'explain', follow: 'like a Straw Hat crew arc' },
  pokemon:      { verb: 'explain', follow: 'like a Pokémon gym battle' },
  anime:        { verb: 'explain', follow: 'through an anime training arc' },
  minecraft:    { verb: 'explain', follow: 'like a Minecraft build' },
  fortnite:     { verb: 'explain', follow: 'like a Fortnite drop' },
  gaming:       { verb: 'explain', follow: 'like a video game boss fight' },
  basketball:   { verb: 'explain', follow: 'through a basketball play' },
  soccer:       { verb: 'explain', follow: 'through a soccer play' },
  sports:       { verb: 'explain', follow: 'through a sports play' },
  f1:           { verb: 'explain', follow: 'like an F1 race strategy' },
  kpop:         { verb: 'explain', follow: 'like K-pop choreography' },
  taylor:       { verb: 'explain', follow: 'through a Taylor Swift era' },
  music:        { verb: 'explain', follow: 'through music and rhythm' },
  cooking:      { verb: 'explain', follow: 'like a recipe' },
  travel:       { verb: 'explain', follow: 'like a travel itinerary' },
  books:        { verb: 'explain', follow: 'like a story from a book' },
  tv:           { verb: 'explain', follow: 'like a TV show plot' },
  photography:  { verb: 'explain', follow: 'like framing the perfect shot' },
  space:        { verb: 'explain', follow: 'like a mission to space' },
  history:      { verb: 'explain', follow: 'like a moment in history' },
  technology:   { verb: 'explain', follow: 'like a coding challenge' },
}

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
  const isThinking = chat.some(m => m.typing)

  // last mission not done
  const activeMission = state.missions.find(m => !m.done) || state.missions[0]
  const activeRoadmap = state.roadmaps[0]
  const activeNode = activeRoadmap?.nodes.find(n => n.status === 'available') || activeRoadmap?.nodes[0]

  // Dynamic prompts personalized to the user's interests
  const quickPrompts = useMemo(() => {
    const picks = profile.interests || []
    if (picks.length === 0) return FALLBACK_PROMPTS
    const topic = activeNode?.title || 'my current topic'
    const goal  = profile.goal || activeRoadmap?.subject || 'what I\'m learning'

    return picks.slice(0, 4).map(id => {
      const label = interestLabel(id)
      const emoji = interestEmoji(id)
      const flav  = INTEREST_FLAVOR[id] || { follow: `through ${label}` }
      return {
        icon: emoji,
        label: `Teach me with ${label}`,
        prompt: `Teach me ${topic} using examples from ${label} — ${flav.follow}. Goal: ${goal}.`,
      }
    })
  }, [profile.interests, profile.goal, activeNode?.title, activeRoadmap?.subject])

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
              <Mascot size="hero" animate={isThinking ? 'thinking' : 'none'} speed={280} />
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
                {m.role === 'goaty' && !m.typing && (
                  <img className="chat-msg-avatar" src={goatyImg} alt="Goaty" />
                )}
                {m.typing ? (
                  <div className="g-thinking-pill" aria-live="polite">
                    <Mascot size="sm" animate="thinking" speed={260} />
                    <span>Goaty is thinking</span>
                    <span className="dots"><span/><span/><span/></span>
                  </div>
                ) : (
                  <div className={`chat-msg-bubble ${m.role}`}>
                    {m.text}
                    <div className="chat-msg-time">
                      {new Date(m.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      {m.role === 'user' && ' ✓'}
                    </div>
                  </div>
                )}
                {m.role === 'user' && !m.typing && (
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
            {quickPrompts.map(q => (
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
