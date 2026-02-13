import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Task.async Requires Task.await — Forgetting Causes Process Leaks",
    description:
      "Task.async/1 links the spawned task to the caller and expects Task.await/2 to collect the result. If you call Task.async but never await, the task process lingers and eventually sends a message that nobody receives. For fire-and-forget work, use Task.start/1 or Task.Supervisor.start_child/2 instead.",
    code: `# Wrong: using async without await (process leak)
def process_items(items) do
  Enum.each(items, fn item ->
    Task.async(fn -> do_work(item) end)
    # Leaked! No one will await these tasks
  end)
end

# Correct: await all async tasks
def process_items(items) do
  items
  |> Enum.map(&Task.async(fn -> do_work(&1) end))
  |> Task.await_many()
end

# For fire-and-forget: use Task.start or a Supervisor
Task.start(fn -> send_email(user) end)`,
  },
  {
    title: "Task.await Has a 5-Second Default Timeout",
    description:
      "Task.await/2 defaults to a 5000ms timeout. If the task takes longer, the caller crashes with a timeout error. This catches many developers off guard when running tasks that involve network calls, file I/O, or heavy computation. Always set an explicit timeout for tasks that might take longer than 5 seconds.",
    code: `task = Task.async(fn -> slow_api_call() end)

# This crashes after 5 seconds if the API is slow
Task.await(task)
#=> ** (exit) exited in: Task.await/2 — task timed out

# Set an appropriate timeout (in milliseconds)
Task.await(task, 30_000)  # 30 second timeout

# Or use :infinity cautiously
Task.await(task, :infinity)  # Waits forever — use with care`,
  },
  {
    title: "Agent State Updates Are Serialized — Potential Bottleneck",
    description:
      "An Agent is a GenServer under the hood, processing one message at a time. All reads and writes to the Agent state are serialized through its process mailbox. If many processes frequently read or update the same Agent, it becomes a bottleneck. For read-heavy workloads, consider ETS tables which allow concurrent reads.",
    code: `# This Agent handles requests one at a time
{:ok, counter} = Agent.start_link(fn -> 0 end)

# If 1000 processes all try to update concurrently,
# they queue up and execute one by one
Enum.each(1..1000, fn _ ->
  spawn(fn ->
    Agent.update(counter, &(&1 + 1))  # Serialized!
  end)
end)

# For high-concurrency reads, ETS is much better:
:ets.new(:cache, [:set, :public, :named_table])
# Multiple processes can read concurrently`,
  },
  {
    title: "GenServer.call Has a Default 5s Timeout — Cascading Failures",
    description:
      "GenServer.call/3 defaults to a 5000ms timeout. If the GenServer is busy processing other messages and can't respond in time, the caller crashes. In a system where GenServers call each other, one slow server can cause a cascade of timeout crashes across the system. Use explicit timeouts and consider GenServer.cast/2 for non-critical operations.",
    code: `# Default 5-second timeout
GenServer.call(MyServer, :expensive_operation)
#=> ** (exit) exited in: GenServer.call/3 — timeout

# Set explicit timeout for slow operations
GenServer.call(MyServer, :expensive_operation, 15_000)

# Cascading failure example:
# ServerA calls ServerB calls ServerC
# If ServerC is slow, ServerB times out waiting,
# then ServerA times out waiting on ServerB

# Use cast for fire-and-forget (no timeout risk)
GenServer.cast(MyServer, {:log, event})`,
  },
];

export default gotchas;
