import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does IO.inspect/2 return?",
    options: [
      { label: ":ok" },
      { label: "The inspected value itself", correct: true },
      { label: "A string representation of the value" },
      { label: "nil" },
    ],
    explanation:
      "IO.inspect/2 prints the value to standard output and then returns the value unchanged. This is what makes it so useful for debugging pipelines — you can insert it anywhere without changing the data flow.",
  },
  {
    question: "How do you add a label to IO.inspect/2 output?",
    options: [
      { label: "IO.inspect(value, label: \"my label\")", correct: true },
      { label: "IO.inspect(\"my label\", value)" },
      { label: "IO.inspect(value, \"my label\")" },
      { label: "IO.labeled_inspect(value, \"my label\")" },
    ],
    explanation:
      "IO.inspect/2 accepts a keyword list as its second argument. The :label option prepends a label to the output, making it easy to identify which inspect call produced which output when you have multiple in your code.",
  },
  {
    question: "What is the primary advantage of dbg/2 over IO.inspect/2?",
    options: [
      { label: "It's faster" },
      { label: "It shows the code being debugged along with intermediate values in a pipeline", correct: true },
      { label: "It writes to a log file instead of stdout" },
      { label: "It only works in test environments" },
    ],
    explanation:
      "dbg/2 (introduced in Elixir 1.14) is a macro that shows the source code expression being debugged alongside its result. In pipelines, it shows each step's intermediate value, making it much more informative than IO.inspect/2 for tracing data transformations.",
  },
  {
    question: "Which IEx helper shows detailed information about a value's type?",
    options: [
      { label: "h/1" },
      { label: "t/1" },
      { label: "i/1", correct: true },
      { label: "v/1" },
    ],
    explanation:
      "The i/1 helper in IEx shows detailed information about a value including its type, description, and relevant protocols it implements. h/1 shows documentation, t/1 shows type definitions, and v/1 retrieves previous expression results.",
  },
  {
    question: "What does :observer.start() provide?",
    options: [
      { label: "A command-line debugger" },
      { label: "A graphical tool for monitoring BEAM processes, memory, and applications", correct: true },
      { label: "A test runner with code coverage" },
      { label: "A log viewer for production systems" },
    ],
    explanation:
      ":observer.start() launches a GUI application that shows real-time information about your BEAM node — including process lists, memory usage, application trees, ETS tables, and system statistics. It's one of the most powerful built-in debugging tools.",
  },
  {
    question: "What does mix xref graph do?",
    options: [
      { label: "Shows a visual graph of your supervision tree" },
      { label: "Shows compile-time and runtime dependencies between modules", correct: true },
      { label: "Generates a call graph for performance profiling" },
      { label: "Maps database relationships in Ecto schemas" },
    ],
    explanation:
      "mix xref graph outputs the dependency graph between modules in your project. It shows both compile-time and runtime dependencies, helping you understand coupling between modules and identify potential circular dependencies or unnecessary recompilation triggers.",
  },
  {
    question: "What does :sys.get_state/1 do?",
    options: [
      { label: "Returns the state of the entire BEAM VM" },
      { label: "Returns the internal state of a GenServer or other OTP process", correct: true },
      { label: "Returns the state of all supervisors" },
      { label: "Returns the current environment variables" },
    ],
    explanation:
      ":sys.get_state/1 retrieves the internal state of any OTP-compliant process (GenServer, GenStateMachine, etc.) without needing to implement a custom callback. It's intended for debugging purposes — not for production use, as it temporarily suspends the target process.",
  },
  {
    question: "Which IEx helper lets you recompile a module without leaving the shell?",
    options: [
      { label: "c/1" },
      { label: "r/1", correct: true },
      { label: "l/1" },
      { label: "compile/1" },
    ],
    explanation:
      "r/1 recompiles and reloads a module in IEx. For example, r(MyModule) will recompile the source file and reload the module. c/1 compiles a file, and l/1 loads an already-compiled module from a beam file.",
  },
  {
    question: "What happens when you pipe into dbg/2 in a pipeline?",
    options: [
      { label: "It only shows the final result" },
      { label: "It shows every intermediate step in the pipeline with its result", correct: true },
      { label: "It raises an error because dbg doesn't work in pipelines" },
      { label: "It pauses execution and opens an interactive debugger" },
    ],
    explanation:
      "When dbg/2 is placed at the end of a pipeline, it prints every step of the pipeline along with the intermediate result at each stage. This makes it incredibly powerful for understanding how data transforms through a sequence of pipe operations.",
  },
  {
    question: "Which tool would you use to find all callers of a specific module?",
    options: [
      { label: "mix compile --warnings-as-errors" },
      { label: "mix xref callers ModuleName", correct: true },
      { label: "mix deps.tree" },
      { label: "mix test --trace" },
    ],
    explanation:
      "mix xref callers ModuleName lists every location in your project that references the given module. This is extremely useful when refactoring — you can quickly find all the places that depend on a module before making changes.",
  },
  {
    question: "What is the purpose of the IEx.pry/0 function?",
    options: [
      { label: "It prints the current process info" },
      { label: "It sets a breakpoint that drops you into an interactive IEx session at that point in the code", correct: true },
      { label: "It monitors a process for crashes" },
      { label: "It compiles the current file with debug info" },
    ],
    explanation:
      "IEx.pry/0 works like a breakpoint in traditional debuggers. When execution reaches it, the process pauses and you get an interactive IEx session with access to all local variables at that point. You need to run your code with iex -S mix for it to work.",
  },
  {
    question: "What does the --trace flag do when running mix test?",
    options: [
      { label: "Enables code tracing for all modules" },
      { label: "Runs tests synchronously and shows each test name as it executes", correct: true },
      { label: "Generates a stack trace file for failed tests" },
      { label: "Enables Erlang's built-in tracer" },
    ],
    explanation:
      "mix test --trace runs all tests synchronously (one at a time) and prints each test's name as it runs. This is helpful for identifying slow tests, debugging test ordering issues, or finding tests that depend on shared state.",
  },
  {
    question: "How do you inspect a value in the middle of a pipeline without breaking it?",
    options: [
      { label: "Use IO.puts/1" },
      { label: "Use IO.inspect/2 — it returns the value it was given", correct: true },
      { label: "Use Logger.debug/1" },
      { label: "You can't — you have to break the pipeline" },
    ],
    explanation:
      "IO.inspect/2 is the go-to tool because it prints the value AND returns it unchanged. This means you can insert |> IO.inspect(label: \"step\") anywhere in a pipeline without affecting the data flow. IO.puts and Logger.debug both return :ok, which would break the pipeline.",
  },
  {
    question: "What does :recon.proc_count/2 help you find?",
    options: [
      { label: "The number of processes in the system" },
      { label: "The top N processes ranked by a given attribute (memory, message_queue_len, etc.)", correct: true },
      { label: "The count of function calls in a process" },
      { label: "The number of active connections" },
    ],
    explanation:
      ":recon.proc_count/2 returns the top N processes sorted by a given attribute like :memory, :message_queue_len, :reductions, etc. This is invaluable for diagnosing production issues — for example, finding processes that are consuming the most memory or have the longest message queues.",
  },
  {
    question: "What is the trick question: does IO.inspect/2 modify the value it prints?",
    options: [
      { label: "Yes, it converts the value to a string" },
      { label: "Yes, it wraps it in an :ok tuple" },
      { label: "No, it returns the original value completely unchanged", correct: true },
      { label: "It depends on the :charlists option" },
    ],
    explanation:
      "This is a common misconception. IO.inspect/2 never modifies the value — it prints a representation to stdout and returns the exact same value. The options like :charlists and :limit only affect the printed representation, not the returned value. This pass-through behavior is the whole reason it works in pipelines.",
  },
  {
    question: "Which command shows unused dependencies in your project?",
    options: [
      { label: "mix deps.clean --unused" },
      { label: "mix xref graph --format stats" },
      { label: "mix deps.unlock --unused", correct: true },
      { label: "mix deps.tree --unused" },
    ],
    explanation:
      "mix deps.unlock --unused removes entries from mix.lock for dependencies that are no longer listed in mix.exs. While not a direct 'find unused deps' command, combined with mix xref you can identify modules from dependencies that aren't referenced in your code.",
  },
  {
    question: "What is the difference between break!/2 and IEx.pry/0?",
    options: [
      { label: "They are identical" },
      { label: "break!/2 sets a breakpoint on a function without modifying source code, while IEx.pry/0 requires adding code to your source file", correct: true },
      { label: "IEx.pry/0 is for production, break!/2 is for development" },
      { label: "break!/2 only works in test environments" },
    ],
    explanation:
      "break!/2 (or break!/4 with module, function, arity, and optional stops) sets a breakpoint dynamically from IEx without editing source code. IEx.pry/0 requires you to add require IEx; IEx.pry() directly in your source file. Both drop you into an interactive session, but break! is less invasive.",
  },
  {
    question: "What does Process.info/2 return when called with :message_queue_len?",
    options: [
      { label: "The actual messages in the queue" },
      { label: "The number of messages waiting in the process mailbox", correct: true },
      { label: "The maximum allowed queue length" },
      { label: "The total messages ever received" },
    ],
    explanation:
      "Process.info(pid, :message_queue_len) returns a tuple like {:message_queue_len, 42} showing how many messages are waiting in the process mailbox. A growing message queue is a classic sign of a bottleneck — the process can't handle messages as fast as they arrive.",
  },
];

export default questions;
