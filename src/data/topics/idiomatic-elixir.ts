import type { TopicContent } from "@/lib/types";
import questions from "./questions/idiomatic-elixir";

const idiomaticElixir: TopicContent = {
  meta: {
    slug: "idiomatic-elixir",
    title: "Idiomatic Elixir & Common Patterns",
    description: "Pipe-friendly design, tagged tuples, naming conventions, and the pipeline mindset",
    number: 26,
    active: true,
  },

  eli5: {
    analogyTitle: "The Recipe Book",
    analogy:
      "Imagine you're learning to cook. You know what ingredients are (data types), you can chop and stir (functions), and you understand the oven (processes). But there's a difference between someone who can cook and a real chef. A chef knows which knife to grab without thinking, arranges their workspace so ingredients flow naturally from prep to plate, and follows conventions that any other chef would instantly recognise. Idiomatic Elixir is like learning to cook the way professional chefs do — not inventing your own way of doing everything, but following proven conventions that make your code readable, composable, and predictable to anyone in the Elixir community.",
    items: [
      { label: "Pipeline Thinking", description: "Chefs set up their station so food flows left to right — raw ingredients in, finished dish out. In Elixir, you think of your program the same way: data flows through a pipeline of transformations." },
      { label: "Naming Conventions", description: "A chef labels everything clearly. In Elixir, a ? at the end means 'this returns yes or no', and a ! means 'this will crash if something goes wrong'. Everyone in the kitchen knows what these labels mean." },
      { label: "Tagged Tuples", description: "When a chef passes a dish, they say 'this is ready' or 'this needs more salt'. Elixir functions do the same with {:ok, result} and {:error, reason} — a universal signal that everyone understands." },
      { label: "Right Tool for the Job", description: "A chef doesn't use a blender to crack an egg. Similarly, you don't wrap stateless code in a GenServer or use try/rescue when pattern matching would do. Choosing the simplest tool that fits is the mark of experience." },
    ],
    keyTakeaways: [
      "Design functions with the subject as the first argument so they work naturally with the pipe operator |>.",
      "Use ? for boolean-returning functions and ! for functions that raise on failure.",
      "Always use {:ok, value} and {:error, reason} for operations that can fail — it's the universal convention.",
      "Prefer multiple function heads with pattern matching over conditionals inside a single function.",
      "Don't reach for a process (GenServer, Agent) when a plain module with functions will do.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Pipe-Friendly Design", color: "#6b46c1", examples: ["data |> validate() |> transform() |> persist()", "Enum.map(list, &func/1)", "String.trim(input)"], description: "Functions take the subject as the first argument, enabling clean pipelines." },
      { name: "Tagged Tuples", color: "#059669", examples: ["{:ok, result}", "{:error, :not_found}", "{:error, changeset}"], description: "The universal success/failure convention used across the entire ecosystem." },
      { name: "Naming Conventions", color: "#d97706", examples: ["String.valid?/1", "File.read!/1", "defp private_fn/0", "@doc false"], description: "? for booleans, ! for raising versions, defp for private, @doc false for hidden public." },
      { name: "Pattern Matching Style", color: "#2563eb", examples: ["def handle({:ok, val})", "def handle({:error, _})", "%{field: field} = map"], description: "Use function heads and destructuring instead of conditionals and type checks." },
      { name: "with Expression", color: "#e11d48", examples: ["with {:ok, a} <- step1(),", "     {:ok, b} <- step2(a),", "     do: {:ok, process(b)}"], description: "Chain fallible operations on the happy path, letting errors fall through." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Pipe-Friendly Function Design",
        prose: [
          "The single most important convention in Elixir is: put the data being transformed as the first argument. The entire standard library follows this rule — Enum.map(enumerable, fun), String.upcase(string), Map.put(map, key, value). This makes the pipe operator |> work naturally.",
          "When you design your own functions, follow the same pattern. If you're writing a function that validates a user, make the user the first argument: validate_user(user, opts). This lets callers write user |> validate_user(opts) |> save_user() instead of awkward workarounds.",
          "A good pipeline reads like a story: start with the input, then describe each transformation step. Each function takes the output of the previous step and returns something for the next step. Avoid side effects in the middle of a pipeline — they break the narrative flow.",
        ],
        code: {
          title: "Pipe-friendly vs. pipe-unfriendly design",
          code: `# Bad: data is the second argument — can't pipe cleanly
defmodule BadApi do
  def fetch(url, params), do: # ...
  def parse(format, response), do: # ...
  def extract(field, data), do: # ...
end

# You'd have to write this awkwardly:
response = BadApi.fetch(url, params)
parsed = BadApi.parse(:json, response)
result = BadApi.extract(:users, parsed)

# Good: data is always the first argument
defmodule GoodApi do
  def fetch(params, url), do: # ...
  def parse(response, format), do: # ...
  def extract(data, field), do: # ...
end

# Now it pipes beautifully:
params
|> GoodApi.fetch(url)
|> GoodApi.parse(:json)
|> GoodApi.extract(:users)`,
          output: "# Clean, readable pipeline",
        },
      },
      {
        title: "Naming Conventions: ? and !",
        prose: [
          "Elixir has two important naming suffixes. Functions ending with ? return a boolean — true or false, nothing else. Examples: Enum.empty?/1, String.contains?/2, Map.has_key?/2. When you write your own predicate functions, follow this convention.",
          "Functions ending with ! are the 'bang' versions. They raise an exception on failure instead of returning an error tuple. For example, File.read/1 returns {:ok, content} or {:error, reason}, while File.read!/1 returns the content directly or raises a File.Error. Use bang functions when failure is unexpected — in scripts, tests, or when the calling code would crash anyway.",
          "When writing your own library, provide both versions: the non-bang version for callers who want to handle errors, and the bang version for callers who want to crash fast. The bang version is typically a thin wrapper that raises on {:error, reason}.",
        ],
        code: {
          title: "The ? and ! conventions in practice",
          code: `# ? functions always return boolean
Enum.empty?([])          # => true
String.valid?("hello")   # => true
Map.has_key?(%{a: 1}, :a) # => true

# Non-bang: returns tagged tuples
{:ok, content} = File.read("exists.txt")
{:error, :enoent} = File.read("nope.txt")

# Bang: returns value or raises
content = File.read!("exists.txt")  # => "file contents"
File.read!("nope.txt")  # => ** (File.Error) no such file

# Writing both versions yourself
defmodule MyApp.Accounts do
  def fetch_user(id) do
    case Repo.get(User, id) do
      nil -> {:error, :not_found}
      user -> {:ok, user}
    end
  end

  def fetch_user!(id) do
    case fetch_user(id) do
      {:ok, user} -> user
      {:error, reason} -> raise "User not found: \#{reason}"
    end
  end
end`,
          output: "# Both versions available for different use cases",
        },
      },
      {
        title: "Tagged Tuples and the with Expression",
        prose: [
          "The {:ok, value} / {:error, reason} pattern is Elixir's universal error-handling convention. It's used by GenServer callbacks, Ecto operations, File I/O, HTTP clients, and virtually every library. Sticking to this convention means your code composes naturally with the rest of the ecosystem.",
          "When you need to chain multiple fallible operations, the with expression is your best friend. Each clause uses <- to pattern match on the happy path. If any step returns something that doesn't match, with short-circuits and returns that value (or falls through to the else clause).",
          "A common mistake is using = instead of <- inside with. The = operator will raise a MatchError on failure, defeating the purpose of using with. Always use <- for steps that might fail.",
        ],
        code: {
          title: "Chaining operations with with",
          code: `# Without with: nested case statements (pyramid of doom)
def create_order(params) do
  case validate(params) do
    {:ok, valid} ->
      case charge_payment(valid) do
        {:ok, payment} ->
          case save_order(valid, payment) do
            {:ok, order} -> {:ok, order}
            {:error, reason} -> {:error, reason}
          end
        {:error, reason} -> {:error, reason}
      end
    {:error, reason} -> {:error, reason}
  end
end

# With with: flat and readable
def create_order(params) do
  with {:ok, valid} <- validate(params),
       {:ok, payment} <- charge_payment(valid),
       {:ok, order} <- save_order(valid, payment) do
    {:ok, order}
  end
end

# with + else for custom error handling
def create_order(params) do
  with {:ok, valid} <- validate(params),
       {:ok, payment} <- charge_payment(valid),
       {:ok, order} <- save_order(valid, payment) do
    {:ok, order}
  else
    {:error, %Ecto.Changeset{} = cs} -> {:error, :validation, cs}
    {:error, :payment_declined} -> {:error, :payment, "Card declined"}
    {:error, reason} -> {:error, :unknown, reason}
  end
end`,
          output: "{:ok, %Order{}}",
        },
      },
      {
        title: "Multiple Function Heads over Conditionals",
        prose: [
          "One of the most powerful patterns in Elixir is using multiple function clauses instead of conditionals. Instead of writing one function with an if/cond/case inside, you write separate function heads that pattern match on the input. The BEAM dispatches to the right clause automatically.",
          "This makes your code declarative — you describe what to do for each shape of input, rather than writing procedural logic to figure out what you're looking at. It also makes it easy to add new cases: just add another function head.",
          "Combine this with guard clauses (when) for additional constraints that can't be expressed through pattern matching alone, like checking if a number is positive or if a string is non-empty.",
        ],
        code: {
          title: "Function heads vs. conditionals",
          code: `# Not idiomatic: one function with conditionals
def process(event) do
  cond do
    event.type == :click and event.target == :button ->
      handle_button_click(event)
    event.type == :click ->
      handle_click(event)
    event.type == :hover ->
      handle_hover(event)
    true ->
      :ignored
  end
end

# Idiomatic: multiple function heads
def process(%{type: :click, target: :button} = event) do
  handle_button_click(event)
end

def process(%{type: :click} = event) do
  handle_click(event)
end

def process(%{type: :hover} = event) do
  handle_hover(event)
end

def process(_event), do: :ignored

# With guards for numeric constraints
def classify(n) when n > 0, do: :positive
def classify(0), do: :zero
def classify(n) when n < 0, do: :negative`,
          output: ":positive",
        },
      },
      {
        title: "When to Use a Process vs. a Plain Module",
        prose: [
          "One of the most common mistakes intermediate Elixir developers make is reaching for a GenServer when a plain module would suffice. Ask yourself: does this code need to maintain state between calls? Does it need to handle concurrent access? If the answer to both is no, use a plain module.",
          "A module with functions is simpler, faster (no message passing overhead), easier to test, and easier to reason about. A GenServer serialises all calls through a single process — which is great when you need it, but an unnecessary bottleneck when you don't.",
          "Use a process when you need: mutable state that persists between calls, serialised access to a shared resource, periodic or scheduled work, or when you need to be part of a supervision tree for fault tolerance. For pure data transformations, validations, or stateless computations, a plain module is the right choice.",
        ],
        code: {
          title: "Plain module vs. unnecessary GenServer",
          code: `# Anti-pattern: GenServer for stateless computation
defmodule TemperatureConverter do
  use GenServer

  def start_link(_), do: GenServer.start_link(__MODULE__, nil)
  def init(nil), do: {:ok, nil}

  def celsius_to_fahrenheit(pid, c) do
    GenServer.call(pid, {:convert, c})
  end

  def handle_call({:convert, c}, _from, state) do
    {:reply, c * 9 / 5 + 32, state}
  end
end

# Idiomatic: plain module — no state needed!
defmodule TemperatureConverter do
  def celsius_to_fahrenheit(c), do: c * 9 / 5 + 32
  def fahrenheit_to_celsius(f), do: (f - 32) * 5 / 9
end

# Good use of GenServer: maintaining state
defmodule Counter do
  use GenServer

  def start_link(initial \\\\ 0) do
    GenServer.start_link(__MODULE__, initial)
  end

  def increment(pid), do: GenServer.call(pid, :increment)
  def value(pid), do: GenServer.call(pid, :value)

  def init(count), do: {:ok, count}
  def handle_call(:increment, _from, count), do: {:reply, count + 1, count + 1}
  def handle_call(:value, _from, count), do: {:reply, count, count}
end`,
          output: "# Counter needs state — GenServer is appropriate",
        },
      },
      {
        title: "Common Idioms and Patterns",
        prose: [
          "Experienced Elixir developers have a toolkit of small patterns they reach for instinctively. Learning these patterns helps you write code that other Elixir developers will immediately understand.",
          "The 'extract and capture' pattern (%{key: value} = whole) lets you destructure specific fields while keeping the whole structure available. The Access-based functions (get_in, put_in, update_in) handle nested data elegantly. The Kernel.then/2 function lets you insert arbitrary transformations into a pipeline.",
          "Another important idiom is preferring Enum functions over manual recursion for collection processing. While recursion is a fundamental skill, Enum.map, Enum.reduce, and friends are optimised, well-tested, and more readable for the common cases. Save manual recursion for when Enum doesn't have what you need.",
        ],
        code: {
          title: "Common idiomatic patterns",
          code: `# Extract and capture
def update_user(%{email: email} = user) do
  user
  |> Map.put(:email, String.downcase(email))
  |> Map.put(:updated_at, DateTime.utc_now())
end

# Nested access with get_in / put_in / update_in
config = %{db: %{pool: %{size: 10}}}
get_in(config, [:db, :pool, :size])       # => 10
put_in(config, [:db, :pool, :size], 20)   # => %{db: %{pool: %{size: 20}}}
update_in(config, [:db, :pool, :size], &(&1 * 2))  # => %{db: %{pool: %{size: 20}}}

# then/2 for ad-hoc pipeline steps
"  hello world  "
|> String.trim()
|> String.split()
|> then(fn words -> Enum.join(words, "-") end)
# => "hello-world"

# Prefer Enum over manual recursion
# Instead of:
def sum([]), do: 0
def sum([h | t]), do: h + sum(t)

# Use:
Enum.sum(list)
# or: Enum.reduce(list, 0, &+/2)`,
          output: "\"hello-world\"",
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
        title: "Pipe-Friendly API",
        difficulty: "beginner",
        prompt:
          "Refactor the following code to be pipe-friendly. The module processes a user signup: it trims the email, downcases it, validates the format, and creates the user. Currently, each function takes its arguments in a pipe-unfriendly order.\n\nOriginal:\n```elixir\ndefmodule Signup do\n  def process(email, name) do\n    trimmed = String.trim(email)\n    lowered = String.downcase(trimmed)\n    case validate_email(lowered) do\n      true -> create_user(name, lowered)\n      false -> {:error, :invalid_email}\n    end\n  end\nend\n```\n\nRewrite this so the entire process function reads as a single pipeline.",
        hints: [
          { text: "Think about what the 'subject' is flowing through the pipeline — it's the email string." },
          { text: "For the validation step, consider using then/2 or a private function that returns {:ok, email} or {:error, reason}." },
          { text: "The with expression can chain the validation and creation steps after the string transformations." },
        ],
        solution: `defmodule Signup do
  def process(email, name) do
    email
    |> String.trim()
    |> String.downcase()
    |> validate_email()
    |> create_if_valid(name)
  end

  defp validate_email(email) do
    if String.match?(email, ~r/@.+\\..+/) do
      {:ok, email}
    else
      {:error, :invalid_email}
    end
  end

  defp create_if_valid({:ok, email}, name) do
    # create_user would go here
    {:ok, %{name: name, email: email}}
  end

  defp create_if_valid({:error, _} = error, _name), do: error
end`,
        walkthrough: [
          "We start the pipeline with the email — it's the subject flowing through transformations.",
          "String.trim/1 and String.downcase/1 are already pipe-friendly (subject is the first argument).",
          "We extract validation into a separate function that returns a tagged tuple: {:ok, email} or {:error, reason}.",
          "create_if_valid/2 uses pattern matching on the tagged tuple to either proceed or pass through the error.",
          "The entire process function now reads as a clear, linear flow: trim → downcase → validate → create.",
        ],
      },
      {
        title: "with Expression Refactor",
        difficulty: "intermediate",
        prompt:
          "Refactor the following deeply nested code to use a with expression. The function fetches a user, checks their subscription, and generates an API key.\n\n```elixir\ndef generate_api_key(user_id) do\n  case fetch_user(user_id) do\n    {:ok, user} ->\n      case check_subscription(user) do\n        {:ok, :active} ->\n          case create_api_key(user) do\n            {:ok, key} -> {:ok, key}\n            {:error, reason} -> {:error, reason}\n          end\n        {:ok, :expired} -> {:error, :subscription_expired}\n        {:error, reason} -> {:error, reason}\n      end\n    {:error, reason} -> {:error, reason}\n  end\nend\n```",
        hints: [
          { text: "Each nested case corresponds to one clause in the with expression." },
          { text: "Use <- to match on the happy path. Non-matching values fall through to else." },
          { text: "The {:ok, :expired} case needs special handling in the else clause since it's technically an {:ok, _} match." },
        ],
        solution: `def generate_api_key(user_id) do
  with {:ok, user} <- fetch_user(user_id),
       {:ok, :active} <- check_subscription(user),
       {:ok, key} <- create_api_key(user) do
    {:ok, key}
  else
    {:ok, :expired} -> {:error, :subscription_expired}
    {:error, reason} -> {:error, reason}
  end
end`,
        walkthrough: [
          "Each level of nesting becomes a single <- clause in the with expression.",
          "The happy path is now flat: fetch user → check subscription is active → create key.",
          "If fetch_user returns {:error, reason}, the with short-circuits — it doesn't match {:ok, user}.",
          "The {:ok, :expired} return from check_subscription doesn't match {:ok, :active}, so it falls to else.",
          "In the else clause, we handle {:ok, :expired} specially (converting it to an error) and pass through other errors.",
          "The code went from 14 lines of nested cases to 8 lines of flat, readable logic.",
        ],
      },
      {
        title: "Replace Conditionals with Function Heads",
        difficulty: "intermediate",
        prompt:
          "Refactor the following function that uses a large cond block into idiomatic Elixir using multiple function heads and pattern matching.\n\n```elixir\ndef format_value(value) do\n  cond do\n    is_nil(value) -> \"N/A\"\n    is_boolean(value) and value -> \"Yes\"\n    is_boolean(value) and not value -> \"No\"\n    is_integer(value) and value > 1000 -> \"#{div(value, 1000)}K\"\n    is_integer(value) -> Integer.to_string(value)\n    is_float(value) -> :erlang.float_to_binary(value, decimals: 2)\n    is_binary(value) and byte_size(value) == 0 -> \"(empty)\"\n    is_binary(value) -> value\n    true -> inspect(value)\n  end\nend\n```",
        hints: [
          { text: "nil, true, and false can all be matched literally in function heads — no guards needed." },
          { text: "Use guards (when) for conditions like value > 1000 or byte_size(value) == 0." },
          { text: "Remember that function clauses are tried top-to-bottom, so put more specific matches before general ones." },
          { text: "is_binary/1 matches strings. An empty string \"\" can be matched literally." },
        ],
        solution: `def format_value(nil), do: "N/A"

def format_value(true), do: "Yes"

def format_value(false), do: "No"

def format_value(value) when is_integer(value) and value > 1000 do
  "\#{div(value, 1000)}K"
end

def format_value(value) when is_integer(value) do
  Integer.to_string(value)
end

def format_value(value) when is_float(value) do
  :erlang.float_to_binary(value, decimals: 2)
end

def format_value(""), do: "(empty)"

def format_value(value) when is_binary(value), do: value

def format_value(value), do: inspect(value)`,
        walkthrough: [
          "nil, true, and false are literal values that can be matched directly in function heads — no guard needed.",
          "The integer > 1000 clause comes before the general integer clause because Elixir tries clauses top-to-bottom.",
          "The empty string is matched literally with \"\" instead of using a guard with byte_size.",
          "The catch-all clause at the bottom uses inspect/1 for any unhandled type.",
          "Each function head is a clear, self-contained rule. Adding new types (like lists or tuples) is just adding a new clause.",
          "This is more readable, more extensible, and compiles to efficient pattern-matching dispatch rather than sequential condition evaluation.",
        ],
      },
      {
        title: "Idiomatic Module Design",
        difficulty: "advanced",
        prompt:
          "Design a module called ShoppingCart that follows all idiomatic Elixir conventions. It should support: creating a new cart, adding items (with name, price, quantity), removing items by name, calculating the total, and applying a percentage discount. The module should be a plain module (no GenServer), use tagged tuples for errors, be fully pipe-friendly, and follow naming conventions. Include both bang and non-bang versions of add_item (the non-bang should return an error if quantity is <= 0).",
        hints: [
          { text: "The cart struct should be the first argument to every function for pipe-friendliness." },
          { text: "Use a struct to represent the cart, with an items field that's a list of item maps." },
          { text: "For the bang version of add_item, wrap the non-bang version and raise on {:error, _}." },
          { text: "Consider using Enum.reduce for the total calculation, and update_in for modifying nested data." },
        ],
        solution: `defmodule ShoppingCart do
  defstruct items: []

  @type t :: %__MODULE__{items: [item()]}
  @type item :: %{name: String.t(), price: number(), quantity: pos_integer()}

  @doc "Creates a new empty cart."
  def new, do: %__MODULE__{}

  @doc "Adds an item to the cart. Returns {:ok, cart} or {:error, reason}."
  def add_item(cart, name, price, quantity) when quantity > 0 do
    item = %{name: name, price: price, quantity: quantity}
    {:ok, %{cart | items: [item | cart.items]}}
  end

  def add_item(_cart, _name, _price, _quantity) do
    {:error, :invalid_quantity}
  end

  @doc "Adds an item to the cart. Raises on invalid input."
  def add_item!(cart, name, price, quantity) do
    case add_item(cart, name, price, quantity) do
      {:ok, cart} -> cart
      {:error, reason} -> raise ArgumentError, "Cannot add item: \#{reason}"
    end
  end

  @doc "Removes all items matching the given name."
  def remove_item(cart, name) do
    %{cart | items: Enum.reject(cart.items, &(&1.name == name))}
  end

  @doc "Returns true if the cart has no items."
  def empty?(cart), do: cart.items == []

  @doc "Calculates the total price of all items."
  def total(cart) do
    Enum.reduce(cart.items, 0, fn item, acc ->
      acc + item.price * item.quantity
    end)
  end

  @doc "Applies a percentage discount (0-100) to the cart total."
  def apply_discount(cart, percent) when percent >= 0 and percent <= 100 do
    discounted_total = total(cart) * (1 - percent / 100)
    {:ok, discounted_total}
  end

  def apply_discount(_cart, _percent) do
    {:error, :invalid_discount}
  end
end

# Usage as a pipeline:
# ShoppingCart.new()
# |> ShoppingCart.add_item!("Elixir Book", 39.99, 1)
# |> ShoppingCart.add_item!("Stickers", 4.99, 3)
# |> ShoppingCart.remove_item("Stickers")
# |> ShoppingCart.total()`,
        walkthrough: [
          "The cart (struct) is always the first argument, making every function pipe-friendly.",
          "new/0 creates a cart — this is a common factory function pattern in Elixir modules.",
          "add_item/4 returns {:ok, cart} or {:error, reason}, following the tagged tuple convention.",
          "add_item!/4 wraps the non-bang version and raises on error — the standard bang pattern.",
          "empty?/1 follows the ? convention for boolean-returning functions.",
          "Guards on add_item and apply_discount validate inputs at the function-head level.",
          "The module is a plain struct with functions — no GenServer needed since there's no persistent state or concurrent access.",
          "The entire API can be used in a pipeline: new() |> add_item!(...) |> add_item!(...) |> total().",
        ],
      },
    ],
  },
};

export default idiomaticElixir;
