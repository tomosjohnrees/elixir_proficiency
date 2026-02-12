### 1. Body Recursion vs Tail Recursion — Call Stack
**Topic:** 07 Recursion (`recursion`) · Visuals + Deep Dive
**Why:** The stack growing and collapsing is the single most impactful thing to animate. Text traces like `sum([1,2,3]) = 1 + sum([2,3]) = ...` are hard to follow; seeing frames pile up and unwind is immediate.
**Animation:** Side-by-side comparison.
- *Left (body recursion):* `sum([1,2,3])` spawns a stack frame, which spawns another on top for `sum([2,3])`, then another for `sum([3])`, then `sum([])` returns 0. Frames collapse top-down: `3+0=3`, `2+3=5`, `1+5=6`. Stack grows to 4 frames tall.
- *Right (tail recursion):* `tail_sum([1,2,3], 0)` occupies a single frame. The frame's values update in-place: `([2,3], 1)` → `([3], 3)` → `([], 6)`. Stack never exceeds 1 frame. Label: "The BEAM reuses the same frame."

### 2. Eager (Enum) vs Lazy (Stream) Pipeline
**Topic:** 08 Enumerables & Streams (`enumerables`) · Visuals
**Why:** The execution order difference — "all items through step 1, then all through step 2" vs "each item through all steps" — is fundamentally temporal. Text cannot convey it as clearly as motion.
**Animation:** Same pipeline of 3 stages (map, filter, take(2)) with 6 input items.
- *Eager:* All 6 items flow through map (6 intermediates created), then all through filter (4 pass), then take picks 2. Counter shows: "10 operations, 2 intermediate lists."
- *Lazy:* Item 1 passes through map → filter → take. Item 2 follows the same path. After 2 items reach take, the pipeline stops. Items 3–6 never enter the map. Counter: "4 operations, 0 intermediate lists."

### 3. Supervisor Restart Strategies
**Topic:** 12 Supervisors (`supervisors`) · Visuals
**Why:** The three strategies (one_for_one, one_for_all, rest_for_one) differ only in *which* children restart after a crash. That's a spatial question perfectly suited to animation.
**Animation:** Three rows, each showing children A, B, C under a supervisor bar. In each, B crashes (flashes red, collapses).
- *one_for_one:* Only B respawns. A and C remain.
- *one_for_all:* A, B, and C all collapse and respawn.
- *rest_for_one:* B and C (started after B) collapse and respawn. A remains.

### 4. LiveView Lifecycle (mount → render → event → diff → patch)
**Topic:** 23 LiveView (`liveview`) · Visuals + Deep Dive
**Why:** The event loop — user clicks, server processes, diff sent back, DOM patched — is cyclic and interactive. It's the core mental model for LiveView and impossible to fully convey statically.
**Animation:** Split screen: browser on left, server on right with LiveView process and assigns (`count: 0`). User clicks "+". Event message travels along a WebSocket line to the server. `handle_event` fires, assigns update to `count: 1`. Diff calculation highlights the changed portion. Only the diff travels back. Browser DOM patches. The loop resets for the next interaction.

### 5. Pattern Matching — The Match Operator
**Topic:** 02 Pattern Matching (`pattern-matching`) · Visuals
**Why:** Unlearning `=` as assignment is the first major hurdle in Elixir. Seeing it as a two-sided comparison rather than a one-way write is essential.
**Animation:** Two sides of the `=` sign. Right side: `{:ok, 42}` slides in. Left side: pattern `{:ok, value}` slides in. The `:ok` atoms align and light up green (match). The variable `value` is an empty slot that absorbs `42`, filling in green. Then replay with a mismatch: `{:error, _} = {:ok, 42}` — the tags collide with a red X, producing a MatchError.

### 6. Process Message Passing and Mailboxes
**Topic:** 10 Processes (`processes`) · Visuals
**Why:** Asynchronous send, mailbox queue, and pattern-matched receive are the foundation of everything OTP. The temporal nature (send is non-blocking, receive blocks and selects) needs animation.
**Animation:** Two process boxes with mailbox slots. Process A sends a labeled envelope `{:hello, "world"}` which slides into Process B's mailbox. Multiple envelopes stack in FIFO order. When `receive` runs, the process checks each envelope against patterns — the matching one highlights and is consumed; non-matching ones remain.

