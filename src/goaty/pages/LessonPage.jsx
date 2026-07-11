import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import TypingDots from '../components/TypingDots.jsx'
import Confetti from '../components/Confetti.jsx'
import { useGoatyStore } from '../store.js'
import { getLesson, personalize } from '../data/lessons.js'

function ChatDrawer({ onClose, lessonTitle }) {
  const { state, sendChat } = useGoatyStore()
  const [text, setText] = useState('')
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendChat(text)
    setText('')
  }
  return (
    <>
      <div className="g-scrim" onClick={onClose} />
      <aside className="g-drawer" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>🐐</span> Ask Goaty about “{lessonTitle}”
          </div>
          <button className="g-btn ghost small" onClick={onClose}>Close</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state.chat.slice(-8).map(m => (
            <div key={m.id} className={`g-chat-row ${m.role === 'user' ? 'user' : ''}`}>
              <div className={`g-bubble ${m.role}`}>
                {m.typing ? <TypingDots /> : m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
          <input className="g-input" placeholder="Ask about this lesson..." value={text} onChange={e => setText(e.target.value)} />
          <button className="g-btn primary">Send</button>
        </form>
      </aside>
    </>
  )
}

function Section({ label, children }) {
  return (
    <section style={{ marginTop: 28 }}>
      <div style={{
        fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase',
        letterSpacing: '.12em', fontWeight: 700, marginBottom: 8
      }}>{label}</div>
      {children}
    </section>
  )
}

function MiniQuiz({ questions, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [burst, setBurst] = useState(0)

  const pick = (qi, ci) => {
    if (answers[qi] !== undefined) return
    setAnswers(a => ({ ...a, [qi]: ci }))
    if (ci === questions[qi].correct) setBurst(b => b + 1)
  }

  const score = Object.entries(answers).reduce((acc, [qi, ci]) =>
    acc + (ci === questions[qi].correct ? 1 : 0), 0)
  const allAnswered = Object.keys(answers).length === questions.length

  const finish = () => {
    setDone(true)
    onComplete?.(score)
  }

  if (done) {
    return (
      <div className="g-card" style={{ textAlign: 'center' }}>
        <Confetti trigger={burst} />
        <div style={{ fontSize: 44 }}>🎉</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800 }}>
          {score} / {questions.length}
        </div>
        <div style={{ color: 'var(--muted)', marginTop: 6 }}>
          Mini-quiz complete — nice work!
        </div>
      </div>
    )
  }

  return (
    <div className="g-col" style={{ gap: 14 }}>
      <Confetti trigger={burst} />
      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const answered = chosen !== undefined
        return (
          <div key={qi} className="g-card">
            <div style={{ fontWeight: 700, marginBottom: 10 }}>
              {qi + 1}. {q.q}
            </div>
            <div className="g-col" style={{ gap: 6 }}>
              {q.choices.map((choice, ci) => {
                const isCorrect = ci === q.correct
                const isPicked = ci === chosen
                let style = {}
                if (answered) {
                  if (isCorrect) style = { background: 'rgba(126,214,122,0.18)', borderColor: 'var(--meadow)' }
                  else if (isPicked) style = { background: 'rgba(255,138,107,0.15)', borderColor: 'var(--coral)' }
                }
                return (
                  <button
                    key={ci}
                    className="g-btn"
                    onClick={() => pick(qi, ci)}
                    disabled={answered}
                    style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%', ...style }}
                  >
                    <span style={{ fontWeight: 800, marginRight: 8 }}>{String.fromCharCode(65 + ci)}.</span>
                    {choice}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className="g-callout" style={{
                marginTop: 10,
                borderLeftColor: chosen === q.correct ? 'var(--meadow)' : 'var(--coral)',
                background: chosen === q.correct
                  ? 'rgba(126,214,122,0.12)'
                  : 'rgba(255,138,107,0.12)'
              }}>
                <strong>{chosen === q.correct ? '✅ Correct!' : '🤔 Not quite.'}</strong> {q.explain}
              </div>
            )}
          </div>
        )
      })}
      <button className="g-btn primary" disabled={!allAnswered} onClick={finish}>
        {allAnswered ? 'Finish quiz →' : `Answer all ${questions.length} to finish`}
      </button>
    </div>
  )
}

