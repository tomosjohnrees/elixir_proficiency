import type { TopicContent } from "@/lib/types";

const protocols: TopicContent = {
  meta: {
    slug: "protocols",
    title: "Protocols",
    description: "Polymorphism, protocol definitions, and implementations",
    number: 15,
    active: true,
  },

  eli5: {
    analogyTitle: "The Universal Adapter",
    analogy:
      "Think about how a power outlet works differently in every country. Your laptop has one plug, but you can use it anywhere in the world with the right adapter. Each adapter knows how to translate between your plug and the local socket. You don't need to rebuild your laptop — you just need an adapter for each country.",
    items: [
      { label: "Protocol", description: "The shape of the plug — a standard that says 'anything that wants to connect must provide these specific prongs.' It defines what needs to happen, not how." },
      { label: "Implementation", description: "The adapter itself. Each country (data type) provides its own adapter that fits the standard plug shape. A UK adapter works differently from a US one, but both deliver power." },
      { label: "Dispatch", description: "Plugging in. When you push the plug into a socket, the system automatically picks the right adapter based on which country you're in. You don't choose manually — it just works." },
      { label: "Any", description: "A universal fallback adapter. If you visit a country nobody planned for, this catch-all adapter handles it — though it might not be the most efficient." },
    ],
    keyTakeaways: [
      "Protocols let you define a shared interface that different data types can implement in their own way.",
      "Unlike inheritance in OOP, protocols are opt-in — any type can add an implementation at any time.",
      "Elixir dispatches to the correct implementation based on the data type of the first argument.",
      "Built-in protocols like Enumerable, String.Chars, and Inspect power much of Elixir's standard library.",
      "You can implement protocols for your own structs and even for built-in types.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Protocol Definition", color: "#6b46c1", examples: ["defprotocol", "@spec", "@doc", "function heads"], description: "A protocol declares function signatures without bodies. It says 'any type that implements me must provide these functions.'" },
      { name: "Implementation", color: "#2563eb", examples: ["defimpl", "for: Type", "function bodies"], description: "Each implementation provides the actual logic for a specific data type. A protocol can have many implementations." },
      { name: "Built-in Protocols", color: "#d97706", examples: ["String.Chars", "Enumerable", "Inspect", "Collectable"], description: "Protocols that ship with Elixir. They're why to_string, Enum functions, and inspect work with many types." },
      { name: "Dispatch", color: "#059669", examples: ["first argument", "struct type", "atom/list/map"], description: "When you call a protocol function, Elixir checks the type of the first argument and routes to the matching implementation." },
      { name: "Derivation", color: "#e11d48", examples: ["@derive", "Protocol.derive", "Any"], description: "Shortcuts for implementing protocols. @derive auto-generates an implementation, and implementing for Any provides a fallback." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Defining a Protocol",
        prose: [
          "A protocol is defined with defprotocol. Inside, you declare function heads — just the name, arguments, and optionally a @spec — but no function bodies. This creates a contract that types must fulfill.",
          "Think of it as defining an interface. The protocol says what functions exist and what arguments they take, but each data type decides how to do the work.",
        ],
        code: {
          title: "Defining a simple protocol",
          code: `defprotocol Describable do
  @doc "Returns a human-readable description of the value"
  @spec describe(t) :: String.t()
  def describe(value)
end

defprotocol Sizeable do
  @doc "Returns the size of the data structure"
  @spec size(t) :: non_neg_integer()
  def size(data)
end`,
          output: "{:module, Describable, ...}",
        },
      },
      {
        title: "Implementing a Protocol",
        prose: [
          "You implement a protocol for a specific type using defimpl. The for: option specifies which type this implementation handles. Inside, you provide the actual function bodies.",
          "You can implement protocols for any built-in type (Atom, Integer, List, Map, etc.) or for your own structs. Each implementation is independent — you can add them in any module, even in a completely separate file from the protocol definition.",
        ],
        code: {
          title: "Protocol implementations",
          code: `# Implement for a built-in type
defimpl Describable, for: Integer do
  def describe(n), do: "the integer \#{n}"
end

defimpl Describable, for: BitString do
  def describe(s), do: "a string: \\"\#{s}\\""
end

defimpl Describable, for: List do
  def describe(list) do
    "a list with \#{length(list)} elements"
  end
end

# Now use it
Describable.describe(42)
# => "the integer 42"

Describable.describe("hello")
# => "a string: \\"hello\\""

Describable.describe([1, 2, 3])
# => "a list with 3 elements"`,
          output: "\"a list with 3 elements\"",
        },
      },
      {
        title: "Protocols with Structs",
        prose: [
          "Protocols really shine with structs. Each struct is its own type, so you can provide a tailored implementation for each one. This is how you achieve polymorphism in Elixir — different structs responding to the same function in their own way.",
          "When you call a protocol function, Elixir checks the struct's __struct__ field to find the right implementation. This dispatch happens at runtime and is very fast thanks to protocol consolidation at compile time.",
        ],
        code: {
          title: "Implementing protocols for structs",
          code: `defmodule Circle do
  defstruct [:radius]
end

defmodule Rectangle do
  defstruct [:width, :height]
end

defimpl Sizeable, for: Circle do
  def size(%Circle{radius: r}) do
    trunc(Float.round(:math.pi() * r * r))
  end
end

defimpl Sizeable, for: Rectangle do
  def size(%Rectangle{width: w, height: h}) do
    w * h
  end
end

circle = %Circle{radius: 5}
rect = %Rectangle{width: 3, height: 4}

Sizeable.size(circle)   # => 78
Sizeable.size(rect)     # => 12`,
          output: "12",
        },
      },
      {
        title: "Built-in Protocols",
        prose: [
          "Elixir's standard library uses protocols extensively. String.Chars powers to_string/1 and string interpolation. Enumerable makes Enum and Stream functions work with any collection. Inspect controls how values appear in IEx and with IO.inspect.",
          "When you implement String.Chars for your struct, you can use it in string interpolation with \#{}. When you implement Enumerable, all of Enum's 70+ functions work with your type automatically. This is the power of protocols — implement one interface and get a huge amount of functionality for free.",
        ],
        code: {
          title: "Implementing built-in protocols",
          code: `defmodule User do
  defstruct [:name, :email]
end

# Now string interpolation works with User
defimpl String.Chars, for: User do
  def to_string(user) do
    "\#{user.name} <\#{user.email}>"
  end
end

# Now IO.inspect shows a nice representation
defimpl Inspect, for: User do
  def inspect(user, _opts) do
    "#User<\#{user.name}>"
  end
end

user = %User{name: "Alice", email: "alice@example.com"}

"Hello, \#{user}"
# => "Hello, Alice <alice@example.com>"

inspect(user)
# => "#User<Alice>"`,
          output: "\"#User<Alice>\"",
        },
      },
      {
        title: "Fallbacks with Any and @derive",
        prose: [
          "Sometimes you want a protocol to work with types that haven't explicitly implemented it. You can implement the protocol for Any as a catch-all, then opt in with @fallback_to_any true in the protocol definition.",
          "For common cases, @derive provides a shortcut. Adding @derive [Protocol] before a struct definition auto-generates an implementation. Not all protocols support derivation, but Inspect is a common one that does.",
        ],
        code: {
          title: "Any fallback and @derive",
          code: `# Protocol with a fallback
defprotocol Loggable do
  @fallback_to_any true
  def log(value)
end

# Default implementation for anything
defimpl Loggable, for: Any do
  def log(value) do
    IO.puts("[LOG] \#{inspect(value)}")
  end
end

# Specific implementation overrides the fallback
defimpl Loggable, for: User do
  def log(user) do
    IO.puts("[LOG] User: \#{user.name}")
  end
end

Loggable.log(%User{name: "Bob", email: "bob@ex.com"})
# => [LOG] User: Bob

Loggable.log({:some, :tuple})
# => [LOG] {:some, :tuple}

# Using @derive for quick implementations
defmodule Product do
  @derive {Inspect, only: [:name, :price]}
  defstruct [:name, :price, :internal_id]
end

inspect(%Product{name: "Widget", price: 9.99, internal_id: "x123"})
# => "#Product<name: \\"Widget\\", price: 9.99>"`,
          output: "#Product<name: \"Widget\", price: 9.99>",
        },
      },
      {
        title: "Protocol Consolidation",
        prose: [
          "In development, protocol dispatch does a runtime lookup to find the right implementation. In production (when you compile a release), Elixir consolidates protocols — it precomputes the dispatch table at compile time, making protocol calls as fast as direct function calls.",
          "This is why you sometimes see warnings like 'protocol String.Chars not implemented for MyStruct' at compile time in production but not in dev. Consolidation catches missing implementations early. You can check which protocols are consolidated with Protocol.consolidated?/1.",
        ],
        code: {
          title: "Checking protocol consolidation",
          code: `# Check if a protocol is consolidated
Protocol.consolidated?(Enumerable)
# => true (in a compiled release)
# => false (in dev/iex)

# See all types that implement a protocol
Enumerable.__protocol__(:impls)
# => {:consolidated, [Date.Range, File.Stream,
#     Function, GenEvent.Stream, HashDict,
#     HashSet, IO.Stream, List, Map, MapSet,
#     Range, Stream, ...]}

# Attempting to use an unimplemented protocol
# raises a clear error:
# ** (Protocol.UndefinedError)
#    protocol Sizeable not implemented for "hello"
#    of type BitString`,
          output: "true",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does defprotocol define?",
        options: [
          { label: "A module with default function implementations" },
          { label: "Function signatures that types must implement", correct: true },
          { label: "A struct with enforced keys" },
          { label: "A behaviour with callbacks" },
        ],
        explanation:
          "defprotocol defines function heads (signatures) without bodies. It creates a contract — any type that wants to work with this protocol must provide implementations of those functions via defimpl.",
      },
      {
        question: "How does Elixir decide which protocol implementation to use?",
        options: [
          { label: "By the return type of the function" },
          { label: "By the module where the call is made" },
          { label: "By the data type of the first argument", correct: true },
          { label: "By a priority ranking you define" },
        ],
        explanation:
          "Protocol dispatch is based on the type of the first argument. When you call Describable.describe(42), Elixir sees an Integer and routes to the defimpl Describable, for: Integer implementation.",
      },
      {
        question: "Can you implement a protocol for a type you didn't define?",
        options: [
          { label: "No, you can only implement protocols for your own structs" },
          { label: "Yes, but only in the module that defines the protocol" },
          { label: "Yes, you can implement protocols for any type anywhere", correct: true },
          { label: "Only if the type explicitly allows it" },
        ],
        explanation:
          "This is a key advantage of protocols over inheritance. You can implement a protocol for any type — built-in types like Integer or List, third-party structs, or your own types — from any module.",
      },
      {
        question: "What does @fallback_to_any true do in a protocol?",
        options: [
          { label: "Makes the protocol optional" },
          { label: "Automatically generates implementations for all types" },
          { label: "Uses the defimpl for: Any when no specific implementation exists", correct: true },
          { label: "Disables compile-time protocol consolidation" },
        ],
        explanation:
          "With @fallback_to_any true, if a type hasn't implemented the protocol, Elixir falls back to the Any implementation instead of raising Protocol.UndefinedError. You still need to provide a defimpl for: Any.",
      },
      {
        question: "What is protocol consolidation?",
        options: [
          { label: "Merging all implementations into one module" },
          { label: "Precomputing the dispatch table at compile time for faster calls", correct: true },
          { label: "Removing unused protocol implementations" },
          { label: "Converting protocols to behaviours in production" },
        ],
        explanation:
          "Protocol consolidation is a compile-time optimization. Elixir precomputes which types implement which protocols, turning runtime lookups into direct function calls. This happens automatically when building releases.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Define and Implement a Protocol",
        difficulty: "beginner",
        prompt:
          "Define a protocol called Stringify with a single function stringify/1 that converts a value to a custom string representation. Implement it for Integer (return the number as a word for 1-3, or the digit otherwise), Atom (return the atom name without the colon), and List (return elements joined by ' and ').",
        hints: [
          { text: "Use defprotocol to define the protocol with one function head." },
          { text: "Use defimpl with for: to implement for each type. For atoms, Atom.to_string/1 is helpful." },
          { text: "For lists, Enum.join/2 can join elements with a separator." },
        ],
        solution: `defprotocol Stringify do
  @spec stringify(t) :: String.t()
  def stringify(value)
end

defimpl Stringify, for: Integer do
  def stringify(1), do: "one"
  def stringify(2), do: "two"
  def stringify(3), do: "three"
  def stringify(n), do: Integer.to_string(n)
end

defimpl Stringify, for: Atom do
  def stringify(atom), do: Atom.to_string(atom)
end

defimpl Stringify, for: List do
  def stringify(list) do
    list
    |> Enum.map(&Stringify.stringify/1)
    |> Enum.join(" and ")
  end
end

Stringify.stringify(2)           # => "two"
Stringify.stringify(42)          # => "42"
Stringify.stringify(:hello)      # => "hello"
Stringify.stringify([1, 2, 3])   # => "one and two and three"`,
        walkthrough: [
          "We define Stringify with defprotocol containing a single function head stringify/1.",
          "The Integer implementation uses pattern matching for 1-3 and falls back to Integer.to_string/1 for other numbers.",
          "The Atom implementation simply converts the atom to a string, which strips the leading colon.",
          "The List implementation recursively calls Stringify.stringify/1 on each element before joining. This means list elements can be any type that implements Stringify.",
        ],
      },
      {
        title: "Protocol for Structs",
        difficulty: "intermediate",
        prompt:
          "Create a protocol called Formattable with a format/1 function. Define two structs: Currency (with :amount and :code fields) and Percentage (with :value field). Implement Formattable for both so that Currency formats as '$12.50' (for USD) or '12.50 EUR' and Percentage formats as '42.5%'.",
        hints: [
          { text: "Define the structs with defmodule and defstruct, then implement the protocol separately." },
          { text: "Use :erlang.float_to_binary/2 or Float.round/2 for formatting decimal places." },
          { text: "Pattern match on the :code field to decide prefix vs suffix for currency." },
        ],
        solution: `defprotocol Formattable do
  @spec format(t) :: String.t()
  def format(value)
end

defmodule Currency do
  defstruct [:amount, :code]
end

defmodule Percentage do
  defstruct [:value]
end

defimpl Formattable, for: Currency do
  def format(%Currency{amount: amount, code: "USD"}) do
    "$\#{format_amount(amount)}"
  end

  def format(%Currency{amount: amount, code: code}) do
    "\#{format_amount(amount)} \#{code}"
  end

  defp format_amount(amount) do
    :erlang.float_to_binary(amount / 1, [decimals: 2])
  end
end

defimpl Formattable, for: Percentage do
  def format(%Percentage{value: value}) do
    "\#{value}%"
  end
end

Formattable.format(%Currency{amount: 12.5, code: "USD"})
# => "$12.50"

Formattable.format(%Currency{amount: 99.0, code: "EUR"})
# => "99.00 EUR"

Formattable.format(%Percentage{value: 42.5})
# => "42.5%"`,
        walkthrough: [
          "We define the protocol first, then the structs, then the implementations. In a real project, these could live in separate files.",
          "The Currency implementation pattern matches on the :code field to choose between prefix (USD → $) and suffix (other currencies → code after amount).",
          ":erlang.float_to_binary/2 with decimals: 2 ensures we always show two decimal places, so 99.0 becomes '99.00'.",
          "Each struct gets its own independent implementation. Adding a new struct (like Temperature) later doesn't require changing any existing code.",
        ],
      },
      {
        title: "Implement Enumerable",
        difficulty: "advanced",
        prompt:
          "Create a struct called Countdown that stores a :from value. Implement the Enumerable protocol for it so that Enum.to_list(%Countdown{from: 5}) returns [5, 4, 3, 2, 1]. You need to implement reduce/3, count/1, and member?/2.",
        hints: [
          { text: "The Enumerable protocol requires three functions: reduce/3, count/1, and member?/2." },
          { text: "reduce/3 is the core — it takes the enumerable, an accumulator {:cont, acc} or {:halt, acc} or {:suspend, acc}, and a function." },
          { text: "For count/1 and member?/2, return {:ok, value} to provide an optimized answer or {:error, __MODULE__} to fall back to reduce." },
        ],
        solution: `defmodule Countdown do
  defstruct [:from]
end

defimpl Enumerable, for: Countdown do
  def count(%Countdown{from: n}) do
    {:ok, max(n, 0)}
  end

  def member?(%Countdown{from: n}, value) when is_integer(value) do
    {:ok, value >= 1 and value <= n}
  end

  def member?(_countdown, _value) do
    {:ok, false}
  end

  def reduce(_countdown, {:halt, acc}, _fun) do
    {:halted, acc}
  end

  def reduce(countdown, {:suspend, acc}, fun) do
    {:suspended, acc, &reduce(countdown, &1, fun)}
  end

  def reduce(%Countdown{from: n}, {:cont, acc}, fun) when n <= 0 do
    {:done, acc}
  end

  def reduce(%Countdown{from: n}, {:cont, acc}, fun) do
    reduce(%Countdown{from: n - 1}, fun.(n, acc), fun)
  end

  def slice(_countdown) do
    {:error, __MODULE__}
  end
end

Enum.to_list(%Countdown{from: 5})
# => [5, 4, 3, 2, 1]

Enum.count(%Countdown{from: 10})
# => 10

Enum.member?(%Countdown{from: 5}, 3)
# => true

Enum.take(%Countdown{from: 100}, 3)
# => [100, 99, 98]`,
        walkthrough: [
          "count/1 returns {:ok, n} for an O(1) count. If we returned {:error, __MODULE__}, Enum would fall back to reduce (O(n)).",
          "member?/2 returns {:ok, boolean} for an O(1) membership check — a number belongs to the countdown if it's between 1 and n.",
          "reduce/3 is the heart of Enumerable. It handles three accumulator states: :halt (stop immediately), :suspend (pause for lazy evaluation), and :cont (continue).",
          "The :cont clause does the actual work — it passes the current number n to the reducer function, then recurses with n-1. When n reaches 0, we return {:done, acc}.",
          "slice/1 returns {:error, __MODULE__} because we don't support random access. Elixir will fall back to reduce for slice operations.",
        ],
      },
    ],
  },
};

export default protocols;