### 7. GenServer call vs cast
**Topic:** 11 GenServer (`genserver`) · Visuals
**Why:** Synchronous vs asynchronous is fundamentally about timing and blocking. A static diagram loses the temporal dimension.
**Animation:** Two lanes (client and server) playing as a sequence diagram.
- *call:* Client sends a request. Client freezes (grayed out, clock icon). Server processes. Reply arrow returns. Client unfreezes.
- *cast:* Client sends a request. Client immediately continues (no freeze). Server processes independently. No reply arrow.
Both paths play side by side for direct comparison.

### 8. Linked List Prepending with Structural Sharing
**Topic:** 03 Lists & Tuples (`lists-and-tuples`) · Visuals + Deep Dive
**Why:** Structural sharing explains why immutability doesn't mean wasteful copying and why prepend is O(1). Seeing the pointer relationship makes it click instantly.
**Animation:** A linked list `[1] → [2] → [3]` shown as connected nodes. When prepending `0`, a new node `[0]` is created pointing to the existing `[1]`. Both the original list and the new list share the `[1] → [2] → [3]` chain — highlight that only one node was allocated. Contrast with appending: the entire chain must be copied node by node to add `[4]` at the end (O(n)).

### 9. Phoenix Request Lifecycle
**Topic:** 22 Phoenix Basics (`phoenix-basics`) · Visuals + Deep Dive
**Why:** The conn struct traveling through Endpoint → Router → Pipeline → Controller → View is an explicit sequential flow. Seeing the conn accumulate data at each station is much clearer than reading prose.
**Animation:** Horizontal pipeline with labeled stations. An HTTP request enters from the left, becomes a `conn` struct. At each station the conn gains attributes: Router adds matched route, pipeline plugs add session/CSRF, Controller adds assigns. At the View station, the conn becomes an HTML response and exits right.

### 10. `with` Happy-Path Chain and Short-Circuit
**Topic:** 05 Control Flow (`control-flow`) · Deep Dive
**Why:** `with` is one of the hardest control flow concepts for newcomers. Data flowing forward on match and ejecting to `else` on failure is inherently dynamic.
**Animation:** A pipeline of `<-` stages. Data enters from the left. At each stage, pattern matching succeeds (green) and extracted values flow forward, or fails (red) and the data ejects downward directly to the `else` block, skipping remaining stages. Animate a successful path, then replay with a failure at stage 2 to show early exit.

### 11. Macro Expansion at Compile Time
**Topic:** 17 Macros (`macros`) · Visuals + Deep Dive
**Why:** The two-phase nature (compile-time transformation, then runtime execution) is the hardest concept in the topic. Separating the phases visually is the key insight.
**Animation:** Two-phase timeline with a clear divider. *Compile time:* Source code containing `MyMacros.log(1 + 2 * 3)` — the macro call highlights, expands into new AST code, and replaces the original call site. *Runtime:* The expanded code executes normally.

### 12. Quote and Unquote (Code as Data)
**Topic:** 17 Macros (`macros`) · Deep Dive
**Why:** `quote` turning code into data and `unquote` injecting values back is abstract. Visualization makes the "template with holes" metaphor concrete.
**Animation:** Expression `x + 1` morphs into its AST tuple `{:+, [], [{:x, [], Elixir}, 1]}` when `quote` is applied. Then `x = 5` and `quote do: unquote(x) + 1` — the `unquote(x)` slot glows, `5` slides in, producing `{:+, [], [5, 1]}`.

### 13. Head | Tail List Destructuring
**Topic:** 02 Pattern Matching (`pattern-matching`) · Visuals
**Why:** `[head | tail]` is foundational to recursion and Enum. Seeing the list physically split is more powerful than reading about it.
**Animation:** Linked list `[1] → [2] → [3] → [4]`. When `[head | tail]` is applied, the first node detaches and floats up labeled "head = 1". The remaining chain stays together labeled "tail = [2, 3, 4]". Then show the single-element case where tail becomes `[]`.

### 14. Changeset Validation Pipeline
**Topic:** 21 Ecto Basics (`ecto-basics`) · Visuals
**Why:** The changeset pipeline (cast → validate → validate → ...) is the heart of Ecto data handling, with clear pass/fail branching at each step.
**Animation:** Raw input `%{name: "", email: "bad", age: -5}` enters from the left. It passes through a `cast` gate, then validation checkpoints: `validate_required` (name empty — red error tag attaches), `validate_format` (email fails — another tag), `validate_number` (age negative — another tag). Changeset exits with `valid?: false` and visible error list. Toggle to show valid input flowing through all green.

