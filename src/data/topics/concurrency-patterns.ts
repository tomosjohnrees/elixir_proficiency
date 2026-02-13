import type { TopicContent } from "@/lib/types";
import Animation23FanOutFanIn from "@/components/animations/Animation23FanOutFanIn";

const concurrencyPatterns: TopicContent = {
  meta: {
    slug: "concurrency-patterns",
    title: "Concurrency Patterns",
    description: "Tasks, agents, and common concurrent patterns",
    number: 24,
    active: true,
  },

  eli5: {
    analogyTitle: "The Kitchen Brigade",
    analogy:
      "Imagine a busy restaurant kitchen. The head chef doesn't chop every vegetable, sear every steak, and plate every dish alone. Instead, there's a brigade: one cook preps vegetables, another works the grill, someone else handles desserts, and a sous chef keeps track of ingredient inventory. Everyone works at the same time, and the head chef coordinates them all. When an order comes in, the chef dispatches tasks to the right people and assembles the result.",
    items: [
      { label: "Tasks", description: "The one-off jobs. 'Go chop these onions and bring them back.' You hand off a piece of work, and it comes back with a result. Fire-and-forget or wait for the answer — your choice." },
      { label: "Agents", description: "The sous chef with the inventory clipboard. They hold onto a piece of state and let anyone check or update it. Need to know how many tomatoes are left? Ask the agent." },
      { label: "Task.Supervisor", description: "The kitchen manager who watches the brigade. If a cook drops a pan and crashes, the manager handles it gracefully — the rest of the kitchen keeps running." },
      { label: "GenStage / Flow", description: "The assembly line for high-volume orders. Data flows through stages — each stage processes items and passes them to the next. Built for handling massive throughput." },
    ],
    keyTakeaways: [
      "Task is for short-lived concurrent work — fire off a computation and optionally await the result.",
      "Agent is a simple wrapper around state — great for when you need shared state without a full GenServer.",
      "Task.Supervisor lets you spawn tasks under supervision, so failures are isolated and recoverable.",
      "Task.async_stream processes collections concurrently with controlled parallelism.",
      "Choose the simplest abstraction that fits: Task for one-off work, Agent for simple state, GenServer for complex state + logic.",
    ],
  },

  visuals: {
    animation: Animation23FanOutFanIn,
    animationDuration: 17,
    dataTypes: [
      { name: "Task.async/1", color: "#2563eb", examples: ["task = Task.async(fn -> ... end)", "result = Task.await(task)", "Task.await(task, 10_000)"], description: "Spawns a linked process that runs a function. Returns a task struct you can await for the result. Crashes propagate to the caller." },
      { name: "Task.async_stream/3", color: "#059669", examples: ["Task.async_stream(urls, &fetch/1)", "max_concurrency: 5", "ordered: true"], description: "Processes a collection concurrently with backpressure. Controls parallelism with max_concurrency. Returns a stream of results." },
      { name: "Agent", color: "#d97706", examples: ["Agent.start_link(fn -> %{} end)", "Agent.get(pid, & &1)", "Agent.update(pid, &Map.put(&1, k, v))"], description: "A simple stateful process. Start with initial state, get/update it with functions. No callbacks to implement." },
      { name: "Task.Supervisor", color: "#e11d48", examples: ["Task.Supervisor.async(sup, fn)", "Task.Supervisor.async_nolink(sup, fn)", "Task.Supervisor.start_child(sup, fn)"], description: "A supervisor for dynamically spawned tasks. async_nolink prevents caller crash if the task fails." },
      { name: "Task.start/1", color: "#7c3aed", examples: ["Task.start(fn -> send_email() end)", "Task.start_link(fn -> ... end)", "{:ok, pid}"], description: "Fire-and-forget task. The caller doesn't wait for a result. Use start_link to link the task to the caller." },
      { name: "Patterns", color: "#0891b2", examples: ["Fan-out / Fan-in", "Worker pool", "Pipeline / Stages", "Scatter-gather"], description: "Common concurrency patterns: dispatch work to many processes and collect results, limit concurrency, or chain processing stages." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Task: Async and Await",
        prose: [
          "`Task.async/1` spawns a new process, runs the given function, and returns a `%Task{}` struct. You then call `Task.await/2` to block until the result is ready. The task is linked to the caller — if the task crashes, the caller crashes too (and vice versa).",
          "This is the simplest way to do concurrent work in Elixir. Need to fetch three API endpoints at the same time? Spawn three tasks, await all three, and you've cut your total wait time from sequential to parallel.",
        ],
        code: {
          title: "Basic async/await",
          code: `# Run two slow operations concurrently
task1 = Task.async(fn ->
  Process.sleep(1000)
  "result from task 1"
end)

task2 = Task.async(fn ->
  Process.sleep(1000)
  "result from task 2"
end)

# Both tasks run in parallel — total time ~1s, not 2s
result1 = Task.await(task1)
result2 = Task.await(task2)
{result1, result2}
# => {"result from task 1", "result from task 2"}

# Await multiple tasks at once
tasks = Enum.map(1..5, fn i ->
  Task.async(fn -> i * 10 end)
end)

Task.await_many(tasks)
# => [10, 20, 30, 40, 50]

# Custom timeout (default is 5 seconds)
Task.await(task, 10_000)  # 10 second timeout`,
          output: "[10, 20, 30, 40, 50]",
        },
      },
      {
        title: "Task.async_stream: Concurrent Collection Processing",
        prose: [
          "`Task.async_stream/3` is one of the most useful functions in Elixir's standard library. It takes an enumerable and a function, processes each element in a separate task, and returns a stream of results. The key feature is `max_concurrency` — it limits how many tasks run simultaneously, providing built-in backpressure.",
          "This is perfect for I/O-bound work like fetching multiple URLs, processing files, or making database calls. You get concurrency without overwhelming the target system, and the results come back in order by default.",
        ],
        code: {
          title: "Concurrent stream processing",
          code: `# Fetch multiple URLs concurrently (max 3 at a time)
urls = ["url1", "url2", "url3", "url4", "url5"]

results =
  urls
  |> Task.async_stream(&HTTPClient.get/1, max_concurrency: 3, timeout: 10_000)
  |> Enum.map(fn
    {:ok, response} -> response.body
    {:error, reason} -> {:failed, reason}
  end)

# Process files with controlled parallelism
files
|> Task.async_stream(fn file ->
  file
  |> File.read!()
  |> process_content()
end, max_concurrency: System.schedulers_online())
|> Enum.to_list()

# Unordered results (faster if you don't care about order)
1..100
|> Task.async_stream(&heavy_computation/1,
  max_concurrency: 10,
  ordered: false
)
|> Enum.reduce(%{}, fn {:ok, result}, acc ->
  Map.merge(acc, result)
end)`,
          output: "[body1, body2, body3, body4, body5]",
        },
      },
      {
        title: "Agent: Simple State Management",
        prose: [
          "An Agent is a process that holds state and provides a simple get/update API. You don't need to define callbacks or a module — just pass functions that read or transform the state. Think of it as a GenServer stripped down to only state management.",
          "Agents are great for caches, counters, and any situation where you need shared mutable state without complex logic. However, if you need to do work based on state changes (side effects, conditional logic), a GenServer is a better fit.",
        ],
        code: {
          title: "Agent basics",
          code: `# Start an agent with initial state
{:ok, counter} = Agent.start_link(fn -> 0 end)

# Read the state
Agent.get(counter, fn state -> state end)
# => 0

# Update the state
Agent.update(counter, fn state -> state + 1 end)
Agent.get(counter, & &1)
# => 1

# Get and update atomically
Agent.get_and_update(counter, fn state ->
  {state, state + 10}  # {return_value, new_state}
end)
# => 1 (returns old value, state is now 11)

# Named agent for global access
Agent.start_link(fn -> %{} end, name: :cache)
Agent.update(:cache, &Map.put(&1, "key", "value"))
Agent.get(:cache, &Map.get(&1, "key"))
# => "value"

# Agent as a simple cache
defmodule SimpleCache do
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def get(key), do: Agent.get(__MODULE__, &Map.get(&1, key))
  def put(key, val), do: Agent.update(__MODULE__, &Map.put(&1, key, val))
  def delete(key), do: Agent.update(__MODULE__, &Map.delete(&1, key))
end`,
          output: "\"value\"",
        },
      },
      {
        title: "Task.Supervisor: Supervised Tasks",
        prose: [
          "Raw `Task.async` links the task to the caller — if the task crashes, your caller crashes too. `Task.Supervisor` provides a safer alternative. Tasks are spawned under a supervisor, and you can choose whether failures propagate (`async`) or are isolated (`async_nolink`).",
          "`async_nolink` is especially useful in web applications: if you dispatch background work from a request handler, you don't want a task failure to crash the request. The supervisor catches the failure, and your handler can decide what to do.",
        ],
        code: {
          title: "Supervised tasks",
          code: `# Add to your supervision tree
children = [
  {Task.Supervisor, name: MyApp.TaskSupervisor}
]
Supervisor.start_link(children, strategy: :one_for_one)

# Supervised async — still linked to caller
task = Task.Supervisor.async(MyApp.TaskSupervisor, fn ->
  fetch_external_api()
end)
result = Task.await(task)

# Supervised async_nolink — isolated from caller
task = Task.Supervisor.async_nolink(MyApp.TaskSupervisor, fn ->
  risky_operation()
end)

case Task.yield(task, 5000) || Task.shutdown(task) do
  {:ok, result} -> {:success, result}
  {:exit, reason} -> {:failed, reason}
  nil -> {:timeout, :task_killed}
end

# Fire and forget under supervision
Task.Supervisor.start_child(MyApp.TaskSupervisor, fn ->
  send_notification_email(user)
end)`,
          output: "{:success, result}",
        },
      },
      {
        title: "Common Patterns: Fan-Out/Fan-In",
        prose: [
          "The fan-out/fan-in pattern dispatches work to multiple processes in parallel (fan-out) and then collects all results (fan-in). This is the most common concurrency pattern in Elixir — and `Task.async_stream` handles it beautifully.",
          "For more control, you can manually spawn tasks, await them selectively with `Task.yield_many/2`, and handle timeouts per-task. This is useful when different tasks have different importance or timeout requirements.",
        ],
        code: {
          title: "Fan-out/fan-in with yield",
          code: `# Fetch from multiple sources with individual timeouts
sources = [
  {fn -> fetch_database() end, 2000},
  {fn -> fetch_cache() end, 500},
  {fn -> fetch_api() end, 5000}
]

tasks = Enum.map(sources, fn {fun, _timeout} ->
  Task.async(fun)
end)

timeouts = Enum.map(sources, fn {_fun, timeout} -> timeout end)
max_timeout = Enum.max(timeouts)

# Wait for all, with a max timeout
results = Task.yield_many(tasks, max_timeout)

Enum.zip(tasks, results)
|> Enum.map(fn
  {_task, {:ok, result}} -> {:ok, result}
  {task, {:exit, reason}} -> {:error, reason}
  {task, nil} ->
    Task.shutdown(task, :brutal_kill)
    {:error, :timeout}
end)

# Scatter-gather: take the first N successful results
defmodule ScatterGather do
  def first_n(funs, n) when n <= length(funs) do
    tasks = Enum.map(funs, &Task.async/1)

    tasks
    |> Task.yield_many(5000)
    |> Enum.flat_map(fn
      {_task, {:ok, result}} -> [result]
      _ -> []
    end)
    |> Enum.take(n)
  end
end`,
          output: "[{:ok, db_result}, {:ok, cache_result}, {:ok, api_result}]",
        },
      },
      {
        title: "Choosing the Right Abstraction",
        prose: [
          "Elixir gives you a spectrum of concurrency tools, and picking the right one matters. Start with the simplest option that fits your needs: `Task` for one-off concurrent work, `Agent` for simple shared state, `GenServer` for stateful processes with complex logic, and `Task.Supervisor` when you need fault tolerance for dynamic tasks.",
          "A common mistake is reaching for GenServer when Task or Agent would suffice. If you just need to run something in the background, use Task. If you just need a shared counter or cache, use Agent. Reserve GenServer for when you need the full callback lifecycle — periodic work, message handling, and complex state transitions.",
        ],
        code: {
          title: "Decision guide",
          code: `# TASK: One-off concurrent work
# "Fetch this data in the background"
task = Task.async(fn -> HTTPClient.get(url) end)
result = Task.await(task)

# AGENT: Simple shared state
# "Keep a counter / cache that multiple processes access"
{:ok, pid} = Agent.start_link(fn -> 0 end)
Agent.update(pid, &(&1 + 1))

# GENSERVER: Stateful process with logic
# "Manage a connection pool with checkout/checkin"
# "Rate limiter that tracks requests per second"
# "Process that does periodic cleanup every 5 minutes"

# TASK.SUPERVISOR: Fault-tolerant background work
# "Send emails without crashing the request handler"
Task.Supervisor.start_child(MyApp.TaskSup, fn ->
  Mailer.deliver(email)
end)

# TASK.ASYNC_STREAM: Process collections concurrently
# "Resize 1000 images, 10 at a time"
images
|> Task.async_stream(&resize/1, max_concurrency: 10)
|> Enum.to_list()`,
          output: "Choose the simplest tool that fits",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What happens if a `Task.async` task crashes?",
        options: [
          { label: "The crash is silently ignored" },
          { label: "The caller process also crashes because they are linked", correct: true },
          { label: "The task automatically restarts" },
          { label: "Task.await returns {:error, reason}" },
        ],
        explanation:
          "Task.async creates a linked process. If the task crashes, the crash propagates to the caller via the link. To avoid this, use Task.Supervisor.async_nolink, which isolates the failure from the caller.",
      },
      {
        question: "What does the `max_concurrency` option in `Task.async_stream` control?",
        options: [
          { label: "The maximum number of items in the input list" },
          { label: "The timeout for each task" },
          { label: "How many tasks can run at the same time", correct: true },
          { label: "The number of CPU cores to use" },
        ],
        explanation:
          "max_concurrency limits how many tasks run simultaneously. This provides backpressure — if you're processing 10,000 items but set max_concurrency to 5, only 5 tasks run at any time. New tasks start as previous ones complete.",
      },
      {
        question: "When should you use an Agent instead of a GenServer?",
        options: [
          { label: "When you need periodic background work" },
          { label: "When you only need simple get/update state management with no complex logic", correct: true },
          { label: "When you need to handle multiple message types" },
          { label: "Agents are always better than GenServer" },
        ],
        explanation:
          "Agents are a simplified wrapper for state-only processes. They're perfect when all you need is to store and retrieve state. If you need complex message handling, periodic work, or side effects triggered by state changes, reach for GenServer instead.",
      },
      {
        question: "What is the difference between `Task.await` and `Task.yield`?",
        options: [
          { label: "They are identical" },
          { label: "await blocks and raises on timeout; yield returns nil on timeout without killing the task", correct: true },
          { label: "yield is faster than await" },
          { label: "await works with async_stream; yield does not" },
        ],
        explanation:
          "Task.await blocks and raises an error if the timeout expires. Task.yield also blocks but returns nil on timeout, leaving the task running — you can then decide to wait longer, shut it down, or ignore it. yield gives you more control over timeout handling.",
      },
      {
        question: "What does `Task.Supervisor.start_child/2` return?",
        options: [
          { label: "A %Task{} struct you can await" },
          { label: "{:ok, pid} — a fire-and-forget supervised task", correct: true },
          { label: "The result of the function" },
          { label: "A reference to the supervisor" },
        ],
        explanation:
          "start_child spawns a fire-and-forget task under the supervisor. It returns {:ok, pid} but you can't await the result. For awaitable supervised tasks, use Task.Supervisor.async or async_nolink instead.",
      },
      {
        question: "You have an Agent holding a large map, and many processes frequently call `Agent.get/2` to read it. What is the primary bottleneck concern?",
        options: [
          { label: "The map will be garbage collected too often" },
          { label: "All reads are serialized through the Agent's single process mailbox, creating a bottleneck", correct: true },
          { label: "Agent.get copies the BEAM VM, not the data" },
          { label: "Concurrent reads will cause race conditions and corrupt the map" },
        ],
        explanation:
          "An Agent is a single process, so every get and update call is handled sequentially via its mailbox. Under high read load, this serialization becomes a bottleneck. For read-heavy workloads, ETS tables are a better choice because they allow concurrent reads from multiple processes without serialization.",
      },
      {
        question: "What is the default timeout for `Task.await/2` if you don't specify one?",
        options: [
          { label: "1 second" },
          { label: "5 seconds", correct: true },
          { label: "10 seconds" },
          { label: "It waits indefinitely" },
        ],
        explanation:
          "Task.await/2 defaults to a 5-second (5000ms) timeout. If the task hasn't completed within that window, it raises an error and exits. You can override this by passing a custom timeout as the second argument, e.g., Task.await(task, 30_000) for 30 seconds.",
      },
      {
        question: "What is the key advantage of `Task.Supervisor.async_nolink/2` over `Task.Supervisor.async/2`?",
        options: [
          { label: "It runs the task on a different node in a cluster" },
          { label: "It is faster because it skips process setup" },
          { label: "The calling process won't crash if the task crashes, because they are not linked", correct: true },
          { label: "It allows the task to run after the supervisor shuts down" },
        ],
        explanation:
          "async_nolink spawns the task without linking it to the caller. This means if the task raises an exception or crashes, the caller remains unaffected. You then use Task.yield or Task.yield_many to check for results, handling {:exit, reason} for failures instead of crashing.",
      },
      {
        question: "In GenStage, what does 'demand-driven' mean?",
        options: [
          { label: "Producers push as much data as they can to consumers" },
          { label: "Consumers request a specific number of events from producers, controlling the flow rate", correct: true },
          { label: "The BEAM scheduler decides how many events to process" },
          { label: "Events are only produced when the system has free memory" },
        ],
        explanation:
          "In GenStage's demand-driven model, consumers tell producers how many events they want (demand). Producers only emit up to that number. This pull-based approach provides natural back-pressure: if a consumer is slow, it requests fewer events, automatically slowing the producer without buffering or dropping data.",
      },
      {
        question: "Which ETS table type allows multiple processes to read concurrently without locking, while writes are still serialized?",
        options: [
          { label: ":set" },
          { label: ":bag" },
          { label: ":read_concurrency (table option)", correct: true },
          { label: ":ordered_set" },
        ],
        explanation:
          "The :read_concurrency option (passed when creating a table via :ets.new/2) optimizes a table for concurrent reads. Under the hood, it uses read-optimized locking that allows many processes to read simultaneously. This comes at a small cost to write performance, so it's best suited for read-heavy, write-infrequent tables.",
      },
      {
        question: "What happens if you call `Task.await/2` on the same task twice?",
        options: [
          { label: "It returns the cached result from the first call" },
          { label: "It raises an error because the task's reply has already been received", correct: true },
          { label: "It blocks indefinitely waiting for a second message" },
          { label: "It spawns a new task with the same function" },
        ],
        explanation:
          "Task.await receives a specific message from the task process. Once that message has been consumed from the caller's mailbox on the first await call, it's gone. A second await call will fail because the expected message no longer exists. Tasks are single-use: one computation, one result, one await.",
      },
      {
        question: "In a fan-out/fan-in pattern using `Task.yield_many/2`, what does a `nil` result for a task indicate?",
        options: [
          { label: "The task returned nil as its result" },
          { label: "The task crashed with no error message" },
          { label: "The task did not complete within the given timeout", correct: true },
          { label: "The task was never started" },
        ],
        explanation:
          "Task.yield_many returns nil for tasks that haven't completed within the timeout. This is distinct from {:ok, result} (success) and {:exit, reason} (crash). After receiving nil, you should typically call Task.shutdown/2 to terminate the timed-out task and prevent it from leaking as an orphaned process.",
      },
      {
        question: "Why is using an Agent to coordinate work between many processes considered an anti-pattern compared to ETS?",
        options: [
          { label: "Agents use more memory than ETS" },
          { label: "The Agent process becomes a serialization point since all operations go through its single mailbox, while ETS supports concurrent access", correct: true },
          { label: "Agents cannot store large amounts of data" },
          { label: "ETS provides automatic persistence to disk" },
        ],
        explanation:
          "When many processes read from or write to an Agent, every operation queues in its mailbox and executes sequentially. ETS tables, in contrast, live in shared memory outside any single process. With :read_concurrency, multiple processes can read in parallel, and :write_concurrency allows concurrent writes to different keys, making ETS far better suited for high-contention shared state.",
      },
      {
        question: "What back-pressure mechanism does `Task.async_stream/3` use internally?",
        options: [
          { label: "It monitors system memory and pauses when usage is high" },
          { label: "It buffers all results and flushes them in batches" },
          { label: "It limits the number of concurrent tasks and only starts a new one when a running task completes", correct: true },
          { label: "It sends a :slow_down message to the calling process" },
        ],
        explanation:
          "Task.async_stream enforces back-pressure by maintaining a window of at most max_concurrency running tasks. When a task finishes and its result is consumed from the stream, a new task is started for the next item. This means the producer (the enumerable) is only consumed as fast as the consumer processes results.",
      },
      {
        question: "You spawn 3 tasks with `Task.async` and then call `Task.yield_many(tasks, 5000)`. Task 2 crashes after 1 second. What do you receive in the results for task 2?",
        options: [
          { label: "nil, because the task is no longer running" },
          { label: "{:ok, {:error, reason}}" },
          { label: "The caller crashes before yield_many returns" },
          { label: "{:exit, reason} containing the crash reason", correct: true },
        ],
        explanation:
          "This is a subtle point: Task.async creates a linked task, so normally a crash would take down the caller. However, Task.yield_many traps the exit signal internally and reports it as {:exit, reason}. If you weren't using yield_many (or yield), the link would indeed crash the caller. The yield functions handle this case gracefully by catching the exit.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Parallel Map",
        difficulty: "beginner",
        prompt:
          "Write a function `parallel_map/2` that takes a list and a function, runs the function on each element concurrently using `Task.async`, and returns the results in the same order. Then write a version using `Task.async_stream` with a max concurrency of 4.",
        hints: [
          { text: "Map over the list to create tasks with `Task.async`, then map again with `Task.await`." },
          { text: "For the stream version, pipe through `Task.async_stream` and then `Enum.map` to unwrap the {:ok, result} tuples." },
          { text: "`Task.await_many/1` can await a list of tasks all at once." },
        ],
        solution: `defmodule ParallelMap do
  # Version 1: Task.async + Task.await_many
  def parallel_map(list, fun) do
    list
    |> Enum.map(fn item -> Task.async(fn -> fun.(item) end) end)
    |> Task.await_many()
  end

  # Version 2: Task.async_stream (with backpressure)
  def parallel_map_stream(list, fun) do
    list
    |> Task.async_stream(fun, max_concurrency: 4)
    |> Enum.map(fn {:ok, result} -> result end)
  end
end

# Usage
ParallelMap.parallel_map([1, 2, 3, 4, 5], fn x ->
  Process.sleep(100)  # simulate slow work
  x * 10
end)
# => [10, 20, 30, 40, 50]  (completes in ~100ms, not ~500ms)`,
        walkthrough: [
          "Version 1 spawns a task for every element simultaneously. `Task.await_many/1` waits for all of them and returns results in order.",
          "This is simple but spawns ALL tasks at once — with 10,000 items, you'd have 10,000 concurrent processes.",
          "Version 2 uses `Task.async_stream` which limits concurrency to 4 at a time. This provides backpressure and is safer for large lists.",
          "The stream version wraps each result in `{:ok, result}`, so we unwrap with `Enum.map`.",
          "Both versions preserve the order of results matching the input list.",
        ],
      },
      {
        title: "Agent-Backed Cache with TTL",
        difficulty: "intermediate",
        prompt:
          "Build a cache module using an Agent that supports:\n- `put(key, value, ttl_seconds)` — stores a value with an expiration time\n- `get(key)` — returns `{:ok, value}` if the key exists and hasn't expired, or `:error` if missing/expired\n- `delete(key)` — removes a key\n- `size()` — returns the number of non-expired entries\n\nStore each entry as `{value, expires_at}` where `expires_at` is a monotonic timestamp.",
        hints: [
          { text: "Use `System.monotonic_time(:second)` for timestamps — it's immune to clock adjustments." },
          { text: "Store state as a map of `key => {value, expires_at}` tuples." },
          { text: "In `get`, compare the current time against the stored expiry. If expired, delete the entry and return :error." },
        ],
        solution: `defmodule TTLCache do
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def put(key, value, ttl_seconds) do
    expires_at = System.monotonic_time(:second) + ttl_seconds

    Agent.update(__MODULE__, fn state ->
      Map.put(state, key, {value, expires_at})
    end)
  end

  def get(key) do
    Agent.get_and_update(__MODULE__, fn state ->
      case Map.get(state, key) do
        nil ->
          {:error, state}

        {value, expires_at} ->
          if System.monotonic_time(:second) < expires_at do
            {{:ok, value}, state}
          else
            {:error, Map.delete(state, key)}
          end
      end
    end)
  end

  def delete(key) do
    Agent.update(__MODULE__, &Map.delete(&1, key))
  end

  def size do
    now = System.monotonic_time(:second)

    Agent.get(__MODULE__, fn state ->
      state
      |> Enum.count(fn {_key, {_val, exp}} -> exp > now end)
    end)
  end
end

# Usage
TTLCache.start_link()
TTLCache.put("session", "abc123", 60)
TTLCache.get("session")  # => {:ok, "abc123"}
TTLCache.size()           # => 1`,
        walkthrough: [
          "We use a named Agent so any process can access the cache by module name.",
          "`put` stores the value alongside an expiration timestamp calculated from the current monotonic time plus TTL.",
          "`get` uses `Agent.get_and_update` because when we find an expired entry, we want to both return :error AND delete the stale entry atomically.",
          "The `size` function counts only entries whose expiration is still in the future — expired entries aren't counted even if they haven't been cleaned up yet.",
          "Using monotonic time instead of wall clock time ensures the cache works correctly even if the system clock is adjusted.",
        ],
      },
      {
        title: "Resilient Multi-Source Fetcher",
        difficulty: "advanced",
        prompt:
          "Build a module that fetches data from multiple sources concurrently with these requirements:\n- Accept a list of `{name, fetch_fun, timeout_ms}` tuples\n- Run all fetch functions concurrently under a Task.Supervisor\n- Each source has its own timeout\n- Return `%{name => {:ok, result} | {:error, reason} | {:timeout, :timed_out}}` for all sources\n- If a source crashes, catch it as `{:error, reason}` — don't crash the caller\n- Add a global timeout: if all sources haven't responded within the global timeout, shut down remaining tasks\n\nUse `Task.Supervisor.async_nolink` and `Task.yield_many`.",
        hints: [
          { text: "Start a Task.Supervisor in your module or accept one as a parameter." },
          { text: "Spawn all tasks with `async_nolink`, then use `Task.yield_many/2` with the global timeout." },
          { text: "After yield_many, iterate results: {:ok, result} for success, {:exit, reason} for crashes, nil for timeouts. Shut down any that timed out." },
        ],
        solution: `defmodule MultiFetcher do
  def fetch_all(sources, supervisor, global_timeout \\\\ 10_000) do
    # Spawn all tasks under the supervisor (nolink = won't crash caller)
    task_source_pairs =
      Enum.map(sources, fn {name, fun, _timeout} ->
        task = Task.Supervisor.async_nolink(supervisor, fun)
        {task, name}
      end)

    tasks = Enum.map(task_source_pairs, fn {task, _name} -> task end)

    # Wait for all with global timeout
    results = Task.yield_many(tasks, global_timeout)

    # Build result map
    Enum.zip(task_source_pairs, results)
    |> Enum.into(%{}, fn {{_task, name}, {task, result}} ->
      status =
        case result do
          {:ok, value} ->
            {:ok, value}

          {:exit, reason} ->
            {:error, reason}

          nil ->
            Task.shutdown(task, :brutal_kill)
            {:timeout, :timed_out}
        end

      {name, status}
    end)
  end
end

# Usage
sources = [
  {:database, fn -> Process.sleep(100); "db_data" end, 2000},
  {:api, fn -> Process.sleep(200); "api_data" end, 5000},
  {:slow, fn -> Process.sleep(15_000); "never" end, 3000}
]

{:ok, sup} = Task.Supervisor.start_link()
MultiFetcher.fetch_all(sources, sup, 5000)
# => %{
#   database: {:ok, "db_data"},
#   api: {:ok, "api_data"},
#   slow: {:timeout, :timed_out}
# }`,
        walkthrough: [
          "We spawn all tasks with `async_nolink` so a crashing task won't take down the caller process.",
          "We pair each task with its source name so we can build a named result map later.",
          "`Task.yield_many/2` waits up to the global timeout for all tasks to complete. It returns a list of `{task, result}` tuples.",
          "For each result: `{:ok, value}` means the task completed successfully, `{:exit, reason}` means it crashed, and `nil` means it timed out.",
          "Timed-out tasks are shut down with `Task.shutdown(task, :brutal_kill)` to avoid leaked processes.",
          "The result is a clean map where each source name maps to a tagged status tuple — easy to pattern match on in the calling code.",
        ],
      },
    ],
  },
};

export default concurrencyPatterns;
