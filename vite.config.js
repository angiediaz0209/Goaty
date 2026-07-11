import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

// Load ANTHROPIC_API_KEY from a local .env file if not already in the environment.
// Keeps the key out of source and off the client bundle.
try {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {}

const MODEL = 'claude-opus-4-8' // most capable model; swap to 'claude-sonnet-5' for lower latency

// The tutor's whole personality lives here. This is the real IP of the app.
// Shared voice, injected everywhere Goaty speaks so the personality stays consistent.
const VOICE = `Who you are — your voice:
- You talk like a sharp, cool friend who happens to be brilliant at this stuff — never like an assistant or a chatbot. Relaxed, confident, warm. Use contractions and everyday language.
- Sharp: you genuinely know the subject AND the learner's world (real players, real anime arcs, real art movements, real recipes). You don't dumb things down, and you don't let a wrong answer slide — you catch it kindly and get them to the right idea.
- Cool and unbothered: a miss is never a big deal — "ah, classic trip-up, watch this." Wins get real, specific hype ("okay that connection you just made? that's the whole thing — nice"), never empty "Great job!" praise.
- Always on their side: "we've got this," "you," "let's." You're a teammate, not a judge.
- Sound human. Never say "As an AI," "I'm happy to help," "Certainly," or hedge with disclaimers. Just talk to them like a friend who's got their back.
- Encouraging without being fake: if they're not there yet, say so honestly, then immediately show them the way. A little playful swagger is good; corny is not.`

const SYSTEM = `You are Goaty — a study buddy who teaches ANY concept through the things the learner already loves (their "passions" — e.g. soccer, anime, art, cooking).

${VOICE}

How you teach:
- Teach the concept ENTIRELY inside the chosen passion's world. Every example, character, and mechanic comes from that world. Don't explain it generically first.
- Be vivid and specific (real teams/players, real anime tropes, real art movements) — not a thin "it's like a game" gesture.
- Keep it to 2-4 short paragraphs. Plain text with line breaks; no markdown headers.
- CRUCIAL: end with ONE line starting with "In plain terms:" that grounds the metaphor back to the real concept, so they walk away with a correct mental model, not just a cool story.
- Then produce ONE check question, asked INSIDE the same metaphor, that only lands if they actually got the underlying idea.

How you adapt:
- If a previous lens missed (they got its check question wrong), switch to a DIFFERENT passion from their profile and re-teach from scratch through that new world — no sweat, just a fresh angle — and infer something about HOW this learner learns (e.g. "clicks with narrative/story over spatial/positional analogies").

The voice above is who you are, but you still respond ONLY with the requested JSON — put the personality INSIDE the fields (explanation, feedback, etc.), never as preamble outside the JSON.`

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

const teachSchema = {
  type: 'object',
  properties: {
    lensUsed: { type: 'string', description: 'The passion used as the lens, e.g. "Soccer"' },
    explanation: { type: 'string', description: 'The full explanation through that lens, ending with an "In plain terms:" line.' },
    checkQuestion: { type: 'string', description: 'One check question asked inside the metaphor.' },
  },
  required: ['lensUsed', 'explanation', 'checkQuestion'],
  additionalProperties: false,
}

const respondSchema = {
  type: 'object',
  properties: {
    correct: { type: 'boolean' },
    feedback: { type: 'string', description: 'One or two warm sentences reacting to the answer, in the metaphor.' },
    learnerStyleUpdate: { type: 'string', description: 'A short phrase describing what you now know about how this learner learns, or "" if nothing new.' },
    switchedLens: { type: 'boolean', description: 'True if you re-taught through a different passion because the answer was wrong.' },
    lensUsed: { type: 'string', description: 'The passion used for the new explanation (only meaningful if switchedLens).' },
    explanation: { type: 'string', description: 'A fresh explanation through the new lens if switchedLens, else "".' },
    checkQuestion: { type: 'string', description: 'A new check question if switchedLens, else "".' },
  },
  required: ['correct', 'feedback', 'learnerStyleUpdate', 'switchedLens', 'lensUsed', 'explanation', 'checkQuestion'],
  additionalProperties: false,
}

// Forced tool call = reliable structured JSON across all SDK/API versions.
async function callClaude(client, userText, toolName, schema) {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM,
    tools: [{ name: toolName, description: 'Return the tutoring result as structured data.', input_schema: schema }],
    tool_choice: { type: 'tool', name: toolName },
    messages: [{ role: 'user', content: userText }],
  })
  const block = res.content.find((b) => b.type === 'tool_use')
  if (!block) throw new Error('Goaty did not return structured output')
  return block.input
}

