import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
];

export default questions;
