import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'goaty:v1'

const INTEREST_CATALOG = [
  { id: 'sports',      label: 'Sports',        emoji: '⚽' },
  { id: 'basketball',  label: 'Basketball',    emoji: '🏀' },
  { id: 'soccer',      label: 'Soccer',        emoji: '⚽' },
  { id: 'f1',          label: 'Formula 1',     emoji: '🏎️' },
  { id: 'anime',       label: 'Anime',         emoji: '🎌' },
  { id: 'one_piece',   label: 'One Piece',     emoji: '☠️' },
  { id: 'pokemon',     label: 'Pokémon',       emoji: '⚡' },
  { id: 'marvel',      label: 'Marvel',        emoji: '🦸' },
  { id: 'harry_potter',label: 'Harry Potter',  emoji: '⚡️' },
  { id: 'star_wars',   label: 'Star Wars',     emoji: '✨' },
  { id: 'disney',      label: 'Disney',        emoji: '🏰' },
  { id: 'gaming',      label: 'Gaming',        emoji: '🎮' },
  { id: 'minecraft',   label: 'Minecraft',     emoji: '🟩' },
  { id: 'fortnite',    label: 'Fortnite',      emoji: '🛡️' },
  { id: 'music',       label: 'Music',         emoji: '🎧' },
  { id: 'kpop',        label: 'K-pop',         emoji: '🎤' },
  { id: 'taylor',      label: 'Taylor Swift',  emoji: '💫' },
  { id: 'cooking',     label: 'Cooking',       emoji: '🍳' },
  { id: 'travel',      label: 'Travel',        emoji: '✈️' },
  { id: 'books',       label: 'Books',         emoji: '📚' },
  { id: 'tv',          label: 'TV & Film',     emoji: '🎬' },
  { id: 'photography', label: 'Photography',   emoji: '📷' },
  { id: 'space',       label: 'Space',         emoji: '🚀' },
  { id: 'history',     label: 'History',       emoji: '🏛️' },
  { id: 'technology',  label: 'Technology',    emoji: '💻' },
]

const INTEREST_LINES = {
  anime: "like a training arc in your favorite anime — level up one panel at a time",
  one_piece: "think of it as a new island on the Grand Line — each stop teaches a skill",
  pokemon: "battle by battle — every concept is a new type advantage to master",
  marvel: "assemble it like the Avengers — every character (concept) has a power",
  harry_potter: "think of it as a new spell in your grimoire — cast, refine, master",
  star_wars: "train like a padawan — small drills lead to Jedi mastery",
  disney: "one adventure at a time — every scene builds on the last",
  gaming: "think of it as a boss fight with a clear moveset",
  minecraft: "gather materials first, then craft the tool you need",
  fortnite: "loot, build, adapt — every round teaches something new",
  sports: "warm up, run the drill, then play the match",
  basketball: "practice free throws before you take the buzzer-beater",
  soccer: "pass, control, then finish — build possession before the shot",
  f1: "read the track, hit your marks, then push for the fastest lap",
  music: "we'll rehearse the melody until it feels natural",
  kpop: "learn the choreography step by step, then hit the stage",
  taylor: "call it your Eras Tour — each chapter deepens the story",
  cooking: "mise en place first, then we cook",
  travel: "consider this our map — one landmark at a time",
  books: "we'll turn the page slowly and savor it",
  tv: "picture this as your season one finale",
  photography: "compose the shot, adjust the light, then click",
  space: "one small step — every concept is another lightyear covered",
  history: "walk it like a time traveler — one era at a time",
  technology: "we'll debug step by step until it compiles",
}

