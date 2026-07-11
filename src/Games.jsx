import { useState } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const passLine = (frac) =>
  frac === 1 ? 'Perfect run! 🐐' : frac >= 0.6 ? "Nice — you've got it." : 'Worth another round.'

/* ---------- Quiz Battle ---------- */
function QuizBattle({ spec, onFinish }) {
  const rounds = spec.rounds || []
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (idx >= rounds.length) {
    const frac = rounds.length ? score / rounds.length : 0
    return (
      <div className="game-result">
        <div className="game-big">🏆 {score}/{rounds.length}</div>
        <p>{passLine(frac)}</p>
        <button className="primary" onClick={() => onFinish(frac >= 0.6)}>Done ✓</button>
      </div>
    )
  }

  const round = rounds[idx]
  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === round.correctIndex) setScore((s) => s + 1)
  }
  const next = () => { setPicked(null); setIdx((n) => n + 1) }

  return (
    <div className="game-body">
      <div className="game-theme">⚔️ {spec.theme}</div>
      <div className="game-progress">Round {idx + 1} / {rounds.length} · Score {score}</div>
      <div className="game-q">{round.question}</div>
      <div className="game-choices">
        {round.choices.map((c, i) => {
          let cls = 'choice'
          if (picked !== null) {
            if (i === round.correctIndex) cls += ' correct'
            else if (i === picked) cls += ' wrong'
          }
          return <button key={i} className={cls} onClick={() => pick(i)}>{c}</button>
        })}
      </div>
      {picked !== null && (
        <div className="game-why">
          {picked === round.correctIndex ? '✅ ' : '❌ '}{round.why}
          <button className="primary sm" onClick={next}>
            {idx + 1 >= rounds.length ? 'Finish' : 'Next round →'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------- Match the Pairs ---------- */
function MatchPairs({ spec, onFinish }) {
  const pairs = spec.pairs || []
  const [left] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, text: p.concept }))))
  const [right] = useState(() => shuffle(pairs.map((p, i) => ({ id: i, text: p.metaphor }))))
  const [sel, setSel] = useState(null)
  const [matched, setMatched] = useState(() => new Set())
  const [wrong, setWrong] = useState(null)
  const [misses, setMisses] = useState(0)

  const clickRight = (id) => {
    if (sel === null || matched.has(id)) return
    if (id === sel) {
      setMatched((m) => new Set(m).add(id)); setSel(null)
    } else {
      setWrong(id); setMisses((n) => n + 1); setSel(null)
      setTimeout(() => setWrong(null), 500)
    }
  }

  if (matched.size === pairs.length && pairs.length > 0) {
    return (
      <div className="game-result">
        <div className="game-big">🃏 Matched!</div>
        <p>{misses === 0 ? 'Flawless — every pair on the first try. 🐐' : `${misses} miss${misses > 1 ? 'es' : ''}. Solid.`}</p>
        <button className="primary" onClick={() => onFinish(misses <= 1)}>Done ✓</button>
      </div>
    )
  }

  return (
    <div className="game-body">
      <div className="game-theme">🃏 {spec.theme}</div>
      <div className="game-progress">{spec.intro}</div>
      <div className="match-grid">
        <div className="match-col">
          {left.map((l) => (
            <button
              key={l.id}
              className={'match-card' + (matched.has(l.id) ? ' done' : '') + (sel === l.id ? ' sel' : '')}
              disabled={matched.has(l.id)}
              onClick={() => setSel(l.id)}
            >{l.text}</button>
          ))}
        </div>
        <div className="match-col">
          {right.map((r) => (
            <button
              key={r.id}
              className={'match-card' + (matched.has(r.id) ? ' done' : '') + (wrong === r.id ? ' miss' : '')}
              disabled={matched.has(r.id)}
              onClick={() => clickRight(r.id)}
            >{r.text}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Spot the Mistake ---------- */
function SpotMistake({ spec, onFinish }) {
  const statements = spec.statements || []
  const [picked, setPicked] = useState(null)
  const correct = picked === spec.wrongIndex

  return (
    <div className="game-body">
      <div className="game-theme">🔍 {spec.theme}</div>
      <div className="game-progress">{spec.intro} — one of these is wrong. Which?</div>
      <div className="spot-list">
        {statements.map((s, i) => {
          let cls = 'spot'
          if (picked !== null) {
            if (i === spec.wrongIndex) cls += ' is-wrong'
            else if (i === picked) cls += ' mis'
          }
          return (
            <button key={i} className={cls} disabled={picked !== null} onClick={() => setPicked(i)}>
              {s.text}
            </button>
          )
        })}
      </div>
      {picked !== null && (
        <div className="game-result inline">
          <p>{correct ? '✅ Caught it!' : '❌ That one was actually fine.'}</p>
          <p className="correction"><b>The mistake:</b> {spec.correction}</p>
          <button className="primary" onClick={() => onFinish(correct)}>Done ✓</button>
        </div>
      )}
    </div>
  )
}

/* ---------- Order the Steps ---------- */
function OrderSteps({ spec, onFinish }) {
  const correct = (spec.steps || []).map((s, i) => ({ id: i, label: s.label }))
  const [order, setOrder] = useState(() => {
    let s = shuffle(correct)
    if (correct.length > 1 && s.every((x, i) => x.id === i)) s = shuffle(correct)
    return s
  })
  const [checked, setChecked] = useState(false)
  const isRight = order.every((x, i) => x.id === i)

  const move = (i, dir) => {
    if (checked) return
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
  }

  return (
    <div className="game-body">
      <div className="game-theme">🔢 {spec.theme}</div>
      <div className="game-progress">{spec.intro} — put the steps in order.</div>
      <div className="order-list">
        {order.map((s, i) => (
          <div key={s.id} className={'order-step' + (checked ? (s.id === i ? ' ok' : ' bad') : '')}>
            <span className="order-num">{i + 1}</span>
            <span className="order-label">{s.label}</span>
            {!checked && (
              <span className="order-arrows">
                <button onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1}>▼</button>
              </span>
            )}
          </div>
        ))}
        {checked && isRight && <div className="order-goal">🎉 {spec.goalLabel}</div>}
      </div>
      {!checked ? (
        <button className="primary" onClick={() => setChecked(true)}>Check order</button>
      ) : (
        <div className="game-result inline">
          <p>{isRight ? '✅ Perfect sequence! 🐐' : '❌ Not quite — see the highlights.'}</p>
          <div className="order-actions">
            {!isRight && <button className="ghost" onClick={() => { setChecked(false) }}>Try again</button>}
            <button className="primary" onClick={() => onFinish(isRight)}>Done ✓</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Game({ gameType, spec, onFinish }) {
  if (gameType === 'quiz_battle') return <QuizBattle spec={spec} onFinish={onFinish} />
  if (gameType === 'match_pairs') return <MatchPairs spec={spec} onFinish={onFinish} />
  if (gameType === 'spot_mistake') return <SpotMistake spec={spec} onFinish={onFinish} />
  if (gameType === 'order_steps') return <OrderSteps spec={spec} onFinish={onFinish} />
  return <div className="muted">Unknown game.</div>
}