async function handle(client, body) {
  const { action } = body
  if (action === 'teach') {
    const { topic, activeLens, otherPassions = [], learnerStyle = '' } = body
    const userText =
      `Teach this concept: "${topic}".\n` +
      `Use this passion as the lens: ${activeLens}.\n` +
      `The learner's other passions (for later if needed): ${otherPassions.join(', ') || 'none'}.\n` +
      `What you know about how they learn: ${learnerStyle || 'nothing yet'}.\n` +
      `Return the result via the tool.`
    return callClaude(client, userText, 'deliver_lesson', teachSchema)
  }
  if (action === 'respond') {
    const { topic, lensUsed, checkQuestion, answer, otherPassions = [], triedLenses = [], learnerStyle = '' } = body
    const userText =
      `The concept being taught is: "${topic}".\n` +
      `You just taught it through the lens of ${lensUsed} and asked: "${checkQuestion}".\n` +
      `The learner answered: "${answer}".\n` +
      `Lenses already tried: ${triedLenses.join(', ') || lensUsed}.\n` +
      `Their other passions available to switch to: ${otherPassions.join(', ') || 'none'}.\n` +
      `What you already know about how they learn: ${learnerStyle || 'nothing yet'}.\n\n` +
      `Grade the answer for genuine understanding of the underlying concept (not just the story). ` +
      `If correct, celebrate briefly in the metaphor and set switchedLens=false with empty explanation/checkQuestion, ` +
      `and note in learnerStyleUpdate that this lens worked for them. ` +
      `If wrong, set switchedLens=true, pick a DIFFERENT passion they haven't tried yet, re-teach the concept fully through that new world ` +
      `(explanation must end with an "In plain terms:" line), ask a new check question in the new metaphor, ` +
      `and put what you inferred about their learning style in learnerStyleUpdate.\n` +
      `Return the result via the tool.`
    return callClaude(client, userText, 'grade_and_adapt', respondSchema)
  }
  if (action === 'chat') {
    return chat(client, body)
  }
  if (action === 'game') {
    return game(client, body)
  }
  throw new Error('unknown action: ' + action)
}

// ---- Adaptive game engine: one action, four game types, all personalized ----
const arr = (items) => ({ type: 'array', items })
const obj = (properties, required) => ({ type: 'object', properties, required, additionalProperties: false })
const str = { type: 'string' }

const gameSchemas = {
  quiz_battle: obj({
    theme: str, intro: str,
    rounds: arr(obj({
      question: str,
      choices: arr(str),
      correctIndex: { type: 'integer' },
      why: str,
    }, ['question', 'choices', 'correctIndex', 'why'])),
  }, ['theme', 'intro', 'rounds']),

  match_pairs: obj({
    theme: str, intro: str,
    pairs: arr(obj({ concept: str, metaphor: str }, ['concept', 'metaphor'])),
  }, ['theme', 'intro', 'pairs']),

  spot_mistake: obj({
    theme: str, intro: str,
    statements: arr(obj({ text: str }, ['text'])),
    wrongIndex: { type: 'integer' },
    correction: str,
  }, ['theme', 'intro', 'statements', 'wrongIndex', 'correction']),

  order_steps: obj({
    theme: str, intro: str,
    steps: arr(obj({ label: str }, ['label'])),
    goalLabel: str,
  }, ['theme', 'intro', 'steps', 'goalLabel']),
}

const gamePrompts = {
  quiz_battle: (topic, lens, style) =>
    `Design a QUIZ BATTLE mini-game that tests real understanding of "${topic}", themed entirely in the world of ${lens}. ` +
    `Frame it as an exciting contest in that world (a penalty shootout, a boss fight, a cook-off, etc.). ` +
    `Give a short in-world "theme" name and a one-sentence "intro". Then 4 "rounds": each is a multiple-choice question (3-4 "choices") ` +
    `that tests the actual concept (not trivia about ${lens}), with 0-based "correctIndex" and a one-sentence "why". ` +
    `Adapt framing/difficulty to how this learner learns: ${style || 'unknown'}.`,

  match_pairs: (topic, lens, style) =>
    `Design a MATCHING mini-game for "${topic}", themed in the world of ${lens}. Give a "theme" and one-sentence "intro". ` +
    `Then exactly 5 "pairs": each links a real sub-concept of ${topic} ("concept") to a vivid, ACCURATE ${lens}-world metaphor for it ("metaphor"). ` +
    `Keep both sides short (a few words). Learner style: ${style || 'unknown'}.`,

  spot_mistake: (topic, lens, style) =>
    `Design a SPOT-THE-MISTAKE mini-game for "${topic}", themed in the world of ${lens}. Give a "theme" and one-sentence "intro". ` +
    `Then exactly 4 "statements" that explain aspects of ${topic} using ${lens} metaphors — exactly ONE (at 0-based "wrongIndex") contains a genuine conceptual error; ` +
    `the other three must be correct. Provide a "correction" explaining what's actually true. Learner style: ${style || 'unknown'}.`,

  order_steps: (topic, lens, style) =>
    `Design an ORDER-THE-STEPS mini-game for "${topic}", themed in the world of ${lens}. Give a "theme", a one-sentence "intro", and a short in-world victory phrase "goalLabel". ` +
    `Then "steps": 4-5 steps that must happen in a specific correct order to carry out or understand ${topic}, each phrased as an action in the ${lens} world but faithful to the real process. ` +
    `Return them IN THE CORRECT ORDER. Learner style: ${style || 'unknown'}.`,
}