export default function LessonPage() {
  const { id } = useParams()
  const { state, addXp, completeNode } = useGoatyStore()
  const [drawer, setDrawer] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [burst, setBurst] = useState(0)

  const lesson = getLesson(id) || getLesson('n1')
  const roadmap = state.roadmaps[0]
  const lens = roadmap?.lens || 'anime'
  const subject = roadmap?.subject || 'JavaScript'
  const primaryInterest = state.profile.interests[0] || lens

  // personalize all text with the learner's #1 interest
  const p = useMemo(() => (t) => personalize(t, primaryInterest), [primaryInterest])

  const claimReward = () => {
    if (claimed) return
    setClaimed(true)
    setBurst(b => b + 1)
    addXp(lesson.xpReward)
    completeNode(lesson.id)
  }

  return (
    <div className="g-col" style={{ gap: 12, maxWidth: 780, margin: '0 auto', width: '100%' }}>
      <Confetti trigger={burst} />

      {/* 1. Header */}
      <div className="g-lens-banner">📺 Teaching {subject} through {p('{interest}')}</div>
      <h1 style={{ marginBottom: 4 }}>{lesson.title}</h1>
      <div style={{ color: 'var(--muted)', fontSize: 17 }}>{lesson.subtitle}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        <span className="g-pill">⏱ {lesson.estimatedTime} min</span>
        <span className="g-pill">🎯 {lesson.difficulty}</span>
        <span className="g-pill" style={{ background: 'rgba(255,138,107,0.15)', color: 'var(--coral-dark)' }}>+{lesson.xpReward} XP</span>
      </div>

      {/* 2. Learning Goal */}
      <Section label="Learning goal">
        <div className="g-card">
          {p(lesson.learningGoal).split('\n').filter(Boolean).map((para, i) => (
            <p key={i} style={{ margin: '0 0 10px', lineHeight: 1.65 }}>{para}</p>
          ))}
        </div>
      </Section>

      {/* 3. Story */}
      <Section label="Story time">
        <div className="g-card" style={{ background: 'rgba(198,240,226,0.35)' }}>
          {p(lesson.story).split('\n').filter(Boolean).map((para, i) => (
            <p key={i} style={{ margin: '0 0 10px', lineHeight: 1.7, fontSize: 16.5 }}>{para}</p>
          ))}
        </div>
      </Section>

      {/* 4. Concept explanation */}
      <Section label="How it works">
        <div className="g-card">
          {p(lesson.explanation).split('\n').filter(Boolean).map((para, i) => (
            <p key={i} style={{ margin: '0 0 10px', lineHeight: 1.7 }}>{para}</p>
          ))}
        </div>
      </Section>

      {/* 5. Visual analogy */}
      <Section label="Visual analogy">
        <div className="g-callout" style={{ fontSize: 16.5, lineHeight: 1.7 }}>
          {p(lesson.visualAnalogy)}
        </div>
      </Section>

      {/* 6-7. Examples */}
      <Section label="Examples">
        <div className="g-col" style={{ gap: 14 }}>
          {lesson.examples.map((ex, i) => (
            <div key={i} className="g-card">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Example {i + 1}</div>
              <pre className="g-code">{p(ex.code)}</pre>
              <p style={{ marginTop: 10, lineHeight: 1.65, color: 'var(--muted)' }}>{p(ex.explain)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. Challenge */}
      <Section label="Your turn — challenge">
        <div className="g-card" style={{ background: 'rgba(255,205,91,0.15)' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>🎯 Try it yourself</div>
          <p style={{ lineHeight: 1.65 }}>{p(lesson.challenge.prompt)}</p>
          <pre className="g-code" style={{ opacity: 0.6 }}>{lesson.challenge.placeholder}</pre>
          {!showSolution ? (
            <button className="g-btn ghost" onClick={() => setShowSolution(true)}>Show solution</button>
          ) : (
            <div style={{ marginTop: 12 }}>
              <pre className="g-code">{p(lesson.solution.code)}</pre>
              <p style={{ marginTop: 10, color: 'var(--muted)' }}>{p(lesson.solution.explain)}</p>
            </div>
          )}
        </div>
      </Section>

      {/* 10. Goaty tip */}
      <Section label="Goaty tip">
        <div className="g-tip">
          <Mascot size="sm" />
          <div>
            <div style={{ fontWeight: 800 }}>🐐 Goaty says</div>
            <div style={{ color: 'var(--muted)' }}>{lesson.goatyTip}</div>
          </div>
        </div>
      </Section>

      {/* 11. Fun fact */}
      <Section label="Fun fact">
        <div className="g-card" style={{ borderLeft: '4px solid var(--grape)' }}>
          💡 {lesson.funFact}
        </div>
      </Section>

      {/* 12. Common mistakes */}
      <Section label="Watch out for">
        <div className="g-card">
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
            {lesson.commonMistakes.map((m, i) => (
              <li key={i}>❌ {m}</li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 13. Mini quiz */}
      <Section label="Mini quiz — 5 questions">
        <MiniQuiz questions={lesson.quiz} onComplete={claimReward} />
      </Section>

      {/* 14-15. Rewards + unlock */}
      {claimed && (
        <Section label="Rewards">
          <div className="g-card" style={{ textAlign: 'center', background: 'rgba(126,214,122,0.15)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Lesson complete!</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="g-pill" style={{ background: 'rgba(255,138,107,0.2)' }}>+{lesson.xpReward} XP</span>
              <span className="g-pill" style={{ background: 'rgba(255,205,91,0.25)' }}>+1 Streak</span>
              <span className="g-pill" style={{ background: 'rgba(139,124,255,0.2)' }}>+5 Knowledge</span>
            </div>
            <div style={{ marginTop: 14, color: 'var(--muted)' }}>Goaty is proud of you. 🐐</div>
            <div style={{ marginTop: 18, fontWeight: 700 }}>
              🎉 You've unlocked: <span style={{ color: 'var(--coral-dark)' }}>{lesson.unlockNext}</span>
            </div>
          </div>
        </Section>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <Link to="/app/roadmap" className="g-btn ghost">← Back to roadmap</Link>
        <Link to={`/app/quiz/${id}`} className="g-btn primary">Take the full quiz →</Link>
      </div>

      <button className="g-ask-fab" onClick={() => setDrawer(true)}>💬 Ask Goaty</button>
      {drawer && <ChatDrawer onClose={() => setDrawer(false)} lessonTitle={lesson.title} />}
    </div>
  )
}
