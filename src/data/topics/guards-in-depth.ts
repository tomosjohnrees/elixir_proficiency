import type { TopicContent } from "@/lib/types";
import questions from "./questions/guards-in-depth";

const guardsInDepth: TopicContent = {
  meta: {
    slug: "guards-in-depth",
    title: "Guards in Depth",
    description: "Guard-safe expressions, custom guards, combining guards, and common gotchas",
    number: 30,
    active: true,
  },

  eli5: {
    analogyTitle: "The Nightclub Bouncer",
    analogy:
      "Imagine a nightclub with multiple doors, each leading to a different room. Every door has a bouncer who checks your ID before letting you in. The bouncers can only do quick, simple checks — they can look at your ID, check your age, see if your name is on the list. They can't call your employer, search the internet, or do anything that takes a long time. If a bouncer can't verify you, they just shake their head and you move to the next door.",
    items: [
      { label: "Guards", description: "The bouncers at each door. They add extra conditions beyond just matching the shape of your ticket (pattern matching)." },
      { label: "Guard-safe expressions", description: "The quick, simple checks bouncers are allowed to do — look at your ID, count the items in your bag, check if you're tall enough." },
      { label: "Failing guards", description: "If a bouncer's check fails or something goes wrong, they just wave you to the next door. No drama, no crashes." },
      { label: "Custom guards", description: "Training a bouncer with a new checklist. You write the rules once, and any door can use them." },
      { label: "Combining guards", description: "Bouncers can check multiple things: 'You must be over 21 AND on the guest list' or 'You need a VIP pass OR to be with someone who has one.'" },
    ],
    keyTakeaways: [
      "Guards add extra conditions to function clauses, case branches, and anonymous functions using the when keyword.",
      "Only a limited set of expressions are allowed in guards — they must be side-effect free and guaranteed to terminate.",
      "If a guard expression raises an error, it's silently treated as false — the clause simply doesn't match.",
      "You can create reusable custom guards with defguard/2 and defguardp/2.",
      "Multiple when clauses on the same function head are combined with OR logic.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Type Checks", color: "#6b46c1", examples: ["is_integer/1", "is_binary/1", "is_atom/1", "is_list/1", "is_map/1", "is_tuple/1", "is_boolean/1", "is_float/1", "is_number/1", "is_nil/1", "is_pid/1", "is_struct/1"], description: "Built-in type-checking guards. These are the most commonly used guards for dispatching based on the type of a value." },
      { name: "Comparison", color: "#2563eb", examples: ["==", "!=", "===", "!==", "<", ">", "<=", ">="], description: "Standard comparison operators. All work in guards. Remember === checks type+value, while == allows number coercion." },
      { name: "Arithmetic", color: "#d97706", examples: ["+", "-", "*", "/", "div/2", "rem/2", "abs/1"], description: "Basic arithmetic is guard-safe. Useful for checks like rem(n, 2) == 0 for even numbers." },
      { name: "Boolean", color: "#e11d48", examples: ["and", "or", "not", "in/2"], description: "Boolean operators for combining guard conditions. Note: && and || are NOT allowed — use and/or instead." },
      { name: "Size Functions", color: "#059669", examples: ["length/1", "map_size/1", "tuple_size/1", "byte_size/1", "bit_size/1"], description: "Functions that return the size of collections or binaries. All are guard-safe." },
      { name: "Other Guard-Safe", color: "#6b7280", examples: ["hd/1", "tl/1", "elem/2", "is_map_key/2", "node/0", "self/0"], description: "Additional guard-safe functions including list head/tail, tuple element access, and process-related checks." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "What Are Guards?",
        prose: [
          "Guards are extra conditions you attach to function clauses, case branches, receive blocks, and anonymous functions using the when keyword. They let you express constraints that pattern matching alone can't handle — like checking if a number is positive, or if a value falls within a range.",
          "Guards come after the pattern and before the -> or do. They're evaluated after the pattern matches successfully. If the guard returns true, the clause is selected. If it returns false (or raises an error), Elixir moves to the next clause.",
        ],
        code: {
          title: "Guards in function clauses",
          code: `# Pattern matching alone can't check "positive integer"
def absolute(n) when is_integer(n) and n >= 0, do: n
def absolute(n) when is_integer(n) and n < 0, do: -n

# Guards in case expressions
case value do
  x when is_binary(x) and byte_size(x) > 0 ->
    "non-empty string"
  x when is_binary(x) ->
    "empty string"
  _ ->
    "not a string"
end

# Guards in anonymous functions
check = fn
  x when is_integer(x) and x > 0 -> :positive
  x when is_integer(x) -> :non_positive
  _ -> :not_a_number
end`,
          output: ":positive",
        },
      },
      {
        title: "Guard-Safe Expressions",
        prose: [
          "Not every Elixir expression can be used in a guard. Guards must be side-effect free and guaranteed to terminate, so only a specific set of expressions is allowed. If you try to use something that isn't guard-safe, you'll get a compile error.",
          "The allowed expressions include: comparison operators (==, !=, <, >, etc.), boolean operators (and, or, not — but NOT &&, ||, !), arithmetic (+, -, *, /, div, rem, abs), type-check functions (is_integer, is_binary, is_atom, etc.), size functions (length, map_size, tuple_size, byte_size, bit_size), and a handful of other Kernel functions like hd, tl, elem, and in.",
          "Notably absent are String module functions, Enum functions, and any user-defined functions. You can't call String.length/1 in a guard, but you can call byte_size/1 or bit_size/1.",
        ],
        code: {
          title: "Allowed vs not allowed in guards",
          code: `# ✅ These work in guards
def greet(name) when is_binary(name) and byte_size(name) > 0 do
  "Hello, \#{name}!"
end

def even?(n) when is_integer(n) and rem(n, 2) == 0, do: true
def even?(_), do: false

def first_element(tuple) when tuple_size(tuple) > 0 do
  elem(tuple, 0)
end

# ❌ These would cause compile errors:
# def bad(x) when String.length(x) > 5    — not guard-safe
# def bad(x) when Enum.count(x) > 3       — not guard-safe
# def bad(x) when my_function(x)          — user functions not allowed
# def bad(x) when x && true               — && not allowed, use "and"`,
          output: "\"Hello, José!\"",
        },
      },
      {
        title: "Failing Guards and Silent Errors",
        prose: [
          "One of the most important things to understand about guards is how they handle errors. If a guard expression raises an exception, Elixir does NOT crash. Instead, the error is silently caught and treated as the guard returning false. The clause simply doesn't match, and Elixir tries the next one.",
          "This is powerful but can also be surprising. For example, length/1 raises an ArgumentError if called on something that isn't a list. In a guard, that error is swallowed — the clause just won't match. This means typos or incorrect guard logic might silently fall through to unexpected clauses instead of raising helpful errors.",
          "The takeaway: be deliberate about your guard expressions and clause ordering. If something isn't matching when you expect it to, a silently failing guard might be the culprit.",
        ],
        code: {
          title: "Silent guard failures",
          code: `def classify(x) when length(x) > 3, do: :long_list
def classify(x) when is_list(x), do: :short_list
def classify(_), do: :not_a_list

# length/1 on a non-list raises an error,
# but in a guard it silently fails:
classify("hello")
# => :not_a_list
# (length("hello") would raise ArgumentError,
#  but the guard catches it and returns false)

classify([1, 2, 3, 4, 5])
# => :long_list

classify([1, 2])
# => :short_list`,
          output: ":not_a_list",
        },
      },
      {
        title: "Combining Guards",
        prose: [
          "You can combine multiple conditions within a single guard using and and or. Remember that && and || are NOT allowed in guards — this trips up many developers coming from other languages.",
          "There's a shorthand: using a comma (,) inside a guard is equivalent to and. And having multiple when clauses on the same function head is equivalent to or. These three forms give you flexible ways to express complex guard logic.",
          "The and operator has higher precedence than or, so a or b and c is parsed as a or (b and c). Use parentheses when the logic isn't immediately obvious.",
        ],
        code: {
          title: "Combining guard conditions",
          code: `# Using 'and' — both conditions must be true
def positive_integer?(x) when is_integer(x) and x > 0, do: true
def positive_integer?(_), do: false

# Using comma (shorthand for 'and')
def positive_integer_v2?(x) when is_integer(x), when x > 0, do: true
# ⚠️ Wait — this is actually OR! Multiple 'when' = OR.

# Let's be clear about the difference:
# AND: conditions in the same when clause
def adult_string?(x) when is_binary(x) and byte_size(x) > 0 do
  true
end

# OR: multiple when clauses
def number?(x) when is_integer(x) when is_float(x), do: true
def number?(_), do: false

# Comma inside a single when = AND
def valid_age?(age) when is_integer(age), age >= 0, age <= 150 do
  true
end
def valid_age?(_), do: false

# Complex combinations
def process(x) when (is_integer(x) and x > 0) or x == :special do
  :accepted
end`,
          output: "true",
        },
      },
      {
        title: "Custom Guards with defguard",
        prose: [
          "When you find yourself repeating the same guard logic across multiple functions, you can extract it into a custom guard using defguard/2 (public) or defguardp/2 (private). Custom guards are macros that expand inline at compile time, so they're just as efficient as writing the conditions directly.",
          "A custom guard can only use guard-safe expressions in its body — the same restrictions apply. The benefit is reusability and readability. You define the guard once, and any function (or module, if using defguard) can use it.",
          "Custom guards are imported into other modules using import, just like regular macros. This makes them great for building domain-specific validation logic that stays close to your type definitions.",
        ],
        code: {
          title: "Defining and using custom guards",
          code: `defmodule Guards do
  # Public custom guard — usable by other modules
  defguard is_positive_integer(value)
    when is_integer(value) and value > 0

  defguard is_non_empty_string(value)
    when is_binary(value) and byte_size(value) > 0

  # Guard with multiple parameters
  defguard is_between(value, low, high)
    when is_number(value) and value >= low and value <= high
end

defmodule MyApp do
  import Guards

  def process_age(age) when is_positive_integer(age) and is_between(age, 1, 150) do
    "Valid age: \#{age}"
  end

  def greet(name) when is_non_empty_string(name) do
    "Hello, \#{name}!"
  end

  # Private guard with defguardp
  defguardp is_admin(role) when role == :admin or role == :superadmin

  def authorize(user, role) when is_admin(role) do
    {:ok, user}
  end
end`,
          output: "\"Valid age: 25\"",
        },
      },
      {
        title: "Common Gotchas",
        prose: [
          "The most notorious gotcha is that is_map/1 returns true for structs. Since structs are maps with a __struct__ key, a guard like when is_map(x) will match both plain maps and structs. To guard against only plain maps, add and not is_struct(x) (available since Elixir 1.10).",
          "Another common mistake is using && instead of and in guards. The && and || operators are not guard-safe — they compile fine in regular code but cause a CompileError in guards. Always use and, or, and not inside when clauses.",
          "Watch out for the in operator with variables. While when x in [1, 2, 3] works (it expands at compile time), when x in my_list does NOT work because the right-hand side must be a compile-time literal (a list or range). If you need dynamic membership checks, you'll need a different approach — like moving the check into the function body.",
          "Finally, remember that guards don't raise errors — they fail silently. If you write when length(x) > 3 and x happens to be a string, length/1 raises an error that gets swallowed. The clause just won't match, which can be confusing to debug.",
        ],
        code: {
          title: "Guard gotchas and how to avoid them",
          code: `# Gotcha 1: is_map matches structs!
defmodule User do
  defstruct [:name, :age]
end

def process(%User{} = user), do: {:user, user}
def process(map) when is_map(map) and not is_struct(map) do
  {:plain_map, map}
end

# Gotcha 2: && is NOT allowed in guards
# def bad(x) when is_integer(x) && x > 0    — CompileError!
def good(x) when is_integer(x) and x > 0, do: x

# Gotcha 3: 'in' needs a literal on the right
def check(x) when x in [:a, :b, :c], do: :found    # ✅
# def check(x) when x in my_list, do: :found        # ❌

# Gotcha 4: Ranges work with 'in'
def valid_score?(s) when s in 0..100, do: true
def valid_score?(_), do: false

# Gotcha 5: Guard errors are silent
def head_of(list) when hd(list) == :special do
  :special_list
end
def head_of(list) when is_list(list), do: :normal_list
def head_of(_), do: :not_a_list

# head_of([]) — hd([]) would crash, but the guard
# just fails silently and matches :normal_list... wait,
# actually [] IS a list, so it matches :normal_list.
# But hd([]) in a guard silently fails — tricky!`,
          output: ":found",
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
        title: "Type-Based Dispatcher",
        difficulty: "beginner",
        prompt:
          "Write a function describe/1 that uses guards to return a descriptive string based on the type of its argument:\n- Positive integers: \"positive integer\"\n- Zero: \"zero\"\n- Negative integers: \"negative integer\"\n- Floats: \"float\"\n- Strings (binaries): \"string\"\n- Atoms: \"atom\"\n- Lists: \"list\"\n- Anything else: \"other\"",
        hints: [
          { text: "Use is_integer/1, is_float/1, is_binary/1, is_atom/1, and is_list/1 as your type-check guards." },
          { text: "For positive/negative/zero integers, combine is_integer/1 with comparison operators like > 0 and < 0 using and." },
          { text: "Be careful with clause ordering — booleans and nil are atoms, so more specific clauses should come first if needed. For this problem, letting them fall under \"atom\" is fine." },
        ],
        solution: `defmodule TypeDescriber do
  def describe(x) when is_integer(x) and x > 0, do: "positive integer"
  def describe(0), do: "zero"
  def describe(x) when is_integer(x) and x < 0, do: "negative integer"
  def describe(x) when is_float(x), do: "float"
  def describe(x) when is_binary(x), do: "string"
  def describe(x) when is_atom(x), do: "atom"
  def describe(x) when is_list(x), do: "list"
  def describe(_), do: "other"
end

# Usage:
TypeDescriber.describe(42)       # => "positive integer"
TypeDescriber.describe(0)        # => "zero"
TypeDescriber.describe(-5)       # => "negative integer"
TypeDescriber.describe(3.14)     # => "float"
TypeDescriber.describe("hello")  # => "string"
TypeDescriber.describe(:ok)      # => "atom"
TypeDescriber.describe([1, 2])   # => "list"
TypeDescriber.describe({1, 2})   # => "other"`,
        walkthrough: [
          "We define multiple clauses of describe/1, each with a different guard. Elixir tries them top to bottom.",
          "The first clause matches positive integers by combining is_integer(x) with x > 0 using and.",
          "For zero, we use a simple pattern match on the literal 0 — no guard needed.",
          "Negative integers use is_integer(x) and x < 0.",
          "Floats, strings (binaries), atoms, and lists each have their own type-check guard.",
          "The final catch-all clause with _ handles anything else (tuples, maps, pids, etc.).",
          "Clause ordering matters: if we put the atom clause before the integer clause, true and false (which are atoms) would match as atoms before they could be checked as integers. In this case it doesn't matter since booleans aren't integers, but it's good practice to put more specific clauses first.",
        ],
      },
      {
        title: "Custom Guard Library",
        difficulty: "intermediate",
        prompt:
          "Create a module called MyGuards that defines the following custom guards using defguard:\n1. is_even(n) — checks if n is an integer and even\n2. is_odd(n) — checks if n is an integer and odd\n3. is_non_empty_list(val) — checks if val is a list with at least one element\n4. is_valid_http_status(code) — checks if code is an integer between 100 and 599\n\nThen create a module Processor that imports these guards and uses them in at least two function clauses.",
        hints: [
          { text: "Use rem(n, 2) == 0 to check for even numbers. Remember to also check is_integer(n) first." },
          { text: "For non-empty lists, combine is_list(val) with length(val) > 0. Or you could use hd(val) in the guard — if it fails on an empty list, the guard silently returns false." },
          { text: "The in operator works with ranges in guards, so n in 100..599 is a clean way to check the HTTP status range." },
        ],
        solution: `defmodule MyGuards do
  defguard is_even(n) when is_integer(n) and rem(n, 2) == 0
  defguard is_odd(n) when is_integer(n) and rem(n, 2) != 0
  defguard is_non_empty_list(val) when is_list(val) and length(val) > 0
  defguard is_valid_http_status(code) when is_integer(code) and code in 100..599
end

defmodule Processor do
  import MyGuards

  def categorize(n) when is_even(n) and n > 0, do: "positive even"
  def categorize(n) when is_odd(n) and n > 0, do: "positive odd"
  def categorize(n) when is_even(n), do: "non-positive even"
  def categorize(n) when is_odd(n), do: "non-positive odd"

  def handle_status(code) when is_valid_http_status(code) and code in 200..299 do
    :success
  end
  def handle_status(code) when is_valid_http_status(code) and code in 400..499 do
    :client_error
  end
  def handle_status(code) when is_valid_http_status(code) and code in 500..599 do
    :server_error
  end
  def handle_status(code) when is_valid_http_status(code), do: :other
  def handle_status(_), do: :invalid

  def first_item(list) when is_non_empty_list(list), do: {:ok, hd(list)}
  def first_item([]), do: :empty
  def first_item(_), do: :not_a_list
end`,
        walkthrough: [
          "We define four custom guards using defguard, making them public so other modules can import them.",
          "is_even/1 checks is_integer(n) first (type safety) then uses rem(n, 2) == 0 for the even check.",
          "is_odd/1 is similar but checks rem(n, 2) != 0.",
          "is_non_empty_list/1 combines is_list(val) with length(val) > 0. Both are guard-safe.",
          "is_valid_http_status/1 uses the in operator with a range (100..599), which expands at compile time.",
          "In the Processor module, we import MyGuards to use the custom guards.",
          "categorize/1 combines our custom guards with additional conditions (n > 0) using and.",
          "handle_status/1 uses is_valid_http_status alongside range checks to categorize HTTP status codes.",
          "Custom guards compose naturally with built-in guards, keeping function heads readable and DRY.",
        ],
      },
      {
        title: "Guard-Powered Validation Pipeline",
        difficulty: "advanced",
        prompt:
          "Build a module called Validator that validates user input maps. Implement a validate/1 function that takes a map and returns either {:ok, validated_map} or {:error, reason}. Use guards extensively for the following rules:\n\n1. The input must be a map (not a struct) with at least 2 keys\n2. If the map has a :name key, its value must be a non-empty binary\n3. If the map has an :age key, its value must be a positive integer between 1 and 150\n4. If the map has a :role key, it must be one of :admin, :user, or :guest\n\nDefine custom guards for the age and role validation. Handle both the case where keys are present (and must be valid) and where they're absent (which is acceptable).",
        hints: [
          { text: "Use is_map(input) and not is_struct(input) and map_size(input) >= 2 as the base guard." },
          { text: "You can use is_map_key/2 in guards to check if a key exists, then have separate clauses for when the key is present vs absent." },
          { text: "Consider using multiple function clauses with pattern matching on the map keys combined with guards. For example, def validate(%{age: age}) when ... handles maps that have an :age key." },
          { text: "Think about using a private helper that validates each field independently, then compose the checks. Or use a pipeline approach with with to chain validations." },
        ],
        solution: `defmodule Validator do
  defguardp is_valid_age(age)
    when is_integer(age) and age >= 1 and age <= 150

  defguardp is_valid_role(role)
    when role in [:admin, :user, :guest]

  defguardp is_non_empty_string(val)
    when is_binary(val) and byte_size(val) > 0

  def validate(input)
      when is_map(input) and not is_struct(input) and map_size(input) >= 2 do
    with :ok <- validate_name(input),
         :ok <- validate_age(input),
         :ok <- validate_role(input) do
      {:ok, input}
    end
  end

  def validate(input) when is_struct(input), do: {:error, "expected a plain map, got a struct"}
  def validate(input) when is_map(input), do: {:error, "map must have at least 2 keys"}
  def validate(_), do: {:error, "expected a map"}

  # Name validation
  defp validate_name(%{name: name}) when is_non_empty_string(name), do: :ok
  defp validate_name(%{name: _}), do: {:error, "name must be a non-empty string"}
  defp validate_name(_), do: :ok  # name key absent is fine

  # Age validation
  defp validate_age(%{age: age}) when is_valid_age(age), do: :ok
  defp validate_age(%{age: _}), do: {:error, "age must be an integer between 1 and 150"}
  defp validate_age(_), do: :ok  # age key absent is fine

  # Role validation
  defp validate_role(%{role: role}) when is_valid_role(role), do: :ok
  defp validate_role(%{role: _}), do: {:error, "role must be :admin, :user, or :guest"}
  defp validate_role(_), do: :ok  # role key absent is fine
end

# Usage:
Validator.validate(%{name: "Alice", age: 30, role: :admin})
# => {:ok, %{name: "Alice", age: 30, role: :admin}}

Validator.validate(%{name: "", age: 30})
# => {:error, "name must be a non-empty string"}

Validator.validate(%{name: "Bob", age: 200})
# => {:error, "age must be an integer between 1 and 150"}

Validator.validate(%{one_key: 1})
# => {:error, "map must have at least 2 keys"}`,
        walkthrough: [
          "We define three private custom guards using defguardp for age, role, and string validation.",
          "The main validate/1 function has a guard that ensures the input is a plain map (not a struct) with at least 2 keys. This uses is_map, not is_struct, and map_size — all guard-safe.",
          "We use a with expression to chain the three field validations. If any validation returns an {:error, reason} tuple, with short-circuits and returns that error.",
          "Each field validator has three clauses: one for when the key is present and valid (guard passes), one for when the key is present but invalid (guard fails, pattern still matches), and one catch-all for when the key is absent.",
          "This pattern — pattern matching on map keys combined with guards — is extremely common in Elixir for input validation.",
          "The custom guards keep the function heads readable. is_valid_age(age) is much clearer than repeating the full condition every time.",
          "Notice how the overloaded validate/1 clauses handle edge cases: structs, maps with too few keys, and non-maps each get a specific error message thanks to ordered clauses with different guards.",
        ],
      },
    ],
  },
};

export default guardsInDepth;