const SEED_ROADMAP = {
  id: 'r-js-anime',
  title: 'Master JavaScript through Anime',
  subject: 'JavaScript',
  lens: 'anime',
  progress: 0.1,
  nodes: [
    { id: 'n1', kind: 'lesson', title: 'Variables & the Hero\'s Backstory', xp: 20, status: 'complete' },
    { id: 'n2', kind: 'lesson', title: 'Functions as Special Moves', xp: 25, status: 'available' },
    { id: 'n3', kind: 'quiz', title: 'Power Level Check-in', xp: 15, status: 'locked' },
    { id: 'n4', kind: 'lesson', title: 'Loops = Training Montages', xp: 30, status: 'locked' },
    { id: 'n5', kind: 'lesson', title: 'Arrays: Your Party Members', xp: 25, status: 'locked' },
    { id: 'n6', kind: 'project', title: 'Build a Character Roster App', xp: 60, status: 'locked' },
    { id: 'n7', kind: 'milestone', title: 'Arc One Complete', xp: 40, status: 'locked' },
    { id: 'n8', kind: 'lesson', title: 'Objects: Character Sheets', xp: 25, status: 'locked' },
    { id: 'n9', kind: 'quiz', title: 'Mid-Season Finals', xp: 30, status: 'locked' },
    { id: 'n10', kind: 'project', title: 'Battle Simulator', xp: 80, status: 'locked' },
  ],
}

const SEED_MISSIONS = () => ([
  { id: 'm-lesson', kind: 'lesson', title: 'Complete a mini-lesson', xp: 20, done: false, target: '/app/lesson/n2' },
  { id: 'm-quiz', kind: 'quiz', title: 'Nail today\'s quiz', xp: 15, done: false, target: '/app/quiz/n3' },
  { id: 'm-chat', kind: 'chat', title: 'Chat with Goaty (2 min)', xp: 10, done: false, target: '/app/chat' },
])

const SEED_NOTIFICATIONS = () => ([
  { id: 'nt1', when: Date.now() - 1000 * 60 * 15, group: 'today', kind: 'mission', title: 'Your daily missions are ready', body: '3 fresh missions await — earn 45 XP!', target: '/app', read: false },
  { id: 'nt2', when: Date.now() - 1000 * 60 * 60 * 3, group: 'today', kind: 'streak', title: 'Streak saver used — nice!', body: 'Your 7-day streak is safe.', target: '/app', read: false },
  { id: 'nt3', when: Date.now() - 1000 * 60 * 60 * 26, group: 'earlier', kind: 'roadmap', title: 'New roadmap suggestion', body: 'Try "Master Guitar through Anime" — 60% match', target: '/app/community', read: false },
  { id: 'nt4', when: Date.now() - 1000 * 60 * 60 * 48, group: 'earlier', kind: 'community', title: 'Ari remixed your roadmap', body: 'Your JS-through-Anime path has 12 remixes.', target: '/app/community', read: true },
])

const DEFAULT_STATE = () => ({
  profile: {
    name: '',
    avatar: 'goaty.png',
    interests: [],
    goal: '',
    style: { pace: 2, depth: 2, playfulness: 3 },
    xp: 20,
    level: 1,
    streak: 3,
    lastActive: new Date().toISOString().slice(0, 10),
    badges: ['first-step'],
    plan: 'free',
    joinDate: new Date().toISOString(),
    minutesLearned: 42,
    roadmapsCompleted: 0,
    longestStreak: 7,
  },
  roadmaps: [SEED_ROADMAP],
  chat: [
    { id: 'c0', role: 'goaty', text: "Hi! I'm Goaty 🐐 Ready to learn something new today?", ts: Date.now() - 60000 },
  ],
  missions: SEED_MISSIONS(),
  notifications: SEED_NOTIFICATIONS(),
  weekly: {
    minutes: [12, 18, 25, 9, 30, 22, 42],
    topicsMastered: ['Variables', 'Comparisons', 'if/else'],
    streakHistory: [1, 1, 1, 0, 1, 1, 1],
  },
  theme: 'light',
})

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE()
    const parsed = JSON.parse(raw)
    // shallow-merge with defaults to make schema evolutions safe
    return { ...DEFAULT_STATE(), ...parsed, profile: { ...DEFAULT_STATE().profile, ...(parsed.profile || {}) } }
  } catch {
    return DEFAULT_STATE()
  }
}

let state = loadState()
const listeners = new Set()

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function setState(updater) {
  const next = typeof updater === 'function' ? updater(state) : updater
  state = next
  save()
  listeners.forEach(l => l())
}

function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}

function getSnapshot() { return state }

// ---------- helpers ----------
export function getInterestCatalog() { return INTEREST_CATALOG }

