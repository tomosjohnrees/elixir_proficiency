import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "try/rescue Is for Exceptions, Not Expected Errors",
    description:
      "Elixir convention distinguishes between exceptions (unexpected failures) and expected errors. Expected errors should use {:ok, value}/{:error, reason} tuples and pattern matching. Reserve try/rescue for truly exceptional situations like malformed external input. Overusing rescue leads to defensive, hard-to-read code that hides real bugs.",
    code: `# BAD: using rescue for expected outcomes
def find_user(id) do
  try do
    Repo.get!(User, id)
  rescue
    Ecto.NoResultsError -> nil
  end
end

# GOOD: use the non-bang version and pattern match
def find_user(id) do
  case Repo.get(User, id) do
    nil -> {:error, :not_found}
    user -> {:ok, user}
  end
end

# rescue IS appropriate for truly unexpected failures:
def parse_external_data(raw) do
  try do
    Jason.decode!(raw)
  rescue
    Jason.DecodeError -> {:error, :invalid_json}
  end
end`,
  },
  {
    title: "catch vs rescue: They Handle Different Things",
    description:
      "rescue handles Elixir exceptions (structs raised with raise/1). catch handles thrown values (from throw/1) and process exits (from exit/1). They are not interchangeable. If you rescue but the error was a throw or exit, your rescue block won't execute and the error propagates.",
    code: `# rescue catches exceptions from raise
try do
  raise ArgumentError, "bad input"
rescue
  e in ArgumentError -> "Got exception: \#{e.message}"
end

# catch handles throw values
try do
  throw(:abort)
catch
  :throw, value -> "Got throw: \#{inspect(value)}"
end

# catch handles exits
try do
  exit(:shutdown)
catch
  :exit, reason -> "Got exit: \#{inspect(reason)}"
end

# WRONG: rescue does NOT catch throws or exits
try do
  throw(:oops)
rescue
  _ -> "This never runs!"
end
# ** (throw) :oops  — the throw propagates past rescue`,
  },
  {
    title: '"Let It Crash" Doesn\'t Mean Ignore Errors',
    description:
      'The "let it crash" philosophy means you should let processes fail and rely on supervisors to restart them, rather than writing defensive try/rescue around everything. It does NOT mean you should ignore error conditions. You still need to handle expected errors with {:ok, _}/{:error, _} tuples. "Let it crash" applies to unexpected, unrecoverable failures.',
    code: `# "Let it crash" — DON'T wrap everything in try/rescue
# BAD:
def handle_call(:work, _from, state) do
  try do
    result = do_work(state)
    {:reply, result, state}
  rescue
    _ -> {:reply, :error, state}  # hides the real problem
  end
end

# GOOD: let unexpected crashes bubble up to supervisor
def handle_call(:work, _from, state) do
  result = do_work(state)
  {:reply, result, state}
end
# If do_work crashes, the GenServer restarts cleanly

# But DO handle expected error cases explicitly:
def handle_call({:lookup, key}, _from, state) do
  case Map.fetch(state, key) do
    {:ok, value} -> {:reply, {:ok, value}, state}
    :error -> {:reply, {:error, :not_found}, state}
  end
end`,
  },
  {
    title: "with Statements Don't Rescue Exceptions",
    description:
      "The with special form matches on return values using pattern matching. It handles {:error, _} tuples gracefully via the else clause, but it does NOT catch exceptions. If any expression in a with chain raises, the exception propagates straight through — the else clause is never reached.",
    code: `# with handles {:error, _} tuples — not exceptions
with {:ok, data} <- fetch_data(),
     {:ok, parsed} <- parse(data),
     {:ok, result} <- process(parsed) do
  {:ok, result}
else
  {:error, reason} -> {:error, reason}  # handles error tuples
end

# But if parse/1 RAISES instead of returning {:error, _}:
with {:ok, data} <- fetch_data(),
     {:ok, parsed} <- Jason.decode!(data) do  # raises!
  {:ok, parsed}
else
  {:error, _} -> {:error, :failed}
  # This else NEVER runs on an exception
end
# ** (Jason.DecodeError) — exception propagates!

# Fix: use non-bang version that returns tuples
with {:ok, data} <- fetch_data(),
     {:ok, parsed} <- Jason.decode(data) do
  {:ok, parsed}
else
  {:error, _} -> {:error, :parse_failed}
end`,
  },
];

export default gotchas;
