# Goaty 🐐

**Your GOAT study buddy — learn anything through the things you already love.**

Goaty is an autonomous learning agent that teaches *any* concept through *your*
passions — soccer, anime, art, cooking, whatever you love. It doesn't just
hand you one analogy and stop. Goaty **plans** how to teach you, **checks** if
it landed, **adapts** by switching to a different world when it doesn't, holds a
real **conversation** in that world, and **remembers** how *you* learn — getting
better at teaching you over time.

> Explain recursion to a soccer fan as a give-and-go passing sequence that keeps
> calling itself until a goal. If that doesn't click, re-teach it as an anime
> power-up training arc — and remember that this learner thinks in stories, not
> positions.

---

## Why it's an *agent*, not a chatbot

Goaty stacks four agentic behaviors that a plain "explain X" prompt doesn't:

| Behavior | What Goaty does |
|----------|-----------------|
| 🧠 **Plans** | Chooses which of your passions to teach through, using your track record |
| 🔁 **Adapts** | Grades your check-question answer; if you miss it, it re-teaches through a *different* world and infers *how* you learn |
| 💬 **Converses** | You can ask follow-ups ("I don't get the base case") and it answers inside the same world, self-correcting if the metaphor would mislead |
| 📌 **Remembers** | A persistent profile of your worlds, your learning style, and which lenses land for you — visible, and carried across lessons |

Every explanation ends with a plain-language **"In plain terms:"** line, so you
walk away with the *correct* mental model — not just a fun story.

---

## The demo (60 seconds)

1. Type a hard topic — e.g. `recursion` — and pick your worlds (⚽ 🎌 🎨).
2. Goaty explains it entirely through **Soccer**, then asks a check question in
   the metaphor.
3. Answer it **wrong** on purpose → Goaty says *"let me try one of your other
   worlds…"*, **re-teaches through Anime**, and the memory panel updates live:
   **"How you learn"** fills in, and the lens track record grows.
4. Ask a follow-up in the chat → Goaty answers in your world.
5. Start a **second** topic → Goaty leads with the lens that worked for you.
   **It learned you.**

That "it learned me" beat is the whole pitch.

---

## Run it locally

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env   # get one at console.anthropic.com
npm run dev
```

Open http://localhost:5173.

The API key stays **server-side** — it's loaded from `.env` inside the Vite dev
middleware and never ships to the browser.

---

## How it works

```
Browser (React)                 Vite dev server (Node)              Claude API
──────────────                  ──────────────────────             ──────────
 topic + profile  ──/api/tutor──►  system prompt + your data  ──►  claude-opus-4-8
 lesson + chat    ◄─────────────   structured tool-call JSON   ◄──  (forced tool call
 memory panel                       / free-text chat reply           for reliable JSON)
 (localStorage)
```

- **`vite.config.js`** — the tutor engine. A tiny dev-server middleware exposes
  `/api/tutor` with three actions:
  - `teach` — explain a topic through a chosen lens + produce a check question
  - `respond` — grade the answer; on a miss, switch lens, re-teach, and update
    the learner-style note
  - `chat` — free-form conversation about the current lesson, staying in-world
  Structured output uses a **forced tool call**, which is reliable across API
  versions.
- **`src/App.jsx`** — passion picker, lesson view, adapt loop, chat thread, and
  the "What Goaty knows about you" memory panel (persisted in `localStorage`).

Model: `claude-opus-4-8`. Swap one line in `vite.config.js` to
`claude-sonnet-5` for lower latency.

---

## Hackathon tracks it hits

- **🧠 Autonomous Learning Agents** — plans, adapts, and evolves a personalized
  teaching strategy per learner.
- **🧪 Adaptive Evaluation Engines** — the check-question → grade → re-teach loop
  is continuous, conversational assessment, not a static test.
- **🌍 Lifelong Learning Agents** — the persistent profile is the seed of a model
  of *how you learn* that follows you across every subject.

---

## Tech stack

React + Vite • Anthropic Claude (`claude-opus-4-8`) • `localStorage` for
persistent memory • zero backend to deploy (the Vite middleware is the API).

---

*Built for the hackathon. 🐐*
