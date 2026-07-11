import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot.jsx'
import Section from '../components/Section.jsx'
import { getInterestCatalog } from '../store.js'
import logoUrl from '../images/logo.png'

const CARD_BGS = [
  { id: 'blue',   value: 'var(--blue)',   label: 'Blue' },
  { id: 'orange', value: 'var(--orange)', label: 'Orange' },
  { id: 'red',    value: 'var(--red)',    label: 'Red' },
  { id: 'cream',  value: 'var(--cream)',  label: 'Cream' },
]

const DOT_COLORS = [
  { id: 'green',  value: 'var(--green)' },
  { id: 'orange', value: 'var(--orange)' },
  { id: 'red',    value: 'var(--red)' },
  { id: 'cyan',   value: 'var(--cyan)' },
  { id: 'yellow', value: 'var(--warning)' },
]

const FEATURES = [
  { icon: '✦', title: 'AI onboarding',         body: 'Tell us three interests. We craft your first roadmap in seconds.', color: 'orange' },
  { icon: '⌘', title: 'Personalized roadmap',  body: 'A skill tree taught through anime, sports, gaming — whatever you love.', color: 'blue' },
  { icon: '◎', title: 'Daily missions',        body: 'Bite-sized quests keep your streak alive and your brain growing.', color: 'red' },
  { icon: '☺', title: 'Community',             body: 'Remix any roadmap from creators around the world.', color: 'cyan' },
]

const TESTIMONIALS = [
  { name: 'Maya, 22',  text: '"Learning Python through K-pop lyrics? I finally understand loops."' },
  { name: 'Deven, 17', text: '"Streak: 42 days. Goaty is my study buddy and I love him."' },
  { name: 'Ari, 28',   text: '"The badges make me feel like I\'m collecting Pokémon while learning calculus."' },
]

const CHAT_DEMO = [
  { who: 'user',  text: 'Can you teach me recursion?' },
  { who: 'goaty', text: 'Sure! Picture a training arc where every fight looks the same but smaller until the hero learns...' },
  { who: 'user',  text: 'Oh! Like a Russian doll?' },
  { who: 'goaty', text: 'Exactly! Same idea, smaller version, until we hit the base case.' },
]

export default function Landing() {
  const [cardBg, setCardBg] = useState('blue')
  const bg = CARD_BGS.find(b => b.id === cardBg)
  const isLight = cardBg === 'cream'

  const interests = getInterestCatalog()
  const [tIdx, setTIdx] = useState(0)
  const featuresRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS.length), 4200)
    return () => clearInterval(t)
  }, [])

  const scrollToFeatures = (e) => {
    e?.preventDefault?.()
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="goaty-app landing-v2">
      {/* --- top nav --- */}
      <header className="lv2-nav">
        <Link to="/" className="lv2-brand">
          <img src={logoUrl} alt="Goaty" className="lv2-logo" />
        </Link>
        <nav className="lv2-links">
          <Link to="/pricing" className="lv2-link">Pricing</Link>
          <a href="#how" className="lv2-link" onClick={scrollToFeatures}>How it works</a>
          <Link to="/onboarding" className="lv2-cta">Start free →</Link>
        </nav>
      </header>

      {/* --- HERO CARD (switchable bg) --- */}
      <section className="lv2-container">
        <div className={`lv2-hero ${isLight ? 'is-light' : ''}`} style={{ background: bg.value }}>
          <div className="lv2-hero-left">
            <span className="lv2-pill">NEW · Meet your learning goat</span>
            <h1 className="lv2-title">
              Learn anything through{' '}
              <em className="lv2-title-em">what you love.</em>
            </h1>
            <p className="lv2-lede">
              Goaty turns any subject into a personalized adventure
              taught through your favorite hobbies — anime, sports,
              cooking, gaming, and more.
            </p>
            <div className="lv2-actions">
              <Link to="/onboarding" className="lv2-btn primary">Start free →</Link>
              <a href="#how" onClick={scrollToFeatures} className="lv2-btn ghost">See a demo</a>
            </div>
          </div>

          <div className="lv2-hero-right">
            <div className="lv2-mascot-wrap">
              <span className="lv2-sticker lv2-sticker-tl">⭐ Level 1</span>
              <span className="lv2-sticker lv2-sticker-tr lv2-sticker-orange">+50 XP</span>
              <Mascot size="xl" />
              <span className="lv2-sticker lv2-sticker-br lv2-sticker-red">🔥 7-day streak</span>
            </div>
            <div className="lv2-dots">
              {DOT_COLORS.map(d => (
                <span key={d.id} className="lv2-dot" style={{ background: d.value }} />
              ))}
            </div>
          </div>
        </div>

        {/* card background picker */}
        <div className="lv2-picker">
          <span className="lv2-picker-label">Card background:</span>
          {CARD_BGS.map(b => (
            <button
              key={b.id}
              onClick={() => setCardBg(b.id)}
              className={`lv2-swatch ${cardBg === b.id ? 'active' : ''}`}
              style={{ background: b.value }}
              aria-label={b.label}
            />
          ))}
        </div>

        {/* --- FEATURES --- */}
        <div ref={featuresRef} id="how">
          <Section title="Why Goaty?" subtitle="Delight-first tools for lifelong learners.">
            <div className="feat-grid">
              {FEATURES.map(f => (
                <div key={f.title} className={`feat-tile feat-${f.color}`}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-body">{f.body}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* --- MEET GOATY --- */}
        <Section title="Meet Goaty" subtitle="Your personalized, always-patient learning companion.">
          <div className="meet-card">
            <div className="meet-mascot">
              <Mascot size="lg" />
            </div>
            <div className="meet-chat">
              {CHAT_DEMO.map((m, i) => (
                <div key={i} className={`meet-row ${m.who === 'user' ? 'user' : ''} g-fade-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className={`meet-bubble ${m.who}`}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* --- INTERESTS --- */}
        <Section title="Learn through what you love" subtitle="Pick your flavor — we do the rest.">
          <div className="g-row" style={{ justifyContent: 'center' }}>
            {interests.map(i => (
              <div key={i.id} className="g-chip">
                <span style={{ fontSize: 18 }}>{i.emoji}</span> {i.label}
              </div>
            ))}
          </div>
        </Section>

        {/* --- TESTIMONIALS --- */}
        <Section title="Loved by curious minds">
          <div className="g-card g-card-lg" style={{ minHeight: 160, textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic' }}>{TESTIMONIALS[tIdx].text}</p>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>— {TESTIMONIALS[tIdx].name}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
              {TESTIMONIALS.map((_, i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === tIdx ? 'var(--orange)' : 'rgba(31,41,55,0.20)' }} />
              ))}
            </div>
          </div>
        </Section>

        {/* --- PRICING TEASER --- */}
        <Section title="Ready to grow?">
          <div className="g-card g-card-lg" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Start free, grow premium.</div>
              <div style={{ color: 'var(--muted)', marginTop: 6 }}>Unlimited roadmaps, exclusive badges, and offline lessons on Premium.</div>
            </div>
            <Link to="/pricing" className="g-btn primary">See pricing →</Link>
          </div>
        </Section>
      </section>

      <footer className="lv2-footer">
        © {new Date().getFullYear()} Goaty · <Link to="/pricing">Pricing</Link> · <Link to="/muse">Muse (legacy)</Link> · <Link to="/onboarding">Get started</Link>
      </footer>
    </div>
  )
}
