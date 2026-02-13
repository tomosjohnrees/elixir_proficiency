import type { TopicContent } from "@/lib/types";
import Animation06MessagePassing from "@/components/animations/Animation06MessagePassing";

const processes: TopicContent = {
  meta: {
    slug: "processes",
    title: "Processes",
    description: "Spawning processes, message passing, and links",
    number: 10,
    active: true,
  },

  eli5: {
    analogyTitle: "The Office Building",
    analogy:
      "Imagine a big office building where each person works in their own private office. They can't walk into someone else's office and rearrange their desk — they communicate by sending letters through the internal mail system. Each person has a mailbox, reads letters one at a time, and sends replies back. If someone's office catches fire, you can choose to be notified so you can react — or you can link your offices so that if one goes down, you're alerted immediately.",
    items: [
      { label: "Processes", description: "Each person in their private office. They have their own memory, run independently, and can't directly access each other's stuff. Thousands can work simultaneously." },
      { label: "Message passing", description: "The internal mail system. You send a letter to someone's mailbox. They read it when they're ready. You don't wait at their door — you go back to your own work." },
      { label: "Mailbox", description: "Every office has one. Letters pile up in order. The person processes them one at a time using pattern matching to decide what to do with each one." },
      { label: "Links and monitors", description: "An agreement between offices. If one person leaves or their office catches fire, the linked person gets notified. Links crash both; monitors just send a notification." },
    ],
    keyTakeaways: [
      "Elixir processes are NOT operating system threads. They're incredibly lightweight — you can run millions of them on a single machine.",
      "Processes share nothing. Each has its own memory (heap). They communicate exclusively through message passing.",
      "spawn creates a new process. send puts a message in a process's mailbox. receive reads from the mailbox with pattern matching.",
      "Links are bidirectional — if one linked process dies, the other crashes too (unless it traps exits). Monitors are one-way notifications.",
      "This is the foundation of OTP and fault tolerance. Understanding processes is the biggest conceptual leap in learning Elixir.",
    ],
  },

  visuals: {
    animation: Animation06MessagePassing,
    animationDuration: 19,
    dataTypes: [
      { name: "Process", color: "#6b46c1", examples: ["spawn(fn -> ... end)", "self()", "#PID<0.123.0>"], description: "A lightweight, isolated unit of execution. Has its own memory, mailbox, and a unique PID (process identifier)." },
      { name: "Message", color: "#2563eb", examples: ["send(pid, :hello)", "send(pid, {:data, 42})", "{:ok, result}"], description: "Any Elixir term sent to a process mailbox. Messages are copied, not shared. Delivered asynchronously." },
      { name: "Link", color: "#e11d48", examples: ["spawn_link(fn -> ... end)", "Process.link(pid)"], description: "Bidirectional crash propagation. If one linked process dies, the other dies too. The foundation of supervision." },
      { name: "Monitor", color: "#d97706", examples: ["Process.monitor(pid)", "{:DOWN, ref, ...}"], description: "One-way observation. The monitoring process gets a :DOWN message when the monitored process exits. No crash propagation." },
    ],
    operatorGroups: [
      {
        name: "Process Primitives",
        operators: [
          { symbol: "spawn", description: "Create a new process from a function" },
          { symbol: "spawn_link", description: "Create a new process linked to the caller" },
          { symbol: "self()", description: "Get the current process's PID" },
          { symbol: "send", description: "Send a message to a process mailbox" },
          { symbol: "receive", description: "Pattern match on incoming messages" },
          { symbol: "Process.alive?", description: "Check if a process is still running" },
        ],
      },
      {
        name: "Links & Monitors",
        operators: [
          { symbol: "Process.link", description: "Link current process to another (bidirectional)" },
          { symbol: "Process.unlink", description: "Remove a link between processes" },
          { symbol: "Process.monitor", description: "Monitor another process (one-way)" },
          { symbol: "Process.demonitor", description: "Stop monitoring a process" },
          { symbol: "Process.flag", description: "Set flags like :trap_exit" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Spawning Processes",
        prose: [
          "Creating a process in Elixir is cheap — both in time and memory. A fresh process uses about 2KB of memory and takes microseconds to start. The BEAM VM can handle millions of concurrent processes because they're managed by its own scheduler, not the OS.",
          "spawn/1 takes a function and runs it in a new process. It returns a PID (process identifier) immediately — the caller doesn't wait for the spawned process to finish. When the function completes, the process exits normally and is garbage collected.",
          "self/0 returns the PID of the current process. Every piece of Elixir code runs inside a process — even IEx is a process. PIDs look like #PID<0.123.0> and are unique within a node.",
        ],
        code: {
          title: "Spawning processes",
          code: `# Spawn a process that does some work
pid = spawn(fn ->
  IO.puts("Hello from #{inspect(self())}")
end)
# Prints: Hello from #PID<0.123.0>

# The spawned process runs independently
Process.alive?(pid)  # => false (already finished)
Process.alive?(self())  # => true (we're still running)

# Spawn many processes cheaply
pids = for i <- 1..10_000 do
  spawn(fn ->
    # Each process has its own memory
    :timer.sleep(1000)
  end)
end
length(pids)  # => 10000
# 10,000 processes running simultaneously!`,
          output: "10000",
        },
      },
      {
        title: "Sending and Receiving Messages",
        prose: [
          "Processes communicate by sending messages. send/2 puts any Elixir term into a process's mailbox and returns immediately — it's asynchronous, meaning the sender doesn't wait for the receiver to read the message.",
          "receive blocks the current process until a message matching one of its patterns arrives. It works like case but on the mailbox. Messages are checked in the order they arrived (FIFO), and the first matching pattern wins. Messages that don't match stay in the mailbox.",
          "The after clause in receive sets a timeout. If no matching message arrives within the timeout, the after block runs. Without a timeout, receive blocks forever.",
        ],
        code: {
          title: "Message passing",
          code: `# Send a message to the current process
send(self(), {:hello, "world"})
send(self(), {:count, 42})

# Receive with pattern matching
receive do
  {:hello, name} -> "Got hello from #{name}"
  {:count, n} -> "Got count: #{n}"
end
# => "Got hello from world"
# (first matching message wins)

# The {:count, 42} message is still in the mailbox!

# Request-response pattern
parent = self()

child = spawn(fn ->
  receive do
    {:square, n, reply_to} ->
      send(reply_to, {:result, n * n})
  end
end)

send(child, {:square, 7, parent})

receive do
  {:result, value} -> "7 squared is #{value}"
end
# => "7 squared is 49"

# Receive with timeout
receive do
  :never_arrives -> "got it"
after
  1000 -> "timed out after 1 second"
end
# => "timed out after 1 second"`,
          output: "\"timed out after 1 second\"",
        },
      },
      {
        title: "Stateful Processes — The Receive Loop",
        prose: [
          "A process that handles one message and exits isn't very useful. To maintain state across messages, you use a recursive receive loop. The process calls itself with updated state after handling each message.",
          "This pattern is the foundation of all stateful abstractions in Elixir. A GenServer, Agent, or any OTP process is essentially a receive loop with conventions and error handling built on top.",
          "Since processes have isolated memory, their state is inherently safe from concurrent access. No locks, no mutexes, no race conditions on state. Two processes can never corrupt each other's data.",
        ],
        code: {
          title: "A simple counter process",
          code: `defmodule Counter do
  def start(initial \\\\ 0) do
    spawn(fn -> loop(initial) end)
  end

  defp loop(count) do
    receive do
      :increment ->
        loop(count + 1)

      :decrement ->
        loop(count - 1)

      {:get, caller} ->
        send(caller, {:count, count})
        loop(count)

      :stop ->
        IO.puts("Stopping at #{count}")
        # Don't recurse — process exits
    end
  end
end

pid = Counter.start(0)
send(pid, :increment)
send(pid, :increment)
send(pid, :increment)
send(pid, {:get, self()})

receive do
  {:count, n} -> "Count is #{n}"
end
# => "Count is 3"`,
          output: "\"Count is 3\"",
        },
      },
      {
        title: "Links — Crash Together",
        prose: [
          "When you link two processes, they form a contract: if either one dies abnormally, the other dies too. This might sound destructive, but it's actually the foundation of Elixir's fault-tolerance strategy. Supervisors use links to detect when child processes crash and restart them.",
          "spawn_link/1 creates a new process that's immediately linked to the caller. If the spawned process crashes, the caller crashes too (and vice versa). Process.link/1 links two existing processes.",
          "You can trap exits by setting Process.flag(:trap_exit, true). When a linked process dies, instead of crashing, you receive an {:EXIT, pid, reason} message. This is how supervisors work — they trap exits from their children and decide what to do.",
        ],
        code: {
          title: "Links and exit trapping",
          code: `# spawn_link — linked from birth
pid = spawn_link(fn ->
  # If this crashes, the caller crashes too
  raise "something went wrong"
end)
# ** (EXIT from #PID<0.100.0>) ...

# Trapping exits — convert crashes to messages
Process.flag(:trap_exit, true)

pid = spawn_link(fn ->
  raise "boom"
end)

# Instead of crashing, we get a message
receive do
  {:EXIT, ^pid, reason} ->
    "Child crashed: #{inspect(reason)}"
end
# => "Child crashed: {%RuntimeError{message: \"boom\"}, [...]}"

# Normal exits send {:EXIT, pid, :normal}
pid2 = spawn_link(fn -> :ok end)
receive do
  {:EXIT, ^pid2, :normal} -> "Child exited normally"
end
# => "Child exited normally"`,
          output: "\"Child exited normally\"",
        },
      },
      {
        title: "Monitors — Observe Without Risk",
        prose: [
          "Monitors are a one-way alternative to links. When you monitor a process, you receive a :DOWN message if it exits — but you don't crash. The monitored process doesn't even know it's being watched.",
          "Process.monitor/1 returns a reference that uniquely identifies the monitor. The :DOWN message includes this reference, the monitored PID, and the exit reason. You can use the reference to demonitor if you no longer care.",
          "Use links when processes have a parent-child relationship and should fail together. Use monitors when you want to observe a process without coupling your fate to it — for example, tracking the status of a worker you delegated to.",
        ],
        code: {
          title: "Monitoring processes",
          code: `# Monitor a process
pid = spawn(fn ->
  :timer.sleep(100)
  # Process exits normally after 100ms
end)

ref = Process.monitor(pid)

receive do
  {:DOWN, ^ref, :process, ^pid, reason} ->
    "Process exited: #{inspect(reason)}"
end
# => "Process exited: :normal"

# Monitor a process that crashes
pid2 = spawn(fn ->
  raise "oops"
end)

ref2 = Process.monitor(pid2)

receive do
  {:DOWN, ^ref2, :process, ^pid2, reason} ->
    "Crash detected: #{inspect(reason)}"
end
# => "Crash detected: {%RuntimeError{...}, [...]}"

# We're still alive! Monitors don't propagate crashes
Process.alive?(self())  # => true`,
          output: "true",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "How much memory does a new Elixir process typically use?",
        options: [
          { label: "About 2 KB", correct: true },
          { label: "About 1 MB" },
          { label: "About 8 MB (like an OS thread)" },
          { label: "It varies based on the function size" },
        ],
        explanation:
          "Elixir processes are extremely lightweight — about 2 KB each. This is why you can run millions of them. They're managed by the BEAM VM's scheduler, not the OS, so they don't have the overhead of OS threads (which typically use 1-8 MB for their stack).",
      },
      {
        question: "What does `send(pid, :hello)` return?",
        options: [
          { label: ":ok" },
          { label: "The message :hello", correct: true },
          { label: "The PID of the receiver" },
          { label: "true if delivered, false otherwise" },
        ],
        explanation:
          "send always returns the message itself — in this case, :hello. It's fire-and-forget: the message is placed in the receiver's mailbox asynchronously. send doesn't tell you whether the process exists or received the message. Even sending to a dead PID succeeds silently.",
      },
      {
        question: "What happens to unmatched messages in a `receive` block?",
        options: [
          { label: "They're discarded" },
          { label: "They cause an error" },
          { label: "They stay in the mailbox for future receives", correct: true },
          { label: "They're sent back to the sender" },
        ],
        explanation:
          "Messages that don't match any pattern in receive stay in the mailbox. They'll be available for future receive calls. This is important to understand — a growing mailbox of unmatched messages can consume memory. Always handle or discard messages you don't need.",
      },
      {
        question: "What's the difference between a link and a monitor?",
        options: [
          { label: "Links are faster than monitors" },
          { label: "Links are bidirectional and crash both; monitors are one-way notifications", correct: true },
          { label: "Links work across nodes; monitors don't" },
          { label: "There is no difference — they're aliases" },
        ],
        explanation:
          "Links are bidirectional: if either linked process dies abnormally, both die. Monitors are one-way: the monitoring process receives a :DOWN message but doesn't crash. Use links for parent-child relationships (supervision), monitors for observation without coupling.",
      },
      {
        question: "How do you prevent a linked process's crash from killing the current process?",
        options: [
          { label: "Use try/rescue around the spawn_link call" },
          { label: "Set Process.flag(:trap_exit, true) before linking", correct: true },
          { label: "Use spawn instead of spawn_link" },
          { label: "You can't — linked processes always crash together" },
        ],
        explanation:
          "Setting Process.flag(:trap_exit, true) converts exit signals from linked processes into {:EXIT, pid, reason} messages instead of propagating the crash. This is exactly how supervisors work — they trap exits from their children and restart them as needed.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Ping-Pong Processes",
        difficulty: "beginner",
        prompt:
          "Create two processes that play ping-pong. Process A sends :ping to Process B, which responds with :pong. They go back and forth for N rounds, then both stop. Print each exchange.\n\nExample output for 3 rounds:\nPing!\nPong!\nPing!\nPong!\nPing!\nPong!",
        hints: [
          { text: "Each process needs a receive loop that handles one message, prints, sends a reply, and recurses." },
          { text: "Pass a counter to track remaining rounds. When it hits zero, stop recursing." },
          { text: "Process A starts the exchange by sending the first :ping. Both processes need to know each other's PID." },
        ],
        solution: `defmodule PingPong do
  def start(rounds) do
    parent = self()

    pong_pid = spawn(fn ->
      receive do
        {:start, ping_pid} -> pong_loop(ping_pid, rounds)
      end
    end)

    ping_pid = spawn(fn ->
      ping_loop(pong_pid, rounds)
    end)

    send(pong_pid, {:start, ping_pid})
    send(ping_pid, :go)
  end

  defp ping_loop(_pong_pid, 0), do: :done

  defp ping_loop(pong_pid, remaining) do
    receive do
      msg when msg in [:go, :pong] ->
        IO.puts("Ping!")
        send(pong_pid, :ping)
        ping_loop(pong_pid, remaining - 1)
    end
  end

  defp pong_loop(_ping_pid, 0), do: :done

  defp pong_loop(ping_pid, remaining) do
    receive do
      :ping ->
        IO.puts("Pong!")
        send(ping_pid, :pong)
        pong_loop(ping_pid, remaining - 1)
    end
  end
end

PingPong.start(3)`,
        walkthrough: [
          "We spawn two processes: one for ping and one for pong. Each runs a recursive receive loop with a counter tracking remaining rounds.",
          "The pong process needs to know the ping PID, but we can't know it before spawning. So pong waits for a {:start, ping_pid} message first.",
          "The ping process starts when it receives :go. It prints \"Ping!\", sends :ping to pong, and decrements its counter.",
          "The pong process receives :ping, prints \"Pong!\", sends :pong back, and decrements its counter.",
          "When the counter reaches 0, the functions return :done without recursing, and the processes exit normally.",
        ],
      },
      {
        title: "Process Registry",
        difficulty: "intermediate",
        prompt:
          "Build a simple key-value store as a process. Implement a KVStore module with:\n1. start/0 — spawns and returns the store's PID\n2. put/3 — stores a key-value pair (takes pid, key, value)\n3. get/2 — retrieves a value by key (takes pid, key), returns {:ok, value} or :error\n4. delete/2 — removes a key\n5. keys/1 — returns all keys\n\nThe store should maintain state using a recursive receive loop with a map as the state.",
        hints: [
          { text: "The process loop takes a map as its state argument. Start with an empty map %{}." },
          { text: "For get and keys, the caller needs a response. Include the caller's PID in the message so the store can send back the result." },
          { text: "put and delete don't need responses — they can be fire-and-forget (async). Recurse with the updated map." },
          { text: "Use Map.put, Map.fetch, Map.delete, and Map.keys for the operations." },
        ],
        solution: `defmodule KVStore do
  def start do
    spawn(fn -> loop(%{}) end)
  end

  def put(pid, key, value) do
    send(pid, {:put, key, value})
  end

  def get(pid, key) do
    send(pid, {:get, key, self()})
    receive do
      {:response, value} -> value
    after
      5000 -> :timeout
    end
  end

  def delete(pid, key) do
    send(pid, {:delete, key})
  end

  def keys(pid) do
    send(pid, {:keys, self()})
    receive do
      {:response, keys} -> keys
    after
      5000 -> :timeout
    end
  end

  defp loop(state) do
    receive do
      {:put, key, value} ->
        loop(Map.put(state, key, value))

      {:get, key, caller} ->
        send(caller, {:response, Map.fetch(state, key)})
        loop(state)

      {:delete, key} ->
        loop(Map.delete(state, key))

      {:keys, caller} ->
        send(caller, {:response, Map.keys(state)})
        loop(state)
    end
  end
end

store = KVStore.start()
KVStore.put(store, :name, "Elixir")
KVStore.put(store, :version, "1.16")
KVStore.get(store, :name)     # => {:ok, "Elixir"}
KVStore.get(store, :missing)  # => :error
KVStore.keys(store)           # => [:name, :version]
KVStore.delete(store, :version)
KVStore.keys(store)           # => [:name]`,
        walkthrough: [
          "The process loop holds a map as its state. Each receive clause handles one operation and recurses with the (potentially updated) state.",
          "put and delete are asynchronous — they send a message and don't wait for a response. The caller returns immediately.",
          "get and keys are synchronous — they send a message containing self() so the store knows where to reply, then block on receive waiting for the response.",
          "The 5-second timeout in get and keys prevents the caller from hanging forever if the store process died.",
          "This is essentially a hand-rolled Agent or GenServer. In real Elixir code, you'd use Agent for simple state or GenServer for more complex behavior. But understanding this pattern is crucial for grasping how they work internally.",
        ],
      },
      {
        title: "Task Supervisor (Manual)",
        difficulty: "advanced",
        prompt:
          "Build a simple supervisor that monitors worker processes. Implement a WorkerSupervisor module:\n1. start/0 — spawns the supervisor process\n2. start_worker/2 — takes the supervisor PID and a function, spawns a monitored worker, returns {:ok, worker_pid}\n3. The supervisor tracks all active workers. When a worker crashes, it logs the crash reason\n4. list_workers/1 — returns the list of active worker PIDs\n\nUse Process.monitor (not links) so the supervisor doesn't crash when workers do.",
        hints: [
          { text: "The supervisor's state is a map of %{ref => pid} so it can look up which worker crashed when a :DOWN message arrives." },
          { text: "Use Process.monitor/1 after spawning each worker. Store the monitor reference in the state." },
          { text: "The supervisor's receive loop must handle both command messages ({:start_worker, ...}) and :DOWN messages." },
          { text: "When a :DOWN message arrives, remove the worker from the state map and log the crash." },
        ],
        solution: `defmodule WorkerSupervisor do
  def start do
    spawn(fn -> loop(%{}) end)
  end

  def start_worker(sup, func) do
    send(sup, {:start_worker, func, self()})
    receive do
      {:worker_started, pid} -> {:ok, pid}
    after
      5000 -> {:error, :timeout}
    end
  end

  def list_workers(sup) do
    send(sup, {:list_workers, self()})
    receive do
      {:workers, pids} -> pids
    after
      5000 -> []
    end
  end

  defp loop(workers) do
    receive do
      {:start_worker, func, caller} ->
        pid = spawn(func)
        ref = Process.monitor(pid)
        send(caller, {:worker_started, pid})
        loop(Map.put(workers, ref, pid))

      {:DOWN, ref, :process, pid, reason} ->
        IO.puts("Worker #{inspect(pid)} exited: #{inspect(reason)}")
        loop(Map.delete(workers, ref))

      {:list_workers, caller} ->
        send(caller, {:workers, Map.values(workers)})
        loop(workers)
    end
  end
end

sup = WorkerSupervisor.start()

# Start some workers
{:ok, w1} = WorkerSupervisor.start_worker(sup, fn ->
  :timer.sleep(60_000)  # Long-running worker
end)

{:ok, w2} = WorkerSupervisor.start_worker(sup, fn ->
  :timer.sleep(100)
  raise "crash!"  # This worker will crash
end)

WorkerSupervisor.list_workers(sup)
# => [#PID<0.150.0>, #PID<0.151.0>]

# After w2 crashes (100ms later):
# Prints: Worker #PID<0.151.0> exited: {%RuntimeError{...}, [...]}

:timer.sleep(200)
WorkerSupervisor.list_workers(sup)
# => [#PID<0.150.0>]  (only w1 remains)`,
        walkthrough: [
          "The supervisor maintains a map of %{monitor_ref => pid}. This lets it look up which worker corresponds to a :DOWN message by the monitor reference.",
          "When start_worker is called, it spawns the function in a new process, immediately monitors it, and stores the ref-to-pid mapping. The caller gets back the worker PID.",
          "Process.monitor is used instead of spawn_link because we want the supervisor to observe crashes without dying itself. This is the key difference.",
          "When a monitored worker exits (for any reason), the supervisor receives {:DOWN, ref, :process, pid, reason}. It logs the crash and removes the worker from its state.",
          "This is a simplified version of what OTP's Supervisor does. The real Supervisor adds restart strategies, max restart limits, child specifications, and trap_exit-based linking. But the core concept is the same: monitor children and react to their exits.",
        ],
      },
    ],
  },
};

export default processes;