### 15. Task.async_stream Backpressure
**Topic:** 24 Concurrency Patterns (`concurrency-patterns`) · Visuals + Deep Dive
**Why:** Bounded concurrency — only N tasks at once, new ones starting as old ones finish — is a flow concept hard to convey in text.
**Animation:** A queue of 10 items on the left. A processing zone with 4 slots (max_concurrency: 4). Items flow into available slots. As each slot finishes, the completed item exits right and the next queued item slides in. The queue shrinks as items are processed.

### 16. Links vs Monitors — Crash Propagation
**Topic:** 10 Processes (`processes`) · Deep Dive
**Why:** Bidirectional vs unidirectional crash behavior is spatial and directional.
**Animation:** Two scenes. *Links:* Two processes connected by a red line. Process B crashes. The line pulses, and Process A also crashes. *Monitors:* Process A has a dotted line pointing at Process B. Process B crashes. A `:DOWN` message envelope slides to Process A. Process A stays alive and receives the message.

### 17. Supervision Tree with Failure Cascading
**Topic:** 12 Supervisors (`supervisors`) · Deep Dive
**Why:** Hierarchical recovery — failed child → supervisor restarts it; supervisor fails → parent supervisor restarts the sub-tree — is a tree traversal.
**Animation:** Tree with Application at top, two supervisors below, workers under each. A worker crashes — its supervisor detects and restarts it (green pulse). Then: the worker crashes repeatedly. The supervisor itself turns red. The parent supervisor detects this and restarts the entire sub-tree.

### 18. UTF-8 Bytes vs Graphemes
**Topic:** 09 Strings in Depth (`strings-in-depth`) · Visuals
**Why:** `byte_size("Jose") = 5` but `String.length("Jose") = 4` — seeing the multi-byte encoding visually resolves the confusion.
**Animation:** "Jose" displayed as 4 visible characters. Below, byte cells: `[74] [111] [115] [195, 169]`. First three characters map 1:1 to single bytes. The "e" expands to fill two byte cells with a bracket grouping them. `byte_size = 5` counts cells; `String.length = 4` counts characters.

### 19. Closure Capturing Outer Scope
**Topic:** 06 Functions & Modules (`functions-and-modules`) · Deep Dive
**Why:** A function "carrying" captured variables from its creation scope is a snapshot-in-time relationship that animation conveys well.
**Animation:** An outer scope rectangle with `multiplier = 3`. When `fn x -> x * multiplier end` is created, the function is packaged — it wraps around a copy of `multiplier = 3` like a backpack. Later, called in a different scope, it opens the backpack to retrieve the captured value.

### 20. Comprehension Assembly Line
**Topic:** 19 Comprehensions (`comprehensions`) · Visuals
**Why:** The ELI5 analogy is literally a conveyor belt. Generator → filter → transform → collect maps perfectly to animation.
**Animation:** Conveyor belt, left to right. Items 1–10 enter. At the filter station, a gate opens for even numbers; odd ones fall off. At the transform station, numbers double. Items drop into a collection bin (list). The bin morphs into a map when demonstrating `:into`.

### 21. Nested Immutable Update with put_in
**Topic:** 04 Maps & Structs (`maps-and-structs`) · Deep Dive
**Why:** Immutable nested updates require reconstructing every intermediate map from the inside out. Seeing this makes the cost visible.
**Animation:** Concentric boxes: outer map → `:user` → `:address` → `:city`. `put_in` changes the city. The innermost box is copied with the new value. The containing box is copied pointing to the new inner box. This ripples outward. Old structure fades (still intact); new structure is built inside-out.

### 22. Task.async Parallel vs Sequential Execution
**Topic:** 24 Concurrency Patterns (`concurrency-patterns`) · Visuals
Two timelines side by side. Sequential: Task 1 takes 1s, then Task 2 takes 1s (total 2s). Parallel: both run simultaneously (total ~1s). Progress bars and timer make the speedup visceral.