async function game(client, body) {
  const { gameType, topic, lens, learnerStyle = '' } = body
  const schema = gameSchemas[gameType]
  const prompt = gamePrompts[gameType]
  if (!schema || !prompt) throw new Error('unknown gameType: ' + gameType)
  return callClaude(client, prompt(topic, lens, learnerStyle), 'build_game', schema)
}

// Free-form conversation about the current lesson, staying inside the learner's world.
async function chat(client, body) {
  const { topic, lensUsed, explanation, learnerStyle = '', history = [] } = body
  const chatSystem =
    `You are Goaty, talking live with a learner about "${topic}", which you taught them through the lens of ${lensUsed}.\n\n` +
    `${VOICE}\n\n` +
    `The explanation you gave was:\n"""\n${explanation}\n"""\n\n` +
    `Now just talk it through with them like a friend who knows this cold. Keep in mind:\n` +
    `- Stay inside the ${lensUsed} world — real examples and characters from it.\n` +
    `- Keep the underlying concept ACCURATE; if the metaphor is about to mislead, call it out and fix it in one plain sentence.\n` +
    `- Keep replies short: 2-4 sentences, like a text from a friend who gets it.\n` +
    `- If they're stuck, come at it from a fresh angle in the same world instead of repeating yourself.\n` +
    `- Plain conversational text only. No JSON, no headers.\n` +
    `What you know about how they learn: ${learnerStyle || 'nothing yet'}.`
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system: chatSystem,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  })
  const text = res.content.find((b) => b.type === 'text')?.text ?? ''
  return { reply: text }
}

function tutorApi() {
  let client
  return {
    name: 'muse-tutor-api',
    configureServer(server) {
      server.middlewares.use('/api/tutor', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        res.setHeader('content-type', 'application/json')
        try {
          if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY is not set. Add it to .env and restart the dev server.')
          }
          if (!client) client = new Anthropic() // reads ANTHROPIC_API_KEY
          const body = await readJson(req)
          const result = await handle(client, body)
          res.end(JSON.stringify(result))
        } catch (e) {
          console.error('[muse] error:', e?.message || e)
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e?.message || e) }))
        }
      })
    },
  }
}

/* ============================================================
 * Goaty API — real Anthropic-backed brain for the new app.
 *   POST /api/goaty
 *   body: { action: 'chat' | 'lesson', ... }
 * ============================================================ */

const GOATY_MODEL = 'claude-sonnet-4-6'

const GOATY_PERSONA = `You are Goaty, an adorable, encouraging AI learning coach mascot.
Personality: warm, playful, occasionally uses the goat emoji, celebrates small wins, never condescending.
Your superpower: you teach ANY subject through examples from the learner's own interests
(sports, anime, gaming, music, cooking, travel, books, TV/film, technology, etc.).
Rules:
- Be concise: 2-5 short sentences per chat reply.
- If the learner has interests listed, weave one in naturally — do not force it.
- Never lecture; teach through story, analogy, and tiny examples.
- Encourage curiosity. If they're stuck, offer a smaller next step.
- Plain conversational text. No markdown headers, no JSON in chat replies.`

async function goatyChat(client, body) {
  const { messages = [], profile = {} } = body
  const interestList = (profile.interests || []).join(', ') || 'not set yet'
  const system = `${GOATY_PERSONA}

Learner profile:
- Name: ${profile.name || 'friend'}
- Interests: ${interestList}
- Current goal: ${profile.goal || 'general curiosity'}
- Level: ${profile.level || 1} | XP: ${profile.xp || 0} | Streak: ${profile.streak || 0}
- Learning style hints: pace=${profile.style?.pace ?? 2}, depth=${profile.style?.depth ?? 2}, playfulness=${profile.style?.playfulness ?? 2}`

  const msgs = messages
    .filter((m) => m && m.role && m.content)
    .map((m) => ({ role: m.role === 'goaty' ? 'assistant' : m.role, content: String(m.content) }))

  const res = await client.messages.create({
    model: GOATY_MODEL,
    max_tokens: 500,
    system,
    messages: msgs.length ? msgs : [{ role: 'user', content: 'Say hi!' }],
  })
  const text = res.content.find((b) => b.type === 'text')?.text ?? ''
  return { reply: text }
}

