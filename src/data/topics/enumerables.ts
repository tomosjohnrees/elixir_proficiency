import type { TopicContent } from "@/lib/types";
import Animation02EagerVsLazy from "@/components/animations/Animation02EagerVsLazy";

const enumerables: TopicContent = {
  meta: {
    slug: "enumerables",
    title: "Enumerables & Streams",
    description: "Enum module, lazy streams, and pipeline operator",
    number: 8,
    active: true,
  },

  eli5: {
    analogyTitle: "The Factory Assembly Line",
    analogy:
      "Imagine a factory with a conveyor belt carrying items. Each station along the belt does one thing — one station paints, another trims, another inspects. The Enum module is like running the entire belt at once: all items go through all stations and you get the finished pile at the end. Streams are like a pull-based belt — nothing moves until someone at the end asks for the next item, and each item goes through all stations before the next one starts.",
    items: [
      { label: "Enum", description: "The eager assembly line. It processes every item through a station before moving to the next station. You get the full result immediately, but everything runs right away." },
      { label: "Stream", description: "The lazy assembly line. Stations only run when the end of the line pulls for the next item. Great when you have a huge number of items or an endless supply." },
      { label: "Pipe operator |>", description: "The conveyor belt connector. It takes the output of one station and feeds it as the first input to the next, letting you chain stations into a readable pipeline." },
      { label: "Reduce", description: "The most powerful station. It takes all the items and combines them into a single result — a count, a sum, a completely transformed structure. Every other Enum function can be built from reduce." },
    ],
    keyTakeaways: [
      "Enum is your go-to module for working with collections. It's eager — it processes everything immediately and returns the full result.",
      "Stream is lazy — it builds up a recipe of transformations that only execute when you consume the stream with an Enum function.",
      "The pipe operator |> passes the result of the left side as the first argument to the right side. It makes multi-step transformations read top-to-bottom.",
      "Enum.reduce/3 is the most fundamental operation. map, filter, and most other Enum functions are built on top of reduce.",
      "Use Stream when working with large or infinite collections, or when you only need a subset of the results.",
    ],
  },

  visuals: {
    animation: Animation02EagerVsLazy,
    animationDuration: 17,
    dataTypes: [
      { name: "Enum (Eager)", color: "#6b46c1", examples: ["Enum.map(list, fn)", "Enum.filter(list, fn)", "Enum.reduce(list, acc, fn)"], description: "Processes the entire collection immediately. Returns the full result. Best for small-to-medium collections." },
      { name: "Stream (Lazy)", color: "#2563eb", examples: ["Stream.map(list, fn)", "Stream.filter(list, fn)", "Stream.cycle(list)"], description: "Builds a lazy recipe. Nothing runs until consumed by Enum. Handles infinite collections." },
      { name: "Pipe |>", color: "#059669", examples: ["data |> transform() |> format()", "list |> Enum.map(&f/1) |> Enum.sum()"], description: "Chains function calls left-to-right. The result of the left becomes the first argument of the right." },
      { name: "Reduce", color: "#d97706", examples: ["Enum.reduce(list, 0, &+/2)", "Enum.reduce(list, %{}, fn x, acc ->", "  Map.update(acc, x, 1, &(&1+1))", "end)"], description: "The universal operation. Folds a collection into a single value using an accumulator." },
    ],
    operatorGroups: [
      {
        name: "Common Enum Functions",
        operators: [
          { symbol: "map", description: "Transform each element" },
          { symbol: "filter", description: "Keep elements matching a condition" },
          { symbol: "reduce", description: "Fold into a single value with accumulator" },
          { symbol: "each", description: "Run a side effect for each element (returns :ok)" },
          { symbol: "sort", description: "Sort elements (default or custom comparator)" },
          { symbol: "flat_map", description: "Map then flatten one level" },
        ],
      },
      {
        name: "Useful Enum Extras",
        operators: [
          { symbol: "chunk_every", description: "Split into fixed-size groups" },
          { symbol: "group_by", description: "Group elements by a key function" },
          { symbol: "zip", description: "Pair elements from two collections" },
          { symbol: "find", description: "Return the first matching element" },
          { symbol: "any? / all?", description: "Check if any/all elements match" },
          { symbol: "into", description: "Collect results into a specific collectable" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "The Pipe Operator |>",
        prose: [
          "Before diving into Enum and Stream, let's talk about the pipe operator — it's how you'll use them idiomatically. The pipe |> takes the result of the expression on the left and passes it as the first argument to the function on the right.",
          "Without pipes, nested function calls read inside-out: Enum.sum(Enum.map(Enum.filter(list, &odd/1), &double/1)). With pipes, the same code reads top-to-bottom like a recipe. Pipes don't add any runtime overhead — they're pure syntax sugar that the compiler transforms at compile time.",
          "The convention is to design functions with the \"subject\" as the first argument so they work well with pipes. That's why Enum.map takes the collection first and the function second.",
        ],
        code: {
          title: "Pipes in action",
          code: `# Without pipes — reads inside-out
result = Enum.join(Enum.map(Enum.filter(1..10, &(rem(&1, 2) == 0)), &Integer.to_string/1), ", ")
# => "2, 4, 6, 8, 10"

# With pipes — reads like a recipe
result =
  1..10
  |> Enum.filter(&(rem(&1, 2) == 0))
  |> Enum.map(&Integer.to_string/1)
  |> Enum.join(", ")
# => "2, 4, 6, 8, 10"

# Pipes work with any function
"  hello world  "
|> String.trim()
|> String.split()
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# => "Hello World"`,
          output: "\"Hello World\"",
        },
      },
      {
        title: "Enum — Eager Collection Processing",
        prose: [
          "The Enum module is the workhorse for collection processing in Elixir. It works with any data type that implements the Enumerable protocol — lists, maps, ranges, and more. Every Enum function processes the entire collection eagerly and returns the full result.",
          "The big three are map (transform each element), filter (keep matching elements), and reduce (fold everything into one value). But Enum has over 70 functions — it's worth browsing the docs to discover tools like chunk_every, group_by, zip, and flat_map.",
          "A key thing to understand: each Enum function in a pipeline creates an intermediate list. Piping through map then filter creates two lists. For small collections this is perfectly fine. For large ones, consider Stream.",
        ],
        code: {
          title: "Enum essentials",
          code: `# map — transform each element
Enum.map([1, 2, 3], fn x -> x * 2 end)
# => [2, 4, 6]

# filter — keep elements where the function returns truthy
Enum.filter(1..10, fn x -> rem(x, 3) == 0 end)
# => [3, 6, 9]

# find — first matching element
Enum.find(["a", "bb", "ccc"], fn s -> String.length(s) > 1 end)
# => "bb"

# flat_map — map + flatten
Enum.flat_map([:a, :b], fn x -> [x, x] end)
# => [:a, :a, :b, :b]

# group_by — organize into a map
Enum.group_by(~w(ant bear cat dog), &String.length/1)
# => %{3 => ["ant", "cat", "dog"], 4 => ["bear"]}

# chunk_every — split into groups
Enum.chunk_every([1, 2, 3, 4, 5], 2)
# => [[1, 2], [3, 4], [5]]`,
          output: "[[1, 2], [3, 4], [5]]",
        },
      },
      {
        title: "Enum.reduce — The Universal Operation",
        prose: [
          "reduce is the most powerful function in Enum. It takes a collection, an initial accumulator value, and a function that receives each element and the current accumulator. Every other Enum function can be implemented with reduce.",
          "The accumulator can be anything — a number (for sums/counts), a list (for map/filter), a map (for grouping/indexing), or even a tuple (for tracking multiple things). The key is choosing the right accumulator shape for your problem.",
          "When you find yourself reaching for a complex chain of map/filter/reduce, sometimes a single reduce is cleaner because you can do multiple things in one pass.",
        ],
        code: {
          title: "Reduce patterns",
          code: `# Sum — accumulator is a number
Enum.reduce([1, 2, 3, 4], 0, fn x, acc -> x + acc end)
# => 10

# Build a frequency map — accumulator is a map
words = ~w(the cat sat on the mat the cat)
Enum.reduce(words, %{}, fn word, acc ->
  Map.update(acc, word, 1, &(&1 + 1))
end)
# => %{"cat" => 2, "mat" => 1, "on" => 1, "sat" => 1, "the" => 3}

# Implementing map with reduce
my_map = fn list, func ->
  list
  |> Enum.reduce([], fn x, acc -> [func.(x) | acc] end)
  |> Enum.reverse()
end
my_map.([1, 2, 3], &(&1 * 10))
# => [10, 20, 30]

# Max with reduce (no initial acc — uses first element)
Enum.reduce([3, 1, 4, 1, 5], fn x, acc ->
  if x > acc, do: x, else: acc
end)
# => 5`,
          output: "5",
        },
      },
      {
        title: "Streams — Lazy Evaluation",
        prose: [
          "Streams are lazy enumerables. When you call Stream.map or Stream.filter, nothing actually happens — you just build up a description of transformations. The work only runs when you consume the stream with an Enum function like Enum.to_list or Enum.take.",
          "The key advantage is that streams process elements one at a time through the entire pipeline. Instead of creating intermediate lists at each step, each element flows through all transformations before the next element starts. This means you can work with very large or even infinite collections.",
          "Use streams when: you're chaining multiple transformations on a large collection, you only need a subset of results (Enum.take), or you're working with something infinite like Stream.cycle or Stream.iterate.",
        ],
        code: {
          title: "Lazy streams",
          code: `# Eager — creates 3 intermediate lists
result =
  1..1_000_000
  |> Enum.map(&(&1 * 3))
  |> Enum.filter(&(rem(&1, 2) == 0))
  |> Enum.take(5)
# Works but processes ALL 1 million elements first

# Lazy — only processes as many elements as needed
result =
  1..1_000_000
  |> Stream.map(&(&1 * 3))
  |> Stream.filter(&(rem(&1, 2) == 0))
  |> Enum.take(5)
# => [6, 12, 18, 24, 30]
# Stops as soon as 5 results are found!

# Infinite streams
Stream.iterate(1, &(&1 * 2))
|> Enum.take(10)
# => [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]

# Stream.cycle repeats forever
Stream.cycle([:a, :b, :c])
|> Enum.take(7)
# => [:a, :b, :c, :a, :b, :c, :a]`,
          output: "[:a, :b, :c, :a, :b, :c, :a]",
        },
      },
      {
        title: "Enum vs Stream — When to Choose Which",
        prose: [
          "Use Enum by default. It's simpler, easier to debug, and fast enough for most collections. The overhead of creating intermediate lists is negligible for lists under a few thousand elements.",
          "Switch to Stream when you have a good reason: the collection is very large (millions of elements), the collection is potentially infinite, you're chaining many transformations and only need a few results, or you're reading from an external source like a file.",
          "A practical rule: if you see Enum.take at the end of a pipeline, the steps before it are candidates for Stream. If you're going to consume the entire collection anyway (Enum.sum, Enum.to_list), Stream may not help much — the overhead of laziness can even make it slightly slower.",
        ],
        code: {
          title: "Practical Stream usage",
          code: `# Reading a large file line by line
# File.stream! returns a stream — each line is read on demand
# File.stream!("huge_log.txt")
# |> Stream.filter(&String.contains?(&1, "ERROR"))
# |> Stream.map(&String.trim/1)
# |> Enum.take(10)
# Only reads lines until 10 errors are found!

# Generating data lazily
Stream.unfold(1, fn n -> {n, n + 1} end)
|> Stream.filter(&(rem(&1, 7) == 0))
|> Enum.take(5)
# => [7, 14, 21, 28, 35]

# Stream.resource for custom lazy sources
# (file handles, network connections, etc.)
fibonacci =
  Stream.unfold({0, 1}, fn {a, b} -> {a, {b, a + b}} end)

fibonacci |> Enum.take(10)
# => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
          output: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does the pipe operator |> do?",
        options: [
          { label: "Runs functions in parallel" },
          { label: "Passes the left result as the first argument to the right function", correct: true },
          { label: "Passes the left result as the last argument to the right function" },
          { label: "Creates a new process for each step" },
        ],
        explanation:
          "The pipe operator takes the result of the expression on the left and inserts it as the first argument of the function call on the right. It's pure syntax sugar — no runtime overhead. This is why Elixir functions conventionally put the 'subject' as the first parameter.",
      },
      {
        question: "What is the key difference between Enum and Stream?",
        options: [
          { label: "Enum works with lists, Stream works with maps" },
          { label: "Enum is eager (processes everything now), Stream is lazy (processes on demand)", correct: true },
          { label: "Stream is faster than Enum in all cases" },
          { label: "Enum is for small collections, Stream is for exactly 3+ elements" },
        ],
        explanation:
          "Enum processes the entire collection eagerly and returns the full result. Stream builds a lazy recipe that only executes when consumed by an Enum function. Stream isn't always faster — it adds overhead from laziness. Use it when working with large/infinite collections or when you only need a subset.",
      },
      {
        question: "What does `Stream.map([1,2,3], &(&1 * 2))` return?",
        options: [
          { label: "[2, 4, 6]" },
          { label: "A Stream struct (no computation happens yet)", correct: true },
          { label: "An error — Stream.map doesn't exist" },
          { label: ":ok" },
        ],
        explanation:
          "This is the trick question! Stream.map doesn't compute anything — it returns a Stream struct that describes the transformation. The actual computation only happens when you consume the stream with an Enum function, like Enum.to_list(stream).",
      },
      {
        question: "Which function can implement all other Enum functions?",
        options: [
          { label: "Enum.map" },
          { label: "Enum.filter" },
          { label: "Enum.reduce", correct: true },
          { label: "Enum.each" },
        ],
        explanation:
          "Enum.reduce is the most fundamental operation. You can implement map (reduce with a list accumulator), filter (reduce that conditionally includes elements), sum (reduce with a number accumulator), and any other Enum function using reduce. It's the universal collection operation.",
      },
      {
        question: "When is Stream most beneficial?",
        options: [
          { label: "When processing a list of 10 elements" },
          { label: "When you need to sort a collection" },
          { label: "When chaining transformations on a large collection and only needing a subset", correct: true },
          { label: "When you want the simplest, most readable code" },
        ],
        explanation:
          "Stream shines when you're chaining multiple transformations on a large (or infinite) collection and only need a subset of results. Each element flows through the entire pipeline before the next starts, so you can stop early. For small collections or when you consume everything, Enum is simpler and often just as fast.",
      },
      {
        question: "What does `Enum.flat_map([1, 2, 3], fn x -> [x, x * 2] end)` return?",
        options: [
          { label: "[[1, 2], [2, 4], [3, 6]]" },
          { label: "[1, 2, 2, 4, 3, 6]", correct: true },
          { label: "[2, 4, 6]" },
          { label: "[1, 1, 2, 2, 3, 3]" },
        ],
        explanation:
          "Enum.flat_map maps each element to a list and then flattens the results by one level. The function produces [[1, 2], [2, 4], [3, 6]], and flattening one level yields [1, 2, 2, 4, 3, 6]. This is equivalent to Enum.map followed by List.flatten, but done in a single pass.",
      },
      {
        question: "What does `Enum.reduce([1, 2, 3], fn x, acc -> x + acc end)` (no initial accumulator) use as the starting accumulator?",
        options: [
          { label: "0" },
          { label: "nil" },
          { label: "The first element of the collection", correct: true },
          { label: "An empty list []" },
        ],
        explanation:
          "When you call Enum.reduce/2 without an explicit initial accumulator, the first element of the collection is used as the initial accumulator, and iteration starts from the second element. This means the function is called (length - 1) times. Be careful: this variant raises an error on empty collections since there's no first element to use.",
      },
      {
        question: "What is the result of `Enum.zip([1, 2, 3], [:a, :b])`?",
        options: [
          { label: "[{1, :a}, {2, :b}, {3, nil}]" },
          { label: "[{1, :a}, {2, :b}]", correct: true },
          { label: "An error because the lists have different lengths" },
          { label: "[{1, :a}, {2, :b}, {3, :a}]" },
        ],
        explanation:
          "Enum.zip combines elements from two collections into a list of tuples, stopping as soon as the shorter collection is exhausted. Since the second list only has two elements, the result is [{1, :a}, {2, :b}]. The third element of the first list is silently dropped. This is useful behavior when you intentionally want to pair up elements and ignore extras.",
      },
      {
        question: "Which pipeline correctly transforms `[\"  HELLO \", \" world  \"]` into `[\"hello\", \"world\"]`?",
        options: [
          { label: "list |> Enum.map(&String.trim/1) |> Enum.map(&String.downcase/1)", correct: true },
          { label: "list |> Enum.map(&String.downcase/1) |> String.trim()" },
          { label: "list |> String.trim() |> String.downcase()" },
          { label: "list |> Enum.each(&String.trim/1) |> Enum.each(&String.downcase/1)" },
        ],
        explanation:
          "The correct pipeline maps String.trim over the list to remove whitespace, then maps String.downcase to normalize casing. You can't call String.trim directly on a list (it operates on a single string), and Enum.each returns :ok rather than the transformed list, so it can't be chained for transformations.",
      },
      {
        question: "What happens when you pipe a large file through `File.stream!(\"big.txt\") |> Stream.filter(&match) |> Stream.map(&transform) |> Enum.take(5)`?",
        options: [
          { label: "The entire file is read into memory, then filtered, then transformed, then 5 are taken" },
          { label: "Lines are read one at a time; each line goes through filter and transform before the next is read; stops after 5 results", correct: true },
          { label: "The file is read in 5-line chunks for efficiency" },
          { label: "An error — you can't use Stream functions with File.stream!" },
        ],
        explanation:
          "File.stream! returns a lazy stream, and Stream.filter/Stream.map add lazy transformations on top. When Enum.take(5) consumes the stream, it pulls lines one at a time through the entire pipeline. Each line is read from disk, filtered, and transformed before the next line is requested. Crucially, it stops reading the file entirely once 5 matching results are found, so you never need to load the whole file into memory.",
      },
      {
        question: "Given `Stream.iterate(0, &(&1 + 1)) |> Enum.reduce(0, &+/2)`, what happens?",
        options: [
          { label: "Returns 0 because the stream starts at 0" },
          { label: "Returns :infinity" },
          { label: "Runs forever (or until the process is killed), because you can't reduce an infinite stream", correct: true },
          { label: "Raises an ArgumentError immediately" },
        ],
        explanation:
          "Stream.iterate(0, &(&1 + 1)) creates an infinite stream of integers 0, 1, 2, 3, ... Using Enum.reduce on an infinite stream will never terminate because reduce needs to process every element before returning a result. Unlike Enum.take or Enum.take_while, reduce has no early-exit condition. This is a common gotcha: always use a terminating Enum function (take, take_while, find) with infinite streams.",
      },
      {
        question: "Which data types implement the Enumerable protocol in Elixir by default?",
        options: [
          { label: "Only lists and maps" },
          { label: "Lists, maps, ranges, MapSets, and other built-in collections", correct: true },
          { label: "Every data type in Elixir" },
          { label: "Only lists, because they are the fundamental collection type" },
        ],
        explanation:
          "The Enumerable protocol is implemented for lists, maps, ranges, MapSets, Date.Range, IO.Stream, File.Stream, and other built-in collection types. This is what allows Enum and Stream functions to work uniformly across all these types. You can also implement Enumerable for your own custom structs, making them compatible with the entire Enum/Stream API.",
      },
      {
        question: "What does `Enum.group_by([\"cat\", \"car\", \"bar\", \"bat\"], &String.first/1)` return?",
        options: [
          { label: "[\"cat\", \"car\", \"bar\", \"bat\"]" },
          { label: "%{\"c\" => [\"cat\", \"car\"], \"b\" => [\"bar\", \"bat\"]}", correct: true },
          { label: "[[\"cat\", \"car\"], [\"bar\", \"bat\"]]" },
          { label: "%{\"c\" => 2, \"b\" => 2}" },
        ],
        explanation:
          "Enum.group_by takes a collection and a key function, then returns a map where each key is a result of the key function and each value is a list of elements that produced that key. Here, String.first extracts the first character, so words starting with \"c\" are grouped together and words starting with \"b\" are grouped together. The original order within each group is preserved.",
      },
      {
        question: "In a pipeline like `1..1_000_000 |> Enum.map(&(&1 * 2)) |> Enum.filter(&(rem(&1, 3) == 0)) |> Enum.take(10)`, how many intermediate lists are created before the final result?",
        options: [
          { label: "None — the pipe operator optimizes them away" },
          { label: "One — Elixir fuses the map and filter automatically" },
          { label: "Two — one from map (1M elements) and one from filter (subset of those)", correct: true },
          { label: "Three — one for each Enum call" },
        ],
        explanation:
          "Each Enum function is eager and produces a full intermediate list. Enum.map creates a list of 1,000,000 doubled values, then Enum.filter creates a new list of the ~333,333 elements divisible by 3, and finally Enum.take selects 10 from that. The pipe operator is pure syntax sugar with no optimization. To avoid these intermediate lists, replace Enum.map and Enum.filter with their Stream equivalents.",
      },
      {
        question: "What is the output of `Enum.reduce([1, 2, 3, 4], {0, 0}, fn x, {sum, count} -> {sum + x, count + 1} end)`?",
        options: [
          { label: "{10, 4}", correct: true },
          { label: "{4, 10}" },
          { label: "{10, 3}" },
          { label: "An error — the accumulator must be a single value" },
        ],
        explanation:
          "The accumulator in Enum.reduce can be any data structure, including a tuple. Here the accumulator {sum, count} tracks two values simultaneously: a running sum and a count. After processing all four elements, sum is 1+2+3+4 = 10 and count is 4, giving {10, 4}. This pattern is extremely useful when you need to compute multiple aggregates in a single pass over the data.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Word Frequency Counter",
        difficulty: "beginner",
        prompt:
          "Write a function word_count/1 that takes a string and returns a map of word frequencies. Normalize words to lowercase and split on whitespace.\n\nExample: word_count(\"The cat and the dog and the fish\") should return %{\"the\" => 3, \"cat\" => 1, \"and\" => 2, \"dog\" => 1, \"fish\" => 1}.",
        hints: [
          { text: "Start by piping the string through String.downcase/1 and String.split/1." },
          { text: "Use Enum.reduce/3 with a map accumulator to count each word." },
          { text: "Map.update/4 is handy: Map.update(map, key, initial, update_fn)." },
        ],
        solution: `defmodule Words do
  def word_count(sentence) do
    sentence
    |> String.downcase()
    |> String.split()
    |> Enum.reduce(%{}, fn word, acc ->
      Map.update(acc, word, 1, &(&1 + 1))
    end)
  end
end

Words.word_count("The cat and the dog and the fish")
# => %{"the" => 3, "cat" => 1, "and" => 2, "dog" => 1, "fish" => 1}

Words.word_count("go go go")
# => %{"go" => 3}`,
        walkthrough: [
          "We pipe the input through String.downcase to normalize casing, then String.split to break it into a list of words.",
          "Enum.reduce builds the frequency map word by word. The accumulator starts as an empty map %{}.",
          "Map.update(acc, word, 1, &(&1 + 1)) says: if the word isn't in the map, insert it with value 1. If it is, increment the existing count by 1.",
          "The pipe operator makes this read naturally: take the sentence, lowercase it, split it, then reduce it into a frequency map.",
        ],
      },
      {
        title: "Pipeline Data Transformer",
        difficulty: "intermediate",
        prompt:
          "You have a list of user maps like:\n```\n[%{name: \"Alice\", age: 30, role: :admin}, %{name: \"Bob\", age: 17, role: :user}, ...]\n```\n\nWrite a function format_eligible/1 that:\n1. Filters to users age 18+\n2. Sorts by name alphabetically\n3. Formats each user as \"Name (role)\" — e.g., \"Alice (admin)\"\n4. Returns the resulting list of strings\n\nUse the pipe operator throughout.",
        hints: [
          { text: "Chain Enum.filter, Enum.sort_by, and Enum.map using |>." },
          { text: "Enum.sort_by/2 takes a function that extracts the sort key: Enum.sort_by(users, & &1.name)." },
          { text: "Use Atom.to_string/1 to convert the role atom to a string for formatting." },
        ],
        solution: `defmodule Users do
  def format_eligible(users) do
    users
    |> Enum.filter(fn user -> user.age >= 18 end)
    |> Enum.sort_by(fn user -> user.name end)
    |> Enum.map(fn user ->
      "\#{user.name} (\#{Atom.to_string(user.role)})"
    end)
  end
end

users = [
  %{name: "Charlie", age: 25, role: :user},
  %{name: "Alice", age: 30, role: :admin},
  %{name: "Bob", age: 17, role: :user},
  %{name: "Diana", age: 22, role: :moderator}
]

Users.format_eligible(users)
# => ["Alice (admin)", "Charlie (user)", "Diana (moderator)"]`,
        walkthrough: [
          "The pipe operator lets us express this as a clear, top-to-bottom pipeline. Each step does exactly one thing.",
          "Enum.filter keeps only users where age >= 18. Bob (17) is removed.",
          "Enum.sort_by extracts the name field as the sort key. Elixir sorts strings alphabetically by default.",
          "Enum.map transforms each user map into the formatted string. Atom.to_string converts :admin to \"admin\".",
          "Each Enum function creates an intermediate list, which is fine for a small collection like this. If this were millions of users, you'd swap the filter and map to Stream equivalents.",
        ],
      },
      {
        title: "Lazy Fibonacci Collector",
        difficulty: "advanced",
        prompt:
          "Use Stream.unfold/2 to create an infinite Fibonacci sequence. Then write a function fib_until/1 that collects all Fibonacci numbers less than a given limit.\n\nExample: fib_until(100) should return [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89].\n\nAlso write fib_sum_below/1 that returns the sum of all Fibonacci numbers below the limit.",
        hints: [
          { text: "Stream.unfold takes an initial state and a function that returns {emitted_value, next_state} or nil to stop." },
          { text: "For Fibonacci, the state is a tuple {current, next}. Each step emits current and advances to {next, current + next}." },
          { text: "Use Enum.take_while/2 to collect values while they're below the limit." },
          { text: "fib_sum_below can just pipe fib_until into Enum.sum." },
        ],
        solution: `defmodule Fibonacci do
  def stream do
    Stream.unfold({0, 1}, fn {a, b} -> {a, {b, a + b}} end)
  end

  def fib_until(limit) do
    stream()
    |> Enum.take_while(fn n -> n < limit end)
  end

  def fib_sum_below(limit) do
    fib_until(limit) |> Enum.sum()
  end
end

Fibonacci.fib_until(100)
# => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

Fibonacci.fib_sum_below(100)
# => 232

Fibonacci.stream() |> Enum.take(15)
# => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]`,
        walkthrough: [
          "Stream.unfold generates values lazily. The state {a, b} holds the current and next Fibonacci numbers. Each step emits a (the current number) and advances the state to {b, a + b}.",
          "The stream is infinite — it never returns nil, so it would generate Fibonacci numbers forever. We need an Enum function to actually consume it.",
          "Enum.take_while pulls values from the stream one at a time, keeping each one while n < limit. The moment it hits a Fibonacci number >= limit, it stops — no further numbers are generated.",
          "fib_sum_below composes fib_until with Enum.sum. This is the beauty of pipes — small functions compose into powerful operations.",
          "Notice how stream/0 is a public function returning the stream. This makes the infinite Fibonacci sequence reusable — anyone can consume it differently (take, take_while, filter, etc.).",
        ],
      },
    ],
  },
};

export default enumerables;
