# Site Analysis: Gaps & Improvement Ideas

## Current State

- 25 active topics covering foundations through ecosystem (Phoenix, LiveView, deployment)
- 5-stage progression per topic: ELI5 → Visuals → Deep Dive → Quiz → Practice
- 449 quiz questions, 50+ practice problems, 13 custom animations
- Custom Elixir syntax highlighter, light/dark theming, random quiz feature

---

## Content Gaps

### 1. Idiomatic Elixir / Common Patterns (Biggest Gap)

The site teaches mechanics well but lacks dedicated content on what makes Elixir code *good*. This is the bridge between "I understand the syntax" and "I can write good Elixir" — exactly where most learners stall.

Topics to cover:
- Pipe-friendly function design (data-first arguments)
- Tagged tuples (`{:ok, result}` / `{:error, reason}`) as a pervasive convention
- When to use `with` vs `case` vs pattern matching in function heads
- Naming conventions (predicate functions ending in `?`, bang functions `!`)
- When to use a process vs a plain module (over-GenServer-ing is the #1 beginner mistake)
- Small functions composed via pipes vs monolithic functions
- Designing public APIs for modules
- The "transform data through a pipeline" mindset vs "mutate objects"

### 2. Missing Core Topics

Within the 25 slots, some notable absences:

- **ETS (Erlang Term Storage)** — In-memory storage used everywhere in production Elixir. A key reason you can avoid external caches like Redis for many use cases. Covers `:ets.new/2`, table types (set, ordered_set, bag, duplicate_bag), concurrent access, and match specifications.

- **Typespecs & Dialyzer** — `@spec`, `@type`, `@callback`, `@opaque` and static analysis with Dialyzer. Important for professional Elixir: documents intent, catches bugs at compile time, and improves editor tooling. Also covers Gradualixer and newer tools.

- **Debugging & Tooling** — The practical day-to-day tools that learners actually need:
  - `IO.inspect/2` with `:label` option for pipeline debugging
  - `dbg/2` (Elixir 1.14+) for pipeline-aware debugging
  - IEx helpers (`.iex.exs`, `h/1`, `i/1`, `recompile/0`)
  - `:observer.start()` for visualizing supervision trees and process state
  - `mix xref` for understanding module dependencies
  - `:sys.get_state/1` for inspecting GenServer state
  - Erlang's `:debugger` and `:recon`

- **Guards in Depth** — Touched on in pattern matching but deserves deeper treatment:
  - Guard-safe expressions and why arbitrary functions aren't allowed
  - `is_*` type checking functions
  - Custom guards with `defguard/2`
  - Combining guards with `when ... and ...` / `when ... or ...`
  - Common gotcha: `when is_map(x)` matches structs too

### 3. Common Mistakes / Gotchas (Per-Topic Addition)

A "Watch Out For" section in each topic would be very high value. Many Elixir surprises are well-known to experienced developers but trip up every learner. Examples by topic:

**Pattern Matching:**
- Maps pattern match partially (`%{a: 1} = %{a: 1, b: 2}` succeeds — this catches everyone)
- Pinning forgotten (`x = 1; {x, y} = {2, 3}` rebinds `x`, use `^x` to match)

**Lists & Tuples:**
- Charlists vs strings (`'hello'` is a charlist, `"hello"` is a binary string)
- `[7, 8, 9]` may display as a charlist in IEx if values are printable ASCII
- Keyword lists allow duplicate keys (not a map!)

**Maps & Structs:**
- `Map.get/2` returns `nil` for missing keys, not an error (use `Map.fetch!/2` for strict access)
- Struct update syntax `%MyStruct{s | key: val}` only works for existing keys
- Structs are maps under the hood but don't implement protocols like `Enumerable` by default

**Functions & Modules:**
- Captured functions (`&fun/arity`) vs anonymous functions — different syntax for same concept
- Module attributes are compile-time constants, not instance variables

**Enumerables & Streams:**
- `Enum.map/2` on a map returns a keyword list, not a map (use `Map.new/2` instead)
- Streams are lazy but `Enum.to_list/1` forces evaluation — infinite streams will hang
- `Enum.reduce/3` is the "universal" function; most other Enum functions are sugar on top

**Processes:**
- Linked processes crash together — use monitors if you just want notification
- Messages are never lost but mailboxes can grow unbounded and crash the VM
- `Process.sleep/1` in production code is almost always a smell

**GenServer:**
- `handle_call` blocks the caller; `handle_cast` doesn't — but cast gives no backpressure
- A GenServer processes messages sequentially — it's a bottleneck by design
- Don't do expensive work in `init/1`; it blocks the supervisor

**Supervisors:**
- Restart intensity/period defaults can cause rapid restart loops
- `:transient` restart means only restart on abnormal exit — useful for tasks

**Ecto:**
- Changesets validate but don't touch the database
- `Repo.insert/1` vs `Repo.insert!/1` — bang version raises, non-bang returns tuple
- N+1 queries: `Repo.preload/2` vs joins

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

### 5. Concept Map / Topic Relationships

The 25 topics are presented as a flat numbered grid. A visual showing how they connect would help learners understand the bigger picture and choose what to study next.

Key relationship chains:
- Pattern Matching → feeds into almost every other topic
- Processes → GenServer → Supervisors → OTP (linear chain)
- Functions & Modules → Protocols & Behaviours (abstraction progression)
- Mix & OTP → Ecto → Phoenix → LiveView (ecosystem build-up)
- Lists & Tuples → Enumerables & Streams → Comprehensions (data processing)

Could be implemented as:
- An interactive SVG/canvas diagram on the home page
- Prerequisite tags on each topic page
- "You should understand X before starting this topic" warnings
- "Next up" suggestions at the end of each topic

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

---

## Quick Wins (Ranked by Impact/Effort)

| Idea | Impact | Effort | Notes |
|------|--------|--------|-------|
| Common mistakes/gotchas per topic | Very High | Low | Add a `gotchas` field to `TopicContent`, render as a callout section |
| Copy button on code blocks | Medium | Very Low | Small UI addition to `CodeBlock` component |
| Idiomatic Elixir topic | Very High | Medium | Same workflow as any new topic via `/add-topic` |
| Progress tracking (localStorage) | High | Medium | Track section views, quiz scores, practice completion |
| Topic prerequisite links | Medium | Low | Add `prerequisites` field to topic registry |
| "Coming from X" callouts | Medium | Low-Medium | Collapsible section per topic |
| Debugging & Tooling topic | High | Medium | Practical day-to-day value |
| Search | Medium | Medium | Client-side index of all topic content |
| Concept map on home page | Medium | Medium | Interactive SVG showing topic relationships |
| ETS topic | High | Medium | Core production Elixir knowledge |
| Typespecs topic | Medium | Medium | Professional Elixir practice |
| Guards deep-dive topic | Medium | Medium | Could be added to existing pattern matching or standalone |
| Spaced repetition for quizzes | High | High | Requires more sophisticated state management |
| Livebook integration | Medium | High | External dependency, hosting considerations |
