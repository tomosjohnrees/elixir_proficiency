# Elixir Learning Path

A progressive guide to Elixir proficiency — each topic builds on the ones before it.

---

## Foundations

### 1. Basic Data Types and Operators
Integers, floats, atoms, strings, booleans, and basic arithmetic/comparison operators.

### 2. Pattern Matching
The `=` operator as match, destructuring tuples/lists, and the pin operator `^`.

### 3. Collections
Lists, tuples, keyword lists, and maps. How to access, update, and iterate over them.

### 4. Control Flow
`case`, `cond`, `if/else`, and `with` statements. Understanding how pattern matching drives control flow.

### 5. Functions and Modules
Defining modules, named functions, private functions, arity, default arguments, and guards.

### 6. Anonymous Functions and Higher-Order Functions
`fn`, the capture operator `&`, and working with the `Enum` and `Stream` modules.

### 7. Recursion
Since Elixir has no traditional loops, learn recursive patterns, tail-call optimisation, and how `Enum`/`Stream` abstract over recursion.

### 8. Pipe Operator and Composition
Writing idiomatic, readable data transformation pipelines with `|>`.

---

## Intermediate Concepts

### 9. Strings and Binaries
UTF-8 strings, binary syntax, bitstrings, and the `String` module vs charlists.

### 10. Structs and Protocols
Defining structs, enforcing keys, and using protocols for polymorphism (e.g. `Enumerable`, `String.Chars`).

### 11. Error Handling
`try/rescue/catch`, tagged tuples (`{:ok, val}` / `{:error, reason}`), and the `with` statement for happy-path chaining.

### 12. Mix and Project Structure
Creating projects with `mix new`, understanding `mix.exs`, dependencies, aliases, and the standard project layout.

### 13. ExUnit and Testing
Writing tests, doctests, `setup` blocks, assertions, and test-driven development in Elixir.

---

## Concurrency and OTP

> **Note:** This is the biggest conceptual leap in the learning path. Take extra time here.

### 14. Processes and Concurrency
`spawn`, `send`, `receive`, process mailboxes, links, and monitors. This is where you enter the BEAM/OTP world.

### 15. GenServer
The generic server abstraction, callbacks (`init`, `handle_call`, `handle_cast`, `handle_info`), and state management.

### 16. Supervisors and Supervision Trees
Fault tolerance strategies (`one_for_one`, `one_for_all`, etc.), the `Application` module, and the "let it crash" philosophy.

### 17. OTP Behaviours
`Agent`, `Task`, `Task.Supervisor`, `DynamicSupervisor`, and `Registry`.

---

## Data and Metaprogramming

### 18. Ecto
Schemas, changesets, validations, migrations, and querying databases. This is the primary data layer in the ecosystem.

### 19. Metaprogramming
`quote`, `unquote`, macros, the AST, `use`/`__using__`, and compile-time code generation. Understanding when *not* to use macros.

### 20. Behaviours and Advanced Protocols
Defining your own behaviours with `@callback`, protocol consolidation, and designing extensible libraries.

---

## The Phoenix Ecosystem

### 21. Phoenix Framework
Routers, controllers, views, templates, plugs, contexts, and the request lifecycle.

### 22. Phoenix LiveView
Real-time server-rendered UIs, lifecycle callbacks, events, live components, and streams.

---

## Advanced Topics

### 23. Distributed Elixir
Connecting nodes, `Node`, `:rpc`, distributed registries, and the trade-offs of distribution on the BEAM.

### 24. Telemetry, Observability, and Performance
`:telemetry`, `Logger`, profiling with `:observer`, ETS tables for fast in-memory storage, and benchmarking with Benchee.

### 25. Nerves and NIFs
Embedded systems with Nerves, calling C/Rust from Elixir via NIFs or Ports, and understanding when to reach outside the BEAM.

### 26. Idiomatic Elixir and Common Patterns
Pipe-friendly function design, tagged tuple conventions, choosing between `with`/`case`/function heads, naming conventions (`?` and `!`), when to use a process vs a plain module, and the "transform data through a pipeline" mindset.

### 27. ETS (Erlang Term Storage)
In-memory storage with `:ets.new/2`, table types (set, ordered_set, bag, duplicate_bag), concurrent access, match specifications, and when to use ETS instead of external caches.

### 28. Typespecs and Dialyzer
`@spec`, `@type`, `@callback`, `@opaque`, and static analysis with Dialyzer. Documenting intent, catching bugs at compile time, and improving editor tooling.

### 29. Debugging and Tooling
`IO.inspect/2` with `:label`, `dbg/2`, IEx helpers, `:observer.start()`, `mix xref`, `:sys.get_state/1`, and Erlang's `:debugger` and `:recon`.

### 30. Guards in Depth
Guard-safe expressions, `is_*` type checks, custom guards with `defguard/2`, combining guards with `and`/`or`, and common gotchas like `is_map/1` matching structs.