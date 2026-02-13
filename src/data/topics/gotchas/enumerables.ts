import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Enum.map on a Map Returns a Keyword List, Not a Map",
    description:
      "When you use Enum.map/2 on a map, the result is a list of tuples (or a keyword list if keys are atoms), not a new map. This is because Enum.map/2 always returns a list. To transform a map and get a map back, use Map.new/2 or Enum.into/3.",
    code: `map = %{a: 1, b: 2, c: 3}

# Returns a keyword list, NOT a map
Enum.map(map, fn {k, v} -> {k, v * 2} end)
#=> [a: 2, b: 4, c: 6]

# To get a map back, use Map.new/2
Map.new(map, fn {k, v} -> {k, v * 2} end)
#=> %{a: 2, b: 4, c: 6}

# Or pipe into Map.new
map |> Enum.map(fn {k, v} -> {k, v * 2} end) |> Map.new()
#=> %{a: 2, b: 4, c: 6}`,
  },
  {
    title: "Forcing Evaluation on Infinite Streams Hangs Forever",
    description:
      "Streams are lazy — they only compute values when consumed. But calling any eager Enum function on an infinite stream will hang because it tries to process all (infinite) elements. Always use Stream functions or Enum.take/2 to limit infinite streams before forcing evaluation.",
    code: `# Create an infinite stream
stream = Stream.iterate(0, &(&1 + 1))

# This will HANG FOREVER — trying to process infinite elements
# Enum.to_list(stream)   # Never returns!
# Enum.map(stream, &(&1 * 2))  # Never returns!

# Use Enum.take/2 to limit first
Enum.take(stream, 5)
#=> [0, 1, 2, 3, 4]

# Or use Stream functions to stay lazy
stream
|> Stream.map(&(&1 * 2))
|> Stream.filter(&(rem(&1, 3) == 0))
|> Enum.take(5)
#=> [0, 6, 12, 18, 24]`,
  },
  {
    title: "Enum.each Returns :ok, Not the Collection",
    description:
      "Enum.each/2 is meant for side effects only and always returns :ok, not the modified collection. If you need to transform and return data, use Enum.map/2 instead. This trips up developers who chain Enum.each into a pipeline expecting to pass data through.",
    code: `list = [1, 2, 3]

# Enum.each returns :ok — the data is gone!
result = Enum.each(list, &IO.puts/1)
# Prints: 1, 2, 3
result
#=> :ok

# This pipeline breaks — :ok is passed to the next step
[1, 2, 3]
|> Enum.each(&IO.puts/1)
|> Enum.sum()
#=> ** (Protocol.UndefinedError) protocol Enumerable
#     not implemented for :ok

# Use Enum.map for transformations
[1, 2, 3]
|> Enum.map(&(&1 * 2))
|> Enum.sum()
#=> 12`,
  },
  {
    title: "Enum.reduce Is the Universal Building Block",
    description:
      "Almost every Enum function can be implemented with Enum.reduce/3, and it's the most flexible tool for custom aggregation. However, if a more specific function exists (like Enum.sum, Enum.filter, Enum.group_by), prefer it for clarity. Reduce is powerful but can make code harder to read when overused.",
    code: `# Enum.sum is just reduce under the hood
Enum.reduce([1, 2, 3], 0, fn x, acc -> x + acc end)
#=> 6

# But Enum.sum/1 is clearer
Enum.sum([1, 2, 3])
#=> 6

# Reduce shines for custom aggregation
# Group words by first letter
words = ["apple", "banana", "avocado", "blueberry"]
Enum.reduce(words, %{}, fn word, acc ->
  letter = String.first(word)
  Map.update(acc, letter, [word], &[word | &1])
end)
#=> %{"a" => ["avocado", "apple"], "b" => ["blueberry", "banana"]}

# But Enum.group_by is clearer for this case
Enum.group_by(words, &String.first/1)
#=> %{"a" => ["apple", "avocado"], "b" => ["banana", "blueberry"]}`,
  },
];

export default gotchas;