// Lesson generation — matches src/goaty/data/lessons.js shape
const s = { type: 'string' }
const i = { type: 'integer' }
const arrOf = (items) => ({ type: 'array', items })

const lessonSchema = {
  type: 'object',
  properties: {
    id: s, title: s, subtitle: s, estimatedTime: i,
    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
    xpReward: i, mascotMood: s,
    learningGoal: s, story: s, explanation: s, visualAnalogy: s,
    examples: arrOf({
      type: 'object',
      properties: { code: s, explain: s },
      required: ['code', 'explain'], additionalProperties: false,
    }),
    challenge: {
      type: 'object',
      properties: { prompt: s, placeholder: s },
      required: ['prompt', 'placeholder'], additionalProperties: false,
    },
    solution: {
      type: 'object',
      properties: { code: s, explain: s },
      required: ['code', 'explain'], additionalProperties: false,
    },
    goatyTip: s, funFact: s,
    commonMistakes: arrOf(s),
    quiz: arrOf({
      type: 'object',
      properties: { q: s, choices: arrOf(s), correct: i, explain: s },
      required: ['q', 'choices', 'correct', 'explain'], additionalProperties: false,
    }),
    unlockNext: s,
  },
  required: [
    'id', 'title', 'subtitle', 'estimatedTime', 'difficulty', 'xpReward', 'mascotMood',
    'learningGoal', 'story', 'explanation', 'visualAnalogy', 'examples',
    'challenge', 'solution', 'goatyTip', 'funFact', 'commonMistakes', 'quiz', 'unlockNext',
  ],
  additionalProperties: false,
}

async function goatyLesson(client, body) {
  const {
    nodeId = 'gen-' + Date.now(),
    title = 'A New Concept',
    subject = 'the topic',
    lens = 'anime',
    profile = {},
    nextTitle = 'the next chapter',
  } = body
  const interests = (profile.interests || []).join(', ') || lens

  const userPrompt = `Design a complete micro-lesson for a learning platform called Goaty.

Topic: "${title}"
Subject area: "${subject}"
Primary interest to teach through: "${lens}"
Other interests the learner cares about: "${interests}"
When you announce the next chapter in unlockNext, use: "${nextTitle}"
Node id to return: "${nodeId}"

Structure to fill via the tool call:
1. Header: title (given), subtitle (one-liner), estimatedTime minutes (5-10), difficulty (Easy/Medium/Hard), xpReward (40-150), mascotMood (single word).
2. learningGoal: 2-3 short paragraphs. What they'll learn, why it matters, where they'll use it.
3. story: 3-5 lines that open through the "${lens}" world. Use \\n for line breaks.
4. explanation: conversational, 3-6 short paragraphs. No jargon. Analogies over definitions.
5. visualAnalogy: one paragraph describing a vivid mental image.
6. examples: exactly 2. First basic; second uses the "${lens}" world. Each has "code" + "explain".
7. challenge: a prompt to try + a placeholder line hinting at the shape.
8. solution: answer code + short "explain" of why it works.
9. goatyTip: one warm one-liner ending with the goat emoji.
10. funFact: one interesting related trivia line.
11. commonMistakes: exactly 3 short strings.
12. quiz: exactly 5 questions. Mix multiple-choice and true/false. Each item has "q", "choices" (2-4 strings), 0-based "correct" index, and a one-sentence "explain".
13. unlockNext: the given next chapter title.

Style rules:
- Friendly, energetic, never robotic.
- Short paragraphs, beginner-friendly (age 12+, ESL-safe).
- Return raw text values (no markdown headers).`

  const res = await client.messages.create({
    model: GOATY_MODEL,
    max_tokens: 4000,
    system: GOATY_PERSONA,
    tools: [{ name: 'return_lesson', description: 'Return the full lesson JSON.', input_schema: lessonSchema }],
    tool_choice: { type: 'tool', name: 'return_lesson' },
    messages: [{ role: 'user', content: userPrompt }],
  })
  const block = res.content.find((b) => b.type === 'tool_use')
  if (!block) throw new Error('Goaty did not return a lesson')
  return block.input
}

function goatyApi() {
  let client
  return {
    name: 'goaty-api',
    configureServer(server) {
      server.middlewares.use('/api/goaty', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        res.setHeader('content-type', 'application/json')
        try {
          if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY is not set. Add it to .env and restart the dev server.')
          }
          if (!client) client = new Anthropic()
          const body = await readJson(req)
          let result
          if (body.action === 'chat') result = await goatyChat(client, body)
          else if (body.action === 'lesson') result = await goatyLesson(client, body)
          else throw new Error('Unknown action: ' + body.action)
          res.end(JSON.stringify(result))
        } catch (e) {
          console.error('[goaty] error:', e?.message || e)
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e?.message || e) }))
        }
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tutorApi(), goatyApi()],
})
