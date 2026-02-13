import type { TopicContent } from "@/lib/types";
import questions from "./questions/debugging-and-tooling";

const debuggingAndTooling: TopicContent = {
  meta: {
    slug: "debugging-and-tooling",
    title: "Debugging & Tooling",
    description: "IO.inspect, dbg, IEx helpers, Observer, mix xref, and Erlang debugging tools",
    number: 29,
    active: true,
  },

  eli5: {
    analogyTitle: "The Detective's Toolkit",
    analogy:
      "Imagine you're a detective investigating a mystery. You don't just stare at the crime scene and hope the answer comes to you — you use tools. A magnifying glass to examine details up close, a fingerprint kit to see what touched what, a walkie-talkie to get information from other detectives, and a surveillance camera to watch events unfold in real time. Elixir gives you a similar toolkit for investigating what your code is doing.",
    items: [
      { label: "IO.inspect", description: "Your magnifying glass. Drop it anywhere to see what a value looks like right now, without disturbing anything." },
      { label: "dbg", description: "A slow-motion replay camera. It shows you each step of a pipeline so you can see exactly where things changed." },
      { label: "IEx helpers", description: "Your walkie-talkie to headquarters. Quick commands that fetch information — docs, types, process info — on demand." },
      { label: "Observer", description: "The surveillance room with monitors showing every process, how much memory they use, and what they're doing." },
      { label: "mix xref", description: "The evidence board with strings connecting suspects. It shows which modules depend on which others." },
    ],
    keyTakeaways: [
      "IO.inspect/2 is the most common debugging tool — it prints a value and returns it unchanged, so it works anywhere including inside pipelines.",
      "dbg/2 is a macro that shows source code and intermediate pipeline values, giving you much richer context than IO.inspect.",
      "IEx has dozens of helpers (i/1, h/1, r/1, break!/2) that make interactive exploration fast and productive.",
      ":observer.start() gives you a real-time GUI dashboard for your entire BEAM node.",
      "Elixir's debugging story is built on top of decades of battle-tested Erlang/OTP tooling.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "IO.inspect/2", color: "#6b46c1", examples: ["|> IO.inspect()", "|> IO.inspect(label: \"after map\")", "IO.inspect(value, limit: :infinity)"], description: "Print-and-pass-through debugging. Returns the value unchanged so it works in pipelines." },
      { name: "dbg/2", color: "#2563eb", examples: ["value |> dbg()", "pipeline |> step1() |> step2() |> dbg()"], description: "Macro that shows source code, intermediate pipeline steps, and results in one output." },
      { name: "IEx Helpers", color: "#d97706", examples: ["i(value)", "h(Module.func)", "r(Module)", "break!(Module, :func, 2)"], description: "Interactive shell commands for exploring values, docs, types, and setting breakpoints." },
      { name: "Observer", color: "#059669", examples: [":observer.start()", ":observer.start(:processes)", "Process.info(pid)"], description: "GUI and programmatic tools for monitoring processes, memory, and system health." },
      { name: "mix xref", color: "#e11d48", examples: ["mix xref graph", "mix xref callers Module", "mix xref graph --format dot"], description: "Static analysis tool showing compile-time and runtime dependencies between modules." },
      { name: "Erlang Tools", color: "#6b7280", examples: [":sys.get_state(pid)", ":recon.proc_count(:memory, 10)", ":debugger.start()"], description: "Low-level Erlang tools for process introspection, tracing, and system diagnostics." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "IO.inspect/2 — Your Everyday Debugging Friend",
        prose: [
          "IO.inspect/2 is the most-used debugging tool in Elixir. It prints a value to standard output using Kernel.inspect/2 formatting and then returns that value unchanged. This pass-through behavior is the key insight — it means you can insert it anywhere without breaking your code.",
          "The second argument is a keyword list of options. The :label option is especially useful when you have multiple inspect calls — it prefixes each output with a label so you can tell them apart. Other handy options include :limit (how many items to show in collections), :printable_limit (max characters for strings), and :charlists (how to display charlists).",
          "A common pattern is inserting IO.inspect into the middle of a pipe chain. Since it returns the value it received, the pipeline continues working normally while you see the intermediate data.",
        ],
        code: {
          title: "IO.inspect in pipelines",
          code: `# Basic usage
IO.inspect(%{name: "José", age: 30})
# Prints: %{name: "José", age: 30}
# Returns: %{name: "José", age: 30}

# With a label — essential when you have multiple inspects
[1, 2, 3]
|> Enum.map(&(&1 * 2))
|> IO.inspect(label: "after map")
|> Enum.filter(&(&1 > 3))
|> IO.inspect(label: "after filter")
|> Enum.sum()

# Output:
# after map: [2, 4, 6]
# after filter: [4, 6]
# => 10

# Useful options
IO.inspect(long_list, limit: :infinity)    # Show all items
IO.inspect(data, pretty: true)             # Pretty-print
IO.inspect('hello', charlists: :as_lists)  # Show as codepoints`,
          output: "10",
        },
      },
      {
        title: "dbg/2 — The Pipeline X-Ray",
        prose: [
          "Introduced in Elixir 1.14, dbg/2 is a macro that takes debugging further than IO.inspect. When called on a simple expression, it prints the source code of that expression alongside its result. But its real superpower is with pipelines.",
          "When you pipe into dbg(), it deconstructs the entire pipeline and shows you each step — the code at that step and the resulting value. This gives you a complete picture of how data transforms through your pipeline without needing to add IO.inspect at every step.",
          "dbg/2 is configurable — you can set a custom backend via Application.put_env(:elixir, :dbg_callback, {Module, :function, []}). In IEx, dbg uses a special backend that can optionally drop you into a pry session. In production, you'd typically strip dbg calls or configure them to use Logger.",
        ],
        code: {
          title: "dbg in action",
          code: `# Simple expression
dbg(1 + 2)
# [my_file.ex:1: (file)]
# 1 + 2 #=> 3

# Pipeline debugging — shows every step
"hello world"
|> String.split()
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
|> dbg()

# Output shows each step:
# [my_file.ex:5: (file)]
# "hello world" #=> "hello world"
# |> String.split() #=> ["hello", "world"]
# |> Enum.map(&String.capitalize/1) #=> ["Hello", "World"]
# |> Enum.join(" ") #=> "Hello World"

# You can also use dbg with binding()
x = 42
y = "hello"
dbg(binding())
# Shows: [x: 42, y: "hello"]`,
          output: "\"Hello World\"",
        },
      },
      {
        title: "IEx Helpers and Interactive Debugging",
        prose: [
          "IEx (Interactive Elixir) comes loaded with helper functions that make exploring and debugging a breeze. Type h() in IEx to see them all. The most useful ones are i/1 for value info, h/1 for documentation, r/1 for recompiling modules, and v/1 for recalling previous results.",
          "For breakpoint debugging, you have two options. IEx.pry/0 requires adding code to your source file — you insert require IEx; IEx.pry() where you want to pause. When execution hits that line, you get an interactive IEx session with access to all local variables. The other option is break!/2, which lets you set breakpoints from IEx without editing source code.",
          ":sys.get_state/1 is an Erlang function that retrieves the internal state of any OTP-compliant process. This is incredibly useful for debugging GenServers — you can peek at their state without needing a custom handle_call. But be cautious: it suspends the process briefly, so don't use it in production under load.",
        ],
        code: {
          title: "IEx helpers and pry",
          code: `# In IEx:
i("hello")
# Term: "hello"
# Data type: BitString
# Byte size: 5
# Description: This is a string (UTF-8 binary)

h(Enum.map/2)    # Show docs for Enum.map/2
t(GenServer)     # Show type definitions
r(MyModule)      # Recompile MyModule
v()              # Last expression result
v(-2)            # Result from 2 expressions ago

# Setting a breakpoint from IEx (no source edit needed)
break!(MyModule, :my_function, 2)
# Now calling MyModule.my_function/2 will pause

# Using IEx.pry (requires source edit)
defmodule MyModule do
  def calculate(x, y) do
    result = x + y
    require IEx; IEx.pry()   # Execution pauses here
    result * 2
  end
end

# Inspecting OTP process state
{:ok, pid} = MyGenServer.start_link([])
:sys.get_state(pid)
# => %{count: 0, items: []}`,
          output: "%{count: 0, items: []}",
        },
      },
      {
        title: "Observer and Process Monitoring",
        prose: [
          ":observer.start() launches a powerful GUI application built into the Erlang/OTP distribution. It gives you a real-time dashboard showing system overview (schedulers, memory, IO), process list (sortable by memory, reductions, message queue length), application supervision trees, ETS table contents, and more.",
          "When you can't use the GUI (for example, on a remote server), Process.info/1 and Process.info/2 give you programmatic access to the same data. You can check a process's memory usage, message queue length, current function, and linked processes. For production systems, the :recon library is the go-to tool — it provides safe versions of these diagnostics designed for use on live systems.",
          ":recon is a third-party library but widely considered essential for production Elixir. Its :recon.proc_count/2 finds the top N processes by a given metric, and :recon_trace lets you trace function calls in production with built-in safety limits to prevent overwhelming the system.",
        ],
        code: {
          title: "Observer and process inspection",
          code: `# Launch the Observer GUI
:observer.start()

# Programmatic process inspection
pid = Process.whereis(MyGenServer)
Process.info(pid, :memory)
# => {:memory, 2688}

Process.info(pid, :message_queue_len)
# => {:message_queue_len, 0}

Process.info(pid, [:memory, :message_queue_len, :current_function])
# => [memory: 2688, message_queue_len: 0,
#     current_function: {:gen_server, :loop, 7}]

# Using :recon (add {:recon, "~> 2.5"} to deps)
:recon.proc_count(:memory, 10)
# Top 10 processes by memory usage

:recon.proc_count(:message_queue_len, 5)
# Top 5 processes by mailbox size

# Get OTP state without a custom call
:sys.get_state(pid)
:sys.get_status(pid)   # More detailed status info`,
          output: "[memory: 2688, message_queue_len: 0, current_function: {:gen_server, :loop, 7}]",
        },
      },
      {
        title: "mix xref — Understanding Module Dependencies",
        prose: [
          "mix xref is a static analysis tool that shows how modules in your project depend on each other. This is crucial for understanding your codebase's structure, identifying circular dependencies, and optimizing compilation times.",
          "mix xref graph prints the full dependency graph. mix xref callers Module shows every module that calls into the given module. mix xref graph --format dot outputs the graph in DOT format, which you can visualize with Graphviz. The --label compile-connected flag is particularly useful — it shows only compile-time dependencies, which are the ones that trigger recompilation cascades.",
          "Understanding the difference between compile-time and runtime dependencies matters for build performance. If module A uses a struct from module B at compile time (e.g., %B{} in a pattern match), changes to B trigger recompilation of A. You can often convert these to runtime dependencies to speed up compilation.",
        ],
        code: {
          title: "mix xref usage",
          code: `# Show full dependency graph
# $ mix xref graph
# lib/my_app/accounts.ex
#   └── lib/my_app/accounts/user.ex (compile)
#   └── lib/my_app/repo.ex (runtime)

# Find who calls a specific module
# $ mix xref callers MyApp.Accounts
# lib/my_app_web/controllers/user_controller.ex
# lib/my_app/admin.ex

# Show only compile-time dependencies (recompilation triggers)
# $ mix xref graph --label compile-connected

# Export to DOT format for visualization
# $ mix xref graph --format dot
# $ dot -Tpng xref_graph.dot -o xref_graph.png

# Get statistics about your project's dependencies
# $ mix xref graph --format stats
# Tracked files: 45 (nodes)
# Compile dependencies: 78 (edges)
# Runtime dependencies: 112 (edges)`,
        },
      },
      {
        title: "Erlang Debugging Tools",
        prose: [
          "Elixir runs on the BEAM VM, which means you have access to decades of battle-tested Erlang debugging tools. :debugger.start() opens a GUI debugger with traditional breakpoint, step-through, and variable inspection capabilities. While most Elixir developers prefer IO.inspect and dbg for day-to-day work, the Erlang debugger is powerful for complex debugging sessions.",
          "Erlang's tracing system is one of the BEAM's most powerful features. :dbg (Erlang's dbg, not Elixir's) and :recon_trace let you trace function calls, message passing, and process events on live systems. The key advantage is you don't need to modify code or restart — you can attach to a running system and observe what's happening.",
          "For production debugging, always prefer :recon over raw Erlang tracing. :recon adds safety limits (like maximum trace count and rate limiting) that prevent you from accidentally overwhelming a production system with trace output. A runaway trace on a busy production node can bring it down — :recon prevents this.",
        ],
        code: {
          title: "Erlang debugging tools",
          code: `# Erlang GUI debugger
:debugger.start()
:int.ni(MyModule)          # Interpret module for debugging
:int.break(MyModule, 15)   # Set breakpoint at line 15

# Erlang's :dbg tracing (use :recon_trace in production)
:dbg.start()
:dbg.tracer()
:dbg.p(:all, :c)                        # Trace all processes, calls only
:dbg.tp(MyModule, :my_func, 2, [])      # Trace MyModule.my_func/2
# Now every call to MyModule.my_func/2 is logged
:dbg.stop()                              # Don't forget to stop!

# :recon_trace — safe production tracing
# Add {:recon, "~> 2.5"} to your deps
:recon_trace.calls({MyModule, :my_func, 2}, 100)
# Traces up to 100 calls then automatically stops

# Useful process diagnostics
Process.list() |> length()     # Total process count
:erlang.memory()               # Memory breakdown by type
:erlang.system_info(:process_count)   # Current process count
:erlang.system_info(:process_limit)   # Maximum allowed processes`,
          output: ":ok",
        },
      },
    ],
  },

  quiz: {
    questions,
  },

  practice: {
    problems: [
      {
        title: "Pipeline Detective",
        difficulty: "beginner",
        prompt:
          "You have a pipeline that's producing unexpected output. Use IO.inspect/2 with labels to find where the data goes wrong:\n\ndata = [\" Alice \", \"BOB\", \"  charlie  \", \"\"]\nresult = data\n|> Enum.map(&String.trim/1)\n|> Enum.reject(&(&1 == \"\"))\n|> Enum.map(&String.downcase/1)\n|> Enum.sort()\n\nAdd IO.inspect calls between each step to trace the data. What does each step produce?",
        hints: [
          { text: "Remember, IO.inspect/2 returns the value unchanged, so you can insert it between any two pipeline steps." },
          { text: "Use the :label option to distinguish each inspect call: |> IO.inspect(label: \"after trim\")" },
          { text: "You should have 4 IO.inspect calls — one after each transformation step." },
        ],
        solution: `data = [" Alice ", "BOB", "  charlie  ", ""]

result = data
|> IO.inspect(label: "input")
|> Enum.map(&String.trim/1)
|> IO.inspect(label: "after trim")
|> Enum.reject(&(&1 == ""))
|> IO.inspect(label: "after reject")
|> Enum.map(&String.downcase/1)
|> IO.inspect(label: "after downcase")
|> Enum.sort()
|> IO.inspect(label: "final result")

# Output:
# input: [" Alice ", "BOB", "  charlie  ", ""]
# after trim: ["Alice", "BOB", "charlie", ""]
# after reject: ["Alice", "BOB", "charlie"]
# after downcase: ["alice", "bob", "charlie"]
# final result: ["alice", "bob", "charlie"]`,
        walkthrough: [
          "We insert IO.inspect with a descriptive :label after each pipeline step.",
          "The input shows the raw data with leading/trailing whitespace and an empty string.",
          "After String.trim/1, whitespace is removed but the empty string remains.",
          "After Enum.reject, the empty string is filtered out.",
          "After String.downcase/1, everything is lowercase.",
          "The final sort arranges items alphabetically. Each IO.inspect call returns the value unchanged, so the pipeline works exactly as before — we just get to see inside it.",
        ],
      },
      {
        title: "dbg Pipeline Explorer",
        difficulty: "beginner",
        prompt:
          "Rewrite the following pipeline to use dbg/2 instead of multiple IO.inspect calls. Compare how the output differs.\n\norders = [\n  %{item: \"Book\", price: 12.99, quantity: 2},\n  %{item: \"Pen\", price: 1.50, quantity: 10},\n  %{item: \"Notebook\", price: 5.00, quantity: 3}\n]\n\nresult = orders\n|> Enum.map(fn o -> Map.put(o, :total, o.price * o.quantity) end)\n|> Enum.filter(fn o -> o.total > 10 end)\n|> Enum.map(fn o -> {o.item, o.total} end)\n|> Enum.sort_by(&elem(&1, 1), :desc)",
        hints: [
          { text: "With dbg, you only need to add it once at the end of the pipeline." },
          { text: "Replace the entire chain of IO.inspect calls with a single |> dbg() at the very end." },
          { text: "dbg will automatically show every intermediate step for you." },
        ],
        solution: `orders = [
  %{item: "Book", price: 12.99, quantity: 2},
  %{item: "Pen", price: 1.50, quantity: 10},
  %{item: "Notebook", price: 5.00, quantity: 3}
]

# Just add dbg() at the end — it shows every step!
orders
|> Enum.map(fn o -> Map.put(o, :total, o.price * o.quantity) end)
|> Enum.filter(fn o -> o.total > 10 end)
|> Enum.map(fn o -> {o.item, o.total} end)
|> Enum.sort_by(&elem(&1, 1), :desc)
|> dbg()

# dbg output shows each step:
# orders #=> [%{item: "Book", ...}, ...]
# |> Enum.map(...) #=> [%{item: "Book", total: 25.98, ...}, ...]
# |> Enum.filter(...) #=> [%{item: "Book", total: 25.98}, %{item: "Pen", total: 15.0}, ...]
# |> Enum.map(...) #=> [{"Book", 25.98}, {"Pen", 15.0}, {"Notebook", 15.0}]
# |> Enum.sort_by(...) #=> [{"Book", 25.98}, {"Notebook", 15.0}, {"Pen", 15.0}]`,
        walkthrough: [
          "dbg() only needs to be added once at the end of the pipeline — it automatically traces every step.",
          "Unlike IO.inspect which shows just the data, dbg also shows the source code of each step alongside its result.",
          "This makes it immediately clear which transformation produced which output, without needing to count your label names.",
          "For quick debugging, dbg is often the better choice. For permanent logging or production code, IO.inspect with labels is more appropriate since dbg is meant for development only.",
        ],
      },
      {
        title: "Process Inspector",
        difficulty: "intermediate",
        prompt:
          "Write a function debug_process/1 that takes a PID and returns a map with useful debugging information about that process. Include: registered name (if any), current function, memory usage, message queue length, status, and links. Handle the case where the process doesn't exist.",
        hints: [
          { text: "Process.info/2 accepts a list of atoms to get multiple properties at once." },
          { text: "Useful info keys: :registered_name, :current_function, :memory, :message_queue_len, :status, :links" },
          { text: "Process.info/1 returns nil if the process is dead. Use this for your error handling." },
          { text: "You can use Enum.into/2 to convert the keyword list from Process.info into a map." },
        ],
        solution: `defmodule ProcessDebugger do
  @info_keys [
    :registered_name,
    :current_function,
    :memory,
    :message_queue_len,
    :status,
    :links
  ]

  def debug_process(pid) when is_pid(pid) do
    case Process.info(pid, @info_keys) do
      nil ->
        {:error, :process_not_found}

      info ->
        debug_info =
          info
          |> Enum.into(%{})
          |> Map.put(:pid, pid)
          |> Map.put(:alive?, Process.alive?(pid))
          |> format_registered_name()

        {:ok, debug_info}
    end
  end

  defp format_registered_name(%{registered_name: []} = info) do
    Map.put(info, :registered_name, nil)
  end

  defp format_registered_name(info), do: info
end

# Usage:
# {:ok, pid} = GenServer.start_link(MyServer, [])
# ProcessDebugger.debug_process(pid)
# => {:ok, %{
#      pid: #PID<0.123.0>,
#      alive?: true,
#      registered_name: nil,
#      current_function: {:gen_server, :loop, 7},
#      memory: 2688,
#      message_queue_len: 0,
#      status: :waiting,
#      links: [#PID<0.100.0>]
#    }}`,
        walkthrough: [
          "We define a list of info keys we care about — these are the most useful for debugging.",
          "Process.info/2 returns nil if the process doesn't exist, so we pattern match on that for error handling.",
          "When the process is alive, Process.info returns a keyword list like [{:memory, 2688}, ...] which we convert to a map with Enum.into.",
          "We add the PID itself and an alive? check to the map for convenience.",
          "The registered_name field returns an empty list [] when the process has no name, so we normalize that to nil for cleaner output.",
          "This function demonstrates a common pattern: wrapping low-level Erlang/OTP diagnostics in a friendlier Elixir interface.",
        ],
      },
      {
        title: "Debugging a Bottleneck",
        difficulty: "advanced",
        prompt:
          "Write a module BottleneckFinder that can identify processes with growing message queues. Implement:\n1. find_busy/1 — takes a threshold and returns all processes whose message queue length exceeds it\n2. monitor_growth/2 — takes a PID and interval in ms, checks the message queue twice (with the interval between), and reports whether the queue is growing, shrinking, or stable\n3. Format the output as a readable report string.",
        hints: [
          { text: "Process.list() gives you all PIDs in the system. Use Process.info/2 to check each one." },
          { text: "For monitor_growth, use Process.sleep/1 between the two measurements." },
          { text: "Remember to handle the case where a process dies between measurements." },
          { text: "Consider using Enum.filter and Enum.map to build the list of busy processes." },
        ],
        solution: `defmodule BottleneckFinder do
  def find_busy(threshold \\\\ 100) do
    Process.list()
    |> Enum.map(fn pid ->
      case Process.info(pid, [:message_queue_len, :registered_name, :current_function]) do
        nil -> nil
        info -> {pid, Enum.into(info, %{})}
      end
    end)
    |> Enum.reject(&is_nil/1)
    |> Enum.filter(fn {_pid, info} ->
      info.message_queue_len > threshold
    end)
    |> Enum.sort_by(fn {_pid, info} -> info.message_queue_len end, :desc)
    |> Enum.map(fn {pid, info} ->
      %{
        pid: pid,
        name: info[:registered_name],
        queue_length: info.message_queue_len,
        current_function: info.current_function
      }
    end)
  end

  def monitor_growth(pid, interval_ms \\\\ 1000) do
    case Process.info(pid, :message_queue_len) do
      nil ->
        {:error, "Process #{inspect(pid)} is not alive"}

      {:message_queue_len, initial} ->
        Process.sleep(interval_ms)

        case Process.info(pid, :message_queue_len) do
          nil ->
            {:error, "Process #{inspect(pid)} died during monitoring"}

          {:message_queue_len, final} ->
            diff = final - initial
            trend = cond do
              diff > 0 -> :growing
              diff < 0 -> :shrinking
              true -> :stable
            end

            {:ok, %{
              pid: pid,
              initial: initial,
              final: final,
              diff: diff,
              trend: trend,
              interval_ms: interval_ms
            }}
        end
    end
  end

  def report(threshold \\\\ 100) do
    busy = find_busy(threshold)

    if Enum.empty?(busy) do
      "No processes with message queue > #{threshold}"
    else
      header = "Found #{length(busy)} process(es) above threshold #{threshold}:\\n"

      lines =
        Enum.map(busy, fn p ->
          name = if p.name, do: " (#{p.name})", else: ""
          "  #{inspect(p.pid)}#{name} — queue: #{p.queue_length}, fn: #{inspect(p.current_function)}"
        end)

      header <> Enum.join(lines, "\\n")
    end
  end
end

# Usage:
# BottleneckFinder.find_busy(50)
# BottleneckFinder.monitor_growth(pid, 2000)
# IO.puts(BottleneckFinder.report(10))`,
        walkthrough: [
          "find_busy/1 iterates over all system processes, collects their message queue lengths, and filters for those above the threshold. We sort by queue length (descending) so the worst offenders appear first.",
          "We handle dead processes by checking for nil returns from Process.info — processes can die at any time in a concurrent system.",
          "monitor_growth/2 takes two snapshots of a process's message queue with a sleep between them. The difference tells us whether messages are accumulating (growing), being processed faster than they arrive (shrinking), or in equilibrium (stable).",
          "The report/1 function formats find_busy results into a human-readable string, including process names when available.",
          "This kind of diagnostic tooling is similar to what :recon provides but simplified for learning. In production, prefer :recon.proc_count(:message_queue_len, N) which is battle-tested and handles edge cases.",
        ],
      },
    ],
  },
};

export default debuggingAndTooling;
