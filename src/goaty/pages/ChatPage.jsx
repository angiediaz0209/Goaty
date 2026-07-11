import { useEffect, useRef, useState } from 'react'
import Mascot from '../components/Mascot.jsx'
import TypingDots from '../components/TypingDots.jsx'
import { useGoatyStore, getInterestCatalog } from '../store.js'

const PROMPTS = [
  "Explain recursion like I'm five",
  "Quiz me on functions",
  "Give me a project idea",
  "How's my progress?",
]

export default function ChatPage() {
  const { state, sendChat, removeInterest, setGoal } = useGoatyStore()
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const catalog = getInterestCatalog()
  const scroller = useRef(null)

  const submit = (e) => {
    e?.preventDefault?.()
    if (!text.trim()) return
    sendChat(text)
    setText('')
    setTyping(true)
    setTimeout(() => setTyping(false), 1200)
  }

  const usePrompt = (p) => {
    setText(p)
  }

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [state.chat.length, typing])

  const userInterests = state.profile.interests
    .map(id => catalog.find(c => c.id === id))
    .filter(Boolean)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
      {/* Chat main */}
      <div className="g-card" style={{ display: 'flex', flexDirection: 'column', height: '72vh', minHeight: 480 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
          <Mascot size="sm" />
          <div>
            <div style={{ fontWeight: 800 }}>Goaty</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Your learning companion · online</div>
          </div>
        </div>

        <div ref={scroller} style={{ flex: 1, overflowY: 'auto', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.chat.map(m => (
            <div key={m.id} className={`g-chat-row ${m.role === 'user' ? 'user' : ''}`}>
              {m.role === 'goaty' && <Mascot size="sm" />}
              <div className={`g-bubble ${m.role}`}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="g-chat-row">
              <Mascot size="sm" />
              <div className="g-bubble goaty"><TypingDots /></div>
            </div>
          )}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', gap: 8, paddingTop: 10 }}>
          <input
            className="g-input"
            placeholder="Ask Goaty anything..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="g-btn primary">Send</button>
        </form>
      </div>

      {/* Sidebar */}
      <aside className="g-col">
        <div className="g-card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Goaty remembers</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 12 }}>Interests</div>
          <div className="g-row" style={{ marginTop: 6 }}>
            {userInterests.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 13 }}>None yet.</span>}
            {userInterests.map(i => (
              <span key={i.id} className="g-pill grape" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                {i.emoji} {i.label}
                <button
                  onClick={() => removeInterest(i.id)}
                  aria-label={`Remove ${i.label}`}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 14, padding: 0, marginLeft: 4 }}
                >×</button>
              </span>
            ))}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 14 }}>Goal</div>
          <input
            className="g-input"
            style={{ marginTop: 4, padding: '8px 12px' }}
            value={state.profile.goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="What are you working on?"
          />
          <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 14 }}>Learner style</div>
          <div className="g-row" style={{ marginTop: 6 }}>
            <span className="g-pill">Pace {state.profile.style.pace}</span>
            <span className="g-pill">Depth {state.profile.style.depth}</span>
            <span className="g-pill">Playful {state.profile.style.playfulness}</span>
          </div>
        </div>

        <div className="g-card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Suggested prompts</div>
          <div className="g-col" style={{ gap: 6 }}>
            {PROMPTS.map(p => (
              <button key={p} className="g-chip" onClick={() => usePrompt(p)} style={{ justifyContent: 'flex-start' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
