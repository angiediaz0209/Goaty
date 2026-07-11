import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Confetti from '../components/Confetti.jsx'
import { useGoatyStore } from '../store.js'

const QUESTIONS = [
  {
    q: 'What does a function do in code?',
    options: ['Stores a fixed value', 'Runs a block of code you can reuse', 'Displays a color', 'Nothing on its own'],
    correct: 1,
  },
  {
    q: 'Which keyword calls (runs) a function named greet?',
    options: ['greet;', 'greet()', 'call greet', 'run greet'],
    correct: 1,
  },
  {
    q: 'Which of these is used to declare a variable in modern JavaScript?',
    options: ['make', 'let', 'define', 'variable'],
    correct: 1,
  },
  {
    q: 'What does console.log("Hello") do?',
    options: ['Deletes a file', 'Prints "Hello" to the console', 'Creates a webpage', 'Nothing'],
    correct: 1,
  },
  {
    q: 'What is 2 + 3 in JavaScript?',
    options: ['"23"', '5', '6', 'NaN'],
    correct: 1,
  },
]

export default function QuizPage() {
  const { id } = useParams()
  const { addXp } = useGoatyStore()
  const [step, setStep] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [burst, setBurst] = useState(0)

  const q = QUESTIONS[step]
  const totalXp = score * 15

  const choose = (i) => {
    if (chosen !== null) return
    setChosen(i)
    const correct = i === q.correct
    if (correct) {
      setScore(s => s + 1)
      setBurst(b => b + 1)
      setFeedback('correct')
    } else {
      setFeedback('incorrect')
    }
  }

  const next = () => {
    if (step + 1 >= QUESTIONS.length) {
      setDone(true)
      addXp(totalXp + (chosen === q.correct ? 15 : 0))
    } else {
      setStep(s => s + 1)
      setChosen(null)
      setFeedback(null)
    }
  }

  if (done) {
    return (
      <div className="g-col" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', gap: 16 }}>
        <Confetti trigger={burst} />
        <div style={{ fontSize: 64 }}>🏆</div>
        <h1>Quiz complete!</h1>
        <div className="g-card">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800 }}>
            {score} / {QUESTIONS.length}
          </div>
          <div style={{ color: 'var(--muted)' }}>You earned +{score * 15} XP</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/app" className="g-btn ghost">← Dashboard</Link>
          <Link to="/app/roadmap" className="g-btn primary">Next mission →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="g-col" style={{ maxWidth: 640, margin: '0 auto', gap: 16, width: '100%' }}>
      <Confetti trigger={burst} />
      <div className="g-progress"><span style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} /></div>
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>
        Question {step + 1} of {QUESTIONS.length} · Quiz {id}
      </div>
      <div className="g-card g-card-lg">
        <h2>{q.q}</h2>
        <div className="g-col" style={{ marginTop: 16 }}>
          {q.options.map((opt, i) => {
            const isChosen = chosen === i
            const isCorrect = i === q.correct
            let extra = {}
            if (chosen !== null) {
              if (isCorrect) extra = { background: 'rgba(126,214,122,0.2)', borderColor: 'var(--meadow)' }
              else if (isChosen) extra = { background: 'rgba(255,138,107,0.15)', borderColor: 'var(--coral)' }
            }
            return (
              <button
                key={i}
                className="g-btn"
                onClick={() => choose(i)}
                disabled={chosen !== null}
                style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%', ...extra }}
              >
                <span style={{ fontWeight: 800, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>
        {feedback && (
          <div className={`g-callout g-fade-up`} style={{ marginTop: 16, borderLeftColor: feedback === 'correct' ? 'var(--meadow)' : 'var(--coral)', background: feedback === 'correct' ? 'rgba(126,214,122,0.15)' : 'rgba(255,138,107,0.15)' }}>
            {feedback === 'correct' ? '🎉 Nice! +15 XP' : '🤔 Not quite — the right answer is highlighted above.'}
          </div>
        )}
      </div>
      {chosen !== null && (
        <button className="g-btn primary" onClick={next}>
          {step + 1 >= QUESTIONS.length ? 'See results →' : 'Next question →'}
        </button>
      )}
    </div>
  )
}
