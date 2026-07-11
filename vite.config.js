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
const SYSTEM = `You are Goaty, a tutor who teaches ANY concept exclusively through the lens of what the learner loves (their "passions" — e.g. soccer, anime, art).

Rules for every explanation:
- Teach the concept ENTIRELY inside the chosen passion's world. Every example, character, and mechanic must come from that world. Do not explain the concept generically first.
- Be vivid and specific to that world (real teams/players, real anime tropes, real art movements) — not a thin "it's like a game" gesture.
- Keep it to 2-4 short paragraphs. Use plain text with line breaks; no markdown headers.
- CRUCIAL: end with ONE line starting with "In plain terms:" that grounds the metaphor back to the actual concept, so the learner ends with a correct mental model, not just a story.
- Then produce ONE check question, asked INSIDE the same metaphor, that can only be answered if the learner actually understood the underlying concept.

You adapt. If told a previous lens failed (the learner answered its check question wrong), switch to a DIFFERENT passion from their profile and re-teach from scratch through that new world — and infer something about HOW this learner learns (e.g. "responds better to narrative/story than to spatial/positional analogies").

Always respond ONLY with the requested JSON. No preamble.`

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
    `You are Goaty, a warm, encouraging tutor. You are having a live conversation with a learner about the concept "${topic}", which you taught them through the lens of ${lensUsed}.\n\n` +
    `The explanation you gave was:\n"""\n${explanation}\n"""\n\n` +
    `Now answer their follow-up questions and reactions conversationally. Rules:\n` +
    `- Stay inside the ${lensUsed} world — use concrete examples and characters from it.\n` +
    `- Keep the underlying concept ACCURATE; if the metaphor is about to mislead, say so and correct it in one plain sentence.\n` +
    `- Keep replies short: 2-4 sentences. Be warm and a little playful.\n` +
    `- If they seem stuck, try a fresh angle within the same world rather than repeating yourself.\n` +
    `- Plain conversational text only. No JSON, no headers.\n` +
    `What you know about how this learner learns: ${learnerStyle || 'nothing yet'}.`
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

export default defineConfig({
  plugins: [react(), tutorApi()],
})
