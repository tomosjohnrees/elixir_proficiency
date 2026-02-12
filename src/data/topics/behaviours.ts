import type { TopicContent } from "@/lib/types";

const behaviours: TopicContent = {
  meta: {
    slug: "behaviours",
    title: "Behaviours",
    description: "Contracts, callbacks, and dynamic dispatch",
    number: 16,
    active: true,
  },

  eli5: {
    analogyTitle: "The Job Description",
    analogy:
      "Imagine you're hiring for a restaurant. You write a job description for \"Chef\" that lists what any chef must be able to do: prepare a main course, make a dessert, and handle a special dietary request. You don't care how each chef does it — one might specialize in Italian food, another in Japanese — but they all must fulfill those duties.",
    items: [
      { label: "Behaviour", description: "The job description. It lists the required skills (functions) that any applicant (module) must have. It doesn't say how to do the work, just what work needs doing." },
      { label: "Callback", description: "Each required skill on the list. 'Must be able to prepare a main course' is one callback. The job description might have several." },
      { label: "Implementation", description: "The actual chef you hire. They fulfill every requirement on the job description in their own unique way. An Italian chef and a Japanese chef both 'prepare a main course' but very differently." },
      { label: "@impl true", description: "A badge that says 'I'm doing this because the job description requires it.' It makes it clear which functions are fulfilling requirements versus which are the chef's own personal recipes." },
    ],
    keyTakeaways: [
      "A behaviour defines a set of function signatures (callbacks) that implementing modules must provide.",
      "Behaviours are contracts checked at compile time — you'll get a warning if you miss a callback.",
      "Use @callback to define required functions and @optional_callback for optional ones.",
      "@impl true marks a function as a callback implementation, catching typos and mismatches at compile time.",
      "Behaviours enable dynamic dispatch — you can swap implementations at runtime by changing which module you call.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "@callback", color: "#6b46c1", examples: ["@callback init(args)", "@callback handle(event)", "@spec-like syntax"], description: "Declares a required function that implementing modules must define. Uses the same type spec syntax as @spec." },
      { name: "@optional_callback", color: "#2563eb", examples: ["@optional_callback format(data)", "default behaviour"], description: "Declares a callback that implementations may choose to skip. Useful for hooks that have sensible defaults." },
      { name: "@impl true", color: "#d97706", examples: ["@impl true", "@impl MyBehaviour", "compile warning"], description: "Annotates a function as fulfilling a callback. Triggers a compile-time warning if the function doesn't match any callback." },
      { name: "Dynamic Dispatch", color: "#059669", examples: ["module.function()", "apply(mod, fun, args)", "config-driven"], description: "Calling a function on a module stored in a variable. This lets you swap implementations without changing the calling code." },
      { name: "Built-in Behaviours", color: "#e11d48", examples: ["GenServer", "Supervisor", "Application", "Plug"], description: "Many OTP modules are behaviours. When you use GenServer, you're implementing the GenServer behaviour's callbacks." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Defining a Behaviour",
        prose: [
          "A behaviour is a module that defines a set of callbacks using @callback. Each callback specifies a function name, its argument types, and its return type — using the same syntax as @spec. Any module that declares it implements this behaviour must define all the required callbacks.",
          "Think of it as a compile-time contract. If you forget to implement a callback, the compiler warns you. This catches bugs early, especially when a behaviour adds a new callback in a library update.",
        ],
        code: {
          title: "Defining a behaviour with callbacks",
          code: `defmodule Parser do
  @doc "Parses a string into structured data"
  @callback parse(input :: String.t()) ::
              {:ok, term()} | {:error, String.t()}

  @doc "Returns the list of supported file extensions"
  @callback extensions() :: [String.t()]

  @doc "Optional: validates input before parsing"
  @callback validate(input :: String.t()) :: :ok | {:error, String.t()}

  @optional_callback validate: 1
end`,
          output: "{:module, Parser, ...}",
        },
      },
      {
        title: "Implementing a Behaviour",
        prose: [
          "To implement a behaviour, a module uses @behaviour ModuleName and then defines all the required callbacks. The @impl true annotation marks each function as a callback implementation — this is optional but strongly recommended.",
          "If you use @impl true on a function that doesn't match any callback, the compiler warns you. This catches typos in function names or wrong arities. It also makes your code self-documenting — readers can immediately see which functions are part of the contract.",
        ],
        code: {
          title: "Implementing the Parser behaviour",
          code: `defmodule JsonParser do
  @behaviour Parser

  @impl true
  def parse(input) do
    case Jason.decode(input) do
      {:ok, data} -> {:ok, data}
      {:error, _} -> {:error, "invalid JSON"}
    end
  end

  @impl true
  def extensions, do: [".json"]
end

defmodule CsvParser do
  @behaviour Parser

  @impl true
  def parse(input) do
    rows =
      input
      |> String.split("\\n")
      |> Enum.map(&String.split(&1, ","))

    {:ok, rows}
  end

  @impl true
  def extensions, do: [".csv", ".tsv"]

  # Optional callback — we choose to implement it
  @impl true
  def validate(input) do
    if String.contains?(input, ","),
      do: :ok,
      else: {:error, "no delimiters found"}
  end
end`,
          output: "{:module, CsvParser, ...}",
        },
      },
      {
        title: "Dynamic Dispatch with Behaviours",
        prose: [
          "The real power of behaviours is dynamic dispatch. Since every implementation has the same set of functions, you can store the module name in a variable, config, or database — and call the right implementation at runtime without if/else chains.",
          "This pattern is everywhere in Elixir. Phoenix uses it for configurable adapters (JSON library, PubSub backend). Ecto uses it for database adapters. Your own apps can use it to swap strategies, mock services in tests, or let users plug in custom logic.",
        ],
        code: {
          title: "Dynamic dispatch in action",
          code: `defmodule FileProcessor do
  @parsers %{
    ".json" => JsonParser,
    ".csv" => CsvParser
  }

  def process(file_path) do
    ext = Path.extname(file_path)

    case Map.fetch(@parsers, ext) do
      {:ok, parser} ->
        content = File.read!(file_path)
        parser.parse(content)

      :error ->
        {:error, "unsupported file type: \#{ext}"}
    end
  end
end

# Or use application config for flexibility:
# config :my_app, :parser, JsonParser

defmodule App do
  def parse(input) do
    parser = Application.get_env(:my_app, :parser)
    parser.parse(input)
  end
end`,
          output: "{:ok, %{\"name\" => \"Alice\"}}",
        },
      },
      {
        title: "Behaviours vs Protocols",
        prose: [
          "Behaviours and protocols both achieve polymorphism, but they work differently. Protocols dispatch on the data type of the first argument — the data decides which code runs. Behaviours dispatch on the module — you explicitly choose which module to call.",
          "Use protocols when you want different types to respond to the same function (like to_string for integers, lists, and structs). Use behaviours when you want interchangeable modules that fulfill the same contract (like different database adapters or parsing strategies).",
        ],
        code: {
          title: "Protocol vs Behaviour comparison",
          code: `# PROTOCOL — dispatch based on data type
defprotocol Printable do
  def print(data)
end

defimpl Printable, for: Integer do
  def print(n), do: "Number: \#{n}"
end

# The DATA decides which implementation runs
Printable.print(42)  # => "Number: 42"

# BEHAVIOUR — dispatch based on module choice
defmodule Notifier do
  @callback notify(message :: String.t()) :: :ok
end

defmodule EmailNotifier do
  @behaviour Notifier
  @impl true
  def notify(msg), do: IO.puts("Email: \#{msg}")
end

defmodule SlackNotifier do
  @behaviour Notifier
  @impl true
  def notify(msg), do: IO.puts("Slack: \#{msg}")
end

# YOU decide which implementation runs
notifier = SlackNotifier
notifier.notify("hello")  # => "Slack: hello"`,
          output: "Slack: hello",
        },
      },
      {
        title: "Default Implementations with __using__",
        prose: [
          "Sometimes you want a behaviour to provide default implementations that modules can override. You can do this with a __using__ macro (invoked by use). The using module gets the defaults, and can override any function it wants.",
          "This is how GenServer works — use GenServer injects default implementations of all callbacks, and you only override the ones you need. The @before_compile hook can even check at compile time that everything is properly set up.",
        ],
        code: {
          title: "Behaviour with defaults via use",
          code: `defmodule Hookable do
  @callback before_save(data :: map()) :: map()
  @callback after_save(data :: map()) :: :ok
  @callback on_error(error :: term()) :: :ok

  # Provide defaults when a module does "use Hookable"
  defmacro __using__(_opts) do
    quote do
      @behaviour Hookable

      @impl true
      def before_save(data), do: data

      @impl true
      def after_save(_data), do: :ok

      @impl true
      def on_error(error) do
        IO.puts("Error: \#{inspect(error)}")
        :ok
      end

      # Allow the using module to override
      defoverridable before_save: 1, after_save: 1, on_error: 1
    end
  end
end

defmodule UserHooks do
  use Hookable

  # Override just what we need
  @impl true
  def before_save(data) do
    Map.put(data, :updated_at, DateTime.utc_now())
  end

  # after_save and on_error use the defaults
end`,
          output: "{:module, UserHooks, ...}",
        },
      },
      {
        title: "Testing with Behaviours",
        prose: [
          "Behaviours make testing easier because you can swap implementations. Instead of calling a real HTTP client or email service in tests, define a behaviour and use a mock implementation. Libraries like Mox are built around this pattern.",
          "The key insight is: depend on the behaviour (the contract), not the implementation. Your code calls whatever module is configured, and tests configure a mock module that returns predictable results.",
        ],
        code: {
          title: "Mock-friendly architecture",
          code: `# Define the contract
defmodule WeatherClient do
  @callback get_temperature(city :: String.t()) ::
              {:ok, float()} | {:error, term()}
end

# Real implementation
defmodule WeatherClient.Http do
  @behaviour WeatherClient

  @impl true
  def get_temperature(city) do
    # Makes actual HTTP call
    {:ok, 22.5}
  end
end

# Test mock
defmodule WeatherClient.Mock do
  @behaviour WeatherClient

  @impl true
  def get_temperature("London"), do: {:ok, 15.0}
  def get_temperature("Error"), do: {:error, :timeout}
  def get_temperature(_city), do: {:ok, 20.0}
end

# Your code uses config to pick the implementation
defmodule WeatherApp do
  def display_temp(city) do
    client = Application.get_env(:my_app, :weather_client)

    case client.get_temperature(city) do
      {:ok, temp} -> "It's \#{temp}°C in \#{city}"
      {:error, _} -> "Weather unavailable"
    end
  end
end

# config/test.exs:  config :my_app, weather_client: WeatherClient.Mock
# config/prod.exs:  config :my_app, weather_client: WeatherClient.Http`,
          output: "\"It's 15.0°C in London\"",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does @callback define in a behaviour?",
        options: [
          { label: "A private function only visible inside the module" },
          { label: "A function signature that implementing modules must provide", correct: true },
          { label: "A runtime hook that fires when the module loads" },
          { label: "A default implementation that can be overridden" },
        ],
        explanation:
          "@callback declares a required function signature — name, argument types, and return type. Any module that declares @behaviour for this module must implement all required callbacks or the compiler will warn.",
      },
      {
        question: "What happens if you forget to implement a required callback?",
        options: [
          { label: "A runtime error when the module is loaded" },
          { label: "A compile-time warning", correct: true },
          { label: "The module silently fails to compile" },
          { label: "Nothing — it's only checked at runtime" },
        ],
        explanation:
          "Elixir checks callbacks at compile time and issues a warning (not an error) if a required callback is missing. This catches mistakes early but still allows the code to compile, which is useful during development.",
      },
      {
        question: "What is the main difference between behaviours and protocols?",
        options: [
          { label: "Protocols are faster than behaviours" },
          { label: "Behaviours can only be used with structs" },
          { label: "Protocols dispatch on data type, behaviours dispatch on module", correct: true },
          { label: "Behaviours are checked at runtime, protocols at compile time" },
        ],
        explanation:
          "Protocols dispatch based on the type of the first argument — the data determines which code runs. Behaviours dispatch based on which module you call — you (or your config) choose the implementation explicitly.",
      },
      {
        question: "What does @impl true do?",
        options: [
          { label: "Makes a function public" },
          { label: "Marks a function as implementing a callback, enabling compile-time checks", correct: true },
          { label: "Automatically generates the function from the callback spec" },
          { label: "Makes the function overridable by child modules" },
        ],
        explanation:
          "@impl true tells the compiler 'this function is meant to implement a callback.' If the function doesn't match any callback (wrong name, wrong arity), the compiler warns you. It also serves as documentation for readers.",
      },
      {
        question: "Why are behaviours useful for testing?",
        options: [
          { label: "They make tests run faster" },
          { label: "They let you swap real implementations with mocks via configuration", correct: true },
          { label: "They automatically generate test cases" },
          { label: "They prevent side effects in production code" },
        ],
        explanation:
          "By depending on a behaviour (contract) rather than a specific module, you can configure a mock implementation in your test environment. The calling code doesn't change — it uses whichever module is configured.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Define and Implement a Behaviour",
        difficulty: "beginner",
        prompt:
          "Define a behaviour called Greeter with one callback: greet/1 that takes a name (string) and returns a string. Then create two implementations: FormalGreeter (returns \"Good day, <name>.\") and CasualGreeter (returns \"Hey <name>!\"). Use @impl true on all callback implementations.",
        hints: [
          { text: "Use @callback in the behaviour module to define the function signature." },
          { text: "Each implementation needs @behaviour Greeter and must define greet/1." },
          { text: "Don't forget @impl true before each greet/1 definition." },
        ],
        solution: `defmodule Greeter do
  @callback greet(name :: String.t()) :: String.t()
end

defmodule FormalGreeter do
  @behaviour Greeter

  @impl true
  def greet(name), do: "Good day, \#{name}."
end

defmodule CasualGreeter do
  @behaviour Greeter

  @impl true
  def greet(name), do: "Hey \#{name}!"
end

# Usage with dynamic dispatch
greeter = CasualGreeter
greeter.greet("Alice")   # => "Hey Alice!"

greeter = FormalGreeter
greeter.greet("Alice")   # => "Good day, Alice."`,
        walkthrough: [
          "The Greeter module defines the contract with @callback. It specifies that greet/1 takes a string and returns a string.",
          "Both FormalGreeter and CasualGreeter declare @behaviour Greeter, committing to the contract.",
          "@impl true on each greet/1 tells the compiler these functions are callback implementations. If we misspelled it as 'gret', we'd get a compile warning.",
          "Dynamic dispatch works because both modules have the same interface — we can store the module in a variable and call .greet/1 on it.",
        ],
      },
      {
        title: "Behaviour with Optional Callbacks",
        difficulty: "intermediate",
        prompt:
          "Define a behaviour called Storage with three callbacks: put/2 (key, value), get/1 (key), and delete/1 (key). Make delete/1 optional. Implement it as MemoryStorage using an Agent to store data. In your implementation, skip the optional delete callback to see the compiler behavior, then add it.",
        hints: [
          { text: "Use @optional_callback to mark delete/1 as optional." },
          { text: "An Agent is a simple way to hold state — use Agent.start_link, Agent.update, and Agent.get." },
          { text: "For put/2, use Agent.update to modify the stored map. For get/1, use Agent.get to retrieve a value." },
        ],
        solution: `defmodule Storage do
  @callback put(key :: term(), value :: term()) :: :ok
  @callback get(key :: term()) :: {:ok, term()} | :error
  @callback delete(key :: term()) :: :ok

  @optional_callback delete: 1
end

defmodule MemoryStorage do
  @behaviour Storage
  use Agent

  def start_link(opts \\\\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    Agent.start_link(fn -> %{} end, name: name)
  end

  @impl true
  def put(key, value) do
    Agent.update(__MODULE__, &Map.put(&1, key, value))
  end

  @impl true
  def get(key) do
    case Agent.get(__MODULE__, &Map.fetch(&1, key)) do
      {:ok, value} -> {:ok, value}
      :error -> :error
    end
  end

  # Optional, but we implement it anyway
  @impl true
  def delete(key) do
    Agent.update(__MODULE__, &Map.delete(&1, key))
  end
end

# Usage:
# MemoryStorage.start_link()
# MemoryStorage.put(:name, "Alice")
# MemoryStorage.get(:name)     # => {:ok, "Alice"}
# MemoryStorage.delete(:name)
# MemoryStorage.get(:name)     # => :error`,
        walkthrough: [
          "The Storage behaviour defines three callbacks. delete/1 is marked optional with @optional_callback delete: 1.",
          "If we remove the delete/1 function from MemoryStorage, the compiler won't warn — because it's optional. But it would warn if we removed put/2 or get/1.",
          "We use an Agent (a simple stateful process) to store a map. Agent.update modifies the state, Agent.get reads it.",
          "The @impl true annotations on all three functions (including the optional one) make our intentions clear to both the compiler and other developers.",
        ],
      },
      {
        title: "Config-Driven Behaviour Dispatch",
        difficulty: "intermediate",
        prompt:
          "Define a Mailer behaviour with a send_email/2 callback (to, body). Create two implementations: SmtpMailer (prints 'Sending via SMTP to <to>') and ConsoleMailer (prints 'Console: <body>'). Then write a Notifications module that reads the mailer from application config and uses it to send.",
        hints: [
          { text: "Use Application.get_env/2 to read which mailer module to use." },
          { text: "In the Notifications module, store the result of get_env in a variable and call .send_email/2 on it." },
          { text: "In a real app, you'd set the config differently per environment — ConsoleMailer for dev/test, SmtpMailer for prod." },
        ],
        solution: `defmodule Mailer do
  @callback send_email(to :: String.t(), body :: String.t()) :: :ok
end

defmodule SmtpMailer do
  @behaviour Mailer

  @impl true
  def send_email(to, body) do
    IO.puts("Sending via SMTP to \#{to}: \#{body}")
    :ok
  end
end

defmodule ConsoleMailer do
  @behaviour Mailer

  @impl true
  def send_email(to, body) do
    IO.puts("[DEV] Email to \#{to}")
    IO.puts("[DEV] Body: \#{body}")
    :ok
  end
end

defmodule Notifications do
  def welcome(user_email) do
    mailer().send_email(user_email, "Welcome to our app!")
  end

  def password_reset(user_email, token) do
    body = "Reset your password: https://example.com/reset/\#{token}"
    mailer().send_email(user_email, body)
  end

  defp mailer do
    Application.get_env(:my_app, :mailer, ConsoleMailer)
  end
end

# config/dev.exs:   config :my_app, mailer: ConsoleMailer
# config/test.exs:  config :my_app, mailer: MockMailer
# config/prod.exs:  config :my_app, mailer: SmtpMailer`,
        walkthrough: [
          "The Mailer behaviour defines the contract — any mailer must implement send_email/2.",
          "SmtpMailer and ConsoleMailer both fulfill the contract but behave differently. In production you'd use SMTP; in development, console output is easier to inspect.",
          "The Notifications module doesn't know or care which mailer it's using. The private mailer/0 function reads from config, defaulting to ConsoleMailer if nothing is configured.",
          "This pattern makes testing trivial — configure a MockMailer in test.exs that records calls instead of sending anything, and assert on what was recorded.",
        ],
      },
      {
        title: "Behaviour with Defaults via use",
        difficulty: "advanced",
        prompt:
          "Create a behaviour called Lifecycle with three callbacks: on_start/0, on_stop/0, and on_error/1. Provide default implementations via a __using__ macro so that implementing modules only need to override the callbacks they care about. Create a MyWorker module that only overrides on_start/0.",
        hints: [
          { text: "Define @callback for all three functions in the Lifecycle module." },
          { text: "In defmacro __using__, use quote to inject @behaviour, default implementations, and defoverridable." },
          { text: "defoverridable lets the using module redefine functions that were already defined in the quote block." },
        ],
        solution: `defmodule Lifecycle do
  @callback on_start() :: :ok
  @callback on_stop() :: :ok
  @callback on_error(reason :: term()) :: :ok

  defmacro __using__(_opts) do
    quote do
      @behaviour Lifecycle

      @impl true
      def on_start do
        IO.puts("[\#{__MODULE__}] Starting...")
        :ok
      end

      @impl true
      def on_stop do
        IO.puts("[\#{__MODULE__}] Stopping...")
        :ok
      end

      @impl true
      def on_error(reason) do
        IO.puts("[\#{__MODULE__}] Error: \#{inspect(reason)}")
        :ok
      end

      defoverridable on_start: 0, on_stop: 0, on_error: 1
    end
  end
end

defmodule MyWorker do
  use Lifecycle

  # Only override on_start — the rest use defaults
  @impl true
  def on_start do
    IO.puts("MyWorker is booting up!")
    IO.puts("Connecting to database...")
    :ok
  end
end

MyWorker.on_start()
# => "MyWorker is booting up!"
# => "Connecting to database..."

MyWorker.on_stop()
# => "[MyWorker] Stopping..."   (default)

MyWorker.on_error(:timeout)
# => "[MyWorker] Error: :timeout"   (default)`,
        walkthrough: [
          "The Lifecycle module defines three @callback functions, then provides defaults in __using__.",
          "When MyWorker does use Lifecycle, the quote block is injected — adding @behaviour, all three default implementations, and marking them as overridable.",
          "defoverridable on_start: 0, on_stop: 0, on_error: 1 is critical. Without it, MyWorker couldn't redefine on_start/0 because it would already be defined by the injected code.",
          "MyWorker only overrides on_start/0. The other two functions use the defaults from the quote block. This is exactly how GenServer works — use GenServer injects defaults for all callbacks.",
          "This pattern reduces boilerplate while keeping the compile-time safety of behaviours. If Lifecycle adds a new callback later, the default in __using__ covers it automatically.",
        ],
      },
    ],
  },
};

export default behaviours;
