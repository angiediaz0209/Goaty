import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import TypingDots from '../components/TypingDots.jsx'
import { useGoatyStore } from '../store.js'

function ChatDrawer({ onClose }) {
  const { state, sendChat } = useGoatyStore()
  const [text, setText] = useState('')
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendChat(text)
    setText('')
  }
  const lastGoaty = state.chat[state.chat.length - 1]
  const typing = lastGoaty && lastGoaty.role === 'user'
  return (
    <>
      <div className="g-scrim" onClick={onClose} />
      <aside className="g-drawer" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>🐐</span> Ask Goaty
          </div>
          <button className="g-btn ghost small" onClick={onClose}>Close</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.chat.slice(-8).map(m => (
            <div key={m.id} className={`g-chat-row ${m.role === 'user' ? 'user' : ''}`}>
              <div className={`g-bubble ${m.role}`}>{m.text}</div>
            </div>
          ))}
          {typing && <div className="g-chat-row"><div className="g-bubble goaty"><TypingDots /></div></div>}
        </div>
        <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
          <input className="g-input" placeholder="Ask about this lesson..." value={text} onChange={e => setText(e.target.value)} />
          <button className="g-btn primary">Send</button>
        </form>
      </aside>
    </>
  )
}

export default function LessonPage() {
  const { id } = useParams()
  const { state } = useGoatyStore()
  const [drawer, setDrawer] = useState(false)

  const node = state.roadmaps[0]?.nodes.find(n => n.id === id)
  const title = node?.title || 'Lesson'
  const lens = state.roadmaps[0]?.lens || 'anime'
  const topic = state.roadmaps[0]?.subject || 'the topic'

  return (
    <div className="g-col" style={{ gap: 20, maxWidth: 780, margin: '0 auto', width: '100%' }}>
      <div className="g-lens-banner">📺 Teaching {topic} through {lens}</div>
      <h1>{title}</h1>

      <p style={{ fontSize: 18, lineHeight: 1.7 }}>
        Imagine you're watching your favorite {lens} — the hero learns a new move, tries it, fails, tries again, and finally lands it.
        That's what a <strong>function</strong> feels like in code. You give it a name, you tell it what to do, and then any time
        you need it, you just call it out — <em>"Kamehameha!"</em>.
      </p>

      <div className="g-lesson-illustration" role="img" aria-label="Abstract lesson illustration" />

      <div className="g-callout">
        <strong>Key idea:</strong> functions are reusable spells. Write once, cast many times.
      </div>

      <pre className="g-code">{`function kamehameha(power) {
  return "Ka-me-ha-me-" + "HA!".repeat(power)
}

kamehameha(3) // → "Ka-me-ha-me-HA!HA!HA!"`}</pre>

      <div className="g-tip">
        <Mascot size="sm" />
        <div>
          <div style={{ fontWeight: 800 }}>Goaty tip</div>
          <div style={{ color: 'var(--muted)' }}>
            When your brain hurts, try reading the code out loud like a spell. Seriously — it works.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <Link to="/app/roadmap" className="g-btn ghost">← Back to roadmap</Link>
        <Link to={`/app/quiz/${id}`} className="g-btn primary">Take the quiz →</Link>
      </div>

      <button className="g-ask-fab" onClick={() => setDrawer(true)}>💬 Ask Goaty</button>
      {drawer && <ChatDrawer onClose={() => setDrawer(false)} />}
    </div>
  )
}
