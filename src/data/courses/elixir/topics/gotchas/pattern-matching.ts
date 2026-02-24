import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Maps Pattern Match Partially",
    description:
      "When pattern matching on maps, the pattern only needs to be a subset of the matched value. This means %{a: 1} will successfully match %{a: 1, b: 2, c: 3}. This is useful but can hide bugs if you expect an exact match. Unlike tuples or lists, maps never fail a match because of extra keys.",
    code: `# This succeeds — the pattern is a subset of the map
%{a: 1} = %{a: 1, b: 2, c: 3}
#=> %{a: 1, b: 2, c: 3}

# Even an empty map matches any map
%{} = %{a: 1, b: 2}
#=> %{a: 1, b: 2}

# But missing or wrong values still fail
%{a: 2} = %{a: 1, b: 2}
#=> ** (MatchError)`,
  },
  {
    title: "Forgetting the Pin Operator Rebinds Variables",
    description:
      "In Elixir, variables on the left side of a match are rebound by default. If you intend to match against an existing value, you must use the pin operator (^). Forgetting it is one of the most common pattern matching bugs.",
    code: `x = 1

# Without pin: x is rebound to 2
{x, y} = {2, 3}
x
#=> 2

# With pin: matches against the current value of x
x = 1
{^x, y} = {1, 3}
#=> {1, 3}

{^x, y} = {2, 3}
#=> ** (MatchError) no match of right hand side value: {2, 3}`,
  },
  {
    title: "Matching Map Keys Requires Pin or Literal",
    description:
      "When pattern matching on a map and using a variable as a key, you must pin it. Without the pin operator, Elixir will raise a CompileError because it cannot bind a variable in a map key position.",
    code: `key = :name

# This won't work — you can't bind a variable as a key
# %{key => value} = %{name: "Elixir"}
# ** (CompileError)

# Pin the variable to use its value as the key
%{^key => value} = %{name: "Elixir"}
value
#=> "Elixir"

# Literals always work
%{"name" => value} = %{"name" => "Elixir"}
value
#=> "Elixir"`,
  },
  {
    title: "Order Matters in Function Clauses",
    description:
      "Function clauses are tried top to bottom, and the first match wins. If you place a more general clause before a specific one, the specific clause will never be reached. The compiler warns about this, but only for obvious cases.",
    code: `defmodule Greeter do
  # This general clause matches everything
  def greet(name), do: "Hello, \#{name}!"

  # This clause is NEVER reached
  def greet("World"), do: "Hello, World! (special)"
end

# Correct order: specific clauses first
defmodule Greeter do
  def greet("World"), do: "Hello, World! (special)"
  def greet(name), do: "Hello, \#{name}!"
end`,
  },
];

export default gotchas;
