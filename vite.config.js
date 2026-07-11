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
const SYSTEM = `You are Muse, a tutor who teaches ANY concept exclusively through the lens of what the learner loves (their "passions" — e.g. soccer, anime, art).

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
  if (!block) throw new Error('Muse did not return structured output')
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
  throw new Error('unknown action: ' + action)
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
