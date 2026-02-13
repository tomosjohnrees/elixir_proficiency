import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
  {
    question: "What does the expression [head | tail] = [] attempt to do, and what is the result?",
    options: [
      { label: "It binds head to nil and tail to []" },
      { label: "It raises a MatchError because an empty list has no head or tail", correct: true },
      { label: "It binds both head and tail to nil" },
      { label: "It binds head to [] and tail to []" },
    ],
    explanation:
      "An empty list cannot be decomposed into a head and tail — there is no first element. The [head | tail] pattern only matches non-empty lists, so attempting this match on [] raises a MatchError. This is an important edge case to handle in recursive functions that process lists.",
  },
  {
    question: "What is the time complexity of the ++ operator in list1 ++ list2?",
    options: [
      { label: "O(1)" },
      { label: "O(length of list1)", correct: true },
      { label: "O(length of list2)" },
      { label: "O(length of list1 + length of list2)" },
    ],
    explanation:
      "The ++ operator must walk the entire left-hand list to build a new chain that points to the right-hand list at the end. The right-hand list is shared as-is. This is why you should put the shorter list on the left when concatenating, and why repeatedly appending to the end of a growing list is an O(n^2) anti-pattern.",
  },
  {
    question: "What does 'hello' (single quotes) represent in Elixir?",
    options: [
      { label: "A binary string, the same as \"hello\"" },
      { label: "A charlist — a list of integer codepoints", correct: true },
      { label: "An atom" },
      { label: "A character literal" },
    ],
    explanation:
      "In Elixir, single-quoted strings are charlists — linked lists of integer codepoints. 'hello' is equivalent to [104, 101, 108, 108, 111]. This is distinct from \"hello\", which is a UTF-8 encoded binary. Charlists exist mainly for interoperability with Erlang, which uses them as its native string type.",
  },
  {
    question: "Given a = [1, 2, 3] and b = [0 | a], how much additional memory does b consume beyond the cons cell for 0?",
    options: [
      { label: "It copies the entire list a, so memory proportional to length of a" },
      { label: "Almost none — b's tail points to the same memory as a", correct: true },
      { label: "It copies half of a due to partial structural sharing" },
      { label: "It depends on the BEAM garbage collector's strategy" },
    ],
    explanation:
      "Because Elixir data is immutable, prepending to a list creates only a single new cons cell that points to the existing list. The original list a is shared in memory, not copied. This is structural sharing in action — it makes prepending O(1) in both time and space, and is the fundamental reason linked lists are the primary sequential data structure in functional languages.",
  },
  {
    question: "What does put_elem({:ok, \"old\"}, 1, \"new\") return, and what happens to the original tuple?",
    options: [
      { label: "Returns {:ok, \"new\"} and mutates the original tuple in place" },
      { label: "Returns {:ok, \"new\"} and the original tuple remains {:ok, \"old\"}", correct: true },
      { label: "Returns {:ok, \"old\", \"new\"} — it appends the new value" },
      { label: "Raises an error because tuples are immutable and cannot be updated" },
    ],
    explanation:
      "put_elem returns a brand new tuple with the specified index updated. The original tuple is completely untouched because all data in Elixir is immutable. Internally, the BEAM must copy the entire tuple to produce the updated version, which is why tuples are best kept small — the copy cost is proportional to tuple_size.",
  },
  {
    question: "What is the result of [1 | 2] in Elixir?",
    options: [
      { label: "The list [1, 2]" },
      { label: "A compile error" },
      { label: "An improper list that is not a valid Elixir list", correct: true },
      { label: "The list [2, 1]" },
    ],
    explanation:
      "When the tail of a cons cell is not a list, the result is an improper list. [1 | 2] creates a cons cell where the head is 1 and the tail is 2 (an integer, not a list). Improper lists break functions like length/1 and Enum operations. A proper list always terminates with an empty list — [1 | [2 | []]] is the same as [1, 2]. Improper lists are rarely used intentionally but are important to understand for debugging.",
  },
  {
    question: "Why would you choose a keyword list over a map for function options in Elixir?",
    options: [
      { label: "Keyword lists are faster for all operations" },
      { label: "Keyword lists preserve insertion order and allow duplicate keys", correct: true },
      { label: "Maps cannot have atom keys" },
      { label: "Keyword lists support pattern matching but maps do not" },
    ],
    explanation:
      "Keyword lists are preferred for function options because they maintain insertion order (which can matter for things like SQL query building or middleware ordering) and allow duplicate keys. They also have syntactic sugar — the brackets can be omitted when they're the last argument to a function. Maps are better when you need fast key lookup on large collections, but for small option lists the convention is keyword lists.",
  },
  {
    question: "What does Keyword.get_values([a: 1, b: 2, a: 3], :a) return?",
    options: [
      { label: "1" },
      { label: "[1, 3]", correct: true },
      { label: "3" },
      { label: "[{:a, 1}, {:a, 3}]" },
    ],
    explanation:
      "Keyword.get_values/2 returns a list of all values associated with the given key, preserving their original order. Since keyword lists allow duplicate keys, this function lets you retrieve all of them, unlike the bracket access syntax opts[:a] which only returns the first match. This is useful when duplicate keys carry meaningful information, such as multiple :where clauses in a query builder.",
  },
  {
    question: "If you need to frequently access the last element of a collection, which data structure is the best fit?",
    options: [
      { label: "A list — use List.last/1" },
      { label: "A tuple — use elem(tuple, tuple_size(tuple) - 1)", correct: true },
      { label: "A keyword list — use Keyword.values/1 and take the last" },
      { label: "All three have identical performance for last-element access" },
    ],
    explanation:
      "Accessing the last element of a tuple is O(1) because tuples are stored contiguously in memory and support constant-time indexed access. For a list, List.last/1 must traverse the entire linked list, making it O(n). If your use case demands frequent last-element access on a dynamic-length collection, consider whether a tuple, a map with integer keys, or Erlang's :array module is a better fit than a list.",
  },
  {
    question: "What happens when you evaluate [65, 66, 67] in IEx?",
    options: [
      { label: "It displays [65, 66, 67]" },
      { label: "It displays ~c\"ABC\" because all elements are valid codepoints", correct: true },
      { label: "It raises an error because integers cannot be in a list" },
      { label: "It displays \"ABC\" as a binary string" },
    ],
    explanation:
      "When IEx encounters a list where every element is a valid codepoint (printable character code), it displays the list as a charlist using the ~c sigil syntax. [65, 66, 67] are the codepoints for 'A', 'B', and 'C'. This is a common source of confusion for newcomers. Adding a non-printable integer like 0 to the list — [65, 66, 67, 0] — would cause IEx to display it as a plain integer list instead.",
  },
];

export default questions;
