import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Pipe Operator Requires First Argument Placement",
    description:
      "The pipe operator (|>) always passes the result of the previous expression as the first argument to the next function. If a function expects your data in a different position, you can't use the pipe directly. You'll need to wrap it in an anonymous function or reorder arguments. This is why Elixir's standard library consistently places the 'subject' as the first parameter.",
    code: `# Works: Enum functions take the collection first
[1, 2, 3]
|> Enum.map(&(&1 * 2))
|> Enum.filter(&(&1 > 3))

# Doesn't work as expected with String.replace/3
# if you want to pipe the pattern instead of the subject
"hello world"
|> String.replace("world", "elixir")  # Works — string is first arg

# Problem: when data isn't the first argument
# Integer.to_string(255, 16) — base is second arg, OK
255 |> Integer.to_string(16)  # Works fine

# But wrapping may be needed for some external libs:
data
|> then(fn d -> SomeLib.process(opts, d) end)`,
  },
  {
    title: "with Clauses vs Nested case — Readability Tradeoff",
    description:
      "The with expression is great for chaining operations that can fail, avoiding deeply nested case statements. However, overusing with or putting too many clauses in a single with can become harder to read than the nested version. If only one or two operations can fail, a simple case is often clearer. Reserve with for three or more chained operations.",
    code: `# Nested case — gets deeply indented quickly
case authenticate(params) do
  {:ok, user} ->
    case authorize(user, resource) do
      {:ok, resource} ->
        case process(resource) do
          {:ok, result} -> {:ok, result}
          {:error, reason} -> {:error, reason}
        end
      {:error, reason} -> {:error, reason}
    end
  {:error, reason} -> {:error, reason}
end

# with — much cleaner for this pattern
with {:ok, user} <- authenticate(params),
     {:ok, resource} <- authorize(user, resource),
     {:ok, result} <- process(resource) do
  {:ok, result}
end

# But for a single operation, case is simpler:
# Don't use with for just one clause
case fetch_user(id) do
  {:ok, user} -> {:ok, user.name}
  {:error, _} = error -> error
end`,
  },
  {
    title: "Overusing Pattern Matching in Function Heads",
    description:
      "Pattern matching in function heads is idiomatic and powerful, but having too many clauses for one function can make code hard to follow. If you have more than 4-5 clauses, consider using a single function head with a case or cond inside, or break the logic into smaller helper functions. The goal is readability, not maximum cleverness.",
    code: `# Too many clauses — hard to scan and maintain
def process(%{type: "a", status: "active"} = msg), do: handle_active_a(msg)
def process(%{type: "a", status: "pending"} = msg), do: handle_pending_a(msg)
def process(%{type: "b", status: "active"} = msg), do: handle_active_b(msg)
def process(%{type: "b", status: "pending"} = msg), do: handle_pending_b(msg)
def process(%{type: "c", status: "active"} = msg), do: handle_active_c(msg)
def process(%{type: "c", status: "pending"} = msg), do: handle_pending_c(msg)
def process(msg), do: handle_unknown(msg)

# More readable: dispatch on one dimension, then branch
def process(%{type: type} = msg) do
  case type do
    "a" -> process_a(msg)
    "b" -> process_b(msg)
    "c" -> process_c(msg)
    _   -> handle_unknown(msg)
  end
end`,
  },
  {
    title: "defstruct Fields Default to nil, Not an Error",
    description:
      "When you define a struct with defstruct, all fields default to nil unless you provide explicit defaults. Creating a struct without supplying required fields won't raise an error — you'll just get nil values. This can cause confusing errors later when the nil propagates. Use @enforce_keys to make certain fields required at creation time.",
    code: `defmodule User do
  defstruct [:name, :email, :age]
end

# No error — all fields are nil
%User{}
#=> %User{name: nil, email: nil, age: nil}

# The nil bites you later
user = %User{name: "Alice"}
String.upcase(user.email)
#=> ** (FunctionClauseError) — nil is not a string

# Fix: use @enforce_keys for required fields
defmodule User do
  @enforce_keys [:name, :email]
  defstruct [:name, :email, age: 0]
end

%User{}
#=> ** (ArgumentError) the following keys must also be given
#=>    when building struct User: [:name, :email]

%User{name: "Alice", email: "alice@example.com"}
#=> %User{name: "Alice", email: "alice@example.com", age: 0}`,
  },
];

export default gotchas;
