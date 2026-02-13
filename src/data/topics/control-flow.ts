import type { TopicContent } from "@/lib/types";
import Animation10WithChain from "@/components/animations/Animation10WithChain";

const controlFlow: TopicContent = {
  meta: {
    slug: "control-flow",
    title: "Control Flow",
    description: "case, cond, if/unless, and with expressions",
    number: 5,
    active: true,
  },

  eli5: {
    analogyTitle: "The Choose-Your-Own-Adventure Book",
    analogy:
      "Think of your code as a choose-your-own-adventure book. At certain points in the story, you reach a decision page: \"If you have the golden key, turn to page 42. If you have the silver coin, turn to page 17. Otherwise, turn to page 5.\" Each decision checks what you're carrying and sends you down a different path. Elixir gives you several styles of decision pages depending on what kind of choice you're making.",
    items: [
      { label: "case", description: "A decision page that checks the shape of what you're carrying. \"If it's a golden key, go here. If it's two coins, go there.\" It uses pattern matching to pick the path." },
      { label: "cond", description: "A decision page with a list of yes/no questions checked in order. \"Is it raining? Are you hungry? Is it past noon?\" The first true answer wins." },
      { label: "if/unless", description: "The simplest decision page — just one yes-or-no question. \"If you have the map, go left. Otherwise, go right.\"" },
      { label: "with", description: "A chain of checkpoints. You must pass each one in order. If any checkpoint fails, you get redirected to a fallback page instead of continuing." },
    ],
    keyTakeaways: [
      "case is the workhorse — it pattern-matches a value against multiple clauses, just like a function head.",
      "cond checks a series of boolean conditions and runs the first truthy one. Use it when you're not matching a single value.",
      "if/unless are simple two-branch checks. They're expressions that return values, not statements.",
      "with chains multiple pattern matches together and bails out cleanly on the first failure.",
      "All control flow constructs in Elixir are expressions — they always return a value.",
    ],
  },

  visuals: {
    animation: Animation10WithChain,
    animationDuration: 19,
    dataTypes: [
      { name: "case", color: "#6b46c1", examples: ["case value do", "  pattern -> result", "  _ -> default", "end"], description: "Pattern-matches a single value against multiple clauses. The first matching clause wins." },
      { name: "cond", color: "#2563eb", examples: ["cond do", "  condition -> result", "  true -> default", "end"], description: "Evaluates boolean conditions top-to-bottom. The first truthy condition wins." },
      { name: "if / unless", color: "#059669", examples: ["if condition do", "  result", "else", "  fallback", "end"], description: "Simple two-branch decision. unless is the negated version of if." },
      { name: "with", color: "#d97706", examples: ["with {:ok, a} <- step1(),", "     {:ok, b} <- step2(a) do", "  use(a, b)", "end"], description: "Chains pattern-matched steps. Bails to else on first non-match." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "case — Pattern Matching on a Value",
        prose: [
          "case takes a single expression and tries to match it against a series of patterns, top to bottom. The first pattern that matches has its body executed. This is the most common control flow construct in Elixir because it leverages the same pattern matching you already know.",
          "You can use any pattern you'd use in a regular match: literals, variables, tuples, lists, maps, and the pin operator ^. If no clause matches, Elixir raises a CaseClauseError — so you'll often include a catch-all _ clause.",
          "Guards can be added to case clauses with when, giving you extra power to constrain matches beyond what patterns alone can express.",
        ],
        code: {
          title: "case in action",
          code: `# Matching tagged tuples — the bread and butter of Elixir
result = {:ok, 42}

case result do
  {:ok, value} -> "Got: \#{value}"
  {:error, reason} -> "Failed: \#{reason}"
  _ -> "Something unexpected"
end
# => "Got: 42"

# With guards
case {3, 7} do
  {a, b} when a + b > 10 -> "big sum"
  {a, b} when a + b > 5  -> "medium sum"
  _ -> "small sum"
end
# => "medium sum"

# Using the pin operator
expected = :ok
case {:ok, "data"} do
  {^expected, data} -> "Matched :ok with \#{data}"
  _ -> "Not what we expected"
end
# => "Matched :ok with data"`,
          output: "\"Matched :ok with data\"",
        },
      },
      {
        title: "cond — When You Need Boolean Conditions",
        prose: [
          "cond evaluates a list of conditions top-to-bottom and executes the body of the first one that's truthy. Think of it as a chain of if/else-if that reads cleanly. It's the right tool when your decision depends on different conditions rather than matching a single value.",
          "If none of the conditions are truthy, Elixir raises a CondClauseError. The convention is to add a final true -> clause as a catch-all default.",
          "Remember that in Elixir, everything except false and nil is truthy — so conditions like 0 or \"\" will pass.",
        ],
        code: {
          title: "cond examples",
          code: `temperature = 35

cond do
  temperature > 40 -> "Dangerously hot"
  temperature > 30 -> "Hot"
  temperature > 20 -> "Pleasant"
  temperature > 10 -> "Cool"
  true -> "Cold"
end
# => "Hot"

# Checking multiple unrelated conditions
user = %{role: :admin, verified: true}

cond do
  user.role == :admin -> "Full access"
  user.verified -> "Standard access"
  true -> "Limited access"
end
# => "Full access"`,
          output: "\"Full access\"",
        },
      },
      {
        title: "if and unless — Simple Two-Branch Checks",
        prose: [
          "if and unless are the simplest control flow constructs. They check a single condition and choose between two branches. In Elixir, they're expressions — they return the value of whichever branch executes.",
          "unless is just if with the condition negated. It reads more naturally for certain checks: unless disabled do ... end. Avoid using unless with else — it's confusing. Just flip the condition and use if instead.",
          "There's also an inline form for one-liners: if condition, do: this, else: that. If the else branch is omitted and the condition is falsy, the expression returns nil.",
        ],
        code: {
          title: "if/unless examples",
          code: `# Block form
age = 20

if age >= 18 do
  "You can vote"
else
  "Too young to vote"
end
# => "You can vote"

# Inline form
status = if age >= 18, do: :adult, else: :minor
# => :adult

# unless — reads naturally for negative checks
bypass = false
unless bypass do
  "Running full checks"
end
# => "Running full checks"

# if returns nil when there's no else and condition is falsy
if false do
  "never reached"
end
# => nil`,
          output: "nil",
        },
      },
      {
        title: "with — Chaining Happy-Path Matches",
        prose: [
          "with is one of Elixir's most elegant constructs. It lets you chain a series of pattern matches together, and if any match fails, execution stops and the non-matching value is returned (or handled in an else block). It's perfect for sequences of operations that might each fail.",
          "Each <- clause in a with attempts a pattern match. If the match succeeds, the matched variables are available in subsequent clauses and the do block. If any match fails, with short-circuits.",
          "The else block is optional. Without it, a failed match returns the value as-is. With else, you can pattern-match on the failure to handle different error cases.",
        ],
        code: {
          title: "with in practice",
          code: `# Without with — nested case statements
opts = %{width: "10", height: "20"}

case Integer.parse(opts[:width]) do
  {w, ""} ->
    case Integer.parse(opts[:height]) do
      {h, ""} -> {:ok, w * h}
      _ -> {:error, :invalid_height}
    end
  _ -> {:error, :invalid_width}
end
# => {:ok, 200}

# With with — flat and readable
with {w, ""} <- Integer.parse(opts[:width]),
     {h, ""} <- Integer.parse(opts[:height]) do
  {:ok, w * h}
else
  :error -> {:error, :not_a_number}
  {_, rest} -> {:error, "trailing chars: \#{rest}"}
end
# => {:ok, 200}`,
          output: "{:ok, 200}",
        },
      },
      {
        title: "Choosing the Right Construct",
        prose: [
          "With four control flow tools available, it helps to have a quick rule of thumb. Use case when you're matching a single value against patterns — it's the most common choice. Use cond when you have multiple unrelated boolean conditions. Use if/unless for simple true/false checks. Use with when you need to chain multiple operations that might each fail.",
          "A key insight: Elixir developers tend to prefer case over if. Because pattern matching is so central to the language, even simple checks like testing if a value is :ok often use case rather than an if comparison. This keeps the codebase consistent and idiomatic.",
          "Remember that all of these constructs are expressions. You can assign their result to a variable, pass them as arguments, or pipe into them. There are no \"statements\" in Elixir.",
        ],
        code: {
          title: "Everything is an expression",
          code: `# Assigning from case
message = case File.read("hello.txt") do
  {:ok, content} -> "Read \#{byte_size(content)} bytes"
  {:error, :enoent} -> "File not found"
  {:error, reason} -> "Error: \#{reason}"
end

# Assigning from if
label = if String.length("hello") > 3, do: "long", else: "short"
# => "short"... wait, "hello" has 5 chars!
# => "long"

# Nesting in function calls
String.upcase(if true, do: "yes", else: "no")
# => "YES"`,
          output: "\"YES\"",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What happens when no clause matches in a case expression?",
        options: [
          { label: "It returns nil" },
          { label: "It raises a CaseClauseError", correct: true },
          { label: "It returns :error" },
          { label: "It silently does nothing" },
        ],
        explanation:
          "When no clause matches in case, Elixir raises a CaseClauseError. This is why it's good practice to include a catch-all _ clause when the set of possible values isn't exhaustive.",
      },
      {
        question: "What is the conventional catch-all clause in a cond expression?",
        options: [
          { label: "_ -> default" },
          { label: "else -> default" },
          { label: "true -> default", correct: true },
          { label: ":default -> default" },
        ],
        explanation:
          "cond evaluates boolean conditions, not patterns. Since true is always truthy, placing true -> ... as the last clause acts as a catch-all default. Using _ would be a syntax error in cond because it expects expressions, not patterns.",
      },
      {
        question: "What does `if false, do: \"yes\"` return (no else clause)?",
        options: [
          { label: "\"yes\"" },
          { label: "false" },
          { label: "nil", correct: true },
          { label: "It raises an error" },
        ],
        explanation:
          "In Elixir, if is an expression that must return a value. When the condition is falsy and there's no else branch, it returns nil.",
      },
      {
        question: "In a `with` expression, what happens when a `<-` clause fails to match?",
        options: [
          { label: "It raises a MatchError" },
          { label: "It returns nil" },
          { label: "It continues to the next clause" },
          { label: "It returns the non-matching value (or goes to else)", correct: true },
        ],
        explanation:
          "Unlike the = match operator, the <- in with doesn't raise on a failed match. Instead, the non-matching value is returned directly, or if there's an else block, it's matched there. This is what makes with great for happy-path chaining.",
      },
      {
        question: "Which is the most idiomatic way to handle a {:ok, value} / {:error, reason} result in Elixir?",
        options: [
          { label: "if result == {:ok, value}" },
          { label: "case result do {:ok, v} -> ... end", correct: true },
          { label: "cond do result == :ok -> ... end" },
          { label: "try do result rescue _ -> ... end" },
        ],
        explanation:
          "Pattern matching with case is the idiomatic way to handle tagged tuples like {:ok, value} and {:error, reason}. It's more expressive than equality checks and lets you destructure the value in the same step.",
      },
      {
        question: "Which values are considered falsy in Elixir?",
        options: [
          { label: "nil, false, 0, and \"\"" },
          { label: "nil and false only", correct: true },
          { label: "nil, false, 0, [], and \"\"" },
          { label: "false only" },
        ],
        explanation:
          "Elixir has a very short falsy list: only nil and false. Everything else — including 0, empty strings, empty lists, and empty maps — is truthy. This is simpler than many other languages and catches people coming from JavaScript or Python off guard.",
      },
      {
        question: "What does the following return?\n```\nwith {:ok, a} <- {:ok, 1},\n     {:ok, b} <- {:error, :nope},\n     {:ok, c} <- {:ok, 3} do\n  a + b + c\nend\n```",
        options: [
          { label: "6" },
          { label: "nil" },
          { label: "{:error, :nope}", correct: true },
          { label: "It raises a MatchError" },
        ],
        explanation:
          "When a <- clause in with fails to match, the non-matching value is returned immediately and no further clauses are evaluated. Here {:error, :nope} doesn't match {:ok, b}, so {:error, :nope} is returned as-is. The third clause and the do block are never reached.",
      },
      {
        question: "What does `if 0, do: \"truthy\", else: \"falsy\"` return?",
        options: [
          { label: "\"falsy\"" },
          { label: "\"truthy\"", correct: true },
          { label: "0" },
          { label: "It raises an ArgumentError" },
        ],
        explanation:
          "Since only nil and false are falsy in Elixir, the integer 0 is truthy. This trips up developers coming from C, JavaScript, or Python where 0 is falsy. The expression evaluates to \"truthy\".",
      },
      {
        question: "Which of these CANNOT be used in a guard clause?",
        options: [
          { label: "is_integer(x) and x > 0" },
          { label: "is_binary(name) and byte_size(name) > 0" },
          { label: "String.starts_with?(name, \"admin\")", correct: true },
          { label: "x in [:a, :b, :c]" },
        ],
        explanation:
          "Guard clauses only allow a limited set of expressions — type checks, comparison operators, arithmetic, and a few built-in functions. General-purpose functions like String.starts_with?/2 cannot be used in guards because they might have side effects or raise exceptions. The in operator is allowed because it's expanded at compile time.",
      },
      {
        question: "What is the result of this expression?\n```\ncase :ok do\n  x when is_atom(x) -> \"atom: #{x}\"\n  :ok -> \"literal ok\"\nend\n```",
        options: [
          { label: "\"literal ok\"" },
          { label: "\"atom: ok\"", correct: true },
          { label: "It raises a CaseClauseError" },
          { label: "It raises a CompileError due to unreachable clause" },
        ],
        explanation:
          "Clauses in case are evaluated top to bottom, and the first match wins. The pattern x when is_atom(x) matches any atom, so it matches :ok before the literal :ok clause is ever reached. The Elixir compiler will emit a warning about the unreachable second clause, but it compiles and runs fine.",
      },
      {
        question: "What happens with a `with` expression that has an `else` block when the non-matching value doesn't match any else clause?",
        options: [
          { label: "It returns nil" },
          { label: "It returns the non-matching value as-is" },
          { label: "It raises a WithClauseError", correct: true },
          { label: "It falls through to the next function clause" },
        ],
        explanation:
          "When a with has an else block, all non-matching values must be handled by one of the else clauses. If none of them match, Elixir raises a WithClauseError. This is an important distinction from with without else, where unmatched values simply pass through.",
      },
      {
        question: "Which is the correct way to use the pin operator inside a case clause?",
        options: [
          { label: "case x do ^y -> \"matched\" end", correct: true },
          { label: "case x do pin(y) -> \"matched\" end" },
          { label: "case x do y! -> \"matched\" end" },
          { label: "case x do =y -> \"matched\" end" },
        ],
        explanation:
          "The pin operator ^ is used to match against the existing value of a variable rather than rebinding it. Inside a case clause, ^y means \"match if the value equals what y currently holds.\" This is essential when you want to compare against a known value stored in a variable rather than creating a new binding.",
      },
      {
        question: "What does this code return?\n```\ncond do\n  nil -> \"nil branch\"\n  false -> \"false branch\"\n  0 -> \"zero branch\"\nend\n```",
        options: [
          { label: "\"nil branch\"" },
          { label: "\"false branch\"" },
          { label: "\"zero branch\"", correct: true },
          { label: "It raises a CondClauseError" },
        ],
        explanation:
          "cond evaluates each condition for truthiness. nil is falsy, so it's skipped. false is falsy, so it's skipped. 0 is truthy in Elixir (only nil and false are falsy), so \"zero branch\" is returned. This question tests your understanding of Elixir's truthiness rules in the context of cond.",
      },
      {
        question: "What does the following with expression return?\n```\nwith {:ok, a} <- {:ok, 1},\n     b = a + 10,\n     {:ok, c} <- {:ok, b * 2} do\n  c\nend\n```",
        options: [
          { label: "It raises a CompileError because = is not allowed in with" },
          { label: "1" },
          { label: "22", correct: true },
          { label: "{:ok, 22}" },
        ],
        explanation:
          "The with expression allows bare = matches alongside <- clauses. The = performs a regular match (which always succeeds for a simple variable binding). Here a is bound to 1, b is bound to 11 (1 + 10), and c is bound to 22 (11 * 2). The do block returns c, which is 22.",
      },
      {
        question: "How do multi-clause functions relate to control flow in Elixir?",
        options: [
          { label: "They are unrelated — functions and control flow are separate concepts" },
          { label: "Multi-clause functions replace the need for case, cond, and if entirely" },
          { label: "They use pattern matching and guards in function heads to branch logic, often replacing explicit control flow constructs", correct: true },
          { label: "They are syntactic sugar that compiles down to a single case expression internally" },
        ],
        explanation:
          "In idiomatic Elixir, multi-clause functions with pattern matching and guards in the function heads are a primary control flow mechanism. Instead of writing a single function body with case or cond, you define multiple clauses that each handle a specific shape of input. This approach is often preferred because it separates concerns at the function-head level and integrates naturally with Elixir's \"let it crash\" philosophy.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "FizzBuzz with cond",
        difficulty: "beginner",
        prompt:
          "Write a function fizzbuzz/1 that takes a number and returns: \"FizzBuzz\" if divisible by both 3 and 5, \"Fizz\" if divisible by 3, \"Buzz\" if divisible by 5, or the number as a string otherwise. Use cond.",
        hints: [
          { text: "Use rem(n, 3) == 0 to check divisibility by 3." },
          { text: "Check the combined condition (divisible by both 3 and 5) first, since cond stops at the first truthy clause." },
          { text: "Use Integer.to_string/1 or string interpolation to convert the number to a string in the default case." },
        ],
        solution: `defmodule FizzBuzz do
  def fizzbuzz(n) do
    cond do
      rem(n, 15) == 0 -> "FizzBuzz"
      rem(n, 3) == 0  -> "Fizz"
      rem(n, 5) == 0  -> "Buzz"
      true            -> Integer.to_string(n)
    end
  end
end

FizzBuzz.fizzbuzz(15)  # => "FizzBuzz"
FizzBuzz.fizzbuzz(9)   # => "Fizz"
FizzBuzz.fizzbuzz(10)  # => "Buzz"
FizzBuzz.fizzbuzz(7)   # => "7"`,
        walkthrough: [
          "We use cond because we're evaluating boolean conditions (divisibility checks) rather than pattern matching a value.",
          "The combined check (rem(n, 15) == 0) must come first. If we checked rem(n, 3) first, multiples of 15 would match \"Fizz\" and never reach \"FizzBuzz\".",
          "rem(n, 15) == 0 is equivalent to rem(n, 3) == 0 and rem(n, 5) == 0, but shorter.",
          "The true catch-all converts the number to a string so the return type is always a string.",
        ],
      },
      {
        title: "Safe Map Lookup",
        difficulty: "intermediate",
        prompt:
          "Write a function get_nested/3 that safely retrieves a nested value from a map. It takes a map, a list of keys (the path), and a default value. Return the default if any key in the path is missing or if an intermediate value isn't a map. Use with.\n\nExample: get_nested(%{a: %{b: 1}}, [:a, :b], 0) should return 1. get_nested(%{a: %{b: 1}}, [:a, :c], 0) should return 0.",
        hints: [
          { text: "Think about how to recursively walk the key path. Each step needs to verify the current value is a map and the key exists." },
          { text: "with can chain steps like: with {:ok, val} <- Map.fetch(map, key), ... do val end" },
          { text: "You could use Enum.reduce_while/3 or write a recursive function that uses with at each step." },
        ],
        solution: `defmodule SafeMap do
  def get_nested(map, keys, default) do
    Enum.reduce_while(keys, map, fn key, acc ->
      case acc do
        %{} = m ->
          case Map.fetch(m, key) do
            {:ok, val} -> {:cont, val}
            :error -> {:halt, :missing}
          end
        _ -> {:halt, :missing}
      end
    end)
    |> case do
      :missing -> default
      value -> value
    end
  end
end

data = %{user: %{profile: %{name: "José"}}}

SafeMap.get_nested(data, [:user, :profile, :name], "unknown")
# => "José"

SafeMap.get_nested(data, [:user, :settings, :theme], "dark")
# => "dark"

SafeMap.get_nested(data, [:user, :profile], "no profile")
# => %{name: "José"}`,
        walkthrough: [
          "We use Enum.reduce_while/3 to walk the key path one step at a time. At each step, we check two things: is the accumulator a map, and does it have the key?",
          "The case on acc checks that the current value is a map using %{} = m. If someone tries to dig into a non-map value (like a string), we halt with :missing.",
          "Map.fetch/2 returns {:ok, val} or :error — a perfect fit for pattern matching. We use {:cont, val} to keep going and {:halt, :missing} to stop early.",
          "After the reduce, we pipe into a case to convert :missing to the default value. Any other value passes through as the successful result.",
          "Note: Elixir has get_in/2 built-in for this, but building it yourself teaches you how with, case, and reduce_while compose together.",
        ],
      },
      {
        title: "Config Validator",
        difficulty: "advanced",
        prompt:
          "Write a function validate_config/1 that takes a map and validates multiple required fields using with. The config must have: a :name (non-empty string), a :port (integer between 1 and 65535), and an :env that's one of :dev, :test, or :prod. Return {:ok, config} if valid, or {:error, reason} describing the first problem found.",
        hints: [
          { text: "Use with to chain each validation step. Each step can use <- to match a success pattern." },
          { text: "You can write small helper functions like validate_name/1 that return {:ok, value} or {:error, reason}." },
          { text: "Guards work inside case clauses: case port do p when is_integer(p) and p > 0 and p <= 65535 -> ..." },
          { text: "The else block in with lets you handle all the different {:error, reason} patterns in one place." },
        ],
        solution: `defmodule Config do
  def validate_config(config) do
    with {:ok, name} <- validate_name(config),
         {:ok, port} <- validate_port(config),
         {:ok, env}  <- validate_env(config) do
      {:ok, %{name: name, port: port, env: env}}
    end
  end

  defp validate_name(%{name: name})
       when is_binary(name) and byte_size(name) > 0 do
    {:ok, name}
  end
  defp validate_name(%{name: ""}),
    do: {:error, "name cannot be empty"}
  defp validate_name(%{name: _}),
    do: {:error, "name must be a string"}
  defp validate_name(_),
    do: {:error, "name is required"}

  defp validate_port(%{port: port})
       when is_integer(port) and port >= 1 and port <= 65535 do
    {:ok, port}
  end
  defp validate_port(%{port: _}),
    do: {:error, "port must be an integer between 1 and 65535"}
  defp validate_port(_),
    do: {:error, "port is required"}

  defp validate_env(%{env: env})
       when env in [:dev, :test, :prod] do
    {:ok, env}
  end
  defp validate_env(%{env: _}),
    do: {:error, "env must be :dev, :test, or :prod"}
  defp validate_env(_),
    do: {:error, "env is required"}
end

Config.validate_config(%{name: "my_app", port: 4000, env: :prod})
# => {:ok, %{name: "my_app", port: 4000, env: :prod}}

Config.validate_config(%{name: "", port: 4000, env: :prod})
# => {:error, "name cannot be empty"}

Config.validate_config(%{name: "app", port: 99999, env: :prod})
# => {:error, "port must be an integer between 1 and 65535"}`,
        walkthrough: [
          "We break validation into three focused helper functions. Each returns {:ok, value} or {:error, reason} — the standard Elixir convention for fallible operations.",
          "with chains these validators elegantly. If validate_name returns {:error, reason}, the chain stops and {:error, reason} is returned immediately — no else block needed because the error tuples pass through unchanged.",
          "Each validator uses multiple function heads with guards. This is idiomatic Elixir: rather than writing if/else inside the function, we let pattern matching and guards handle the branching at the function-head level.",
          "The guard when env in [:dev, :test, :prod] is a clean way to check membership. The in macro expands to multiple comparisons at compile time.",
          "Notice we didn't use an else block in with here. Since all our validators return {:error, reason} tuples and that's exactly what we want to return on failure, the default pass-through behavior is perfect.",
        ],
      },
    ],
  },
};

export default controlFlow;
