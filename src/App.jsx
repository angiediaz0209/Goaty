import { useEffect, useRef, useState } from 'react'
import Game from './Games.jsx'

const GAME_TYPES = [
  { id: 'quiz_battle', label: '⚔️ Quiz Battle' },
  { id: 'match_pairs', label: '🃏 Match Pairs' },
  { id: 'spot_mistake', label: '🔍 Spot the Mistake' },
  { id: 'order_steps', label: '🔢 Order the Steps' },
]

// One-click demos — real live generation, no blank page.
const EXAMPLES = [
  { label: 'Recursion × Soccer ⚽', topic: 'recursion', passions: ['Soccer ⚽'] },
  { label: 'Compound interest × Anime 🎌', topic: 'compound interest', passions: ['Anime 🎌'] },
  { label: 'Photosynthesis × Cooking 🍳', topic: 'photosynthesis', passions: ['Cooking 🍳'] },
  { label: 'The French Revolution × Gaming 🎮', topic: 'the French Revolution', passions: ['Gaming 🎮'] },
]

// A seeded learner so the memory panel + adaptation story is visible instantly.
const DEMO_PROFILE = {
  passions: ['Soccer ⚽', 'Anime 🎌', 'Art 🎨'],
  learnerStyle: 'Learns best through stories and characters — narrative analogies land better than spatial/positional ones.',
  lensLog: [
    { lens: 'Anime', topic: 'variables', worked: true },
    { lens: 'Soccer', topic: 'recursion', worked: false },
    { lens: 'Anime', topic: 'recursion', worked: true },
  ],
  xp: 40,
}

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

async function askGoaty(payload) {
  const res = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'Goaty had trouble responding.')
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
  const [chatMsgs, setChatMsgs] = useState([]) // { role, content }
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)
  const [game, setGame] = useState(null) // { type, spec, lens }
  const [gameLoading, setGameLoading] = useState(false)

  async function launchGame(gameType) {
    if (!topic.trim() || profile.passions.length === 0) return
    const lens = lesson?.lensUsed || pickStartLens()
    setGameLoading(true); setError('')
    try {
      const spec = await askMuse({
        action: 'game',
        gameType,
        topic: topic.trim(),
        lens,
        learnerStyle: profile.learnerStyle,
      })
      setGame({ type: gameType, spec, lens })
    } catch (e) {
      setError(e.message)
    } finally {
      setGameLoading(false)
    }
  }

  function finishGame(passed) {
    const lens = game?.lens || 'game'
    setProfile((pr) => ({
      ...pr,
      xp: (pr.xp || 0) + (passed ? 10 : 3),
      lensLog: [...pr.lensLog, { lens, topic: topic.trim(), worked: passed }],
    }))
    setGame(null)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs, chatLoading])

  async function sendChat() {
    const q = chatInput.trim()
    if (!q || !lesson) return
    const history = [...chatMsgs, { role: 'user', content: q }]
    setChatMsgs(history)
    setChatInput('')
    setChatLoading(true)
    try {
      const data = await askGoaty({
        action: 'chat',
        topic: topic.trim(),
        lensUsed: lesson.lensUsed,
        explanation: lesson.explanation,
        learnerStyle: profile.learnerStyle,
        history,
      })
      setChatMsgs((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setChatMsgs((m) => [...m, { role: 'assistant', content: '⚠️ ' + e.message }])
    } finally {
      setChatLoading(false)
    }
  }

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
  function pickStartLens(passions = profile.passions) {
    const wins = new Set(profile.lensLog.filter((l) => l.worked).map((l) => l.lens))
    const preferred = passions.find((p) => wins.has(bare(p)))
    return bare(preferred || passions[0])
  }

  async function runLesson(topicVal, passionsVal) {
    if (!topicVal.trim() || passionsVal.length === 0) return
    setLoading(true); setError(''); setFeedback(null); setAnswer(''); setChatMsgs([]); setLesson(null)
    const activeLens = pickStartLens(passionsVal)
    try {
      const data = await askGoaty({
        action: 'teach',
        topic: topicVal.trim(),
        activeLens,
        otherPassions: passionsVal.map(bare).filter((p) => p !== activeLens),
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

  const startLesson = () => runLesson(topic, profile.passions)

  function runExample(ex) {
    setTopic(ex.topic)
    setProfile((pr) => ({ ...pr, passions: ex.passions }))
    runLesson(ex.topic, ex.passions)
  }

  function loadDemo() {
    setProfile(DEMO_PROFILE)
    setTopic('the water cycle')
  }

  async function submitAnswer() {
    if (!answer.trim() || !lesson) return
    setLoading(true); setError('')
    try {
      const data = await askGoaty({
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
        // Goaty re-taught through a new world — the "it learned me" moment
        setLesson({ lensUsed: data.lensUsed, explanation: data.explanation, checkQuestion: data.checkQuestion })
        setTriedLenses((t) => [...t, data.lensUsed])
        setAnswer(''); setChatMsgs([])
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
        <h1>Goaty <span className="goat">🐐</span></h1>
        <p className="tagline">Your GOAT study buddy — learn anything through the things you already love.</p>
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

            <div className="examples">
              <span className="examples-label">Or try an example:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex.label} className="example-chip" onClick={() => runExample(ex)} disabled={loading}>
                  {ex.label}
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

              <div className="chat">
                <div className="chat-head">💬 Confused about anything? Ask Goaty — it'll answer in your {lesson.lensUsed} world.</div>
                {chatMsgs.length > 0 && (
                  <div className="chat-thread">
                    {chatMsgs.map((m, i) => (
                      <div key={i} className={'bubble ' + m.role}>{m.content}</div>
                    ))}
                    {chatLoading && <div className="bubble assistant typing">Goaty is thinking…</div>}
                    <div ref={chatEndRef} />
                  </div>
                )}
                <div className="answer-row">
                  <input
                    className="answer-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder={'e.g. "wait, I don\'t get the base case"'}
                    disabled={chatLoading}
                  />
                  <button className="primary" onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>
                    {chatLoading ? '…' : 'Ask'}
                  </button>
                </div>
              </div>

              <div className="games">
                <div className="games-head">🎮 Test yourself — games themed to your <b>{lesson.lensUsed}</b> world</div>
                <div className="game-buttons">
                  {GAME_TYPES.map((g) => (
                    <button key={g.id} className="game-launch" onClick={() => launchGame(g.id)} disabled={gameLoading}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="card memory">
          <div className="memory-head">
            <h2>What Goaty knows about you</h2>
            <div className="mem-actions">
              <button className="link" onClick={loadDemo}>demo learner</button>
              <button className="link" onClick={resetMemory}>reset</button>
            </div>
          </div>

          <div className="xp-row">
            <span className="xp-badge">🐐 {profile.xp || 0} XP</span>
            <span className="xp-note">earned by playing</span>
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
              {profile.learnerStyle || 'Goaty is still figuring this out…'}
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

          <p className="mem-foot">This memory persists across lessons — Goaty adapts to you over time.</p>
        </aside>
      </div>

      {(game || gameLoading) && (
        <div className="game-overlay" onClick={(e) => { if (e.target === e.currentTarget && !gameLoading) setGame(null) }}>
          <div className="game-modal">
            {!gameLoading && <button className="game-close" onClick={() => setGame(null)}>×</button>}
            {gameLoading ? (
              <div className="game-loading">🐐 Goaty is building your game…</div>
            ) : (
              <Game gameType={game.type} spec={game.spec} onFinish={finishGame} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
