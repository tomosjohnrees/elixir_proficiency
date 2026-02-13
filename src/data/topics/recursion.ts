import type { TopicContent } from "@/lib/types";
import questions from "./questions/recursion";
import Animation01Recursion from "@/components/animations/Animation01Recursion";

const recursion: TopicContent = {
  meta: {
    slug: "recursion",
    title: "Recursion",
    description: "Recursive thinking, base cases, and tail-call optimization",
    number: 7,
    active: true,
  },

  eli5: {
    analogyTitle: "The Russian Nesting Dolls",
    analogy:
      "Imagine you have a set of Russian nesting dolls (matryoshka). To find the smallest doll, you open the outer doll, find another doll inside, open that one, find another, and keep going. You stop when you open a doll and there's nothing inside — that's your answer. Each time you open a doll, you're doing the same action on a slightly smaller problem. That's recursion: solving a problem by solving a smaller version of itself, until you reach a case so simple it needs no further work.",
    items: [
      { label: "Base case", description: "The smallest doll with nothing inside. It's the condition where you stop and return an answer directly, without opening any more dolls." },
      { label: "Recursive step", description: "Opening a doll and finding another one inside. You do a little work, then repeat the same process on what's left." },
      { label: "Stack frames", description: "Like laying each opened doll shell on the table. You remember where you were so you can reassemble when done. Too many dolls can overflow the table." },
      { label: "Tail-call optimization", description: "Instead of keeping all the shells on the table, you pass the running result forward and reuse the same table space. This lets you handle infinitely many dolls." },
    ],
    keyTakeaways: [
      "Elixir has no for/while loops. Recursion is the fundamental way to repeat work.",
      "Every recursive function needs at least one base case (to stop) and one recursive case (to continue).",
      "Tail recursion happens when the recursive call is the very last thing a function does — the BEAM optimizes this into a loop.",
      "An accumulator turns body recursion into tail recursion by carrying the result forward instead of building it up on return.",
      "In practice you'll use Enum and Stream more than raw recursion, but understanding recursion helps you understand how they work.",
    ],
  },

  visuals: {
    animation: Animation01Recursion,
    animationDuration: 24,
    dataTypes: [
      { name: "Base Case", color: "#059669", examples: ["def sum([]), do: 0", "def factorial(0), do: 1", "def length([]), do: 0"], description: "The stopping condition. Pattern matches the simplest input and returns a value directly without recursing." },
      { name: "Body Recursion", color: "#6b46c1", examples: ["def sum([h | t]) do", "  h + sum(t)", "end"], description: "The recursive call is NOT the last operation — work remains after it returns. Builds up the call stack." },
      { name: "Tail Recursion", color: "#2563eb", examples: ["def sum([h | t], acc) do", "  sum(t, acc + h)", "end"], description: "The recursive call IS the last operation. Uses an accumulator. The BEAM optimizes this into a loop." },
      { name: "Accumulator Pattern", color: "#d97706", examples: ["def sum(list) do", "  sum(list, 0) # acc = 0", "end"], description: "A public function with a friendly API delegates to a private function that carries an accumulator." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Why Recursion? No Loops in Elixir",
        prose: [
          "If you're coming from a language with for or while loops, this might feel strange: Elixir doesn't have them. Because all data is immutable, there's no loop counter to increment. Instead, you express repetition through recursion — a function that calls itself with updated arguments.",
          "This isn't a limitation — it's a design choice. Recursive code with pattern matching is often cleaner and more declarative than loop-based code. And with tail-call optimization on the BEAM VM, recursive code can be just as efficient as loops.",
          "Every recursive function needs two ingredients: a base case that stops the recursion, and a recursive case that makes progress toward the base case.",
        ],
        code: {
          title: "A simple countdown",
          code: `defmodule Counter do
  # Base case — stop at zero
  def countdown(0), do: IO.puts("Go!")

  # Recursive case — print and continue
  def countdown(n) when n > 0 do
    IO.puts(n)
    countdown(n - 1)
  end
end

Counter.countdown(3)
# Prints:
# 3
# 2
# 1
# Go!`,
          output: "Go!",
        },
      },
      {
        title: "Recursion Over Lists",
        prose: [
          "Lists are the most natural structure for recursion in Elixir. The [head | tail] pattern splits a list into its first element and everything else — a perfect fit for the recursive pattern of \"process one element, then recurse on the rest.\"",
          "The base case for list recursion is almost always the empty list []. The recursive case takes the head, does something with it, and recurses on the tail. This pattern appears everywhere in Elixir — it's how Enum.map, Enum.filter, and Enum.reduce work under the hood.",
        ],
        code: {
          title: "Processing lists recursively",
          code: `defmodule MyList do
  # Sum all elements
  def sum([]), do: 0
  def sum([head | tail]), do: head + sum(tail)

  # Get the length
  def length([]), do: 0
  def length([_ | tail]), do: 1 + MyList.length(tail)

  # Map a function over each element
  def map([], _func), do: []
  def map([head | tail], func) do
    [func.(head) | map(tail, func)]
  end
end

MyList.sum([1, 2, 3, 4])          # => 10
MyList.length([10, 20, 30])       # => 3
MyList.map([1, 2, 3], &(&1 * 2)) # => [2, 4, 6]`,
          output: "[2, 4, 6]",
        },
      },
      {
        title: "Body Recursion vs Tail Recursion",
        prose: [
          "In the list examples above, the recursive call isn't the last thing that happens. In sum([head | tail]), the function calls sum(tail) and then adds head to the result. This is body recursion — the VM must keep each call frame on the stack while waiting for the recursive call to return.",
          "Tail recursion happens when the recursive call is literally the last operation. There's no work left to do after it returns, so the VM can reuse the current stack frame instead of adding a new one. This means tail-recursive functions use constant stack space, no matter how deep the recursion goes.",
          "To convert body recursion to tail recursion, you introduce an accumulator — an extra parameter that carries the result-so-far forward through each call.",
        ],
        code: {
          title: "Body vs tail recursion",
          code: `defmodule Sum do
  # Body recursion — builds up the stack
  # sum([1,2,3])
  # = 1 + sum([2,3])
  # = 1 + (2 + sum([3]))
  # = 1 + (2 + (3 + sum([])))
  # = 1 + (2 + (3 + 0))
  # = 6
  def body([]), do: 0
  def body([h | t]), do: h + body(t)

  # Tail recursion — constant stack space
  # tail_sum([1,2,3], 0)
  # tail_sum([2,3], 1)
  # tail_sum([3], 3)
  # tail_sum([], 6)
  # 6
  def tail(list), do: tail(list, 0)
  defp tail([], acc), do: acc
  defp tail([h | t], acc), do: tail(t, acc + h)
end

Sum.body([1, 2, 3])  # => 6
Sum.tail([1, 2, 3])  # => 6`,
          output: "6",
        },
      },
      {
        title: "The Accumulator Pattern",
        prose: [
          "The accumulator pattern is the standard way to make recursion tail-recursive. The idea is simple: instead of combining results on the way back up, you carry a running result forward through each call.",
          "The typical structure is a public function with a friendly interface that delegates to a private function with an extra accumulator argument. The accumulator starts at an identity value (0 for sums, [] for lists, \"\" for strings) and collects the result as you go.",
          "One subtlety: when building a list with an accumulator, the result comes out reversed because you prepend each element. You'll often need to call Enum.reverse/1 at the end. This is still more efficient than body recursion for large lists because it avoids stack overflow.",
        ],
        code: {
          title: "Accumulator pattern in action",
          code: `defmodule Acc do
  # Public API — hides the accumulator
  def reverse(list), do: reverse(list, [])

  # Private implementation with accumulator
  defp reverse([], acc), do: acc
  defp reverse([h | t], acc), do: reverse(t, [h | acc])

  # Factorial with accumulator
  def factorial(n), do: factorial(n, 1)

  defp factorial(0, acc), do: acc
  defp factorial(n, acc) when n > 0 do
    factorial(n - 1, n * acc)
  end
end

Acc.reverse([1, 2, 3, 4])  # => [4, 3, 2, 1]
Acc.factorial(5)            # => 120`,
          output: "120",
        },
      },
      {
        title: "When to Use Raw Recursion",
        prose: [
          "In day-to-day Elixir code, you'll rarely write raw recursion. The Enum and Stream modules provide functions like map, reduce, filter, and flat_map that handle the recursive patterns for you. Use them by default — they're well-tested, optimized, and convey intent more clearly.",
          "Raw recursion is the right choice when: you need early termination with complex conditions, you're processing a recursive data structure (like a tree), or the Enum module doesn't have a function that fits your pattern.",
          "Understanding recursion deeply is still essential. Enum.reduce is recursion with an accumulator. Enum.map is recursion that transforms each element. When Enum falls short, you'll know exactly how to drop down to raw recursion and write it correctly.",
        ],
        code: {
          title: "Recursion vs Enum",
          code: `# These are equivalent:

# Raw recursion
defmodule Raw do
  def sum([]), do: 0
  def sum([h | t]), do: h + sum(t)
end

# Using Enum.reduce (preferred in practice)
Enum.reduce([1, 2, 3], 0, fn x, acc -> x + acc end)
# => 6

# Using Enum.sum (even better!)
Enum.sum([1, 2, 3])
# => 6

# But recursion shines for tree-like structures
defmodule Tree do
  def depth(nil), do: 0
  def depth({_value, left, right}) do
    1 + max(depth(left), depth(right))
  end
end

tree = {1, {2, nil, nil}, {3, {4, nil, nil}, nil}}
Tree.depth(tree)  # => 3`,
          output: "3",
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
        title: "Recursive Range",
        difficulty: "beginner",
        prompt:
          "Write a function range/2 that takes two integers (start and stop) and returns a list of integers from start to stop (inclusive). Don't use Enum.to_list or the .. range operator. Use recursion.\n\nExample: range(1, 5) should return [1, 2, 3, 4, 5].",
        hints: [
          { text: "The base case is when start > stop — return an empty list." },
          { text: "The recursive case prepends start to the result of range(start + 1, stop)." },
          { text: "This naturally produces the list in the right order because you build it head-first." },
        ],
        solution: `defmodule MyRange do
  def range(start, stop) when start > stop, do: []

  def range(start, stop) do
    [start | range(start + 1, stop)]
  end
end

MyRange.range(1, 5)   # => [1, 2, 3, 4, 5]
MyRange.range(3, 3)   # => [3]
MyRange.range(5, 1)   # => []`,
        walkthrough: [
          "The base case checks when start > stop. At that point there are no more numbers to add, so we return [].",
          "The recursive case prepends start to the range starting from start + 1. Each call handles one number and delegates the rest.",
          "This is body recursion (the list cons [start | ...] happens after the recursive call). For a list-building function, this is fine — the result comes out in the right order naturally.",
          "To make this tail-recursive, you'd need an accumulator and Enum.reverse at the end. For small ranges, the body-recursive version is clearer.",
        ],
      },
      {
        title: "Tail-Recursive Map",
        difficulty: "intermediate",
        prompt:
          "Implement your own my_map/2 that applies a function to every element of a list. Make it tail-recursive using an accumulator. Remember that accumulator-based list building reverses the order — you'll need to fix that.\n\nExample: my_map([1, 2, 3], fn x -> x * 2 end) should return [2, 4, 6].",
        hints: [
          { text: "Create a public my_map/2 that calls a private my_map/3 with an initial accumulator of []." },
          { text: "In the private function, prepend func.(head) to the accumulator and recurse on the tail." },
          { text: "When you reach the empty list, the accumulator is reversed. Use Enum.reverse/1 (or write your own reverse)." },
        ],
        solution: `defmodule MyEnum do
  def my_map(list, func), do: do_map(list, func, [])

  defp do_map([], _func, acc), do: Enum.reverse(acc)

  defp do_map([head | tail], func, acc) do
    do_map(tail, func, [func.(head) | acc])
  end
end

MyEnum.my_map([1, 2, 3], fn x -> x * 2 end)
# => [2, 4, 6]

MyEnum.my_map(["hello", "world"], &String.upcase/1)
# => ["HELLO", "WORLD"]

MyEnum.my_map([], fn x -> x end)
# => []`,
        walkthrough: [
          "The public function my_map/2 provides a clean API. It delegates to do_map/3 with an empty accumulator.",
          "do_map applies func to each head and prepends the result to the accumulator. Prepending is O(1) — much faster than appending.",
          "Because we prepend, the accumulator ends up in reverse order. We fix this with Enum.reverse/1 in the base case. This reverse at the end is O(n) — the same cost as the traversal itself.",
          "This is exactly how Elixir's own Enum.map works internally — tail recursion with an accumulator, then reverse.",
          "The function is tail-recursive because do_map(tail, func, [...]) is the last operation. The BEAM reuses the stack frame for each call.",
        ],
      },
      {
        title: "Flatten Nested Lists",
        difficulty: "advanced",
        prompt:
          "Write a flatten/1 function that takes an arbitrarily nested list and returns a flat list of all the values. Do NOT use List.flatten.\n\nExamples:\n- flatten([1, [2, 3], [4, [5, 6]]]) should return [1, 2, 3, 4, 5, 6]\n- flatten([[1, [2]], 3]) should return [1, 2, 3]\n- flatten([]) should return []",
        hints: [
          { text: "You need to handle three cases: empty list (base case), head is a list (recurse into it), head is not a list (keep it)." },
          { text: "When the head is a list, you need to flatten it AND flatten the tail, then combine them." },
          { text: "For a tail-recursive version, use an accumulator. Process elements right-to-left or reverse at the end." },
          { text: "is_list/1 tells you whether a value is a list." },
        ],
        solution: `defmodule Flat do
  # Body-recursive version (clearer)
  def flatten([]), do: []
  def flatten([head | tail]) when is_list(head) do
    flatten(head) ++ flatten(tail)
  end
  def flatten([head | tail]) do
    [head | flatten(tail)]
  end

  # Tail-recursive version (more efficient)
  def flatten_tail(list), do: do_flatten(list, []) |> Enum.reverse()

  defp do_flatten([], acc), do: acc
  defp do_flatten([head | tail], acc) when is_list(head) do
    # Flatten the head first, then continue with tail
    acc = do_flatten(head, acc)
    do_flatten(tail, acc)
  end
  defp do_flatten([head | tail], acc) do
    do_flatten(tail, [head | acc])
  end
end

Flat.flatten([1, [2, 3], [4, [5, 6]]])
# => [1, 2, 3, 4, 5, 6]

Flat.flatten_tail([[1, [2]], 3])
# => [1, 2, 3]`,
        walkthrough: [
          "The body-recursive version is elegant: if the head is a list, flatten it recursively and concatenate with the flattened tail. If not, keep it and flatten the rest. The ++ operator concatenates lists.",
          "However, ++ is O(n) in the length of the left list, so deeply nested lists can be slow. The tail-recursive version avoids this.",
          "The tail-recursive version uses an accumulator. When the head is a list, it flattens the head into the accumulator first, then continues with the tail. Non-list values get prepended to the accumulator.",
          "Since we prepend, the accumulator ends up reversed. We reverse once at the end. This is O(n) total — much better than repeated ++ calls.",
          "This problem is a great example of when raw recursion is needed — the nested, tree-like structure of the input doesn't fit neatly into Enum.reduce.",
        ],
      },
    ],
  },
};

export default recursion;
