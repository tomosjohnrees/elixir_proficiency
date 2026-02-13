import type { TopicContent } from "@/lib/types";
import questions from "./questions/comprehensions";

const comprehensions: TopicContent = {
  meta: {
    slug: "comprehensions",
    title: "Comprehensions",
    description: "for expressions with generators, filters, and into",
    number: 19,
    active: true,
  },

  eli5: {
    analogyTitle: "The Assembly Line",
    analogy:
      "Imagine you have a conveyor belt in a factory. Raw materials come in on one side, workers along the belt inspect each piece (some get rejected), transform the good ones into finished products, and at the end you choose which bin to drop them into. That's a comprehension — a compact assembly line for your data.",
    items: [
      { label: "Generators", description: "The conveyor belts that feed raw materials in. You can have multiple belts running side by side, and the factory tries every combination." },
      { label: "Filters", description: "Quality inspectors standing along the line. They check each piece and wave it through or reject it. Only items that pass all inspectors continue." },
      { label: "The body", description: "The transformation step. Each item that makes it past the filters gets shaped into something new — that's the expression you write inside the comprehension." },
      { label: "The collector", description: "The bin at the end of the line. By default it's a list, but you can swap in a map, a MapSet, or even a string — whatever container you want the results dropped into." },
    ],
    keyTakeaways: [
      "Comprehensions use the `for` keyword but they're not loops — they're expressions that return a value.",
      "Generators pull values from enumerables; filters decide which values to keep.",
      "Multiple generators create a cartesian product (every combination).",
      "The `:into` option lets you collect results into any collectable — lists, maps, strings, and more.",
      "Pattern matching works directly in generators, automatically skipping non-matching elements.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Generator", color: "#2563eb", examples: ["n <- [1, 2, 3]", "x <- 1..10", "{k, v} <- map"], description: "Pulls values from an enumerable one at a time. Pattern matching on the left side filters automatically." },
      { name: "Filter", color: "#d97706", examples: ["rem(n, 2) == 0", "String.length(s) > 3", "is_integer(x)"], description: "A boolean expression that gates which values continue. Only truthy results pass through." },
      { name: "into: list", color: "#059669", examples: ["for x <- 1..5, do: x * 2", "[2, 4, 6, 8, 10]"], description: "The default collector. Results are gathered into a list in order." },
      { name: "into: map", color: "#e11d48", examples: ["for {k, v} <- list, into: %{}", "do: {k, v}"], description: "Collect key-value pairs into a map. The body must return {key, value} tuples." },
      { name: "into: string", color: "#7c3aed", examples: ["for c <- chars, into: \"\"", "do: String.upcase(c)"], description: "Collect into a string by returning string fragments from the body." },
      { name: "Cartesian Product", color: "#0891b2", examples: ["for x <- [1,2], y <- [3,4]", "=> [{1,3},{1,4},{2,3},{2,4}]"], description: "Multiple generators produce every combination of their values." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Basic Comprehensions",
        prose: [
          "A comprehension is an expression built with the `for` special form. At minimum, you need a generator and a body. The generator binds each element of an enumerable to a variable, the body transforms it, and the whole expression returns a list of results.",
          "Unlike `Enum.map/2`, comprehensions give you a single, readable construct that combines mapping, filtering, and collecting. They're especially nice when you'd otherwise chain multiple Enum calls.",
        ],
        code: {
          title: "Simple comprehension",
          code: `# Double every number in a range
for n <- 1..5, do: n * 2
# => [2, 4, 6, 8, 10]

# Transform a list of strings
for name <- ["alice", "bob", "charlie"] do
  String.capitalize(name)
end
# => ["Alice", "Bob", "Charlie"]`,
          output: "[\"Alice\", \"Bob\", \"Charlie\"]",
        },
      },
      {
        title: "Filters",
        prose: [
          "Filters are boolean expressions placed after generators (separated by commas). Only elements for which all filters return a truthy value make it to the body. This is cleaner than nesting `if` expressions or piping through `Enum.filter/2` before `Enum.map/2`.",
          "You can have multiple filters, and they're evaluated left to right. If any filter returns a falsy value, the element is skipped immediately.",
        ],
        code: {
          title: "Using filters",
          code: `# Even numbers only
for n <- 1..10, rem(n, 2) == 0, do: n
# => [2, 4, 6, 8, 10]

# Multiple filters: even AND greater than 4
for n <- 1..10, rem(n, 2) == 0, n > 4, do: n
# => [6, 8, 10]

# Equivalent Enum pipeline (more verbose)
1..10
|> Enum.filter(&(rem(&1, 2) == 0))
|> Enum.filter(&(&1 > 4))
# => [6, 8, 10]`,
          output: "[6, 8, 10]",
        },
      },
      {
        title: "Multiple Generators and Cartesian Products",
        prose: [
          "When you use multiple generators, the comprehension iterates through every combination of values — a cartesian product. The rightmost generator cycles fastest, similar to nested loops in other languages.",
          "This is extremely handy for generating combinations, coordinate grids, or cross-joining two datasets. Just be mindful that the number of iterations grows multiplicatively.",
        ],
        code: {
          title: "Multiple generators",
          code: `# Cartesian product of two lists
for x <- [1, 2, 3], y <- [:a, :b], do: {x, y}
# => [{1, :a}, {1, :b}, {2, :a}, {2, :b}, {3, :a}, {3, :b}]

# Coordinate grid
for row <- 0..2, col <- 0..2, do: {row, col}
# => [{0,0}, {0,1}, {0,2}, {1,0}, {1,1}, {1,2}, {2,0}, {2,1}, {2,2}]

# With a filter: only diagonal positions
for row <- 0..2, col <- 0..2, row == col, do: {row, col}
# => [{0, 0}, {1, 1}, {2, 2}]`,
          output: "[{0, 0}, {1, 1}, {2, 2}]",
        },
      },
      {
        title: "Pattern Matching in Generators",
        prose: [
          "You can pattern match on the left side of the `<-` operator. When an element doesn't match the pattern, it's silently skipped — no error, no crash. This is one of the most elegant features of comprehensions.",
          "This works particularly well with keyword lists, maps, and lists of tuples where you only care about certain shapes of data.",
        ],
        code: {
          title: "Pattern matching in generators",
          code: `# Extract only :ok values from tagged tuples
results = [{:ok, 1}, {:error, "bad"}, {:ok, 3}, {:error, "nope"}]
for {:ok, value} <- results, do: value
# => [1, 3]

# Destructure maps in a list
users = [%{name: "Alice", role: :admin}, %{name: "Bob", role: :user}]
for %{name: name, role: :admin} <- users, do: name
# => ["Alice"]

# Skip nil values
for x when not is_nil(x) <- [1, nil, 3, nil, 5], do: x * 10
# => [10, 30, 50]`,
          output: "[10, 30, 50]",
        },
      },
      {
        title: "The :into Option",
        prose: [
          "By default, comprehensions collect results into a list. The `:into` option lets you specify any data structure that implements the `Collectable` protocol — maps, MapSets, IO devices, and even strings.",
          "When collecting into a map, the body must return `{key, value}` tuples. When collecting into a string, the body must return string (or iodata) fragments. This makes comprehensions a powerful tool for data transformation between different collection types.",
        ],
        code: {
          title: "Collecting into different structures",
          code: `# Into a map: build a lookup table
for {name, age} <- [{"Alice", 30}, {"Bob", 25}], into: %{} do
  {name, age}
end
# => %{"Alice" => 30, "Bob" => 25}

# Into a MapSet: deduplicated collection
for x <- [1, 2, 2, 3, 3, 3], into: MapSet.new(), do: x
# => MapSet.new([1, 2, 3])

# Into a string: uppercase vowels
for <<c <- "hello world">>, c in ~c"aeiou", into: "", do: <<c>>
# => "eoo"

# Into an existing map (merging)
for {k, v} <- [a: 1, b: 2], into: %{c: 3}, do: {k, v}
# => %{a: 1, b: 2, c: 3}`,
          output: "%{a: 1, b: 2, c: 3}",
        },
      },
      {
        title: "The :reduce Option",
        prose: [
          "Elixir 1.8 introduced the `:reduce` option, which turns a comprehension into an accumulator-based fold. Instead of collecting into a data structure, you maintain a running accumulator that you update with each iteration.",
          "This is essentially `Enum.reduce/3` written in comprehension syntax. It's particularly useful when you need the filtering and multi-generator power of comprehensions but want to compute a single aggregate value rather than build a collection.",
        ],
        code: {
          title: "Reduce in comprehensions",
          code: `# Sum all even numbers from 1 to 10
for n <- 1..10, rem(n, 2) == 0, reduce: 0 do
  acc -> acc + n
end
# => 30

# Build a frequency map
for char <- String.graphemes("abracadabra"), reduce: %{} do
  acc -> Map.update(acc, char, 1, &(&1 + 1))
end
# => %{"a" => 5, "b" => 2, "c" => 1, "d" => 1, "r" => 2}

# Find the longest string
for word <- ["cat", "elephant", "dog", "hippopotamus"], reduce: "" do
  acc ->
    if String.length(word) > String.length(acc), do: word, else: acc
end
# => "hippopotamus"`,
          output: "\"hippopotamus\"",
        },
      },
      {
        title: "Bitstring Generators",
        prose: [
          "Comprehensions aren't limited to enumerables — you can also iterate over bitstrings and binaries using the `<<>>` generator syntax. This is useful for processing raw binary data byte by byte or in fixed-size chunks.",
          "Bitstring generators pair nicely with the `:into` option to transform binary data. For instance, you can iterate over bytes in a string and build a new string, or process a binary protocol's payload.",
        ],
        code: {
          title: "Bitstring generators",
          code: `# Iterate over bytes in a binary
for <<byte <- "hello">>, do: byte
# => [104, 101, 108, 108, 111]

# Extract 4-bit nibbles from a byte
for <<nibble::4 <- <<0xAB>>>>, do: nibble
# => [10, 11]

# Convert a binary to a hex string
for <<byte <- "Hi">>, into: "", do: Integer.to_string(byte, 16)
# => "4869"`,
          output: "\"4869\"",
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
        title: "FizzBuzz with Comprehensions",
        difficulty: "beginner",
        prompt:
          "Use a comprehension to generate a FizzBuzz list for numbers 1 through 20. For multiples of 3, use \"Fizz\". For multiples of 5, use \"Buzz\". For multiples of both, use \"FizzBuzz\". For everything else, use the number itself as a string.",
        hints: [
          { text: "Start with a generator over 1..20 and a `cond` in the body." },
          { text: "Use `rem(n, 15) == 0` to check for multiples of both 3 and 5." },
          { text: "Use `Integer.to_string/1` to convert non-FizzBuzz numbers to strings." },
        ],
        solution: `for n <- 1..20 do
  cond do
    rem(n, 15) == 0 -> "FizzBuzz"
    rem(n, 3) == 0 -> "Fizz"
    rem(n, 5) == 0 -> "Buzz"
    true -> Integer.to_string(n)
  end
end
# => ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz",
#     "11", "Fizz", "13", "14", "FizzBuzz", "16", "17", "Fizz", "19", "Buzz"]`,
        walkthrough: [
          "We use a single generator `n <- 1..20` to iterate through the range.",
          "Inside the body, `cond` picks the first true condition — we check `rem(n, 15)` first because 15 is a multiple of both 3 and 5.",
          "The fallback `true ->` clause converts the number to a string so the list has a consistent type.",
          "The comprehension collects all results into a list automatically.",
        ],
      },
      {
        title: "Build a Lookup Map",
        difficulty: "intermediate",
        prompt:
          "Given a list of `{name, score}` tuples, use a comprehension with `:into` to build a map where only scores above 70 are included. The map should have names as keys and letter grades as values: 90+ is \"A\", 80-89 is \"B\", 71-79 is \"C\".\n\nExample input: `[{\"Alice\", 95}, {\"Bob\", 42}, {\"Charlie\", 83}, {\"Diana\", 71}]`\nExpected output: `%{\"Alice\" => \"A\", \"Charlie\" => \"B\", \"Diana\" => \"C\"}`",
        hints: [
          { text: "Use a filter to exclude scores of 70 or below." },
          { text: "The body should return a `{name, grade}` tuple when collecting `:into` a map." },
          { text: "Use `cond` inside the body to determine the letter grade based on the score." },
        ],
        solution: `students = [{"Alice", 95}, {"Bob", 42}, {"Charlie", 83}, {"Diana", 71}]

for {name, score} <- students, score > 70, into: %{} do
  grade =
    cond do
      score >= 90 -> "A"
      score >= 80 -> "B"
      true -> "C"
    end

  {name, grade}
end
# => %{"Alice" => "A", "Charlie" => "B", "Diana" => "C"}`,
        walkthrough: [
          "We destructure each tuple with `{name, score}` right in the generator.",
          "The filter `score > 70` eliminates Bob (score 42) before the body ever runs.",
          "The `into: %{}` option tells the comprehension to collect into a map instead of a list.",
          "The body returns `{name, grade}` tuples, which the map collectable uses as key-value pairs.",
          "The `cond` block assigns letter grades — since we already filtered out scores <= 70, the `true` fallback safely covers the 71-79 range.",
        ],
      },
      {
        title: "Cartesian Coordinate Grid",
        difficulty: "intermediate",
        prompt:
          "Use a comprehension with multiple generators to create a list of `{x, y, label}` tuples for a 5x5 grid (0..4 for both axes). Apply these rules:\n- If x == y, label it \"diagonal\"\n- If x == 0 or y == 0, label it \"edge\" (but diagonal takes priority)\n- Otherwise label it \"inner\"\n\nThen use a second comprehension with `:reduce` to count how many of each label you have. The result should be a map like `%{\"diagonal\" => 5, \"edge\" => 8, \"inner\" => 12}`.",
        hints: [
          { text: "Use two generators: `x <- 0..4, y <- 0..4` to create all 25 points." },
          { text: "Use `cond` in the body to determine the label, checking diagonal first." },
          { text: "For the counting step, use `for` with `:reduce` starting from an empty map, and `Map.update/4` to increment counts." },
        ],
        solution: `# Step 1: Generate the labeled grid
grid =
  for x <- 0..4, y <- 0..4 do
    label =
      cond do
        x == y -> "diagonal"
        x == 0 or y == 0 -> "edge"
        true -> "inner"
      end

    {x, y, label}
  end

# Step 2: Count labels using :reduce
for {_x, _y, label} <- grid, reduce: %{} do
  acc -> Map.update(acc, label, 1, &(&1 + 1))
end
# => %{"diagonal" => 5, "edge" => 8, "inner" => 12}`,
        walkthrough: [
          "The first comprehension uses two generators to produce all 25 `{x, y}` combinations (cartesian product of 0..4 with 0..4).",
          "The `cond` checks diagonal first (x == y), then edge (x or y is 0), then falls back to inner.",
          "The second comprehension destructures the tuples and uses `:reduce` to fold over them with an accumulator.",
          "`Map.update/4` either inserts the key with value 1 (if missing) or increments the existing count.",
          "The 5 diagonal points are (0,0), (1,1), (2,2), (3,3), (4,4). The 8 edge points are those on row 0 or column 0 that aren't (0,0). The remaining 12 are inner.",
        ],
      },
      {
        title: "Flatten and Transform Nested Data",
        difficulty: "advanced",
        prompt:
          "Given a nested data structure of departments and their employees, use comprehensions to:\n1. Flatten into a list of `%{name: name, dept: dept, salary: salary}` maps, keeping only employees with salary > 50_000.\n2. Use `:into` to build a map grouped by department, where each key is a department name and each value is the list of employee names in that department.\n\nInput:\n```\ndepartments = [\n  {\"Engineering\", [{\"Alice\", 95_000}, {\"Bob\", 45_000}]},\n  {\"Marketing\", [{\"Charlie\", 60_000}, {\"Diana\", 48_000}]},\n  {\"Sales\", [{\"Eve\", 70_000}, {\"Frank\", 55_000}]}\n]\n```",
        hints: [
          { text: "Use two generators: one for departments and one for employees within each department." },
          { text: "Pattern match on the tuple structure: `{dept, employees} <- departments, {name, salary} <- employees`." },
          { text: "For the grouped map, you can use `:reduce` with `Map.update/4` to append names to a list per department." },
        ],
        solution: `departments = [
  {"Engineering", [{"Alice", 95_000}, {"Bob", 45_000}]},
  {"Marketing", [{"Charlie", 60_000}, {"Diana", 48_000}]},
  {"Sales", [{"Eve", 70_000}, {"Frank", 55_000}]}
]

# Step 1: Flatten and filter
employees =
  for {dept, members} <- departments,
      {name, salary} <- members,
      salary > 50_000 do
    %{name: name, dept: dept, salary: salary}
  end
# => [%{name: "Alice", dept: "Engineering", salary: 95000},
#     %{name: "Charlie", dept: "Marketing", salary: 60000},
#     %{name: "Eve", dept: "Sales", salary: 70000},
#     %{name: "Frank", dept: "Sales", salary: 55000}]

# Step 2: Group by department
for %{name: name, dept: dept} <- employees, reduce: %{} do
  acc -> Map.update(acc, dept, [name], &(&1 ++ [name]))
end
# => %{"Engineering" => ["Alice"], "Marketing" => ["Charlie"],
#      "Sales" => ["Eve", "Frank"]}`,
        walkthrough: [
          "Two generators flatten the nested structure: the outer one pulls each `{dept, members}` tuple, and the inner one iterates over the employee list within each department.",
          "The filter `salary > 50_000` removes Bob (45k) and Diana (48k) before the body runs.",
          "The body builds a map with `:name`, `:dept`, and `:salary` keys for each qualifying employee.",
          "The second comprehension uses `:reduce` to build a grouped map. `Map.update/4` either creates a new list with one name or appends to the existing list.",
          "We use `&(&1 ++ [name])` to append to the end of the list, preserving the order employees appeared in the original data.",
        ],
      },
    ],
  },
};

export default comprehensions;
