import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "Which function design is most pipe-friendly in Elixir?",
    options: [
      { label: "put_in(value, container) — value first" },
      { label: "put_in(container, value) — subject first", correct: true },
      { label: "put_in(opts, container, value) — options first" },
      { label: "It doesn't matter for pipe usage" },
    ],
    explanation:
      "Idiomatic Elixir functions take the 'subject' (the data being transformed) as the first argument. This makes them naturally pipe-friendly: data |> put_in(value). The entire standard library follows this convention — Enum.map(list, fn), String.upcase(str), Map.put(map, key, val).",
  },
  {
    question: "What does the trailing ? mean in a function name like String.contains?/2?",
    options: [
      { label: "The function may raise an error" },
      { label: "The function returns a boolean", correct: true },
      { label: "The function is deprecated" },
      { label: "The function accepts optional arguments" },
    ],
    explanation:
      "By convention, functions ending with ? return a boolean value (true or false). This is a naming convention, not enforced by the compiler, but the entire ecosystem follows it: Enum.empty?/1, Map.has_key?/2, String.valid?/1, etc.",
  },
  {
    question: "What does the trailing ! mean in a function name like File.read!/1?",
    options: [
      { label: "The function is unsafe and should be avoided" },
      { label: "The function raises an exception on failure instead of returning an error tuple", correct: true },
      { label: "The function modifies its input in place" },
      { label: "The function runs asynchronously" },
    ],
    explanation:
      "The ! suffix indicates the function raises an exception on failure rather than returning {:error, reason}. For example, File.read/1 returns {:ok, content} or {:error, reason}, while File.read!/1 returns the content directly or raises. Use the bang version when failure is unexpected and should crash the process.",
  },
  {
    question: "What is the idiomatic way to handle a chain of operations that might fail?",
    options: [
      { label: "Nested if statements" },
      { label: "try/rescue blocks" },
      { label: "with expression matching on {:ok, value} tuples", correct: true },
      { label: "Raising exceptions at each step" },
    ],
    explanation:
      "The with expression is the idiomatic way to chain operations that return {:ok, value} or {:error, reason}. Each clause pattern-matches on the happy path, and the else clause handles errors. This keeps the code flat and readable compared to deeply nested case statements.",
  },
  {
    question: "Which is the idiomatic way to provide a default value for a missing map key?",
    options: [
      { label: "if Map.has_key?(map, :key), do: map[:key], else: default" },
      { label: "Map.get(map, :key, default)", correct: true },
      { label: "try do map.key rescue _ -> default end" },
      { label: "map[:key] || default — always" },
    ],
    explanation:
      "Map.get/3 with a default is the cleanest approach. While map[:key] || default works for many cases, it incorrectly replaces nil and false values with the default. Map.get/3 only uses the default when the key is truly missing, making it more correct.",
  },
  {
    question: "When should you use a GenServer instead of a plain module with functions?",
    options: [
      { label: "Always — GenServer is the standard way to organize code" },
      { label: "Only when you need to maintain state across calls or handle concurrent access", correct: true },
      { label: "Whenever you have more than 5 functions" },
      { label: "Only for Phoenix controllers" },
    ],
    explanation:
      "A common anti-pattern is wrapping stateless logic in a GenServer. If your module just transforms data without maintaining state, a plain module with functions is simpler and more performant. GenServers are for stateful processes, not for code organization. A function that takes input and returns output doesn't need a process.",
  },
  {
    question: "What does this pattern accomplish: data |> Enum.map(&String.trim/1) |> Enum.reject(&(&1 == \"\"))?",
    options: [
      { label: "Trims strings and removes empty ones", correct: true },
      { label: "Trims strings and keeps only empty ones" },
      { label: "Removes whitespace from the list itself" },
      { label: "This will raise because you can't pipe into Enum.reject" },
    ],
    explanation:
      "This is a classic pipeline pattern: first trim whitespace from each string with Enum.map, then remove any that became empty strings with Enum.reject. The pipe operator |> passes the result of each step as the first argument to the next function, creating a clear data transformation flow.",
  },
  {
    question: "What is the preferred way to match on the structure of a value in Elixir?",
    options: [
      { label: "Use if/else with type-checking functions" },
      { label: "Use multiple function heads with pattern matching", correct: true },
      { label: "Use a single function with a large cond block" },
      { label: "Use try/rescue to catch mismatches" },
    ],
    explanation:
      "Idiomatic Elixir uses multiple function clauses with pattern matching in the arguments. Instead of a single function that inspects its input with if/cond, you write separate function heads for each case. This makes the code declarative, self-documenting, and easy to extend.",
  },
  {
    question: "Which tagged tuple convention is correct for Elixir?",
    options: [
      { label: "{:success, value} and {:failure, reason}" },
      { label: "{:ok, value} and {:error, reason}", correct: true },
      { label: "{:true, value} and {:false, reason}" },
      { label: "{value, :ok} and {reason, :error}" },
    ],
    explanation:
      "The universal convention in Elixir is {:ok, value} for success and {:error, reason} for failure. The entire ecosystem — GenServer, Ecto, Phoenix, File, and every well-designed library — uses this pattern. Using different atoms like :success/:failure breaks interoperability with with expressions and the standard library.",
  },
  {
    question: "What is wrong with this code: if condition, do: thing_a(), else: if other_condition, do: thing_b(), else: thing_c()?",
    options: [
      { label: "Nothing — this is valid Elixir" },
      { label: "It should use cond instead of nested if/else", correct: true },
      { label: "if/else doesn't support do/else syntax" },
      { label: "You can't call functions inside if blocks" },
    ],
    explanation:
      "While syntactically valid, nested if/else is not idiomatic. When you have multiple conditions to check, use cond which is designed exactly for this. It reads like a series of conditions and is much clearer: cond do condition -> thing_a(); other_condition -> thing_b(); true -> thing_c() end.",
  },
  {
    question: "What is the \"transform data through a pipeline\" mindset?",
    options: [
      { label: "Always use the |> operator on every line" },
      { label: "Think of programs as a series of data transformations rather than a sequence of mutations", correct: true },
      { label: "Use Stream instead of Enum for all operations" },
      { label: "Avoid using variables and always inline everything" },
    ],
    explanation:
      "The pipeline mindset means thinking about your program as data flowing through transformations: input |> validate |> normalize |> process |> format. Each step takes data in, returns new data out, with no mutation. This is the core of functional programming in Elixir and leads to code that is easy to read, test, and debug.",
  },
  {
    question: "Which approach is more idiomatic for converting a value that could be nil?",
    options: [
      { label: "if value != nil, do: transform(value), else: nil" },
      { label: "case value do nil -> nil; v -> transform(v) end" },
      { label: "value && transform(value)", correct: true },
      { label: "try do transform(value) rescue _ -> nil end" },
    ],
    explanation:
      "Using the short-circuit behavior of && is the most concise idiomatic approach: value && transform(value). If value is nil, && short-circuits and returns nil. If value is truthy, it evaluates and returns transform(value). This is a common pattern throughout Elixir codebases for nil-safe operations.",
  },
  {
    question: "Why is it considered an anti-pattern to use Enum.count/1 to check if a list is empty?",
    options: [
      { label: "Enum.count/1 doesn't work on lists" },
      { label: "It traverses the entire list just to check if it's empty — use Enum.empty?/1 or pattern match instead", correct: true },
      { label: "It returns a float, not an integer" },
      { label: "It's deprecated in favor of length/1" },
    ],
    explanation:
      "Enum.count/1 traverses the entire collection to count elements, which is O(n). If you only want to know if it's empty, use Enum.empty?/1 or pattern match on [] — both are O(1) for lists. Similarly, prefer match?([_ | _], list) over Enum.count(list) > 0 for checking non-emptiness.",
  },
  {
    question: "What does the pattern def foo(%{field: field} = struct) accomplish?",
    options: [
      { label: "It creates a copy of the struct" },
      { label: "It pattern matches to extract field while keeping the whole struct accessible", correct: true },
      { label: "It validates that the struct has the field" },
      { label: "It raises if field is nil" },
    ],
    explanation:
      "This pattern uses = in the function head to both destructure and capture. The %{field: field} extracts the field value into a variable, while = struct binds the entire argument. You can then use both field (the extracted value) and struct (the whole map) in the function body. This is extremely common in idiomatic Elixir.",
  },
  {
    question: "Which is the idiomatic way to update a nested value in a map?",
    options: [
      { label: "map = Map.put(map, :a, Map.put(map.a, :b, new_value))" },
      { label: "put_in(map, [:a, :b], new_value)", correct: true },
      { label: "map.a.b = new_value" },
      { label: "Map.update(map, :a, fn a -> Map.update(a, :b, fn _ -> new_value end) end)" },
    ],
    explanation:
      "put_in/3 with a key path is the idiomatic way to update nested structures. It reads clearly and handles the nesting for you. Elixir also provides update_in/3 for transforming (rather than replacing) nested values and get_in/2 for reading them. These Access-based functions are designed for exactly this use case.",
  },
  {
    question: "What is the purpose of the @doc false annotation?",
    options: [
      { label: "It makes the function private" },
      { label: "It hides the function from generated documentation while keeping it public", correct: true },
      { label: "It disables the function" },
      { label: "It marks the function as deprecated" },
    ],
    explanation:
      "@doc false hides a public function from documentation generated by ExDoc. The function remains public and callable — it's just not shown in the docs. This is useful for functions that are public for technical reasons (like being called from other modules in your app) but aren't part of your library's public API.",
  },
  {
    question: "Which pattern correctly uses with for a multi-step operation?",
    options: [
      {
        label: "with {:ok, a} <- step1(), {:ok, b} <- step2(a) do {:ok, b} end",
        correct: true,
      },
      { label: "with step1() |> step2() do :ok end" },
      { label: "with {:ok, a} = step1(), {:ok, b} = step2(a) do {:ok, b} end" },
      { label: "with do step1() && step2() end" },
    ],
    explanation:
      "The with expression uses <- for pattern matching each step. If a step doesn't match, with short-circuits and returns the non-matching value. Using = instead of <- would raise a MatchError on failure rather than gracefully falling through to the else clause. The <- operator is what makes with useful for happy-path chaining.",
  },
];

export default questions;
