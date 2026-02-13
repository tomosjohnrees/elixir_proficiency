import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Linked Processes Crash Together",
    description:
      "When two processes are linked with spawn_link/1 or Process.link/1, if one crashes, the other receives an EXIT signal and also crashes (unless it's trapping exits). This bidirectional crash propagation is intentional for supervision trees, but can surprise you when you just want to know if a process failed without dying yourself. Use monitors instead for one-way crash notification.",
    code: `# Links are bidirectional — both crash
spawn_link(fn ->
  raise "boom"
end)
# The parent process ALSO crashes!

# Monitors are one-way — only notification, no crash
ref = Process.monitor(spawn(fn ->
  raise "boom"
end))

receive do
  {:DOWN, ^ref, :process, _pid, reason} ->
    IO.puts("Process died: \#{inspect(reason)}")
end
# Parent continues running normally`,
  },
  {
    title: "Mailboxes Grow Unbounded",
    description:
      "Every Elixir process has a mailbox that stores messages until they're consumed with receive. Messages are never dropped or lost, so if a process receives messages faster than it processes them, the mailbox grows without limit and can consume all available memory. There's no built-in backpressure.",
    code: `# A slow consumer will accumulate messages
slow_pid = spawn(fn ->
  defmodule Slow do
    def loop do
      receive do
        msg ->
          Process.sleep(1000)  # Slow processing
          loop()
      end
    end
  end
  Slow.loop()
end)

# Fast producer overwhelms the consumer
for i <- 1..1_000_000 do
  send(slow_pid, {:work, i})
end
# slow_pid's mailbox now has ~1M messages in memory

# Check mailbox size with:
Process.info(slow_pid, :message_queue_len)
#=> {:message_queue_len, 999_990}`,
  },
  {
    title: "Process.sleep in Production Is a Code Smell",
    description:
      "Using Process.sleep/1 to wait for something to happen is a sign of a design problem. It wastes resources, introduces arbitrary delays, and creates race conditions. Use message passing, monitors, or GenServer calls for coordination instead.",
    code: `# BAD — arbitrary sleep hoping the work is done
task_pid = spawn(fn -> do_work() end)
Process.sleep(5000)
# Hope the work finished in 5 seconds...

# GOOD — use Task for async work with proper waiting
task = Task.async(fn -> do_work() end)
result = Task.await(task, 10_000)

# GOOD — use receive with a timeout
send(worker, {:do_work, self()})
receive do
  {:work_done, result} -> result
after
  10_000 -> {:error, :timeout}
end

# GOOD — use GenServer.call for request/response
GenServer.call(worker, :do_work, 10_000)`,
  },
  {
    title: "Spawned Processes Don't Share State with Parent",
    description:
      "Each process has its own isolated memory. When you spawn a process, it receives a copy of the data from the closure, not a reference to the parent's variables. Mutations in one process are invisible to the other. This is fundamental to Elixir's concurrency model but surprises developers from shared-state languages.",
    code: `# The spawned process gets a COPY of the data
list = [1, 2, 3]

spawn(fn ->
  # This is a copy — modifying it doesn't affect the parent
  new_list = [0 | list]
  IO.inspect(new_list)
  #=> [0, 1, 2, 3]
end)

IO.inspect(list)
#=> [1, 2, 3]  # unchanged

# To share mutable state, use Agent or GenServer
{:ok, agent} = Agent.start_link(fn -> [1, 2, 3] end)

spawn(fn ->
  Agent.update(agent, fn list -> [0 | list] end)
end)

Process.sleep(100)  # wait for spawn to finish (demo only)
Agent.get(agent, & &1)
#=> [0, 1, 2, 3]`,
  },
];

export default gotchas;