### 23. Fan-Out/Fan-In with Timeouts
**Topic:** 24 Concurrency Patterns (`concurrency-patterns`) · Deep Dive
Coordinator dispatches to 3 workers (database, cache, API). Each has its own progress bar. Database and cache finish. API is slow — timeout expires, red X. Results gather back at coordinator with `{:ok, ...}` and `{:exit, :timeout}`.

### 24. PubSub Broadcasting to Multiple LiveViews
**Topic:** 23 LiveView (`liveview`) · Deep Dive
Three browser windows each connected to their own LiveView process. One user submits a message. Their process broadcasts via PubSub. Message radiates to all three processes. All three browsers update near-simultaneously.

### 25. Dual Mount — HTTP then WebSocket
**Topic:** 23 LiveView (`liveview`) · Deep Dive
Two-phase timeline. Phase 1: HTTP GET → disconnected mount → static HTML sent → browser renders immediately. Phase 2: WebSocket established → connected mount → data fetched → re-render with live data.

### 26. Protocol Dispatch by Type
**Topic:** 15 Protocols (`protocols`) · Visuals
A function call arrives at a dispatch point. The first argument's type is inspected. Three branching paths (Integer, BitString, List) — the matching path lights up and the call flows to the correct `defimpl` block.

### 27. Binary Pattern Matching Slicing a String
**Topic:** 09 Strings in Depth (`strings-in-depth`) · Deep Dive
Bytes for "Jose" shown as `[74, 111, 115, 195, 169]`. Pattern `<<first::utf8, rest::binary>>` slides over from left. `::utf8` reads the first codepoint (1 byte for 'J'). `::binary` captures the rest. Bytes split into two groups.

### 28. case Clause Matching (Top-to-Bottom)
**Topic:** 05 Control Flow (`control-flow`) · Visuals
A value `{:error, "timeout"}` falls downward past stacked pattern filters. First filter `{:ok, value}` doesn't match (passes through). Second filter `{:error, reason}` matches (clicks into place, body executes). Remaining filters are grayed out.

### 29. Compile-Time vs Runtime Configuration
**Topic:** 25 Releases & Deployment (`deployment`) · Deep Dive
Two-phase timeline. *Build time:* `config.exs` values are stamped into the release binary (frozen). *Runtime:* `runtime.exs` reads `System.get_env("DATABASE_URL")` fresh on each start. Different deploys show different values being read.

### 30. Cartesian Product from Multiple Generators
**Topic:** 19 Comprehensions (`comprehensions`) · Deep Dive
Two input columns: A = [1, 2, 3], B = [:a, :b]. Lines connect each A element to each B element, forming a grid. Connections animate one by one showing iteration order: `(1,:a)`, `(1,:b)`, `(2,:a)`, etc. Output list materializes on the right.

### 31. Reduce Building an Accumulator
**Topic:** 08 Enumerables & Streams (`enumerables`) · Deep Dive
`Enum.reduce([1,2,3], [], fn x, acc -> [x*2 | acc] end)`. Accumulator shown as a growing container. Item 1: acc `[]` → `[2]`. Item 2: `[2]` → `[4, 2]`. Item 3: `[4, 2]` → `[6, 4, 2]`. Then `Enum.reverse` flips to `[2, 4, 6]`. Label: "This is how map works internally."

### 32. Plug Pipeline with halt()
**Topic:** 22 Phoenix Basics (`phoenix-basics`) · Deep Dive
Conn flows through a pipeline of plug boxes. At an authentication plug, it branches: if `current_user` exists, it passes through (green). If not, the plug turns red, `halt()` is called, conn stops — subsequent plugs and the controller are never reached. A 403 response is sent back.

### 33. Linked vs Unlinked Tasks
**Topic:** 24 Concurrency Patterns (`concurrency-patterns`) · Deep Dive
Side by side. *Linked (Task.async):* Task crashes, crash propagates, caller also dies. *Unlinked (async_nolink):* Task crashes, caller remains alive, receives `{:exit, reason}` and handles gracefully.

### 34. List vs Tuple Memory Layout
**Topic:** 03 Lists & Tuples (`lists-and-tuples`) · Visuals
Split screen. Tuple: contiguous memory block with instant random access (arrow jumps to any slot). List: scattered nodes with pointers (accessing third element follows two pointers). Update: tuple copies entire block; list copies only nodes up to the change point.
