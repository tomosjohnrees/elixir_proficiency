import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "Why doesn't Elixir have for/while loops?",
    options: [
      { label: "It's a bug in the language" },
      { label: "Because all data is immutable — there's no loop counter to mutate", correct: true },
      { label: "Loops are slower than recursion" },
      { label: "The BEAM VM doesn't support them" },
    ],
    explanation:
      "Elixir's data is immutable, so you can't have a mutable loop counter like i++. Instead, repetition is expressed through recursion, where each call receives updated arguments. The BEAM VM is optimized for this pattern.",
  },
  {
    question: "What is the base case in a recursive function?",
    options: [
      { label: "The first clause that matches" },
      { label: "The clause that makes the recursive call" },
      { label: "The clause that returns a result without recursing", correct: true },
      { label: "The clause with the most arguments" },
    ],
    explanation:
      "The base case is the condition where recursion stops. It returns a value directly without calling itself again. Without a base case, recursion would continue forever (until the stack overflows).",
  },
  {
    question: "What makes a recursive function \"tail-recursive\"?",
    options: [
      { label: "It processes the tail of a list" },
      { label: "The recursive call is the very last operation in the function", correct: true },
      { label: "It uses an accumulator parameter" },
      { label: "It runs faster than body recursion" },
    ],
    explanation:
      "Tail recursion means the recursive call is the absolute last thing the function does — no work remains after the call returns. An accumulator is a common technique to achieve this, but what matters is the position of the recursive call, not the presence of an accumulator.",
  },
  {
    question: "What does the BEAM do with tail-recursive calls?",
    options: [
      { label: "Caches the results for faster lookup" },
      { label: "Converts them to parallel processes" },
      { label: "Reuses the current stack frame instead of adding a new one", correct: true },
      { label: "Nothing special — they run like any other call" },
    ],
    explanation:
      "The BEAM performs tail-call optimization: when a function's last action is calling itself (or another function), the VM reuses the current stack frame. This means tail-recursive functions use constant stack space, effectively turning recursion into a loop.",
  },
  {
    question: "What's the result of this code?\n\n```elixir\ndefmodule M do\n  def rev(list), do: rev(list, [])\n  defp rev([], acc), do: acc\n  defp rev([h|t], acc), do: rev(t, [h|acc])\nend\nM.rev([1, 2, 3])\n```",
    options: [
      { label: "[1, 2, 3]" },
      { label: "[3, 2, 1]", correct: true },
      { label: "[[3], [2], [1]]" },
      { label: "An error — you can't prepend to an accumulator" },
    ],
    explanation:
      "Each step prepends the head to the accumulator: rev([1,2,3], []) → rev([2,3], [1]) → rev([3], [2,1]) → rev([], [3,2,1]) → [3,2,1]. Prepending to the accumulator reverses the order, which is the standard way to implement list reversal with tail recursion.",
  },
  {
    question: "Which of these functions is tail-recursive?",
    options: [
      { label: "def len([]), do: 0\ndef len([_ | t]), do: 1 + len(t)" },
      { label: "def len(list), do: len(list, 0)\ndefp len([], acc), do: acc\ndefp len([_ | t], acc), do: len(t, acc + 1)", correct: true },
      { label: "def len([h | t]), do: len(t) + 1" },
      { label: "def len(list), do: length(list) + len(list)" },
    ],
    explanation:
      "Only the second option is tail-recursive because the recursive call len(t, acc + 1) is the very last operation — no computation happens after it returns. In the other options, arithmetic operations (1 + ..., ... + 1) occur after the recursive call, making them body-recursive.",
  },
  {
    question: "What happens if a body-recursive function processes a list of 10 million elements on the BEAM?",
    options: [
      { label: "It runs fine — the BEAM has unlimited stack space" },
      { label: "It will likely cause a stack overflow because each call adds a frame to the stack", correct: true },
      { label: "The BEAM automatically converts it to tail recursion" },
      { label: "It runs but produces an incorrect result" },
    ],
    explanation:
      "Body-recursive functions accumulate stack frames for every recursive call. With 10 million elements, this can exhaust the process's stack space and crash. The BEAM only optimizes tail calls — it does not automatically rewrite body recursion, so the programmer must restructure the code to be tail-recursive for large inputs.",
  },
  {
    question: "What is the purpose of an accumulator in recursive functions?",
    options: [
      { label: "To count how many times the function has been called" },
      { label: "To store intermediate results so the recursive call can be in tail position", correct: true },
      { label: "To memoize previous return values for performance" },
      { label: "To hold a reference to the original input" },
    ],
    explanation:
      "An accumulator carries the computed result forward through each recursive call, eliminating the need to do work after the recursive call returns. This moves the recursive call into tail position, enabling the BEAM's tail-call optimization to reuse the stack frame and run in constant stack space.",
  },
  {
    question: "What does this function return?\n\n```elixir\ndefmodule M do\n  def f([], acc), do: acc\n  def f([h | t], acc), do: f(t, acc + h)\nend\nM.f([10, 20, 30], 0)\n```",
    options: [
      { label: "0" },
      { label: "[10, 20, 30]" },
      { label: "60", correct: true },
      { label: "An error because f/2 has no base case for a non-empty list" },
    ],
    explanation:
      "This is a tail-recursive sum with an accumulator. It processes: f([10,20,30], 0) -> f([20,30], 10) -> f([30], 30) -> f([], 60) -> 60. The accumulator starts at 0 and adds each head element as the recursion progresses, returning the final accumulated value when the list is empty.",
  },
  {
    question: "Why do tail-recursive functions that build lists often need Enum.reverse/1 at the end?",
    options: [
      { label: "Because the BEAM reverses the stack during optimization" },
      { label: "Because prepending to the accumulator (which is O(1)) builds the list in reverse order", correct: true },
      { label: "Because Elixir lists are stored backwards in memory" },
      { label: "It's just a convention — the result would be correct without it" },
    ],
    explanation:
      "In tail-recursive list building, you prepend each element to the accumulator with [h | acc] because prepending is O(1) on linked lists, while appending is O(n). Since the first element processed gets buried at the bottom of the accumulator, the final list is reversed. Calling Enum.reverse/1 once at the end (O(n)) is far cheaper than appending on every step.",
  },
  {
    question: "Which scenario is BEST suited for raw recursion instead of using Enum functions?",
    options: [
      { label: "Summing all numbers in a flat list" },
      { label: "Filtering even numbers from a list" },
      { label: "Traversing a tree structure where each node has left and right children", correct: true },
      { label: "Mapping a function over every element of a list" },
    ],
    explanation:
      "Tree traversal requires branching recursion — visiting both left and right children — which doesn't fit the linear iteration model of Enum functions. Enum works on enumerables (linear sequences), but trees are inherently recursive data structures that need custom recursive functions. Summing, filtering, and mapping flat lists are all well-served by Enum.",
  },
  {
    question: "What is wrong with this recursive function?\n\n```elixir\ndef count_down(n) do\n  IO.puts(n)\n  count_down(n - 1)\nend\n```",
    options: [
      { label: "It's not tail-recursive" },
      { label: "IO.puts will crash on integers" },
      { label: "It has no base case, so it will recurse forever", correct: true },
      { label: "n - 1 doesn't work in Elixir" },
    ],
    explanation:
      "Every recursive function must have at least one base case — a clause that stops the recursion. This function will call itself with ever-decreasing values (0, -1, -2, ...) without ever stopping. Even though it is tail-recursive (the last call is count_down(n - 1)), the lack of a base case means it will run until the process is killed.",
  },
  {
    question: "Consider this code:\n\n```elixir\ndef map([], _func), do: []\ndef map([h | t], func) do\n  [func.(h) | map(t, func)]\nend\n```\n\nWhy is this NOT tail-recursive?",
    options: [
      { label: "Because func.(h) is called before the recursion" },
      { label: "Because it pattern matches on the list" },
      { label: "Because the list cons [... | map(t, func)] wraps the recursive call — the cons cell is built after map returns", correct: true },
      { label: "Because it uses two function clauses" },
    ],
    explanation:
      "The recursive call map(t, func) is not in tail position because its return value is used to build a cons cell [func.(h) | ...]. The function must wait for map(t, func) to return before it can construct the list. This means each call adds a frame to the stack. To make it tail-recursive, you would use an accumulator and reverse the result at the end.",
  },
  {
    question: "What does `defp` do when used in the accumulator pattern?",
    options: [
      { label: "Makes the function run faster" },
      { label: "Defines a private function, hiding the accumulator detail from the module's public API", correct: true },
      { label: "Enables tail-call optimization — defp is required for TCO" },
      { label: "Prevents the function from being called recursively" },
    ],
    explanation:
      "In the accumulator pattern, the public function (def) provides a clean interface without the accumulator argument, while the private function (defp) handles the actual recursion with the accumulator. This is an API design choice — callers shouldn't need to know about or provide the initial accumulator value. TCO works with both def and defp.",
  },
  {
    question: "What is the output of this code?\n\n```elixir\ndefmodule M do\n  def sum([], acc), do: acc\n  def sum([h | t], acc), do: sum(t, h + acc)\nend\nM.sum([[1, 2], [3]], 0)\n```",
    options: [
      { label: "6" },
      { label: "[1, 2, 3]" },
      { label: "An error because you cannot add a list to an integer", correct: true },
      { label: "0" },
    ],
    explanation:
      "The list [[1, 2], [3]] has two elements: [1, 2] and [3] — both are lists, not integers. On the first call, h is [1, 2] and the function tries to compute [1, 2] + 0, which raises an ArithmeticError because the + operator doesn't work on lists. This is a common trap — the function expects a flat list of numbers, not a nested list.",
  },
  {
    question: "GenServers and other OTP processes use a recursive loop internally. What pattern does this follow?\n\n```elixir\ndef loop(state) do\n  receive do\n    {:get, from} -> send(from, state); loop(state)\n    {:put, new_state} -> loop(new_state)\n  end\nend\n```",
    options: [
      { label: "Body recursion — each receive creates a new stack frame" },
      { label: "Tail recursion — the recursive loop/1 call is the last operation, so the BEAM reuses the stack frame indefinitely", correct: true },
      { label: "It's not recursion — receive blocks are handled by the scheduler" },
      { label: "Mutual recursion — receive and loop alternate" },
    ],
    explanation:
      "This receive loop is the fundamental pattern underlying all OTP processes. The recursive call to loop(state) is in tail position (it's the last thing in each clause), so the BEAM reuses the stack frame. This means the process can run forever handling messages without growing its stack. This is exactly how GenServer works internally — handle_call/handle_cast/handle_info are just abstractions over this pattern.",
  },
  {
    question: "When is body recursion actually preferable to tail recursion?",
    options: [
      { label: "Never — tail recursion is always better" },
      { label: "When the recursive structure mirrors the data structure you're building, and the input is reasonably bounded", correct: true },
      { label: "When you need the function to be faster" },
      { label: "When you're processing infinite streams" },
    ],
    explanation:
      "Body recursion can produce cleaner, more readable code when building recursive data structures like trees, or when mapping over bounded collections. For example, `[f.(h) | map(t, f)]` is clearer than the tail-recursive equivalent with an accumulator and reverse. For small-to-medium inputs (thousands of elements), the stack depth is fine. Only reach for tail recursion when processing potentially large or unbounded inputs where stack depth matters.",
  },
  {
    question: "What does this function do, and is it tail-recursive?\n\n```elixir\ndef flatten([]), do: []\ndef flatten([head | tail]) when is_list(head) do\n  flatten(head) ++ flatten(tail)\nend\ndef flatten([head | tail]) do\n  [head | flatten(tail)]\nend\n```",
    options: [
      { label: "Flattens a nested list; it is tail-recursive because each clause ends with a recursive call" },
      { label: "Flattens a nested list; it is NOT tail-recursive because the recursive calls are wrapped in ++ and cons operations", correct: true },
      { label: "Reverses a nested list; it is tail-recursive" },
      { label: "Removes duplicates from a list; it is body-recursive" },
    ],
    explanation:
      "This function flattens nested lists (e.g., [[1, [2]], 3] becomes [1, 2, 3]). It is body-recursive because: in the second clause, both flatten(head) and flatten(tail) must return before ++ concatenates them; in the third clause, flatten(tail) must return before the cons cell [head | ...] is built. Tree-like structures often resist tail-recursive conversion because they branch into two recursive paths. For deeply nested lists, this could overflow the stack.",
  },
];

export default questions;
