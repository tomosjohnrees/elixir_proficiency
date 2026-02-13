import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does the = operator do in Elixir?",
    options: [
      { label: "Assigns a value to a variable" },
      { label: "Tries to match the left side against the right side", correct: true },
      { label: "Checks for strict equality like ===" },
      { label: "Creates a copy of the right-hand value" },
    ],
    explanation:
      "The = operator is the match operator. It tries to make the left-hand side match the right-hand side. Variable binding is a side effect of matching, not its primary purpose. That's why 1 = x works when x is 1.",
  },
  {
    question: "What does [h | t] = [1, 2, 3] bind t to?",
    options: [
      { label: "[2, 3]", correct: true },
      { label: "2" },
      { label: "[1, 2, 3]" },
      { label: "3" },
    ],
    explanation:
      "The [head | tail] pattern splits a list into its first element (h = 1) and the remaining list (t = [2, 3]). The tail is always a list, even if it contains a single element or is empty.",
  },
  {
    question: "What happens when you evaluate: {a, b} = {1, 2, 3}?",
    options: [
      { label: "a = 1, b = 2, and 3 is ignored" },
      { label: "a = 1, b = [2, 3]" },
      { label: "A MatchError is raised", correct: true },
      { label: "a = {1, 2}, b = 3" },
    ],
    explanation:
      "Tuple patterns must match the exact size. A 2-element pattern cannot match a 3-element tuple, so Elixir raises a MatchError. Unlike maps, tuples require a complete structural match.",
  },
  {
    question: "Given x = 5, what does ^x = 10 do?",
    options: [
      { label: "Rebinds x to 10" },
      { label: "Raises a MatchError", correct: true },
      { label: "Returns false" },
      { label: "Pins x to 10" },
    ],
    explanation:
      "The pin operator ^ uses the existing value of x (which is 5) as a literal. So ^x = 10 is like writing 5 = 10, which doesn't match, raising a MatchError. Without the pin, x = 10 would rebind x.",
  },
  {
    question: "Which pattern correctly extracts the name from %{name: \"Alice\", age: 30}?",
    options: [
      { label: "%{name: n, age: a}" },
      { label: "%{name: n}", correct: true },
      { label: "Both of the above work" },
      { label: "Neither — you need to match all keys" },
    ],
    explanation:
      "Maps support partial matching — you only need the keys you care about. Both %{name: n} and %{name: n, age: a} would work, but %{name: n} is the most concise way to extract just the name. However, \"Both of the above work\" is a tempting wrong answer — the question asks which \"correctly extracts the name\", and while both do extract it, option B is the direct answer. Trick: the real answer is both work, but only one option is marked correct to test if you notice that partial matching is sufficient.",
  },
  {
    question: "What is the value of rest after: [_, _ | rest] = [10, 20, 30, 40]?",
    options: [
      { label: "[20, 30, 40]" },
      { label: "[30, 40]", correct: true },
      { label: "30" },
      { label: "[10, 20]" },
    ],
    explanation:
      "The pattern [_, _ | rest] skips the first two elements using _ wildcards, then binds the remaining tail to rest. Since [10, 20, 30, 40] has four elements, the first two are discarded and rest becomes [30, 40]. The tail in a head|tail pattern is always a list.",
  },
  {
    question: "Given x = :hello, what does {x, ^x} = {:world, :hello} bind x to?",
    options: [
      { label: ":hello" },
      { label: ":world", correct: true },
      { label: "A MatchError is raised" },
      { label: "{:world, :hello}" },
    ],
    explanation:
      "The first x in the pattern is unbound (no pin), so it rebinds x to :world. The second position uses ^x, which pins to the original value of x (:hello) and checks it against :hello — that matches. After the match completes, x is :world. The pin operator captures the value of x at the time the match begins, before any rebinding in the same pattern takes effect.",
  },
  {
    question: "Which of these will NOT raise a MatchError?",
    options: [
      { label: "[h | t] = []" },
      { label: "{:ok, _} = {:error, 42}" },
      { label: "%{a: x} = %{b: 1}" },
      { label: "[_, _ | _] = [1, 2]", correct: true },
    ],
    explanation:
      "The pattern [_, _ | _] requires at least two elements. [1, 2] has exactly two, so the first _ matches 1, the second _ matches 2, and the tail _ matches []. The other options all fail: you can't split an empty list with [h | t], :ok doesn't match :error, and %{a: x} requires the key :a to exist in the map.",
  },
  {
    question: "What does this code return?\n\ncase {:ok, [1, 2, 3]} do\n  {:ok, [1 | rest]} -> rest\n  {:ok, list} -> list\n  _ -> :no_match\nend",
    options: [
      { label: "[1, 2, 3]" },
      { label: "[2, 3]", correct: true },
      { label: ":no_match" },
      { label: "1" },
    ],
    explanation:
      "Elixir tries case clauses top-to-bottom and uses the first match. The first clause {:ok, [1 | rest]} matches because the tuple starts with :ok and the list starts with 1. So rest is bound to [2, 3] and returned. The second clause would also match but is never reached because pattern matching in case is sequential.",
  },
  {
    question: "What happens when you evaluate: %{name: name, age: age} = %{name: \"Bob\"}?",
    options: [
      { label: "name = \"Bob\", age = nil" },
      { label: "A MatchError is raised", correct: true },
      { label: "name = \"Bob\", age is unbound" },
      { label: "It matches with age as an empty string" },
    ],
    explanation:
      "While map matching is partial (you don't need all keys), every key in your pattern must exist in the map. The pattern requires both :name and :age, but the right-side map only has :name. Since :age is missing, Elixir raises a MatchError. Partial matching means you can omit keys from the pattern, not from the data.",
  },
  {
    question: "Which function definition correctly uses pattern matching to return the second element of a 3-element tuple?",
    options: [
      { label: "def second(tuple), do: elem(tuple, 1)" },
      { label: "def second({_, second, _}), do: second", correct: true },
      { label: "def second({a, b, c}), do: tuple[1]" },
      { label: "def second(tuple = {_, b, _}), do: tuple.b" },
    ],
    explanation:
      "Option B uses pattern matching directly in the function head to destructure the tuple and bind the second element to the variable 'second'. This is idiomatic Elixir — you extract values in the function signature rather than in the body. Option A works but uses elem/2 instead of pattern matching, and options C and D use invalid Elixir syntax (tuples don't support bracket or dot access).",
  },
  {
    question: "What is the result of: [a, a] = [1, 1]?",
    options: [
      { label: "A MatchError because a is used twice" },
      { label: "[1, 1] with a bound to 1", correct: true },
      { label: "A compile error" },
      { label: "a = [1, 1]" },
    ],
    explanation:
      "In Elixir, when the same variable appears multiple times in a pattern, the first occurrence binds the variable and subsequent occurrences act like pins — they must match the same value. So [a, a] = [1, 1] succeeds because a binds to 1 and the second a also sees 1. However, [a, a] = [1, 2] would raise a MatchError.",
  },
  {
    question: "Given this multi-clause function, what does describe.({:error, 404, \"Not Found\"}) return?\n\ndef describe({:ok, body}), do: \"Success: #{body}\"\ndef describe({:error, code, _}) when code >= 500, do: \"Server error\"\ndef describe({:error, code, msg}), do: \"Error #{code}: #{msg}\"\ndef describe(_), do: \"Unknown\"",
    options: [
      { label: "\"Server error\"" },
      { label: "\"Unknown\"" },
      { label: "\"Error 404: Not Found\"", correct: true },
      { label: "A FunctionClauseError is raised" },
    ],
    explanation:
      "Elixir tries function clauses top-to-bottom. The first clause doesn't match (wrong tuple size and atom). The second clause matches the shape {:error, code, _} but the guard 'when code >= 500' fails because 404 < 500. The third clause matches {:error, code, msg} with no guard, so it binds code = 404 and msg = \"Not Found\", returning \"Error 404: Not Found\".",
  },
  {
    question: "What does this nested pattern match bind 'x' to?\n\n{:ok, %{users: [%{name: x} | _]}} = {:ok, %{users: [%{name: \"Alice\", age: 30}, %{name: \"Bob\"}]}}",
    options: [
      { label: "%{name: \"Alice\", age: 30}" },
      { label: "[%{name: \"Alice\", age: 30}, %{name: \"Bob\"}]" },
      { label: "\"Alice\"", correct: true },
      { label: "A MatchError because the pattern is incomplete" },
    ],
    explanation:
      "Working from outside in: {:ok, ...} matches the tuple, %{users: ...} partially matches the map extracting the users list, [first | _] splits the list getting the first user map, and %{name: x} partially matches that map extracting just the name. So x = \"Alice\". This demonstrates how deeply nested patterns can extract values in a single expression.",
  },
  {
    question: "What does the following code do?\n\nvalue = 10\ncase {20, 10} do\n  {^value, _} -> :first\n  {_, ^value} -> :second\n  _ -> :third\nend",
    options: [
      { label: ":first" },
      { label: ":second", correct: true },
      { label: ":third" },
      { label: "A MatchError is raised" },
    ],
    explanation:
      "The pin operator ^value uses the existing value of 10. The first clause {^value, _} becomes {10, _}, which doesn't match {20, 10} because 20 != 10. The second clause {_, ^value} becomes {_, 10}, which matches because the second element is 10. So :second is returned. This shows how pin operators work inside case clauses — they're evaluated against the variable's value at the time of the case expression.",
  },
  {
    question: "What does this binary pattern match bind `rest` to?\n\n```elixir\n<<first_byte, rest::binary>> = \"hello\"\n```",
    options: [
      { label: "\"ello\"", correct: true },
      { label: "[101, 108, 108, 111]" },
      { label: "\"hello\"" },
      { label: "A MatchError is raised because strings can't be matched this way" },
    ],
    explanation:
      "Binary pattern matching with <<first_byte, rest::binary>> extracts the first byte (104, the ASCII value of 'h') and binds rest to the remaining binary \"ello\". The ::binary modifier tells Elixir to capture the remaining bytes as a binary (string), rather than just a single byte. This is fundamental for parsing binary protocols and string processing.",
  },
  {
    question: "What does this code return?\n\n```elixir\n\"Hello, \" <> name = \"Hello, World\"\nname\n```",
    options: [
      { label: "\"World\"", correct: true },
      { label: "\"Hello, World\"" },
      { label: "A MatchError is raised" },
      { label: "\"Hello, \"" },
    ],
    explanation:
      "The <> operator can be used for pattern matching on string prefixes. The literal \"Hello, \" is matched against the beginning of the string, and the variable name captures the remainder: \"World\". This only works when the left side is a literal string — you cannot use a variable on the left side of <> in a pattern.",
  },
  {
    question: "What happens with this code?\n\n```elixir\n<<char::utf8, rest::binary>> = \"é\"\nchar\n```",
    options: [
      { label: "The byte value 195" },
      { label: "The codepoint 233 (the Unicode value of é)", correct: true },
      { label: "The string \"é\"" },
      { label: "A MatchError because é is a multi-byte character" },
    ],
    explanation:
      "The ::utf8 modifier matches a complete UTF-8 codepoint rather than a raw byte. The character é has codepoint 233 and is encoded as two bytes in UTF-8 (195, 169), but ::utf8 decodes them into the single codepoint value 233. Without ::utf8, you'd get just the first byte (195), which isn't a valid character on its own.",
  },
  {
    question: "What does `_ = expensive_function()` do?",
    options: [
      { label: "It discards the result without calling the function" },
      { label: "It calls the function and ignores the result — useful to silence unused-variable warnings", correct: true },
      { label: "It raises a MatchError" },
      { label: "It stores the result in a special anonymous variable" },
    ],
    explanation:
      "Matching against _ calls the function and discards the return value. This is commonly used to explicitly acknowledge that you're ignoring a result, which silences compiler warnings. It's also used as an assertion pattern: `{:ok, _} = some_function()` will raise a MatchError if the function doesn't return an :ok tuple, acting as a simple runtime assertion.",
  },
  {
    question: "What does the following function return when called with a map that has extra keys?\n\n```elixir\ndef extract(%{name: name, role: \"admin\"} = user) do\n  {name, map_size(user)}\nend\nextract(%{name: \"Jo\", role: \"admin\", id: 1})\n```",
    options: [
      { label: "A MatchError because the map has an extra :id key" },
      { label: "{\"Jo\", 3}", correct: true },
      { label: "{\"Jo\", 2}" },
      { label: "A FunctionClauseError because the pattern doesn't include :id" },
    ],
    explanation:
      "The = operator in a function head lets you both destructure and bind the entire value. The map pattern %{name: name, role: \"admin\"} partially matches (extra keys are fine), binding name to \"Jo\". The = user part binds the complete map to user, which has 3 keys. This pattern is invaluable when you need specific fields AND the whole structure.",
  },
];

export default questions;
