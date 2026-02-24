import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Tail Call Optimization Requires the Call to Be Truly Last",
    description:
      "The BEAM VM only performs tail call optimization (TCO) when the recursive call is the very last operation in the function. If you do anything after the recursive call — even adding to the result — it becomes body recursion and each call adds a stack frame.",
    code: `# NOT tail recursive — multiplication happens AFTER the recursive call
def factorial(0), do: 1
def factorial(n), do: n * factorial(n - 1)
# Stack: factorial(5) -> 5 * factorial(4) -> 5 * 4 * factorial(3) -> ...

# Tail recursive — recursive call is the LAST operation
def factorial(n), do: factorial(n, 1)

defp factorial(0, acc), do: acc
defp factorial(n, acc), do: factorial(n - 1, n * acc)
# Stack: factorial(5, 1) -> factorial(4, 5) -> factorial(3, 20) -> ...`,
  },
  {
    title: "Accumulator Pattern Reverses the Result Order",
    description:
      "When building a list with the accumulator pattern (prepending to the accumulator for O(1) performance), the result comes out in reverse order. You need to call Enum.reverse/1 on the final accumulator, which is easy to forget.",
    code: `defmodule Example do
  # Without reverse — result is backwards!
  def double_wrong(list), do: do_double(list, [])

  defp do_double([], acc), do: acc  # BUG: reversed!
  defp do_double([h | t], acc), do: do_double(t, [h * 2 | acc])
end

Example.double_wrong([1, 2, 3])
#=> [6, 4, 2]  # Oops — reversed

defmodule Example do
  def double(list), do: do_double(list, [])

  defp do_double([], acc), do: Enum.reverse(acc)  # Fix!
  defp do_double([h | t], acc), do: do_double(t, [h * 2 | acc])
end

Example.double([1, 2, 3])
#=> [2, 4, 6]`,
  },
  {
    title: "Body Recursion Can Blow the Stack",
    description:
      "Body recursion (where the recursive call is not the last operation) consumes a stack frame per call. For large inputs, this leads to a stack overflow. Unlike languages with no TCO, Elixir developers should always consider converting to tail recursion for potentially large inputs.",
    code: `# Body recursive — will crash on large lists
def sum([]), do: 0
def sum([h | t]), do: h + sum(t)

sum(Enum.to_list(1..1_000_000))
#=> ** (SystemLimitError) a system limit has been reached

# Tail recursive — runs in constant stack space
def sum(list), do: sum(list, 0)

defp sum([], acc), do: acc
defp sum([h | t], acc), do: sum(t, h + acc)

sum(Enum.to_list(1..1_000_000))
#=> 500000500000`,
  },
  {
    title: "Prefer Enum Functions Over Manual Recursion",
    description:
      "While understanding recursion is essential, most day-to-day Elixir code should use Enum and Stream functions instead. They are well-tested, optimized, and more readable. Manual recursion is best reserved for cases with complex control flow that Enum can't express.",
    code: `# Manual recursion — works but verbose
defmodule Example do
  def sum(list), do: sum(list, 0)
  defp sum([], acc), do: acc
  defp sum([h | t], acc), do: sum(t, h + acc)
end

# Idiomatic — use Enum.sum/1
Enum.sum([1, 2, 3, 4, 5])
#=> 15

# Or Enum.reduce/3 for custom accumulation
Enum.reduce([1, 2, 3, 4, 5], 0, fn x, acc -> x + acc end)
#=> 15

# Enum.map, Enum.filter, etc. replace most recursive patterns
[1, 2, 3] |> Enum.map(&(&1 * 2)) |> Enum.filter(&(&1 > 3))
#=> [4, 6]`,
  },
];

export default gotchas;
