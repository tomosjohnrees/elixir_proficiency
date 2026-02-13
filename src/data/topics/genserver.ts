import type { TopicContent } from "@/lib/types";
import Animation07GenServerCallCast from "@/components/animations/Animation07GenServerCallCast";

const genserver: TopicContent = {
  meta: {
    slug: "genserver",
    title: "GenServer",
    description: "Generic servers, callbacks, and state management",
    number: 11,
    active: true,
  },

  eli5: {
    analogyTitle: "The Hotel Front Desk",
    analogy:
      "Imagine a hotel with a single front desk clerk who handles all guest requests. Guests walk up and either wait for an answer (\"What room am I in?\") or drop off a note and leave (\"Please send fresh towels to room 42\"). The clerk processes one request at a time, keeps track of room assignments, and follows a standard procedure manual. GenServer is that clerk — a process that follows a well-defined set of procedures for handling requests and maintaining state.",
    items: [
      { label: "GenServer", description: "The front desk clerk. A process that follows standard procedures (callbacks) for handling requests, maintaining state, and responding to guests." },
      { label: "handle_call", description: "A guest waiting at the desk for an answer. The clerk reads the request, updates any records, and gives back a response. The guest waits until they get their answer." },
      { label: "handle_cast", description: "A guest who drops off a note and walks away. The clerk processes it later. No response is sent back — the guest doesn't wait." },
      { label: "handle_info", description: "Something unexpected lands on the desk — a phone call, a timer alarm, a message from another department. The clerk handles it using the same procedure manual." },
    ],
    keyTakeaways: [
      "GenServer is a behaviour that standardizes the receive-loop-with-state pattern you built in the Processes topic.",
      "call is synchronous (the caller waits for a reply). cast is asynchronous (fire-and-forget). Both are processed one at a time.",
      "The state is just the second element in the return tuple. {:reply, response, new_state} for calls, {:noreply, new_state} for casts.",
      "handle_info catches all other messages — timers, monitors, :DOWN signals, or any raw send.",
      "GenServer handles boilerplate like timeouts, error handling, and debugging for you. Always use it instead of raw receive loops.",
    ],
  },

  visuals: {
    animation: Animation07GenServerCallCast,
    animationDuration: 14,
    dataTypes: [
      { name: "GenServer.call", color: "#6b46c1", examples: ["GenServer.call(pid, :get)", "→ handle_call(:get, from, state)", "→ {:reply, answer, state}"], description: "Synchronous request. The caller blocks until the server replies. Use for queries and operations where you need confirmation." },
      { name: "GenServer.cast", color: "#2563eb", examples: ["GenServer.cast(pid, {:put, k, v})", "→ handle_cast({:put, k, v}, state)", "→ {:noreply, new_state}"], description: "Asynchronous request. Fire-and-forget. Use for commands where you don't need a response." },
      { name: "handle_info", color: "#d97706", examples: ["send(pid, :tick)", "→ handle_info(:tick, state)", "→ {:noreply, new_state}"], description: "Handles raw messages — timers, monitors, Process.send_after, or plain send. Catches everything not routed through call/cast." },
      { name: "init/1", color: "#059669", examples: ["GenServer.start_link(Mod, arg)", "→ init(arg)", "→ {:ok, initial_state}"], description: "Called once when the server starts. Sets up the initial state. Runs in the new process, not the caller." },
    ],
    operatorGroups: [
      {
        name: "Client API",
        operators: [
          { symbol: "start_link", description: "Start a GenServer linked to the caller" },
          { symbol: "start", description: "Start a GenServer without a link" },
          { symbol: "call", description: "Send synchronous request, wait for reply" },
          { symbol: "cast", description: "Send asynchronous request, no reply" },
          { symbol: "stop", description: "Gracefully stop the server" },
        ],
      },
      {
        name: "Server Callbacks",
        operators: [
          { symbol: "init/1", description: "Initialize state when server starts" },
          { symbol: "handle_call/3", description: "Handle synchronous requests" },
          { symbol: "handle_cast/2", description: "Handle asynchronous requests" },
          { symbol: "handle_info/2", description: "Handle all other messages" },
          { symbol: "terminate/2", description: "Cleanup before server stops" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "From Raw Process to GenServer",
        prose: [
          "In the Processes topic, you built a key-value store with a hand-rolled receive loop. GenServer gives you that same pattern — but with standardized callbacks, built-in error handling, timeout support, and debugging tools. It's the foundation of almost every stateful process in Elixir.",
          "use GenServer injects default implementations of all callbacks into your module. You then override only the callbacks you need. The module becomes both the client API (functions you call from outside) and the server implementation (callbacks that handle requests).",
          "The convention is to put client functions at the top of the module and server callbacks at the bottom. Client functions call GenServer.call or GenServer.cast. Callbacks pattern-match on the messages and return tuples that tell GenServer what to do.",
        ],
        code: {
          title: "Basic GenServer structure",
          code: `defmodule Counter do
  use GenServer

  # --- Client API ---

  def start_link(initial \\\\ 0) do
    GenServer.start_link(__MODULE__, initial)
  end

  def increment(pid), do: GenServer.cast(pid, :increment)
  def decrement(pid), do: GenServer.cast(pid, :decrement)
  def value(pid), do: GenServer.call(pid, :value)

  # --- Server Callbacks ---

  @impl true
  def init(initial) do
    {:ok, initial}
  end

  @impl true
  def handle_cast(:increment, count), do: {:noreply, count + 1}
  def handle_cast(:decrement, count), do: {:noreply, count - 1}

  @impl true
  def handle_call(:value, _from, count) do
    {:reply, count, count}
  end
end

{:ok, pid} = Counter.start_link(0)
Counter.increment(pid)
Counter.increment(pid)
Counter.increment(pid)
Counter.value(pid)  # => 3`,
          output: "3",
        },
      },
      {
        title: "call vs cast — Choosing the Right One",
        prose: [
          "call is synchronous — the caller blocks until the server processes the request and sends a reply. Use it when you need a return value (queries) or when you need confirmation that the operation succeeded. The default timeout is 5 seconds.",
          "cast is asynchronous — the caller sends the message and continues immediately without waiting. Use it for fire-and-forget commands where you don't need a response. Be careful: if the cast fails silently, you won't know.",
          "A good rule of thumb: prefer call when in doubt. It's safer because the caller knows the operation completed. Use cast only when you're confident the operation will succeed and the caller genuinely doesn't need to wait.",
        ],
        code: {
          title: "call vs cast in practice",
          code: `defmodule Stack do
  use GenServer

  def start_link(initial \\\\ []) do
    GenServer.start_link(__MODULE__, initial)
  end

  # call — caller needs the popped value
  def pop(pid), do: GenServer.call(pid, :pop)

  # cast — caller doesn't need to wait
  def push(pid, value), do: GenServer.cast(pid, {:push, value})

  # call — need confirmation of current state
  def peek(pid), do: GenServer.call(pid, :peek)

  @impl true
  def init(stack), do: {:ok, stack}

  @impl true
  def handle_call(:pop, _from, [top | rest]) do
    {:reply, {:ok, top}, rest}
  end
  def handle_call(:pop, _from, []) do
    {:reply, {:error, :empty}, []}
  end
  def handle_call(:peek, _from, [top | _] = stack) do
    {:reply, {:ok, top}, stack}
  end
  def handle_call(:peek, _from, []) do
    {:reply, {:error, :empty}, []}
  end

  @impl true
  def handle_cast({:push, value}, stack) do
    {:noreply, [value | stack]}
  end
end

{:ok, pid} = Stack.start_link()
Stack.push(pid, 1)
Stack.push(pid, 2)
Stack.push(pid, 3)
Stack.pop(pid)   # => {:ok, 3}
Stack.peek(pid)  # => {:ok, 2}`,
          output: "{:ok, 2}",
        },
      },
      {
        title: "handle_info — Handling Other Messages",
        prose: [
          "handle_info catches all messages that aren't routed through call or cast. This includes messages from Process.send_after (for timers), :DOWN messages from monitors, {:EXIT, pid, reason} from linked processes (when trapping exits), and any plain send.",
          "A common pattern is a self-ticking GenServer that schedules periodic work. In init, you send the first tick with Process.send_after, and in handle_info you do the work and schedule the next tick.",
          "Always include a catch-all handle_info clause to avoid crashing on unexpected messages. Log the unexpected message for debugging.",
        ],
        code: {
          title: "Periodic work with handle_info",
          code: `defmodule Poller do
  use GenServer

  def start_link(interval) do
    GenServer.start_link(__MODULE__, interval)
  end

  def get_count(pid), do: GenServer.call(pid, :get_count)

  @impl true
  def init(interval) do
    # Schedule the first tick
    Process.send_after(self(), :tick, interval)
    {:ok, %{interval: interval, count: 0}}
  end

  @impl true
  def handle_info(:tick, state) do
    new_count = state.count + 1
    IO.puts("Tick #\#{new_count}")

    # Schedule the next tick
    Process.send_after(self(), :tick, state.interval)
    {:noreply, %{state | count: new_count}}
  end

  # Catch-all for unexpected messages
  def handle_info(msg, state) do
    IO.puts("Unexpected message: \#{inspect(msg)}")
    {:noreply, state}
  end

  @impl true
  def handle_call(:get_count, _from, state) do
    {:reply, state.count, state}
  end
end

{:ok, pid} = Poller.start_link(1000)  # tick every second`,
          output: "Tick #1",
        },
      },
      {
        title: "Naming and Registration",
        prose: [
          "Passing PIDs around is fine for simple cases, but it gets tedious. You can register a GenServer with a name so clients can reach it without knowing the PID. Pass the name: option to start_link.",
          "The simplest approach is using the module name itself: GenServer.start_link(__MODULE__, arg, name: __MODULE__). Then clients call GenServer.call(MyModule, :request) using the module name instead of a PID.",
          "For more complex applications, you can use {:via, Registry, {MyRegistry, key}} for dynamic naming, or {:global, name} for cluster-wide registration. But module-name registration covers most use cases.",
        ],
        code: {
          title: "Named GenServers",
          code: `defmodule AppConfig do
  use GenServer

  # Client API uses __MODULE__ as the name
  def start_link(defaults) do
    GenServer.start_link(__MODULE__, defaults, name: __MODULE__)
  end

  def get(key), do: GenServer.call(__MODULE__, {:get, key})
  def put(key, value), do: GenServer.cast(__MODULE__, {:put, key, value})

  # Server callbacks
  @impl true
  def init(defaults), do: {:ok, defaults}

  @impl true
  def handle_call({:get, key}, _from, config) do
    {:reply, Map.get(config, key), config}
  end

  @impl true
  def handle_cast({:put, key, value}, config) do
    {:noreply, Map.put(config, key, value)}
  end
end

AppConfig.start_link(%{env: :dev, port: 4000})
AppConfig.get(:env)   # => :dev
AppConfig.put(:port, 8080)
AppConfig.get(:port)  # => 8080
# No PID needed — the name is the module!`,
          output: "8080",
        },
      },
      {
        title: "Return Values and State Management",
        prose: [
          "GenServer callbacks communicate through return tuples. handle_call must return {:reply, response, new_state}. handle_cast and handle_info return {:noreply, new_state}. The last element is always the new state — even if it didn't change.",
          "You can also return {:stop, reason, state} from any callback to shut down the server. The terminate/2 callback runs before the process exits, giving you a chance to clean up resources.",
          "A key insight: the state can be any Elixir term — a map, a list, a tuple, a struct, or even just an integer. Choose a structure that makes your callbacks clean. Maps are the most common choice because they're easy to update and extend.",
        ],
        code: {
          title: "State patterns and stopping",
          code: `defmodule ChatRoom do
  use GenServer

  def start_link(name) do
    GenServer.start_link(__MODULE__, name)
  end

  def join(room, user), do: GenServer.call(room, {:join, user})
  def leave(room, user), do: GenServer.cast(room, {:leave, user})
  def members(room), do: GenServer.call(room, :members)
  def shutdown(room), do: GenServer.stop(room, :normal)

  @impl true
  def init(name) do
    {:ok, %{name: name, members: MapSet.new()}}
  end

  @impl true
  def handle_call({:join, user}, _from, state) do
    new_members = MapSet.put(state.members, user)
    {:reply, :ok, %{state | members: new_members}}
  end

  def handle_call(:members, _from, state) do
    {:reply, MapSet.to_list(state.members), state}
  end

  @impl true
  def handle_cast({:leave, user}, state) do
    new_members = MapSet.delete(state.members, user)
    {:noreply, %{state | members: new_members}}
  end

  @impl true
  def terminate(reason, state) do
    IO.puts("Room \#{state.name} shutting down: \#{inspect(reason)}")
    :ok
  end
end

{:ok, room} = ChatRoom.start_link("elixir")
ChatRoom.join(room, "José")
ChatRoom.join(room, "Chris")
ChatRoom.members(room)  # => ["Chris", "José"]
ChatRoom.leave(room, "Chris")
ChatRoom.members(room)  # => ["José"]`,
          output: "[\"José\"]",
        },
      },
    ],
  },

  quiz: {
    questions: [
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
    ],
  },

  practice: {
    problems: [
      {
        title: "Temperature Tracker",
        difficulty: "beginner",
        prompt:
          "Build a GenServer that tracks temperature readings. Implement:\n1. start_link/0 — starts with empty readings\n2. record/2 — records a temperature value (cast)\n3. average/1 — returns the average of all readings (call)\n4. reset/1 — clears all readings (cast)\n\nReturn {:error, :no_readings} from average if there are no readings.",
        hints: [
          { text: "Store the readings as a list in the state. Or keep a running sum and count for efficiency." },
          { text: "record is a cast because the caller doesn't need confirmation. average is a call because you need the result." },
          { text: "For the average, check if the list is empty first. Enum.sum/1 and length/1 give you what you need." },
        ],
        solution: `defmodule TemperatureTracker do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, [])
  end

  def record(pid, temp), do: GenServer.cast(pid, {:record, temp})
  def average(pid), do: GenServer.call(pid, :average)
  def reset(pid), do: GenServer.cast(pid, :reset)

  @impl true
  def init(_), do: {:ok, []}

  @impl true
  def handle_cast({:record, temp}, readings) do
    {:noreply, [temp | readings]}
  end

  def handle_cast(:reset, _readings) do
    {:noreply, []}
  end

  @impl true
  def handle_call(:average, _from, []) do
    {:reply, {:error, :no_readings}, []}
  end

  def handle_call(:average, _from, readings) do
    avg = Enum.sum(readings) / length(readings)
    {:reply, {:ok, avg}, readings}
  end
end

{:ok, pid} = TemperatureTracker.start_link()
TemperatureTracker.record(pid, 22.5)
TemperatureTracker.record(pid, 25.0)
TemperatureTracker.record(pid, 23.5)
TemperatureTracker.average(pid)  # => {:ok, 23.666...}
TemperatureTracker.reset(pid)
TemperatureTracker.average(pid)  # => {:error, :no_readings}`,
        walkthrough: [
          "The state is a simple list of readings. New readings are prepended with [temp | readings] — O(1) and perfectly fine since we process all readings for the average anyway.",
          "record and reset are casts because the caller doesn't need confirmation. The caller trusts that the GenServer will process the message.",
          "average uses two handle_call clauses: one for the empty list (returns an error tuple) and one for the non-empty list (computes and returns the average). Pattern matching on the state selects the right clause.",
          "We return {:ok, avg} and {:error, :no_readings} — tagged tuples that the caller can pattern match on. This is idiomatic Elixir error handling.",
        ],
      },
      {
        title: "Rate Limiter",
        difficulty: "intermediate",
        prompt:
          "Build a GenServer-based rate limiter. It should:\n1. start_link/2 — takes max_requests and window_ms (e.g., 5 requests per 10000ms)\n2. check/1 — returns :ok if under the limit, :rate_limited if over\n3. Automatically expire old requests using Process.send_after\n\nThe limiter should track timestamps of recent requests and only count those within the current window.",
        hints: [
          { text: "Store a list of timestamps (using System.monotonic_time(:millisecond)) and the config in the state." },
          { text: "On each check, filter out timestamps older than window_ms, then check if the count is under max_requests." },
          { text: "Use Process.send_after(self(), :cleanup, window_ms) in init to periodically clean stale entries." },
        ],
        solution: `defmodule RateLimiter do
  use GenServer

  def start_link(max_requests, window_ms) do
    GenServer.start_link(__MODULE__, {max_requests, window_ms})
  end

  def check(pid), do: GenServer.call(pid, :check)

  @impl true
  def init({max_requests, window_ms}) do
    schedule_cleanup(window_ms)
    {:ok, %{
      max: max_requests,
      window: window_ms,
      requests: []
    }}
  end

  @impl true
  def handle_call(:check, _from, state) do
    now = System.monotonic_time(:millisecond)
    cutoff = now - state.window

    # Keep only recent requests
    recent = Enum.filter(state.requests, fn t -> t > cutoff end)

    if length(recent) < state.max do
      {:reply, :ok, %{state | requests: [now | recent]}}
    else
      {:reply, :rate_limited, %{state | requests: recent}}
    end
  end

  @impl true
  def handle_info(:cleanup, state) do
    now = System.monotonic_time(:millisecond)
    cutoff = now - state.window
    recent = Enum.filter(state.requests, fn t -> t > cutoff end)
    schedule_cleanup(state.window)
    {:noreply, %{state | requests: recent}}
  end

  defp schedule_cleanup(window_ms) do
    Process.send_after(self(), :cleanup, window_ms)
  end
end

{:ok, limiter} = RateLimiter.start_link(3, 10_000)
RateLimiter.check(limiter)  # => :ok
RateLimiter.check(limiter)  # => :ok
RateLimiter.check(limiter)  # => :ok
RateLimiter.check(limiter)  # => :rate_limited`,
        walkthrough: [
          "The state holds the config (max requests and window size) and a list of timestamps for recent requests.",
          "On each check, we filter out timestamps older than the window, then check if there's room for another request. If yes, we add the current timestamp and return :ok. If not, we return :rate_limited.",
          "Process.send_after schedules a periodic cleanup message. handle_info(:cleanup, ...) removes stale timestamps to prevent memory growth, even when no checks are happening.",
          "System.monotonic_time(:millisecond) gives a steadily increasing time value, ideal for measuring intervals. It avoids issues with system clock adjustments that System.system_time might have.",
          "This is a sliding window rate limiter. In production, you might use ETS for better performance or a token bucket algorithm for smoother rate limiting.",
        ],
      },
      {
        title: "Job Queue",
        difficulty: "advanced",
        prompt:
          "Build a GenServer-based job queue with these features:\n1. start_link/1 — takes a max_concurrency option\n2. enqueue/2 — adds a function to the queue\n3. status/1 — returns a map with :queued and :running counts\n4. Jobs run in spawned processes. When a job finishes, the next queued job starts automatically\n5. Never run more than max_concurrency jobs at once\n\nUse Process.monitor to detect when jobs complete.",
        hints: [
          { text: "State needs: a queue of pending jobs (:queue module works well), a set of running job PIDs/refs, and the max concurrency." },
          { text: "When a job is enqueued, check if there's capacity. If yes, spawn it immediately. If not, add to the queue." },
          { text: "Monitor each spawned job. When you get a :DOWN message in handle_info, remove it from running and try to start the next queued job." },
          { text: "Extract a private maybe_run_next/1 function that checks the queue and capacity, spawning the next job if possible." },
        ],
        solution: `defmodule JobQueue do
  use GenServer

  def start_link(max_concurrency) do
    GenServer.start_link(__MODULE__, max_concurrency)
  end

  def enqueue(pid, func), do: GenServer.cast(pid, {:enqueue, func})
  def status(pid), do: GenServer.call(pid, :status)

  @impl true
  def init(max_concurrency) do
    {:ok, %{
      max: max_concurrency,
      queue: :queue.new(),
      running: %{}
    }}
  end

  @impl true
  def handle_cast({:enqueue, func}, state) do
    new_state = %{state | queue: :queue.in(func, state.queue)}
    {:noreply, maybe_run_next(new_state)}
  end

  @impl true
  def handle_call(:status, _from, state) do
    status = %{
      queued: :queue.len(state.queue),
      running: map_size(state.running)
    }
    {:reply, status, state}
  end

  @impl true
  def handle_info({:DOWN, ref, :process, _pid, _reason}, state) do
    new_running = Map.delete(state.running, ref)
    new_state = %{state | running: new_running}
    {:noreply, maybe_run_next(new_state)}
  end

  defp maybe_run_next(state) do
    has_capacity = map_size(state.running) < state.max
    has_work = not :queue.is_empty(state.queue)

    if has_capacity and has_work do
      {{:value, func}, new_queue} = :queue.out(state.queue)
      pid = spawn(func)
      ref = Process.monitor(pid)
      new_running = Map.put(state.running, ref, pid)
      maybe_run_next(%{state | queue: new_queue, running: new_running})
    else
      state
    end
  end
end

{:ok, q} = JobQueue.start_link(2)

# Enqueue 4 jobs (max 2 concurrent)
for i <- 1..4 do
  JobQueue.enqueue(q, fn ->
    IO.puts("Job \#{i} starting")
    :timer.sleep(1000)
    IO.puts("Job \#{i} done")
  end)
end

JobQueue.status(q)
# => %{queued: 2, running: 2}
# Jobs 1 and 2 start immediately
# Jobs 3 and 4 wait in the queue
# As jobs finish, queued ones start automatically`,
        walkthrough: [
          "The state uses Erlang's :queue module for the pending jobs (efficient FIFO), a map of %{monitor_ref => pid} for running jobs, and the max concurrency limit.",
          "When a job is enqueued, it goes into the queue first. Then maybe_run_next checks if there's capacity and work. If both, it dequeues a job, spawns it, monitors it, and recurses to potentially start more.",
          "The recursion in maybe_run_next is important — if max_concurrency is 3 and 3 slots are free, one enqueue should start up to 3 queued jobs, not just 1.",
          "Process.monitor tracks each running job. When a job process exits (for any reason), handle_info receives :DOWN, removes the job from running, and calls maybe_run_next to backfill from the queue.",
          "This is a simplified version of patterns found in libraries like Oban and Broadway. The key GenServer concepts — cast for enqueue, call for status, handle_info for monitors, and private helpers for internal logic — are exactly how production Elixir code is structured.",
        ],
      },
    ],
  },
};

export default genserver;
