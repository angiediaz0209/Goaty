import { useState } from 'react'
import { GAME_TYPES } from './App.jsx'

console.log('GameSelectionPage GAME_TYPES:', GAME_TYPES)

export default function GameSelectionPage({ launchGame, gameLoading, profile }) {
  const [topic, setTopic] = useState('')
  const [lens, setLens] = useState('')

  const handleLaunchGame = (gameType) => {
    if (!topic.trim() || !lens.trim()) {
      alert('Please enter a topic and a lens to start a game.');
      return;
    }
    launchGame(gameType, topic.trim(), lens.trim());
  };

  return (
    <div className="game-selection-page card setup">
      <h2>Select a Game</h2>
      <label className="field-label">What topic do you want to play about?</label>
      <div className="topic-row">
        <input
          className="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. recursion, compound interest"
        />
      </div>

      <label className="field-label">Which world do you want to learn through?</label>
      <div className="topic-row">
        <input
          className="topic-input"
          value={lens}
          onChange={(e) => setLens(e.target.value)}
          placeholder="e.g. Soccer ⚽, Anime 🎌"
        />
      </div>

      <div className="games">
        <div className="games-head">🎮 Choose a game type</div>
        <div className="game-buttons">
          {GAME_TYPES.map((g) => (
            <button
              key={g.id}
              className="game-launch"
              onClick={() => handleLaunchGame(g.id)}
              disabled={gameLoading || !topic.trim() || !lens.trim()}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}