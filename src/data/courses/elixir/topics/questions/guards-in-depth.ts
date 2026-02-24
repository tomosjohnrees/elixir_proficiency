import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "Which of the following expressions is allowed inside a guard clause?",
    options: [
      { label: "String.length(name)", },
      { label: "is_binary(name)", correct: true },
      { label: "Enum.count(list)" },
      { label: "Map.get(map, :key)" },
    ],
    explanation:
      "Only a limited set of expressions are allowed in guards. Kernel functions like is_binary/1 are guard-safe, but calls to modules like String, Enum, or Map are not allowed because guards must be free of side effects and guaranteed to terminate.",
  },
  {
    question: "What happens if a guard expression raises an error at runtime?",
    options: [
      { label: "The function clause crashes with that error" },
      { label: "The guard returns false and the next clause is tried", correct: true },
      { label: "The entire function returns nil" },
      { label: "A CompileError is raised" },
    ],
    explanation:
      "Errors in guards are silently caught and treated as the guard returning false. This means the clause simply doesn't match, and Elixir moves on to the next clause. This is a critical behaviour to understand — it can mask bugs if you're not careful.",
  },
  {
    question: "Which keyword is used to add a guard to a function clause?",
    options: [
      { label: "if" },
      { label: "where" },
      { label: "when", correct: true },
      { label: "guard" },
    ],
    explanation:
      "The when keyword introduces a guard clause in Elixir. It comes after the function parameters and before the do block: def foo(x) when is_integer(x), do: x * 2.",
  },
  {
    question: "What does defguard/2 do?",
    options: [
      { label: "Defines a private guard that can only be used in the same module" },
      { label: "Defines a public, reusable custom guard macro", correct: true },
      { label: "Defines a runtime validation function" },
      { label: "Wraps a function so it can be used in guards" },
    ],
    explanation:
      "defguard/2 defines a public macro that can be used as a custom guard in when clauses. It can be imported by other modules. Use defguardp/2 for private guards that stay within the defining module.",
  },
  {
    question: "How do you combine multiple conditions in a single guard clause?",
    options: [
      { label: "Use && and ||" },
      { label: "Use and and or", correct: true },
      { label: "Use , and ;" },
      { label: "Use + and -" },
    ],
    explanation:
      "Inside guard clauses, you use and/or to combine conditions. The short-circuit operators && and || are NOT allowed in guards. You can also use comma (,) as a shorthand for and, and separate when clauses act as or.",
  },
  {
    question: "What is the result of is_map(%User{name: \"José\"}) in a guard?",
    options: [
      { label: "false, because it's a struct, not a map" },
      { label: "true, because structs are maps under the hood", correct: true },
      { label: "A compile error" },
      { label: "It depends on the struct definition" },
    ],
    explanation:
      "Structs in Elixir are maps with a __struct__ key, so is_map/1 returns true for structs. This is a common gotcha! If you need to check for a plain map that isn't a struct, you must also check not is_struct(value) (available since Elixir 1.10+) or check that the value doesn't have a __struct__ key.",
  },
  {
    question: "Which of these is NOT a valid guard-safe comparison operator?",
    options: [
      { label: "==" },
      { label: "===" },
      { label: "!==" },
      { label: "=~", correct: true },
    ],
    explanation:
      "The =~ operator (regex match) is not allowed in guards. Only comparison operators like ==, !=, ===, !==, <, >, <=, and >= are guard-safe. Guards must be side-effect free, and regex matching is too complex for that guarantee.",
  },
  {
    question: "What does the following guard do: def process(x) when x in [1, 2, 3]?",
    options: [
      { label: "Checks membership in a list at runtime" },
      { label: "Expands to x === 1 or x === 2 or x === 3 at compile time", correct: true },
      { label: "Calls Enum.member?/2 at runtime" },
      { label: "Raises a CompileError because in is not allowed in guards" },
    ],
    explanation:
      "The in/2 operator is special in guards — it's expanded at compile time into a series of === comparisons joined with or. The right-hand side must be a literal list or a range. You cannot use a variable list like x in my_list in a guard.",
  },
  {
    question: "Which of these type-check guards does Elixir NOT provide?",
    options: [
      { label: "is_atom/1" },
      { label: "is_binary/1" },
      { label: "is_string/1", correct: true },
      { label: "is_list/1" },
    ],
    explanation:
      "There is no is_string/1 guard in Elixir. Strings are binaries, so you use is_binary/1 to check for strings in guards. This catches many newcomers off guard (pun intended). If you also need to ensure it's valid UTF-8, that check cannot be done in a guard.",
  },
  {
    question: "What is the difference between defguard and defguardp?",
    options: [
      { label: "defguard is for named functions, defguardp is for anonymous functions" },
      { label: "defguard creates a public guard, defguardp creates a private guard", correct: true },
      { label: "defguard is a macro, defguardp is a function" },
      { label: "There is no difference — they are aliases" },
    ],
    explanation:
      "defguard defines a public custom guard macro that can be imported and used by other modules. defguardp defines a private guard macro that can only be used within the module where it's defined. This mirrors the def/defp distinction for functions.",
  },
  {
    question: "Can you use pattern matching inside a guard clause?",
    options: [
      { label: "Yes, you can use = for matching" },
      { label: "Yes, but only with the match?/2 macro" },
      { label: "No, pattern matching is not allowed in guards", correct: true },
      { label: "Yes, but only for simple values like atoms and integers" },
    ],
    explanation:
      "Pattern matching with = is not allowed inside guard expressions. Pattern matching happens in the function head (the parameters), and guards provide additional constraints beyond what patterns can express. If you need to match on a value, do it in the function parameters, then refine with a guard.",
  },
  {
    question: "What is the correct way to guard that a number is between 1 and 100 (inclusive)?",
    options: [
      { label: "when n in 1..100", correct: true },
      { label: "when n >= 1 && n <= 100" },
      { label: "when Enum.member?(1..100, n)" },
      { label: "when between(n, 1, 100)" },
    ],
    explanation:
      "The in operator works with ranges in guards and is expanded at compile time. The && operator is not allowed in guards (use and instead). Enum.member?/2 is not guard-safe. There is no built-in between/3 guard, though you could define one with defguard.",
  },
  {
    question: "Which arithmetic operations are allowed in guards?",
    options: [
      { label: "Only + and -" },
      { label: "+, -, *, and /", correct: true },
      { label: "None — arithmetic is not allowed in guards" },
      { label: "Only integer operations, not float operations" },
    ],
    explanation:
      "The basic arithmetic operators +, -, *, and / are all allowed in guards, along with div/2, rem/2, and abs/1. This lets you write guards like when rem(n, 2) == 0 to check for even numbers.",
  },
  {
    question: "What happens with this code: def foo(x) when is_integer(x) when is_float(x)?",
    options: [
      { label: "It raises a CompileError" },
      { label: "Only the first guard is evaluated" },
      { label: "Both guards are combined with OR — matches integers or floats", correct: true },
      { label: "Both guards are combined with AND — never matches" },
    ],
    explanation:
      "Multiple when clauses on the same function head are combined with OR logic. So when is_integer(x) when is_float(x) matches if x is either an integer OR a float. This is equivalent to when is_integer(x) or is_float(x), and is also equivalent to using is_number(x).",
  },
  {
    question: "Which of these can you use in a guard to check the length of a list?",
    options: [
      { label: "Enum.count(list)" },
      { label: "Kernel.length(list)", correct: true },
      { label: "List.length(list)" },
      { label: "list.length" },
    ],
    explanation:
      "The Kernel.length/1 function (usually called as just length/1) is guard-safe. It computes the length of a list and can be used in guards. Enum.count/1 and List functions are not guard-safe. There is no .length property syntax in Elixir.",
  },
  {
    question: "Why are only certain expressions allowed in guards?",
    options: [
      { label: "To make the compiler simpler" },
      { label: "Guards must be side-effect free and guaranteed to terminate", correct: true },
      { label: "It's an arbitrary limitation inherited from Erlang" },
      { label: "Because guards run in a separate process" },
    ],
    explanation:
      "Guards must be pure, side-effect free, and guaranteed to terminate. This is because the BEAM evaluates guards during pattern matching, and a guard that hangs, crashes, or has side effects would break the reliability of function dispatch. This restriction is inherited from Erlang and is fundamental to the BEAM's design.",
  },
  {
    question: "What does map_size/1 do in a guard, and is it guard-safe?",
    options: [
      { label: "Returns the number of keys in a map, and yes it's guard-safe", correct: true },
      { label: "Returns the byte size of a map, and yes it's guard-safe" },
      { label: "Returns the number of keys, but it's NOT guard-safe" },
      { label: "It doesn't exist — use Map.size/1 instead" },
    ],
    explanation:
      "map_size/1 is a guard-safe function that returns the number of key-value pairs in a map. Similarly, tuple_size/1 returns the number of elements in a tuple. Both are useful for writing size-based guards like when map_size(config) > 0.",
  },
  {
    question: "What is the output of the following?\n\ndefmodule Example do\n  def check(x) when is_integer(x) and x > 0, do: :positive\n  def check(x) when is_integer(x), do: :non_positive\n  def check(_), do: :not_integer\nend\n\nExample.check(0)",
    options: [
      { label: ":positive" },
      { label: ":non_positive", correct: true },
      { label: ":not_integer" },
      { label: "A FunctionClauseError" },
    ],
    explanation:
      "The value 0 is an integer, so is_integer(0) is true. But 0 > 0 is false, so the first clause doesn't match. The second clause matches because is_integer(0) is true (with no additional constraint). So it returns :non_positive. Clause ordering matters — Elixir tries them top to bottom.",
  },
  {
    question: "Can you call a user-defined function inside a guard?",
    options: [
      { label: "Yes, any function can be used in a guard" },
      { label: "Yes, but only if the function is marked as @guard true" },
      { label: "No, only macros defined with defguard/defguardp and built-in guard expressions", correct: true },
      { label: "Yes, but only zero-arity functions" },
    ],
    explanation:
      "You cannot call regular user-defined functions in guards. Only expressions from a fixed set of allowed operators, type checks, and built-in guard functions are permitted. Custom guard logic must be defined using defguard/2 or defguardp/2, which create macros that expand inline at compile time.",
  },
  {
    question: "Which of the following correctly uses a guard with an anonymous function?",
    options: [
      { label: "fn x when is_integer(x) -> x * 2 end", correct: true },
      { label: "fn x if is_integer(x) -> x * 2 end" },
      { label: "fn (x) -> when is_integer(x), x * 2 end" },
      { label: "Guards cannot be used with anonymous functions" },
    ],
    explanation:
      "Guards work with anonymous functions using the same when syntax: fn x when is_integer(x) -> x * 2 end. This is useful with higher-order functions like Enum.map or in case/receive clauses. The guard goes between the parameters and the -> arrow.",
  },
];

export default questions;