export function interestLabel(id) {
  const item = INTEREST_CATALOG.find(x => x.id === id)
  return item ? item.label : id
}
export function interestEmoji(id) {
  const item = INTEREST_CATALOG.find(x => x.id === id)
  return item ? item.emoji : '✨'
}

export function getMockGoatyReply(userText, profile) {
  const text = (userText || '').toLowerCase()
  const primary = profile?.interests?.[0]
  const line = primary && INTEREST_LINES[primary]
  const intros = [
    "Great question! ",
    "Ooh, I love this one. ",
    "Alright, hooves on the ground — ",
    "Let's break it down together. ",
  ]
  const intro = intros[Math.floor(Math.random() * intros.length)]
  let hook = ''
  if (line) hook = ` Here's a way to picture it — ${line}.`
  let followup = " Want to try a quick example, or should I make it a mini-lesson?"
  if (text.includes('why')) followup = " I'll tell you the why first, then the how. Ready?"
  if (text.includes('example')) followup = " Here's a tiny example: think of it like a favorite scene playing out."
  return `${intro}${hook}${followup}`
}

function daysBetween(aISO, bISO) {
  const a = new Date(aISO); a.setHours(0, 0, 0, 0)
  const b = new Date(bISO); b.setHours(0, 0, 0, 0)
  return Math.round((b - a) / 86400000)
}

function bumpStreak(profile) {
  const today = new Date().toISOString().slice(0, 10)
  const diff = daysBetween(profile.lastActive, today)
  let streak = profile.streak
  if (diff === 0) streak = profile.streak
  else if (diff === 1) streak = profile.streak + 1
  else streak = 1
  return { ...profile, streak, lastActive: today, longestStreak: Math.max(profile.longestStreak || 0, streak) }
}

function applyXp(profile, delta) {
  const xp = profile.xp + delta
  const level = Math.max(1, Math.floor(xp / 100) + 1)
  const badges = new Set(profile.badges)
  if (level >= 2) badges.add('level-2')
  if (level >= 5) badges.add('level-5')
  if (delta > 0) badges.add('xp-hunter')
  return { ...profile, xp, level, badges: Array.from(badges) }
}

