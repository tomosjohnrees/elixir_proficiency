import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What's the difference between GenServer.call and GenServer.cast?",
    options: [
      { label: "call is for reads, cast is for writes" },
      { label: "call is synchronous (waits for reply), cast is asynchronous (fire-and-forget)", correct: true },
      { label: "call can modify state, cast cannot" },
      { label: "call is faster than cast" },
    ],
    explanation:
      "call blocks the caller until the server sends a reply. cast returns immediately without waiting. Both can modify state. The choice depends on whether the caller needs a response, not on whether the operation reads or writes.",
  },
  {
    question: "What must handle_call return?",
    options: [
      { label: "{:ok, new_state}" },
      { label: "{:noreply, new_state}" },
      { label: "{:reply, response, new_state}", correct: true },
      { label: "The response value directly" },
    ],
    explanation:
      "handle_call must return {:reply, response, new_state} so GenServer knows what to send back to the caller and what the new state should be. It can also return {:noreply, new_state} if you want to reply later manually, but {:reply, ...} is the standard pattern.",
  },
  {
    question: "When is handle_info called?",
    options: [
      { label: "When GenServer.call is used" },
      { label: "When GenServer.cast is used" },
      { label: "When the server receives a message not sent via call or cast", correct: true },
      { label: "Only when an error occurs" },
    ],
    explanation:
      "handle_info handles all messages that aren't routed through GenServer.call or GenServer.cast. This includes messages from Process.send_after, :DOWN messages from monitors, {:EXIT, ...} from links, and plain send. It's the catch-all for non-GenServer messages.",
  },
  {
    question: "What does `@impl true` do above a callback?",
    options: [
      { label: "Makes the function public" },
      { label: "Tells the compiler this implements a behaviour callback, enabling warnings for typos", correct: true },
      { label: "Makes the function run faster" },
      { label: "It's required — GenServer won't work without it" },
    ],
    explanation:
      "@impl true is an annotation that tells the compiler \"this function implements a callback from a behaviour.\" If you misspell the function name or get the arity wrong, the compiler warns you. It's not strictly required but is strongly recommended — it catches bugs at compile time.",
  },
  {
    question: "What's the default timeout for GenServer.call?",
    options: [
      { label: "1 second" },
      { label: "5 seconds", correct: true },
      { label: "30 seconds" },
      { label: "No timeout — it waits forever" },
    ],
    explanation:
      "GenServer.call has a default timeout of 5 seconds (5000ms). If the server doesn't reply within that time, the caller crashes with a timeout error. You can customize it: GenServer.call(pid, msg, 10_000) for 10 seconds, or :infinity to wait forever (not recommended).",
  },
  {
    question: "A GenServer's handle_call/3 returns {:noreply, new_state} instead of {:reply, response, new_state}. What happens to the caller?",
    options: [
      { label: "The caller immediately receives nil" },
      { label: "The caller blocks until it times out (default 5 seconds) unless GenServer.reply/2 is used", correct: true },
      { label: "The caller receives {:error, :no_reply}" },
      { label: "The GenServer crashes because {:noreply, ...} is invalid for handle_call" },
    ],
    explanation:
      "Returning {:noreply, new_state} from handle_call is legal but means the server does not automatically send a response. The caller remains blocked waiting. You must eventually call GenServer.reply(from, response) using the `from` argument, or the caller will time out after 5 seconds and crash. This pattern is useful for deferring replies to a later point.",
  },
  {
    question: "You have a GenServer that performs an expensive database query inside handle_call. Many clients call it simultaneously. What problem does this create?",
    options: [
      { label: "The database will run out of connections" },
      { label: "The GenServer becomes a bottleneck because it processes messages sequentially, making all callers wait in line", correct: true },
      { label: "The BEAM scheduler will crash from too many concurrent calls" },
      { label: "Each call spawns a new process, causing memory issues" },
    ],
    explanation:
      "A GenServer processes its mailbox one message at a time. If handle_call does expensive work, every subsequent caller blocks waiting for the previous call to finish. This makes the GenServer a serial bottleneck. The solution is to offload expensive work to a Task or pool of workers and use GenServer.reply/2 to respond asynchronously.",
  },
  {
    question: "What does returning {:stop, :normal, reply, new_state} from handle_call do?",
    options: [
      { label: "Sends the reply to the caller and then stops the GenServer gracefully", correct: true },
      { label: "Stops the GenServer immediately without sending a reply" },
      { label: "Raises a :normal exception in the caller process" },
      { label: "Restarts the GenServer with new_state as the initial state" },
    ],
    explanation:
      "The 4-element {:stop, reason, reply, new_state} tuple is a special return from handle_call that sends the reply to the caller AND then initiates a shutdown. The terminate/2 callback runs with the given reason and state. With reason :normal, the process exits gracefully without triggering supervisor restarts.",
  },
  {
    question: "Which approach correctly implements a GenServer that responds to a call after finishing an async task?",
    options: [
      { label: "Return {:reply, Task.async(fn -> ... end), state}" },
      { label: "Store `from` in state, return {:noreply, state}, then call GenServer.reply(from, result) when the work completes", correct: true },
      { label: "Use handle_cast instead to avoid blocking" },
      { label: "Set the timeout to :infinity so the caller waits forever" },
    ],
    explanation:
      "The correct pattern is to save the `from` reference (the second argument to handle_call) in your state, return {:noreply, state} to release the callback, and later call GenServer.reply(from, result) when the async work finishes. This keeps the GenServer free to process other messages while the caller waits only for the actual result.",
  },
  {
    question: "What happens if a GenServer does NOT implement a catch-all handle_info/2 clause and receives an unexpected message?",
    options: [
      { label: "The message is silently discarded" },
      { label: "The GenServer logs a warning but continues running" },
      { label: "In Elixir 1.17+, a default implementation logs a warning; in older versions, the GenServer crashes with a function clause error", correct: true },
      { label: "The message stays in the mailbox forever" },
    ],
    explanation:
      "Since Elixir 1.17, `use GenServer` injects a default handle_info/2 that logs an :error-level message for unhandled messages. In older versions, a missing clause would cause a function clause error and crash the process. It is still best practice to define your own catch-all clause that logs unexpected messages at a level you control.",
  },
  {
    question: "You register a GenServer with `name: MyApp.Cache`. What happens if you call `GenServer.start_link(MyApp.Cache, [], name: MyApp.Cache)` a second time?",
    options: [
      { label: "A second process starts with the same name" },
      { label: "The first process is killed and replaced" },
      { label: "start_link returns {:error, {:already_started, pid}}", correct: true },
      { label: "The name is automatically incremented to MyApp.Cache_2" },
    ],
    explanation:
      "Process names in Elixir are unique. If a process is already registered under a given name, start_link returns {:error, {:already_started, pid}} where pid is the existing process. This prevents duplicate GenServers and is especially important when supervisors restart child processes.",
  },
  {
    question: "A handle_cast callback accidentally raises an exception. What happens?",
    options: [
      { label: "The exception is silently swallowed and the GenServer continues" },
      { label: "The GenServer process crashes, terminate/2 is called, and the supervisor may restart it", correct: true },
      { label: "The cast is retried automatically up to 3 times" },
      { label: "The error is sent back to the process that called GenServer.cast" },
    ],
    explanation:
      "If any callback raises an exception, the GenServer process crashes. Before exiting, terminate/2 is called (if defined) with the error reason. Since cast is fire-and-forget, the sending process has no idea the crash occurred. If the GenServer is under a supervisor, it will be restarted according to the supervisor's strategy.",
  },
  {
    question: "You return {:noreply, state, 5000} from handle_cast. What does the 5000 mean?",
    options: [
      { label: "The GenServer will shut down after 5 seconds" },
      { label: "The next cast will be rate-limited for 5 seconds" },
      { label: "If no message arrives within 5 seconds, handle_info(:timeout, state) is called", correct: true },
      { label: "The state is persisted to disk every 5 seconds" },
    ],
    explanation:
      "Adding a timeout integer as the last element of the return tuple (e.g., {:noreply, state, 5000}) tells the GenServer to trigger a :timeout message via handle_info if no other message arrives within that time. This is useful for implementing idle timeouts, lazy cleanup, or hibernation. The timeout resets every time any message is received.",
  },
  {
    question: "Why is it considered a best practice to wrap GenServer.call/cast inside public client functions in the same module?",
    options: [
      { label: "It makes the GenServer run faster due to compiler optimizations" },
      { label: "It hides the message protocol, provides a clean API, and allows changing the internal message format without breaking callers", correct: true },
      { label: "GenServer.call and GenServer.cast only work when called from the same module" },
      { label: "It's required by the GenServer behaviour — the code won't compile otherwise" },
    ],
    explanation:
      "Wrapping calls in client functions (like `def get(pid), do: GenServer.call(pid, :get)`) decouples callers from the internal message format. If you later change the message from :get to {:get, :all}, you only update the client function and the matching callback. Callers never need to know the internal protocol, which is a key principle of the client-server architecture in GenServer modules.",
  },
  {
    question: "A GenServer stores a large list in its state and frequently processes GenServer.call requests that scan the entire list. The system starts showing high latency. What is the most appropriate fix?",
    options: [
      { label: "Switch all calls to casts so the caller doesn't block" },
      { label: "Use :infinity timeout so callers never time out" },
      { label: "Move the data to ETS so reads can happen concurrently without going through the GenServer's sequential mailbox", correct: true },
      { label: "Increase the GenServer's process priority with Process.flag(:priority, :high)" },
    ],
    explanation:
      "When a GenServer becomes a bottleneck due to sequential message processing, moving read-heavy data into ETS (Erlang Term Storage) is a proven solution. ETS tables allow concurrent reads from any process without serializing through the GenServer. The GenServer can still manage writes to ETS while reads bypass it entirely, dramatically reducing contention and latency.",
  },
  {
    question: "What is the purpose of `handle_continue/2` in a GenServer?",
    options: [
      { label: "It handles messages when the GenServer resumes from hibernation" },
      { label: "It runs immediately after init/1 (or other callbacks) without processing any intervening messages from the mailbox", correct: true },
      { label: "It replaces handle_info for timer-based messages" },
      { label: "It retries a failed handle_call automatically" },
    ],
    explanation:
      "handle_continue/2 is triggered by returning {:ok, state, {:continue, term}} from init/1 or {:noreply, state, {:continue, term}} from other callbacks. It runs before any other messages in the mailbox are processed, making it ideal for post-initialization work that shouldn't be delayed by queued messages. This solves the common problem of doing expensive setup in init/1, which blocks the process that called start_link.",
  },
  {
    question: "When is `terminate/2` guaranteed to be called in a GenServer?",
    options: [
      { label: "Always, whenever the GenServer stops for any reason" },
      { label: "Only when the GenServer is trapping exits and stops due to a normal or controlled shutdown — not guaranteed on brutal kills", correct: true },
      { label: "Only when GenServer.stop/1 is called explicitly" },
      { label: "It's never called automatically — you must invoke it manually" },
    ],
    explanation:
      "terminate/2 is called when the GenServer is shutting down cleanly (normal exit, :shutdown, or trapped exit signals). However, it is NOT called if the process is killed with Process.exit(pid, :kill), if the process crashes and isn't trapping exits, or if the system is shut down abruptly. Never rely on terminate for critical cleanup — use external mechanisms like monitors or database transactions instead.",
  },
  {
    question: "What are the valid return values from `init/1` in a GenServer?",
    options: [
      { label: "Only {:ok, state}" },
      { label: "{:ok, state}, {:ok, state, {:continue, term}}, :ignore, or {:stop, reason}", correct: true },
      { label: "{:ok, state} or {:error, reason}" },
      { label: "Any value — it becomes the initial state" },
    ],
    explanation:
      "init/1 can return {:ok, state} to start normally, {:ok, state, {:continue, term}} to start and immediately trigger handle_continue, :ignore to silently not start (the supervisor treats this as a successful start with no process), or {:stop, reason} to abort startup. Notably, {:error, reason} is NOT a valid return — use {:stop, reason} instead to signal failure.",
  },
  {
    question: "What happens when you return `{:noreply, state, :hibernate}` from a GenServer callback?",
    options: [
      { label: "The GenServer shuts down after a period of inactivity" },
      { label: "The GenServer's process performs a full garbage collection and enters a low-memory state until the next message arrives", correct: true },
      { label: "The GenServer pauses for a default 5-second sleep" },
      { label: "The GenServer saves its state to disk for crash recovery" },
    ],
    explanation:
      "Returning :hibernate as the last element of a callback's return tuple tells the BEAM to garbage collect the process and reduce its memory footprint until a new message arrives. When a message comes in, the process wakes up and resumes normally. This is useful for GenServers that handle bursts of traffic followed by long idle periods, trading a small CPU cost on wakeup for significant memory savings during hibernation.",
  },
  {
    question: "What is the difference between `GenServer.stop/3` and `Process.exit/2` for terminating a GenServer?",
    options: [
      { label: "There is no difference — both terminate the process immediately" },
      { label: "GenServer.stop sends a synchronous stop request that triggers terminate/2; Process.exit sends an asynchronous signal that may not trigger terminate/2", correct: true },
      { label: "GenServer.stop works locally only; Process.exit works across nodes" },
      { label: "Process.exit is deprecated in favor of GenServer.stop" },
    ],
    explanation:
      "GenServer.stop/3 is the clean way to shut down a GenServer — it sends a synchronous message, waits for the server to call terminate/2 with the given reason, and returns :ok. Process.exit/2 sends an asynchronous exit signal. If the GenServer is trapping exits, it receives the signal in handle_info and can decide what to do. If not trapping exits, the process dies without calling terminate/2 (unless the reason is :normal or :shutdown).",
  },
];

export default questions;
