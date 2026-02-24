import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What makes greet/1 and greet/2 different functions in Elixir?",
    options: [
      { label: "They have different return types" },
      { label: "They have different arities (number of arguments)", correct: true },
      { label: "They must be in different modules" },
      { label: "greet/2 is an overload of greet/1" },
    ],
    explanation:
      "In Elixir, a function is uniquely identified by its name AND arity. greet/1 and greet/2 are completely separate functions, not overloads. This is why the /1 and /2 notation exists — it's fundamental to the language.",
  },
  {
    question: "How do you call an anonymous function stored in a variable `f`?",
    options: [
      { label: "f(args)" },
      { label: "f.(args)", correct: true },
      { label: "call(f, args)" },
      { label: "apply f, args" },
    ],
    explanation:
      "Anonymous functions require a dot before the parentheses: f.(args). This distinguishes calling an anonymous function from calling a named function. Without the dot, Elixir would look for a named function called f.",
  },
  {
    question: "What does `&String.upcase/1` return?",
    options: [
      { label: "The string \"UPCASE\"" },
      { label: "A reference to the String module" },
      { label: "An anonymous function that calls String.upcase", correct: true },
      { label: "An error — you can't capture built-in functions" },
    ],
    explanation:
      "The capture operator & with a named function reference (Module.function/arity) creates an anonymous function that wraps the named function. It's equivalent to fn s -> String.upcase(s) end.",
  },
  {
    question: "What happens when you call a `defp` function from outside its module?",
    options: [
      { label: "It works but logs a warning" },
      { label: "It returns nil" },
      { label: "It raises an UndefinedFunctionError", correct: true },
      { label: "It raises a PrivateFunctionError" },
    ],
    explanation:
      "Private functions (defp) are only visible within their defining module. From the outside, they don't exist at all — Elixir raises UndefinedFunctionError, not a special \"private\" error. This is because the function truly isn't exported from the module.",
  },
  {
    question: "What does `import Enum, only: [map: 2]` do?",
    options: [
      { label: "Imports the entire Enum module but renames map" },
      { label: "Imports only Enum.map/2 into the current scope", correct: true },
      { label: "Creates an alias for Enum called map" },
      { label: "Imports Enum.map with a maximum of 2 arguments" },
    ],
    explanation:
      "import with only: brings specific functions into scope. [map: 2] means \"import the map function with arity 2\". The keyword list syntax uses the function name as key and arity as value. After this, you can call map(list, fn) without the Enum prefix.",
  },
  {
    question: "What is the result of `&(&1 <> \" world\")`?",
    options: [
      { label: "A syntax error — the capture operator doesn't work with <>" },
      { label: "The string \" world\"" },
      { label: "An anonymous function that appends \" world\" to its argument", correct: true },
      { label: "A reference to the Kernel.<>/2 function" },
    ],
    explanation:
      "The capture operator & with &1 creates an anonymous function. &(&1 <> \" world\") is equivalent to fn x -> x <> \" world\" end. The &1 placeholder represents the first argument, and the entire expression becomes the function body.",
  },
  {
    question: "What happens when you define `def greet(name, greeting \\\\ \"Hi\")` in a module that already has `def greet(name)` defined above it?",
    options: [
      { label: "It works fine — Elixir merges the two definitions" },
      { label: "A compile-time error because the default argument creates a conflicting greet/1 clause", correct: true },
      { label: "The second definition silently overwrites the first" },
      { label: "A runtime error when greet/1 is called" },
    ],
    explanation:
      "Default arguments generate additional function heads at compile time. def greet(name, greeting \\\\ \"Hi\") implicitly creates a greet/1 that delegates to greet/2. If you already defined greet/1 explicitly, Elixir raises a compile error about conflicting definitions for greet/1.",
  },
  {
    question: "Which of the following correctly captures the `Enum.map/2` function as an anonymous function?",
    options: [
      { label: "&Enum.map/2", correct: true },
      { label: "&Enum.map(2)" },
      { label: "fn -> Enum.map end" },
      { label: "&(Enum.map/2)" },
    ],
    explanation:
      "The syntax for capturing a named function is &Module.function/arity with no parentheses around the expression. &Enum.map/2 returns an anonymous function equivalent to fn list, f -> Enum.map(list, f) end. The /2 specifies the arity, not a division operation.",
  },
  {
    question: "What does `use MyModule` actually do under the hood?",
    options: [
      { label: "It copies all functions from MyModule into the current module" },
      { label: "It calls require MyModule followed by MyModule.__using__/1", correct: true },
      { label: "It creates an alias for MyModule" },
      { label: "It imports all public functions from MyModule" },
    ],
    explanation:
      "use is a macro that first requires the target module (ensuring its macros are available), then invokes its __using__/1 callback with the current module's context. This callback typically injects code via quote blocks. It's fundamentally different from import or alias — it runs arbitrary compile-time code.",
  },
  {
    question: "Given these clauses in order:\n```\ndef process(:ok, result), do: result\ndef process(status, _result) when status in [:ok, :error], do: status\n```\nWhat does `process(:ok, 42)` return?",
    options: [
      { label: "42", correct: true },
      { label: ":ok" },
      { label: "An error because the clauses overlap" },
      { label: "{:ok, 42}" },
    ],
    explanation:
      "Elixir evaluates clauses top-to-bottom and uses the first one that matches. The first clause matches :ok as the first argument, so it returns result (42). The second clause also would match, but it's never reached. Elixir may emit a warning about the unreachable portion, but it compiles and runs fine.",
  },
  {
    question: "What is the value of `is_function(fn -> nil end, 1)`?",
    options: [
      { label: "true" },
      { label: "false", correct: true },
      { label: "An error — is_function only takes one argument" },
      { label: "nil" },
    ],
    explanation:
      "is_function/2 checks both that the value is a function AND that it has the specified arity. fn -> nil end takes zero arguments (arity 0), so is_function(fn -> nil end, 1) returns false because the arity doesn't match. This is a subtle but important distinction — is_function/1 would return true, but the two-argument version also verifies arity.",
  },
  {
    question: "Which statement about module attributes (@) in Elixir is TRUE?",
    options: [
      { label: "They can be modified at runtime using Module.put_attribute/3" },
      { label: "They are evaluated at compile time and inlined wherever used", correct: true },
      { label: "They behave like instance variables in object-oriented languages" },
      { label: "They are only used for documentation (@doc, @moduledoc)" },
    ],
    explanation:
      "Module attributes are resolved at compile time. When you write @my_attr in a function body, the compiler replaces it with the attribute's current value at that point during compilation. They can be used for constants, documentation, and as temporary compile-time storage, but they don't exist as mutable state at runtime.",
  },
  {
    question: "What happens if you write `&1 + &2` without the leading `&`?",
    options: [
      { label: "It works the same — the leading & is optional" },
      { label: "A compile error — &1 and &2 are only valid inside a & capture expression", correct: true },
      { label: "It creates two separate anonymous functions" },
      { label: "It adds 1 + 2 and returns 3" },
    ],
    explanation:
      "The placeholders &1, &2, etc. are only valid inside a capture expression created with the & operator. Without the enclosing &(...), using &1 or &2 on their own is a compile error. The correct syntax is &(&1 + &2) which is shorthand for fn a, b -> a + b end.",
  },
  {
    question: "What does `alias MyApp.{Accounts, Orders, Payments}` expand to?",
    options: [
      { label: "An alias for just MyApp that gives access to its children" },
      { label: "Three separate aliases: alias MyApp.Accounts, alias MyApp.Orders, alias MyApp.Payments", correct: true },
      { label: "An import of all functions from those three modules" },
      { label: "A syntax error — you can't use curly braces with alias" },
    ],
    explanation:
      "Elixir supports multi-alias syntax using curly braces. alias MyApp.{Accounts, Orders, Payments} is syntactic sugar that expands into three individual alias directives. After this, you can use Accounts, Orders, and Payments without the MyApp prefix. This keeps code concise when aliasing several sibling modules.",
  },
  {
    question: "What is the key difference between `def` clauses and anonymous function clauses in terms of arity?",
    options: [
      { label: "Anonymous function clauses can have different arities; def clauses cannot" },
      { label: "def clauses can have different arities; anonymous function clauses cannot" },
      { label: "All clauses of an anonymous function must have the same arity; def clauses with different arities are separate functions", correct: true },
      { label: "There is no difference — both require matching arities across clauses" },
    ],
    explanation:
      "Every clause of an anonymous function must accept the same number of arguments — fn 1 -> :one; a, b -> :two end is a compile error. With named functions, different arities create entirely different functions (greet/1 vs greet/2), each with their own set of clauses. This distinction trips up many developers coming from other languages.",
  },
  {
    question: "What is the difference between `require`, `import`, `alias`, and `use`?",
    options: [
      { label: "They are interchangeable — all bring module functions into scope" },
      { label: "alias creates a shorthand; import brings functions into scope; require makes macros available; use invokes __using__/1 to inject code", correct: true },
      { label: "alias and import are the same; require and use are the same" },
      { label: "require is for Erlang modules; import is for Elixir modules; alias is for local modules; use is for libraries" },
    ],
    explanation:
      "Each directive serves a distinct purpose: `alias MyApp.Users` lets you write Users instead of the full name. `import Enum, only: [map: 2]` brings map/2 into local scope so you can call it without Enum prefix. `require Logger` ensures Logger is compiled first so its macros are available. `use GenServer` calls GenServer.__using__/1 to inject boilerplate code via macros. They're not interchangeable — each solves a different problem.",
  },
  {
    question: "What happens if function clauses are defined in the wrong order?\n\n```elixir\ndef process(list) when is_list(list), do: :list\ndef process([]), do: :empty\n```",
    options: [
      { label: "Both clauses work correctly — order doesn't matter" },
      { label: "The second clause is unreachable because the first clause matches all lists, including []", correct: true },
      { label: "A compile error is raised due to overlapping patterns" },
      { label: "The second clause takes priority because it's more specific" },
    ],
    explanation:
      "Elixir evaluates function clauses top-to-bottom and picks the first match. Since `is_list([])` returns true, the first clause matches empty lists before the second clause is ever tried. The compiler warns about the unreachable clause. The fix is to put the more specific clause first: define process([]) before process(list) when is_list(list). Clause ordering is critical in Elixir — always go from most specific to most general.",
  },
  {
    question: "What does `defguard` do?",
    options: [
      { label: "It defines a function that can only be called inside guard clauses" },
      { label: "It defines a custom guard macro that can be used in when clauses, composed from existing guard-safe expressions", correct: true },
      { label: "It makes any function safe to use in guards by wrapping it automatically" },
      { label: "It defines a module-level validation that runs at compile time" },
    ],
    explanation:
      "defguard creates a named macro that can be used in guard positions (after when). The body must only use guard-safe expressions. For example: `defguard is_positive(x) when is_number(x) and x > 0` lets you write `def process(x) when is_positive(x)`. This promotes code reuse in guards and makes guard conditions more readable. The macro is expanded at compile time into its constituent guard expressions.",
  },
];

export default questions;
