import type { TopicContent } from "@/lib/types";

const errorHandling: TopicContent = {
  meta: {
    slug: "error-handling",
    title: "Error Handling",
    description: "Try/rescue, throw/catch, and the \"let it crash\" philosophy",
    number: 18,
    active: true,
  },

  eli5: {
    analogyTitle: "The Fire Station",
    analogy:
      "Think about how a city handles emergencies. Most of the time, buildings don't catch fire — so you don't make every person carry a fire extinguisher everywhere. Instead, you have a fire station with trained firefighters. If a building does catch fire, you let the firefighters handle it and rebuild. You don't try to fireproof every single room in advance.",
    items: [
      { label: "Tagged Tuples", description: "The everyday approach. Most doors have a sign that says 'open' or 'closed.' Functions return {:ok, result} or {:error, reason} so you always know what happened — no surprises, no alarms." },
      { label: "Pattern Matching", description: "Reading the sign on the door. You check whether you got :ok or :error and handle each case. The with statement chains multiple doors together so you only deal with errors once at the end." },
      { label: "Try/Rescue", description: "The fire extinguisher. You use it for truly exceptional situations — things that shouldn't happen in normal operation. Like catching a fire before it spreads to the rest of the building." },
      { label: "Let It Crash", description: "The fire station philosophy. Instead of trying to prevent every possible failure inside a process, let it crash and have a supervisor restart it fresh. The system recovers automatically." },
    ],
    keyTakeaways: [
      "Elixir prefers tagged tuples ({:ok, value} / {:error, reason}) over exceptions for expected errors.",
      "Use pattern matching and the with statement to handle tagged tuple results cleanly.",
      "try/rescue is for truly exceptional situations — not for normal control flow.",
      "The 'let it crash' philosophy means supervisors handle recovery, not defensive code.",
      "Functions ending in ! (like File.read!) raise exceptions, their non-bang counterparts return tagged tuples.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Tagged Tuples", color: "#6b46c1", examples: ["{:ok, value}", "{:error, reason}", "case/with"], description: "The primary error handling mechanism. Functions return a tuple that tells you whether the operation succeeded or failed, and why." },
      { name: "with Statement", color: "#2563eb", examples: ["with {:ok, a} <- ...", "else clause", "happy path"], description: "Chains multiple operations that return tagged tuples. Only continues if each step matches. Failures fall through to the else clause." },
      { name: "try/rescue", color: "#d97706", examples: ["try do", "rescue e ->", "after cleanup"], description: "Catches exceptions (raised with raise). Use sparingly — only for truly unexpected situations like broken connections or corrupted data." },
      { name: "throw/catch", color: "#059669", examples: ["throw value", "catch value", "rare escape hatch"], description: "A rare escape mechanism for breaking out of deeply nested code. Almost never needed in practice — tagged tuples and with are better." },
      { name: "Let It Crash", color: "#e11d48", examples: ["Supervisor", "restart", "clean state"], description: "The OTP philosophy: let processes crash and have supervisors restart them. Simpler than trying to handle every edge case defensively." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Tagged Tuples: The Elixir Way",
        prose: [
          "In Elixir, the standard way to handle expected errors is with tagged tuples. A function returns {:ok, result} on success and {:error, reason} on failure. This is explicit, composable, and doesn't disrupt control flow.",
          "You'll see this pattern everywhere in the standard library: File.read/1, Map.fetch/2, GenServer.start_link/3, and more. By convention, the reason is usually an atom like :not_found or :timeout, or a string with more detail.",
        ],
        code: {
          title: "Working with tagged tuples",
          code: `# Standard library examples
File.read("exists.txt")
# => {:ok, "contents"}

File.read("nope.txt")
# => {:error, :enoent}

Map.fetch(%{a: 1}, :a)
# => {:ok, 1}

Map.fetch(%{a: 1}, :b)
# => :error

# Your own functions should follow this pattern
defmodule Account do
  def withdraw(balance, amount) when amount > 0 do
    if balance >= amount do
      {:ok, balance - amount}
    else
      {:error, :insufficient_funds}
    end
  end

  def withdraw(_balance, _amount) do
    {:error, :invalid_amount}
  end
end

# Handle results with case
case Account.withdraw(100, 30) do
  {:ok, new_balance} -> IO.puts("Balance: \#{new_balance}")
  {:error, reason} -> IO.puts("Failed: \#{reason}")
end`,
          output: "Balance: 70",
        },
      },
      {
        title: "The with Statement",
        prose: [
          "When you need to chain multiple operations that each return tagged tuples, nested case statements get ugly fast. The with statement solves this elegantly — it lets you write the happy path as a sequence of pattern matches and handles all errors in one else block.",
          "Each <- clause attempts a pattern match. If it succeeds, the matched value is available to later clauses. If any match fails, with stops and either falls through to the else block or returns the non-matching value.",
        ],
        code: {
          title: "Chaining with the with statement",
          code: `# Without with — deeply nested cases
def create_user_ugly(params) do
  case validate_name(params) do
    {:ok, name} ->
      case validate_email(params) do
        {:ok, email} ->
          case insert_user(name, email) do
            {:ok, user} -> {:ok, user}
            {:error, reason} -> {:error, reason}
          end
        {:error, reason} -> {:error, reason}
      end
    {:error, reason} -> {:error, reason}
  end
end

# With 'with' — clean and flat
def create_user(params) do
  with {:ok, name} <- validate_name(params),
       {:ok, email} <- validate_email(params),
       {:ok, user} <- insert_user(name, email) do
    {:ok, user}
  else
    {:error, :invalid_name} -> {:error, "Name is required"}
    {:error, :invalid_email} -> {:error, "Email is invalid"}
    {:error, :db_error} -> {:error, "Could not save user"}
  end
end

# You can also use bare matches (=) in with
with {:ok, data} <- File.read("config.json"),
     {:ok, parsed} <- Jason.decode(data),
     %{"port" => port} <- parsed do
  {:ok, port}
end`,
          output: "{:ok, 4000}",
        },
      },
      {
        title: "Bang Functions",
        prose: [
          "Many standard library functions come in pairs: a regular version that returns tagged tuples and a bang (!) version that raises on error. File.read/1 returns {:ok, content} or {:error, reason}, while File.read!/1 returns the content directly or raises a File.Error.",
          "Use bang functions when failure is truly unexpected and you want to crash immediately. Use regular functions when failure is a normal possibility you need to handle. In pipelines, bang functions are often more convenient since you don't need to unwrap tuples.",
        ],
        code: {
          title: "Regular vs bang functions",
          code: `# Regular — returns tagged tuple
File.read("data.txt")
# => {:ok, "contents"} or {:error, :enoent}

# Bang — returns value or raises
File.read!("data.txt")
# => "contents" or ** (File.Error)

# Bang functions are great in pipelines
"data.txt"
|> File.read!()
|> String.split("\\n")
|> Enum.count()

# Define your own bang function
defmodule Config do
  def fetch(key) do
    case Application.fetch_env(:my_app, key) do
      {:ok, value} -> {:ok, value}
      :error -> {:error, "missing config: \#{key}"}
    end
  end

  def fetch!(key) do
    case fetch(key) do
      {:ok, value} -> value
      {:error, message} -> raise message
    end
  end
end`,
          output: "42",
        },
      },
      {
        title: "try/rescue for Exceptions",
        prose: [
          "Exceptions in Elixir are raised with raise and caught with try/rescue. But unlike many other languages, exceptions are not the primary error handling tool. They're reserved for truly exceptional situations — programmer errors, broken invariants, or failures that indicate something is fundamentally wrong.",
          "The after block runs regardless of whether an exception was raised, making it useful for cleanup. You can match on specific exception types or use a catch-all. Custom exceptions are defined with defexception.",
        ],
        code: {
          title: "try/rescue and custom exceptions",
          code: `# Basic try/rescue
try do
  String.to_integer("not a number")
rescue
  ArgumentError ->
    IO.puts("That's not a number!")
    0
end

# Binding the exception
try do
  raise "something went wrong"
rescue
  e in RuntimeError ->
    IO.puts("Caught: \#{e.message}")
end

# The after block always runs
try do
  file = File.open!("data.txt", [:write])
  IO.write(file, "hello")
after
  # Cleanup runs whether or not an error occurred
  File.close(file)
end

# Custom exceptions
defmodule InsufficientFundsError do
  defexception [:amount, :balance]

  @impl true
  def message(%{amount: amount, balance: balance}) do
    "Cannot withdraw \#{amount}, only \#{balance} available"
  end
end

raise InsufficientFundsError, amount: 100, balance: 50
# ** (InsufficientFundsError) Cannot withdraw 100, only 50 available`,
          output: "Caught: something went wrong",
        },
      },
      {
        title: "throw/catch and Exit Signals",
        prose: [
          "throw/catch is an escape hatch you'll almost never need. It's for breaking out of a computation when there's no other clean way — like aborting a deep recursive traversal. In practice, tagged tuples and with handle nearly all cases better.",
          "Exit signals (:exit) are different — they're how processes terminate. Process.exit/2 sends an exit signal, and you can catch them with try/catch. But normally you let supervisors handle process exits rather than catching them yourself.",
        ],
        code: {
          title: "throw/catch and exit signals",
          code: `# throw/catch — rare escape hatch
result =
  try do
    Enum.each(1..1_000_000, fn n ->
      if rem(n, 13) == 0 and rem(n, 7) == 0 do
        throw({:found, n})
      end
    end)
    :not_found
  catch
    {:found, n} -> {:ok, n}
  end
# => {:ok, 91}

# Better approach: just use Enum.find!
Enum.find(1..1_000_000, fn n ->
  rem(n, 13) == 0 and rem(n, 7) == 0
end)
# => 91

# Catching exit signals (rare — usually let supervisors handle)
try do
  exit(:shutdown)
catch
  :exit, reason -> IO.puts("Caught exit: \#{reason}")
end

# Catching exceptions and exits together
try do
  # some code
rescue
  e in RuntimeError -> IO.puts("Exception: \#{e.message}")
catch
  :exit, reason -> IO.puts("Exit: \#{reason}")
  :throw, value -> IO.puts("Throw: \#{inspect(value)}")
end`,
          output: "{:ok, 91}",
        },
      },
      {
        title: "The Let It Crash Philosophy",
        prose: [
          "Elixir (via OTP) embraces a powerful idea: don't try to handle every possible error defensively. Instead, let the process crash and have a supervisor restart it in a clean state. This sounds scary but it's actually simpler and more robust than trying to anticipate every failure mode.",
          "The key insight is that most errors leave a process in a corrupted or unknown state. Restarting gives you a known good state. With supervisors watching your processes, crashes become routine recovery events rather than catastrophes. This is how Erlang systems achieve 99.9999999% uptime.",
        ],
        code: {
          title: "Let it crash in practice",
          code: `# ANTI-PATTERN: Defensive coding that hides bugs
defmodule DefensiveWorker do
  def handle_call(:process, _from, state) do
    try do
      result = do_risky_work(state)
      {:reply, {:ok, result}, state}
    rescue
      _ -> {:reply, {:error, :unknown}, state}
      # ^^^ BAD: swallows the error, state may be corrupt
    end
  end
end

# GOOD: Let it crash, supervisor restarts with clean state
defmodule CrashFriendlyWorker do
  use GenServer

  def handle_call(:process, _from, state) do
    # If do_risky_work crashes, the process crashes,
    # the supervisor restarts it with fresh state
    result = do_risky_work(state)
    {:reply, {:ok, result}, state}
  end
end

# The supervisor handles recovery automatically
children = [
  {CrashFriendlyWorker, []},
]
Supervisor.start_link(children, strategy: :one_for_one)

# When to use which approach:
# - Expected failures (user input, network) → tagged tuples
# - Unexpected failures (bugs, corrupted state) → let it crash
# - Cleanup needed (file handles, connections) → try/after
# - Never → catch-all rescue that swallows errors`,
          output: "{:ok, pid}",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What is the idiomatic way to handle expected errors in Elixir?",
        options: [
          { label: "try/rescue blocks" },
          { label: "Tagged tuples ({:ok, value} / {:error, reason})", correct: true },
          { label: "throw/catch" },
          { label: "Global error handlers" },
        ],
        explanation:
          "Elixir uses tagged tuples as the primary error handling mechanism for expected failures. try/rescue is reserved for truly exceptional situations. Pattern matching on {:ok, _} and {:error, _} is explicit, composable, and keeps control flow clear.",
      },
      {
        question: "What does File.read!/1 do when the file doesn't exist?",
        options: [
          { label: "Returns {:error, :enoent}" },
          { label: "Returns nil" },
          { label: "Raises a File.Error exception", correct: true },
          { label: "Returns an empty string" },
        ],
        explanation:
          "Bang (!) functions raise exceptions instead of returning error tuples. File.read!/1 raises File.Error on failure, while File.read/1 returns {:error, reason}. Use bang functions when failure is unexpected and you want to crash.",
      },
      {
        question: "What happens if a with clause doesn't match?",
        options: [
          { label: "It raises a MatchError" },
          { label: "It retries the clause" },
          { label: "It falls through to the else block or returns the non-matching value", correct: true },
          { label: "It returns nil" },
        ],
        explanation:
          "When a <- clause in with fails to match, execution stops. If there's an else block, the non-matching value is matched against the else clauses. Without an else block, the non-matching value is returned directly.",
      },
      {
        question: "Why is catching all exceptions with rescue _ -> ... considered bad practice?",
        options: [
          { label: "It's a syntax error" },
          { label: "It hides bugs and leaves the process in a potentially corrupt state", correct: true },
          { label: "It's slower than not catching exceptions" },
          { label: "Elixir doesn't support catch-all rescue clauses" },
        ],
        explanation:
          "Catching all exceptions silently hides real bugs. If the process state is corrupted, the error is swallowed and the process continues in an unknown state. It's better to let it crash so the supervisor can restart it cleanly.",
      },
      {
        question: "When should you use throw/catch?",
        options: [
          { label: "For all error handling in recursive functions" },
          { label: "As the primary error handling mechanism" },
          { label: "Almost never — tagged tuples and with handle nearly all cases better", correct: true },
          { label: "Whenever a function might fail" },
        ],
        explanation:
          "throw/catch is a rare escape hatch for situations where you need to break out of a computation and no cleaner option exists. In practice, Enum.find, Enum.reduce_while, or tagged tuples with with cover virtually all real-world cases.",
      },
      {
        question: "What is the key difference between `raise` and `throw` in Elixir?",
        options: [
          { label: "raise is for strings, throw is for atoms" },
          { label: "raise generates exceptions (rescued with rescue), throw generates non-local returns (caught with catch)", correct: true },
          { label: "raise stops the process, throw does not" },
          { label: "There is no difference — they are aliases" },
        ],
        explanation:
          "raise creates exceptions that are caught with try/rescue and are meant for truly exceptional error conditions. throw creates non-local returns caught with try/catch, intended as a rare escape hatch for breaking out of deeply nested computation. They use completely different mechanisms and keywords.",
      },
      {
        question: "What happens when a `with` statement has no `else` clause and a `<-` pattern fails to match?",
        options: [
          { label: "It raises a MatchError" },
          { label: "It returns nil" },
          { label: "It returns the non-matching value as-is", correct: true },
          { label: "It silently continues to the next clause" },
        ],
        explanation:
          "When a with statement lacks an else clause and a <- match fails, the non-matching value is returned directly as the result of the entire with expression. This is useful when your functions already return consistent tagged tuples like {:error, reason}, since those will naturally propagate out.",
      },
      {
        question: "When defining a custom exception with `defexception`, what happens if you don't implement the `message/1` callback?",
        options: [
          { label: "The code won't compile" },
          { label: "A default implementation is provided that returns the :message field value", correct: true },
          { label: "Raising the exception will crash the VM" },
          { label: "The exception will always print \"unknown error\"" },
        ],
        explanation:
          "defexception provides a default message/1 implementation that returns the value of the :message field in the exception struct. You only need to override message/1 when you want to compose a message from multiple fields or provide custom formatting beyond what a simple :message field offers.",
      },
      {
        question: "What is the correct way to re-raise an exception while preserving the original stacktrace?",
        options: [
          { label: "raise e" },
          { label: "throw e" },
          { label: "reraise e, __STACKTRACE__", correct: true },
          { label: "raise __STACKTRACE__, e" },
        ],
        explanation:
          "reraise/2 re-raises an exception with the original stacktrace preserved. Using plain raise inside a rescue block would generate a new stacktrace pointing to the rescue clause itself, losing the information about where the error actually originated. __STACKTRACE__ is a special form available only inside catch/rescue blocks.",
      },
      {
        question: "In the `try` construct, what is the correct order of the optional clauses?",
        options: [
          { label: "rescue -> after -> catch" },
          { label: "catch -> rescue -> after" },
          { label: "rescue -> catch -> after", correct: true },
          { label: "after -> rescue -> catch" },
        ],
        explanation:
          "The correct order in a try block is: the do block first, then rescue (for exceptions), then catch (for thrown values and exits), then after (for cleanup). The after block always runs regardless of whether an exception occurred, similar to finally in other languages. Putting them out of order results in a compilation error.",
      },
      {
        question: "Which of these scenarios is the best candidate for the \"let it crash\" philosophy rather than defensive error handling?",
        options: [
          { label: "Validating user input in a web form" },
          { label: "A GenServer encountering corrupted internal state from an unexpected message", correct: true },
          { label: "A function receiving an optional parameter that might be nil" },
          { label: "Parsing a CSV file uploaded by a user" },
        ],
        explanation:
          "The let-it-crash philosophy is best for unexpected failures that leave a process in an unknown or corrupted state. A supervisor can restart the GenServer with clean state. User input validation and file parsing are expected failure scenarios that should be handled with tagged tuples, since crashing would be a poor user experience.",
      },
      {
        question: "What does `exit(:normal)` do when called inside a process?",
        options: [
          { label: "It raises a RuntimeError" },
          { label: "It terminates the process with a normal exit reason, which linked processes do not treat as a crash", correct: true },
          { label: "It is ignored because :normal is not a valid exit reason" },
          { label: "It sends a message to the supervisor to restart the process" },
        ],
        explanation:
          "exit(:normal) terminates the current process with reason :normal. Linked processes receive an exit signal but do not crash because :normal is treated as a clean shutdown. Only non-normal exit reasons (like :kill or :shutdown or custom atoms) cause linked processes to terminate. Supervisors will not restart a child that exits with :normal under most strategies.",
      },
      {
        question: "What happens when you use `try/rescue` to catch an exit signal like `exit(:boom)`?",
        options: [
          { label: "The rescue clause catches it as an ErlangError" },
          { label: "The rescue clause cannot catch exit signals — you need catch :exit, reason instead", correct: true },
          { label: "The rescue clause catches it as a RuntimeError" },
          { label: "The process terminates before rescue can execute" },
        ],
        explanation:
          "Elixir distinguishes three kinds of non-normal signals: errors (caught with rescue), throws (caught with catch :throw), and exits (caught with catch :exit). rescue only handles exceptions raised with raise. To intercept an exit signal, you must use catch :exit, reason in a try block. This distinction reflects the underlying Erlang error model.",
      },
      {
        question: "Given this code, what is the return value?\n\n```elixir\nwith {:ok, a} <- {:ok, 1},\n     b = a + 10,\n     {:ok, c} <- {:error, :oops} do\n  {:ok, a + b + c}\nelse\n  {:error, reason} -> {:failed, reason}\nend\n```",
        options: [
          { label: "{:ok, 23}" },
          { label: "{:error, :oops}" },
          { label: "{:failed, :oops}", correct: true },
          { label: "A MatchError because b is not a <- match" },
        ],
        explanation:
          "The first clause matches {:ok, 1} and binds a to 1. The bare match b = a + 10 always succeeds (bare = matches in with never trigger the else clause). The third clause fails to match {:error, :oops} against {:ok, c}, so {:error, :oops} falls through to the else block, matching {:error, reason} and returning {:failed, :oops}.",
      },
      {
        question: "Which fields does `defexception` automatically include in the exception struct, even if not listed?",
        options: [
          { label: ":reason and :stacktrace" },
          { label: ":message and :__exception__", correct: true },
          { label: ":type and :code" },
          { label: ":kind and :error" },
        ],
        explanation:
          "All exceptions defined with defexception are structs that automatically include the :__exception__ field (set to true, used internally to identify exception structs) and the :message field (used by the default message/1 implementation). You can override :message by specifying it in your field list or by implementing a custom message/1 callback.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Tagged Tuple Chain",
        difficulty: "beginner",
        prompt:
          "Write a function process_order/1 that takes a map and validates it step by step: (1) check that :item exists, (2) check that :quantity is a positive integer, (3) check that :email contains '@'. Return {:ok, order} if valid or {:error, reason} at the first failure. Use the with statement.",
        hints: [
          { text: "Use Map.fetch/2 to check for required keys — it returns {:ok, value} or :error." },
          { text: "For validation checks, write small helper functions that return {:ok, value} or {:error, reason}." },
          { text: "Chain everything in a with block. Handle :error from Map.fetch in the else clause." },
        ],
        solution: `defmodule Orders do
  def process_order(params) do
    with {:ok, item} <- Map.fetch(params, :item),
         {:ok, quantity} <- Map.fetch(params, :quantity),
         {:ok, email} <- Map.fetch(params, :email),
         {:ok, quantity} <- validate_quantity(quantity),
         {:ok, email} <- validate_email(email) do
      {:ok, %{item: item, quantity: quantity, email: email}}
    else
      :error -> {:error, :missing_field}
      {:error, reason} -> {:error, reason}
    end
  end

  defp validate_quantity(q) when is_integer(q) and q > 0, do: {:ok, q}
  defp validate_quantity(_), do: {:error, :invalid_quantity}

  defp validate_email(email) when is_binary(email) do
    if String.contains?(email, "@"),
      do: {:ok, email},
      else: {:error, :invalid_email}
  end
  defp validate_email(_), do: {:error, :invalid_email}
end

Orders.process_order(%{item: "Book", quantity: 2, email: "a@b.com"})
# => {:ok, %{item: "Book", quantity: 2, email: "a@b.com"}}

Orders.process_order(%{item: "Book", quantity: -1, email: "a@b.com"})
# => {:error, :invalid_quantity}

Orders.process_order(%{item: "Book"})
# => {:error, :missing_field}`,
        walkthrough: [
          "We use Map.fetch/2 for each required field. It returns {:ok, value} or :error (without a reason), so we handle bare :error in the else clause.",
          "Validation helpers return tagged tuples, keeping the with chain clean. Each helper is small and testable independently.",
          "The with statement reads as a clear happy path: fetch item, fetch quantity, fetch email, validate quantity, validate email — then build the result.",
          "If any step fails, we fall through to else where we pattern match on the specific failure to return an appropriate error.",
        ],
      },
      {
        title: "Custom Exception",
        difficulty: "intermediate",
        prompt:
          "Define a custom exception called ValidationError that has a :field and :message key. Write a validate!/1 function that raises this exception when a user map is missing :name or :email. Write a safe_validate/1 wrapper that catches the exception and returns a tagged tuple.",
        hints: [
          { text: "Use defexception to define the exception with the required fields." },
          { text: "Implement the message/1 callback to format a nice error message." },
          { text: "In safe_validate/1, use try/rescue to catch ValidationError and return {:error, message}." },
        ],
        solution: `defmodule ValidationError do
  defexception [:field, :message]

  @impl true
  def message(%{field: field, message: msg}) do
    "Validation failed on \#{field}: \#{msg}"
  end
end

defmodule UserValidator do
  def validate!(%{name: name, email: email} = user)
      when is_binary(name) and is_binary(email) do
    if name == "" do
      raise ValidationError, field: :name, message: "cannot be empty"
    end

    if not String.contains?(email, "@") do
      raise ValidationError, field: :email, message: "must contain @"
    end

    user
  end

  def validate!(%{name: _}), do: raise ValidationError, field: :email, message: "is required"
  def validate!(%{email: _}), do: raise ValidationError, field: :name, message: "is required"
  def validate!(_), do: raise ValidationError, field: :name, message: "is required"

  def safe_validate(user) do
    {:ok, validate!(user)}
  rescue
    e in ValidationError ->
      {:error, Exception.message(e)}
  end
end

UserValidator.validate!(%{name: "Alice", email: "a@b.com"})
# => %{name: "Alice", email: "a@b.com"}

UserValidator.safe_validate(%{name: "", email: "a@b.com"})
# => {:error, "Validation failed on name: cannot be empty"}

UserValidator.safe_validate(%{email: "a@b.com"})
# => {:error, "Validation failed on name: is required"}`,
        walkthrough: [
          "defexception creates a struct with the given keys and makes it usable with raise. The message/1 callback provides the default string representation.",
          "validate!/1 follows the bang convention — it returns the value on success or raises on failure. Multiple function clauses handle different missing-field combinations.",
          "safe_validate/1 wraps the bang function in try/rescue, converting exceptions back to tagged tuples. This gives callers a choice: crash or handle.",
          "Exception.message(e) calls our custom message/1 implementation to get a descriptive error string.",
        ],
      },
      {
        title: "Resilient Pipeline with Fallbacks",
        difficulty: "advanced",
        prompt:
          "Write a fetch_user_data/1 function that tries three sources in order: cache, database, and external API. Each source function returns {:ok, data} or {:error, reason}. If all three fail, return {:error, :all_sources_failed}. Log which source succeeded. Don't use try/rescue — use only tagged tuples.",
        hints: [
          { text: "Use with or a simple chain of case statements to try each source." },
          { text: "A helper function that takes a list of source functions and tries them in order is a clean approach." },
          { text: "Enum.reduce_while/3 can iterate over sources and stop at the first success." },
        ],
        solution: `defmodule UserData do
  def fetch_user_data(user_id) do
    sources = [
      {:cache, fn -> fetch_from_cache(user_id) end},
      {:database, fn -> fetch_from_db(user_id) end},
      {:api, fn -> fetch_from_api(user_id) end}
    ]

    try_sources(sources)
  end

  defp try_sources(sources) do
    Enum.reduce_while(sources, {:error, :all_sources_failed}, fn {name, fetcher}, acc ->
      case fetcher.() do
        {:ok, data} ->
          IO.puts("Fetched from \#{name}")
          {:halt, {:ok, data}}

        {:error, reason} ->
          IO.puts("Source \#{name} failed: \#{reason}")
          {:cont, acc}
      end
    end)
  end

  # Simulated source functions
  defp fetch_from_cache(_id) do
    # Would check ETS or a cache process
    {:error, :cache_miss}
  end

  defp fetch_from_db(id) do
    # Would query the database
    if id > 0 do
      {:ok, %{id: id, name: "User \#{id}", source: :database}}
    else
      {:error, :not_found}
    end
  end

  defp fetch_from_api(_id) do
    # Would make an HTTP request
    {:error, :timeout}
  end
end

UserData.fetch_user_data(42)
# Prints: "Source cache failed: cache_miss"
# Prints: "Fetched from database"
# => {:ok, %{id: 42, name: "User 42", source: :database}}

UserData.fetch_user_data(-1)
# Prints: "Source cache failed: cache_miss"
# Prints: "Source database failed: not_found"
# Prints: "Source api failed: timeout"
# => {:error, :all_sources_failed}`,
        walkthrough: [
          "We define sources as a list of {name, function} tuples. This makes the pipeline extensible — adding a new source is just appending to the list.",
          "Enum.reduce_while/3 iterates through sources. :halt stops on the first success, :cont continues to the next source on failure.",
          "The accumulator starts as {:error, :all_sources_failed}. If no source succeeds, this becomes the final return value.",
          "No try/rescue needed. Every function returns tagged tuples, and we compose them with standard Enum tools. This is idiomatic Elixir error handling — explicit, composable, and easy to test.",
        ],
      },
    ],
  },
};

export default errorHandling;
