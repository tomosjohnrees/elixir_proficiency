import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "nil and false Are the Only Falsy Values",
    description:
      "In Elixir, only nil and false are considered falsy. Everything else is truthy, including 0, empty strings, empty lists, and empty maps. This is different from many other languages and can cause subtle logic bugs.",
    code: `# All of these are truthy in Elixir
if 0, do: "truthy", else: "falsy"
#=> "truthy"

if "", do: "truthy", else: "falsy"
#=> "truthy"

if [], do: "truthy", else: "falsy"
#=> "truthy"

# Only nil and false are falsy
if nil, do: "truthy", else: "falsy"
#=> "falsy"

if false, do: "truthy", else: "falsy"
#=> "falsy"`,
  },
  {
    title: "if/unless Are Macros, Not Special Forms",
    description:
      "if and unless in Elixir are macros defined in the Kernel module, not language-level special forms like in most languages. This means they always return a value, and the else clause defaults to nil if omitted. Forgetting the else branch can introduce unexpected nils.",
    code: `# Missing else returns nil
result = if false, do: "yes"
result
#=> nil

# This can cause problems downstream
String.upcase(if some_condition, do: "hello")
# If some_condition is false, this calls String.upcase(nil)
#=> ** (FunctionClauseError)

# Always provide else when capturing the return value
result = if some_condition, do: "hello", else: "default"`,
  },
  {
    title: "with Clause Fall-Through Behavior",
    description:
      "The with expression returns the first non-matching clause result. If you don't add an else block, the non-matching value is returned directly, which can be confusing. Any clause that doesn't match short-circuits and returns the unmatched value as-is.",
    code: `# Without else — non-matching value falls through
result = with {:ok, a} <- {:error, "oops"},
              {:ok, b} <- {:ok, 2} do
  a + b
end
result
#=> {:error, "oops"}  # The unmatched value is returned

# With else — you can handle non-matches explicitly
result = with {:ok, a} <- fetch_a(),
              {:ok, b} <- fetch_b(a) do
  {:ok, a + b}
else
  {:error, reason} -> {:error, reason}
  :not_found -> {:error, "not found"}
end`,
  },
  {
    title: "case/cond Always Return a Value",
    description:
      "case and cond are expressions that always return a value. If no clause matches in cond and there's no true catch-all, it raises a CondClauseError. Similarly, an unmatched case raises a CaseClauseError. Always include a catch-all clause if there's any chance of no match.",
    code: `# cond raises if nothing matches
cond do
  1 == 2 -> "nope"
  3 == 4 -> "nope"
end
#=> ** (CondClauseError) no cond clause evaluated to a truthy value

# Always add a true catch-all
cond do
  1 == 2 -> "nope"
  true -> "default"
end
#=> "default"

# case raises on no match too
case :c do
  :a -> "a"
  :b -> "b"
end
#=> ** (CaseClauseError) no case clause matching: :c`,
  },
];

export default gotchas;
