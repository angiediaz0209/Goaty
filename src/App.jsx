import { useEffect, useRef, useState } from 'react'

const DEFAULT_PASSIONS = ['Soccer ⚽', 'Anime 🎌', 'Art 🎨', 'Cooking 🍳', 'Music 🎧', 'Gaming 🎮']
const STORAGE_KEY = 'muse-profile-v1'

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.passions)) return saved
  } catch {}
  return { passions: ['Soccer ⚽', 'Anime 🎌'], learnerStyle: '', lensLog: [] }
}

// strip the trailing emoji for cleaner lens names in prompts / matching
const bare = (p) => p.replace(/\s*\p{Emoji}.*$/u, '').trim() || p

async function askMuse(payload) {
  const res = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'Muse had trouble responding.')
  return data
}

function Explanation({ text }) {
  // lightweight rendering: paragraphs + highlight the grounding line
  return (
    <div className="explanation">
      {text.split(/\n{1,}/).filter(Boolean).map((para, i) => {
        const grounding = /^in plain terms:/i.test(para.trim())
        return (
          <p key={i} className={grounding ? 'grounding' : ''}>
            {para.trim()}
          </p>
        )
      })}
    </div>
  )
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile)
  const [topic, setTopic] = useState('recursion')
  const [lesson, setLesson] = useState(null) // { lensUsed, explanation, checkQuestion }
  const [triedLenses, setTriedLenses] = useState([])
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // { correct, feedback }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const answerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const togglePassion = (p) =>
    setProfile((pr) => ({
      ...pr,
      passions: pr.passions.includes(p)
        ? pr.passions.filter((x) => x !== p)
        : [...pr.passions, p],
    }))

  // choose the lens with the best track record, else the first passion
  function pickStartLens() {
    const wins = new Set(profile.lensLog.filter((l) => l.worked).map((l) => l.lens))
    const preferred = profile.passions.find((p) => wins.has(bare(p)))
    return bare(preferred || profile.passions[0])
  }

  async function startLesson() {
    if (!topic.trim() || profile.passions.length === 0) return
    setLoading(true); setError(''); setFeedback(null); setAnswer('')
    const activeLens = pickStartLens()
    try {
      const data = await askMuse({
        action: 'teach',
        topic: topic.trim(),
        activeLens,
        otherPassions: profile.passions.map(bare).filter((p) => p !== activeLens),
        learnerStyle: profile.learnerStyle,
      })
      setLesson(data)
      setTriedLenses([data.lensUsed])
      setTimeout(() => answerRef.current?.focus(), 50)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!answer.trim() || !lesson) return
    setLoading(true); setError('')
    try {
      const data = await askMuse({
        action: 'respond',
        topic: topic.trim(),
        lensUsed: lesson.lensUsed,
        checkQuestion: lesson.checkQuestion,
        answer: answer.trim(),
        otherPassions: profile.passions.map(bare).filter((p) => !triedLenses.includes(p)),
        triedLenses,
        learnerStyle: profile.learnerStyle,
      })
      setFeedback({ correct: data.correct, feedback: data.feedback })
      // update the visible memory
      setProfile((pr) => ({
        ...pr,
        learnerStyle: data.learnerStyleUpdate?.trim() || pr.learnerStyle,
        lensLog: [...pr.lensLog, { lens: lesson.lensUsed, topic: topic.trim(), worked: data.correct }],
      }))
      if (data.switchedLens && data.explanation) {
        // Muse re-taught through a new world — the "it learned me" moment
        setLesson({ lensUsed: data.lensUsed, explanation: data.explanation, checkQuestion: data.checkQuestion })
        setTriedLenses((t) => [...t, data.lensUsed])
        setAnswer('')
        setTimeout(() => { setFeedback(null); answerRef.current?.focus() }, 1800)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetMemory = () =>
    setProfile((pr) => ({ ...pr, learnerStyle: '', lensLog: [] }))

  const winCounts = {}
  for (const l of profile.lensLog) {
    winCounts[l.lens] = winCounts[l.lens] || { win: 0, miss: 0 }
    l.worked ? winCounts[l.lens].win++ : winCounts[l.lens].miss++
  }

  return (
    <div className="app">
      <header>
        <h1>Muse</h1>
        <p className="tagline">Learn anything through the things you already love.</p>
      </header>

      <div className="layout">
        <main>
          <section className="card setup">
            <label className="field-label">What do you want to understand?</label>
            <div className="topic-row">
              <input
                className="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startLesson()}
                placeholder="e.g. recursion, compound interest, the French Revolution"
              />
              <button className="primary" onClick={startLesson} disabled={loading || !topic.trim()}>
                {loading && !lesson ? 'Thinking…' : 'Teach me'}
              </button>
            </div>

            <label className="field-label">Your worlds</label>
            <div className="chips">
              {DEFAULT_PASSIONS.map((p) => (
                <button
                  key={p}
                  className={'chip' + (profile.passions.includes(p) ? ' active' : '')}
                  onClick={() => togglePassion(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          {error && <div className="card error">⚠️ {error}</div>}

          {lesson && (
            <section className="card lesson">
              <div className="lens-badge">Explained through your love of <b>{lesson.lensUsed}</b></div>
              <Explanation text={lesson.explanation} />

              <div className="check">
                <div className="check-q">🤔 {lesson.checkQuestion}</div>
                {feedback && (
                  <div className={'feedback ' + (feedback.correct ? 'good' : 'bad')}>
                    {feedback.correct ? '✅ ' : '↻ '}{feedback.feedback}
                    {!feedback.correct && <div className="switching">Let me try one of your other worlds…</div>}
                  </div>
                )}
                <div className="answer-row">
                  <input
                    ref={answerRef}
                    className="answer-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                    placeholder="Your answer, in the same world…"
                    disabled={loading}
                  />
                  <button className="primary" onClick={submitAnswer} disabled={loading || !answer.trim()}>
                    {loading ? '…' : 'Check'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="card memory">
          <div className="memory-head">
            <h2>What Muse knows about you</h2>
            <button className="link" onClick={resetMemory}>reset</button>
          </div>

          <div className="mem-block">
            <div className="mem-label">Your worlds</div>
            <div className="mem-passions">
              {profile.passions.length ? profile.passions.map((p) => <span key={p} className="pill">{p}</span>) : <span className="muted">none picked</span>}
            </div>
          </div>

          <div className="mem-block">
            <div className="mem-label">How you learn</div>
            <div className={profile.learnerStyle ? 'mem-style' : 'muted'}>
              {profile.learnerStyle || 'Muse is still figuring this out…'}
            </div>
          </div>

          <div className="mem-block">
            <div className="mem-label">Which lenses land for you</div>
            {Object.keys(winCounts).length === 0 && <div className="muted">no lessons yet</div>}
            {Object.entries(winCounts).map(([lens, c]) => (
              <div key={lens} className="track">
                <span className="track-lens">{lens}</span>
                <span className="track-score">
                  {'★'.repeat(c.win)}{'·'.repeat(c.miss)}
                </span>
              </div>
            ))}
          </div>

          <p className="mem-foot">This memory persists across lessons — Muse adapts to you over time.</p>
        </aside>
      </div>
    </div>
  )
}
