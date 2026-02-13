import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does `for n <- 1..5, rem(n, 2) == 0, do: n * 10` return?",
    options: [
      { label: "[10, 20, 30, 40, 50]" },
      { label: "[20, 40]", correct: true },
      { label: "[2, 4]" },
      { label: "20" },
    ],
    explanation:
      "The filter `rem(n, 2) == 0` keeps only even numbers (2 and 4). The body multiplies each by 10, giving [20, 40].",
  },
  {
    question: "What happens when a generator's pattern doesn't match an element?",
    options: [
      { label: "A MatchError is raised" },
      { label: "nil is used as the value" },
      { label: "The element is silently skipped", correct: true },
      { label: "The comprehension stops and returns what it has so far" },
    ],
    explanation:
      "Unlike the `=` match operator, a generator's pattern match silently skips non-matching elements. This is one of the most useful features of comprehensions — no error, just a clean filter.",
  },
  {
    question: "What does `for x <- [1, 2], y <- [3, 4], do: {x, y}` produce?",
    options: [
      { label: "[{1, 3}, {2, 4}]" },
      { label: "[{1, 3}, {1, 4}, {2, 3}, {2, 4}]", correct: true },
      { label: "[{1, 2}, {3, 4}]" },
      { label: "[{3, 1}, {4, 2}]" },
    ],
    explanation:
      "Multiple generators produce a cartesian product — every combination of values from both lists. The first generator cycles slowest, so x=1 pairs with y=3 and y=4 before x moves to 2.",
  },
  {
    question: "Which `:into` value would you use to collect comprehension results into a map?",
    options: [
      { label: "into: []" },
      { label: "into: %{}" },
      { label: "into: Map.new()" },
      { label: "Both %{} and Map.new() work", correct: true },
    ],
    explanation:
      "Both `%{}` and `Map.new()` implement the Collectable protocol and work as `:into` targets. The body must return `{key, value}` tuples for map collection.",
  },
  {
    question: "What does the `:reduce` option change about a comprehension?",
    options: [
      { label: "It makes the comprehension lazy" },
      { label: "It collects results into a smaller list" },
      { label: "It replaces collection with an accumulator that folds over each element", correct: true },
      { label: "It runs the comprehension in parallel for better performance" },
    ],
    explanation:
      "The `:reduce` option turns a comprehension from a collector into a fold. Instead of building a collection, you maintain an accumulator that's updated with each iteration — like `Enum.reduce/3` but with comprehension syntax.",
  },
  {
    question: "What does `for <<byte <- \"ABC\">>, do: byte` return?",
    options: [
      { label: "[\"A\", \"B\", \"C\"]" },
      { label: "[65, 66, 67]", correct: true },
      { label: "\"ABC\"" },
      { label: "<<65, 66, 67>>" },
    ],
    explanation:
      "A bitstring generator iterates over the raw bytes of a binary. Since \"ABC\" is UTF-8 encoded with byte values 65, 66, and 67, the comprehension returns a list of those integers. To get characters back, you would need to wrap each byte in `<<byte>>`.",
  },
  {
    question: "What is the result of `for x <- [1, 2, 3], y <- [1, 2, 3], x < y, do: {x, y}`?",
    options: [
      { label: "[{1, 2}, {1, 3}, {2, 3}]", correct: true },
      { label: "[{1, 2}, {2, 3}]" },
      { label: "[{2, 1}, {3, 1}, {3, 2}]" },
      { label: "[{1, 1}, {2, 2}, {3, 3}]" },
    ],
    explanation:
      "Multiple generators produce the cartesian product of all combinations, then the filter `x < y` keeps only pairs where x is strictly less than y. This yields the three unique pairs: {1, 2}, {1, 3}, and {2, 3}. This is a common pattern for generating combinations without repetition.",
  },
  {
    question: "What does `for {:ok, val} <- [{:ok, 1}, {:error, 2}, {:ok, 3}], into: MapSet.new(), do: val` return?",
    options: [
      { label: "[1, 3]" },
      { label: "MapSet.new([1, 2, 3])" },
      { label: "MapSet.new([1, 3])", correct: true },
      { label: "It raises a MatchError because {:error, 2} doesn't match" },
    ],
    explanation:
      "Pattern matching in generators silently skips non-matching elements, so {:error, 2} is dropped without raising an error. The matching values 1 and 3 are collected into a MapSet via the `:into` option. This combination of pattern-match filtering with `:into` is a powerful and idiomatic pattern.",
  },
  {
    question: "What does the following comprehension return?\n```\nfor n <- 1..6, reduce: {0, 0} do\n  {evens, odds} -> if rem(n, 2) == 0, do: {evens + n, odds}, else: {evens, odds + n}\nend\n```",
    options: [
      { label: "{12, 9}" },
      { label: "{2, 4, 6}" },
      { label: "{9, 12}" },
      { label: "{12, 9} — evens sum to 12, odds sum to 9", correct: true },
    ],
    explanation:
      "The `:reduce` accumulator starts as {0, 0} and pattern matches as {evens, odds} on each iteration. Even numbers (2, 4, 6) sum to 12 in the first element, and odd numbers (1, 3, 5) sum to 9 in the second element. This demonstrates how `:reduce` can maintain structured accumulators, not just simple values.",
  },
  {
    question: "What does `for <<nibble::4 <- <<0xFF>>>>, do: nibble` return?",
    options: [
      { label: "[0xFF]" },
      { label: "[255]" },
      { label: "[15, 15]", correct: true },
      { label: "[\"F\", \"F\"]" },
    ],
    explanation:
      "The bitstring generator `<<nibble::4 <- <<0xFF>>>>` reads 4 bits at a time from the binary. The byte 0xFF (11111111 in binary) splits into two 4-bit nibbles, each with value 15 (1111 in binary). Bitstring generators with size specifiers are essential for parsing binary protocols and data formats.",
  },
  {
    question: "Which of these correctly collects results into a string using a comprehension?",
    options: [
      { label: "for c <- [\"a\", \"b\", \"c\"], into: \"\", do: String.upcase(c)", correct: true },
      { label: "for c <- [\"a\", \"b\", \"c\"], into: '', do: String.upcase(c)" },
      { label: "for c <- [\"a\", \"b\", \"c\"], collect: \"\", do: String.upcase(c)" },
      { label: "for c <- [\"a\", \"b\", \"c\"], do: String.upcase(c), into: \"\"" },
    ],
    explanation:
      "The `:into` option with an empty string `\"\"` collects string fragments returned by the body into a single string. The body must return binaries (strings). Note that charlists (`''`) are not the same as strings in Elixir, and `:collect` is not a valid comprehension option. The `:into` option must appear before the `do` block.",
  },
  {
    question: "What is the difference between using a filter and pattern matching in a generator to exclude elements?",
    options: [
      { label: "There is no difference; they compile to the same code" },
      { label: "Filters work on values, while pattern matching works on structure — but a failed pattern match raises an error" },
      { label: "Pattern matching in generators silently skips non-matches and is ideal for structural filtering; explicit filters handle arbitrary boolean conditions", correct: true },
      { label: "Filters are evaluated at compile time, while pattern matches happen at runtime" },
    ],
    explanation:
      "Pattern matching in generators is best when you want to filter based on the shape or structure of data (e.g., keeping only {:ok, val} tuples). Explicit filters are better for arbitrary boolean conditions like `n > 5` or `rem(n, 2) == 0`. Both are evaluated at runtime, and both silently skip non-matching elements.",
  },
  {
    question: "What does the following return?\n```\nfor {k, v} <- [a: 1, b: 2, c: 3], into: %{x: 0} do\n  {k, v * 10}\nend\n```",
    options: [
      { label: "%{a: 10, b: 20, c: 30}" },
      { label: "%{x: 0, a: 10, b: 20, c: 30}", correct: true },
      { label: "It raises an error because you can't mix atom keys with an existing map" },
      { label: "[a: 10, b: 20, c: 30]" },
    ],
    explanation:
      "When `:into` is given a non-empty map, the comprehension merges results into that existing map. The starting map `%{x: 0}` is preserved, and the three new key-value pairs are added. This is a useful pattern for building maps with default values or merging computed data into an existing structure.",
  },
  {
    question: "How many elements does `for x <- 1..3, y <- 1..3, z <- 1..3, do: {x, y, z}` produce?",
    options: [
      { label: "9" },
      { label: "3" },
      { label: "27", correct: true },
      { label: "6" },
    ],
    explanation:
      "Three generators produce a three-way cartesian product: 3 * 3 * 3 = 27 total combinations. Each generator contributes 3 values, and every possible combination of {x, y, z} is produced. This multiplicative growth is important to keep in mind when using multiple generators to avoid accidentally generating enormous result sets.",
  },
  {
    question: "What does the following comprehension return?\n```\nfor x <- [1, 2, 3, 2, 1], uniq: true, do: x * x\n```",
    options: [
      { label: "[1, 4, 9, 4, 1]" },
      { label: "[1, 4, 9]", correct: true },
      { label: "[1, 2, 3]" },
      { label: "It raises an error because :uniq is not a valid option" },
    ],
    explanation:
      "The `:uniq` option (added in Elixir 1.12) deduplicates elements based on the value returned by the body. Since 1*1=1, 2*2=4, and 3*3=9 are computed first, when 2 and 1 appear again their squared results (4 and 1) are already seen and are skipped. The result is [1, 4, 9] with duplicates removed.",
  },
];

export default questions;
