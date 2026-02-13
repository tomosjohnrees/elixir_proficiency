import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Comprehensions Return Lists by Default",
    description:
      "for comprehensions always return a list unless you specify :into. If you want a map, a MapSet, or a binary string as the result, you must explicitly use the :into option. Forgetting this leads to unexpected list results when you expected a different data structure.",
    code: `# Default: returns a list
for {k, v} <- %{a: 1, b: 2} do
  {k, v * 10}
end
#=> [a: 10, b: 20]  — a keyword list, not a map!

# Use :into for a map
for {k, v} <- %{a: 1, b: 2}, into: %{} do
  {k, v * 10}
end
#=> %{a: 10, b: 20}

# Use :into for a string
for c <- ~c"hello", into: "" do
  <<c>>
end
#=> "hello"

# Use :into for a MapSet
for x <- [1, 2, 2, 3], into: MapSet.new() do
  x
end
#=> MapSet.new([1, 2, 3])`,
  },
  {
    title: "Multiple Generators Create a Cartesian Product",
    description:
      "When you use multiple generators in a for comprehension, they produce a cartesian product (every combination), not a zip. This is a common source of unexpected results when you intend to iterate two lists in parallel. Use Enum.zip/2 for parallel iteration.",
    code: `# Multiple generators = cartesian product
for x <- [1, 2], y <- [:a, :b] do
  {x, y}
end
#=> [{1, :a}, {1, :b}, {2, :a}, {2, :b}]

# If you wanted parallel iteration, this is WRONG:
names = ["Alice", "Bob"]
ages = [30, 25]

for name <- names, age <- ages do
  {name, age}
end
#=> [{"Alice", 30}, {"Alice", 25}, {"Bob", 30}, {"Bob", 25}]
# 4 results, not 2!

# CORRECT: use Enum.zip for parallel iteration
for {name, age} <- Enum.zip(names, ages) do
  {name, age}
end
#=> [{"Alice", 30}, {"Bob", 25}]`,
  },
  {
    title: "Filters Silently Skip Non-Matching Elements",
    description:
      "Filter expressions in comprehensions silently discard elements that don't match. There is no error or warning — they just disappear from the result. This is by design, but it can hide bugs if a filter condition has a typo or logic error. You may get an empty list back with no indication of what went wrong.",
    code: `# Filter silently removes non-matching elements
for x <- 1..10, rem(x, 3) == 0 do
  x
end
#=> [3, 6, 9]

# Pattern match filters also silently skip
data = [ok: 1, error: 2, ok: 3, error: 4]

for {:ok, value} <- data do
  value
end
#=> [1, 3]  — errors silently dropped, no warning

# This can hide bugs:
users = [%{role: :admin, name: "A"}, %{role: :user, name: "B"}]

# Typo in filter — returns empty list, no error!
for %{role: :admni} = user <- users do  # "admni" typo
  user.name
end
#=> []  — silent failure`,
  },
  {
    title: "Bitstring Generators Work Differently from List Generators",
    description:
      "Bitstring generators (<<x :: size(8) <- binary>>) iterate over segments of a binary. Unlike list generators, they require explicit segment sizes and the binary must be evenly divisible by the segment size, or the remainder is silently discarded. They also can't pattern match as flexibly as list generators.",
    code: `# Bitstring generator: iterate over bytes
for <<byte <- "hello">> do
  byte
end
#=> [104, 101, 108, 108, 111]

# Segment size matters — remainder is silently dropped
for <<pair :: binary-size(2) <- "abcde">> do
  pair
end
#=> ["ab", "cd"]  — "e" is silently discarded!

# Extracting 16-bit integers from a binary
for <<int :: 16 <- <<0, 1, 0, 2, 0, 3>>>> do
  int
end
#=> [1, 2, 3]

# Can't mix list and bitstring generators as easily
# as multiple list generators:
for <<b <- "abc">>, x <- [1, 2] do
  {b, x}
end
#=> [{97, 1}, {97, 2}, {98, 1}, {98, 2}, {99, 1}, {99, 2}]`,
  },
];

export default gotchas;
