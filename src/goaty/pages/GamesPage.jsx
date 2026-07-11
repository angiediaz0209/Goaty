import { useState } from 'react'
import Game from '../../Games.jsx'
import Mascot from '../components/Mascot.jsx'
import { useGoatyStore } from '../store.js'

const GAME_TYPES = [
  { id: 'quiz_battle',  label: 'Quiz Battle',       emoji: '⚔️', color: 'orange', body: 'Fast rounds. Right answers = XP.' },
  { id: 'match_pairs',  label: 'Match Pairs',       emoji: '🃏', color: 'blue',   body: 'Pair concepts with metaphors from your world.' },
  { id: 'spot_mistake', label: 'Spot the Mistake',  emoji: '🔍', color: 'red',    body: 'One of these statements is wrong — catch it!' },
  { id: 'order_steps',  label: 'Order the Steps',   emoji: '🔢', color: 'cyan',   body: 'Drag the process into the right order.' },
]

// Passion presets pulled from onboarding interests
const LENS_SUGGESTIONS = ['Soccer ⚽', 'Anime 🎌', 'Gaming 🎮', 'Music 🎧', 'Cooking 🍳', 'Basketball 🏀', 'Marvel 🦸', 'Space 🚀']
const TOPIC_SUGGESTIONS = ['recursion', 'variables', 'compound interest', 'photosynthesis', 'supply and demand', 'the water cycle']

async function callTutor(payload) {
  const res = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'Failed to build the game.')
  return data
}

export default function GamesPage() {
  const { state, addXp } = useGoatyStore()
  const firstInterest = state.profile.interests?.[0]?.label || ''
  const [topic, setTopic] = useState('recursion')
  const [lens, setLens] = useState(firstInterest || 'Soccer ⚽')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [game, setGame] = useState(null) // { type, spec }

  const launch = async (gameType) => {
    if (!topic.trim() || !lens.trim()) {
      setError('Give Goaty a topic and a passion to play with.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const spec = await callTutor({
        action: 'game',
        gameType,
        topic: topic.trim(),
        lens: lens.trim(),
        learnerStyle: state.profile.learningStyle || '',
      })
      setGame({ type: gameType, spec })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const finish = (passed) => {
    addXp?.(passed ? 30 : 8)
    setGame(null)
  }

  return (
    <div className="games-page">
      <header className="games-hero">
        <div>
          <span className="g-pill" style={{ background: 'rgba(247,147,49,0.20)', color: '#7a3a00' }}>🎮 Play & learn</span>
          <h1 style={{ margin: '10px 0 6px' }}>Goaty's Arcade</h1>
          <p style={{ color: 'var(--muted)', maxWidth: 560, margin: 0 }}>
            Pick a game, a subject, and a world you love. Goaty will spin up a themed
            round on demand — every match, quiz, and puzzle uses <b>your</b> passions.
          </p>
        </div>
        <Mascot size="lg" animate={loading ? 'thinking' : 'none'} />
      </header>

      <section className="g-card g-card-lg" style={{ marginTop: 20 }}>
        <div className="g-form-grid">
          <div>
            <label className="g-label">Subject to learn</label>
            <input className="g-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. recursion, gravity" />
            <div className="g-row" style={{ marginTop: 8 }}>
              {TOPIC_SUGGESTIONS.map(t => (
                <button key={t} className="g-chip" onClick={() => setTopic(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="g-label">Learn through…</label>
            <input className="g-input" value={lens} onChange={e => setLens(e.target.value)} placeholder="e.g. Soccer, Anime, Music" />
            <div className="g-row" style={{ marginTop: 8 }}>
              {LENS_SUGGESTIONS.map(l => (
                <button key={l} className="g-chip" onClick={() => setLens(l)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="games-grid">
        {GAME_TYPES.map(g => (
          <button
            key={g.id}
            className={`game-tile game-tile-${g.color}`}
            onClick={() => launch(g.id)}
            disabled={loading}
          >
            <div className="game-tile-emoji">{g.emoji}</div>
            <div className="game-tile-title">{g.label}</div>
            <div className="game-tile-body">{g.body}</div>
            <div className="game-tile-cta">{loading ? 'Building…' : 'Play →'}</div>
          </button>
        ))}
      </div>

      {error && <div className="g-card" style={{ marginTop: 14, borderColor: 'var(--red)', color: 'var(--red)' }}>⚠️ {error}</div>}

      {(game || loading) && (
        <div className="game-overlay" onClick={() => !loading && setGame(null)}>
          <div className="game-modal" onClick={e => e.stopPropagation()}>
            <div className="game-modal-head">
              <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: 20 }}>
                🎮 {GAME_TYPES.find(t => t.id === game?.type)?.label || 'Loading…'}
              </div>
              {!loading && <button className="g-btn ghost small" onClick={() => setGame(null)}>Close</button>}
            </div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 12px' }}>
                <div className="g-thinking-pill">
                  <Mascot size="sm" animate="thinking" speed={280} />
                  <span>Goaty is building your game</span>
                  <span className="dots"><span/><span/><span/></span>
                </div>
              </div>
            ) : (
              <div className="muse-root game-inner">
                <Game gameType={game.type} spec={game.spec} onFinish={finish} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
