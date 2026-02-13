# Site Analysis: Gaps & Improvement Ideas

## Current State

- 25 active topics covering foundations through ecosystem (Phoenix, LiveView, deployment)
- 5-stage progression per topic: ELI5 → Visuals → Deep Dive → Quiz → Practice
- 449 quiz questions, 50+ practice problems, 13 custom animations
- Custom Elixir syntax highlighter, light/dark theming, random quiz feature

---

## Learning Experience Gaps

### 4. Progress Tracking

No persistence of learning state. Users can't see:
- Which topics they've completed
- Their quiz scores over time
- Which practice problems they've solved
- Overall course completion percentage

Even simple `localStorage` tracking with a progress bar on the home page would add motivation and orientation. Could show:
- Completion dots/checkmarks on the topic grid
- Per-topic progress (which of the 5 stages they've viewed)
- Quiz score history with ability to retake
- A "resume where you left off" link

### 6. "Coming From X" Mental Model Bridges

Many Elixir learners come from OOP languages (JavaScript, Python, Ruby, Java). Brief callouts mapping familiar concepts would dramatically accelerate comprehension:

- "A module is like a class with only static methods"
- "Pattern matching replaces most uses of if/switch statements"
- "A GenServer is like an object with encapsulated mutable state, but it runs in its own process/thread"
- "Supervisors are like try/catch at the architecture level"
- "Pipe operator `|>` is like method chaining but for free functions"
- "Protocols are like interfaces/traits but dispatched on the first argument's type"
- "Immutability means you never debug 'who changed this variable' — it's always explicit"

Could be a toggleable section per topic (collapsed by default) or a standalone reference page.

### 7. Interactive Code Execution

Practice problems show solutions but users can't run code. Options:
- **"Copy to IEx" button** on all code blocks with a one-time setup guide for IEx
- **Livebook integration** — link to pre-built Livebook notebooks per topic (Livebook is Elixir's Jupyter)
- **Embedded REPL** — services like `try.elixir-lang.org` could be embedded via iframe
- At minimum: copy button on every code block (low effort, high utility)

### 8. Search

No way to search across topics. If a user remembers something about "pin operator" but not which topic it's in, they have no way to find it. A simple client-side search indexing topic content, quiz questions, and practice problems would be valuable.

### 9. Spaced Repetition / Review

Quiz questions are one-and-done. A spaced repetition system that resurfaces questions the user got wrong at increasing intervals would dramatically improve long-term retention. Even a simple "review missed questions" feature would help.
