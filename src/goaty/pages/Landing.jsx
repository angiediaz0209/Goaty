import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import Section from '../components/Section.jsx'
import { getInterestCatalog } from '../store.js'

const FEATURES = [
  { emoji: '✨', title: 'AI onboarding', body: 'Tell us three interests. We craft your first roadmap in seconds.' },
  { emoji: '🗺️', title: 'Personalized roadmap', body: 'A skill tree taught through anime, sports, gaming — whatever you love.' },
  { emoji: '🎯', title: 'Daily missions', body: 'Bite-sized quests keep your streak alive and your brain growing.' },
  { emoji: '🧑‍🤝‍🧑', title: 'Community', body: 'Remix any roadmap from creators around the world.' },
]

const TESTIMONIALS = [
  { name: 'Maya, 22', text: '"Learning Python through K-pop lyrics? I finally understand loops."' },
  { name: 'Deven, 17', text: '"Streak: 42 days. Goaty is my study buddy and I love him."' },
  { name: 'Ari, 28', text: '"The badges make me feel like I\'m collecting Pokémon while learning calculus."' },
]

const CHAT_DEMO = [
  { who: 'user', text: 'Can you teach me recursion?' },
  { who: 'goaty', text: 'Sure! Picture a training arc where every fight looks the same but smaller until the hero learns...' },
  { who: 'user', text: 'Oh! Like a Russian doll?' },
  { who: 'goaty', text: 'Exactly! Same idea, smaller version, until we hit the base case.' },
]

export default function Landing() {
  const interests = getInterestCatalog()
  const [tIdx, setTIdx] = useState(0)
  const featuresRef = useRef(null)
  useEffect(() => {
    const t = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 4200)
    return () => clearInterval(t)
  }, [])
  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="goaty-app">
      <header className="g-nav">
        <Link to="/" className="brand"><span>🐐</span> Goaty</Link>
        <div className="nav-spacer" />
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/muse" className="nav-link">Muse (legacy)</Link>
        <Link to="/onboarding" className="g-btn small primary">Start free →</Link>
      </header>

      {/* HERO */}
      <section className="g-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="g-hero-gradient" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 40, alignItems: 'center' }}>
          <div className="g-fade-up">
            <div className="g-pill" style={{ marginBottom: 18 }}>NEW · Meet your learning goat</div>
            <h1 style={{ fontFamily: 'var(--font-display)' }}>
              Learn anything through <em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>what you love.</em>
            </h1>
            <p style={{ fontSize: 20, color: 'var(--muted)', maxWidth: 520, marginTop: 12 }}>
              Goaty turns any subject into a personalized adventure taught through your favorite hobbies — anime, sports, cooking, gaming, and more.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link to="/onboarding" className="g-btn primary">Start free →</Link>
              <button onClick={scrollToFeatures} className="g-btn ghost">See a demo</button>
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Mascot size="xl" showNote />
            <div className="g-hero-stickers">
              <div className="sticker" style={{ top: 20, left: 0 }}>⭐ Level 1</div>
              <div className="sticker" style={{ top: 60, right: 0, animationDelay: '.5s' }}>+50 XP</div>
              <div className="sticker" style={{ bottom: 20, left: 20, animationDelay: '1s' }}>🔥 7-day streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="g-container" ref={featuresRef}>
        <Section title="Why Goaty?" subtitle="Delight-first tools for lifelong learners.">
          <div className="g-grid-4">
            {FEATURES.map(f => (
              <div key={f.title} className="g-card">
                <div style={{ fontSize: 34 }}>{f.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>{f.title}</div>
                <div style={{ color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* MEET GOATY */}
        <Section title="Meet Goaty" subtitle="Your personalized, always-patient learning companion.">
          <div className="g-card g-card-lg" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Mascot size="lg" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CHAT_DEMO.map((m, i) => (
                <div key={i} className={`g-chat-row ${m.who === 'user' ? 'user' : ''} g-fade-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className={`g-bubble ${m.who}`}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* INTERESTS */}
        <Section title="Learn through what you love" subtitle="Pick your flavor — we do the rest.">
          <div className="g-row" style={{ justifyContent: 'center' }}>
            {interests.map(i => (
              <div key={i.id} className="g-chip">
                <span style={{ fontSize: 18 }}>{i.emoji}</span> {i.label}
              </div>
            ))}
          </div>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="Loved by curious minds">
          <div className="g-card g-card-lg" style={{ minHeight: 160, textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic' }}>{TESTIMONIALS[tIdx].text}</p>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>— {TESTIMONIALS[tIdx].name}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
              {TESTIMONIALS.map((_, i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === tIdx ? 'var(--coral)' : 'rgba(27,30,59,0.16)' }} />
              ))}
            </div>
          </div>
        </Section>

        {/* PRICING TEASER */}
        <Section title="Ready to grow?">
          <div className="g-card g-card-lg" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Start free, grow premium.</div>
              <div style={{ color: 'var(--muted)', marginTop: 6 }}>Unlimited roadmaps, exclusive badges, and offline lessons on Premium.</div>
            </div>
            <Link to="/pricing" className="g-btn primary">See pricing →</Link>
          </div>
        </Section>

        <footer style={{ marginTop: 64, padding: '32px 0', color: 'var(--muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <div>© {new Date().getFullYear()} Goaty. Learning grazing grounds.</div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <Link to="/pricing">Pricing</Link> · <Link to="/muse">Muse</Link> · <Link to="/onboarding">Get started</Link>
          </div>
        </footer>
      </section>
    </div>
  )
}