// ---------- actions ----------
const actions = {
  setProfile(patch) {
    setState(s => ({ ...s, profile: { ...s.profile, ...patch } }))
  },
  toggleInterest(id) {
    setState(s => {
      const has = s.profile.interests.includes(id)
      const interests = has ? s.profile.interests.filter(x => x !== id) : [...s.profile.interests, id]
      return { ...s, profile: { ...s.profile, interests } }
    })
  },
  setGoal(goal) {
    setState(s => ({ ...s, profile: { ...s.profile, goal } }))
  },
  setStyle(style) {
    setState(s => ({ ...s, profile: { ...s.profile, style: { ...s.profile.style, ...style } } }))
  },
  addXp(n) {
    setState(s => ({ ...s, profile: bumpStreak(applyXp(s.profile, n)) }))
  },
  completeMission(id) {
    setState(s => {
      const missions = s.missions.map(m => m.id === id ? { ...m, done: true } : m)
      const mission = s.missions.find(m => m.id === id)
      if (!mission || mission.done) return { ...s, missions }
      return { ...s, missions, profile: bumpStreak(applyXp(s.profile, mission.xp)) }
    })
  },
  completeNode(id) {
    setState(s => {
      const roadmaps = s.roadmaps.map(r => ({
        ...r,
        nodes: r.nodes.map(n => n.id === id ? { ...n, status: 'complete' } : n),
      }))
      // unlock next locked node
      roadmaps.forEach(r => {
        const idx = r.nodes.findIndex(n => n.id === id)
        for (let i = idx + 1; i < r.nodes.length; i++) {
          if (r.nodes[i].status === 'locked') { r.nodes[i] = { ...r.nodes[i], status: 'available' }; break }
        }
        r.progress = r.nodes.filter(n => n.status === 'complete').length / r.nodes.length
      })
      const node = s.roadmaps[0]?.nodes.find(n => n.id === id)
      const xp = node?.xp || 10
      return { ...s, roadmaps, profile: bumpStreak(applyXp(s.profile, xp)) }
    })
  },
  uncompleteNode(id) {
    setState(s => {
      const roadmaps = s.roadmaps.map(r => ({
        ...r,
        nodes: r.nodes.map(n => n.id === id ? { ...n, status: 'available' } : n),
      }))
      return { ...s, roadmaps }
    })
  },
  sendChat(text) {
    if (!text || !text.trim()) return
    const userMsg = { id: 'c' + Date.now(), role: 'user', text: text.trim(), ts: Date.now() }
    const typingId = 'typing-' + Date.now()
    setState(s => ({
      ...s,
      chat: [...s.chat, userMsg, { id: typingId, role: 'goaty', text: '', typing: true, ts: Date.now() }],
    }))

    // Build history for the API from the *previous* chat (excluding the typing placeholder we just added)
    const history = state.chat
      .filter(m => !m.typing)
      .slice(-20)
      .map(m => ({ role: m.role === 'goaty' ? 'assistant' : 'user', content: m.text }))
    history.push({ role: 'user', content: userMsg.text })

    // Human-readable copy of the profile for the API
    const enrichedProfile = {
      ...state.profile,
      interestLabels: (state.profile.interests || []).map(interestLabel),
      primaryLens: interestLabel(state.profile.interests?.[0] || 'anime'),
    }

    fetch('/api/goaty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'chat', messages: history, profile: enrichedProfile }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        const reply = data.reply || getMockGoatyReply(text, state.profile)
        setState(s => ({
          ...s,
          chat: s.chat.map(m => m.id === typingId
            ? { id: 'c' + (Date.now() + 1), role: 'goaty', text: reply, ts: Date.now() }
            : m),
        }))
      })
      .catch(err => {
        console.error('[goaty chat]', err)
        setState(s => ({
          ...s,
          chat: s.chat.map(m => m.id === typingId
            ? {
                id: 'c' + (Date.now() + 1), role: 'goaty', ts: Date.now(),
                text: `Sorry — I couldn't reach my brain just now (${err.message}). Make sure ANTHROPIC_API_KEY is set in .env and the dev server was restarted. Meanwhile: ${getMockGoatyReply(text, state.profile)}`,
              }
            : m),
        }))
      })
  },
  async generateLesson({ nodeId, title, subject, lens, nextTitle }) {
    const res = await fetch('/api/goaty', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'lesson',
        nodeId, title, subject, lens, nextTitle,
        profile: state.profile,
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data
  },
  clearChat() {
    setState(s => ({
      ...s,
      chat: [
        { id: 'c0-' + Date.now(), role: 'goaty', text: "Hi! I'm Goaty 🐐 Ready to learn something new today?", ts: Date.now() },
      ],
    }))
  },
  addBadge(id) {
    setState(s => {
      if (s.profile.badges.includes(id)) return s
      return { ...s, profile: { ...s.profile, badges: [...s.profile.badges, id] } }
    })
  },
  markAllNotificationsRead() {
    setState(s => ({ ...s, notifications: s.notifications.map(n => ({ ...n, read: true })) }))
  },
  addRoadmap(roadmap) {
    setState(s => ({ ...s, roadmaps: [...s.roadmaps, roadmap] }))
  },
  removeInterest(id) {
    setState(s => ({ ...s, profile: { ...s.profile, interests: s.profile.interests.filter(x => x !== id) } }))
  },
  setTheme(theme) {
    setState(s => ({ ...s, theme }))
    document.body.setAttribute('data-theme', theme)
  },
  resetAll() {
    state = DEFAULT_STATE()
    save()
    listeners.forEach(l => l())
  },
  upgradePlan() {
    setState(s => ({ ...s, profile: { ...s.profile, plan: 'premium', badges: Array.from(new Set([...s.profile.badges, 'premium'])) } }))
  },
  downgradePlan() {
    setState(s => ({ ...s, profile: { ...s.profile, plan: 'free' } }))
  },
}

export function useGoatyStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { state: snap, ...actions }
}

// initialize theme on module load
if (typeof document !== 'undefined') {
  document.body.setAttribute('data-theme', state.theme || 'light')
}
