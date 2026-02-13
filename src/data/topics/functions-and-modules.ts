import type { TopicContent } from "@/lib/types";
import questions from "./questions/functions-and-modules";

const functionsAndModules: TopicContent = {
  meta: {
    slug: "functions-and-modules",
    title: "Functions & Modules",
    description: "Named functions, anonymous functions, modules, and imports",
    number: 6,
    active: true,
  },

  eli5: {
    analogyTitle: "The Restaurant Kitchen",
    analogy:
      "Think of a module as a restaurant kitchen. The kitchen has a name on the door (the module name) and inside it has a team of chefs, each specializing in a particular dish. When you order \"pasta\" from the kitchen, a specific chef handles it — that's a named function. Some chefs are public-facing and take orders from customers, while others only help behind the scenes — those are private functions.",
    items: [
      { label: "Modules", description: "The named kitchen. It groups related chefs (functions) together under one roof. You call a chef by saying the kitchen name and the dish: Kitchen.pasta()." },
      { label: "Named functions", description: "The chefs with assigned dishes. Each one has a name, knows how many ingredients it needs (arity), and may have multiple recipes for different ingredient combos (multiple clauses)." },
      { label: "Private functions", description: "Back-of-house helpers. Customers can't order from them directly — only other chefs in the same kitchen can ask them to help." },
      { label: "Anonymous functions", description: "A recipe card you can hand to anyone. It doesn't belong to a kitchen — you can pass it around, store it, and anyone who holds it can use it." },
    ],
    keyTakeaways: [
      "Modules group related functions under a name. Every named function lives inside a module.",
      "Functions are identified by name AND arity. greet/1 and greet/2 are different functions, not overloads.",
      "def defines public functions, defp defines private ones. Private functions are only callable within their module.",
      "Anonymous functions (fn -> end) are values — you can store them in variables and pass them to other functions.",
      "The capture operator & provides a shorthand for creating anonymous functions and referencing named functions.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Named Function", color: "#6b46c1", examples: ["def greet(name) do", "  \"Hello, \#{name}\"", "end"], description: "Defined with def inside a module. Identified by name/arity. Can have multiple clauses with pattern matching." },
      { name: "Private Function", color: "#e11d48", examples: ["defp helper(x) do", "  x * 2", "end"], description: "Defined with defp. Only callable from within the same module. Used for internal logic." },
      { name: "Anonymous Function", color: "#2563eb", examples: ["fn x -> x * 2 end", "&(&1 * 2)", "add = fn a, b -> a + b end"], description: "A function value with no name. Created with fn or &. Called with a dot: add.(1, 2)." },
      { name: "Module", color: "#059669", examples: ["defmodule Math do", "  def add(a, b), do: a + b", "end"], description: "A named container for functions. Provides namespace, compilation unit, and documentation scope." },
    ],
    operatorGroups: [
      {
        name: "Function Tools",
        operators: [
          { symbol: "def", description: "Define a public named function" },
          { symbol: "defp", description: "Define a private named function" },
          { symbol: "fn -> end", description: "Create an anonymous function" },
          { symbol: "&", description: "Capture operator — shorthand for anonymous functions" },
          { symbol: "&1, &2", description: "Capture arguments — placeholders in & expressions" },
          { symbol: ".()", description: "Invoke an anonymous function" },
        ],
      },
      {
        name: "Module Tools",
        operators: [
          { symbol: "import", description: "Bring functions into scope (call without module prefix)" },
          { symbol: "alias", description: "Shorten a module name (MyApp.Accounts → Accounts)" },
          { symbol: "require", description: "Ensure a module is compiled (needed for macros)" },
          { symbol: "use", description: "Invoke a module's __using__ macro (setup hook)" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Modules — Organizing Your Code",
        prose: [
          "Every named function in Elixir must live inside a module. Modules are defined with defmodule and serve as namespaces, compilation units, and documentation scopes. By convention, module names use CamelCase and map to file paths (MyApp.Accounts lives in lib/my_app/accounts.ex).",
          "Modules can be nested, but nesting is purely cosmetic — MyApp.Accounts is not actually \"inside\" MyApp. It's just a naming convention. Each module is independently compiled.",
          "You can add documentation with @moduledoc and @doc attributes. Module attributes prefixed with @ are evaluated at compile time and are a core part of Elixir's metaprogramming system.",
        ],
        code: {
          title: "Defining a module",
          code: `defmodule Greeter do
  @moduledoc "A simple greeting module."

  @default_greeting "Hello"

  @doc "Greets a person by name."
  def greet(name) do
    "\#{@default_greeting}, \#{name}!"
  end

  def greet(name, greeting) do
    "\#{greeting}, \#{name}!"
  end
end

Greeter.greet("José")           # => "Hello, José!"
Greeter.greet("José", "Howdy")  # => "Howdy, José!"`,
          output: "\"Howdy, José!\"",
        },
      },
      {
        title: "Named Functions and Arity",
        prose: [
          "In Elixir, a function is identified by its name AND its arity (the number of arguments it takes). greet/1 and greet/2 are completely separate functions — not overloads of the same function. This is why documentation and error messages always reference functions as name/arity.",
          "Named functions can have multiple clauses, just like case. Elixir tries each clause top-to-bottom and runs the first one whose pattern matches. This is one of the most powerful features of the language — you can decompose complex logic into simple, readable clauses.",
          "Default arguments use the \\\\ syntax. Under the hood, Elixir generates additional function heads for each default, so def greet(name, greeting \\\\ \"Hello\") creates both greet/1 and greet/2.",
        ],
        code: {
          title: "Multiple clauses and defaults",
          code: `defmodule Math do
  # Multiple clauses with pattern matching
  def zero?(0), do: true
  def zero?(_), do: false

  # Default arguments
  def multiply(a, b \\\\ 2) do
    a * b
  end

  # Guards add extra conditions
  def absolute(n) when n >= 0, do: n
  def absolute(n), do: -n
end

Math.zero?(0)        # => true
Math.zero?(5)        # => false
Math.multiply(3)     # => 6  (b defaults to 2)
Math.multiply(3, 4)  # => 12
Math.absolute(-7)    # => 7`,
          output: "7",
        },
      },
      {
        title: "Private Functions",
        prose: [
          "Functions defined with defp are private to the module. They can only be called by other functions in the same module. This is how you enforce encapsulation — exposing a clean public API while hiding implementation details.",
          "A common pattern is to have a public function that validates input or orchestrates work, then delegate to private helpers for the actual logic. If you try to call a private function from outside the module, you'll get an UndefinedFunctionError.",
        ],
        code: {
          title: "Public API with private helpers",
          code: `defmodule Formatter do
  # Public API
  def format_name(first, last) do
    "#{capitalize(first)} #{capitalize(last)}"
  end

  # Private helper — only callable within Formatter
  defp capitalize(<<first::utf8, rest::binary>>) do
    String.upcase(<<first::utf8>>) <> String.downcase(rest)
  end
  defp capitalize(""), do: ""
end

Formatter.format_name("josé", "VALIM")
# => "José Valim"

# Formatter.capitalize("test")
# => ** (UndefinedFunctionError)`,
          output: "\"José Valim\"",
        },
      },
      {
        title: "Anonymous Functions",
        prose: [
          "Anonymous functions are function values — they can be stored in variables, passed as arguments, and returned from other functions. You create them with fn and call them with a dot: add.(1, 2). The dot is necessary to distinguish calling an anonymous function from calling a named one.",
          "Anonymous functions can also have multiple clauses, just like named functions. They close over their environment (they're closures), meaning they capture variables from the scope where they were defined.",
          "The capture operator & provides a shorthand. &(&1 + &2) is equivalent to fn a, b -> a + b end. You can also capture named functions: &String.upcase/1 creates an anonymous function that calls String.upcase.",
        ],
        code: {
          title: "Anonymous functions and capture",
          code: `# Basic anonymous function
add = fn a, b -> a + b end
add.(1, 2)  # => 3

# Multiple clauses
describe = fn
  0 -> "zero"
  n when n > 0 -> "positive"
  _ -> "negative"
end
describe.(5)   # => "positive"
describe.(-1)  # => "negative"

# Closure — captures the outer variable
multiplier = 3
triple = fn x -> x * multiplier end
triple.(10)  # => 30

# Capture operator shorthand
double = &(&1 * 2)
double.(5)  # => 10

# Capturing a named function
shout = &String.upcase/1
shout.("hello")  # => "HELLO"`,
          output: "\"HELLO\"",
        },
      },
      {
        title: "import, alias, require, and use",
        prose: [
          "Elixir provides four directives for working with modules. import brings functions into scope so you can call them without the module prefix — import Enum lets you write map(list, fn) instead of Enum.map(list, fn). You can limit imports with only: or except:.",
          "alias shortens a module name. alias MyApp.Accounts makes Accounts available as a shorthand. This is purely for convenience and readability — it doesn't change any behavior.",
          "require ensures a module is compiled before the current one. You need it when using macros from another module (for example, require Logger before calling Logger.debug).",
          "use is a macro that calls the target module's __using__/1 callback. It's commonly used for setup — use GenServer injects default GenServer callbacks into your module. Under the hood, it's just require plus a macro call.",
        ],
        code: {
          title: "Module directives",
          code: `defmodule MyApp.OrderProcessor do
  # Shorten the module name
  alias MyApp.Accounts.User
  # Now we can write User instead of MyApp.Accounts.User

  # Bring specific functions into scope
  import Enum, only: [map: 2, filter: 2]

  # Required for macros
  require Logger

  def process(orders) do
    Logger.info("Processing \#{length(orders)} orders")

    orders
    |> filter(fn o -> o.status == :pending end)
    |> map(fn o -> %{o | status: :processed} end)
  end
end`,
          output: "[%{status: :processed, ...}]",
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
        title: "Multi-Clause Calculator",
        difficulty: "beginner",
        prompt:
          "Create a Calculator module with a compute/3 function that takes two numbers and an operator atom (:add, :subtract, :multiply, :divide). Use multiple function clauses with pattern matching on the operator — no case or cond. Handle division by zero by returning {:error, :division_by_zero}.",
        hints: [
          { text: "Define separate function heads for each operator: def compute(a, b, :add), def compute(a, b, :subtract), etc." },
          { text: "For division, add a guard clause: def compute(_, 0, :divide) to catch division by zero before the normal division clause." },
          { text: "Remember that clause order matters — more specific patterns should come before general ones." },
        ],
        solution: `defmodule Calculator do
  def compute(a, b, :add), do: {:ok, a + b}
  def compute(a, b, :subtract), do: {:ok, a - b}
  def compute(a, b, :multiply), do: {:ok, a * b}
  def compute(_, 0, :divide), do: {:error, :division_by_zero}
  def compute(a, b, :divide), do: {:ok, a / b}
end

Calculator.compute(10, 3, :add)       # => {:ok, 13}
Calculator.compute(10, 3, :subtract)  # => {:ok, 7}
Calculator.compute(10, 3, :multiply)  # => {:ok, 30}
Calculator.compute(10, 0, :divide)    # => {:error, :division_by_zero}
Calculator.compute(10, 3, :divide)    # => {:ok, 3.3333333333333335}`,
        walkthrough: [
          "Each operator gets its own function clause. Pattern matching on the third argument (:add, :subtract, etc.) routes the call to the right clause — no conditional logic needed.",
          "The division-by-zero clause (matching b = 0) must come before the general division clause. Elixir tries clauses top-to-bottom, so if the general clause came first, it would always match.",
          "We wrap results in {:ok, value} and {:error, reason} tuples. This is idiomatic Elixir — tagged tuples signal success or failure and compose well with case and with.",
          "The single-line do: syntax keeps simple function bodies clean. For multi-line bodies, use the do...end block form.",
        ],
      },
      {
        title: "Function Transformer",
        difficulty: "intermediate",
        prompt:
          "Write a module called Transform with these functions:\n1. apply_twice/2 — takes a function and a value, applies the function twice\n2. compose/2 — takes two functions and returns a new function that applies the first then the second\n3. apply_all/2 — takes a list of functions and a value, applies them in order left-to-right\n\nExample: compose(&String.upcase/1, &String.reverse/1) should return a function that upcases then reverses.",
        hints: [
          { text: "apply_twice just calls f.(f.(value))." },
          { text: "compose returns a new anonymous function: fn x -> g.(f.(x)) end." },
          { text: "apply_all can use Enum.reduce/3 — the accumulator starts as the value, and each step applies the next function." },
        ],
        solution: `defmodule Transform do
  def apply_twice(f, value) do
    f.(f.(value))
  end

  def compose(f, g) do
    fn x -> g.(f.(x)) end
  end

  def apply_all(fns, value) do
    Enum.reduce(fns, value, fn f, acc -> f.(acc) end)
  end
end

# apply_twice
Transform.apply_twice(fn x -> x * 2 end, 3)
# => 12  (3 * 2 = 6, 6 * 2 = 12)

# compose
shout_reverse = Transform.compose(&String.upcase/1, &String.reverse/1)
shout_reverse.("hello")
# => "OLLEH"

# apply_all
pipeline = [&String.trim/1, &String.upcase/1, &String.reverse/1]
Transform.apply_all(pipeline, "  hello  ")
# => "OLLEH"`,
        walkthrough: [
          "apply_twice is straightforward: apply f to value, then apply f to that result. This shows that functions are just values you can call repeatedly.",
          "compose returns a new anonymous function (a closure). The returned function captures f and g from the outer scope and chains them. This is function composition — a fundamental concept in functional programming.",
          "apply_all uses Enum.reduce to fold over the list of functions. The accumulator starts as the initial value, and each step applies the next function. This is like a pipeline built at runtime.",
          "The & capture operator makes it easy to pass named functions. &String.upcase/1 creates an anonymous function wrapping String.upcase — no need to write fn s -> String.upcase(s) end.",
        ],
      },
      {
        title: "Mini Module System",
        difficulty: "advanced",
        prompt:
          "Create a Validator module that validates a user map. It should have:\n1. A public validate/1 function that takes a map and returns {:ok, user} or {:error, reasons} where reasons is a list of error strings\n2. Private validation functions: validate_name/1, validate_email/1, validate_age/1\n3. validate_name checks the :name key is a non-empty string\n4. validate_email checks the :email key contains an \"@\"\n5. validate_age checks the :age key is an integer >= 0\n6. All errors should be collected (don't stop at the first one)\n\nUse default arguments to make validate accept an optional list of fields to validate (default: all three).",
        hints: [
          { text: "The public function can call each private validator and collect results. Think about how to gather errors from multiple checks." },
          { text: "Each validator can return :ok or {:error, \"message\"}. Then filter the results for errors." },
          { text: "Use a default argument: def validate(user, fields \\\\ [:name, :email, :age]). Then map over the fields to run the right validator." },
          { text: "A Map or keyword list can map field names to their validator functions. Or use a case/cond to dispatch." },
        ],
        solution: `defmodule Validator do
  def validate(user, fields \\\\ [:name, :email, :age]) do
    errors =
      fields
      |> Enum.map(fn field -> validate_field(user, field) end)
      |> Enum.filter(fn result -> result != :ok end)
      |> Enum.map(fn {:error, msg} -> msg end)

    case errors do
      [] -> {:ok, user}
      errors -> {:error, errors}
    end
  end

  defp validate_field(user, :name), do: validate_name(user)
  defp validate_field(user, :email), do: validate_email(user)
  defp validate_field(user, :age), do: validate_age(user)

  defp validate_name(%{name: name}) when is_binary(name) and byte_size(name) > 0 do
    :ok
  end
  defp validate_name(_), do: {:error, "name must be a non-empty string"}

  defp validate_email(%{email: email}) when is_binary(email) do
    if String.contains?(email, "@"), do: :ok, else: {:error, "email must contain @"}
  end
  defp validate_email(_), do: {:error, "email is required"}

  defp validate_age(%{age: age}) when is_integer(age) and age >= 0 do
    :ok
  end
  defp validate_age(_), do: {:error, "age must be a non-negative integer"}
end

Validator.validate(%{name: "José", email: "jose@example.com", age: 30})
# => {:ok, %{name: "José", email: "jose@example.com", age: 30}}

Validator.validate(%{name: "", email: "no-at-sign", age: -1})
# => {:error, ["name must be a non-empty string", "email must contain @",
#              "age must be a non-negative integer"]}

Validator.validate(%{name: "José", email: "bad"}, [:email])
# => {:error, ["email must contain @"]}`,
        walkthrough: [
          "The public validate/1 function uses a default argument to optionally limit which fields are checked. This creates both validate/1 (checks all) and validate/2 (checks specific fields).",
          "A private dispatch function validate_field/2 routes each field atom to its specific validator. This keeps the public function clean and each validator focused on one concern.",
          "Each validator uses multiple clauses with guards. The happy-path clause matches the expected shape and returns :ok. The catch-all clause returns an error. Pattern matching + guards make the validation logic very readable.",
          "Errors are collected by mapping all fields through their validators, filtering out :ok results, and extracting the error messages. This ensures all errors are reported, not just the first one.",
          "The final case returns {:ok, user} when there are no errors, or {:error, reasons} with the full list. This pattern — validate everything, collect errors — is common in form validation and API input handling.",
        ],
      },
    ],
  },
};

export default functionsAndModules;
