import type { TopicContent } from "@/lib/types";
import Animation03SupervisorStrategies from "@/components/animations/Animation03SupervisorStrategies";

const supervisors: TopicContent = {
  meta: {
    slug: "supervisors",
    title: "Supervisors",
    description: "Supervision trees, strategies, and fault tolerance",
    number: 12,
    active: true,
  },

  eli5: {
    analogyTitle: "The Daycare Manager",
    analogy:
      "Imagine a daycare where a manager watches over a group of children. If a child falls down and scrapes their knee, the manager picks them up, dusts them off, and gets them playing again. The manager doesn't try to prevent every fall — that's impossible. Instead, they're always watching and always ready to help a child recover. Some managers watch each child independently. Others know that certain children are playing together, so if one falls, they reset the whole group.",
    items: [
      { label: "Supervisor", description: "The daycare manager. It doesn't do work itself — it watches over child processes and restarts them when they crash. Its whole job is making sure the children keep running." },
      { label: "Child processes", description: "The children at daycare. Each one is a worker (GenServer, Task, etc.) doing actual work. When they crash, the supervisor restarts them." },
      { label: "Restart strategies", description: "How the manager reacts to a fall. One-for-one: only restart the child that fell. One-for-all: restart everyone if anyone falls. Rest-for-one: restart the fallen child and everyone who started after them." },
      { label: "Let it crash", description: "The core philosophy. Don't try to handle every possible error inside your code. Let things crash, and let a supervisor restart them in a clean state. It's simpler and more reliable." },
    ],
    keyTakeaways: [
      "Supervisors are processes whose only job is to monitor and restart child processes. They don't do business logic.",
      "The \"let it crash\" philosophy means you write clean happy-path code and rely on supervisors for recovery.",
      "one_for_one restarts only the crashed child. one_for_all restarts all children. rest_for_one restarts the crashed child and those started after it.",
      "Supervision trees are hierarchical — supervisors can supervise other supervisors, creating a tree of fault-tolerance.",
      "Every OTP application has a supervision tree. It's the backbone of Elixir's reliability story.",
    ],
  },

  visuals: {
    animation: Animation03SupervisorStrategies,
    animationDuration: 16,
    dataTypes: [
      { name: "one_for_one", color: "#059669", examples: ["[A] [B] [C]", "B crashes →", "[A] [B*] [C]", "(only B restarted)"], description: "Each child is independent. If one crashes, only that child is restarted. The most common strategy." },
      { name: "one_for_all", color: "#e11d48", examples: ["[A] [B] [C]", "B crashes →", "[A*] [B*] [C*]", "(all restarted)"], description: "All children depend on each other. If one crashes, all are terminated and restarted. Use when children share critical state." },
      { name: "rest_for_one", color: "#d97706", examples: ["[A] [B] [C]", "B crashes →", "[A] [B*] [C*]", "(B and later restarted)"], description: "Children have a dependency order. If one crashes, it and all children started after it are restarted." },
      { name: "Supervision Tree", color: "#6b46c1", examples: ["     [App]", "    /     \\", " [Sup1]  [Sup2]", "  / \\      |", "[W1][W2]  [W3]"], description: "Supervisors can supervise other supervisors, forming a tree. Failures propagate up — each level handles what it can." },
    ],
    operatorGroups: [
      {
        name: "Supervisor Options",
        operators: [
          { symbol: "strategy", description: "Restart strategy (:one_for_one, :one_for_all, :rest_for_one)" },
          { symbol: "max_restarts", description: "Max restarts allowed in a time window (default: 3)" },
          { symbol: "max_seconds", description: "Time window for max_restarts (default: 5)" },
        ],
      },
      {
        name: "Child Spec Options",
        operators: [
          { symbol: "id", description: "Unique identifier for the child" },
          { symbol: "start", description: "{Module, :start_link, [args]} — how to start the child" },
          { symbol: "restart", description: ":permanent (always), :temporary (never), :transient (on abnormal)" },
          { symbol: "shutdown", description: "Time to wait for graceful shutdown (ms or :brutal_kill)" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "The \"Let It Crash\" Philosophy",
        prose: [
          "Most languages teach defensive programming: check for every error, handle every edge case, never let things fail. Elixir takes a different approach. Instead of wrapping everything in error handling, you write code for the happy path and let unexpected errors crash the process.",
          "This works because of supervisors. When a process crashes, its supervisor restarts it in a known good state. The restarted process is fresh — no corrupted state, no half-finished operations. It's like rebooting a misbehaving application, but at the microsecond level for individual processes.",
          "This isn't being lazy about error handling. You still handle expected errors (file not found, invalid input). But for unexpected errors — bugs, network blips, corrupted state — crashing and restarting is simpler and more reliable than trying to recover inline.",
        ],
        code: {
          title: "Let it crash in action",
          code: `# BAD: Trying to handle every possible error
defmodule Fragile do
  def fetch_data(url) do
    try do
      case HTTPClient.get(url) do
        {:ok, response} ->
          case Jason.decode(response.body) do
            {:ok, data} -> {:ok, data}
            {:error, _} -> {:error, :invalid_json}
          end
        {:error, _} -> {:error, :request_failed}
      end
    rescue
      _ -> {:error, :unknown}
    end
  end
end

# GOOD: Happy path, let it crash, supervisor restarts
defmodule Resilient do
  use GenServer

  def fetch_data(url) do
    {:ok, response} = HTTPClient.get(url)
    {:ok, data} = Jason.decode(response.body)
    data
  end
end
# If anything fails, the process crashes.
# The supervisor restarts it. Done.`,
          output: "# Supervisor handles the crash",
        },
      },
      {
        title: "Starting a Supervisor",
        prose: [
          "A supervisor needs a list of child specifications — descriptions of the processes it should manage. Each child spec tells the supervisor how to start the process, what to name it, and how to restart it.",
          "The simplest way to define a supervisor is with Supervisor.start_link/2, passing a list of child modules. If the module has a child_spec/1 function (which use GenServer provides automatically), the supervisor can figure out the rest.",
          "For production applications, you'll typically define a supervisor module with the Supervisor behaviour. This gives you an init/1 callback where you declare the children and strategy.",
        ],
        code: {
          title: "Starting supervisors",
          code: `# Simple inline supervisor
children = [
  {Counter, 0},           # Starts Counter with arg 0
  {Stack, [:initial]},    # Starts Stack with arg [:initial]
  TemperatureTracker      # Starts with default args
]

{:ok, sup} = Supervisor.start_link(children,
  strategy: :one_for_one
)

# Module-based supervisor (preferred for apps)
defmodule MyApp.Supervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    children = [
      {Counter, 0},
      {Stack, []},
      {TemperatureTracker, []}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end

{:ok, _} = MyApp.Supervisor.start_link([])`,
          output: "{:ok, #PID<0.200.0>}",
        },
      },
      {
        title: "Restart Strategies",
        prose: [
          "The strategy option determines how the supervisor reacts when a child crashes. :one_for_one is the most common — only the crashed child is restarted. Use it when children are independent of each other.",
          ":one_for_all terminates and restarts every child when any single child crashes. Use this when all children depend on each other and would be in an inconsistent state if only one restarted.",
          ":rest_for_one restarts the crashed child and all children that were started after it. This is useful when children have a dependency chain — C depends on B, B depends on A. If B crashes, C must restart too, but A can stay running.",
        ],
        code: {
          title: "Choosing a strategy",
          code: `# one_for_one: Independent workers
# Each handles its own requests, no shared state
Supervisor.init([
  {UserCache, []},
  {SessionStore, []},
  {NotificationService, []}
], strategy: :one_for_one)

# one_for_all: Tightly coupled workers
# They share a connection pool that must be consistent
Supervisor.init([
  {DatabasePool, []},
  {CacheWarmer, []},   # depends on DatabasePool
  {QueryExecutor, []}  # depends on DatabasePool
], strategy: :one_for_all)

# rest_for_one: Sequential dependencies
# Each child depends on the ones before it
Supervisor.init([
  {EventStore, []},       # standalone
  {EventProcessor, []},   # depends on EventStore
  {Notifier, []}          # depends on EventProcessor
], strategy: :rest_for_one)`,
          output: "# Strategy chosen based on dependencies",
        },
      },
      {
        title: "Child Specifications",
        prose: [
          "A child specification is a map that tells the supervisor everything about a child: how to start it, its unique id, and its restart behavior. When you use GenServer, a default child_spec/1 is generated that covers most cases.",
          "The restart option controls when a child is restarted. :permanent (default) means always restart, even on normal exit. :temporary means never restart. :transient means only restart on abnormal exit — good for one-off tasks that should be retried on failure but not re-run on success.",
          "max_restarts and max_seconds set a crash threshold. If a child crashes more than max_restarts times within max_seconds, the supervisor itself shuts down. This prevents infinite crash-restart loops. The default is 3 restarts in 5 seconds.",
        ],
        code: {
          title: "Custom child specs",
          code: `# Default child_spec (generated by use GenServer)
# Equivalent to:
# %{
#   id: Counter,
#   start: {Counter, :start_link, [0]},
#   restart: :permanent,
#   shutdown: 5000,
#   type: :worker
# }

# Custom child spec for a temporary worker
defmodule OneTimeJob do
  use GenServer, restart: :temporary

  def start_link(task) do
    GenServer.start_link(__MODULE__, task)
  end

  @impl true
  def init(task) do
    # Do the work, then stop
    send(self(), :run)
    {:ok, task}
  end

  @impl true
  def handle_info(:run, task) do
    task.()
    {:stop, :normal, task}
  end
end

# Override restart in the supervisor
children = [
  # Permanent — always restart
  {Counter, 0},

  # Temporary — never restart
  %{
    id: :cleanup,
    start: {OneTimeJob, :start_link, [fn -> clean_up() end]},
    restart: :temporary
  },

  # Transient — restart only on crashes
  Supervisor.child_spec({Worker, []}, restart: :transient)
]`,
          output: "# Each child has tailored restart behavior",
        },
      },
      {
        title: "Supervision Trees",
        prose: [
          "The real power of supervisors comes from nesting them into trees. A supervisor can supervise other supervisors, creating a hierarchy. Each level handles the failures it can, and escalates to the level above if it can't cope.",
          "In a typical Elixir application, the Application module starts the top-level supervisor, which in turn starts sub-supervisors for different subsystems. This modular structure means a failure in the notification system doesn't affect the user authentication system.",
          "If a supervisor itself fails (because its children exceeded max_restarts), its parent supervisor handles the restart. This cascading recovery is what makes Elixir applications remarkably resilient — a 10-million-process system can self-heal from most failures without human intervention.",
        ],
        code: {
          title: "A supervision tree",
          code: `defmodule MyApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Sub-supervisor for web-related processes
      {MyApp.WebSupervisor, []},
      # Sub-supervisor for background jobs
      {MyApp.JobSupervisor, []},
      # A standalone worker
      {MyApp.Telemetry, []}
    ]

    opts = [strategy: :one_for_one, name: MyApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end

defmodule MyApp.WebSupervisor do
  use Supervisor

  def start_link(opts) do
    Supervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @impl true
  def init(_opts) do
    children = [
      {MyApp.Endpoint, []},
      {MyApp.RateLimiter, [max: 100, window: 60_000]},
      {MyApp.SessionStore, []}
    ]
    Supervisor.init(children, strategy: :one_for_one)
  end
end

# Result: a tree of supervisors
#
#         MyApp.Supervisor
#         /       |       \\
#   WebSup    JobSup    Telemetry
#   / | \\       |
# EP  RL  SS   Workers...`,
          output: "{:ok, #PID<0.100.0>}",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does \"let it crash\" mean in Elixir?",
        options: [
          { label: "Don't write any error handling code" },
          { label: "Write happy-path code and let supervisors handle unexpected failures", correct: true },
          { label: "Intentionally crash your application to test resilience" },
          { label: "Catch all errors and log them" },
        ],
        explanation:
          "\"Let it crash\" doesn't mean ignore errors. You still handle expected cases (invalid input, missing files). But for unexpected failures — bugs, network issues, corrupted state — you let the process crash and trust the supervisor to restart it in a clean state. This is simpler and more reliable than trying to recover from every possible error inline.",
      },
      {
        question: "Which restart strategy restarts ALL children when any one crashes?",
        options: [
          { label: ":one_for_one" },
          { label: ":one_for_all", correct: true },
          { label: ":rest_for_one" },
          { label: ":all_for_one" },
        ],
        explanation:
          ":one_for_all terminates and restarts every child when any single child crashes. Use it when children are tightly coupled and would be in an inconsistent state if only one restarted. Note: :all_for_one doesn't exist — it's :one_for_all.",
      },
      {
        question: "What happens when a child crashes more than max_restarts times in max_seconds?",
        options: [
          { label: "The child is permanently stopped" },
          { label: "The supervisor itself shuts down", correct: true },
          { label: "The supervisor ignores further crashes" },
          { label: "The application crashes" },
        ],
        explanation:
          "If a child exceeds the crash threshold (default: 3 times in 5 seconds), the supervisor considers it unrecoverable and shuts itself down. If this supervisor has a parent supervisor, that parent will then handle the restart at a higher level. This prevents infinite crash-restart loops.",
      },
      {
        question: "What does the :transient restart option mean?",
        options: [
          { label: "Always restart the child" },
          { label: "Never restart the child" },
          { label: "Restart only on abnormal exit, not on normal exit", correct: true },
          { label: "Restart after a random delay" },
        ],
        explanation:
          ":transient means the child is only restarted if it exits abnormally (crashes). If it exits with reason :normal or :shutdown, it stays down. This is ideal for one-off tasks that should be retried on failure but not re-run after successful completion.",
      },
      {
        question: "What is a supervision tree?",
        options: [
          { label: "A data structure for storing process PIDs" },
          { label: "A hierarchy where supervisors supervise other supervisors and workers", correct: true },
          { label: "A binary tree used for load balancing" },
          { label: "A visualization tool for debugging" },
        ],
        explanation:
          "A supervision tree is a hierarchical structure where supervisors can supervise both workers and other supervisors. Each level handles failures it can, escalating to the parent if it can't cope. This is the backbone of fault-tolerance in OTP applications.",
      },
      {
        question: "Which restart option should you use for a GenServer that runs a one-time data migration and should not be restarted after it completes successfully?",
        options: [
          { label: ":permanent" },
          { label: ":temporary" },
          { label: ":transient", correct: true },
          { label: ":one_for_one" },
        ],
        explanation:
          ":transient is the correct choice because it only restarts the child on abnormal exit (crashes), not on normal exit. A data migration that finishes successfully exits with :normal, so it won't be restarted. :temporary would also not restart it, but :temporary never restarts even on crashes, which means you'd lose automatic retry if the migration fails partway through.",
      },
      {
        question: "You have three children under a supervisor: A (database connection), B (cache that depends on A), and C (API server that depends on B). Which strategy ensures that if B crashes, both B and C are restarted but A keeps running?",
        options: [
          { label: ":one_for_one" },
          { label: ":one_for_all" },
          { label: ":rest_for_one", correct: true },
          { label: ":simple_one_for_one" },
        ],
        explanation:
          ":rest_for_one restarts the crashed child and all children started after it in the child list. Since children are started in order (A, B, C), if B crashes, B and C are restarted while A keeps running. This perfectly models a sequential dependency chain. :one_for_one would only restart B, leaving C connected to a stale cache. :one_for_all would unnecessarily restart A.",
      },
      {
        question: "What is the default max_restarts and max_seconds configuration for a Supervisor?",
        options: [
          { label: "1 restart in 10 seconds" },
          { label: "3 restarts in 5 seconds", correct: true },
          { label: "5 restarts in 10 seconds" },
          { label: "10 restarts in 60 seconds" },
        ],
        explanation:
          "The default crash intensity is 3 restarts within 5 seconds. If a child process crashes more than 3 times in a 5-second window, the supervisor considers it unrecoverable and shuts itself down. You can tune these values based on your use case — a network-dependent service might need a higher threshold to ride out brief connectivity issues.",
      },
      {
        question: "When should you use DynamicSupervisor instead of a regular Supervisor?",
        options: [
          { label: "When you need the :one_for_all strategy" },
          { label: "When child processes need to be started and stopped at runtime on demand", correct: true },
          { label: "When you have more than 10 child processes" },
          { label: "When children need different restart strategies" },
        ],
        explanation:
          "DynamicSupervisor is designed for cases where children are started dynamically at runtime — for example, one process per connected user or per uploaded file. Regular Supervisor declares its children upfront in init/1. DynamicSupervisor starts with no children and you add them with DynamicSupervisor.start_child/2. It only supports the :one_for_one strategy.",
      },
      {
        question: "A supervisor with strategy :one_for_one has children [A, B, C]. Child C crashes 4 times in 3 seconds with the default max_restarts/max_seconds settings. What happens?",
        options: [
          { label: "Only C is permanently stopped; A and B keep running" },
          { label: "The supervisor shuts down, terminating A, B, and C", correct: true },
          { label: "C is restarted a 4th time and the failure count resets" },
          { label: "The supervisor logs a warning but continues operating" },
        ],
        explanation:
          "The default max_restarts is 3 in 5 seconds. After the 4th crash within 3 seconds, the threshold is exceeded and the supervisor itself shuts down, taking all its children (A, B, and C) with it. If this supervisor has a parent supervisor, that parent will then attempt to restart it. This cascading behavior prevents infinite crash loops from consuming resources.",
      },
      {
        question: "What is the purpose of the :shutdown option in a child specification?",
        options: [
          { label: "It determines how long the supervisor waits for the child to terminate gracefully before forcefully killing it", correct: true },
          { label: "It specifies whether the child should be started automatically" },
          { label: "It sets the order in which children are shut down" },
          { label: "It controls whether the child can be restarted" },
        ],
        explanation:
          "The :shutdown option specifies how many milliseconds the supervisor waits for a child to terminate after sending it a shutdown signal. The default is 5000ms for workers. If the child doesn't stop in time, it's forcefully killed. You can also set it to :brutal_kill for immediate termination or :infinity for supervisors that need time to shut down their own children.",
      },
      {
        question: "You're building a chat application where each connected user gets their own process. Which supervision approach is most appropriate?",
        options: [
          { label: "A regular Supervisor with :one_for_all strategy" },
          { label: "A DynamicSupervisor with :one_for_one strategy", correct: true },
          { label: "A regular Supervisor with :rest_for_one strategy" },
          { label: "No supervisor needed — just spawn processes directly" },
        ],
        explanation:
          "DynamicSupervisor is ideal here because user processes come and go at runtime as users connect and disconnect. You can't declare them upfront in a static child list. DynamicSupervisor.start_child/2 lets you add a new process for each connection, and when a user's process crashes, only that one is restarted (one_for_one). Spawning without supervision would mean crashed user processes are lost silently.",
      },
      {
        question: "In a supervision tree, what happens when a child supervisor exceeds its max_restarts threshold?",
        options: [
          { label: "It keeps running but stops restarting its children" },
          { label: "It shuts down and its parent supervisor handles the failure according to the parent's strategy", correct: true },
          { label: "The entire application terminates immediately" },
          { label: "It resets its restart counter and continues" },
        ],
        explanation:
          "When a child supervisor exceeds its max_restarts, it shuts itself down with an abnormal exit. Its parent supervisor then treats this like any other child crash and applies its own strategy — restarting just that sub-tree (one_for_one), all children (one_for_all), or the crashed one and later children (rest_for_one). This cascading recovery is how supervision trees provide layered fault tolerance.",
      },
      {
        question: "Why is the order of children in a Supervisor's child list significant?",
        options: [
          { label: "It only affects logging output" },
          { label: "Children are started in order and shut down in reverse order, which matters for dependencies", correct: true },
          { label: "The first child always gets priority for CPU time" },
          { label: "It determines which child the supervisor monitors most closely" },
        ],
        explanation:
          "Supervisors start children top-to-bottom and shut them down bottom-to-top (reverse order). This is critical for dependencies: if a cache depends on a database connection, the database should be listed first so it starts before the cache and shuts down after it. This ordering also affects :rest_for_one strategy behavior, where only children listed after the crashed child are restarted.",
      },
      {
        question: "A supervisor has max_restarts: 5 and max_seconds: 30. Child A crashes at t=0, t=10, t=20, t=25, and t=29. What happens on the 5th crash?",
        options: [
          { label: "The supervisor shuts down because 5 crashes have occurred" },
          { label: "Child A is restarted normally because only 4 crashes fall within the 30-second window at the time of the 5th crash" },
          { label: "The supervisor shuts down because there have been 5 crashes within 30 seconds", correct: true },
          { label: "The crash counter resets after 30 seconds from the first crash" },
        ],
        explanation:
          "The max_restarts/max_seconds threshold uses a sliding window. At t=29 when the 5th crash occurs, all 5 crashes (at t=0, t=10, t=20, t=25, t=29) fall within the 30-second window. Since 5 restarts have been attempted within 30 seconds and the limit is 5, the supervisor determines the child is unrecoverable and shuts itself down. The window slides forward in time — it doesn't reset from the first crash.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Basic Supervised Counter",
        difficulty: "beginner",
        prompt:
          "Create a supervised Counter GenServer. Start a supervisor with one_for_one strategy that manages the counter. Demonstrate that when the counter crashes (add a crash/1 function that raises an error), the supervisor restarts it with the initial state.\n\nUse Supervisor.start_link/2 (inline supervisor, no module needed).",
        hints: [
          { text: "Reuse or create a simple Counter GenServer with start_link/1, increment/1, value/1, and a crash/1 that raises." },
          { text: "Start the supervisor with: Supervisor.start_link([{Counter, 0}], strategy: :one_for_one)." },
          { text: "Name the counter so you can call it after restart: GenServer.start_link(__MODULE__, arg, name: __MODULE__)." },
        ],
        solution: `defmodule Counter do
  use GenServer

  def start_link(initial) do
    GenServer.start_link(__MODULE__, initial, name: __MODULE__)
  end

  def increment, do: GenServer.cast(__MODULE__, :increment)
  def value, do: GenServer.call(__MODULE__, :value)
  def crash, do: GenServer.cast(__MODULE__, :crash)

  @impl true
  def init(initial), do: {:ok, initial}

  @impl true
  def handle_cast(:increment, count), do: {:noreply, count + 1}
  def handle_cast(:crash, _count), do: raise("boom!")

  @impl true
  def handle_call(:value, _from, count), do: {:reply, count, count}
end

# Start the supervisor
{:ok, sup} = Supervisor.start_link(
  [{Counter, 0}],
  strategy: :one_for_one
)

Counter.increment()
Counter.increment()
Counter.value()  # => 2

Counter.crash()
# Counter process crashes and restarts with initial value 0

Counter.value()  # => 0 (restarted fresh!)`,
        walkthrough: [
          "The Counter is a standard GenServer with a name registration so we can call it without a PID. This is important — after a crash and restart, the PID changes, but the name stays the same.",
          "crash/0 sends a cast that raises an error. The GenServer process crashes, and the supervisor detects the exit.",
          "The supervisor restarts Counter by calling Counter.start_link(0) again — the same arguments from the child spec. The counter comes back with its initial value of 0.",
          "The caller doesn't need to know about the crash. They just keep calling Counter.value() using the name. The supervisor made the recovery transparent.",
        ],
      },
      {
        title: "Worker Pool Supervisor",
        difficulty: "intermediate",
        prompt:
          "Create a supervisor module that manages a pool of N worker GenServers. Each worker has a unique name like :worker_1, :worker_2, etc. Implement:\n1. WorkerPool.Supervisor — a module-based supervisor with one_for_one strategy\n2. WorkerPool.Worker — a GenServer that processes jobs\n3. WorkerPool.dispatch/1 — picks a random worker and sends it a job\n\nThe worker should handle {:process, data} calls and return {:ok, result}.",
        hints: [
          { text: "Generate child specs dynamically: for i <- 1..n, build a child spec with id: {:worker, i} and a unique name." },
          { text: "Use Supervisor.child_spec/2 to create unique child specs from the same module: Supervisor.child_spec({Worker, name}, id: name)." },
          { text: "For dispatch, pick a random worker name and call GenServer.call(name, {:process, data})." },
        ],
        solution: `defmodule WorkerPool.Worker do
  use GenServer

  def start_link(opts) do
    name = Keyword.fetch!(opts, :name)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @impl true
  def init(opts), do: {:ok, %{name: opts[:name], jobs_done: 0}}

  @impl true
  def handle_call({:process, data}, _from, state) do
    result = String.upcase(to_string(data))
    new_state = %{state | jobs_done: state.jobs_done + 1}
    {:reply, {:ok, result, state.name}, new_state}
  end

  def handle_call(:stats, _from, state) do
    {:reply, state, state}
  end
end

defmodule WorkerPool.Supervisor do
  use Supervisor

  def start_link(pool_size) do
    Supervisor.start_link(__MODULE__, pool_size, name: __MODULE__)
  end

  @impl true
  def init(pool_size) do
    children =
      for i <- 1..pool_size do
        name = :"worker_\#{i}"
        Supervisor.child_spec(
          {WorkerPool.Worker, [name: name]},
          id: name
        )
      end

    Supervisor.init(children, strategy: :one_for_one)
  end
end

defmodule WorkerPool do
  def dispatch(data, pool_size) do
    worker = :"worker_\#{Enum.random(1..pool_size)}"
    GenServer.call(worker, {:process, data})
  end
end

{:ok, _} = WorkerPool.Supervisor.start_link(3)
WorkerPool.dispatch("hello", 3)
# => {:ok, "HELLO", :worker_2}  (random worker)`,
        walkthrough: [
          "The Supervisor generates child specs dynamically using a for comprehension. Each worker gets a unique atom name (:worker_1, :worker_2, etc.) and a unique id in the child spec.",
          "Supervisor.child_spec/2 lets us create multiple children from the same module by overriding the id. Without unique ids, the supervisor would reject duplicate children.",
          "The Worker is a simple GenServer that processes jobs and tracks how many it's handled. The name registration allows dispatch to call workers by name.",
          "dispatch picks a random worker by generating a random name. In production, you'd use a smarter strategy like round-robin or least-busy. Libraries like :poolboy or Nimble handle this.",
          "one_for_one is the right strategy here because workers are independent. If worker_2 crashes, workers 1 and 3 keep running.",
        ],
      },
      {
        title: "Circuit Breaker with Supervision",
        difficulty: "advanced",
        prompt:
          "Build a circuit breaker pattern using a supervisor. Create:\n1. CircuitBreaker — a GenServer that wraps calls to an unreliable service\n2. It tracks consecutive failures. After 3 failures, it \"opens\" the circuit and returns {:error, :circuit_open} for 5 seconds without calling the service\n3. After 5 seconds, it moves to \"half-open\" and lets one request through. If it succeeds, close the circuit. If it fails, re-open.\n4. Put it under a supervisor so it restarts cleanly if it crashes itself",
        hints: [
          { text: "State needs: status (:closed, :open, :half_open), failure_count, and the max_failures threshold." },
          { text: "When opening the circuit, use Process.send_after(self(), :half_open, 5000) to schedule the transition." },
          { text: "In :closed state, call the service. On success, reset failures. On failure, increment. At threshold, open." },
          { text: "In :open state, immediately return {:error, :circuit_open}. In :half_open, let one through as a test." },
        ],
        solution: `defmodule CircuitBreaker do
  use GenServer

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def call(request) do
    GenServer.call(__MODULE__, {:call, request})
  end

  def status, do: GenServer.call(__MODULE__, :status)

  @impl true
  def init(opts) do
    {:ok, %{
      service: opts[:service],
      max_failures: opts[:max_failures] || 3,
      reset_timeout: opts[:reset_timeout] || 5_000,
      status: :closed,
      failure_count: 0
    }}
  end

  @impl true
  def handle_call({:call, _request}, _from, %{status: :open} = state) do
    {:reply, {:error, :circuit_open}, state}
  end

  def handle_call({:call, request}, _from, state) do
    case state.service.(request) do
      {:ok, result} ->
        {:reply, {:ok, result}, %{state | status: :closed, failure_count: 0}}

      {:error, reason} ->
        new_count = state.failure_count + 1
        if new_count >= state.max_failures do
          Process.send_after(self(), :half_open, state.reset_timeout)
          {:reply, {:error, reason}, %{state | status: :open, failure_count: new_count}}
        else
          {:reply, {:error, reason}, %{state | failure_count: new_count}}
        end
    end
  end

  def handle_call(:status, _from, state) do
    {:reply, state.status, state}
  end

  @impl true
  def handle_info(:half_open, state) do
    {:noreply, %{state | status: :half_open}}
  end
end

# Under supervision
children = [
  {CircuitBreaker, [
    service: fn _req ->
      if :rand.uniform() > 0.5, do: {:ok, "data"}, else: {:error, :timeout}
    end,
    max_failures: 3,
    reset_timeout: 5_000
  ]}
]

{:ok, _} = Supervisor.start_link(children, strategy: :one_for_one)

CircuitBreaker.call(:get_data)  # might succeed or fail
CircuitBreaker.status()         # :closed, :open, or :half_open`,
        walkthrough: [
          "The circuit breaker has three states: :closed (normal operation), :open (rejecting all requests), and :half_open (testing with one request).",
          "In :closed state, every request goes through to the service. Successes reset the failure count. Failures increment it. When failures hit the threshold, the circuit opens.",
          "In :open state, requests are immediately rejected with {:error, :circuit_open}. No call to the service is made. Process.send_after schedules a :half_open transition.",
          "In :half_open state, one request is let through as a test. If it succeeds, the circuit closes. If it fails, it re-opens. This prevents hammering a recovering service.",
          "Putting the circuit breaker under a supervisor means that if the GenServer itself crashes (not the wrapped service, but the breaker process), it restarts in a clean :closed state. The supervisor provides a second layer of resilience on top of the circuit breaker logic.",
        ],
      },
    ],
  },
};

export default supervisors;
