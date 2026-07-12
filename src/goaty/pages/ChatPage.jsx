import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot, { goatyImg } from '../components/Mascot.jsx'
import ChatRichText from '../components/ChatRichText.jsx'
import { useGoatyStore, interestLabel, interestEmoji } from '../store.js'

// Rotating accent colors for the quick-prompt chips (warm on the left, cool on the right)
const CHIP_TONES = ['peach', 'blue', 'pink', 'blue']

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
  const { state, sendChat, clearChat } = useGoatyStore()
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

  const displayName = profile.name || 'Explorer'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'A'

  return (
    <div className="chat-v2">
      {/* ================= LEFT: big Goaty + its cards ================= */}
      <aside className="chat-v2-side">
        {/* Speech bubble above Goaty's head, then the big mascot */}
        <div className="cv2-hero">
          <div className="cv2-bubble">
            <div>Hi there! 🌱 I'm <strong style={{ color: 'var(--blue)' }}>Goaty</strong></div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Your learning companion 🌿</div>
          </div>
          <Mascot size="hero" animate={isThinking ? 'thinking' : 'none'} speed={280} />
        </div>

        {/* Level card */}
        <div className="cv2-level">
          <div className="cv2-level-title">Level {level}</div>
          <div className="cv2-level-track"><span style={{ width: `${(xpInLevel / xpForLevel) * 100}%` }} /></div>
          <div className="cv2-level-xp">{xpInLevel} / {xpForLevel} XP</div>
        </div>

        {/* Streak card */}
        <div className="g-card cv2-streak-card">
          <div className="cv2-card-title">{streakDays} Day Streak 🔥</div>
          <div className="cv2-checks" aria-hidden="true">
            {[0, 1, 2].map(i => (
              <span key={i} className="cv2-check done">✓</span>
            ))}
            <span className="cv2-check next">{Math.max(streakDays, 3) + 1}</span>
          </div>
        </div>

        {/* Avatar card */}
        <div className="g-card cv2-avatar">
          <span className="cv2-avatar-badge">{initial}</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 800 }}>{displayName}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Explorer</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--muted)' }}>▾</div>
        </div>
      </aside>

      {/* ================= MAIN COLUMN: chat + cards under it ================= */}
      <div className="chat-v2-content">
      <section className="chat-v2-main">
        <header className="cv2-chat-head">
          <span className="cv2-chat-head-badge"><img src={goatyImg} alt="Goaty" /></span>
          <div>
            <div className="cv2-chat-head-name">Goaty</div>
            <div className="cv2-chat-head-sub">Your learning companion</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="cv2-clear-btn"
              onClick={clearChat}
              aria-label="Clear chat"
            >
              🧹 Clear
            </button>
            <Link to="/app/notifications" className="chat-icon-btn" aria-label="Notifications">🔔</Link>
            <Link to="/app/settings" className="chat-icon-btn" aria-label="Settings">⚙️</Link>
          </div>
        </header>

        <div ref={scroller} className="cv2-chat-scroll">
          {chat.map(m => (
            <div key={m.id} className={`cv2-msg ${m.role}`}>
              {m.typing ? (
                <div className="g-thinking-pill" aria-live="polite">
                  <Mascot size="sm" animate="thinking" speed={260} />
                  <span>Goaty is thinking</span>
                  <span className="dots"><span/><span/><span/></span>
                </div>
              ) : (
                <div className={`cv2-msg-bubble ${m.role}`}>
                  {m.role === 'goaty' ? <ChatRichText text={m.text} /> : m.text}
                  <div className="cv2-msg-time">
                    {new Date(m.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    {m.role === 'user' && ' ✓'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="cv2-chat-foot">
          <form onSubmit={submit} className="cv2-input-row">
            <input
              className="cv2-input"
              placeholder="Ask Goaty anything..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button className="cv2-send" aria-label="Send">➤</button>
          </form>
        </footer>
      </section>

      {/* ---- Cards under the chat ---- */}
      <div className="cv2-under">
        <Link to={activeMission?.target || '/app/missions'} className="cv2-mission">
          <div className="cv2-mission-label">🎯 Today's Mission</div>
          <div className="cv2-mission-title">{activeMission?.title || 'Complete a mini-lesson'}</div>
        </Link>

        <div className="cv2-quote">"Small steps today, big wins tomorrow."</div>
      </div>
      </div>

      {/* ================= RIGHT: quick "Teach me with…" prompts ================= */}
      <aside className="chat-v2-right">
        <div className="cv2-prompts-title">Teach me with…</div>
        <div className="cv2-chips">
          {quickPrompts.map((q, i) => (
            <button
              key={q.label}
              className={`cv2-chip ${CHIP_TONES[i % CHIP_TONES.length]}`}
              onClick={() => usePrompt(q.prompt)}
            >
              <span>{q.icon}</span> {q.label}
            </button>
          ))}
        </div>

        <div className="cv2-prompts-title">On this topic</div>
        <button
          className="cv2-topic-btn blue"
          onClick={() => usePrompt(`Quiz me on ${activeNode?.title || 'what I\'m learning'}.`)}
        >
          📝 Create a Quiz
        </button>
        <Link to="/app/games" className="cv2-topic-btn orange">
          🎮 Play a Game
        </Link>

        <Link to="/app/roadmap" className="g-card cv2-focus" style={{ textDecoration: 'none' }}>
          <div className="cv2-focus-label">📗 Learning Focus</div>
          <div className="cv2-focus-title">{activeNode?.title || 'Functions as Special Moves'}</div>
        </Link>
      </aside>
    </div>
  )
}
