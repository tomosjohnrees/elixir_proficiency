import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
];

export default questions;
