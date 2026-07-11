import { useState } from 'react'
import { useGoatyStore } from '../store.js'

const BADGES = [
  { id: 'first-step', name: 'First Step', rarity: 'common', emoji: '👟', desc: 'Completed onboarding.' },
  { id: 'xp-hunter', name: 'XP Hunter', rarity: 'common', emoji: '⭐', desc: 'Earned your first XP.' },
  { id: 'level-2', name: 'Sprout', rarity: 'rare', emoji: '🌱', desc: 'Reached level 2.' },
  { id: 'level-5', name: 'Bloom', rarity: 'rare', emoji: '🌸', desc: 'Reached level 5.' },
  { id: 'streak-7', name: 'Seven Sun', rarity: 'rare', emoji: '🔥', desc: '7-day streak.' },
  { id: 'streak-30', name: 'Comet', rarity: 'epic', emoji: '☄️', desc: '30-day streak.' },
  { id: 'polyglot', name: 'Polyglot', rarity: 'epic', emoji: '🗺️', desc: '3 subjects mastered.' },
  { id: 'anime-arc', name: 'Arc One', rarity: 'epic', emoji: '🎌', desc: 'Finished anime arc.' },
  { id: 'community', name: 'Remixer', rarity: 'rare', emoji: '🔁', desc: 'Remixed a roadmap.' },
  { id: 'premium', name: 'Golden Hoof', rarity: 'legendary', emoji: '🥇', desc: 'Went Premium.' },
  { id: 'nightowl', name: 'Night Owl', rarity: 'rare', emoji: '🌙', desc: 'Studied after 10pm.' },
  { id: 'goaty-fan', name: 'Goaty Fan Club', rarity: 'legendary', emoji: '🐐', desc: 'Chatted 100+ times.' },
]

export default function BadgesPage() {
  const { state } = useGoatyStore()
  const [open, setOpen] = useState(null)
  const owned = new Set(state.profile.badges)

  return (
    <div className="g-col" style={{ gap: 20 }}>
      <div>
        <h1>Badge Case</h1>
        <p style={{ color: 'var(--muted)' }}>Rare treasures earned along your journey. {owned.size} of {BADGES.length} unlocked.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
        {BADGES.map(b => {
          const has = owned.has(b.id)
          return (
            <div key={b.id} className="g-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setOpen(b)}>
              <div className={`g-hex ${has ? b.rarity : 'locked'}`} style={{ margin: '0 auto', fontSize: 40 }}>
                {has ? b.emoji : '?'}
              </div>
              <div style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>{has ? b.name : '???'}</div>
              <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'capitalize' }}>{b.rarity}</div>
            </div>
          )
        })}
      </div>

      {open && (
        <>
          <div className="g-scrim" onClick={() => setOpen(null)} />
          <div className="g-drawer" style={{ maxWidth: 380, right: '50%', top: '50%', bottom: 'auto', transform: 'translate(50%, -50%)', borderRadius: 20 }}>
            <div className={`g-hex ${owned.has(open.id) ? open.rarity : 'locked'}`} style={{ margin: '0 auto', fontSize: 56 }}>
              {owned.has(open.id) ? open.emoji : '?'}
            </div>
            <h2 style={{ textAlign: 'center', marginTop: 12 }}>{owned.has(open.id) ? open.name : 'Locked'}</h2>
            <div className="g-pill" style={{ display: 'block', textAlign: 'center', textTransform: 'capitalize', margin: '4px auto' }}>{open.rarity}</div>
            <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>{open.desc}</p>
            {owned.has(open.id) && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Unlocked recently
              </div>
            )}
            <button className="g-btn ghost wide" onClick={() => setOpen(null)} style={{ marginTop: 16 }}>Close</button>
          </div>
        </>
      )}
    </div>
  )
}
