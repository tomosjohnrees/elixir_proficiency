import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does quote do?",
    options: [
      { label: "Evaluates an expression and returns the result" },
      { label: "Converts code into its AST representation without evaluating it", correct: true },
      { label: "Creates a string from code" },
      { label: "Wraps code in a try/rescue block" },
    ],
    explanation:
      "quote takes Elixir code and returns its AST representation — nested three-element tuples — without evaluating anything. This lets you treat code as data that macros can inspect and transform.",
  },
  {
    question: "What does a macro receive as arguments?",
    options: [
      { label: "Evaluated values, just like a function" },
      { label: "The AST (quoted form) of the arguments, not their values", correct: true },
      { label: "Strings of the source code" },
      { label: "Binary-encoded bytecode" },
    ],
    explanation:
      "Unlike functions, macros receive the AST of their arguments. If you call my_macro(1 + 2), the macro gets {:+, [], [1, 2]} — the structure of the expression — not the value 3. This is what gives macros their power to transform code.",
  },
  {
    question: "What is macro hygiene?",
    options: [
      { label: "A tool that formats macro code" },
      { label: "Variables in macros don't leak into or conflict with the caller's scope", correct: true },
      { label: "A way to prevent macros from being called recursively" },
      { label: "Automatic memory cleanup after macro expansion" },
    ],
    explanation:
      "Hygienic macros automatically rename internal variables to avoid conflicts with the caller's code. A variable named result inside a macro won't overwrite a result variable in the calling module. Use var!/1 to intentionally break hygiene when needed.",
  },
  {
    question: "When should you use a macro instead of a function?",
    options: [
      { label: "Whenever you want better performance" },
      { label: "When you need compile-time code transformation that functions can't achieve", correct: true },
      { label: "Whenever you need to accept more than 3 arguments" },
      { label: "Always — macros are more powerful than functions" },
    ],
    explanation:
      "Macros should be a last resort, not a first choice. Use them only when you genuinely need compile-time code generation — like DSLs, eliminating boilerplate, or accessing compile-time information. Functions are simpler to understand, test, and debug.",
  },
  {
    question: "What does use MyModule actually do?",
    options: [
      { label: "Imports all functions from MyModule" },
      { label: "Creates an alias for MyModule" },
      { label: "Calls MyModule.__using__/1 which injects code via a macro", correct: true },
      { label: "Inherits from MyModule like a class" },
    ],
    explanation:
      "use MyModule is roughly equivalent to calling MyModule.__using__(opts) and injecting the returned AST into the current module. It's a macro-powered mechanism, not inheritance. Each use call can inject different code depending on options.",
  },
  {
    question: "What is the AST representation of the variable `x` when you run `quote do: x`?",
    options: [
      { label: ":x" },
      { label: "{:x, [], Elixir}", correct: true },
      { label: "{:var, [], [:x]}" },
      { label: "\"x\"" },
    ],
    explanation:
      "Variables in the AST follow the standard three-element tuple format: {:x, [], Elixir}. The first element is the variable name as an atom, the second is metadata (here an empty list), and the third is the context (the module where the variable was quoted, defaulting to Elixir).",
  },
  {
    question: "What does `unquote_splicing` do that `unquote` does not?",
    options: [
      { label: "It evaluates the expression at compile time instead of runtime" },
      { label: "It expands a list inline into the surrounding AST rather than inserting it as a single element", correct: true },
      { label: "It allows unquoting outside of a quote block" },
      { label: "It unquotes multiple variables at once by name" },
    ],
    explanation:
      "unquote_splicing takes a list and splices its elements into the surrounding AST. For example, with args = [1, 2, 3], `quote do: foo(unquote_splicing(args))` produces {:foo, [], [1, 2, 3]} instead of {:foo, [], [[1, 2, 3]]} which is what plain unquote would give you.",
  },
  {
    question: "Why must you `require` a module before using its macros?",
    options: [
      { label: "require loads the module's BEAM file into memory at runtime" },
      { label: "Macros are expanded at compile time, so the macro module must be compiled and available before the calling module is compiled", correct: true },
      { label: "require is just a convention — macros work without it but print a warning" },
      { label: "require enables pattern matching on the macro's return value" },
    ],
    explanation:
      "Since macros are expanded during compilation, the module containing the macro must already be compiled when the calling module is being compiled. require ensures this ordering. Without it, the compiler would not have the macro definition available to perform the expansion.",
  },
  {
    question: "What does `var!` do inside a macro's quote block?",
    options: [
      { label: "It raises an error if the variable is undefined" },
      { label: "It overrides macro hygiene, allowing the macro to read or write a variable in the caller's scope", correct: true },
      { label: "It marks a variable as immutable" },
      { label: "It converts a variable into its AST representation" },
    ],
    explanation:
      "var!/1 deliberately breaks macro hygiene by generating a variable reference in the caller's context rather than the macro's context. This means the macro can inject or access variables in the scope where it's called, which is sometimes necessary but should be used sparingly because it makes macro behavior harder to reason about.",
  },
  {
    question: "What is the result of `quote do: 42`?",
    options: [
      { label: "{:integer, [], [42]}" },
      { label: "{42, [], Elixir}" },
      { label: "42", correct: true },
      { label: "{:__block__, [], [42]}" },
    ],
    explanation:
      "Atoms, numbers, strings, lists, two-element tuples, and binaries are literals that represent themselves in the AST — they are their own quoted form. So `quote do: 42` simply returns 42, not a three-element tuple. This is a deliberate design choice that keeps the AST compact for simple values.",
  },
  {
    question: "In which order does macro expansion happen when macros are nested, like `outer(inner(x))`?",
    options: [
      { label: "Inner macros are expanded first, then outer macros" },
      { label: "Outer macros are expanded first; the inner macro call is received as AST and expanded after the outer macro returns", correct: true },
      { label: "Both macros are expanded simultaneously in parallel" },
      { label: "The order is random and depends on the compiler" },
    ],
    explanation:
      "The outer macro is expanded first. It receives the inner macro call as unexpanded AST (e.g., {:inner, [], [{:x, [], Elixir}]}). The compiler then walks the AST returned by the outer macro and expands any remaining macro calls, including the inner one. This outside-in expansion is important to understand when composing macros.",
  },
  {
    question: "What does `__CALLER__` give you access to inside a macro?",
    options: [
      { label: "The PID of the process that invoked the macro" },
      { label: "The Macro.Env struct of the call site, containing the caller's module, function, file, line, and other compile-time context", correct: true },
      { label: "The name of the function that called the macro" },
      { label: "The stack trace at the point where the macro is used" },
    ],
    explanation:
      "__CALLER__ is available inside defmacro and returns a Macro.Env struct representing the compile-time environment of the code that called the macro. This includes the caller's module (__CALLER__.module), the current function (__CALLER__.function), file, line number, and more. It lets macros make decisions based on where and how they are being used.",
  },
  {
    question: "Which of the following is NOT a valid reason to use a macro instead of a function?",
    options: [
      { label: "You need to generate multiple function clauses at compile time" },
      { label: "You want to save a few characters of typing at the call site", correct: true },
      { label: "You need to inspect the structure of code passed as an argument" },
      { label: "You need to access compile-time information like __MODULE__ from the caller" },
    ],
    explanation:
      "Saving keystrokes is not a valid reason to reach for macros. Macros add compilation complexity, make debugging harder, and produce less transparent stack traces. They should only be used when compile-time code transformation is genuinely required — like generating function clauses, building DSLs, or accessing compile-time context that functions cannot see.",
  },
  {
    question: "What happens if a macro returns a plain value like the integer 5 instead of a quoted AST?",
    options: [
      { label: "The compiler raises an error because macros must return AST" },
      { label: "It works fine — literals like numbers, atoms, and strings are valid AST nodes that represent themselves", correct: true },
      { label: "The value is automatically wrapped in a quote block by the compiler" },
      { label: "The value 5 is interpreted as a line number reference" },
    ],
    explanation:
      "Since literals (numbers, atoms, strings, lists, two-element tuples, and binaries) are their own AST representation, a macro can return them directly. Returning 5 from a macro is the same as returning `quote do: 5`. The compiler inserts the literal at the call site. However, returning non-literal values like a three-element tuple that isn't valid AST would cause unexpected behavior.",
  },
  {
    question: "What does `Macro.expand_once/2` do, and how does it differ from `Macro.expand/2`?",
    options: [
      { label: "expand_once expands all macros recursively; expand only does the first level" },
      { label: "expand_once performs a single expansion step, while expand repeatedly expands until no macro calls remain", correct: true },
      { label: "expand_once works at compile time while expand works at runtime" },
      { label: "There is no difference — they are aliases for the same function" },
    ],
    explanation:
      "Macro.expand_once/2 performs exactly one macro expansion step on the given AST, which is useful for debugging macros one step at a time. Macro.expand/2 repeatedly expands until the result is no longer a macro call. Both require a Macro.Env (typically __ENV__) as the second argument to resolve macro definitions in the correct context.",
  },
];

export default questions;
