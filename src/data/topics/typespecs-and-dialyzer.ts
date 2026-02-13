import type { TopicContent } from "@/lib/types";
import questions from "./questions/typespecs-and-dialyzer";

const typespecsAndDialyzer: TopicContent = {
  meta: {
    slug: "typespecs-and-dialyzer",
    title: "Typespecs & Dialyzer",
    description: "@spec, @type, @callback, and static analysis with Dialyzer",
    number: 28,
    active: true,
  },

  eli5: {
    analogyTitle: "The Blueprint Inspector",
    analogy:
      "Imagine you're building a house with a team. Everyone knows how to build, but sometimes a plumber accidentally connects a gas pipe where a water pipe should go. Typespecs are like blueprints that label every pipe: \"this one carries water, that one carries gas.\" Dialyzer is the building inspector who checks the blueprints against the actual construction and says \"Hey, you're trying to push water through a gas fitting — that won't work.\"",
    items: [
      { label: "@spec", description: "A label on each pipe (function) saying what flows in and what flows out. It's documentation for humans AND for the inspector." },
      { label: "@type", description: "A custom blueprint symbol. Instead of drawing \"a bundle of three copper pipes\" every time, you name it \"hot water assembly\" and reuse the symbol." },
      { label: "@callback", description: "A checklist for subcontractors. \"If you're going to install the plumbing, you MUST provide these specific fittings.\"" },
      { label: "Dialyzer", description: "The inspector who walks through the building, compares every connection against the blueprints, and flags anything that will definitely fail." },
    ],
    keyTakeaways: [
      "Typespecs are optional annotations that describe what types a function expects and returns.",
      "Dialyzer is a static analysis tool — it checks types without running your code.",
      "Dialyzer uses \"success typing\": it only warns when it can prove something will definitely fail.",
      "Specs serve double duty: they help Dialyzer catch bugs AND act as documentation for developers.",
      "@type lets you define reusable custom types, and @opaque hides internal structure from other modules.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "@spec", color: "#6b46c1", examples: ["@spec add(integer(), integer()) :: integer()", "@spec fetch(String.t()) :: {:ok, map()} | {:error, atom()}"], description: "Annotates a function with its argument types and return type. Helps Dialyzer and documents your API." },
      { name: "@type", color: "#2563eb", examples: ["@type user :: %{name: String.t(), age: non_neg_integer()}", "@type result :: {:ok, any()} | {:error, String.t()}"], description: "Defines a named, reusable type. Public by default — other modules can reference it." },
      { name: "@typep", color: "#0891b2", examples: ["@typep state :: %{cache: map(), ttl: integer()}"], description: "Defines a private type visible only within the current module. Used for internal implementation details." },
      { name: "@opaque", color: "#d97706", examples: ["@opaque t :: %__MODULE__{data: list()}"], description: "Defines a public type whose internal structure is hidden. Dialyzer warns if external code depends on the internals." },
      { name: "@callback", color: "#059669", examples: ["@callback init(opts :: keyword()) :: {:ok, state} | {:error, reason}"], description: "Defines function signatures required by a behaviour. Modules implementing the behaviour must provide matching functions." },
      { name: "Dialyzer", color: "#e11d48", examples: ["mix dialyzer", "dialyzer --plt core.plt"], description: "Static analysis tool that finds type discrepancies, unreachable code, and guaranteed failures in compiled BEAM code." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Basic Typespecs with @spec",
        prose: [
          "The @spec attribute annotates a function with its expected argument types and return type. It goes right above the function definition. Elixir provides a rich set of built-in types you can use: integer(), float(), atom(), String.t(), boolean(), list(), map(), tuple(), pid(), and more.",
          "Specs don't change how your code runs — Elixir remains dynamically typed. But they serve two critical purposes: they document your function's contract for other developers, and they give Dialyzer the information it needs to catch bugs statically.",
          "Union types with | let you express functions that can return different types. This is especially common with the {:ok, value} | {:error, reason} pattern used throughout Elixir.",
        ],
        code: {
          title: "Writing function specs",
          code: `defmodule Math do
  @spec add(number(), number()) :: number()
  def add(a, b), do: a + b

  @spec divide(number(), number()) :: {:ok, float()} | {:error, String.t()}
  def divide(_a, 0), do: {:error, "cannot divide by zero"}
  def divide(a, b), do: {:ok, a / b}

  @spec factorial(non_neg_integer()) :: pos_integer()
  def factorial(0), do: 1
  def factorial(n) when n > 0, do: n * factorial(n - 1)
end`,
          output: "{:ok, 3.3333333333333335}",
        },
      },
      {
        title: "Custom Types with @type, @typep, and @opaque",
        prose: [
          "When your specs start getting complex or repetitive, you can define custom named types with @type. This makes specs more readable and lets you express domain concepts directly in your type annotations.",
          "@type creates a public type that other modules can reference as YourModule.your_type(). Use @typep for types that are only relevant inside the module. Use @opaque when you want other modules to use the type but not depend on its internal structure — Dialyzer will warn them if they pattern match on the internals.",
          "Parameterized types let you create generic type definitions. For example, you can define a result type that works with any success value type.",
        ],
        code: {
          title: "Defining custom types",
          code: `defmodule User do
  # Public type — other modules can reference User.t()
  @type t :: %__MODULE__{
    name: String.t(),
    email: String.t(),
    age: non_neg_integer()
  }

  defstruct [:name, :email, :age]

  # Private type — only visible in this module
  @typep validation_error :: {:error, field :: atom(), message :: String.t()}

  # Parameterized type
  @type result(value) :: {:ok, value} | {:error, String.t()}

  @spec create(map()) :: result(t())
  def create(attrs) do
    {:ok, struct!(__MODULE__, attrs)}
  end
end`,
          output: "{:ok, %User{name: \"José\", email: \"jose@example.com\", age: 30}}",
        },
      },
      {
        title: "Callbacks and Behaviours",
        prose: [
          "@callback is used inside behaviour definitions to specify the functions that implementing modules must provide. It works like @spec but defines a contract rather than annotating an existing function.",
          "When a module uses @behaviour YourBehaviour, the compiler checks that all required callbacks are implemented. Dialyzer goes further — it can verify that the implementations match the callback specs, catching type mismatches between the contract and the implementation.",
          "You can also use @macrocallback for macros that a behaviour requires, and @optional_callbacks to mark callbacks that implementations may skip.",
        ],
        code: {
          title: "Defining and implementing behaviours with callbacks",
          code: `defmodule Parser do
  @doc "Parses a raw string into structured data"
  @callback parse(raw :: String.t()) :: {:ok, term()} | {:error, String.t()}

  @doc "Returns the list of supported file extensions"
  @callback extensions() :: [String.t()]

  @optional_callbacks extensions: 0
end

defmodule JSONParser do
  @behaviour Parser

  @impl Parser
  @spec parse(String.t()) :: {:ok, term()} | {:error, String.t()}
  def parse(raw) do
    case Jason.decode(raw) do
      {:ok, data} -> {:ok, data}
      {:error, _} -> {:error, "invalid JSON"}
    end
  end

  @impl Parser
  def extensions, do: [".json"]
end`,
          output: "{:ok, %{\"key\" => \"value\"}}",
        },
      },
      {
        title: "Built-in Types Reference",
        prose: [
          "Elixir has a rich set of built-in types for specs. The basic ones map to what you'd expect: atom(), integer(), float(), boolean(), binary() (raw bytes), and String.t() (UTF-8 strings). Note that string() in Erlang means charlist — always use String.t() for Elixir strings.",
          "Collection types include list(element_type), map(), keyword(), tuple(), and specific map shapes like %{key: type}. For structs, use %MyStruct{} which automatically includes all the struct's fields.",
          "Special types round out the system: any() matches everything, term() is an alias for any(), none() matches nothing (useful for types that should never be constructed), no_return() for functions that never return normally, and as_boolean(t) for values used in boolean context.",
        ],
        code: {
          title: "Common built-in types",
          code: `defmodule TypeExamples do
  # Basic types
  @spec greet(String.t()) :: String.t()
  def greet(name), do: "Hello, \#{name}!"

  # Literal types — specific atoms, integers
  @spec status() :: :active | :inactive | :pending
  def status, do: :active

  # List with element type
  @spec sum(list(number())) :: number()
  def sum(numbers), do: Enum.sum(numbers)

  # Map with specific keys
  @spec point() :: %{x: float(), y: float()}
  def point, do: %{x: 0.0, y: 0.0}

  # Function type as argument
  @spec apply_twice((integer() -> integer()), integer()) :: integer()
  def apply_twice(fun, value), do: fun.(fun.(value))

  # Keyword list with typed values
  @spec config(keyword(String.t())) :: map()
  def config(opts), do: Map.new(opts)
end`,
          output: "%{x: 0.0, y: 0.0}",
        },
      },
      {
        title: "Running Dialyzer",
        prose: [
          "To use Dialyzer in a Mix project, add the Dialyxir library to your dependencies. It provides the mix dialyzer task that handles PLT management and presents warnings in a readable format.",
          "The first time you run mix dialyzer, it builds a PLT (Persistent Lookup Table) containing type information for Erlang, Elixir, and your dependencies. This can take several minutes but only happens once — subsequent runs are much faster because the PLT is cached.",
          "Dialyzer warnings can be cryptic at first. Common ones include: \"no local return\" (a function can never succeed), \"pattern can never match\" (dead code), and contract violations where your @spec disagrees with what the code actually does. Don't be discouraged — each warning is pointing at a real issue.",
        ],
        code: {
          title: "Setting up Dialyxir",
          code: `# In mix.exs
defp deps do
  [
    {:dialyxir, "~> 1.4", only: [:dev], runtime: false}
  ]
end

# Run from the command line:
# $ mix deps.get
# $ mix dialyzer          # First run builds PLT (slow)
# $ mix dialyzer          # Subsequent runs are fast

# Common Dialyzer warnings and what they mean:
#
# "Function add/2 has no local return"
#   → The function can never succeed with the given types
#
# "The pattern can never match the type"
#   → A case/function clause is unreachable dead code
#
# "Invalid type specification for function"
#   → Your @spec doesn't match what the code actually does`,
          output: "done (passed successfully)",
        },
      },
      {
        title: "Success Typing and Practical Tips",
        prose: [
          "Dialyzer uses a philosophy called \"success typing\" — it only reports a warning when it can mathematically prove that code will fail. If there's any possible execution path where the code could work, Dialyzer stays silent. This means zero false positives (in theory), but it also means some bugs will slip through.",
          "Start by adding specs to your public API functions — these are the most valuable because they document the contract between modules. You don't need to spec every private helper. Focus on functions where the types aren't obvious from the name and arguments.",
          "A practical workflow: write your code, add specs to public functions, run mix dialyzer, and fix any warnings. Over time, the combination of good specs and Dialyzer catches subtle bugs that tests might miss — like passing a keyword list where a map was expected, or returning nil from a function that promises a string.",
        ],
        code: {
          title: "Practical typespec patterns",
          code: `defmodule Account do
  @type t :: %__MODULE__{
    balance: non_neg_integer(),
    currency: currency()
  }
  @type currency :: :usd | :eur | :gbp

  defstruct balance: 0, currency: :usd

  # Dialyzer catches: if you call withdraw(account, -5),
  # it knows non_neg_integer() can't be negative
  @spec withdraw(t(), pos_integer()) :: {:ok, t()} | {:error, :insufficient_funds}
  def withdraw(%__MODULE__{balance: bal} = acc, amount) when amount <= bal do
    {:ok, %{acc | balance: bal - amount}}
  end
  def withdraw(_, _), do: {:error, :insufficient_funds}

  # @spec helps Dialyzer verify callers pass the right types
  @spec format_balance(t()) :: String.t()
  def format_balance(%__MODULE__{balance: bal, currency: cur}) do
    symbol = case cur do
      :usd -> "$"
      :eur -> "€"
      :gbp -> "£"
    end
    "\#{symbol}\#{bal}"
  end
end`,
          output: "\"$100\"",
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
        title: "Spec a Calculator Module",
        difficulty: "beginner",
        prompt:
          "Create a Calculator module with four functions: add/2, subtract/2, multiply/2, and divide/2. Add @spec annotations to each. The first three should take two numbers and return a number. divide/2 should return {:ok, float()} | {:error, String.t()} to handle division by zero. Implement the functions and their specs.",
        hints: [
          { text: "Use number() as the type for arguments that accept both integers and floats." },
          { text: "For divide/2, pattern match on the divisor being 0 in a separate clause." },
          { text: "The return type of divide uses a union: {:ok, float()} | {:error, String.t()}." },
        ],
        solution: `defmodule Calculator do
  @spec add(number(), number()) :: number()
  def add(a, b), do: a + b

  @spec subtract(number(), number()) :: number()
  def subtract(a, b), do: a - b

  @spec multiply(number(), number()) :: number()
  def multiply(a, b), do: a * b

  @spec divide(number(), number()) :: {:ok, float()} | {:error, String.t()}
  def divide(_a, 0), do: {:error, "division by zero"}
  def divide(a, b), do: {:ok, a / b}
end`,
        walkthrough: [
          "We define four functions in the Calculator module, each annotated with @spec.",
          "add/2, subtract/2, and multiply/2 all take number() (which covers both integer and float) and return number(). This is accurate because Elixir's arithmetic preserves integer results when possible.",
          "divide/2 uses a union return type because it can fail. The first clause pattern matches on 0 as the divisor and returns an error tuple. The second clause performs the division.",
          "Using / always returns a float in Elixir, so {:ok, float()} is precise. The error case returns a string message wrapped in {:error, ...}.",
        ],
      },
      {
        title: "Define a Custom Type System",
        difficulty: "intermediate",
        prompt:
          "Create a Shape module that defines custom types for different geometric shapes: circle (has a radius), rectangle (has width and height), and triangle (has base and height). Define a @type for each, then create a union type `shape` that covers all three. Write a @spec for an area/1 function that accepts any shape and returns a float. Implement the function using pattern matching.",
        hints: [
          { text: "Use map types like %{type: :circle, radius: float()} for each shape." },
          { text: "The union type combines all shapes with |: @type shape :: circle() | rectangle() | triangle()." },
          { text: "Pattern match on the :type key in area/1 to determine which formula to use." },
        ],
        solution: `defmodule Shape do
  @type circle :: %{type: :circle, radius: float()}
  @type rectangle :: %{type: :rectangle, width: float(), height: float()}
  @type triangle :: %{type: :triangle, base: float(), height: float()}
  @type shape :: circle() | rectangle() | triangle()

  @spec area(shape()) :: float()
  def area(%{type: :circle, radius: r}) do
    :math.pi() * r * r
  end

  def area(%{type: :rectangle, width: w, height: h}) do
    w * h
  end

  def area(%{type: :triangle, base: b, height: h}) do
    0.5 * b * h
  end
end`,
        walkthrough: [
          "We define three custom types — circle(), rectangle(), and triangle() — each as a map with a :type key that acts as a discriminator.",
          "The union type shape() combines all three with |, meaning any of the three map shapes is a valid shape.",
          "area/1 uses pattern matching on the :type key to select the right formula. Dialyzer can verify that all three shape variants are handled.",
          "Using :math.pi() gives us Erlang's pi constant. All calculations return floats because we're using float() inputs and float arithmetic.",
          "If you later add a new shape type to the union but forget to add a clause in area/1, Dialyzer can warn you about the missing case.",
        ],
      },
      {
        title: "Build a Behaviour with Callbacks",
        difficulty: "advanced",
        prompt:
          "Define a Storage behaviour with three callbacks: put/2 (takes a string key and any value, returns :ok or {:error, String.t()}), get/1 (takes a string key, returns {:ok, any()} or {:error, :not_found}), and delete/1 (takes a string key, returns :ok). Then implement an InMemoryStorage module that uses Agent to fulfill the behaviour. Add @spec annotations to every function in both modules.",
        hints: [
          { text: "Use @callback in the Storage module to define the required function signatures." },
          { text: "In InMemoryStorage, use @behaviour Storage and mark each function with @impl Storage." },
          { text: "Agent.start_link(fn -> %{} end) creates a simple key-value store process." },
          { text: "Use Agent.update/2, Agent.get/2, and Agent.get_and_update/2 for the operations." },
        ],
        solution: `defmodule Storage do
  @type key :: String.t()
  @type value :: any()

  @callback put(key(), value()) :: :ok | {:error, String.t()}
  @callback get(key()) :: {:ok, value()} | {:error, :not_found}
  @callback delete(key()) :: :ok
end

defmodule InMemoryStorage do
  @behaviour Storage
  use Agent

  @spec start_link(keyword()) :: Agent.on_start()
  def start_link(opts \\\\ []) do
    name = Keyword.get(opts, :name, __MODULE__)
    Agent.start_link(fn -> %{} end, name: name)
  end

  @impl Storage
  @spec put(Storage.key(), Storage.value()) :: :ok
  def put(key, value) do
    Agent.update(__MODULE__, fn state -> Map.put(state, key, value) end)
  end

  @impl Storage
  @spec get(Storage.key()) :: {:ok, Storage.value()} | {:error, :not_found}
  def get(key) do
    Agent.get(__MODULE__, fn state ->
      case Map.fetch(state, key) do
        {:ok, value} -> {:ok, value}
        :error -> {:error, :not_found}
      end
    end)
  end

  @impl Storage
  @spec delete(Storage.key()) :: :ok
  def delete(key) do
    Agent.update(__MODULE__, fn state -> Map.delete(state, key) end)
  end
end`,
        walkthrough: [
          "The Storage module defines the behaviour with @callback for each required function. We also define custom types key() and value() for reuse across callbacks.",
          "InMemoryStorage declares @behaviour Storage, which tells the compiler to check that all callbacks are implemented. The @impl Storage annotation on each function makes it explicit which callback is being fulfilled.",
          "start_link/1 initializes an Agent with an empty map as the state. We use the module name as the Agent's registered name for easy access.",
          "put/2 uses Agent.update/2 to add a key-value pair. It always returns :ok since the in-memory store has no failure modes (unlike a network-based store).",
          "get/1 uses Agent.get/2 with Map.fetch/2 to return {:ok, value} or transform :error into {:error, :not_found} matching our callback spec.",
          "delete/1 uses Agent.update/2 with Map.delete/2. The @spec on every function means Dialyzer can verify type consistency across the entire module.",
        ],
      },
    ],
  },
};

export default typespecsAndDialyzer;
