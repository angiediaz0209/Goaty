import { useEffect, useState } from 'react'

const COLORS = ['#FF8A6B', '#FFCD5B', '#7ED67A', '#8B7CFF', '#C6F0E2']

export default function Confetti({ trigger }) {
  const [burst, setBurst] = useState(0)
  useEffect(() => {
    if (trigger) {
      setBurst(b => b + 1)
      const t = setTimeout(() => setBurst(0), 1800)
      return () => clearTimeout(t)
    }
  }, [trigger])
  if (!burst) return null
  const pieces = Array.from({ length: 60 })
  return (
    <div className="g-confetti" aria-hidden>
      {pieces.map((_, i) => (
        <span
          key={`${burst}-${i}`}
          style={{
            left: `${Math.random() * 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${Math.random() * 0.3}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: 6 + Math.random() * 8,
            height: 10 + Math.random() * 8,
          }}
        />
      ))}
    </div>
  )
}
