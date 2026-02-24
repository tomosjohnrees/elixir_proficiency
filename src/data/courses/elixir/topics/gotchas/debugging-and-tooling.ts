import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "IO.inspect Returns Its Argument — Safe to Pipe",
    description:
      "Unlike print functions in many languages, IO.inspect/2 returns the value it inspects, not :ok. This makes it safe to insert anywhere in a pipeline for debugging without changing the program's behavior. However, remember to remove IO.inspect calls before committing — they are meant for development only.",
    code: `# IO.inspect returns its argument, so pipelines keep working
[1, 2, 3]
|> Enum.map(&(&1 * 2))
|> IO.inspect(label: "after map")   # prints and passes through
|> Enum.filter(&(&1 > 3))
|> IO.inspect(label: "after filter") # prints and passes through
|> Enum.sum()

# Output:
# after map: [2, 4, 6]
# after filter: [4, 6]
#=> 10

# Compare: IO.puts returns :ok and would break the pipeline
# [1, 2, 3] |> IO.puts() |> Enum.sum()
# ** (Protocol.UndefinedError) — can't enumerate :ok`,
  },
  {
    title: ":observer.start() in Production Can Overwhelm the Node",
    description:
      "The Erlang observer GUI is an incredibly powerful tool for inspecting process trees, memory, and ETS tables. However, running :observer.start() on a production node with thousands of processes can cause significant load — it polls process info regularly and rendering the process list is expensive. For production, prefer lightweight tools like :recon or connect observer from a remote node.",
    code: `# In development IEx — perfectly fine
:observer.start()

# In production — prefer targeted inspection
# Instead of observer, use specific functions:
Process.list() |> length()    # Count processes
:erlang.memory()              # Memory breakdown
:recon.proc_count(:memory, 5) # Top 5 by memory

# Or connect observer remotely from a dev machine:
# On production: --name prod@10.0.0.1 --cookie secret
# On dev machine:
# iex --name dev@10.0.0.2 --cookie secret
# Node.connect(:"prod@10.0.0.1")
# :observer.start()  # Now observes the remote node`,
  },
  {
    title: "dbg() Macro Replaces IO.inspect for Pipeline Debugging",
    description:
      "Since Elixir 1.14, the dbg/1 macro provides superior pipeline debugging compared to IO.inspect. When applied to a pipeline, dbg prints every intermediate step with its result, not just a single point. It also shows the file, line number, and the code being evaluated. Note that dbg is a macro, not a function, so it has special compilation behavior.",
    code: `# dbg on a pipeline shows EVERY step
[1, 2, 3]
|> Enum.map(&(&1 * 2))
|> Enum.filter(&(&1 > 3))
|> Enum.sum()
|> dbg()

# Output shows each pipeline step:
# [iex:1]
# [1, 2, 3] #=> [1, 2, 3]
# |> Enum.map(&(&1 * 2)) #=> [2, 4, 6]
# |> Enum.filter(&(&1 > 3)) #=> [4, 6]
# |> Enum.sum() #=> 10

# Compare: IO.inspect only shows one point
# You'd need multiple IO.inspect calls for the same info`,
  },
  {
    title: "recompile() in IEx Doesn't Reload Config",
    description:
      "Running recompile() in an IEx session recompiles changed source files, but it does not re-evaluate config files. If you've changed config/config.exs, dev.exs, or runtime.exs, those changes won't take effect until you restart the IEx session entirely. This also applies to changes in mix.exs dependencies.",
    code: `# After editing lib/my_app/worker.ex:
iex> recompile()
# Recompiling 1 file (.ex)
# :ok — code changes are picked up

# After editing config/dev.exs:
iex> recompile()
# :ok — but config changes are NOT loaded!

# Application.get_env still returns the old values
iex> Application.get_env(:my_app, :some_setting)
#=> old_value  (not the new one)

# You must restart the session:
# Ctrl+C, Ctrl+C, then iex -S mix`,
  },
];

export default gotchas;
