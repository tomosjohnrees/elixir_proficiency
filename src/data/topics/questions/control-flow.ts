import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What happens when no clause matches in a case expression?",
    options: [
      { label: "It returns nil" },
      { label: "It raises a CaseClauseError", correct: true },
      { label: "It returns :error" },
      { label: "It silently does nothing" },
    ],
    explanation:
      "When no clause matches in case, Elixir raises a CaseClauseError. This is why it's good practice to include a catch-all _ clause when the set of possible values isn't exhaustive.",
  },
  {
    question: "What is the conventional catch-all clause in a cond expression?",
    options: [
      { label: "_ -> default" },
      { label: "else -> default" },
      { label: "true -> default", correct: true },
      { label: ":default -> default" },
    ],
    explanation:
      "cond evaluates boolean conditions, not patterns. Since true is always truthy, placing true -> ... as the last clause acts as a catch-all default. Using _ would be a syntax error in cond because it expects expressions, not patterns.",
  },
  {
    question: "What does `if false, do: \"yes\"` return (no else clause)?",
    options: [
      { label: "\"yes\"" },
      { label: "false" },
      { label: "nil", correct: true },
      { label: "It raises an error" },
    ],
    explanation:
      "In Elixir, if is an expression that must return a value. When the condition is falsy and there's no else branch, it returns nil.",
  },
  {
    question: "In a `with` expression, what happens when a `<-` clause fails to match?",
    options: [
      { label: "It raises a MatchError" },
      { label: "It returns nil" },
      { label: "It continues to the next clause" },
      { label: "It returns the non-matching value (or goes to else)", correct: true },
    ],
    explanation:
      "Unlike the = match operator, the <- in with doesn't raise on a failed match. Instead, the non-matching value is returned directly, or if there's an else block, it's matched there. This is what makes with great for happy-path chaining.",
  },
  {
    question: "Which is the most idiomatic way to handle a {:ok, value} / {:error, reason} result in Elixir?",
    options: [
      { label: "if result == {:ok, value}" },
      { label: "case result do {:ok, v} -> ... end", correct: true },
      { label: "cond do result == :ok -> ... end" },
      { label: "try do result rescue _ -> ... end" },
    ],
    explanation:
      "Pattern matching with case is the idiomatic way to handle tagged tuples like {:ok, value} and {:error, reason}. It's more expressive than equality checks and lets you destructure the value in the same step.",
  },
  {
    question: "Which values are considered falsy in Elixir?",
    options: [
      { label: "nil, false, 0, and \"\"" },
      { label: "nil and false only", correct: true },
      { label: "nil, false, 0, [], and \"\"" },
      { label: "false only" },
    ],
    explanation:
      "Elixir has a very short falsy list: only nil and false. Everything else — including 0, empty strings, empty lists, and empty maps — is truthy. This is simpler than many other languages and catches people coming from JavaScript or Python off guard.",
  },
  {
    question: "What does the following return?\n```\nwith {:ok, a} <- {:ok, 1},\n     {:ok, b} <- {:error, :nope},\n     {:ok, c} <- {:ok, 3} do\n  a + b + c\nend\n```",
    options: [
      { label: "6" },
      { label: "nil" },
      { label: "{:error, :nope}", correct: true },
      { label: "It raises a MatchError" },
    ],
    explanation:
      "When a <- clause in with fails to match, the non-matching value is returned immediately and no further clauses are evaluated. Here {:error, :nope} doesn't match {:ok, b}, so {:error, :nope} is returned as-is. The third clause and the do block are never reached.",
  },
  {
    question: "What does `if 0, do: \"truthy\", else: \"falsy\"` return?",
    options: [
      { label: "\"falsy\"" },
      { label: "\"truthy\"", correct: true },
      { label: "0" },
      { label: "It raises an ArgumentError" },
    ],
    explanation:
      "Since only nil and false are falsy in Elixir, the integer 0 is truthy. This trips up developers coming from C, JavaScript, or Python where 0 is falsy. The expression evaluates to \"truthy\".",
  },
  {
    question: "Which of these CANNOT be used in a guard clause?",
    options: [
      { label: "is_integer(x) and x > 0" },
      { label: "is_binary(name) and byte_size(name) > 0" },
      { label: "String.starts_with?(name, \"admin\")", correct: true },
      { label: "x in [:a, :b, :c]" },
    ],
    explanation:
      "Guard clauses only allow a limited set of expressions — type checks, comparison operators, arithmetic, and a few built-in functions. General-purpose functions like String.starts_with?/2 cannot be used in guards because they might have side effects or raise exceptions. The in operator is allowed because it's expanded at compile time.",
  },
  {
    question: "What is the result of this expression?\n```\ncase :ok do\n  x when is_atom(x) -> \"atom: #{x}\"\n  :ok -> \"literal ok\"\nend\n```",
    options: [
      { label: "\"literal ok\"" },
      { label: "\"atom: ok\"", correct: true },
      { label: "It raises a CaseClauseError" },
      { label: "It raises a CompileError due to unreachable clause" },
    ],
    explanation:
      "Clauses in case are evaluated top to bottom, and the first match wins. The pattern x when is_atom(x) matches any atom, so it matches :ok before the literal :ok clause is ever reached. The Elixir compiler will emit a warning about the unreachable second clause, but it compiles and runs fine.",
  },
  {
    question: "What happens with a `with` expression that has an `else` block when the non-matching value doesn't match any else clause?",
    options: [
      { label: "It returns nil" },
      { label: "It returns the non-matching value as-is" },
      { label: "It raises a WithClauseError", correct: true },
      { label: "It falls through to the next function clause" },
    ],
    explanation:
      "When a with has an else block, all non-matching values must be handled by one of the else clauses. If none of them match, Elixir raises a WithClauseError. This is an important distinction from with without else, where unmatched values simply pass through.",
  },
  {
    question: "Which is the correct way to use the pin operator inside a case clause?",
    options: [
      { label: "case x do ^y -> \"matched\" end", correct: true },
      { label: "case x do pin(y) -> \"matched\" end" },
      { label: "case x do y! -> \"matched\" end" },
      { label: "case x do =y -> \"matched\" end" },
    ],
    explanation:
      "The pin operator ^ is used to match against the existing value of a variable rather than rebinding it. Inside a case clause, ^y means \"match if the value equals what y currently holds.\" This is essential when you want to compare against a known value stored in a variable rather than creating a new binding.",
  },
  {
    question: "What does this code return?\n```\ncond do\n  nil -> \"nil branch\"\n  false -> \"false branch\"\n  0 -> \"zero branch\"\nend\n```",
    options: [
      { label: "\"nil branch\"" },
      { label: "\"false branch\"" },
      { label: "\"zero branch\"", correct: true },
      { label: "It raises a CondClauseError" },
    ],
    explanation:
      "cond evaluates each condition for truthiness. nil is falsy, so it's skipped. false is falsy, so it's skipped. 0 is truthy in Elixir (only nil and false are falsy), so \"zero branch\" is returned. This question tests your understanding of Elixir's truthiness rules in the context of cond.",
  },
  {
    question: "What does the following with expression return?\n```\nwith {:ok, a} <- {:ok, 1},\n     b = a + 10,\n     {:ok, c} <- {:ok, b * 2} do\n  c\nend\n```",
    options: [
      { label: "It raises a CompileError because = is not allowed in with" },
      { label: "1" },
      { label: "22", correct: true },
      { label: "{:ok, 22}" },
    ],
    explanation:
      "The with expression allows bare = matches alongside <- clauses. The = performs a regular match (which always succeeds for a simple variable binding). Here a is bound to 1, b is bound to 11 (1 + 10), and c is bound to 22 (11 * 2). The do block returns c, which is 22.",
  },
  {
    question: "How do multi-clause functions relate to control flow in Elixir?",
    options: [
      { label: "They are unrelated — functions and control flow are separate concepts" },
      { label: "Multi-clause functions replace the need for case, cond, and if entirely" },
      { label: "They use pattern matching and guards in function heads to branch logic, often replacing explicit control flow constructs", correct: true },
      { label: "They are syntactic sugar that compiles down to a single case expression internally" },
    ],
    explanation:
      "In idiomatic Elixir, multi-clause functions with pattern matching and guards in the function heads are a primary control flow mechanism. Instead of writing a single function body with case or cond, you define multiple clauses that each handle a specific shape of input. This approach is often preferred because it separates concerns at the function-head level and integrates naturally with Elixir's \"let it crash\" philosophy.",
  },
];

export default questions;
