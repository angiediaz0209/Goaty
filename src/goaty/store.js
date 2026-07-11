import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'goaty:v1'

const INTEREST_CATALOG = [
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'anime', label: 'Anime', emoji: '🎌' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎧' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'tv', label: 'TV & Film', emoji: '🎬' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
]

const INTEREST_LINES = {
  anime: "like a training arc in your favorite anime — level up one panel at a time",
  gaming: "think of it as a boss fight with a clear moveset",
  sports: "warm up, run the drill, then play the match",
  music: "we'll rehearse the melody until it feels natural",
  cooking: "mise en place first, then we cook",
  travel: "consider this our map — one landmark at a time",
  books: "we'll turn the page slowly and savor it",
  tv: "picture this as your season one finale",
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
    setState(s => ({ ...s, chat: [...s.chat, userMsg] }))
    const delay = 700 + Math.random() * 500
    setTimeout(() => {
      setState(s => {
        const reply = getMockGoatyReply(text, s.profile)
        return { ...s, chat: [...s.chat, { id: 'c' + (Date.now() + 1), role: 'goaty', text: reply, ts: Date.now() }] }
      })
    }, delay)
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
