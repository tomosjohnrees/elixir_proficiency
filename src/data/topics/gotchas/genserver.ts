import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "handle_call Blocks the Caller, handle_cast Doesn't",
    description:
      "handle_call is synchronous — the calling process waits until the GenServer replies. handle_cast is asynchronous — it returns :ok immediately. But cast gives you no backpressure: if you cast messages faster than the GenServer can process them, the mailbox grows unbounded and memory usage balloons.",
    code: `# handle_call: caller blocks until reply is sent
def handle_call(:get_count, _from, state) do
  {:reply, state.count, state}
end

# handle_cast: returns immediately, no backpressure
def handle_cast({:increment, n}, state) do
  {:noreply, %{state | count: state.count + n}}
end

# Dangerous: flooding a GenServer with casts
for i <- 1..1_000_000 do
  GenServer.cast(pid, {:increment, i})  # all accepted instantly
end
# The GenServer mailbox now has 1M messages queued`,
  },
  {
    title: "GenServer Processes Messages Sequentially",
    description:
      "A GenServer processes one message at a time from its mailbox. This is by design — it gives you safe, sequential access to state — but it means a single GenServer can become a bottleneck. If a handle_call takes 500ms, all other callers queue behind it. Consider splitting work across multiple processes or using Task for concurrent work.",
    code: `# This GenServer handles an expensive operation
def handle_call(:expensive_query, _from, state) do
  result = run_slow_database_query()  # takes 500ms
  {:reply, result, state}
end

# All these calls execute one at a time
Task.async(fn -> GenServer.call(pid, :expensive_query) end)
Task.async(fn -> GenServer.call(pid, :expensive_query) end)
Task.async(fn -> GenServer.call(pid, :expensive_query) end)
# Total time: ~1500ms, not ~500ms`,
  },
  {
    title: "Don't Do Expensive Work in init/1",
    description:
      "GenServer.start_link/3 doesn't return until init/1 completes. Since supervisors call start_link synchronously for each child, a slow init blocks the entire supervision tree from starting. Use handle_continue/2 (Elixir 1.7+) to defer expensive initialization.",
    code: `# BAD: blocks the supervisor during startup
def init(args) do
  data = fetch_from_remote_api()  # may take seconds or timeout
  {:ok, %{data: data}}
end

# GOOD: defer expensive work with handle_continue
def init(args) do
  {:ok, %{data: nil}, {:continue, :load_data}}
end

def handle_continue(:load_data, state) do
  data = fetch_from_remote_api()
  {:noreply, %{state | data: data}}
end`,
  },
  {
    title: "Unhandled Messages Crash the GenServer",
    description:
      "If a GenServer receives a message it doesn't have a matching handle_info/2, handle_call/3, or handle_cast/2 clause for, it crashes with a FunctionClauseError. This commonly happens with messages from monitored processes, timers, or third-party libraries. Always add a catch-all clause.",
    code: `# Without a catch-all, unexpected messages crash the server:
# ** (FunctionClauseError) no function clause matching
#   in MyServer.handle_info/2

# GOOD: add catch-all clauses
def handle_info(msg, state) do
  require Logger
  Logger.warning("Unexpected message: \#{inspect(msg)}")
  {:noreply, state}
end

def handle_cast(msg, state) do
  require Logger
  Logger.warning("Unexpected cast: \#{inspect(msg)}")
  {:noreply, state}
end`,
  },
];

export default gotchas;
