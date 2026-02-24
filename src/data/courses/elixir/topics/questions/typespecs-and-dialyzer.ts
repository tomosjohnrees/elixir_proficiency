import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What is the correct syntax for a typespec on a function that takes a string and returns an integer?",
    options: [
      { label: "@spec parse(string) :: integer", correct: true },
      { label: "@type parse(string) :: integer" },
      { label: "@spec parse(String.t()) -> integer()" },
      { label: "@callback parse(string) :: integer" },
    ],
    explanation:
      "@spec is the attribute for function typespecs. It uses the function name, argument types in parentheses, and :: to separate the return type. @type defines custom types, and @callback defines behaviour callbacks.",
  },
  {
    question: "What does the type `String.t()` represent in a typespec?",
    options: [
      { label: "A charlist" },
      { label: "A UTF-8 encoded binary (Elixir string)", correct: true },
      { label: "Any binary data" },
      { label: "An atom" },
    ],
    explanation:
      "String.t() is the type for Elixir strings, which are UTF-8 encoded binaries. It's more specific than binary(), which represents any binary data. Charlists have the type charlist() or list(char()).",
  },
  {
    question: "Which attribute is used to define a custom type in Elixir?",
    options: [
      { label: "@spec" },
      { label: "@type", correct: true },
      { label: "@typedef" },
      { label: "@define_type" },
    ],
    explanation:
      "@type defines a public custom type that can be referenced from other modules. You can also use @typep for private types (only visible within the module) and @opaque for types whose internal structure should be hidden from external modules.",
  },
  {
    question: "What is Dialyzer?",
    options: [
      { label: "A code formatter for Elixir" },
      { label: "A static analysis tool that finds type inconsistencies and unreachable code", correct: true },
      { label: "A runtime type checker that raises errors on type mismatches" },
      { label: "A dependency manager for Elixir projects" },
    ],
    explanation:
      "Dialyzer (DIscrepancy AnalYZer for ERlang) is a static analysis tool. It analyzes compiled BEAM bytecode to find type inconsistencies, unreachable code, and other issues — all without running your code. It does NOT check types at runtime.",
  },
  {
    question: "What is the difference between @type and @opaque?",
    options: [
      { label: "@opaque types cannot be pattern matched at all" },
      { label: "@opaque hides the internal structure from other modules, while @type exposes it", correct: true },
      { label: "@opaque types are checked at runtime, @type types are not" },
      { label: "There is no difference — they are aliases" },
    ],
    explanation:
      "@opaque defines a type whose internal structure is hidden from external modules. Other modules can use the type in specs but Dialyzer will warn if they depend on its internal representation. @type makes the full structure visible. This is useful for encapsulation.",
  },
  {
    question: "What does the | operator mean in a typespec like `integer() | :error`?",
    options: [
      { label: "The value is both an integer and :error at the same time" },
      { label: "The value is a union — it can be either an integer or the atom :error", correct: true },
      { label: "The pipe operator transforms integer to :error" },
      { label: "It performs a bitwise OR on the types" },
    ],
    explanation:
      "The | in typespecs creates a union type, meaning the value can be any of the listed types. This is commonly used for functions that return {:ok, value} | {:error, reason} patterns.",
  },
  {
    question: "How do you run Dialyzer in a Mix project?",
    options: [
      { label: "mix dialyzer (with the Dialyxir dependency)", correct: true },
      { label: "mix check --types" },
      { label: "mix compile --dialyzer" },
      { label: "dialyzer is built into mix and runs automatically" },
    ],
    explanation:
      "Dialyzer is typically run via the Dialyxir library, which provides the mix dialyzer task. You add {:dialyxir, \"~> 1.0\", only: [:dev], runtime: false} to your mix.exs deps. Raw Dialyzer can be called directly, but Dialyxir makes it much more convenient.",
  },
  {
    question: "What is a PLT in the context of Dialyzer?",
    options: [
      { label: "A programming language type definition file" },
      { label: "A Persistent Lookup Table that caches type information for faster analysis", correct: true },
      { label: "A project-level type configuration" },
      { label: "A protocol lookup tree used by the BEAM" },
    ],
    explanation:
      "PLT stands for Persistent Lookup Table. Dialyzer builds a PLT containing type information for the Erlang/Elixir standard libraries and your project's dependencies. This avoids re-analyzing unchanged code on every run. The first run is slow because it builds this table.",
  },
  {
    question: "What does the spec `@spec divide(number(), number()) :: {:ok, float()} | {:error, String.t()}` tell you?",
    options: [
      { label: "The function always returns a float" },
      { label: "The function takes two numbers and returns either {:ok, float} or {:error, string}", correct: true },
      { label: "The function raises an error for invalid inputs" },
      { label: "The function can only accept integers" },
    ],
    explanation:
      "This spec says divide/2 takes two numbers (integer or float) and returns a union type: either a tuple {:ok, float()} on success or {:error, String.t()} on failure. This is a classic tagged-tuple return pattern documented with typespecs.",
  },
  {
    question: "Which of these is NOT a built-in type in Elixir typespecs?",
    options: [
      { label: "atom()" },
      { label: "map()" },
      { label: "string()", correct: true },
      { label: "boolean()" },
    ],
    explanation:
      "There is no built-in string() type in Elixir typespecs. Elixir strings are represented by String.t() or binary(). The type string() actually exists in Erlang's type system and refers to a list of characters (charlist), which can be confusing. Always use String.t() for Elixir strings.",
  },
  {
    question: "What is the purpose of @callback in Elixir?",
    options: [
      { label: "It defines a function that runs asynchronously" },
      { label: "It specifies function signatures that modules implementing a behaviour must provide", correct: true },
      { label: "It registers a function to be called on process exit" },
      { label: "It creates a typespec for anonymous functions" },
    ],
    explanation:
      "@callback defines the function signatures that any module implementing a behaviour must provide. It's similar to @spec but used inside behaviour definitions. Dialyzer can verify that implementing modules match the callback specs.",
  },
  {
    question: "What will Dialyzer do if a function has no @spec?",
    options: [
      { label: "Refuse to analyze the function" },
      { label: "Raise a compile-time error" },
      { label: "Infer the types automatically from the function body", correct: true },
      { label: "Assume all arguments and return values are any()" },
    ],
    explanation:
      "Dialyzer uses \"success typing\" — it infers types from the function's actual code even without specs. Adding @spec gives Dialyzer extra information to catch more issues and documents your intent. Specs are optional but recommended for public API functions.",
  },
  {
    question: "What does the type `keyword()` represent?",
    options: [
      { label: "A list of strings" },
      { label: "A list of {atom, any} tuples", correct: true },
      { label: "A map with atom keys" },
      { label: "A list of atoms" },
    ],
    explanation:
      "keyword() is shorthand for [{atom(), any()}] — a list of two-element tuples where the first element is an atom. You can also use keyword(value_type) to specify the value type, like keyword(integer()) for [{atom(), integer()}].",
  },
  {
    question: "What is \"success typing\" in the context of Dialyzer?",
    options: [
      { label: "Types that guarantee a function will succeed" },
      { label: "Dialyzer only reports errors when it can prove code will definitely fail", correct: true },
      { label: "A way to mark functions that never raise exceptions" },
      { label: "Types that are automatically applied to all functions" },
    ],
    explanation:
      "Success typing is Dialyzer's approach: it only reports warnings when it can prove that code will definitely fail or is unreachable. This means Dialyzer has no false positives (in theory), but it may miss some errors. It's optimistic — if there's any way the code could work, Dialyzer stays silent.",
  },
  {
    question: "How do you define a type for a map with specific keys in a typespec?",
    options: [
      { label: "%{name: String.t(), age: integer()}", correct: true },
      { label: "map(name: String.t(), age: integer())" },
      { label: "Map.t(name: String.t(), age: integer())" },
      { label: "{name: String.t(), age: integer()}" },
    ],
    explanation:
      "Map types with specific keys use the %{key: type} syntax, matching Elixir's map literal syntax. For structs, you can use %MyStruct{} to reference the struct's type. The generic map() type represents any map without key constraints.",
  },
  {
    question: "What is the type for a function that takes one argument in Elixir typespecs?",
    options: [
      { label: "fun/1" },
      { label: "(any() -> any())", correct: true },
      { label: "function(1)" },
      { label: "fn(any()) :: any()" },
    ],
    explanation:
      "Function types use the syntax (arg_types -> return_type). For example, (integer() -> String.t()) is a function taking an integer and returning a string. You can also use (... -> any()) for a function with any number of arguments.",
  },
  {
    question: "Which of the following is the correct way to define a @typep?",
    options: [
      { label: "@typep internal_state :: %{count: integer(), name: String.t()}", correct: true },
      { label: "@type private internal_state :: map()" },
      { label: "@private_type internal_state :: map()" },
      { label: "@typep is not valid Elixir syntax" },
    ],
    explanation:
      "@typep defines a private type that is only visible within the current module. The syntax is the same as @type but uses @typep instead. Other modules cannot reference private types in their own specs. This is useful for internal implementation details.",
  },
  {
    question: "What does `no_return()` mean in a typespec?",
    options: [
      { label: "The function returns nil" },
      { label: "The function always raises an exception or runs forever", correct: true },
      { label: "The function has no return value annotation" },
      { label: "The function returns :void" },
    ],
    explanation:
      "no_return() indicates a function that never returns normally — it either always raises an exception, calls System.halt(), or loops forever. Dialyzer uses this information to detect unreachable code after calls to such functions.",
  },
  {
    question: "Can Dialyzer catch all type errors in Elixir code?",
    options: [
      { label: "Yes, it catches every possible type error" },
      { label: "No — success typing means it only catches errors it can prove will definitely happen", correct: true },
      { label: "Yes, as long as every function has a @spec" },
      { label: "No, because Elixir doesn't have a type system" },
    ],
    explanation:
      "Dialyzer's success typing approach means it won't report a warning unless it can prove the code will definitely fail. This eliminates false positives but means some real bugs can slip through. It's a trade-off: fewer annoying false alarms, but not a complete type checker like you'd find in statically typed languages.",
  },
];

export default questions;
