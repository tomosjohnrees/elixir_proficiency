import type { TopicContent } from "@/lib/types";
import Animation08StructuralSharing from "@/components/animations/Animation08StructuralSharing";

const listsAndTuples: TopicContent = {
  meta: {
    slug: "lists-and-tuples",
    title: "Lists & Tuples",
    description: "Linked lists, tuples, keyword lists, and common operations",
    number: 3,
    active: true,
  },

  eli5: {
    analogyTitle: "The Train and the Lunchbox",
    analogy:
      "Imagine two ways to carry things. A train is a chain of carriages — you can easily hook a new carriage onto the front, and you walk through the carriages one by one to find what you need. A lunchbox has a fixed number of compartments — you can't add or remove compartments, but you can instantly peek into any one of them.",
    items: [
      { label: "Lists (Trains)", description: "A chain of carriages. Easy to add a carriage at the front, but you have to walk through each one to reach the end. Great when the number of items changes." },
      { label: "Tuples (Lunchboxes)", description: "A fixed container with numbered slots. You can peek into any slot instantly, but you can't add or remove slots. Great when the number of items is known." },
      { label: "Keyword Lists", description: "A train where every carriage has a label on the door. Labels can repeat, and the order matters — like a to-do list with priority tags." },
      { label: "Head & Tail", description: "The first carriage of a train is the 'head'. Everything after it — the rest of the chain — is the 'tail'. This is how Elixir naturally takes trains apart." },
    ],
    keyTakeaways: [
      "Lists are linked lists — prepending is fast (O(1)), but counting or accessing the end is slow (O(n)).",
      "Tuples are stored contiguously in memory — accessing by index is fast (O(1)), but updating creates a full copy.",
      "Use lists when the size varies; use tuples when the size is fixed and small (like {:ok, value} pairs).",
      "Keyword lists are lists of {atom, value} tuples — they allow duplicate keys and maintain order.",
      "The [head | tail] pattern is the fundamental way to work with lists in Elixir.",
    ],
  },

  visuals: {
    animation: Animation08StructuralSharing,
    animationDuration: 17,
    dataTypes: [
      { name: "List", color: "#2563eb", examples: ["[1, 2, 3]", "[:a, :b]", "[]"], description: "Linked list of any values. Fast to prepend, slow to append or count." },
      { name: "Tuple", color: "#d97706", examples: ["{:ok, 42}", "{1, 2, 3}", "{}"], description: "Fixed-size container. Fast random access, but copying on update." },
      { name: "Keyword List", color: "#059669", examples: ["[name: \"Jo\", age: 30]", "[a: 1, a: 2]"], description: "List of {atom, value} tuples. Ordered, allows duplicate keys." },
      { name: "Charlist", color: "#6b7280", examples: ["'hello'", "[104, 101]"], description: "List of integer codepoints. Single quotes — not the same as a string!" },
    ],
    operatorGroups: [
      {
        name: "List Operators",
        operators: [
          { symbol: "++", description: "Concatenate two lists" },
          { symbol: "--", description: "Subtract elements from a list" },
          { symbol: "|", description: "Cons operator — prepend or split head/tail" },
          { symbol: "hd", description: "Get the head (first element)" },
          { symbol: "tl", description: "Get the tail (everything after head)" },
        ],
      },
      {
        name: "Tuple Operations",
        operators: [
          { symbol: "elem", description: "Get element at index (0-based)" },
          { symbol: "put_elem", description: "Return new tuple with updated value" },
          { symbol: "tuple_size", description: "Get number of elements" },
          { symbol: "Tuple.append", description: "Return new tuple with value added at end" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Lists Are Linked Lists",
        prose: [
          "An Elixir list is a linked list — each element points to the next. This means prepending an element is cheap (just point a new node at the existing list), but finding the length or reaching the last element requires walking the entire chain.",
          "Because data in Elixir is immutable, when you prepend to a list the original list is shared, not copied. This is called structural sharing and it makes immutable lists surprisingly memory-efficient.",
        ],
        code: {
          title: "List basics",
          code: `# Creating lists
numbers = [1, 2, 3, 4, 5]
mixed = [1, :two, "three"]
empty = []

# Prepending is O(1) — fast!
[0 | numbers]   # => [0, 1, 2, 3, 4, 5]

# Concatenation with ++
[1, 2] ++ [3, 4]   # => [1, 2, 3, 4]

# Subtraction with --
[1, 2, 3, 2] -- [2]   # => [1, 3, 2] (removes first match)

# Length — must walk the whole list
length([1, 2, 3])   # => 3`,
          output: "3",
        },
      },
      {
        title: "Head and Tail",
        prose: [
          "Every non-empty list can be split into a head (the first element) and a tail (everything else, which is itself a list). This [head | tail] pattern is the cornerstone of list processing in Elixir.",
          "The functions hd/1 and tl/1 do the same thing, but pattern matching with [head | tail] is far more idiomatic. You'll see it everywhere — especially in recursive functions.",
        ],
        code: {
          title: "Splitting with head and tail",
          code: `list = [1, 2, 3, 4]

# Using hd/tl
hd(list)   # => 1
tl(list)   # => [2, 3, 4]

# Pattern matching — the idiomatic way
[head | tail] = list
head   # => 1
tail   # => [2, 3, 4]

# Matching multiple elements
[a, b | rest] = [10, 20, 30, 40]
a      # => 10
b      # => 20
rest   # => [30, 40]

# A single-element list
[only | tail] = [:lonely]
only   # => :lonely
tail   # => []`,
          output: "[]",
        },
      },
      {
        title: "Tuples",
        prose: [
          "Tuples store elements contiguously in memory, so accessing an element by index is instant (O(1)). But updating any element copies the entire tuple, so they're best for small, fixed-size collections.",
          "The most common use of tuples is tagged return values: {:ok, result} and {:error, reason}. You'll see this pattern in virtually every Elixir library. Tuples with 2–4 elements are the sweet spot.",
        ],
        code: {
          title: "Tuple basics",
          code: `# Creating tuples
point = {10, 20}
result = {:ok, "it worked"}
rgb = {255, 128, 0}

# Access by index (0-based)
elem(result, 0)   # => :ok
elem(result, 1)   # => "it worked"

# Update (returns a new tuple)
put_elem(rgb, 1, 200)   # => {255, 200, 0}

# Size
tuple_size(point)   # => 2

# Pattern matching with tuples
{:ok, value} = {:ok, 42}
value   # => 42

{x, y} = {3, 7}
x   # => 3`,
          output: "3",
        },
      },
      {
        title: "Keyword Lists",
        prose: [
          "A keyword list is just a list of two-element tuples where the first element is an atom. Elixir gives you a nice shorthand syntax: [name: \"Jo\"] is the same as [{:name, \"Jo\"}].",
          "Unlike maps, keyword lists allow duplicate keys and maintain insertion order. This makes them the go-to choice for options and configuration — you'll see them as the last argument to many functions. When a keyword list is the last argument, you can drop the brackets.",
        ],
        code: {
          title: "Keyword lists",
          code: `# Shorthand syntax
opts = [name: "José", language: "Elixir"]

# Equivalent long form
[{:name, "José"}, {:language, "Elixir"}]

# Access
opts[:name]       # => "José"
opts[:missing]    # => nil

# Duplicate keys are allowed
dupes = [a: 1, a: 2, b: 3]
dupes[:a]         # => 1 (returns first match)

# As function options (brackets optional when last arg)
String.split("a-b-c", "-", trim: true)

# Keyword module helpers
Keyword.get(opts, :name)           # => "José"
Keyword.get(opts, :age, 0)         # => 0 (default)
Keyword.keys(opts)                 # => [:name, :language]`,
          output: "[:name, :language]",
        },
      },
      {
        title: "Lists vs Tuples — When to Use Which",
        prose: [
          "The rule of thumb: use lists when the number of elements can change, and tuples when it's fixed. Lists shine in recursion and sequential processing. Tuples shine for grouping a known set of related values.",
          "A common mistake is using tuples as arrays — reaching for elem(my_tuple, i) in a loop. If you need indexed access over a dynamic collection, you probably want a map or Erlang's :array module instead.",
        ],
        code: {
          title: "Choosing the right structure",
          code: `# Tuples for fixed structures
{:ok, "data"}           # tagged result
{2024, 12, 25}          # date components
{:user, "Jo", 30}       # small record

# Lists for variable-length sequences
shopping = ["milk", "bread", "eggs"]
[item | rest] = shopping

# Pattern matching on tagged tuples — the Elixir way
case File.read("hello.txt") do
  {:ok, content} -> "Got: \#{content}"
  {:error, reason} -> "Failed: \#{reason}"
end`,
          output: "\"Failed: enoent\"",
        },
      },
      {
        title: "Common List Functions",
        prose: [
          "The Enum module is your best friend for working with lists. It provides map, filter, reduce, and dozens more. We'll cover Enum in depth in a later topic, but here are the essentials to get you started.",
          "Remember that all these functions return new lists — nothing is mutated. The original list is untouched.",
        ],
        code: {
          title: "Useful Enum functions",
          code: `list = [1, 2, 3, 4, 5]

Enum.map(list, fn x -> x * 2 end)       # => [2, 4, 6, 8, 10]
Enum.filter(list, fn x -> x > 3 end)    # => [4, 5]
Enum.sum(list)                            # => 15
Enum.member?(list, 3)                     # => true
Enum.at(list, 0)                          # => 1
Enum.reverse(list)                        # => [5, 4, 3, 2, 1]
Enum.sort([3, 1, 2])                      # => [1, 2, 3]
Enum.zip([1, 2], [:a, :b])               # => [{1, :a}, {2, :b}]

# Enum.reduce — the Swiss army knife
Enum.reduce(list, 0, fn x, acc -> x + acc end)   # => 15`,
          output: "15",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What is the time complexity of prepending an element to a list with [new | list]?",
        options: [
          { label: "O(1)", correct: true },
          { label: "O(n)" },
          { label: "O(log n)" },
          { label: "O(n²)" },
        ],
        explanation:
          "Prepending to a linked list is O(1) because you just create a new node that points to the existing list. The original list is shared, not copied. Appending, however, would be O(n) since you'd need to walk to the end.",
      },
      {
        question: "What does [1, 2, 3] -- [2] return?",
        options: [
          { label: "[1, 3]", correct: true },
          { label: "[1, 2, 3]" },
          { label: "[1, 3, 2]" },
          { label: "An error" },
        ],
        explanation:
          "The -- operator removes the first occurrence of each element in the right list from the left list. It removes the first 2 it finds, giving [1, 3].",
      },
      {
        question: "What happens when you call elem({:ok, 42}, 0)?",
        options: [
          { label: "42" },
          { label: ":ok", correct: true },
          { label: "{:ok, 42}" },
          { label: "An error — tuples are 1-indexed" },
        ],
        explanation:
          "Tuples are 0-indexed in Elixir. elem({:ok, 42}, 0) returns the first element, which is the atom :ok. elem({:ok, 42}, 1) would return 42.",
      },
      {
        question: "What does [a: 1, a: 2][:a] return?",
        options: [
          { label: "1", correct: true },
          { label: "2" },
          { label: "[1, 2]" },
          { label: "An error — duplicate keys aren't allowed" },
        ],
        explanation:
          "Keyword lists allow duplicate keys. Accessing with [:a] returns the value of the first matching key, which is 1. This is a key difference from maps, which don't allow duplicate keys.",
      },
      {
        question: "Which is the best choice for a function's return value like {:ok, result}?",
        options: [
          { label: "A list: [:ok, result]" },
          { label: "A tuple: {:ok, result}", correct: true },
          { label: "A keyword list: [ok: result]" },
          { label: "Any of the above — they're all equivalent" },
        ],
        explanation:
          "Tagged tuples like {:ok, result} are the Elixir convention for return values. Tuples are ideal here because the size is fixed (always 2 elements), access is O(1), and pattern matching on them is clean and fast.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "List Surgery",
        difficulty: "beginner",
        prompt:
          "Given the list [1, 2, 3, 4, 5], write expressions to:\n1. Add 0 to the front\n2. Get the first element\n3. Get everything except the first element\n4. Concatenate it with [6, 7, 8]\n5. Remove all occurrences of 3 and 4",
        hints: [
          { text: "Use the [new | list] syntax to prepend." },
          { text: "hd/1 and tl/1 return the head and tail, but pattern matching with [h | t] is more idiomatic." },
          { text: "++ concatenates lists. -- removes elements (first occurrence of each)." },
        ],
        solution: `list = [1, 2, 3, 4, 5]

# 1. Add 0 to the front
[0 | list]   # => [0, 1, 2, 3, 4, 5]

# 2. Get the first element
hd(list)   # => 1
# or: [head | _] = list

# 3. Get everything except the first element
tl(list)   # => [2, 3, 4, 5]
# or: [_ | tail] = list

# 4. Concatenate with [6, 7, 8]
list ++ [6, 7, 8]   # => [1, 2, 3, 4, 5, 6, 7, 8]

# 5. Remove 3 and 4
list -- [3, 4]   # => [1, 2, 5]`,
        walkthrough: [
          "Prepending with [0 | list] is O(1) — it creates a new head node pointing to the existing list.",
          "hd/1 returns the first element. Pattern matching with [head | _] does the same and is more common in real code.",
          "tl/1 returns the tail — everything after the head. The tail is always a list (possibly empty).",
          "++ walks the entire left list to create the concatenation, so put the shorter list on the left when possible.",
          "-- removes the first occurrence of each element in the right list. Both 3 and 4 appear once, so they're both removed.",
        ],
      },
      {
        title: "Tuple Unpacker",
        difficulty: "beginner",
        prompt:
          "Write a function called describe_result/1 that takes a tagged tuple and returns a string. It should handle:\n- {:ok, value} → \"Success: <value>\"\n- {:error, reason} → \"Error: <reason>\"\n- Any other tuple → \"Unknown result\"",
        hints: [
          { text: "Use pattern matching in the function heads — multiple clauses." },
          { text: "String interpolation with \#{} will convert the value to a string for you." },
          { text: "A catch-all clause with a single variable (no pattern) handles 'any other tuple'." },
        ],
        solution: `defmodule Results do
  def describe_result({:ok, value}) do
    "Success: \#{value}"
  end

  def describe_result({:error, reason}) do
    "Error: \#{reason}"
  end

  def describe_result(_other) do
    "Unknown result"
  end
end

Results.describe_result({:ok, 42})           # => "Success: 42"
Results.describe_result({:error, "timeout"}) # => "Error: timeout"
Results.describe_result({:warning, "hmm"})   # => "Unknown result"`,
        walkthrough: [
          "We define three clauses of the same function, each matching a different pattern.",
          "The first clause matches any 2-tuple starting with :ok and binds the second element to value.",
          "The second clause does the same for :error tuples.",
          "The third clause uses _other as a catch-all — the underscore prefix signals we don't use the variable.",
          "Elixir tries clauses top to bottom, so the specific patterns must come before the catch-all.",
        ],
      },
      {
        title: "Keyword Config Merger",
        difficulty: "intermediate",
        prompt:
          "Write a function merge_config/2 that takes a list of default keyword options and a list of user overrides, returning a merged keyword list where user values take precedence. For example:\nmerge_config([timeout: 5000, retries: 3, verbose: false], [timeout: 10000, verbose: true])\nshould return [timeout: 10000, retries: 3, verbose: true]",
        hints: [
          { text: "Look at the Keyword module — there's a function that does exactly this." },
          { text: "Keyword.merge/2 merges two keyword lists, with the second list's values winning on conflicts." },
          { text: "Be careful about the argument order — defaults should be first so overrides take precedence." },
        ],
        solution: `defmodule Config do
  def merge_config(defaults, overrides) do
    Keyword.merge(defaults, overrides)
  end
end

Config.merge_config(
  [timeout: 5000, retries: 3, verbose: false],
  [timeout: 10000, verbose: true]
)
# => [timeout: 10000, retries: 3, verbose: true]

# You can also do it manually with Enum.reduce:
defmodule ConfigManual do
  def merge_config(defaults, overrides) do
    Enum.reduce(overrides, defaults, fn {key, val}, acc ->
      Keyword.put(acc, key, val)
    end)
  end
end`,
        walkthrough: [
          "Keyword.merge/2 is the simplest solution — it combines two keyword lists with the second taking precedence on duplicate keys.",
          "The manual approach uses Enum.reduce to iterate over the overrides, calling Keyword.put for each one.",
          "Keyword.put replaces the first occurrence of the key, maintaining a clean result without duplicates.",
          "This pattern is extremely common in Elixir libraries — functions accept a keyword list of options and merge them with internal defaults.",
        ],
      },
      {
        title: "List Flattener",
        difficulty: "advanced",
        prompt:
          "Without using List.flatten/1, write a recursive function my_flatten/1 that takes a nested list like [1, [2, [3, 4], 5], 6] and returns a flat list [1, 2, 3, 4, 5, 6]. Your function should handle any depth of nesting.",
        hints: [
          { text: "Think in terms of [head | tail]. Process the head, then recurse on the tail." },
          { text: "The head can be either a list (needs further flattening) or a non-list value. Use is_list/1 to check." },
          { text: "Flatten the head, flatten the tail, then concatenate the results with ++." },
          { text: "Base case: an empty list flattens to an empty list." },
        ],
        solution: `defmodule MyList do
  def my_flatten([]), do: []

  def my_flatten([head | tail]) when is_list(head) do
    my_flatten(head) ++ my_flatten(tail)
  end

  def my_flatten([head | tail]) do
    [head | my_flatten(tail)]
  end
end

MyList.my_flatten([1, [2, [3, 4], 5], 6])
# => [1, 2, 3, 4, 5, 6]

MyList.my_flatten([[[:deep]], :shallow])
# => [:deep, :shallow]

MyList.my_flatten([])
# => []`,
        walkthrough: [
          "The first clause handles the base case — an empty list returns an empty list.",
          "The second clause fires when the head is itself a list. We flatten the head and the tail separately, then concatenate with ++.",
          "The third clause handles a non-list head — we keep it and recurse on the tail using the cons operator [head | ...].",
          "The guard when is_list(head) is what distinguishes the second and third clauses. Without it, we wouldn't know whether to recurse into the head.",
          "This isn't tail-recursive (the ++ happens after the recursive calls), so it can be slow on deeply nested structures. The built-in List.flatten/1 uses an optimised algorithm.",
        ],
      },
    ],
  },
};

export default listsAndTuples;
