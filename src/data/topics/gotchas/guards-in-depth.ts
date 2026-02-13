import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Only a Limited Set of Functions Are Allowed in Guards",
    description:
      "Guard clauses only permit a restricted subset of Elixir expressions. You cannot call arbitrary functions in guards — only type checks (is_integer/1, is_binary/1, etc.), comparison operators, arithmetic, boolean operators, and a few Kernel functions (like abs/1, map_size/1, tuple_size/1, hd/1, elem/2). Attempting to use a custom function or most standard library functions in a guard will cause a CompileError.",
    code: `# Allowed in guards:
def check(x) when is_integer(x) and x > 0, do: :positive
def check(x) when is_binary(x), do: :string
def check(x) when x in [1, 2, 3], do: :in_list
def check(x) when abs(x) < 10, do: :small

# NOT allowed in guards — CompileError:
# def check(x) when String.length(x) > 5, do: :long
# def check(x) when Enum.member?([1,2,3], x), do: :found
# def check(x) when my_custom_function(x), do: :custom

# Full list of allowed guard functions:
# Type checks: is_atom, is_binary, is_boolean, is_float,
#   is_function, is_integer, is_list, is_map, is_nil,
#   is_number, is_pid, is_port, is_reference, is_tuple
# Operators: ==, !=, ===, !==, <, >, <=, >=
# Boolean: and, or, not, in
# Math: +, -, *, /, abs, div, rem
# Others: hd, tl, elem, tuple_size, map_size, length,
#   binary_part, bit_size, byte_size, is_map_key`,
  },
  {
    title: "Guards That Raise Simply Return false — They Don't Crash",
    description:
      "If an expression inside a guard raises an error, the guard silently returns false instead of crashing the process. The clause simply doesn't match, and Elixir moves on to the next clause. This is by design but can hide bugs — if you expect a guard to match and it doesn't because of a hidden error, the fallback clause runs with no indication of what went wrong.",
    code: `# This guard raises internally but doesn't crash
def check(x) when hd(x) > 0, do: "has positive head"
def check(_), do: "fallback"

check([5, 3])
#=> "has positive head"

check(:not_a_list)
#=> "fallback"
# hd(:not_a_list) would raise ArgumentError,
# but in a guard it silently returns false

# This can hide bugs:
def process(x) when length(x) > 0, do: "non-empty list"
def process(_), do: "empty or not a list"

process("hello")
#=> "empty or not a list"
# You might expect this to be caught as an error,
# but length("hello") raises and the guard returns false`,
  },
  {
    title: "Custom Guards Must Use the defguard Macro",
    description:
      "You cannot call regular functions in guard clauses, but you can define custom guards using the defguard (or defguardp for private) macro. These macros expand into valid guard expressions at compile time. The body of a defguard must only use expressions that are themselves valid in guards — you can't sneak in arbitrary code.",
    code: `defmodule MyGuards do
  # Define a custom guard with defguard
  defguard is_positive_integer(x) when is_integer(x) and x > 0

  # Private guard (only usable in this module)
  defguardp is_even(x) when is_integer(x) and rem(x, 2) == 0

  # Use it in function clauses
  def double(x) when is_positive_integer(x), do: x * 2

  def categorize(x) when is_even(x), do: :even
  def categorize(x) when is_integer(x), do: :odd
end

# Can import and use in other modules
defmodule Other do
  import MyGuards

  def validate(n) when is_positive_integer(n), do: :ok
  def validate(_), do: :error
end

# Wrong: defguard body can't use arbitrary functions
# defguard is_short_string(x) when String.length(x) < 5
# ** (CompileError) — String.length not allowed in guards`,
  },
  {
    title: "Guard Clauses Are Evaluated Left to Right with Short-Circuit",
    description:
      "When guards use and/or, they evaluate left to right with short-circuit behavior. If the left side of and is false, the right side is never evaluated. If the left side of or is true, the right side is skipped. This is important because you can use it to safely guard against invalid types before checking values.",
    code: `# Safe: is_list check short-circuits before length
def process(x) when is_list(x) and length(x) > 0 do
  "non-empty list"
end

# If x is not a list, is_list(x) returns false
# and length(x) is never evaluated (would raise otherwise)

# Multiple guards with "when ... when" act like "or"
def allowed?(x) when x == :admin when x == :moderator do
  true
end
# Equivalent to:
def allowed?(x) when x == :admin or x == :moderator do
  true
end

# Order matters for overlapping guards
def classify(x) when is_integer(x) and x > 0, do: :positive
def classify(x) when is_integer(x) and x < 0, do: :negative
def classify(0), do: :zero
def classify(_), do: :not_integer`,
  },
];

export default gotchas;
